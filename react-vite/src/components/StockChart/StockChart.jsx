import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StockChart.css';

function StockChart({ symbol: symbolProp, days = 90, assetType = "stock" }) {
  const { stockID } = useParams();
  const symbol = (symbolProp || stockID || 'AAPL').toUpperCase();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const base = assetType === "crypto" ? "/api/cryptos" : "/api/stocks";
    async function fetchStockData() {
      try {
        setLoading(true);

        const response = await fetch(`${base}/${symbol}?days=${days}`);
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
  }, [symbol, days, assetType]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stockData) return <div className="no-data">No data available</div>;

  const chartData = stockData.closing.map((close, index) => ({
    date: new Date(stockData.aggs[index].timestamp).toLocaleDateString(),
    close,
    open: stockData.open[index],
    high: stockData.highs[index],
    low: stockData.lows[index]
  }));

  const minLow = Math.min(...chartData.map(d => d.low));
  const maxHigh = Math.max(...chartData.map(d => d.high));
  const width = 800;
  const height = 320;
  const yScale = (val) => {
    if (maxHigh === minLow) return height / 2;
    return height - ((val - minLow) / (maxHigh - minLow)) * (height - 20) - 10;
  };

  return (
    <div className="stock-chart-container">
      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="candle-svg">
          <line x1="0" y1={yScale(minLow)} x2={width} y2={yScale(minLow)} stroke="#1f2937" strokeWidth="1" />
          {chartData.map((d, idx) => {
            const x = (idx / Math.max(chartData.length - 1, 1)) * (width - 40) + 20;
            const yHigh = yScale(d.high);
            const yLow = yScale(d.low);
            const yOpen = yScale(d.open);
            const yClose = yScale(d.close);
            const up = d.close >= d.open;
            const bodyTop = up ? yClose : yOpen;
            const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1.5);
            const color = up ? "#23e889" : "#ff5f5f";
            return (
              <g key={`${d.date}-${idx}`}>
                <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                <rect
                  x={x - 4}
                  y={bodyTop}
                  width={8}
                  height={bodyHeight}
                  fill={color}
                  opacity="0.9"
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default StockChart;
