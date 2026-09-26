# 🗄️ Supabase Database Integration Setup

Complete guide to set up PostgreSQL database for trade history, positions, and analytics.

## Step 1: Create Supabase Project

1. Go to: https://supabase.com
2. Sign up/login with: gendawala1024@gmail.com
3. Create new project:
   - Name: "Trading Platform"
   - Region: "US East" (recommended for speed)
4. Wait for database to be ready (2-3 minutes)

## Step 2: Get Connection Details

1. Go to Project Settings → API
2. Copy these credentials:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)
   - **Service Role Key** (keep this private!)

Example:
```
VITE_SUPABASE_URL=https://sdafdqzvaubrqtxhugko.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy entire `DATABASE_SCHEMA.sql` file
4. Paste into SQL editor
5. Click "Run" to create all tables

**This creates:**
- ✅ 8 tables (trades, positions, orders, alerts, performance, etc.)
- ✅ 6 indexes for fast queries
- ✅ Row-level security policies
- ✅ 2 views for analytics
- ✅ Sample data (watchlist, alerts)

## Step 4: Add Environment Variables

**Local (.env.local):**
```bash
VITE_SUPABASE_URL=https://sdafdqzvaubrqtxhugko.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Production (Vercel):**
1. https://vercel.com/aliasgar/trading-platform-live
2. Settings → Environment Variables
3. Add both variables
4. Deploy

## Step 5: Verify Connection

The platform will automatically:
1. Connect to Supabase
2. Create tables if needed
3. Display "✅ Database Connected" 
4. Start logging trades and positions
5. Track performance metrics

## Available Features

### Trade Logging
```javascript
await DatabaseService.logTrade({
  symbol: 'AAPL',
  side: 'BUY',
  quantity: 10,
  entryPrice: 227.45,
  orderId: 'ORDER_123'
})
```

### Position Tracking
```javascript
await DatabaseService.updatePosition({
  symbol: 'AAPL',
  quantity: 100,
  entryPrice: 150.25,
  currentPrice: 227.45
})
```

### Performance Metrics
```javascript
await DatabaseService.recordDailyPerformance({
  tradesExecuted: 5,
  tradesWon: 3,
  tradesLost: 2,
  totalPnL: 1250.50,
  winRate: 60,
  maxDrawdown: -2.3
})
```

### Trade History
```javascript
const trades = await DatabaseService.getTrades(100, 'CLOSED')
// Returns all closed trades
```

### Alerts
```javascript
await DatabaseService.createAlert({
  symbol: 'AAPL',
  type: 'PRICE',
  message: 'AAPL hit $230 target',
  severity: 'MEDIUM'
})
```

### Real-Time Subscriptions
```javascript
DatabaseService.subscribeToTrades((update) => {
  console.log('New trade:', update)
})

DatabaseService.subscribeToAlerts((alert) => {
  console.log('New alert:', alert)
})
```

## Database Tables

### trades
- Complete trade history
- Entry/exit prices, P&L, signal type
- Real-time updates via WebSocket

### positions
- Currently open positions
- Unrealized P&L tracking
- Stop loss & take profit levels

### orders
- All order executions
- Market, limit, stop orders
- Order status tracking

### daily_performance
- Daily performance metrics
- Win rate, P&L, drawdown
- Performance tracking

### alerts
- Price alerts
- Risk warnings
- System notifications

### price_alerts
- User-defined price targets
- Trigger when reached
- Historical triggers

### watchlist
- Favorite stocks
- Quick access symbols

### signal_accuracy
- Signal type performance
- Win rate by signal
- Confidence analysis

### risk_tracking
- Daily loss limits
- Weekly loss limits
- Risk compliance

## Views & Analytics

### trade_summary
Shows per-symbol statistics:
- Total trades
- Buy/sell counts
- Average P&L
- Max profit

### open_positions_view
Real-time position metrics:
- Quantity per symbol
- Unrealized P&L
- P&L percentage

## Real-Time Features

✅ **Instant Updates:**
- New trades appear in real-time
- Position updates trigger immediately
- Alerts fire as they're created

✅ **Live Subscriptions:**
```javascript
// Listen for new trades
const subscription = DatabaseService.subscribeToTrades((update) => {
  setTrades(prev => [update.new, ...prev])
})

// Cleanup when done
subscription.unsubscribe()
```

## Security

⚠️ **Important:**
- Use Anon Key for frontend (limited access)
- Use Service Role Key only in backend
- Row-level security restricts data access
- All queries go through Supabase API
- Never expose Service Role Key in code

## Backup & Recovery

**Automatic Backups:**
- Supabase auto-backs up daily
- 7 days retention (free tier)
- Manual backups available

**Export Data:**
```bash
# Export trades table as CSV
# Supabase Dashboard → trades → Export as CSV
```

## Troubleshooting

### Connection Failed
- ❌ Check Supabase URL is correct
- ❌ Verify Anon Key is valid
- ❌ Ensure tables are created (run schema SQL)

### Tables Missing
- Go to SQL Editor
- Run DATABASE_SCHEMA.sql again
- Check for error messages

### Slow Queries
- Indexes are created automatically
- If still slow, check query complexity
- Use views for common queries

### Data Not Showing
- Verify RLS policies (should allow all)
- Check browser console for errors
- Ensure you're inserting to correct table

## Performance Optimization

**Query Performance:**
- Indexes created on all foreign keys
- Date fields indexed for range queries
- Symbol indexed for common filters

**Cost Optimization (Free Tier Limits):**
- 500MB database
- 2GB bandwidth/month
- Upgrade as needed

## Next Steps

1. ✅ Create Supabase project
2. ✅ Add connection variables
3. ✅ Run database schema
4. ✅ Platform auto-logs trades
5. ✅ View history in Analytics page
6. ✅ Track performance over time

---

**Status**: Database ready for production
**Last Updated**: 2026-09-26
