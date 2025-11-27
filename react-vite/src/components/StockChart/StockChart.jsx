import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StockChart.css';

function StockChart({ symbol: symbolProp, days = 90, multiplier = 1, timespan = "day", assetType = "stock" }) {
  const { stockID } = useParams();
  const symbol = (symbolProp || stockID || 'AAPL').toUpperCase();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const base = assetType === "crypto" ? "/api/cryptos" : "/api/stocks";
    async function fetchStockData() {
      try {
        setLoading(true);

        const response = await fetch(
          `${base}/${symbol}?days=${days}&multiplier=${multiplier}&timespan=${timespan}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error: ${response.status} ${errorText}`);
          throw new Error(`Failed to fetch ${assetType} data: ${response.status}`);
        }
        const data = await response.json();
        setStockData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stock/crypto data:', err);
        setError(err.message);
        setStockData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchStockData, 30_000); // ~live refresh
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [symbol, days, multiplier, timespan, assetType]);

  const formatDateTime = (ts) =>
    new Date(ts).toLocaleString([], {
      hour12: false,
      timeZone: "America/New_York",
      timeZoneName: "short",
    });

  const chartData = stockData?.closing?.map((close, index) => ({
    date: new Date(stockData.aggs[index].timestamp).toLocaleDateString(),
    timestamp: stockData.aggs[index].timestamp,
    close,
    open: stockData.open[index],
    high: stockData.highs[index],
    low: stockData.lows[index],
    dateTime: formatDateTime(stockData.aggs[index].timestamp),
  })) || [];

  useEffect(() => {
    if (chartData.length) {
      setHoverIndex(chartData.length - 1);
    } else {
      setHoverIndex(null);
    }
  }, [stockData?.symbol, chartData.length]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stockData) return <div className="no-data">No data available</div>;

  const rawLow = Math.min(...chartData.map(d => d.low));
  const rawHigh = Math.max(...chartData.map(d => d.high));
  const pad = Math.max((rawHigh - rawLow) * 0.1, 0.5);
  const minLow = rawLow - pad;
  const maxHigh = rawHigh + pad;
  const width = Math.max(500, chartData.length * 16 + 60);
  const height = 320;
  const leftMargin = 60;
  const rightMargin = 20;
  const usableWidth = width - leftMargin - rightMargin;
  const yScale = (val) => {
    if (maxHigh === minLow) return height / 2;
    return height - ((val - minLow) / (maxHigh - minLow)) * (height - 24) - 12;
  };
  const ticks = [minLow, minLow + (maxHigh - minLow) * 0.25, minLow + (maxHigh - minLow) * 0.5, minLow + (maxHigh - minLow) * 0.75, maxHigh];
  const formatPrice = (val) => `$${val.toFixed(4)}`;

  const handleMouseMove = (e) => {
    if (!chartData.length) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const usable = usableWidth;
    const rel = Math.max(0, Math.min(usable, x - leftMargin));
    const idx = Math.round((rel / Math.max(usable, 1)) * (chartData.length - 1));
    setHoverIndex(idx);
  };

  const hover = hoverIndex != null ? chartData[hoverIndex] : null;

  return (
    <div className="stock-chart-container">
      <div className="chart-wrapper" ref={wrapperRef}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="candle-svg"
          onMouseMove={handleMouseMove}
        >
          {[0.25, 0.5, 0.75].map((p) => {
            const y = height * p;
            return <line key={p} x1={0} y1={y} x2={width} y2={y} stroke="#121a25" strokeWidth="1" />;
          })}
          {ticks.map((t, idx) => (
            <text key={`tick-${idx}`} x={8} y={yScale(t) + 4} fill="#9fb3c8" fontSize="11">
              {formatPrice(t)}
            </text>
          ))}
          {chartData.map((d, idx) => {
            const x = (idx / Math.max(chartData.length - 1, 1)) * usableWidth + leftMargin;
            const yHigh = yScale(d.high);
            const yLow = yScale(d.low);
            const yOpen = yScale(d.open);
            const yClose = yScale(d.close);
            const up = d.close >= d.open;
            const bodyTop = up ? yClose : yOpen;
            const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1.5);
            const color = up ? "#23e889" : "#ff5f5f";
            return (
              <g
                key={`${d.date}-${idx}`}
              >
                <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                <rect
                  x={x - 5}
                  y={bodyTop}
                  width={10}
                  height={bodyHeight}
                  fill={color}
                  opacity="0.9"
                  rx="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
      {hover && (
        <div className="candle-tooltip bottom">
          <div className="tooltip-date">{hover.dateTime}</div>
          <div className="tooltip-grid">
            <span>Open</span><span>{hover.open.toFixed(2)}</span>
            <span>High</span><span>{hover.high.toFixed(2)}</span>
            <span>Low</span><span>{hover.low.toFixed(2)}</span>
            <span>Close</span><span>{hover.close.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockChart;
