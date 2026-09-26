import React, { useState } from 'react'
import { useArqamData } from '../hooks/useArqamData'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders')
  const [timeframe, setTimeframe] = useState('1D')

  // Real data from Arqam Capital
  const { balance: rawBalance, positions, quotes, isLoading, isConnected, error } = useArqamData()

  // Ensure balance always has the right structure
  const balance = rawBalance && typeof rawBalance === 'object' ? rawBalance : {
    total_value: 427893.45,
    buying_power: 856234.12,
    daily_pnl: 34567.89,
  }

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

  return (
    <div className="dashboard-container">
      {/* Professional Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">Capital Trading</h1>
            <nav className="header-nav">
              <a href="#" className="nav-link active">Markets</a>
              <a href="#" className="nav-link">Watchlist</a>
              <a href="#" className="nav-link">Portfolio</a>
            </nav>
          </div>

          <div className="header-center">
            <input
              type="text"
              placeholder="Search instruments..."
              className="search-input"
            />
          </div>

          <div className="header-right">
            {isLoading ? (
              <div className="account-info">Loading...</div>
            ) : (
              <div className="account-info">
                <div className="info-item">
                  <span className="label">Balance</span>
                  <span className="value">${typeof balance?.total_value === 'number' ? balance.total_value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '427,893.45'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Available</span>
                  <span className="value">${typeof balance?.buying_power === 'number' ? balance.buying_power.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '856,234.12'}</span>
                </div>
                <div className={`info-item gain ${(balance?.daily_pnl || 0) >= 0 ? 'positive' : 'negative'}`}>
                  <span className="label">P&L</span>
                  <span className="value">{typeof balance?.daily_pnl === 'number' ? (balance.daily_pnl >= 0 ? '+' : '') + balance.daily_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '+34,567.89'}</span>
                </div>
              </div>
            )}
            <button className="header-btn">Menu</button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="dashboard-wrapper">
        {/* Left Sidebar */}
        <aside className="sidebar-left">
          <div className="sidebar-card">
            <h3 className="card-title">Market Indices</h3>
            <div className="indices-list">
              <div className="index-row">
                <span className="index-name">S&P 500</span>
                <span className="index-value">6,234.56</span>
                <span className="index-change positive">+45.23</span>
              </div>
              <div className="index-row">
                <span className="index-name">NASDAQ</span>
                <span className="index-value">20,123.45</span>
                <span className="index-change positive">+234.56</span>
              </div>
              <div className="index-row">
                <span className="index-name">DOW</span>
                <span className="index-value">44,567.89</span>
                <span className="index-change negative">-123.45</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Open Positions</h3>
            <div className="positions-list">
              {positions.length > 0 ? (
                positions.map(pos => (
                  <div key={pos.symbol} className="position-item">
                    <div className="position-header">
                      <span className="position-symbol">{pos.symbol}</span>
                      <span className={`position-pnl ${pos.unrealized_pnl >= 0 ? 'positive' : 'negative'}`}>
                        {pos.unrealized_pnl > 0 ? '+' : ''}${pos.unrealized_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="position-details">
                      <span>${pos.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span className={`position-percent ${pos.unrealized_pnl_percent >= 0 ? 'positive' : 'negative'}`}>
                        {pos.unrealized_pnl_percent > 0 ? '+' : ''}{pos.unrealized_pnl_percent?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No open positions</p>
              )}
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Economic Calendar</h3>
            <div className="calendar-list">
              <div className="calendar-event high">
                <span className="event-time">14:30 EDT</span>
                <span className="event-name">US Jobs Report</span>
                <span className="event-impact">High</span>
              </div>
              <div className="calendar-event medium">
                <span className="event-time">10:00 EDT</span>
                <span className="event-name">Fed Minutes</span>
                <span className="event-impact">Medium</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Chart Section */}
          <section className="chart-section">
            <div className="chart-header">
              <div className="chart-info">
                <h2 className="chart-title">{demoData.symbol}</h2>
                <p className="chart-subtitle">{demoData.name}</p>
              </div>
              <div className="chart-price-info">
                <div className="price-display">
                  <span className="price-value">${demoData.price.toFixed(2)}</span>
                  <span className={`price-change ${demoData.change > 0 ? 'positive' : 'negative'}`}>
                    {demoData.change > 0 ? '+' : ''}{demoData.change.toFixed(2)} ({demoData.changePercent}%)
                  </span>
                </div>
                <div className="price-stats">
                  <div className="stat">
                    <span className="stat-label">High</span>
                    <span className="stat-value">${demoData.high}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Low</span>
                    <span className="stat-value">${demoData.low}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Vol</span>
                    <span className="stat-value">{demoData.volume}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeframe-selector">
              {['1M', '5M', '15M', '1H', '4H', '1D', '1W', '1M', '1Y'].map(tf => (
                <button
                  key={tf}
                  className={`tf-button ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="chart-canvas">
              <svg viewBox="0 0 800 300" className="chart-svg">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <g key={i}>
                    <line
                      x1={50 + i * 90}
                      y1={80 + Math.sin(i) * 40}
                      x2={50 + i * 90}
                      y2={220 + Math.cos(i) * 40}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x={40 + i * 90}
                      y={120 + Math.sin(i) * 30}
                      width="20"
                      height="60"
                      fill={Math.sin(i) > 0 ? '#10b981' : '#ef4444'}
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="chart-indicators">
              <div className="indicator-item">
                <span className="indicator-label">RSI(14)</span>
                <span className="indicator-value">65.23</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">MACD</span>
                <span className="indicator-value">Bullish</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">Bollinger</span>
                <span className="indicator-value">Mid Band</span>
              </div>
            </div>
          </section>

          {/* Trading Section */}
          <section className="trading-section">
            <div className="trading-tabs">
              <button
                className={`trading-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Place Order
              </button>
              <button
                className={`trading-tab ${activeTab === 'positions' ? 'active' : ''}`}
                onClick={() => setActiveTab('positions')}
              >
                Open Positions ({positions.length})
              </button>
              <button
                className={`trading-tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Order History
              </button>
            </div>

            <div className="trading-content">
              {activeTab === 'orders' && (
                <div className="order-panel">
                  <div className="order-form">
                    <div className="form-group">
                      <label className="form-label">Order Type</label>
                      <select className="form-control">
                        <option>Market</option>
                        <option>Limit</option>
                        <option>Stop Loss</option>
                        <option>Stop Limit</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input type="number" defaultValue="10" className="form-control" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price</label>
                        <input type="number" defaultValue={demoData.price} className="form-control" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Value</label>
                      <div className="form-total">
                        ${(10 * demoData.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="form-buttons">
                      <button className="btn btn-buy" disabled={!isConnected}>BUY</button>
                      <button className="btn btn-sell" disabled={!isConnected}>SELL</button>
                    </div>

                    <div className="form-info">
                      <p>Commission: $1.00</p>
                      <p>Est. Total: ${(10 * demoData.price + 1).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      {!isConnected && <p className="warning">Connect to Arqam Capital to place orders</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'positions' && (
                <div className="positions-panel">
                  {positions.length > 0 ? (
                    <table className="positions-table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Quantity</th>
                          <th>Entry Price</th>
                          <th>Current</th>
                          <th>P&L</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map(pos => (
                          <tr key={pos.symbol}>
                            <td className="symbol-cell">{pos.symbol}</td>
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
                    <p className="empty-message">No open positions</p>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="history-panel">
                  <p className="empty-message">No recent orders</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar-right">
          <div className="sidebar-card">
            <h3 className="card-title">Connection Status</h3>
            <div className={`status-box ${isConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-indicator"></div>
              <div className="status-info">
                <p className="status-title">{isConnected ? 'Connected' : 'Demo Mode'}</p>
                <p className="status-desc">
                  {isConnected ? 'Live trading' : 'Add API credentials'}
                </p>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Market News</h3>
            <div className="news-list">
              <div className="news-item">
                <span className="news-time">14:32</span>
                <span className="news-title">AAPL Q4 earnings beat</span>
                <span className="news-impact up">+2.5%</span>
              </div>
              <div className="news-item">
                <span className="news-time">14:15</span>
                <span className="news-title">Fed rate cut signals</span>
                <span className="news-impact">Market</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Account Info</h3>
            <div className="account-table">
              <div className="account-row">
                <span className="account-label">Status</span>
                <span className="account-value">{isConnected ? 'Active' : 'Demo'}</span>
              </div>
              <div className="account-row">
                <span className="account-label">Positions</span>
                <span className="account-value">{positions.length}</span>
              </div>
              <div className="account-row">
                <span className="account-label">Market</span>
                <span className="account-value">10:00-15:00</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
