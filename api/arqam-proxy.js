/**
 * Vercel API Proxy for Arqam Capital
 * Proxies requests from frontend to Arqam API to avoid CORS issues
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

function isPathAllowed(path) {
  return ALLOWED_PATHS.some(pattern => pattern.test(path))
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
    const { path, method = 'GET', body } = req.body

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

    const apiKey = process.env.VITE_ARQAM_API_KEY
    const accountId = process.env.VITE_ARQAM_ACCOUNT_ID

    if (!apiKey || !accountId) {
      console.error('[ARQAM PROXY] Missing credentials')
      return res.status(500).json({ error: 'Service unavailable' })
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

    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    res.status(response.status).json(data)
  } catch (error) {
    console.error('[ARQAM PROXY] Error:', error.message)
    // Never expose error details to client
    res.status(500).json({ error: 'Service error' })
  }
}
