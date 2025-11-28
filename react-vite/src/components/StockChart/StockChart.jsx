import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StockChart.css';

function StockChart({ symbol: symbolProp, days = 90, multiplier = 1, timespan = "day", assetType = "stock", chartType = "candle" }) {
  const { stockID } = useParams();
  const symbol = (symbolProp || stockID || 'AAPL').toUpperCase();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const base = assetType === "crypto" ? "/api/cryptos" : "/api/stocks";

    const rebuildFromAggs = (aggs) => {
      const sorted = [...aggs].sort((a, b) => a.timestamp - b.timestamp);
      return {
        aggs: sorted,
        open: sorted.map((a) => a.open),
        closing: sorted.map((a) => a.close),
        highs: sorted.map((a) => a.high),
        lows: sorted.map((a) => a.low),
      };
    };

    async function fetchStockData() {
      try {
        setLoading(true);

        // For LIVE timeframe we request exactly 60 minutes of 1-minute bars.
        const liveParams = timespan === "minute" && days <= 1 ? `days=1&multiplier=1&timespan=minute` : `days=${days}&multiplier=${multiplier}&timespan=${timespan}`;
        const response = await fetch(
          `${base}/${symbol}?${liveParams}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error: ${response.status} ${errorText}`);
          throw new Error(`Failed to fetch ${assetType} data: ${response.status}`);
        }
        let data = await response.json();
        // For crypto, push the latest Coinbase tick into the last bar to keep charts aligned with live price.
        if (assetType === "crypto" && Array.isArray(data?.aggs) && data.aggs.length > 0) {
          try {
            const liveRes = await fetch(`/api/coinbase/price/${symbol}`);
            if (liveRes.ok) {
              const live = await liveRes.json();
              if (typeof live?.price === "number") {
                const latest = { ...data.aggs[data.aggs.length - 1] };
                const livePrice = Number(live.price);
                latest.open = livePrice;
                latest.close = livePrice;
                latest.high = livePrice;
                latest.low = livePrice;
                data = {
                  ...data,
                  aggs: [...data.aggs.slice(0, -1), latest],
                  open: [...data.open.slice(0, -1), livePrice],
                  closing: [...data.closing.slice(0, -1), livePrice],
                  highs: [...data.highs.slice(0, -1), livePrice],
                  lows: [...data.lows.slice(0, -1), livePrice],
                  source: `${data.source || "polygon"}+coinbase-last`
                };
              }
            }
          } catch {
            // ignore; keep original data
          }
        }
        setStockData((prev) => {
          // Merge minute data to avoid full refresh on live view
          if (!prev || timespan !== "minute" || !Array.isArray(prev.aggs)) return data;
          const map = {};
          for (const agg of prev.aggs) map[agg.timestamp] = agg;
          for (const agg of data.aggs || []) map[agg.timestamp] = agg; // overwrite with newest
          const mergedAggs = Object.values(map).sort((a, b) => a.timestamp - b.timestamp).slice(-60);
          const rebuilt = rebuildFromAggs(mergedAggs);
          return {
            ...data,
            ...rebuilt,
          };
        });
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
    // refresh at most once per minute to reduce jitter
    pollRef.current = setInterval(fetchStockData, 60_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [symbol, days, multiplier, timespan, assetType]);

  useEffect(() => {
    async function fetchSignal() {
      try {
        const isLive = timespan === "minute";
        const endpoint = isLive
          ? `/api/predict/${symbol}/live?span_days=2&multiplier=${multiplier}&timespan=${timespan}`
          : `/api/predict/${symbol}`;
        const res = await fetch(endpoint, { credentials: "include" });
        if (!res.ok) throw new Error("signal fetch failed");
        const data = await res.json();
        setSignal(data);
      } catch (err) {
        console.error("signal fetch failed", err);
        setSignal(null);
      }
    }
    fetchSignal();
  }, [symbol, timespan, multiplier, days, assetType]);

  const baseData = stockData;
  const viewData = useMemo(() => {
    if (timespan === "minute" && baseData?.aggs?.length > 60) {
      const start = baseData.aggs.length - 60;
      return {
        ...baseData,
        aggs: baseData.aggs.slice(start),
        open: baseData.open.slice(start),
        closing: baseData.closing.slice(start),
        highs: baseData.highs.slice(start),
        lows: baseData.lows.slice(start)
      };
    }
    return baseData;
  }, [baseData, timespan]);

  const chartData = useMemo(() => {
    if (!viewData?.closing?.length) return [];
    return viewData.closing.map((close, index) => ({
      date: new Date(viewData.aggs[index].timestamp).toLocaleDateString(),
      timestamp: viewData.aggs[index].timestamp,
      close,
      open: viewData.open[index],
      high: viewData.highs[index],
      low: viewData.lows[index],
      dateTime: new Date(viewData.aggs[index].timestamp).toLocaleString([], {
        hour12: false,
        timeZone: "America/New_York",
        timeZoneName: "short",
      }),
    }));
  }, [viewData]);

  useEffect(() => {
    if (chartData.length) {
      setHoverIndex(chartData.length - 1);
    } else {
      setHoverIndex(null);
    }
  }, [stockData?.symbol, chartData.length]);

  const historicalSignals = useMemo(() => {
    if (!chartData.length) return [];
    const closes = chartData.map((c) => c.close);
    const ema = (period) => {
      const k = 2 / (period + 1);
      let emaVal = closes[0];
      const out = [emaVal];
      for (let i = 1; i < closes.length; i++) {
        emaVal = closes[i] * k + emaVal * (1 - k);
        out.push(emaVal);
      }
      return out;
    };
    const short = ema(8);
    const long = ema(21);
    const markers = [];
    for (let i = 1; i < closes.length; i++) {
      const prevDiff = short[i - 1] - long[i - 1];
      const diff = short[i] - long[i];
      if (prevDiff <= 0 && diff > 0) {
        markers.push({ idx: i, action: "BUY", price: closes[i] });
      } else if (prevDiff >= 0 && diff < 0) {
        markers.push({ idx: i, action: "SELL", price: closes[i] });
      }
    }
    return markers;
  }, [chartData]);

  const predictedValue = signal?.predicted_close ?? signal?.predicted_price;
  const lastPrice = chartData.length ? chartData[chartData.length - 1]?.close : null;
  const action = signal?.suggested_action || (predictedValue && lastPrice
    ? (predictedValue > lastPrice ? "BUY" : predictedValue < lastPrice ? "SELL" : "HOLD")
    : null);
  const confidencePct = Math.round(Math.min(0.99, Math.max(0, signal?.confidence ?? 0.5)) * 100);
  const predictedDelta = predictedValue != null && lastPrice != null ? predictedValue - lastPrice : null;
  const mae = signal?.mae;
  const labelForAction = action === "BUY" ? "Buy Signal" : action === "SELL" ? "Sell Signal" : "Hold Signal";

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stockData || !chartData.length) return <div className="no-data">No recent data</div>;

  const rawLow = Math.min(...chartData.map(d => d.low));
  const rawHigh = Math.max(...chartData.map(d => d.high));
  const pad = Math.max((rawHigh - rawLow) * 0.1, 0.5);
  const minLow = rawLow - pad;
  const maxHigh = rawHigh + pad;
  const totalPoints = chartData.length;
  const width = Math.max(500, totalPoints * 16 + 60);
  const height = 460;
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
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const xView = frac * width; // map to viewBox space
    const usable = usableWidth;
    const rel = Math.max(0, Math.min(usable, xView - leftMargin));
    const idx = Math.round((rel / Math.max(usable, 1)) * (chartData.length - 1));
    setHoverIndex(idx);
  };

  const hover = hoverIndex != null ? chartData[hoverIndex] : null;
  const hoverX = hoverIndex != null
    ? (hoverIndex / Math.max(chartData.length - 1, 1)) * usableWidth + leftMargin
    : null;

  const signalX = leftMargin + usableWidth;
  const signalY = typeof predictedValue === "number" ? yScale(predictedValue) : null;
  const signalColor = action === "SELL" ? "#ff6b6b" : action === "BUY" ? "#23e889" : "#9fb3c8";

  return (
    <div className="stock-chart-container">
      {signal && (
        <div className="signal-card above-chart">
          <div className="signal-row">
            <span className={`signal-chip ${action === "BUY" ? "buy" : action === "SELL" ? "sell" : "hold"}`}>
              {labelForAction}
            </span>
            <span className="signal-conf">{confidencePct}% confidence</span>
          </div>
          <div className="signal-price stacked">
            <div className="price-block">
              <div className="muted tiny">Market Price</div>
              <div className="pill-value">{lastPrice ? `$${lastPrice.toFixed(2)}` : "—"}</div>
            </div>
            <div className="price-block">
              <div className="muted tiny">Predicted</div>
              <div className={`pill-value ${predictedDelta != null ? (predictedDelta >= 0 ? "up" : "down") : ""}`}>
                {typeof predictedValue === "number" ? `$${predictedValue.toFixed(2)}` : "—"}
              </div>
            </div>
          </div>
          <div className="signal-meta">
            <span>Model: {signal.model_used ? "ML" : "Heuristic"}</span>
            {mae != null && <span>MAE: {mae.toFixed(2)}</span>}
          </div>
        </div>
      )}
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
          {hoverX != null && (
            <line
              x1={hoverX}
              y1={0}
              x2={hoverX}
              y2={height}
              stroke="#2fd98f"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          )}
          {chartType === "candle" && chartData.map((d, idx) => {
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
        {historicalSignals.map((sig, index) => {
          const x = (sig.idx / Math.max(chartData.length - 1, 1)) * usableWidth + leftMargin;
          const y = yScale(sig.price) - 40;
          const color = sig.action === "SELL" ? "#ff6b6b" : "#23e889";
          return (
            <g key={`sig-${index}`} className="hist-signal">
              <polygon
                points={`${x - 12},${y - 26} ${x + 12},${y - 26} ${x},${y - 6}`}
                fill={color}
                opacity="0.9"
              />
              <circle cx={x} cy={y} r="8" fill={color} />
              <text x={x} y={y - 30} fill={color} fontSize="13" fontWeight="800" textAnchor="middle">
                {sig.action}
              </text>
            </g>
            );
          })}
          {chartType === "line" && (() => {
            if (chartData.length < 2) return null;
            const points = chartData.map((d, idx) => {
              const x = (idx / Math.max(chartData.length - 1, 1)) * usableWidth + leftMargin;
              const y = yScale(d.close);
              return `${x},${y}`;
            }).join(" ");
            return (
              <polyline
                fill="none"
                stroke="#23e889"
                strokeWidth="2"
                points={points}
                opacity="0.9"
              />
            );
          })()}
          {signalY != null && (
            <g className="signal-marker">
              <line
                x1={signalX}
                y1={signalY}
                x2={signalX + 16}
                y2={signalY}
                stroke={signalColor}
                strokeWidth="2"
              />
              <circle cx={signalX} cy={signalY} r="5" fill={signalColor} />
              <rect
                x={signalX + 18}
                y={signalY - 12}
                rx="6"
                ry="6"
                width="72"
                height="24"
                fill="#0f151d"
                stroke={signalColor}
                strokeWidth="1"
              />
              <text x={signalX + 24} y={signalY + 5} fill={signalColor} fontSize="12" fontWeight="700">
                {action || "HOLD"}
              </text>
              {typeof predictedValue === "number" && (
                <text x={signalX + 56} y={signalY + 5} fill="#e6f3ff" fontSize="11" textAnchor="end">
                  ${predictedValue.toFixed(2)}
                </text>
              )}
            </g>
          )}
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
