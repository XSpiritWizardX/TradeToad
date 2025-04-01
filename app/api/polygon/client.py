from polygon import RESTClient
import polygon_config
# to parse response
import json
from typing import cast
from urllib import HTTPResponse

client = RESTClient(polygon_config.API_KEY)

# aggregate data
aggs = cast(
    HTTPResponse,
    client.get_aggs(
        'AAPL',
        1,
        'day'
    )
)
# TO BE CONT.