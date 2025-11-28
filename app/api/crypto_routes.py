from flask import Blueprint, jsonify, request
from app.models import Crypto, db
from app.api.polygon.client import apiCall
from app.api.polygon import polygon_config
from app.api.coinbase_ws import get_price, ensure_running, get_bars
import time
from app.services.coinbase_candles import fetch_coinbase_candles



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
        cb_candles = None
        cb_ws_bars = None

        if polygon_config.API_KEY:
            try:
                poly_data = apiCall(symbol, span_days=days, multiplier=multiplier, timespan=timespan)
            except Exception as e:
                print(f"polygon fetch failed for {symbol}: {e}")

        # Coinbase candle fallback (public, limited depth)
        try:
            cb_candles = fetch_coinbase_candles(symbol, span_days=min(days, 7), multiplier=multiplier, timespan=timespan)
        except Exception as e:
            print(f"coinbase candles fetch failed for {symbol}: {e}")

        # Coinbase WS minute bars (aggregated locally)
        try:
            # Only include WS bars for minute-level requests
            if timespan.lower() == "minute":
                cb_ws_bars = get_bars(prod, limit=600)
        except Exception as e:
            print(f"coinbase ws bars fetch failed for {symbol}: {e}")

        aggs_map = {}

        if poly_data and poly_data.get("aggs"):
            for a in poly_data["aggs"]:
                aggs_map[a["timestamp"]] = a
        if cb_candles and cb_candles.get("aggs"):
            for a in cb_candles["aggs"]:
                aggs_map[a["timestamp"]] = a  # merge/overwrite with coinbase where available
        if cb_ws_bars:
            for a in cb_ws_bars:
                aggs_map[a["timestamp"]] = a

        if live_price is not None:
            # Only append a live candle if we are missing a very recent bar
            latest_ts = max(aggs_map.keys()) if aggs_map else 0
            now_ms = int(time.time() * 1000)
            if now_ms - latest_ts > 60_000:
                aggs_map[now_ms] = {
                    "timestamp": now_ms,
                    "open": live_price,
                    "close": live_price,
                    "high": live_price,
                    "low": live_price,
                    "volume": 0
                }

        if aggs_map:
            aggs_sorted = sorted(aggs_map.values(), key=lambda a: a["timestamp"])
            response = {
                "symbol": symbol.upper(),
                "data_points": len(aggs_sorted),
                "aggs": aggs_sorted,
                "open": [a["open"] for a in aggs_sorted],
                "closing": [a["close"] for a in aggs_sorted],
                "highs": [a["high"] for a in aggs_sorted],
                "lows": [a["low"] for a in aggs_sorted],
                "source": "+".join([s for s in [
                    "polygon" if poly_data and poly_data.get("aggs") else None,
                    "coinbase-candles" if cb_candles and cb_candles.get("aggs") else None,
                    "coinbase-ws" if cb_ws_bars else None,
                    "coinbase-live" if live_price is not None else None
                ] if s])
            }
            return jsonify(response)

        # If no aggregated data, try live tick only
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
                "source": "coinbase-live-only"
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
