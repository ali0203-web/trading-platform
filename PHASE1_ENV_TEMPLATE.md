# Phase 1: Environment Configuration Template

Save this file as `.env.local` in your project root after getting your API keys.

```
# SUPABASE CONFIGURATION
# Get these from: https://app.supabase.com → Settings → API

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# MARKET DATA API
# Get from: https://www.alphavantage.co/api/

VITE_ALPHA_VANTAGE_API_KEY=your-api-key-here

# TRADINGVIEW LIGHTWEIGHT CHARTS
# Free - no key needed, already included in npm package

# APP SETTINGS
VITE_APP_NAME=Trading Platform
VITE_APP_URL=http://localhost:5173

# MARKET DATA REFRESH (minutes)
VITE_MARKET_DATA_REFRESH=5

# DEBUG MODE (true/false)
VITE_DEBUG=true
```

---

## 📋 How to Get Each Key:

### **1. Supabase URL + Anon Key**
1. Go to https://app.supabase.com
2. Click "Create a new project"
3. Name: `trading-platform`
4. Password: Create strong password
5. Region: Choose closest to you
6. Click "Create new project" (wait 2 min for creation)
7. Go to **Settings → API** (left sidebar)
8. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` key (under "Project API keys") → `VITE_SUPABASE_ANON_KEY`

### **2. Alpha Vantage API Key**
1. Go to https://www.alphavantage.co/api/
2. Enter your email
3. Click "GET FREE API KEY"
4. Copy the key → `VITE_ALPHA_VANTAGE_API_KEY`
5. ⚠️ Free tier: 5 requests/minute, 500/day (enough for simulator)

---

## ✅ Verification Checklist

After creating accounts:
- [ ] Supabase URL starts with `https://`
- [ ] Supabase URL ends with `.supabase.co`
- [ ] Anon key is 200+ characters
- [ ] Alpha Vantage key is received
- [ ] `.env.local` file created in project root

**Once complete, send me a message:**
"✅ Phase 1 accounts created. Keys ready."

Then I'll immediately deploy everything.
