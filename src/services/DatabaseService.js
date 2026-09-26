/**
 * Database Service - Handle all Supabase operations
 */

import { supabase } from '../config/supabaseClient'

export class DatabaseService {
  /**
   * TRADES TABLE - Log executed trades
   */
  static async logTrade(trade) {
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([{
          symbol: trade.symbol,
          side: trade.side, // BUY or SELL
          entry_price: trade.entryPrice,
          entry_time: new Date(),
          quantity: trade.quantity,
          confidence_score: trade.confidenceScore || 0,
          signal_type: trade.signalType || 'MANUAL',
          order_id: trade.orderId,
          status: 'OPEN',
        }])

      if (error) throw error
      console.log(`✅ Trade logged: ${trade.side} ${trade.quantity} ${trade.symbol}`)
      return data?.[0]
    } catch (err) {
      console.error('Error logging trade:', err)
      return null
    }
  }

  /**
   * Update trade when closed (with exit price)
   */
  static async closeTrade(tradeId, exitPrice, exitReason) {
    try {
      const { data, error } = await supabase
        .from('trades')
        .update({
          exit_price: exitPrice,
          exit_time: new Date(),
          exit_reason: exitReason, // STOP_LOSS, TAKE_PROFIT, MANUAL
          status: 'CLOSED',
        })
        .eq('id', tradeId)

      if (error) throw error
      console.log(`✅ Trade closed: ${tradeId}`)
      return data?.[0]
    } catch (err) {
      console.error('Error closing trade:', err)
      return null
    }
  }

  /**
   * Get all trades (history)
   */
  static async getTrades(limit = 100, status = 'all') {
    try {
      let query = supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching trades:', err)
      return []
    }
  }

  /**
   * POSITIONS TABLE - Track open positions
   */
  static async updatePosition(position) {
    try {
      const { data, error } = await supabase
        .from('positions')
        .upsert({
          symbol: position.symbol,
          quantity: position.quantity,
          entry_price: position.entryPrice,
          current_price: position.currentPrice,
          unrealized_pnl: position.unrealizedPnL,
          unrealized_pnl_percent: position.unrealizedPnLPercent,
          updated_at: new Date(),
        }, { onConflict: 'symbol' })

      if (error) throw error
      return data?.[0]
    } catch (err) {
      console.error('Error updating position:', err)
      return null
    }
  }

  /**
   * Get all open positions
   */
  static async getPositions() {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .gt('quantity', 0)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching positions:', err)
      return []
    }
  }

  /**
   * PERFORMANCE TABLE - Daily performance tracking
   */
  static async recordDailyPerformance(performance) {
    try {
      const { data, error } = await supabase
        .from('daily_performance')
        .insert([{
          date: new Date().toISOString().split('T')[0],
          trades_executed: performance.tradesExecuted,
          trades_won: performance.tradesWon,
          trades_lost: performance.tradesLost,
          win_rate: performance.winRate,
          total_pnl: performance.totalPnL,
          daily_pnl: performance.dailyPnL,
          max_drawdown: performance.maxDrawdown,
          ending_balance: performance.endingBalance,
          average_confidence: performance.averageConfidence,
        }])

      if (error) throw error
      console.log('✅ Daily performance recorded')
      return data?.[0]
    } catch (err) {
      console.error('Error recording performance:', err)
      return null
    }
  }

  /**
   * Get performance metrics
   */
  static async getPerformance(days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('daily_performance')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching performance:', err)
      return []
    }
  }

  /**
   * ORDERS TABLE - Track all orders
   */
  static async logOrder(order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          symbol: order.symbol,
          side: order.side,
          quantity: order.quantity,
          price: order.price,
          order_type: order.orderType,
          status: order.status || 'PENDING',
          created_at: new Date(),
        }])

      if (error) throw error
      return data?.[0]
    } catch (err) {
      console.error('Error logging order:', err)
      return null
    }
  }

  /**
   * Get recent orders
   */
  static async getOrders(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching orders:', err)
      return []
    }
  }

  /**
   * ALERTS TABLE - Track price and risk alerts
   */
  static async createAlert(alert) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert([{
          symbol: alert.symbol,
          alert_type: alert.type, // PRICE, RISK, SIGNAL
          message: alert.message,
          severity: alert.severity, // LOW, MEDIUM, HIGH
          is_read: false,
          created_at: new Date(),
        }])

      if (error) throw error
      return data?.[0]
    } catch (err) {
      console.error('Error creating alert:', err)
      return null
    }
  }

  /**
   * Get unread alerts
   */
  static async getAlerts(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching alerts:', err)
      return []
    }
  }

  /**
   * Mark alert as read
   */
  static async markAlertRead(alertId) {
    try {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId)

      return true
    } catch (err) {
      console.error('Error marking alert read:', err)
      return false
    }
  }

  /**
   * REAL-TIME SUBSCRIPTIONS
   */
  static subscribeToTrades(callback) {
    return supabase
      .from('trades')
      .on('*', payload => {
        console.log('Trade update:', payload)
        callback(payload)
      })
      .subscribe()
  }

  static subscribeToPositions(callback) {
    return supabase
      .from('positions')
      .on('*', payload => {
        console.log('Position update:', payload)
        callback(payload)
      })
      .subscribe()
  }

  static subscribeToAlerts(callback) {
    return supabase
      .from('alerts')
      .on('INSERT', payload => {
        console.log('New alert:', payload)
        callback(payload)
      })
      .subscribe()
  }
}

export default DatabaseService
