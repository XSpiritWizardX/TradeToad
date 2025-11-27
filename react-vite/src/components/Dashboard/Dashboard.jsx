import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchPortfolios } from "../../redux/portfolio";
import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import { fetchPortfolioCryptos } from "../../redux/portfolioCryptos";
import { fetchStocks } from "../../redux/stocks";
import { fetchCryptos } from "../../redux/cryptos";
import { fetchPStockTransaction, createStockTransaction } from "../../redux/stockTransactions";
import { fetchPCryptoTransaction, createCryptoTransaction } from "../../redux/cryptoTransactions";
import StockChart from "../StockChart/StockChart";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const portfolioState = useSelector((state) => state.portfolio.portfolio);
  const holdingsState = useSelector((state) => state.portfolioStock.portfolio_stock);
  const stocksState = useSelector((state) => state.stock.stock);
  const transactionsState = useSelector((state) => state.stockTransaction.stock_transaction);
  const cryptosState = useSelector((state) => state.crypto.crypto);
  const cryptoTxState = useSelector((state) => state.cryptoTransaction.crypto_transaction);
  const portfolioCryptosState = useSelector((state) => state.portfolioCrypto.portfolio_crypto);
  const user = useSelector((state) => state.session.user);

  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [tradeMode, setTradeMode] = useState("shares"); // "shares" | "cash"
  const [side, setSide] = useState("BUY");
  const [latestPrice, setLatestPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [assetType, setAssetType] = useState("stock");
  const [holdingsValue, setHoldingsValue] = useState(0);
  const pricePollRef = useRef(null);
  const [timeframe, setTimeframe] = useState("1D");
  const [positionRows, setPositionRows] = useState([]);
  const [busySell, setBusySell] = useState(false);
  const [busyMax, setBusyMax] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchPortfolios());
      dispatch(fetchPortfolioStocks());
      dispatch(fetchPortfolioCryptos());
      dispatch(fetchStocks());
      dispatch(fetchPStockTransaction());
      dispatch(fetchCryptos());
      dispatch(fetchPCryptoTransaction());
    }
  }, [dispatch, user]);

  const stocksList = useMemo(() => Array.isArray(stocksState?.stocks) ? stocksState.stocks : [], [stocksState]);
  const cryptosList = useMemo(() => Array.isArray(cryptosState?.cryptos) ? cryptosState.cryptos : [], [cryptosState]);
  const holdings = useMemo(
    () => Array.isArray(holdingsState?.portfolio_stocks)
      ? holdingsState.portfolio_stocks.filter((h) => h?.stock && h?.stock?.symbol)
      : [],
    [holdingsState]
  );
  const cryptoHoldings = useMemo(
    () => Array.isArray(portfolioCryptosState?.portfolio_cryptos)
      ? portfolioCryptosState.portfolio_cryptos.filter((c) => c?.crypto && c?.crypto?.symbol)
      : [],
    [portfolioCryptosState]
  );

  useEffect(() => {
    if (!selectedSymbol) {
      if (assetType === "stock") {
        if (holdings.length) setSelectedSymbol(holdings[0].stock.symbol);
        else if (stocksList.length) setSelectedSymbol(stocksList[0].symbol);
        else setSelectedSymbol("AAPL");
      } else if (assetType === "crypto") {
        if (cryptosList.length) setSelectedSymbol(cryptosList[0].symbol);
        else setSelectedSymbol("BTC");
      }
    }
  }, [selectedSymbol, holdings, stocksList, cryptosList, assetType]);

  useEffect(() => {
    async function loadPrice() {
      if (!selectedSymbol) return;
      try {
        const base = assetType === "crypto" ? "/api/cryptos" : "/api/stocks";
        const res = await fetch(`${base}/${selectedSymbol}?days=5`);
        if (!res.ok) throw new Error("price fetch failed");
        const data = await res.json();
        const last = data?.closing?.[data.closing.length - 1];
        setLatestPrice(last ?? null);
      } catch (err) {
        console.error(err);
        setLatestPrice(null);
      }
    }
    loadPrice();
    if (pricePollRef.current) clearInterval(pricePollRef.current);
    pricePollRef.current = setInterval(loadPrice, 20_000);
    return () => {
      if (pricePollRef.current) clearInterval(pricePollRef.current);
    };
  }, [selectedSymbol, assetType]);

  const availableCash = Number((portfolioState?.portfolios?.[0]?.available_cash ?? 0).toFixed(2));
  const totalValue = Number((availableCash + holdingsValue).toFixed(2));
  const accountValue = totalValue;

  const orders = (transactionsState?.stock_transactions || []).map((t) => {
    const fallback = stocksList.find((s) => s.id === t.stock_id);
    const symbol = t.symbol || fallback?.symbol || "—";
    const price = Number(t.price || 0);
    const sharesNum = Number(t.shares || 0);
    return {
      symbol,
      side: t.action,
      shares: sharesNum,
      price,
      total: sharesNum * price
    };
  });

  const cryptoOrders = (cryptoTxState?.crypto_transactions || []).map((t) => {
    const fallback = cryptosList.find((c) => c.id === t.crypto_id);
    const symbol = t.symbol || fallback?.symbol || "—";
    const price = Number(t.price || 0);
    const sharesNum = Number(t.shares || 0);
    return {
      symbol,
      side: t.action,
      shares: sharesNum,
      price,
      total: sharesNum * price
    };
  });

  useEffect(() => {
    async function loadHoldingsValue() {
      if (!holdings.length && !cryptoHoldings.length) {
        setPositionRows([]);
        setHoldingsValue(0);
        return;
      }

      const positions = [];
      let total = 0;

      const loadStock = async (h) => {
        const qty = Number(h.quantity || 0);
        try {
          const res = await fetch(`/api/stocks/${h.stock.symbol}?days=2`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          const last = data?.closing?.[data.closing.length - 1] || 0;
          const value = qty * last;
          positions.push({ symbol: h.stock.symbol, qty, price: last, value, type: "stock" });
          total += value;
        } catch {
          positions.push({ symbol: h.stock.symbol, qty, price: 0, value: 0, type: "stock" });
        }
      };

      const loadCrypto = async (c) => {
        const qty = Number(c.quantity || 0);
        try {
          const res = await fetch(`/api/cryptos/${c.crypto.symbol}?days=2`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          const last = data?.closing?.[data.closing.length - 1] || 0;
          const value = qty * last;
          positions.push({ symbol: c.crypto.symbol, qty, price: last, value, type: "crypto" });
          total += value;
        } catch {
          positions.push({ symbol: c.crypto.symbol, qty, price: 0, value: 0, type: "crypto" });
        }
      };

      try {
        await Promise.all([
          ...holdings.map(loadStock),
          ...cryptoHoldings.map(loadCrypto)
        ]);
        const sorted = positions.sort((a, b) => {
          if (a.type === b.type) return a.symbol.localeCompare(b.symbol);
          return a.type === "crypto" ? -1 : 1; // crypto first
        });
        setPositionRows(sorted);
        setHoldingsValue(total);
      } catch {
        setPositionRows([]);
        setHoldingsValue(0);
      }
    }
    loadHoldingsValue();
  }, [holdings, cryptoHoldings]);

  const handleSellAll = async (pos) => {
    try {
      setBusySell(true);
      if (pos.type === "crypto") {
        const meta = cryptosList.find((c) => c.symbol === pos.symbol);
        if (!meta) throw new Error("Symbol not found");
        await dispatch(createCryptoTransaction({
          crypto_id: meta.id,
          shares: pos.qty,
          price: pos.price,
          action: "SELL"
        }));
      } else {
        const meta = stocksList.find((s) => s.symbol === pos.symbol);
        if (!meta) throw new Error("Symbol not found");
        await dispatch(createStockTransaction({
          stock_id: meta.id,
          shares: pos.qty,
          price: pos.price,
          action: "SELL"
        }));
      }
      await Promise.all([
        dispatch(fetchPortfolios()),
        dispatch(fetchPortfolioStocks()),
        dispatch(fetchPortfolioCryptos()),
        dispatch(fetchPStockTransaction()),
        dispatch(fetchPCryptoTransaction())
      ]);
      setStatus(`Sold all ${pos.symbol}`);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusySell(false);
    }
  };

  const portfolioSeries = useMemo(() => {
    const base = totalValue || 1;
    const multipliers = [0.95, 0.98, 1.0, 1.02, 1.05, 1.03, 1.08];
    return multipliers.map((m, idx) => ({
      label: `Day ${idx + 1}`,
      value: Number((base * m).toFixed(2)),
    }));
  }, [totalValue]);

  const computedShares = useMemo(() => {
    if (!latestPrice) return 0;
    if (tradeMode === "cash") {
      const cash = Number(cashAmount || 0);
      return cash > 0 ? cash / latestPrice : 0;
    }
    return Number(shares || 0);
  }, [tradeMode, cashAmount, shares, latestPrice]);

  const holdingQty = useMemo(() => {
    if (assetType === "crypto") {
      const target = positionRows.find((p) => p.type === "crypto" && p.symbol === selectedSymbol);
      return target ? target.qty : 0;
    }
    const target = positionRows.find((p) => p.type === "stock" && p.symbol === selectedSymbol);
    return target ? target.qty : 0;
  }, [assetType, positionRows, selectedSymbol]);

  const onTrade = async () => {
    setStatus("");
    if (side === "SELL" && computedShares > holdingQty) {
      setStatus("Cannot sell more than you own.");
      return;
    }
    const payload = {
      shares: computedShares,
      price: latestPrice,
      action: side
    };
    try {
      let resp;
      if (assetType === "crypto") {
        const cryptoMeta = cryptosList.find((c) => c.symbol === selectedSymbol);
        if (!cryptoMeta) {
          setStatus("Unknown symbol");
          return;
        }
        resp = await dispatch(createCryptoTransaction({ ...payload, crypto_id: cryptoMeta.id }));
      } else {
        const stockMeta = stocksList.find((s) => s.symbol === selectedSymbol);
        if (!stockMeta) {
          setStatus("Unknown symbol");
          return;
        }
        resp = await dispatch(createStockTransaction({ ...payload, stock_id: stockMeta.id }));
      }
      if (resp?.error) {
        setStatus(resp.error);
        return;
      }
      setStatus(`${assetType.toUpperCase()} ${side} executed`);
      setShares("");
      setCashAmount("");
      dispatch(fetchPortfolios());
      dispatch(fetchPortfolioStocks());
      dispatch(fetchPStockTransaction());
      dispatch(fetchPCryptoTransaction());
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="dash-page">
      <div className="top-strip">
        <div className="brand-dot">●</div>
        <div className="market-status">Market Open</div>
        <div className="quick-pills">
          <span className="pill ghost">Stock Trading</span>
          <span className="pill ghost">Options</span>
          <span className="pill ghost">Monitoring</span>
        </div>
        <div className="status-badges">
          <span className="badge live">Live</span>
          <span className="badge neutral">Data secured</span>
        </div>
      </div>
      <div className="dash-grid">
        <section className="panel sidebar">
          <div className="panel-section account-card">
            <div className="account-top">
              <div>
                <div className="muted">Individual</div>
                <div className="account-value">
                  ${accountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="account-change positive">Live balance</div>
              </div>
              <button className="pill ghost">Deposit</button>
            </div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={portfolioSeries}>
                  <defs>
                    <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#23e889" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#23e889" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#15202d" />
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#23e889" fill="url(#miniGradient)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="overview">
              <div>
                <div className="muted">Portfolio value</div>
                <div className="stat-large">${accountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="muted">Available</div>
                <div className="stat-large">${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="muted">Holdings</div>
                <div className="stat-large">${holdingsValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          <div className="panel-section movers scrollable">
            <div className="section-title">Positions</div>
            <div className="mover-list">
              {positionRows.some((p) => p.type === "crypto") && (
              <div className="section-subtitle">Crypto</div>
              )}
              {positionRows.filter((p) => p.type === "crypto").map((pos) => (
                <div key={`c-${pos.symbol}`} className="mover-row">
                  <div className="row-top">
                    <div className="row-left">
                      <div className="mover-symbol">{pos.symbol}</div>
                      <div className={`row-value ${pos.value >= 0 ? "up" : "down"}`}>${pos.value.toFixed(2)}</div>
                    </div>
                    <div className="row-right">
                      <span className="mover-price">Qty {pos.qty}</span>
                      <button className="pill tiny" disabled={busySell} onClick={() => handleSellAll(pos)}>Sell all</button>
                    </div>
                  </div>
                </div>
              ))}
              {positionRows.some((p) => p.type === "crypto") && positionRows.some((p) => p.type === "stock") && (
                <div className="separator"></div>
              )}
              {positionRows.some((p) => p.type === "stock") && (
                <>
                  <div className="section-subtitle">Stocks</div>
                  {positionRows.filter((p) => p.type === "stock").map((pos) => (
                    <div key={`s-${pos.symbol}`} className="mover-row">
                      <div className="row-top">
                        <div className="row-left">
                          <div className="mover-symbol">{pos.symbol}</div>
                          <div className={`row-value ${pos.value >= 0 ? "up" : "down"}`}>${pos.value.toFixed(2)}</div>
                        </div>
                        <div className="row-right">
                          <span className="mover-price">Qty {pos.qty}</span>
                          <button className="pill tiny" disabled={busySell} onClick={() => handleSellAll(pos)}>Sell all</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {!positionRows.length && <div className="muted">No holdings yet.</div>}
            </div>
          </div>
        </section>

        <section className="panel main">
          <div className="toolbar">
            <div className="toolbar-left">
              <button className="tab-btn active">Trading</button>
              <button className="tab-btn ghost">Monitoring</button>
            </div>
            <div className="toolbar-right">
              <div className="ticker">{selectedSymbol}</div>
              <div className="muted">{latestPrice ? `$${latestPrice.toFixed(2)}` : "—"}</div>
              <span className="badge live">Real-time</span>
            </div>
          </div>

            <div className="chart-card">
              <div className="timeframe-strip">
                {["LIVE", "1D", "1W", "1M", "3M", "1Y", "5Y"].map((tf) => (
                  <button
                    key={tf}
                    className={`tf-btn ${tf === timeframe ? "active" : ""}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            <StockChart
              key={`${selectedSymbol}-${assetType}-${timeframe}`}
              symbol={selectedSymbol}
              days={{ LIVE: 1, "1D": 2, "1W": 7, "1M": 35, "3M": 120, "1Y": 370, "5Y": 1825 }[timeframe] || 60}
              multiplier={{
                LIVE: 1,  // 1 minute bars
                "1D": 30, // 30 minute bars (approx)
                "1W": 4,  // 4 hour bars
                "1M": 1,  // 1 day bars
                "3M": 1,  // 1 day bars
                "1Y": 7,  // 1 week bars
                "5Y": 30  // ~monthly
              }[timeframe] || 1}
              timespan={{
                LIVE: "minute",
                "1D": "minute",
                "1W": "hour",
                "1M": "day",
                "3M": "day",
                "1Y": "day",
                "5Y": "day"
              }[timeframe] || "day"}
              assetType={assetType}
            />
          </div>

          <div className="chart-card">
            <div className="section-title">Portfolio Performance</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={portfolioSeries}>
                <defs>
                  <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23e889" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#23e889" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2735" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#23e889" fill="url(#portfolioArea)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="options-table">
            <div className="section-title">Recent orders</div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Side</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders, ...cryptoOrders].reverse().map((o, idx) => (
                    <tr key={idx}>
                      <td>{o.symbol}</td>
                      <td>{o.side}</td>
                      <td>{o.shares}</td>
                      <td>${Number(o.price || 0).toFixed(2)}</td>
                      <td>${Number(o.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {orders.length + cryptoOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="muted">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="panel right">
          <div className="panel-section order-card">
            <div className="section-title">Trade</div>
            <div className="order-row spaced">
              <label className="muted">Asset</label>
              <div className="side-choices">
                <button className={`tab-btn ${assetType === "stock" ? "active" : ""}`} onClick={() => { setAssetType("stock"); setSelectedSymbol(""); }}>Stock</button>
                <button className={`tab-btn ${assetType === "crypto" ? "active" : ""}`} onClick={() => { setAssetType("crypto"); setSelectedSymbol(""); }}>Crypto</button>
              </div>
            </div>
            <div className="order-row spaced">
              <label className="muted">Symbol</label>
              <select
                className="order-input"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
              >
                {(assetType === "stock" ? stocksList : cryptosList).map((s) => (
                  <option key={`${s.id}-${s.symbol}`} value={s.symbol}>{s.symbol}</option>
                ))}
              </select>
            </div>
            <div className="order-row spaced">
              <label className="muted">Side</label>
              <div className="side-choices">
                <button className={`tab-btn ${side === "BUY" ? "active" : ""}`} onClick={() => setSide("BUY")}>Buy</button>
                <button className={`tab-btn ${side === "SELL" ? "active" : ""}`} onClick={() => setSide("SELL")}>Sell</button>
              </div>
            </div>
            <div className="order-row spaced">
              <label className="muted">Mode</label>
              <div className="side-choices">
                <button className={`tab-btn ${tradeMode === "shares" ? "active" : ""}`} onClick={() => { setTradeMode("shares"); setCashAmount(""); }}>Shares</button>
                <button className={`tab-btn ${tradeMode === "cash" ? "active" : ""}`} onClick={() => { setTradeMode("cash"); setShares(""); }}>Cash</button>
              </div>
            </div>
            {tradeMode === "shares" && (
              <div className="order-row">
                <div className="muted">Shares</div>
                <input
                  className="order-input"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            {tradeMode === "cash" && (
              <div className="order-row">
                <div className="muted">Amount ($)</div>
                <input
                  className="order-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
            <div className="order-row spaced">
              <div className="muted">Market Price</div>
              <div className="order-value">{latestPrice ? `$${latestPrice.toFixed(2)}` : "—"}</div>
            </div>
            <div className="order-row spaced">
              <div className="muted">Estimated Total</div>
              <div className="order-value">
                {latestPrice && computedShares ? `$${(computedShares * latestPrice).toFixed(2)}` : "$0.00"}
              </div>
            </div>
            <div className="order-row spaced">
              <button
                className="pill ghost"
                disabled={busyMax || !latestPrice || side !== "BUY"}
                onClick={() => {
                  if (!latestPrice) return;
                  setBusyMax(true);
                  const maxShares = availableCash > 0 ? availableCash / latestPrice : 0;
                  if (tradeMode === "cash") {
                    setCashAmount(availableCash.toFixed(2));
                  } else {
                    setShares(maxShares.toFixed(4));
                  }
                  setBusyMax(false);
                }}
              >
                Buy max
              </button>
              <button className="cta" onClick={onTrade} disabled={!computedShares || !selectedSymbol}>
                Review Order
              </button>
            </div>
            {status && <div className="muted">{status}</div>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
