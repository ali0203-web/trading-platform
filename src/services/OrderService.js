import { arqamAPI } from './ArqamAPI'

/**
 * Order Service - Handles trade execution
 */
export class OrderService {
  /**
   * Place a market order
   */
  static async buyMarket(symbol, quantity) {
    return arqamAPI.placeOrder(symbol, 'BUY', quantity, 'MARKET')
  }

  static async sellMarket(symbol, quantity) {
    return arqamAPI.placeOrder(symbol, 'SELL', quantity, 'MARKET')
  }

  /**
   * Place a limit order
   */
  static async buyLimit(symbol, quantity, limitPrice) {
    return arqamAPI.placeOrder(symbol, 'BUY', quantity, 'LIMIT', limitPrice)
  }

  static async sellLimit(symbol, quantity, limitPrice) {
    return arqamAPI.placeOrder(symbol, 'SELL', quantity, 'LIMIT', limitPrice)
  }

  /**
   * Place a stop loss order
   */
  static async stopLoss(symbol, quantity, stopPrice) {
    return arqamAPI.placeOrder(symbol, 'SELL', quantity, 'STOP', stopPrice)
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId) {
    return arqamAPI.cancelOrder(orderId)
  }

  /**
   * Get all open orders
   */
  static async getOpenOrders() {
    return arqamAPI.getOrders('open')
  }

  /**
   * Get closed orders
   */
  static async getClosedOrders() {
    return arqamAPI.getOrders('closed')
  }

  /**
   * Calculate position P&L
   */
  static calculatePnL(entryPrice, currentPrice, quantity, side) {
    const priceDiff = currentPrice - entryPrice
    const pnl = side === 'BUY' ? priceDiff * quantity : priceDiff * quantity * -1
    const pnlPercent = (priceDiff / entryPrice) * 100
    return { pnl, pnlPercent }
  }
}

export default OrderService
