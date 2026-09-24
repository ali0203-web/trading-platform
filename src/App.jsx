import React, { useState, useEffect } from 'react'
import './App.css'
import TradingChart from './components/TradingChart'
import AdvancedWatchlist from './components/AdvancedWatchlist'
import AdvancedOrderPanel from './components/AdvancedOrderPanel'

export default function App() {
  const [selectedStock, setSelectedStock] = useState('AAPL')

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Trading Platform</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TradingChart symbol={selectedStock} />
          </div>
          <div>
            <AdvancedOrderPanel symbol={selectedStock} />
          </div>
        </div>
        
        <div className="mt-8">
          <AdvancedWatchlist onSelectStock={setSelectedStock} />
        </div>
      </div>
    </div>
  )
}
