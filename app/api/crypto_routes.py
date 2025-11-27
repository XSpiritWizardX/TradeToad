from flask import Blueprint, jsonify, request
from app.models import Crypto, db
from app.api.polygon.client import apiCall
from app.api.polygon import polygon_config



crypto_routes = Blueprint('cryptos', __name__, "")





# works good
@crypto_routes.route('/')
def get_cryptos():
    """
    Get all cryptos.
    """
    cryptos = Crypto.query.all()
    return jsonify({'cryptos': [crypto.to_dict() for crypto in cryptos]})





# This becomes /api/cryptos/<symbol>
@crypto_routes.route('/<symbol>')
def get_crypto(symbol):
    """
    Get crypto prices by crypto symbol.
    """
    days = request.args.get('days', default=90, type=int)
    multiplier = request.args.get('multiplier', default=1, type=int)
    timespan = request.args.get('timespan', default="day", type=str)

    if not polygon_config.API_KEY:
        return jsonify({"error": "Polygon API key missing"}), 503

    try:
        result = apiCall(symbol, span_days=days, multiplier=multiplier, timespan=timespan)
        return jsonify(result)
    except Exception as exc:
        print(f"get_crypto error for {symbol}: {exc}")
        if timespan != "day" or multiplier != 1:
            try:
                fallback = apiCall(symbol, span_days=days, multiplier=1, timespan="day")
                return jsonify({**fallback, "fallback": True})
            except Exception as exc2:
                print(f"get_crypto fallback error for {symbol}: {exc2}")
        return jsonify({"error": "Upstream data unavailable"}), 503
