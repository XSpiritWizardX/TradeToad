import json
import time
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from urllib import request, error

# Coinbase public candles API (exchange) is rate limited; this is a best-effort fallback.
# It returns arrays: [time, low, high, open, close, volume]

_SUPPORTED = {
    "minute": [1, 5, 15],
    "hour": [1, 6],
    "day": [1],
}

_GRANULARITY = {
    ("minute", 1): 60,
    ("minute", 5): 300,
    ("minute", 15): 900,
    ("hour", 1): 3600,
    ("hour", 6): 21600,
    ("day", 1): 86400,
}


def _align_timespan(timespan: str, multiplier: int) -> Optional[tuple]:
    ts = timespan.lower()
    if ts not in _SUPPORTED:
        return None
    allowed = _SUPPORTED[ts]
    if multiplier in allowed:
        return ts, multiplier
    # choose the closest allowed multiplier
    closest = min(allowed, key=lambda v: abs(v - multiplier))
    return ts, closest


def _granularity(timespan: str, multiplier: int) -> Optional[int]:
    return _GRANULARITY.get((timespan.lower(), multiplier))


def fetch_coinbase_candles(symbol: str, span_days: int = 2, multiplier: int = 1, timespan: str = "minute") -> Optional[Dict]:
    aligned = _align_timespan(timespan, multiplier)
    if not aligned:
        return None
    ts_aligned, mult_aligned = aligned
    gran = _granularity(ts_aligned, mult_aligned)
    if not gran:
        return None

    # Coinbase product format: BTC-USD, ETH-USD, etc.
    product = f"{symbol.upper()}-USD"

    # Compute start/end in ISO
    end_dt = datetime.now(timezone.utc)
    start_dt = end_dt - timedelta(days=span_days)
    params = f"start={start_dt.isoformat()}&end={end_dt.isoformat()}&granularity={gran}"
    url = f"https://api.exchange.coinbase.com/products/{product}/candles?{params}"

    try:
        req = request.Request(url, headers={"User-Agent": "tradetoad/1.0"})
        with request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            payload = json.loads(data.decode())
    except error.HTTPError as exc:
        print(f"coinbase candles http error for {symbol}: {exc}")
        return None
    except Exception as exc:
        print(f"coinbase candles fetch failed for {symbol}: {exc}")
        return None

    if not isinstance(payload, list):
        return None

    aggs: List[Dict] = []
    for entry in payload:
        if not isinstance(entry, list) or len(entry) < 5:
            continue
        ts_sec, low, high, open_, close, *rest = entry + [None] * (6 - len(entry))
        ts_ms = int(ts_sec) * 1000
        aggs.append({
            "timestamp": ts_ms,
            "open": float(open_),
            "close": float(close),
            "high": float(high),
            "low": float(low),
            "volume": float(rest[0]) if rest else 0,
        })

    aggs_sorted = sorted(aggs, key=lambda a: a["timestamp"])
    return {
        "symbol": symbol.upper(),
        "data_points": len(aggs_sorted),
        "aggs": aggs_sorted,
        "open": [a["open"] for a in aggs_sorted],
        "closing": [a["close"] for a in aggs_sorted],
        "highs": [a["high"] for a in aggs_sorted],
        "lows": [a["low"] for a in aggs_sorted],
        "source": "coinbase-candles",
        "timespan": ts_aligned,
        "multiplier": mult_aligned,
    }
