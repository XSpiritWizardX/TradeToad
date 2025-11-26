import time
from datetime import date, timedelta

from polygon import RESTClient

from . import polygon_config

# simple cache to store API responses
cache = {}
cache_expiry = {}
CACHE_DURATION = 60 * 15  # cache for 15 minutes


def _get_client():
    api_key = polygon_config.API_KEY
    if not api_key:
        raise RuntimeError("POLYGON_API_KEY is not set")
    return RESTClient(api_key)


def apiCall(symbol, days=90):
    """Fetch recent daily aggregates for a symbol with a short cache."""
    symbol = symbol.upper()
    crypto_usd = {"BTC", "ETH", "DOGE", "SOL", "XRP", "LTC", "ADA", "DOT", "AVAX", "BNB", "SHIB", "BCH", "USDC", "USDT"}
    api_symbol = f"X:{symbol}USD" if ":" not in symbol and symbol in crypto_usd else symbol
    cache_key = f"{api_symbol}:{days}"
    current_time = time.time()

    if cache_key in cache and current_time < cache_expiry.get(cache_key, 0):
        return cache[cache_key]

    end_date = date.today()
    start_date = end_date - timedelta(days=days)

    aggs = []
    opens = []
    closings = []
    highs = []
    lows = []

    client = _get_client()

    try:
        for a in client.list_aggs(
            api_symbol,
            1,
            "day",
            start_date.isoformat(),
            end_date.isoformat(),
            adjusted="true",
            sort="asc",
            limit=5000,
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
        cache_expiry[cache_key] = current_time + CACHE_DURATION

        return result

    except Exception as e:
        print(f'Error fetching data for {symbol}: {str(e)}')

        if cache_key in cache:
            print(f'Returning cached data for {symbol} despite error')
            return cache[cache_key]
        raise
