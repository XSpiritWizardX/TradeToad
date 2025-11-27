import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StockChart from "../StockChart/StockChart";
import "./StockShow.css";

function StockShow() {
  const { stockID } = useParams();
  const symbol = (stockID || "AAPL").toUpperCase();
  const [shares, setShares] = useState("");
  const [livePrice, setLivePrice] = useState(null);
  const [timeframe, setTimeframe] = useState("1D");

  const quote = useMemo(
    () => ({
      price: livePrice ?? 213.39,
      change: 2.28,
      changePct: 1.08,
      afterHours: -0.75,
      afterPct: -0.35,
      marketCap: "950.65B",
      pe: "17.93",
      divYield: "1.20",
      avgVolume: "29.60M",
      employees: "132,000",
      hq: "Cupertino, California",
      founded: "1976",
    }),
    [livePrice]
  );

  useEffect(() => {
    async function loadQuote() {
      try {
        const res = await fetch(`/api/stocks/${symbol}?days=5`);
        if (!res.ok) throw new Error("quote fetch failed");
        const data = await res.json();
        const last = data?.closing?.[data.closing.length - 1];
        if (last) setLivePrice(last);
      } catch (err) {
        console.error(err);
      }
    }
    loadQuote();
  }, [symbol]);

  const estimatedCost = shares && quote.price ? (parseFloat(shares) * quote.price).toFixed(2) : "0.00";
  return (
    <div className="stock-page">
      <div className="stock-topbar">
        <input className="search-input" placeholder="Search" />
        <div className="top-actions">
          <span className="pill dark">• 53%</span>
          <span className="pill dark">📈 213,327</span>
        </div>
      </div>
      <div className="stock-layout">
        <main className="stock-main">
          <div className="tag-row">
            <span className="chip filled">Computer Hardware</span>
            <span className="chip">Most Popular</span>
            <span className="chip">Computer Software</span>
          </div>

          <div className="quote-block">
            <h1 className="stock-name">{symbol}</h1>
            <div className="stock-price">${quote.price.toFixed(2)}</div>
            <div className="stock-change">
              <span className="up">
                ${quote.change.toFixed(2)} ({quote.changePct.toFixed(2)}%) Today
              </span>
              <span className="muted">
                {quote.afterHours > 0 ? "+" : ""}
                {quote.afterHours.toFixed(2)} ({quote.afterPct.toFixed(2)}%) After Hours
              </span>
            </div>
          </div>

          <div className="chart-section">
            <div className="timeframe-row">
              {["LIVE", "1D", "1W", "1M", "3M", "1Y", "5Y"].map((tf) => (
                <button
                  key={tf}
                  className={`tf-btn ${tf === timeframe ? "active" : ""}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
              <div className="expand">Expand ⤢</div>
            </div>
            <div className="chart-wrapper">
              <StockChart
                key={`${symbol}-${timeframe}`}
                symbol={symbol}
                days={{ LIVE: 1, "1D": 2, "1W": 7, "1M": 35, "3M": 120, "1Y": 370, "5Y": 1825 }[timeframe] || 90}
                multiplier={{
                  LIVE: 1,
                  "1D": 30,
                  "1W": 4,
                  "1M": 1,
                  "3M": 1,
                  "1Y": 7,
                  "5Y": 30
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
              />
            </div>
          </div>

          <div className="about-section">
            <div className="about-header">
              <h2>About</h2>
              <button className="link-btn">Show More</button>
            </div>
            <p className="about-text">
              {symbol} designs, manufactures, and markets consumer electronics and software. It operates
              across Americas, Europe, Greater China, Japan, and Rest of Asia Pacific.
            </p>

            <div className="stats-grid">
              <div>
                <div className="muted">CEO</div>
                <div className="stat-value">Tim Cook</div>
              </div>
              <div>
                <div className="muted">Employees</div>
                <div className="stat-value">{quote.employees}</div>
              </div>
              <div>
                <div className="muted">Headquarters</div>
                <div className="stat-value">{quote.hq}</div>
              </div>
              <div>
                <div className="muted">Founded</div>
                <div className="stat-value">{quote.founded}</div>
              </div>
              <div>
                <div className="muted">Market Cap</div>
                <div className="stat-value">{quote.marketCap}</div>
              </div>
              <div>
                <div className="muted">Price-Earnings Ratio</div>
                <div className="stat-value">{quote.pe}</div>
              </div>
              <div>
                <div className="muted">Dividend Yield</div>
                <div className="stat-value">{quote.divYield}</div>
              </div>
              <div>
                <div className="muted">Average Volume</div>
                <div className="stat-value">{quote.avgVolume}</div>
              </div>
            </div>
          </div>
        </main>

        <aside className="order-card">
          <div className="order-header">
            <div className="order-title">Buy {symbol}</div>
            <button className="icon-btn">•••</button>
          </div>
          <div className="order-row">
            <div className="muted">Shares</div>
            <input
              className="order-input"
              type="number"
              min="0"
              step="1"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="order-row spaced">
            <div className="muted green">Market Price</div>
            <div className="order-value green">${quote.price.toFixed(2)}</div>
          </div>
          <div className="order-row spaced">
            <div className="muted">Estimated Cost</div>
            <div className="order-value">${estimatedCost}</div>
          </div>
          <button className="cta">Review Order</button>
          <div className="power">Buying Power Available $14.39</div>
          <div className="side-actions">
            <button className="outline-btn">Trade {symbol} Options</button>
            <button className="outline-btn">Add to Watchlist</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default StockShow;
