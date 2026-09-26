# 🔌 Arqam Capital API Integration Setup

This guide walks you through connecting your real Arqam Capital trading account to the platform.

## Step 1: Create Arqam Capital Account

1. Go to: https://www.arqamcapital.com
2. Create account with email: `gendawala1024@gmail.com`
3. Complete KYC verification (DFM requirement)
4. Deposit minimum capital (recommended: $100-1000)
5. Get approved for live trading

## Step 2: Generate API Credentials

1. Log in to Arqam Capital dashboard
2. Go to: Settings → API & Webhooks
3. Create new API application:
   - Name: "Trading Platform"
   - Type: "Algorithmic Trading"
   - Permissions: Read + Write (orders, positions, quotes)
4. Copy these credentials:
   - **API Key** (starts with `ak_`)
   - **Account ID** (your Arqam account number)
   - **API Secret** (keep this secure!)

## Step 3: Set Environment Variables

Add to `.env.local`:

```bash
VITE_ARQAM_API_KEY=ak_your_api_key_here
VITE_ARQAM_ACCOUNT_ID=your_account_id_here
VITE_ARQAM_API_SECRET=your_api_secret_here
```

Add to Vercel (Production):

1. Go to: https://vercel.com/aliasgar/trading-platform-live/settings/environment-variables
2. Add three variables:
   - `VITE_ARQAM_API_KEY`
   - `VITE_ARQAM_ACCOUNT_ID`
   - `VITE_ARQAM_API_SECRET`
3. Deploy → Auto-redeploy with new vars

## Step 4: Test Connection

The platform will automatically:

1. ✅ Connect to Arqam Capital on load
2. ✅ Fetch your real account balance
3. ✅ Load your real open positions
4. ✅ Stream live quote updates
5. ✅ Ready for real order placement

## Step 5: Verify Real Data

Check dashboard:
- **Balance**: Should show your real Arqam account balance
- **Positions**: Should show your real holdings
- **Quotes**: Should show live prices
- **Status**: "Connected" indicator in header

## Available Functions

### Get Account Data
```javascript
await arqamAPI.getAccountBalance()    // Balance & equity
await arqamAPI.getOpenPositions()     // Current holdings
await arqamAPI.getTradeHistory()      // All trades
await arqamAPI.getOrders('open')      // Open orders
```

### Place Orders
```javascript
await arqamAPI.placeOrder('AAPL', 'BUY', 10, 'MARKET')      // Market order
await arqamAPI.placeOrder('MSFT', 'SELL', 5, 'LIMIT', 420)  // Limit order
```

### Get Quotes
```javascript
await arqamAPI.getQuote('AAPL')           // Single quote
await arqamAPI.getMultipleQuotes(['AAPL', 'MSFT'])  // Multiple quotes
```

### Real-Time Updates
```javascript
arqamAPI.subscribeToUpdates((data) => {
  console.log('Live update:', data)
})
```

## Troubleshooting

### Connection Failed
- ❌ Check API key is correct
- ❌ Verify account ID matches
- ❌ Ensure Arqam account is approved for API access

### No Positions Showing
- ❌ Verify you have open positions in Arqam
- ❌ Check market is open (DFM: 10:00-15:00 GST)
- ❌ Restart platform

### Orders Not Executing
- ❌ Check buying power is sufficient
- ❌ Verify symbol is valid for DFM
- ❌ Ensure market is open
- ❌ Check daily loss limits not exceeded

### Real-Time Updates Not Working
- ❌ WebSocket may be blocked by firewall
- ❌ Check browser console for connection errors
- ❌ Try refreshing page

## Security Notes

⚠️ **Important:**
- Never commit API keys to GitHub
- Use environment variables only
- Rotate API keys regularly
- Keep API secret safe
- Use read-only keys for analytics
- Monitor all orders in Arqam dashboard

## Arqam Capital API Docs

Full documentation: https://docs.arqamcapital.com/api/v1

Key endpoints used:
- `POST /auth/token` - Authentication
- `GET /account/balance` - Account balance
- `GET /positions/open` - Open positions
- `POST /orders/place` - Place order
- `GET /quotes/{symbol}` - Get quote
- `WSS /stream` - WebSocket updates

## Next Steps

After connecting:
1. Test with small orders first
2. Monitor P&L in Analytics page
3. Set up alerts and risk limits
4. Track performance metrics
5. Expand to more symbols

---

**Status**: Ready for production trading
**Last Updated**: 2026-09-26
