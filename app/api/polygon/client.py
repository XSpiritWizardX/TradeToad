from polygon import RESTClient
import polygon_config
# # to parse response
import json


client = RESTClient(polygon_config.API_KEY)

# aggregate data

def apiCall():
    aggs = []
    closing = []
    highs = []

    for a in client.list_aggs(
        "AAPL",
        1,
        "day",
        "2025-01-15",
        "2025-04-01",
        adjusted="true",
        sort="asc",
        limit=120,
    ):
        aggs.append(a)
        closingPrices = closing.append(a.close)
        highPrices = highs.append(a.high)
        # print(f'closingPrices: {closingPrices}\n')
        # print(f'highPrices: {highPrices}')
    return aggs, closing, highs

result = apiCall()
print(result)
print(f'\nnumber of results: {len(result)}\n')


# use code snippets later:

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