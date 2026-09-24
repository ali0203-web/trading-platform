-- SUPABASE DATABASE SCHEMA FOR TRADING PLATFORM
-- Run this in Supabase SQL Editor after creating project

-- 1. CREATE TABLES

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users (id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  initial_balance DECIMAL(15,2) DEFAULT 10000.00,
  current_balance DECIMAL(15,2) DEFAULT 10000.00
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity DECIMAL(10,2) NOT NULL,
  entry_price DECIMAL(10,2) NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_price DECIMAL(10,2),
  exit_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
  pnl DECIMAL(15,2),
  pnl_percent DECIMAL(10,4),
  order_type TEXT CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market data cache
CREATE TABLE IF NOT EXISTS public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  last_price DECIMAL(10,2) NOT NULL,
  open_price DECIMAL(10,2),
  high_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  volume BIGINT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('ABOVE', 'BELOW')),
  target_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio summary
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  total_invested DECIMAL(15,2) DEFAULT 0,
  current_value DECIMAL(15,2) DEFAULT 10000.00,
  total_gain DECIMAL(15,2) DEFAULT 0,
  gain_percent DECIMAL(10,4) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

---

-- 2. CREATE INDEXES FOR PERFORMANCE

CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_symbol ON public.trades(symbol);
CREATE INDEX idx_trades_status ON public.trades(status);
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_market_data_symbol ON public.market_data(symbol);

---

-- 3. ENABLE ROW LEVEL SECURITY (RLS)

-- Users table RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Trades table RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);

-- Watchlists table RLS
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own watchlist" ON public.watchlists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON public.watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON public.watchlists
  FOR DELETE USING (auth.uid() = user_id);

-- Portfolio table RLS
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own portfolio" ON public.portfolio
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio" ON public.portfolio
  FOR UPDATE USING (auth.uid() = user_id);

-- Alerts table RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Market data is public (everyone can read)
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market data is public" ON public.market_data
  FOR SELECT USING (TRUE);

---

-- 4. CREATE FUNCTIONS

-- Function to update portfolio on every trade
CREATE OR REPLACE FUNCTION update_portfolio_after_trade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.portfolio
  SET updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function
CREATE OR REPLACE TRIGGER trigger_update_portfolio
AFTER INSERT OR UPDATE ON public.trades
FOR EACH ROW EXECUTE FUNCTION update_portfolio_after_trade();

---

-- 5. INITIAL DATA (Optional - Sample Stocks)

-- Insert sample market data
INSERT INTO public.market_data (symbol, last_price, open_price, high_price, low_price, volume)
VALUES
  ('AAPL', 150.25, 149.50, 151.00, 149.00, 2500000),
  ('MSFT', 380.50, 378.00, 382.00, 377.50, 1800000),
  ('GOOGL', 140.75, 139.25, 141.50, 138.75, 1200000),
  ('AMZN', 180.30, 179.00, 181.50, 178.50, 1500000),
  ('NVDA', 875.50, 870.00, 880.00, 869.00, 2900000)
ON CONFLICT (symbol) DO UPDATE
SET last_price = EXCLUDED.last_price,
    open_price = EXCLUDED.open_price,
    high_price = EXCLUDED.high_price,
    low_price = EXCLUDED.low_price,
    volume = EXCLUDED.volume,
    updated_at = NOW();

---

-- ✅ SCHEMA SETUP COMPLETE

-- Next steps:
-- 1. Copy this entire SQL
-- 2. Go to Supabase dashboard → SQL Editor
-- 3. Create new query
-- 4. Paste all SQL above
-- 5. Click "Run"
-- 6. All tables created! ✅
