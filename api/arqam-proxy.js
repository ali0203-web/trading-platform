/**
 * Vercel API Proxy for Arqam Capital
 * Proxies requests from frontend to Arqam API to avoid CORS issues
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { path, method = 'GET', body } = req.body

    if (!path) {
      return res.status(400).json({ error: 'Missing path parameter' })
    }

    const apiKey = process.env.VITE_ARQAM_API_KEY
    const accountId = process.env.VITE_ARQAM_ACCOUNT_ID

    if (!apiKey || !accountId) {
      return res.status(500).json({ error: 'Missing Arqam credentials' })
    }

    const baseURL = 'https://api.arqamcapital.com/v1'
    const url = `${baseURL}${path}`

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Account-ID': accountId,
    }

    console.log(`[ARQAM PROXY] ${method} ${url}`)

    const fetchOptions = {
      method,
      headers,
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    res.status(response.status).json(data)
  } catch (error) {
    console.error('[ARQAM PROXY] Error:', error)
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    })
  }
}
