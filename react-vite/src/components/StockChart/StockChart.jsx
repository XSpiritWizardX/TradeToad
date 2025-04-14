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
        const response = await fetch(`/api/stocks/${symbol}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        setStockData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stockData) return <div>No data available</div>;

  // Format data for the chart
  const chartData = stockData.closing.map((close, index) => ({
    date: new Date(stockData.aggs[index].timestamp).toLocaleDateString(),
    close,
    high: stockData.highs[index],
    low: stockData.lows[index]
  }));

  return (
    <div>
      <h2>{stockData.symbol} Stock Price</h2>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="high" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="low" stroke="#ff7300" dot={false} />
      </LineChart>
    </div>
  );
}

export default StockChart;
