from polygon import RESTClient
import polygon_config
# # to parse response
import json


client = RESTClient(polygon_config.API_KEY)

# aggregate data

aggs = []
closing = []
highs = []

def apiCall():

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
        # closing = closing.append(a.close)
        closing.append(a.close)
        highs.append(a.high)
        # print(f'closing: {closing}\n')
        # print(f'highs: {highs}')
    # return aggs, closing, highs
    return 'done with API call:\n'

result = apiCall()

print(result)
print(aggs)
print(f'\nnumber of results: {len(aggs)}\n')
print(f'closing: {closing}\n')
print(f'highs: {highs}\n')





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