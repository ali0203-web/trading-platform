/**
 * Supabase Client Configuration
 * PostgreSQL database for trade history, positions, performance
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('count(*)', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connected to Supabase')
    return true
  } catch (err) {
    console.error('❌ Supabase error:', err.message)
    return false
  }
}

export default supabase
