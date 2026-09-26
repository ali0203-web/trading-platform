import React from 'react'

export default function Alerts() {
  const alerts = [
    { type: 'high-signal', time: '14:32', text: 'AAPL: RSI oversold signal detected (68.2)', color: 'success' },
    { type: 'price-alert', time: '14:15', text: 'MSFT hit $420 target price', color: 'info' },
    { type: 'risk-warning', time: '13:47', text: 'Daily loss limit at 35%, proceed with caution', color: 'warning' },
    { type: 'economic', time: '13:22', text: 'Federal Reserve announcement in 2 hours', color: 'info' },
  ]

  return (
    <div className="page-container">
      <h1>🔔 Alerts & Notifications</h1>
      <div className="alerts-list">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert-item ${alert.color}`}>
            <span className="time">{alert.time}</span>
            <span className="message">{alert.text}</span>
            <button className="dismiss">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
