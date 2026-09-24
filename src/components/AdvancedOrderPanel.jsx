import React, { useState } from 'react'

export default function AdvancedOrderPanel({ symbol = 'AAPL' }) {
  const [orderType, setOrderType] = useState('limit')

  return (
    <div className="panel-container">
      <h2 className="text-2xl font-bold mb-4">Place Order - {symbol}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Order Type</label>
          <select 
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded border border-gray-700"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Quantity</label>
          <input type="number" className="w-full bg-gray-800 p-2 rounded border border-gray-700" defaultValue="1" />
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-sm mb-2">Limit Price</label>
            <input type="number" className="w-full bg-gray-800 p-2 rounded border border-gray-700" placeholder="0.00" />
          </div>
        )}

        <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold transition">
          BUY
        </button>
        
        <button className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-bold transition">
          SELL
        </button>
      </div>
    </div>
  )
}
