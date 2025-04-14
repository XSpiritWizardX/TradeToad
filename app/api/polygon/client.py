from polygon import RESTClient
from . import polygon_config
# to parse response
import json

client = RESTClient(polygon_config.API_KEY)


def apiCall(symbol="AAPL"):
    aggs = []       # aggregate data
    closing = []
    highs = []
    lows = []

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
        closing.append(a.close)
        highs.append(a.high)
        lows.append(a.low)

    return {
        "symbol": symbol,
        "data_points": len(aggs),
        "closing": closing, 
        "highs": highs,
        "lows": lows,
        "aggs": aggs
    }


# This printout is for demo purposes,
# Only execute this code when running the file directly (not when imported)
if __name__ == "__main__":
    result = apiCall()
    # print(result["aggs"])   # use this to see keys in result dict. 
    print("\nAPI Call Result\n")
    print(f'Symbol: {result["symbol"]}\n')
    print(f'number of results: {result["data_points"]}')
    print(f'(showing first 50)\n')
    print(f'closing: {result["closing"][:50]}\n')
    print(f'highs: {result["highs"][:50]}\n')
    print(f'lows: {result["lows"][:50]}\n')





# use code snippets later?

# def prices(result):
#     closing = []
#     for a in result:
#         closing.append(a.close)
#     return closing

# closingPrices = prices(result)
# print(f'closingPrices: {closingPrices}\n')


# def prices(result):
#     highs = []
#     for a in result:
#         highs.append(a.high)
#     return highs

# highPrices = prices(result)
# print(f'highPrices: {highPrices}')