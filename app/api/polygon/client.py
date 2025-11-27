import time
from datetime import date, timedelta

from polygon import RESTClient

from . import polygon_config

# simple cache to store API responses
CACHE_DEFAULT = 60 * 15  # seconds
cache = {}
cache_expiry = {}
CACHE_DURATION = 60 * 15  # cache for 15 minutes


def _get_client():
    api_key = polygon_config.API_KEY
    if not api_key:
        raise RuntimeError("POLYGON_API_KEY is not set")
    return RESTClient(api_key)


def _cache_ttl(span_days, multiplier, timespan):
    """Shorter cache for intraday so UI can feel live."""
    ts = timespan.lower()
    if ts in {"minute", "hour"} or span_days <= 2:
        return 10  # 10 seconds for near-live charts
    if span_days <= 7:
        return 120  # 2 minutes
    return CACHE_DEFAULT


def apiCall(symbol, span_days=90, multiplier=1, timespan="day"):
    """Fetch recent aggregates with configurable resolution."""
    symbol = symbol.upper()
    timespan = timespan.lower()
    crypto_usd = {"BTC", "ETH", "DOGE", "SOL", "XRP", "LTC", "ADA", "DOT", "AVAX", "BNB", "SHIB", "BCH", "USDC", "USDT"}
    api_symbol = f"X:{symbol}USD" if ":" not in symbol and symbol in crypto_usd else symbol
    cache_key = f"{api_symbol}:{span_days}:{multiplier}:{timespan}"
    current_time = time.time()

    ttl = _cache_ttl(span_days, multiplier, timespan)

    if cache_key in cache and current_time < cache_expiry.get(cache_key, 0):
        return cache[cache_key]

    end_date = date.today()
    start_date = end_date - timedelta(days=span_days)

    aggs = []
    opens = []
    closings = []
    highs = []
    lows = []

    client = _get_client()

    try:
        for a in client.list_aggs(
            api_symbol,
            multiplier,
            timespan,
            start_date.isoformat(),
            end_date.isoformat(),
            adjusted="true",
            sort="asc",
            limit=50000,
        ):
            aggs.append({
                "timestamp": a.timestamp,
                "open": a.open,
                "close": a.close,
                "high": a.high,
                "low": a.low,
                "volume": a.volume,
            })
            opens.append(a.open)
            closings.append(a.close)
            highs.append(a.high)
            lows.append(a.low)

        result = {
            "symbol": symbol,
            "data_points": len(aggs),
            "open": opens,
            "closing": closings,
            "highs": highs,
            "lows": lows,
            "aggs": aggs
        }

        cache[cache_key] = result
        cache_expiry[cache_key] = current_time + ttl

        return result

    except Exception as e:
        print(f'Error fetching data for {symbol}: {str(e)}')

        if cache_key in cache:
            print(f'Returning cached data for {symbol} despite error')
            return cache[cache_key]
        raise
