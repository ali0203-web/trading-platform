import React from 'react'

export default function Overview() {
  return (
    <div className="page-container">
      <h1>📊 Portfolio Overview</h1>
      <div className="equity-curve">
        <div className="chart-placeholder">Real-time equity curve (connected to Supabase)</div>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <span>Total Balance</span>
          <span className="value">$427,893.45</span>
        </div>
        <div className="metric-card">
          <span>Day Gain/Loss</span>
          <span className="value positive">+$2,345.67 (+0.55%)</span>
        </div>
        <div className="metric-card">
          <span>Total Return</span>
          <span className="value positive">+$34,567.89 (+8.76%)</span>
        </div>
        <div className="metric-card">
          <span>Win Rate</span>
          <span className="value">67.3%</span>
        </div>
      </div>
    </div>
  )
}
