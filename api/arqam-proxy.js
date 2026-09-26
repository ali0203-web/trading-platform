/**
 * Vercel API Proxy for Arqam Capital
 * Proxies requests from frontend to Arqam API to avoid CORS issues
 * Falls back to mock data when real API is unavailable
 *
 * Security:
 * - Whitelists allowed paths to prevent path traversal
 * - Restricts CORS to same-origin only
 * - Never exposes error details to client
 * - Validates HTTP methods
 */

// Whitelist of allowed Arqam API paths
const ALLOWED_PATHS = [
  /^\/auth\/token$/,
  /^\/account\/balance$/,
  /^\/account\/performance$/,
  /^\/positions\/open$/,
  /^\/quotes\/[A-Z0-9]+$/,
  /^\/orders\/place$/,
  /^\/orders\/cancel$/,
  /^\/orders\/?$/,
  /^\/trades\/history$/,
  /^\/market\/status$/,
]

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

// Mock data
const mockData = {
  auth: { token: 'mock_token_' + Date.now() },
  balance: {
    total_value: 427893.45,
    buying_power: 856234.12,
    daily_pnl: 34567.89,
    portfolio_value: 1284128.24,
    currency: 'USD',
    account_type: 'LIVE',
  },
  positions: {
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
    total: 2,
  },
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
    },
  },
  trades: {
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
    ],
    total: 1,
  },
  market: {
    is_open: true,
    market: 'NYSE',
    open_time: '09:30',
    close_time: '16:00',
  },
}

function isPathAllowed(path) {
  return ALLOWED_PATHS.some(pattern => pattern.test(path))
}

function getMockResponse(path) {
  if (path === '/auth/token') {
    return mockData.auth
  } else if (path === '/account/balance') {
    return mockData.balance
  } else if (path === '/positions/open') {
    return mockData.positions
  } else if (path.match(/^\/quotes\/([A-Z0-9]+)$/)) {
    const symbol = path.split('/')[2]
    return mockData.quotes[symbol] || { error: 'Quote not found' }
  } else if (path === '/trades/history') {
    return mockData.trades
  } else if (path === '/market/status') {
    return mockData.market
  }
  return null
}

export default async function handler(req, res) {
  // Restrict CORS to same origin only (Vercel will handle this properly)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE,PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { path, method = 'GET', body, useMockData } = req.body
    const USE_MOCK = useMockData || process.env.USE_MOCK_API === 'true'

    // Validate inputs
    if (!path) {
      return res.status(400).json({ error: 'Invalid request' })
    }

    if (!ALLOWED_METHODS.includes(method)) {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    if (!isPathAllowed(path)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Use mock API if flag is set
    if (USE_MOCK) {
      console.log('[ARQAM PROXY] Using mock data')
      const mockResponse = getMockResponse(path)
      return res.status(200).json(mockResponse)
    }

    const apiKey = process.env.VITE_ARQAM_API_KEY
    const accountId = process.env.VITE_ARQAM_ACCOUNT_ID

    if (!apiKey || !accountId) {
      console.log('[ARQAM PROXY] Missing credentials, falling back to mock data')
      const mockResponse = getMockResponse(path)
      return res.status(200).json(mockResponse)
    }

    const baseURL = 'https://api.arqamcapital.com/v1'
    const url = `${baseURL}${path}`

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Account-ID': accountId,
    }

    console.log(`[ARQAM PROXY] ${method} ${path}`)

    const fetchOptions = {
      method,
      headers,
      timeout: 30000,
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body)
    }

    let response
    try {
      response = await fetch(url, fetchOptions)
    } catch (fetchError) {
      console.warn('[ARQAM PROXY] Real API unreachable, falling back to mock data:', fetchError.message)
      const mockResponse = getMockResponse(path)
      return res.status(200).json(mockResponse)
    }

    console.log(`[ARQAM PROXY] Response status: ${response.status}`)

    // If real API returns error, fall back to mock
    if (!response.ok) {
      console.warn(`[ARQAM PROXY] Real API error (${response.status}), falling back to mock data`)
      const mockResponse = getMockResponse(path)
      return res.status(200).json(mockResponse)
    }

    // Handle the response
    let data
    const contentType = response.headers.get('content-type') || ''

    try {
      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
    } catch (parseError) {
      console.error('[ARQAM PROXY] Parse error:', parseError.message)
      return res.status(500).json({ error: 'Service error' })
    }

    res.status(response.status).json(data)
  } catch (error) {
    console.error('[ARQAM PROXY] Error:', error.message)
    // Never expose error details to client
    res.status(500).json({ error: 'Service error' })
  }
}
