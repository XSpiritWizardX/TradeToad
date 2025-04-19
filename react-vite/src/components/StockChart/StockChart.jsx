import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StockChart.css'

function StockChart() {
  const { stockID  } = useParams();
  const symbol = stockID || 'AAPL';
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStockData() {
      try {
        setLoading(true);
        console.log(`Fetching stock data for ${symbol}...`);

        const response = await fetch(`/api/stocks/${symbol}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error: ${response.status} ${errorText}`);
          throw new Error(`Failed to fetch stock data: ${response.status}`);
        }
        const data = await response.json();
        console.log('Stock data received successfully');
        setStockData(data);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();
  }, [symbol]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stockData) return <div className="no-data">No data available</div>;

  // Format data for the chart
  const chartData = stockData.closing.map((close, index) => ({
    date: new Date(stockData.aggs[index].timestamp).toLocaleDateString(),
    close,
    open: stockData.open[index],
    high: stockData.highs[index],
    low: stockData.lows[index]
  }));

  return (
    <div className="stock-chart-container">
      <h2>{stockData.symbol} Price</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%"
        className="response-contain"
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#04D9FF" dot={false} />
            <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StockChart;
