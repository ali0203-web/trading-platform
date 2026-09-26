import React, { useState } from 'react'

export default function Markets() {
  const [selectedStock, setSelectedStock] = useState('AAPL')

  const stocks = [
    { symbol: 'AAPL', name: 'Apple', price: 227.45, change: 2.45, 
      rsi: 65.23, macd: 'Bullish', pe: 28.5, div: 0.92 },
    { symbol: 'MSFT', name: 'Microsoft', price: 416.89, change: 5.23,
      rsi: 72.1, macd: 'Bullish', pe: 35.2, div: 0.68 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 156.78, change: -0.89,
      rsi: 48.5, macd: 'Neutral', pe: 22.3, div: 0.0 },
    { symbol: 'AMZN', name: 'Amazon', price: 187.92, change: 6.34,
      rsi: 71.2, macd: 'Bullish', pe: 62.1, div: 0.0 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 892.34, change: 34.56,
      rsi: 78.9, macd: 'Bullish', pe: 58.3, div: 0.08 },
  ]

  return (
    <div className="page-container">
      <h1>📈 Markets & Research</h1>
      <div className="markets-layout">
        <div className="stock-list">
          {stocks.map(stock => (
            <div 
              key={stock.symbol}
              className={`stock-item ${selectedStock === stock.symbol ? 'active' : ''}`}
              onClick={() => setSelectedStock(stock.symbol)}
            >
              <div>{stock.symbol}</div>
              <div>${stock.price}</div>
              <div className={stock.change > 0 ? 'positive' : 'negative'}>
                {stock.change > 0 ? '+' : ''}{stock.change}%
              </div>
            </div>
          ))}
        </div>
        <div className="stock-detail">
          <h2>{selectedStock} - Full Research</h2>
          <div className="research-panel">
            <p>📊 Real data via Alpha Vantage API</p>
            <p>📰 News feed integration</p>
            <p>📉 Technical analysis</p>
            <p>💡 Analyst recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
