from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.api.polygon.client import apiCall
from app.models import Portfolio, Portfolio_Crypto, Portfolio_Stock, Stock, Crypto, PredictionSignal, db
from app.services.ml_predictor import (
    predict_symbol_close,
    predict_symbol_live,
    train_symbol_model,
)

predict_routes = Blueprint("predict", __name__)


@predict_routes.route("/<symbol>")
@login_required
def predict_symbol(symbol):
    """
    ML-backed predictor for a symbol with sizing suggestions.
    """
    symbol = symbol.upper()
    days = request.args.get("days", default=180, type=int)

    try:
        # Train/inference model-based prediction (daily bars)
        prediction = predict_symbol_close(symbol, span_days=days)
        if prediction.get("error"):
            return jsonify({"symbol": symbol, "error": prediction["error"]}), 400

        # Pull recent range for sizing/volatility context
        data = apiCall(symbol, span_days=30, multiplier=1, timespan="day")
        closes = data.get("closing") or []
        highs = data.get("highs") or []
        lows = data.get("lows") or []
        recent_range = max(highs[-20:], default=0) - min(lows[-20:], default=0)
        avg_volatility = recent_range / 20 if recent_range else 0

        last_close = prediction.get("last_close") or (closes[-1] if closes else None)
        predicted = prediction.get("predicted_close")
        if last_close is None or predicted is None:
            return jsonify({"symbol": symbol, "error": "Prediction unavailable"}), 400

        signal = predicted - last_close
        action = "HOLD"
        if signal > max(0.003 * last_close, avg_volatility * 0.2):
            action = "BUY"
        elif signal < -max(0.003 * last_close, avg_volatility * 0.2):
            action = "SELL"

        confidence = prediction.get("confidence") or min(0.99, max(0.05, abs(signal) / (abs(last_close) + 1e-6)))

        portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
        available_cash = float(portfolio.available_cash) if portfolio else 0.0

        stock = Stock.query.filter_by(symbol=symbol).first()
        crypto = Crypto.query.filter_by(symbol=symbol).first()
        qty_owned = 0.0
        if portfolio:
            if stock:
                holding = Portfolio_Stock.query.filter_by(portfolio_id=portfolio.id, stock_id=stock.id).first()
                qty_owned = float(holding.quantity) if holding else 0.0
            if crypto and qty_owned == 0.0:
                holding = Portfolio_Crypto.query.filter_by(portfolio_id=portfolio.id, crypto_id=crypto.id).first()
                qty_owned = float(holding.quantity) if holding else 0.0

        suggested_shares = 0.0
        if action == "BUY" and last_close > 0:
            suggested_shares = round((available_cash * 0.25) / last_close, 4)
        elif action == "SELL":
            suggested_shares = round(qty_owned * 0.5, 4)

        response_payload = {
            "symbol": symbol,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "last_close": last_close,
            "predicted_close": predicted,
            "avg_volatility": avg_volatility,
            "suggested_action": action,
            "confidence": confidence,
            "suggested_shares": suggested_shares,
            "available_cash": available_cash,
            "quantity_owned": qty_owned,
            "model_used": prediction.get("model_used"),
            "mae": prediction.get("mae"),
        }
        _persist_signal(symbol, response_payload, timespan="day", multiplier=1, span_days=days)
        return jsonify(response_payload)
    except Exception as exc:
        print(f"prediction error for {symbol}: {exc}")
        return jsonify({"symbol": symbol, "error": "Prediction failed"}), 503


@predict_routes.route("/<symbol>/train", methods=["POST"])
@login_required
def train_symbol(symbol):
    """Train a per-symbol ML model on recent daily bars."""
    days = request.args.get("days", default=365, type=int)
    try:
        result = train_symbol_model(symbol, span_days=days)
        return jsonify(result)
    except Exception as exc:
        print(f"train error for {symbol}: {exc}")
        return jsonify({"symbol": symbol.upper(), "error": str(exc)}), 400


@predict_routes.route("/<symbol>/forecast")
@login_required
def forecast_symbol(symbol):
    """Get the next-day forecast without portfolio sizing."""
    days = request.args.get("days", default=180, type=int)
    try:
        result = predict_symbol_close(symbol, span_days=days)
        status = 200 if not result.get("error") else 400
        if status == 200:
            _persist_signal(symbol, result, timespan="day", multiplier=1, span_days=days)
        return jsonify(result), status
    except Exception as exc:
        print(f"forecast error for {symbol}: {exc}")
        return jsonify({"symbol": symbol.upper(), "error": "Forecast failed"}), 503


@predict_routes.route("/<symbol>/live")
@login_required
def live_symbol(symbol):
    """
    Live-ish intraday prediction (uses trained daily model on intraday bars).
    """
    span_days = request.args.get("span_days", default=2, type=int)
    multiplier = request.args.get("multiplier", default=5, type=int)
    timespan = request.args.get("timespan", default="minute", type=str)
    try:
        result = predict_symbol_live(symbol, span_days=span_days, multiplier=multiplier, timespan=timespan)
        status = 200 if not result.get("error") else 400
        if status == 200:
            _persist_signal(symbol, result, timespan=timespan, multiplier=multiplier, span_days=span_days)
        return jsonify(result), status
    except Exception as exc:
        print(f"live prediction error for {symbol}: {exc}")
        return jsonify({"symbol": symbol.upper(), "error": "Live prediction failed"}), 503


def _persist_signal(symbol, payload, timespan="day", multiplier=1, span_days=None):
    """Persist the latest prediction signal for later model training/analytics."""
    try:
        ts_raw = payload.get("timestamp")
        predicted_for = None
        if ts_raw:
            try:
                predicted_for = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))
            except Exception:
                predicted_for = None

        sig = PredictionSignal(
            symbol=symbol.upper(),
            predicted_for=predicted_for,
            timespan=timespan,
            multiplier=multiplier,
            span_days=span_days,
            action=payload.get("suggested_action") or payload.get("action"),
            confidence=payload.get("confidence"),
            predicted_price=payload.get("predicted_close") or payload.get("predicted_price"),
            last_price=payload.get("last_close") or payload.get("last_price"),
            mae=payload.get("mae"),
            model_used=payload.get("model_used"),
        )
        db.session.add(sig)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        print(f"signal persist failed for {symbol}: {exc}")
