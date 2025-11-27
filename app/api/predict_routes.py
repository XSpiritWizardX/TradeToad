import math
from datetime import datetime, timezone
from statistics import mean

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.api.polygon.client import apiCall
from app.models import Portfolio, Portfolio_Crypto, Portfolio_Stock, Stock, Crypto

predict_routes = Blueprint("predict", __name__)


def _ema(series, span):
    if not series or span <= 1:
        return series[-1] if series else None
    k = 2 / (span + 1)
    ema_val = series[0]
    for price in series[1:]:
        ema_val = price * k + ema_val * (1 - k)
    return ema_val


@predict_routes.route("/<symbol>")
@login_required
def predict_symbol(symbol):
    """
    Lightweight heuristic predictor for a symbol.
    Returns next-price guess + action/sizing suggestion.
    """
    symbol = symbol.upper()
    days = request.args.get("days", default=120, type=int)

    try:
        data = apiCall(symbol, span_days=days, multiplier=1, timespan="day")
        closes = data.get("closing") or []
        highs = data.get("highs") or []
        lows = data.get("lows") or []
        if len(closes) < 5:
            return jsonify({"symbol": symbol, "error": "Not enough data"}), 400

        last_close = closes[-1]
        short_ema = _ema(closes[-20:], 12)
        long_ema = _ema(closes[-60:], 26)
        recent_range = max(highs[-20:]) - min(lows[-20:])
        avg_volatility = recent_range / 20 if recent_range else 0

        slope_window = closes[-20:]
        diffs = [slope_window[i + 1] - slope_window[i] for i in range(len(slope_window) - 1)]
        avg_slope = mean(diffs) if diffs else 0
        predicted = last_close + avg_slope

        signal = predicted - last_close
        action = "HOLD"
        if signal > max(0.001 * last_close, avg_volatility * 0.2):
            action = "BUY"
        elif signal < -max(0.001 * last_close, avg_volatility * 0.2):
            action = "SELL"

        confidence = min(0.99, max(0.05, abs(signal) / (abs(last_close) + 1e-6)))

        portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
        available_cash = float(portfolio.available_cash) if portfolio else 0.0

        # Determine current holdings for sizing
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

        return jsonify({
            "symbol": symbol,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "last_close": last_close,
            "predicted_close": predicted,
            "short_ema": short_ema,
            "long_ema": long_ema,
            "avg_volatility": avg_volatility,
            "suggested_action": action,
            "confidence": confidence,
            "suggested_shares": suggested_shares,
            "available_cash": available_cash,
            "quantity_owned": qty_owned,
        })
    except Exception as exc:
        print(f"prediction error for {symbol}: {exc}")
        return jsonify({"symbol": symbol, "error": "Prediction failed"}), 503
