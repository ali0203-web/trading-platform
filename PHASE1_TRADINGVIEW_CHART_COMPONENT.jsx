// TRADINGVIEW LIGHTWEIGHT CHARTS COMPONENT
// Save as: src/components/TradingChart.jsx

import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const TradingChart = ({ symbol = 'AAPL', data = [] }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create chart
    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#0a0e1a' },
        textColor: '#9ca3af',
      },
      width: containerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      grid: {
        hStyle: 'solid',
        hColor: '#232a3a',
        vStyle: 'solid',
        vColor: '#232a3a',
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#27ae60',
      downColor: '#e74c3c',
      borderUpColor: '#27ae60',
      borderDownColor: '#e74c3c',
      wickUpColor: '#27ae60',
      wickDownColor: '#e74c3c',
    });

    candleSeriesRef.current = candleSeries;

    // Set data if provided
    if (data && data.length > 0) {
      candleSeries.setData(data);
      chart.timeScale().fitContent();
    }

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (candleSeriesRef.current && data && data.length > 0) {
      candleSeriesRef.current.setData(data);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data, symbol]);

  return (
    <div className="w-full bg-[#0a0e1a] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{symbol}</h2>
        {isLoading && <p className="text-gray-400">Loading chart...</p>}
      </div>
      <div
        ref={containerRef}
        className="w-full bg-[#1a1f2e] rounded"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default TradingChart;

---

// INSTALLATION STEPS:

// 1. Install TradingView Lightweight Charts
// npm install lightweight-charts

// 2. Use in your app:
// import TradingChart from './components/TradingChart';
// <TradingChart symbol="AAPL" data={chartData} />

// 3. Chart data format should be:
// [
//   {
//     time: '2024-01-01',
//     open: 150.00,
//     high: 151.50,
//     low: 149.50,
//     close: 150.25,
//   },
//   ...
// ]
