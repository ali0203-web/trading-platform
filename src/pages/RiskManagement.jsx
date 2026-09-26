import React from 'react'

export default function RiskManagement() {
  return (
    <div className="page-container">
      <h1>⚠️ Risk Management</h1>
      <div className="risk-grid">
        <div className="risk-card">
          <h3>Daily Loss Limit</h3>
          <div className="progress-bar">
            <div className="progress" style={{width: '35%'}}></div>
          </div>
          <span>$1,750 / $5,000 (35%)</span>
        </div>
        <div className="risk-card">
          <h3>Weekly Loss Limit</h3>
          <div className="progress-bar">
            <div className="progress" style={{width: '22%'}}></div>
          </div>
          <span>$3,300 / $15,000 (22%)</span>
        </div>
        <div className="risk-card">
          <h3>Max Drawdown</h3>
          <div className="progress-bar">
            <div className="progress" style={{width: '12%'}}></div>
          </div>
          <span>-4.2% (Limit: -10%)</span>
        </div>
        <div className="risk-card">
          <h3>Position Sizing</h3>
          <div className="progress-bar">
            <div className="progress" style={{width: '45%'}}></div>
          </div>
          <span>2% risk per trade (Max: 2%)</span>
        </div>
      </div>
    </div>
  )
}
