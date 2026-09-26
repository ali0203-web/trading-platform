import React from 'react'
import { useDatabase } from '../hooks/useDatabase'

export default function TradesHistory() {
  const { trades, isLoading, isConnected } = useDatabase()

  if (isLoading) return <div className="page-container"><p>Loading trades...</p></div>

  return (
    <div className="page-container">
      <h1>📊 Trade History</h1>
      
      {!isConnected && <p style={{color: '#f59e0b'}}>⚠️ Database not connected</p>}

      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: 'rgba(255,255,255,0.05)', borderBottom: '2px solid #475569'}}>
            <tr>
              <th style={{padding: '12px', textAlign: 'left'}}>Symbol</th>
              <th style={{padding: '12px', textAlign: 'left'}}>Side</th>
              <th style={{padding: '12px', textAlign: 'right'}}>Entry Price</th>
              <th style={{padding: '12px', textAlign: 'right'}}>Exit Price</th>
              <th style={{padding: '12px', textAlign: 'right'}}>Quantity</th>
              <th style={{padding: '12px', textAlign: 'right'}}>P&L</th>
              <th style={{padding: '12px', textAlign: 'center'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left'}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
              trades.map(trade => {
                const pnl = trade.exit_price 
                  ? (trade.exit_price - trade.entry_price) * trade.quantity 
                  : null
                const isProfitable = pnl > 0

                return (
                  <tr key={trade.id} style={{borderBottom: '1px solid #334155'}}>
                    <td style={{padding: '12px', fontWeight: '600', color: '#06b6d4'}}>{trade.symbol}</td>
                    <td style={{padding: '12px'}}>{trade.side}</td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      ${trade.entry_price?.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      {trade.exit_price ? `$${trade.exit_price.toLocaleString('en-US', {minimumFractionDigits: 2})}` : '-'}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right'}}>{trade.quantity}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: pnl === null ? '#cbd5e1' : isProfitable ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {pnl !== null ? `$${pnl.toLocaleString('en-US', {minimumFractionDigits: 2})}` : '-'}
                    </td>
                    <td style={{padding: '12px', textAlign: 'center'}}>
                      <span style={{
                        background: trade.status === 'CLOSED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: trade.status === 'CLOSED' ? '#10b981' : '#3b82f6',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {trade.status}
                      </span>
                    </td>
                    <td style={{padding: '12px', fontSize: '0.875rem', color: '#cbd5e1'}}>
                      {new Date(trade.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" style={{padding: '24px', textAlign: 'center', color: '#cbd5e1'}}>
                  No trades yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
