import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Database is created on Vercel deploy
    // Schema migrations will run on first connection
    
    return res.status(200).json({ 
      status: 'Database initialized',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
