from typing import Optional

from app.models import Portfolio
from app.services.pricing import get_latest_price, get_latest_prices


def _to_float(value) -> Optional[float]:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def build_portfolio_summary(portfolio: Portfolio):
    """Return portfolio with current valuations for stocks and cryptos."""
    if not portfolio:
        return None

    stock_symbols = [ps.stock.symbol for ps in portfolio.portfolio_stock]
    crypto_symbols = [pc.crypto.symbol for pc in portfolio.portfolio_crypto]
    price_map = {**get_latest_prices(stock_symbols), **get_latest_prices(crypto_symbols)}

    stocks = []
    for ps in portfolio.portfolio_stock:
        qty = _to_float(ps.quantity) or 0.0
        price = price_map.get(ps.stock.symbol.upper())
        value = price * qty if price is not None else None
        stocks.append({
            "id": ps.id,
            "symbol": ps.stock.symbol,
            "company": ps.stock.company,
            "quantity": qty,
            "price": price,
            "value": value,
        })

    cryptos = []
    for pc in portfolio.portfolio_crypto:
        qty = _to_float(pc.quantity) or 0.0
        price = price_map.get(pc.crypto.symbol.upper())
        value = price * qty if price is not None else None
        cryptos.append({
            "id": pc.id,
            "symbol": pc.crypto.symbol,
            "name": pc.crypto.company,
            "quantity": qty,
            "price": price,
            "value": value,
        })

    holdings_value = sum([item["value"] or 0 for item in stocks]) + \
        sum([item["value"] or 0 for item in cryptos])

    computed_total = (_to_float(portfolio.available_cash) or 0) + holdings_value

    return {
        "id": portfolio.id,
        "user_id": portfolio.user_id,
        "name": portfolio.name,
        "total_cash": computed_total,
        "available_cash": _to_float(portfolio.available_cash),
        "holdings_value": holdings_value,
        "total_value": computed_total,
        "stocks": stocks,
        "cryptos": cryptos,
    }
