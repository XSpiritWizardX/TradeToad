import time
from typing import Dict, Iterable

from app.api.polygon.client import apiCall

# Short in-process cache for latest price lookups separate from aggregate cache
_latest_cache: Dict[str, Dict] = {}
_latest_expiry: Dict[str, float] = {}
_LATEST_TTL = 60  # seconds


def get_latest_price(symbol: str) -> float:
    """Return the latest close price for a symbol, using cached aggregates."""
    now = time.time()
    symbol = symbol.upper()

    if symbol in _latest_cache and now < _latest_expiry.get(symbol, 0):
        return _latest_cache[symbol]["price"]

    price = None
    try:
        data = apiCall(symbol, days=5)
        closings = data.get("closing") or []
        price = closings[-1] if closings else None
    except Exception as exc:
        # Network/offline errors shouldn't bring down the request pipeline
        print(f"latest price fetch failed for {symbol}: {exc}")

    _latest_cache[symbol] = {"price": price}
    _latest_expiry[symbol] = now + _LATEST_TTL
    return price


def get_latest_prices(symbols: Iterable[str]) -> Dict[str, float]:
    """Fetch latest prices for a collection of symbols."""
    prices = {}
    for symbol in symbols:
        prices[symbol.upper()] = get_latest_price(symbol)
    return prices
