import React from 'react'

export default function TradingChart({ symbol = 'AAPL' }) {
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-4">{symbol} Chart</h2>
      <div className="bg-gray-800 rounded h-96 flex items-center justify-center">
        <p className="text-gray-400">TradingView Charts - Ready for Integration</p>
      </div>
    </div>
  )
}
