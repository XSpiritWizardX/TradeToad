from polygon import RESTClient
from . import polygon_config
import time
# to parse response
import json


client = RESTClient(polygon_config.API_KEY)

# simple cache to store API responses
cache = {}
cache_expiry = {}
CACHE_DURATION = 3600  # cache for 1 hour


def apiCall(symbol):
    # clear cache if needed for testing fresh API calls:
    # cache.clear()
    # cache_expiry.clear()

    symbol = symbol.upper()
    current_time = time.time()
    print(f"Current time: {current_time}")
    if symbol in cache:
        print(f"Cache expiry for {symbol}: {cache_expiry.get(symbol, 0)}")
        print(f"Time until expiry: {cache_expiry.get(symbol, 0) - current_time} seconds")

    # check if we have a cached response that's still valid
    if symbol in cache and current_time < cache_expiry.get(symbol, 0):
        print(f'Using cached data for {symbol}')
        return cache[symbol]

    # if no cache is found, make an API call
    print(f'Making new API call for {symbol}')

    # create local variables
    aggs = []       # aggregate data
    open = []
    closing = []
    highs = []
    lows = []

    try:
        for a in client.list_aggs(
            symbol,
            1,
            "day",
            "2025-01-15",
            "2025-04-01",
            adjusted="true",
            sort="asc",
            limit=5000,
        ):
            aggs.append(a)
            open.append(a.open)
            closing.append(a.close)
            highs.append(a.high)
            lows.append(a.low)

        result = {
            "symbol": symbol,
            "data_points": len(aggs),
            "open": open,
            "closing": closing,
            "highs": highs,
            "lows": lows,
            "aggs": aggs
        }

        # cache the result
        cache[symbol] = result
        cache_expiry[symbol] = current_time + CACHE_DURATION

        return result

    except Exception as e:
        print(f'Error fetching data for {symbol}: {str(e)}')

        # if we have cached data, return it even if expired
        if symbol in cache:
            print(f'Returning expired cached data for {symbol}')
            return cache[symbol]
        raise



# This printout is for demo purposes,
# Only execute this code when running the file directly (not when imported)
if __name__ == "__main__":
    result = apiCall()
    # print(result["aggs"])   # use this to see keys in result dict.
    print("\nAPI Call Result\n")
    print(f'Symbol: {result["symbol"]}\n')
    print(f'number of results: {result["data_points"]}')
    print(f'(showing first 50)\n')
    print(f'open: {result["open"][:50]}\n')
    print(f'closing: {result["closing"][:50]}\n')
    print(f'highs: {result["highs"][:50]}\n')
    print(f'lows: {result["lows"][:50]}\n')
