import React, { useState } from 'react'
import { useArqamData } from '../hooks/useArqamData'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('markets')
  const [timeframe, setTimeframe] = useState('1D')
  
  // Real data from Arqam Capital
  const { balance, positions, quotes, isLoading, isConnected, error } = useArqamData()

  // Demo data fallback
  const demoData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 227.45,
    change: 2.45,
    changePercent: 1.09,
    volume: '52.3M',
    bid: 227.43,
    ask: 227.47,
    high: 230.12,
    low: 225.98,
  }

  const watchlist = [
    { symbol: 'BTC/USD', price: 97234.50, change: 2834.20, image: '₿' },
    { symbol: 'ETH/USD', price: 3456.78, change: 123.45, image: 'Ξ' },
    { symbol: 'SPY', price: 598.34, change: 4.56, image: '📈' },
    { symbol: 'QQQ', price: 423.89, change: 8.90, image: '📊' },
    { symbol: 'IWM', price: 234.56, change: -2.34, image: '💼' },
  ]

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📈 TRADING PLATFORM</h1>
          <p>Professional Trading Suite {isConnected ? '🟢 LIVE' : '🔴 DEMO'}</p>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Search stocks, crypto, commodities..." className="search-input" />
        </div>
        <div className="header-right">
          <div className="account-info">
            {isLoading ? (
              <span className="account-balance">Loading...</span>
            ) : (
              <>
                <span className="account-balance">
                  Balance: ${balance?.total_value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '427,893.45'}
                </span>
                <span className="buying-power">
                  Buying Power: ${balance?.buying_power?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '856,234.12'}
                </span>
                <span className={`portfolio-gain ${(balance?.daily_pnl || 0) >= 0 ? 'positive' : 'negative'}`}>
                  Portfolio ${balance?.daily_pnl >= 0 ? '+' : ''}${balance?.daily_pnl?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '+$34,567.89'} 
                  ({balance?.daily_pnl_percent?.toFixed(2) || '+8.76'}%)
                </span>
              </>
            )}
            {error && <span style={{color: '#ef4444'}}>Error: {error}</span>}
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
            <h3>Your Positions ({positions.length})</h3>
            {isLoading ? (
              <p>Loading positions...</p>
            ) : positions.length > 0 ? (
              <div className="watchlist-items">
                {positions.map(pos => (
                  <div key={pos.symbol} className="watchlist-item">
                    <div className="watchlist-symbol">📊 {pos.symbol}</div>
                    <div className="watchlist-price">${pos.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className={`watchlist-change ${pos.unrealized_pnl >= 0 ? 'positive' : 'negative'}`}>
                      {pos.unrealized_pnl > 0 ? '+' : ''}${pos.unrealized_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No open positions</p>
            )}
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
            </div>
          </div>
        </aside>

        {/* Center - Charts & Trading */}
        <main className="main-content">
          {/* Chart Section */}
          <section className="chart-section">
            <div className="chart-header">
              <div className="chart-info">
                <h2>{demoData.symbol} - {demoData.name}</h2>
                <div className="chart-details">
                  <span className="price">${demoData.price}</span>
                  <span className={`change ${demoData.change > 0 ? 'positive' : 'negative'}`}>
                    {demoData.change > 0 ? '+' : ''}{demoData.change.toFixed(2)} ({demoData.changePercent}%)
                  </span>
                  <span className="volume">Vol: {demoData.volume}</span>
                  <span className="high">H: ${demoData.high}</span>
                  <span className="low">L: ${demoData.low}</span>
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
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <g key={i}>
                      <line x1={50 + i * 90} y1={80 + Math.sin(i) * 40} x2={50 + i * 90} y2={220 + Math.cos(i) * 40} stroke="#666" strokeWidth="1" />
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
              <button className="tab-btn">Open Positions ({positions.length})</button>
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
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" defaultValue="10" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" defaultValue={demoData.price} className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Total Value</label>
                  <div className="total-value">${(10 * demoData.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>

                <div className="order-buttons">
                  <button className="btn-buy" disabled={!isConnected}>BUY 10 {demoData.symbol}</button>
                  <button className="btn-sell" disabled={!isConnected}>SELL 10 {demoData.symbol}</button>
                </div>

                <div className="order-summary">
                  <p>Commission: $1.00 | Est. Total: ${(10 * demoData.price + 1).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  {!isConnected && <p style={{color: '#f59e0b'}}>⚠️ Connect to Arqam Capital to place orders</p>}
                </div>
              </div>

              <div className="positions-table">
                {positions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Avg Cost</th>
                        <th>Current</th>
                        <th>Gain/Loss</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(pos => (
                        <tr key={pos.symbol} className="position-row">
                          <td className="symbol">{pos.symbol}</td>
                          <td>{pos.quantity}</td>
                          <td>${pos.entry_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td>${pos.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className={pos.unrealized_pnl >= 0 ? 'positive' : 'negative'}>
                            ${pos.unrealized_pnl?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={pos.unrealized_pnl_percent >= 0 ? 'positive' : 'negative'}>
                            {pos.unrealized_pnl_percent > 0 ? '+' : ''}{pos.unrealized_pnl_percent?.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{padding: '1rem', textAlign: 'center', color: '#cbd5e1'}}>No open positions</p>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Right Sidebar - News & Account */}
        <aside className="sidebar-right">
          <div className="sidebar-section">
            <h3>Connection Status</h3>
            <div style={{padding: '1rem', background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: `3px solid ${isConnected ? '#10b981' : '#ef4444'}`}}>
              <p><strong>{isConnected ? '🟢 Connected' : '🔴 Demo Mode'}</strong></p>
              {isConnected ? (
                <p style={{fontSize: '0.875rem', color: '#10b981'}}>Live trading with Arqam Capital</p>
              ) : (
                <p style={{fontSize: '0.875rem', color: '#ef4444'}}>Add Arqam API credentials to connect</p>
              )}
            </div>
          </div>

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
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Account Status</h3>
            <div className="account-details">
              <div className="detail-item">
                <span>Status</span>
                <span>{isConnected ? '✅ Active' : '⚠️ Demo'}</span>
              </div>
              <div className="detail-item">
                <span>Positions</span>
                <span>{positions.length}</span>
              </div>
              <div className="detail-item">
                <span>Market</span>
                <span>Open (DFM: 10:00-15:00)</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
