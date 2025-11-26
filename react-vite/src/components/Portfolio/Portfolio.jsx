import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchPortfolios } from "../../redux/portfolio";
import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import "./Portfolio.css";

function PortfolioCard() {
  const dispatch = useDispatch();
  const portfolioState = useSelector((state) => state.portfolio.portfolio);
  const holdingsState = useSelector((state) => state.portfolioStock.portfolio_stock);
  const user = useSelector((state) => state.session.user);

  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1M");

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([dispatch(fetchPortfolios()), dispatch(fetchPortfolioStocks())]).finally(() =>
        setIsLoading(false)
      );
    }
  }, [dispatch, user]);

  const portfolio = portfolioState?.portfolios?.[0];
  const totalValue = portfolio?.total_value ?? 0;
  const availableCash = portfolio?.available_cash ?? 0;
  const holdings = Array.isArray(holdingsState?.portfolio_stocks)
    ? holdingsState.portfolio_stocks
    : [];
  const invested = portfolio?.holdings_value ?? holdings.reduce((sum, h) => sum + Number(h.quantity || 0), 0);

  const multipliers = useMemo(() => ({
    "1D": [0.995, 1.0, 1.003],
    "1W": [0.98, 0.995, 1.01, 1.02],
    "1M": [0.95, 0.99, 1.02, 1.05, 1.08],
    "3M": [0.9, 0.95, 1.0, 1.05, 1.1, 1.15],
    "1Y": [0.75, 0.85, 0.95, 1.05, 1.15, 1.2],
    "5Y": [0.5, 0.7, 0.9, 1.1, 1.25, 1.4],
  }), []);

  const performanceData = useMemo(() => {
    const series = multipliers[timeframe] || multipliers["1M"];
    const base = totalValue || 1;
    return series.map((m, idx) => ({
      label: `T${idx + 1}`,
      value: Number((base * m).toFixed(2)),
    }));
  }, [timeframe, totalValue, multipliers]);

  if (isLoading) return <div className="portfolio-container">Loading portfolio...</div>;
  if (!portfolio) {
    return (
      <div className="portfolio-container">
        <h2>No portfolios found. Create one to get started!</h2>
      </div>
    );
  }

  return (
    <div className="portfolio-grid">
      <div className="portfolio-left">
        <div className="portfolio-container">
          <div className="portfolio-header">
            <div>
              <div className="muted">Individual Portfolio</div>
              <div className="portfolio-balance">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="muted small">Available ${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="timeframe-row">
              {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((tf) => (
                <button
                  key={tf}
                  className={`tf-btn ${tf === timeframe ? "active" : ""}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="portfolio-chart-card">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="portfolioLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23e889" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#23e889" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#14202f" />
                <XAxis dataKey="label" tick={{ fill: "#9fb3c8" }} />
                <YAxis tick={{ fill: "#9fb3c8" }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#23e889" fill="url(#portfolioLine)" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="portfolio-right">
        <div className="portfolio-summary">
          <div>
            <div className="muted">Total Value</div>
            <div className="stat">{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="muted">Available</div>
            <div className="stat">{availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="muted">Invested</div>
            <div className="stat">{invested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="positions-card">
          <div className="positions-header">Positions</div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={`${h.id}-${h.stock.symbol}`}>
                    <td>{h.stock.symbol}</td>
                    <td>{Number(h.quantity || 0)}</td>
                  </tr>
                ))}
                {!holdings.length && (
                  <tr>
                    <td colSpan="2" className="muted">No holdings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioCard;
