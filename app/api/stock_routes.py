from flask import Blueprint, jsonify, request
from app.models import Stock, db
from app.api.polygon.client import apiCall


stock_routes = Blueprint('stocks', __name__, "")


# works good
@stock_routes.route('/')
def get_stocks():
    """
    Get all stocks.
    """
    stocks = Stock.query.all()
    return jsonify({'stocks': [stock.to_dict() for stock in stocks]})


# This becomes /api/stocks/<symbol>
@stock_routes.route('/<symbol>')
def get_stock(symbol):
    """
    Get stock prices by stock symbol.
    """
    days = request.args.get('days', default=90, type=int)
    result = apiCall(symbol, days=days)
    return jsonify(result)
    # return jsonify({'stocks': [stock.to_dict() for stock in stocks]})


@stock_routes.route('/<symbol>/predict')
def predict_stock(symbol):
    """
    Naive prediction stub: projects next close based on last N closes.
    """
    try:
        data = apiCall(symbol, days=30)
        closes = data.get("closing") or []
        if len(closes) < 2:
            return jsonify({"symbol": symbol.upper(), "predicted_close": None, "trend": 0})
        # simple slope of last 5 points (or fewer if limited)
        window = closes[-5:]
        diffs = [window[i+1] - window[i] for i in range(len(window)-1)]
        avg_slope = sum(diffs) / len(diffs)
        predicted = window[-1] + avg_slope
        trend_score = avg_slope / window[-1] if window[-1] else 0
        return jsonify({"symbol": symbol.upper(), "predicted_close": predicted, "trend": trend_score})
    except Exception as exc:
        print(f"prediction error for {symbol}: {exc}")
        return jsonify({"symbol": symbol.upper(), "predicted_close": None, "trend": 0}), 503
