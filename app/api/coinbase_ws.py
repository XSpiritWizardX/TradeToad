import asyncio
import json
import threading
import time
from collections import defaultdict
from datetime import datetime, timezone

COINBASE_WS = "wss://advanced-trade-ws.coinbase.com"

price_cache = defaultdict(lambda: None)
ts_cache = defaultdict(lambda: None)
current_bar = {}
bars_cache = defaultdict(list)  # per product_id -> list of minute bars
_subscriptions = set()
_loop = None
_thread = None
_resubscribe = None
_lock = threading.Lock()
_runner_started = False
last_log = {"event": None, "time": None, "error": None}


def _start_loop():
    global _loop, _thread, _resubscribe, _runner_started
    if _loop:
        return
    _loop = asyncio.new_event_loop()

    def _run():
        global _resubscribe
        asyncio.set_event_loop(_loop)
        _resubscribe = asyncio.Event()
        _loop.run_forever()

    _thread = threading.Thread(target=_run, name="coinbase-ws-loop", daemon=True)
    _thread.start()
    # kick off with a small default set so we always have a connection
    with _lock:
        _subscriptions.update({"BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD", "XRP-USD"})
    asyncio.run_coroutine_threadsafe(_run_socket(), _loop)
    _runner_started = True


async def _run_socket():
    while True:
        products = sorted(_subscriptions) or ["BTC-USD"]
        try:
            import websockets

            async with websockets.connect(COINBASE_WS, ping_interval=20, ping_timeout=20) as ws:
                last_log["event"] = f"connected:{products}"
                last_log["time"] = time.time()
                sub_msg = {
                    "type": "subscribe",
                    "channel": "ticker",
                    "product_ids": products,
                }
                await ws.send(json.dumps(sub_msg))
                async for raw in ws:
                    if _resubscribe.is_set():
                        _resubscribe.clear()
                        last_log["event"] = "resubscribe"
                        last_log["time"] = time.time()
                        break
                    try:
                        data = json.loads(raw)
                    except Exception:
                        continue
                    if data.get("channel") != "ticker":
                        continue
                    for event in data.get("events", []):
                        for tick in event.get("tickers", []):
                            pid = tick.get("product_id")
                            price = tick.get("price")
                            if pid and price is not None:
                                try:
                                    price_cache[pid] = float(price)
                                except Exception:
                                    continue
                                parsed_ts = _parse_ts(tick.get("time"))
                                ts_cache[pid] = parsed_ts
                                _update_bar(pid, price, parsed_ts)
                                last_log["event"] = f"tick:{pid}"
                                last_log["time"] = time.time()
                await asyncio.sleep(0.1)
        except Exception as e:
            last_log["error"] = f"dial_error:{e}"
            await asyncio.sleep(2)
            continue


def ensure_running(products=None):
    """Ensure background Coinbase WS consumer is running and subscribed."""
    _start_loop()
    updated = False
    if products:
        with _lock:
            for p in products:
                if p not in _subscriptions:
                    _subscriptions.add(p)
                    updated = True
    if updated and _resubscribe:
        _loop.call_soon_threadsafe(_resubscribe.set)


def get_price(symbol):
    """Return the latest cached price for a product id (e.g., BTC-USD)."""
    ensure_running({symbol})
    return price_cache.get(symbol)


def get_ts(symbol):
    return ts_cache.get(symbol)


def _parse_ts(ts):
    if ts is None:
        return int(time.time() * 1000)
    if isinstance(ts, (int, float)):
        return int(ts)
    try:
        return int(datetime.fromisoformat(str(ts).replace("Z", "+00:00")).timestamp() * 1000)
    except Exception:
        return int(time.time() * 1000)


def _update_bar(product, price, ts):
    try:
        val = float(price)
    except Exception:
        return
    ms = _parse_ts(ts)
    minute_ms = ms - (ms % 60000)
    bar = current_bar.get(product)
    if not bar or bar["minute"] != minute_ms:
        if bar:
            bars_cache[product].append(bar)
            if len(bars_cache[product]) > 360:
                bars_cache[product] = bars_cache[product][-360:]
        bar = {
            "minute": minute_ms,
            "timestamp": minute_ms,
            "open": val,
            "close": val,
            "high": val,
            "low": val,
            "volume": 0
        }
        current_bar[product] = bar
    else:
        bar["close"] = val
        bar["high"] = max(bar["high"], val)
        bar["low"] = min(bar["low"], val)


def get_bars(product, limit=120):
    ensure_running({product})
    bars = list(bars_cache.get(product) or [])
    if product in current_bar:
        bars.append(current_bar[product])
    bars = sorted(bars, key=lambda b: b["timestamp"])
    if len(bars) > limit:
        bars = bars[-limit:]
    return bars
