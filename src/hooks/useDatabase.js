import { useState, useEffect } from 'react'
import { DatabaseService } from '../services/DatabaseService'

/**
 * Hook for database operations and real-time updates
 */
export function useDatabase() {
  const [trades, setTrades] = useState([])
  const [positions, setPositions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [performance, setPerformance] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load initial data
        const [tradesData, positionsData, alertsData, perfData] = await Promise.all([
          DatabaseService.getTrades(50),
          DatabaseService.getPositions(),
          DatabaseService.getAlerts(20),
          DatabaseService.getPerformance(7),
        ])

        setTrades(tradesData)
        setPositions(positionsData)
        setAlerts(alertsData)
        setPerformance(perfData)
        setIsConnected(true)

        // Subscribe to real-time updates
        const tradesSubscription = DatabaseService.subscribeToTrades((update) => {
          if (update.eventType === 'INSERT') {
            setTrades(prev => [update.new, ...prev].slice(0, 50))
          }
        })

        const positionsSubscription = DatabaseService.subscribeToPositions((update) => {
          if (update.eventType === 'INSERT' || update.eventType === 'UPDATE') {
            setPositions(prev => [...prev])
          }
        })

        const alertsSubscription = DatabaseService.subscribeToAlerts((update) => {
          if (update.eventType === 'INSERT') {
            setAlerts(prev => [update.new, ...prev].slice(0, 20))
          }
        })

        return () => {
          tradesSubscription?.unsubscribe()
          positionsSubscription?.unsubscribe()
          alertsSubscription?.unsubscribe()
        }
      } catch (err) {
        console.error('Error initializing database:', err)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  const logTrade = async (trade) => {
    const result = await DatabaseService.logTrade(trade)
    if (result) {
      setTrades(prev => [result, ...prev])
    }
    return result
  }

  const updatePosition = async (position) => {
    return await DatabaseService.updatePosition(position)
  }

  const createAlert = async (alert) => {
    const result = await DatabaseService.createAlert(alert)
    if (result) {
      setAlerts(prev => [result, ...prev])
    }
    return result
  }

  return {
    trades,
    positions,
    alerts,
    performance,
    isConnected,
    isLoading,
    logTrade,
    updatePosition,
    createAlert,
  }
}

export default useDatabase
