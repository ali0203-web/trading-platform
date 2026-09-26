import React from 'react'

export default function Analytics() {
  return (
    <div className="page-container">
      <h1>📊 Trading Analytics</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Win Rate by Signal Type</h3>
          <div className="chart-placeholder">Chart showing signal accuracy</div>
        </div>
        <div className="analytics-card">
          <h3>P&L Distribution</h3>
          <div className="chart-placeholder">Histogram of trade outcomes</div>
        </div>
        <div className="analytics-card">
          <h3>Monthly Performance</h3>
          <div className="chart-placeholder">Monthly returns chart</div>
        </div>
        <div className="analytics-card">
          <h3>Sharpe Ratio Tracking</h3>
          <div className="chart-placeholder">Risk-adjusted returns</div>
        </div>
      </div>
    </div>
  )
}
