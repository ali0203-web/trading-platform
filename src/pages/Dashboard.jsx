import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('markets')
  const [timeframe, setTimeframe] = useState('1D')

  const marketData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 227.45, change: 2.45, changePercent: 1.09, volume: '52.3M', bid: 227.43, ask: 227.47, high: 230.12, low: 225.98 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 416.89, change: 5.23, changePercent: 1.27, volume: '18.9M', bid: 416.87, ask: 416.91, high: 419.45, low: 412.10 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 156.78, change: -0.89, changePercent: -0.56, volume: '22.5M', bid: 156.76, ask: 156.80, high: 159.23, low: 155.45 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 187.92, change: 6.34, changePercent: 3.50, volume: '45.2M', bid: 187.90, ask: 187.94, high: 189.87, low: 182.15 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 892.34, change: 34.56, changePercent: 4.03, volume: '28.7M', bid: 892.30, ask: 892.38, high: 901.23, low: 875.10 },
  ]

  const watchlist = [
    { symbol: 'BTC/USD', price: 97234.50, change: 2834.20, image: '₿' },
    { symbol: 'ETH/USD', price: 3456.78, change: 123.45, image: 'Ξ' },
    { symbol: 'SPY', price: 598.34, change: 4.56, image: '📈' },
    { symbol: 'QQQ', price: 423.89, change: 8.90, image: '📊' },
    { symbol: 'IWM', price: 234.56, change: -2.34, image: '💼' },
  ]

  const portfolio = [
    { symbol: 'AAPL', shares: 100, avgCost: 150.25, current: 227.45, gain: 7720, gainPercent: 51.35 },
    { symbol: 'MSFT', shares: 50, avgCost: 300.00, current: 416.89, gain: 5844.50, gainPercent: 38.96 },
    { symbol: 'NVDA', shares: 25, avgCost: 650.00, current: 892.34, gain: 6058.50, gainPercent: 37.28 },
  ]

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📈 TRADING PLATFORM</h1>
          <p>Professional Trading Suite</p>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Search stocks, crypto, commodities..." className="search-input" />
        </div>
        <div className="header-right">
          <div className="account-info">
            <span className="account-balance">Balance: $427,893.45</span>
            <span className="buying-power">Buying Power: $856,234.12</span>
            <span className="portfolio-gain positive">Portfolio +$34,567.89 (+8.76%)</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="dashboard-main">
        {/* Left Sidebar - Watchlist & Market Overview */}
        <aside className="sidebar-left">
          <div className="sidebar-section watchlist-section">
            <h3>Market Snapshot</h3>
            <div className="market-indices">
              <div className="index-item">
                <span>S&P 500</span>
                <span className="positive">6,234.56 +45.23</span>
              </div>
              <div className="index-item">
                <span>NASDAQ</span>
                <span className="positive">20,123.45 +234.56</span>
              </div>
              <div className="index-item">
                <span>DOW</span>
                <span className="negative">44,567.89 -123.45</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Watchlist</h3>
            <div className="watchlist-items">
              {watchlist.map(item => (
                <div key={item.symbol} className="watchlist-item">
                  <div className="watchlist-symbol">{item.image} {item.symbol}</div>
                  <div className="watchlist-price">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className={`watchlist-change ${item.change > 0 ? 'positive' : 'negative'}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Economic Calendar</h3>
            <div className="economic-calendar">
              <div className="calendar-item high-impact">
                <span className="time">14:30 EDT</span>
                <span className="event">US Jobs Report</span>
                <span className="impact">🔴 High</span>
              </div>
              <div className="calendar-item medium-impact">
                <span className="time">10:00 EDT</span>
                <span className="event">Fed Minutes</span>
                <span className="impact">🟡 Medium</span>
              </div>
              <div className="calendar-item low-impact">
                <span className="time">09:45 EDT</span>
                <span className="event">Markit PMI</span>
                <span className="impact">🟢 Low</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Charts & Trading */}
        <main className="main-content">
          {/* Chart Section */}
          <section className="chart-section">
            <div className="chart-header">
              <div className="chart-info">
                <h2>AAPL - Apple Inc.</h2>
                <div className="chart-details">
                  <span className="price">$227.45</span>
                  <span className="change positive">+$5.67 (+2.55%)</span>
                  <span className="volume">Vol: 52.3M</span>
                  <span className="high">H: $230.12</span>
                  <span className="low">L: $225.98</span>
                </div>
              </div>
              <div className="chart-controls">
                <div className="timeframe-buttons">
                  {['1M', '5M', '15M', '1H', '4H', '1D', '1W', '1M', '1Y'].map(tf => (
                    <button
                      key={tf}
                      className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-canvas">
              <div className="chart-placeholder">
                <svg viewBox="0 0 800 300" className="candlestick-chart">
                  {/* Candlestick pattern */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <g key={i}>
                      {/* Wick */}
                      <line x1={50 + i * 90} y1={80 + Math.sin(i) * 40} x2={50 + i * 90} y2={220 + Math.cos(i) * 40} stroke="#666" strokeWidth="1" />
                      {/* Body */}
                      <rect x={40 + i * 90} y={120 + Math.sin(i) * 30} width="20" height="60" fill={Math.sin(i) > 0 ? '#27ae60' : '#e74c3c'} />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="indicators">
                <div className="indicator">
                  <span>RSI(14):</span>
                  <span className="value">65.23</span>
                </div>
                <div className="indicator">
                  <span>MACD:</span>
                  <span className="value">↑ Bullish</span>
                </div>
                <div className="indicator">
                  <span>Bollinger:</span>
                  <span className="value">Mid Band</span>
                </div>
              </div>
            </div>
          </section>

          {/* Orders & Positions Section */}
          <section className="trading-section">
            <div className="section-tabs">
              <button className="tab-btn active">Place Order</button>
              <button className="tab-btn">Open Positions (3)</button>
              <button className="tab-btn">Order History</button>
            </div>

            <div className="trading-panel">
              <div className="order-form">
                <div className="form-group">
                  <label>Order Type</label>
                  <select className="form-select">
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop Loss</option>
                    <option>Stop Limit</option>
                    <option>Trailing Stop</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" defaultValue="10" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" defaultValue="227.45" className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Total Value</label>
                  <div className="total-value">$2,274.50</div>
                </div>

                <div className="order-buttons">
                  <button className="btn-buy">BUY 10 AAPL</button>
                  <button className="btn-sell">SELL 10 AAPL</button>
                </div>

                <div className="order-summary">
                  <p>Commission: $1.00 | Est. Total: $2,275.50</p>
                </div>
              </div>

              <div className="positions-table">
                <table>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Shares</th>
                      <th>Avg Cost</th>
                      <th>Current</th>
                      <th>Gain/Loss</th>
                      <th>%</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(pos => (
                      <tr key={pos.symbol} className="position-row">
                        <td className="symbol">{pos.symbol}</td>
                        <td>{pos.shares}</td>
                        <td>${pos.avgCost}</td>
                        <td>${pos.current}</td>
                        <td className={pos.gain > 0 ? 'positive' : 'negative'}>
                          ${pos.gain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={pos.gainPercent > 0 ? 'positive' : 'negative'}>
                          +{pos.gainPercent.toFixed(2)}%
                        </td>
                        <td><button className="action-btn">⋯</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        {/* Right Sidebar - News & Market Data */}
        <aside className="sidebar-right">
          <div className="sidebar-section">
            <h3>Market Feed</h3>
            <div className="news-feed">
              <div className="news-item">
                <span className="time">14:32</span>
                <span className="headline">AAPL announces Q4 earnings beat</span>
                <span className="impact">↑ +2.5%</span>
              </div>
              <div className="news-item">
                <span className="time">14:15</span>
                <span className="headline">Fed signals potential rate cut</span>
                <span className="impact">↑ Market Wide</span>
              </div>
              <div className="news-item">
                <span className="time">13:47</span>
                <span className="headline">Tech sector rallies on AI news</span>
                <span className="impact">↑ +3.2%</span>
              </div>
              <div className="news-item">
                <span className="time">13:22</span>
                <span className="headline">Oil prices surge amid supply concerns</span>
                <span className="impact">↑ +1.8%</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Top Movers</h3>
            <div className="movers">
              <div className="mover top-gainer">
                <span>TSLA</span>
                <span className="positive">↑ +8.45%</span>
              </div>
              <div className="mover top-gainer">
                <span>NVIDIA</span>
                <span className="positive">↑ +6.23%</span>
              </div>
              <div className="mover top-loser">
                <span>COIN</span>
                <span className="negative">↓ -4.56%</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Account</h3>
            <div className="account-details">
              <div className="detail-item">
                <span>Total Value</span>
                <span>$427,893.45</span>
              </div>
              <div className="detail-item">
                <span>Day Gain/Loss</span>
                <span className="positive">+$2,345.67</span>
              </div>
              <div className="detail-item">
                <span>Total Gain/Loss</span>
                <span className="positive">+$34,567.89</span>
              </div>
              <div className="detail-item">
                <span>Buying Power</span>
                <span>$856,234.12</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
