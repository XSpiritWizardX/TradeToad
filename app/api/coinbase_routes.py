from flask import Blueprint, jsonify

from app.api.polygon.client import apiCall

from .coinbase_ws import ensure_running, get_price, get_ts, last_log, price_cache, get_bars

coinbase_routes = Blueprint("coinbase_routes", __name__, url_prefix="/api/coinbase")


@coinbase_routes.route("/price/<symbol>")
def live_price(symbol):
    """
    Get the latest cached Coinbase ticker price for a crypto symbol (USD pair).
    """
    product = f"{symbol.upper()}-USD"
    ensure_running({product})
    price = get_price(product)
    ts = get_ts(product)
    # If we have not received a tick yet, try to seed with polygon so UI isn't empty.
    if price is None:
        try:
            poly = apiCall(symbol.upper(), span_days=1, multiplier=5, timespan="minute")
            last = None
            if poly and poly.get("closing"):
                last = poly["closing"][-1]
            return jsonify({
                "symbol": symbol.upper(),
                "price": last,
                "time": ts,
                "source": "coinbase-fallback-polygon",
                "ready": last is not None
            })
        except Exception:
            pass
    return jsonify({
        "symbol": symbol.upper(),
        "price": price,
        "time": ts,
        "source": "coinbase",
        "ready": price is not None
    })


@coinbase_routes.route("/status")
def ws_status():
    """Expose basic WS status for debugging."""
    return jsonify({
        "last_event": last_log.get("event"),
        "last_event_time": last_log.get("time"),
        "last_error": last_log.get("error"),
        "cached_symbols": list({k for k, v in price_cache.items() if v is not None}),
    })
