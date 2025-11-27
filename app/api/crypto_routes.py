from flask import Blueprint, jsonify, request
from app.models import Crypto, db
from app.api.polygon.client import apiCall
from app.api.polygon import polygon_config
from app.api.coinbase_ws import get_price, ensure_running
import time



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

    try:
        prod = f"{symbol.upper()}-USD"
        ensure_running({prod})
        live_price = get_price(prod)

        poly_data = None
        if polygon_config.API_KEY:
            try:
                poly_data = apiCall(symbol, span_days=days, multiplier=multiplier, timespan=timespan)
            except Exception as e:
                print(f"polygon fetch failed for {symbol}: {e}")

        if poly_data and poly_data.get("aggs"):
            # Use polygon bars, but overwrite the latest candle with live price if present
            aggs = list(poly_data["aggs"])
            if live_price is not None:
                now_ms = int(time.time() * 1000)
                # append a fresh candle at now_ms with live price so chart advances
                aggs.append({
                    "timestamp": now_ms,
                    "open": live_price,
                    "close": live_price,
                    "high": live_price,
                    "low": live_price,
                    "volume": 0
                })
            aggs_sorted = sorted(aggs, key=lambda a: a["timestamp"])
            response = {
                "symbol": symbol.upper(),
                "data_points": len(aggs_sorted),
                "aggs": aggs_sorted,
                "open": [a["open"] for a in aggs_sorted],
                "closing": [a["close"] for a in aggs_sorted],
                "highs": [a["high"] for a in aggs_sorted],
                "lows": [a["low"] for a in aggs_sorted],
                "source": "coinbase+polygon" if live_price is not None else "polygon"
            }
            return jsonify(response)

        # If no polygon data, fall back to live tick only
        if live_price is not None:
            now_ms = int(time.time() * 1000)
            live_payload = {
                "symbol": symbol.upper(),
                "data_points": 1,
                "open": [live_price],
                "closing": [live_price],
                "highs": [live_price],
                "lows": [live_price],
                "aggs": [{
                    "timestamp": now_ms,
                    "open": live_price,
                    "close": live_price,
                    "high": live_price,
                    "low": live_price,
                    "volume": 0
                }],
                "source": "coinbase-live"
            }
            return jsonify(live_payload)

        # No data at all
        return jsonify({"symbol": symbol.upper(), "data_points": 0, "open": [], "closing": [], "highs": [], "lows": [], "aggs": [], "source": "empty"}), 503
    except Exception as exc:
        print(f"get_crypto error for {symbol}: {exc}")
        if timespan != "day" or multiplier != 1:
            try:
                fallback = apiCall(symbol, span_days=days, multiplier=1, timespan="day")
                return jsonify({**fallback, "fallback": True})
            except Exception as exc2:
                print(f"get_crypto fallback error for {symbol}: {exc2}")
        # Last-resort: try Coinbase live price so the UI doesn't break
        try:
            prod = f"{symbol.upper()}-USD"
            ensure_running({prod})
            live_price = get_price(prod)
            now_ms = int(time.time() * 1000)
            # If we have any live price, return a minimal 1-point series
            if live_price is not None:
                fallback_payload = {
                    "symbol": symbol.upper(),
                    "data_points": 1,
                    "open": [live_price],
                    "closing": [live_price],
                    "highs": [live_price],
                    "lows": [live_price],
                    "aggs": [{
                        "timestamp": now_ms,
                        "open": live_price,
                        "close": live_price,
                        "high": live_price,
                        "low": live_price,
                        "volume": 0
                    }],
                    "source": "coinbase-fallback"
                }
                return jsonify(fallback_payload)
            # If no live price yet, return a soft placeholder so UI doesn't break
            fallback_payload = {
                "symbol": symbol.upper(),
                "data_points": 0,
                "open": [],
                "closing": [],
                "highs": [],
                "lows": [],
                "aggs": [],
                "source": "empty-fallback"
            }
            return jsonify(fallback_payload)
        except Exception as exc3:
            print(f"coinbase fallback error for {symbol}: {exc3}")
        return jsonify({"error": "Upstream data unavailable"}), 503
