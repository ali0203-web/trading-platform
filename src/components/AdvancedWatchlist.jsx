import React, { useState } from 'react'

export default function AdvancedWatchlist({ onSelectStock }) {
  const [stocks] = useState([
    { symbol: 'AAPL', price: 150.25, change: 2.5 },
    { symbol: 'MSFT', price: 380.50, change: 1.2 },
    { symbol: 'GOOGL', price: 140.75, change: -0.5 },
    { symbol: 'AMZN', price: 170.30, change: 3.1 },
    { symbol: 'NVDA', price: 880.20, change: 4.8 },
  ])

  return (
    <div className="panel-container">
      <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
      <div className="space-y-2">
        {stocks.map(stock => (
          <button
            key={stock.symbol}
            onClick={() => onSelectStock(stock.symbol)}
            className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded flex justify-between items-center transition"
          >
            <span className="font-bold">{stock.symbol}</span>
            <div>
              <span className="mr-4">${stock.price}</span>
              <span className={stock.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {stock.change > 0 ? '+' : ''}{stock.change}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
