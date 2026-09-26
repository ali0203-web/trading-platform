import { useState, useEffect } from 'react'
import { arqamAPI } from '../services/ArqamAPI'

/**
 * Custom hook for real-time Arqam data
 */
export function useArqamData() {
  const [balance, setBalance] = useState(null)
  const [positions, setPositions] = useState([])
  const [quotes, setQuotes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        // Connect to Arqam
        const connected = await arqamAPI.validate()
        setIsConnected(connected)

        if (connected) {
          // Fetch initial data
          const [balanceData, positionsData] = await Promise.all([
            arqamAPI.getAccountBalance(),
            arqamAPI.getOpenPositions(),
          ])

          setBalance(balanceData)
          setPositions(positionsData || [])

          // Fetch quotes for all positions
          const symbols = positionsData?.map(p => p.symbol) || []
          if (symbols.length > 0) {
            const quotesData = await arqamAPI.getMultipleQuotes(symbols)
            const quotesMap = {}
            quotesData.forEach(quote => {
              quotesMap[quote.symbol] = quote
            })
            setQuotes(quotesMap)
          }

          // Subscribe to real-time updates
          arqamAPI.subscribeToUpdates((data) => {
            if (data.type === 'position_update') {
              setPositions(prev => [...prev, data.position])
            } else if (data.type === 'quote_update') {
              setQuotes(prev => ({ ...prev, [data.symbol]: data }))
            } else if (data.type === 'balance_update') {
              setBalance(data)
            }
          })
        } else {
          setError('Failed to connect to Arqam Capital')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error initializing Arqam data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  return { balance, positions, quotes, isLoading, isConnected, error }
}

export default useArqamData
