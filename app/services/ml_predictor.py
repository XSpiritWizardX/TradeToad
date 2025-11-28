import math
import os
import time
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.ensemble import RandomForestRegressor
from flask import current_app

from app.api.polygon.client import apiCall

# Directory inside instance/ where trained models are stored
MODEL_SUBDIR = "models"


def _get_model_dir() -> str:
    """Return the directory path for stored models, creating it if needed."""
    try:
        base = current_app.instance_path  # type: ignore[attr-defined]
    except RuntimeError:
        base = None

    if not base:
        # Fallback for scripts/background jobs
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "instance"))

    model_dir = os.path.join(base, MODEL_SUBDIR)
    os.makedirs(model_dir, exist_ok=True)
    return model_dir


def _model_path(symbol: str) -> str:
    return os.path.join(_get_model_dir(), f"{symbol.upper()}_rf.joblib")


def _rsi(series: pd.Series, window: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window=window).mean()
    loss = -delta.clip(upper=0).rolling(window=window).mean()
    rs = gain / (loss + 1e-9)
    return 100 - (100 / (1 + rs))


def _build_feature_frame(aggs: List[Dict]) -> pd.DataFrame:
    """Construct a feature frame from aggregate bars."""
    rows = []
    for a in aggs:
        if a.get("close") is None:
            continue
        rows.append({
            "close": float(a.get("close")),
            "high": float(a.get("high") or a.get("close")),
            "low": float(a.get("low") or a.get("close")),
            "volume": float(a.get("volume") or 0),
        })

    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows)
    df["return_1"] = df["close"].pct_change(1)
    df["return_5"] = df["close"].pct_change(5)
    df["return_10"] = df["close"].pct_change(10)
    df["volatility_5"] = df["return_1"].rolling(window=5).std()
    df["volatility_10"] = df["return_1"].rolling(window=10).std()
    df["ema_5"] = df["close"].ewm(span=5, adjust=False).mean()
    df["ema_10"] = df["close"].ewm(span=10, adjust=False).mean()
    df["ema_20"] = df["close"].ewm(span=20, adjust=False).mean()
    df["volume_ma_5"] = df["volume"].rolling(window=5).mean()
    df["volume_ma_20"] = df["volume"].rolling(window=20).mean()
    df["rsi_14"] = _rsi(df["close"], window=14)
    df["target"] = df["close"].shift(-1)
    return df


def _coerce_aggs(data: Dict) -> List[Dict]:
    """Convert polygon client response to a list of agg dicts."""
    aggs = data.get("aggs") or []
    if aggs:
        return aggs

    closes = data.get("closing") or []
    highs = data.get("highs") or closes
    lows = data.get("lows") or closes
    length = min(len(closes), len(highs), len(lows))
    fallback = []
    for i in range(length):
        fallback.append({
            "close": closes[i],
            "high": highs[i],
            "low": lows[i],
            "volume": 0,
        })
    return fallback


def _load_model(symbol: str) -> Optional[Dict]:
    path = _model_path(symbol)
    if not os.path.exists(path):
        return None
    try:
        return load(path)
    except Exception as exc:
        print(f"Failed to load model for {symbol}: {exc}")
        return None


def _save_model(symbol: str, payload: Dict):
    dump(payload, _model_path(symbol))


def _clean_frame(df: pd.DataFrame, feature_cols: List[str]) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], np.nan)
    return df.dropna(subset=feature_cols + ["target"])


