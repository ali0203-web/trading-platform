/**
 * Mock Arqam Capital API for Testing
 * Returns realistic trading data without requiring real credentials
 */

// Mock database
const mockData = {
  account: {
    total_value: 427893.45,
    buying_power: 856234.12,
    daily_pnl: 34567.89,
    portfolio_value: 1284128.24,
  },
  positions: [
    {
      symbol: 'AAPL',
      quantity: 100,
      entry_price: 220.50,
      current_price: 227.45,
      pl: 690.00,
      pl_percent: 3.15,
    },
    {
      symbol: 'MSFT',
      quantity: 50,
      entry_price: 350.00,
      current_price: 365.25,
      pl: 762.50,
      pl_percent: 4.36,
    },
  ],
  quotes: {
    AAPL: {
      symbol: 'AAPL',
      price: 227.45,
      bid: 227.43,
      ask: 227.47,
      volume: '52.3M',
      high: 230.12,
      low: 225.98,
      change: 2.45,
      change_percent: 1.09,
      timestamp: new Date().toISOString(),
    },
    MSFT: {
      symbol: 'MSFT',
      price: 365.25,
      bid: 365.20,
      ask: 365.30,
      volume: '28.5M',
      high: 368.50,
      low: 363.75,
      change: 5.25,
      change_percent: 1.46,
      timestamp: new Date().toISOString(),
    },
    GOOGL: {
      symbol: 'GOOGL',
      price: 142.85,
      bid: 142.80,
      ask: 142.90,
      volume: '31.2M',
      high: 145.00,
      low: 141.25,
      change: 3.15,
      change_percent: 2.26,
      timestamp: new Date().toISOString(),
    },
  },
  orders: [],
  trades: [
    {
      id: 'TRD-001',
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 100,
      price: 220.50,
      timestamp: '2024-09-26T09:30:00Z',
      status: 'FILLED',
    },
    {
      id: 'TRD-002',
      symbol: 'MSFT',
      side: 'BUY',
      quantity: 50,
      price: 350.00,
      timestamp: '2024-09-26T10:15:00Z',
      status: 'FILLED',
    },
  ],
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE,PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { path, method = 'GET', body } = req.body

    if (!path) {
      return res.status(400).json({ error: 'Missing path parameter' })
    }

    console.log(`[MOCK API] ${method} ${path}`)

    // Route to appropriate mock handler
    if (path === '/auth/token') {
      return handleAuth(res)
    } else if (path === '/account/balance') {
      return handleAccountBalance(res)
    } else if (path === '/positions/open') {
      return handleOpenPositions(res)
    } else if (path.match(/^\/quotes\/[A-Z0-9]+$/)) {
      const symbol = path.split('/')[2]
      return handleQuote(res, symbol)
    } else if (path === '/orders/place') {
      return handlePlaceOrder(res, body)
    } else if (path === '/trades/history') {
      return handleTradeHistory(res)
    } else if (path === '/market/status') {
      return handleMarketStatus(res)
    } else {
      return res.status(404).json({ error: 'Not found' })
    }
  } catch (error) {
    console.error('[MOCK API] Error:', error.message)
    res.status(500).json({ error: 'Service error' })
  }
}

function handleAuth(res) {
  // Simulate token generation
  const token = `mock_token_${Date.now()}`
  res.status(200).json({ token })
}

function handleAccountBalance(res) {
  res.status(200).json({
    ...mockData.account,
    currency: 'USD',
    account_type: 'LIVE',
  })
}

function handleOpenPositions(res) {
  res.status(200).json({
    positions: mockData.positions,
    total: mockData.positions.length,
  })
}

function handleQuote(res, symbol) {
  const quote = mockData.quotes[symbol]
  if (!quote) {
    return res.status(404).json({ error: `Quote not found for ${symbol}` })
  }
  res.status(200).json(quote)
}

function handlePlaceOrder(res, body) {
  const order = {
    order_id: `ORD-${Date.now()}`,
    symbol: body?.symbol,
    side: body?.side,
    quantity: body?.quantity,
    order_type: body?.order_type,
    status: 'PENDING',
    timestamp: new Date().toISOString(),
  }
  res.status(200).json(order)
}

function handleTradeHistory(res) {
  res.status(200).json({
    trades: mockData.trades,
    total: mockData.trades.length,
  })
}

function handleMarketStatus(res) {
  const now = new Date()
  const hours = now.getHours()
  const isOpen = hours >= 9 && hours < 16 && now.getDay() !== 0 && now.getDay() !== 6

  res.status(200).json({
    is_open: isOpen,
    market: 'NYSE',
    open_time: '09:30',
    close_time: '16:00',
    timestamp: now.toISOString(),
  })
}