def _split_train_test(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    split_idx = max(int(len(df) * 0.8), len(df) - 10)
    return df.iloc[:split_idx], df.iloc[split_idx:]


def _direction_confidence(predicted: float, last_close: float, mae: float) -> float:
    if not last_close or mae is None:
        return 0.5
    signal = predicted - last_close
    scaled = signal / (mae + 1e-6)
    prob = 1 / (1 + math.exp(-scaled))
    return max(0.05, min(0.99, prob))


def _simple_projection(closes: List[float], lookback: int = 5) -> Tuple[Optional[float], float]:
    if not closes or len(closes) < 2:
        return None, 0.0
    window = closes[-lookback:] if len(closes) >= lookback else closes
    diffs = [window[i + 1] - window[i] for i in range(len(window) - 1)]
    avg_slope = sum(diffs) / len(diffs)
    predicted = window[-1] + avg_slope
    trend = avg_slope / window[-1] if window[-1] else 0.0
    return predicted, trend


def train_symbol_model(symbol: str, span_days: int = 365) -> Dict:
    symbol = symbol.upper()
    data = apiCall(symbol, span_days=span_days, multiplier=1, timespan="day")
    aggs = _coerce_aggs(data)
    feature_df = _build_feature_frame(aggs)
    feature_cols = [c for c in feature_df.columns if c != "target"]
    clean_df = _clean_frame(feature_df, feature_cols)

    if len(clean_df) < 30:
        raise ValueError("Not enough history to train model (need >= 30 bars)")

    train_df, test_df = _split_train_test(clean_df)
    X_train, y_train = train_df[feature_cols], train_df["target"]
    model = RandomForestRegressor(
        n_estimators=220,
        max_depth=8,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    mae = None
    if len(test_df):
        preds = model.predict(test_df[feature_cols])
        mae = float(np.mean(np.abs(preds - test_df["target"])))

    payload = {
        "model": model,
        "feature_columns": feature_cols,
        "metadata": {
            "symbol": symbol,
            "trained_at": time.time(),
            "span_days": span_days,
            "samples": len(clean_df),
            "mae": mae,
        },
    }
    _save_model(symbol, payload)

    return {
        "symbol": symbol,
        "trained_samples": len(clean_df),
        "mae": mae,
        "last_close": float(clean_df["close"].iloc[-1]),
        "model_path": _model_path(symbol),
    }


def predict_symbol_close(symbol: str, span_days: int = 180) -> Dict:
    """Predict next-day close using trained model; fall back to slope heuristic."""
    symbol = symbol.upper()
    model_payload = _load_model(symbol)
    data = apiCall(symbol, span_days=span_days, multiplier=1, timespan="day")
    aggs = _coerce_aggs(data)
    feature_df = _build_feature_frame(aggs)
    feature_cols = model_payload["feature_columns"] if model_payload else [c for c in feature_df.columns if c != "target"]
    clean_df = _clean_frame(feature_df, feature_cols)

    if clean_df.empty:
        return {"symbol": symbol, "error": "No data"}

    last_close = float(clean_df["close"].iloc[-1])
    mae = model_payload["metadata"].get("mae") if model_payload else None

    if model_payload:
        model = model_payload["model"]
        feature_row = clean_df[feature_cols].iloc[[-1]]
        predicted = float(model.predict(feature_row)[0])
        confidence = _direction_confidence(predicted, last_close, mae or abs(predicted - last_close))
        return {
            "symbol": symbol,
            "predicted_close": predicted,
            "last_close": last_close,
            "confidence": confidence,
            "model_used": True,
            "mae": mae,
        }

    # Fallback to simple slope
    predicted, trend = _simple_projection(list(clean_df["close"].values))
    return {
        "symbol": symbol,
        "predicted_close": predicted,
        "last_close": last_close,
        "trend": trend,
        "model_used": False,
    }


def predict_symbol_live(symbol: str, span_days: int = 2, multiplier: int = 5, timespan: str = "minute") -> Dict:
    """Predict near-term price using intraday bars and trained model."""
    symbol = symbol.upper()
    model_payload = _load_model(symbol)
    data = apiCall(symbol, span_days=span_days, multiplier=multiplier, timespan=timespan)
    aggs = _coerce_aggs(data)
    feature_df = _build_feature_frame(aggs)
    feature_cols = model_payload["feature_columns"] if model_payload else [c for c in feature_df.columns if c != "target"]
    clean_df = feature_df.replace([np.inf, -np.inf], np.nan).dropna(subset=feature_cols)

    if clean_df.empty:
        return {"symbol": symbol, "error": "No intraday data"}

    last_close = float(clean_df["close"].iloc[-1])
    mae = model_payload["metadata"].get("mae") if model_payload else None

    if model_payload:
        model = model_payload["model"]
        feature_row = clean_df[feature_cols].iloc[[-1]]
        predicted = float(model.predict(feature_row)[0])
        confidence = _direction_confidence(predicted, last_close, mae or abs(predicted - last_close))
        return {
            "symbol": symbol,
            "predicted_price": predicted,
            "last_price": last_close,
            "confidence": confidence,
            "model_used": True,
            "mae": mae,
            "timespan": timespan,
            "multiplier": multiplier,
        }

    predicted, trend = _simple_projection(list(clean_df["close"].values))
    return {
        "symbol": symbol,
        "predicted_price": predicted,
        "last_price": last_close,
        "trend": trend,
        "model_used": False,
        "timespan": timespan,
        "multiplier": multiplier,
    }
