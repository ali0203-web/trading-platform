-- Trading Platform Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TRADES TABLE - Complete trade history
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  entry_price DECIMAL(12,2) NOT NULL,
  entry_time TIMESTAMP DEFAULT NOW(),
  exit_price DECIMAL(12,2),
  exit_time TIMESTAMP,
  quantity INTEGER NOT NULL,
  commission DECIMAL(10,2) DEFAULT 0,
  confidence_score DECIMAL(5,2),
  signal_type TEXT DEFAULT 'MANUAL',
  order_id TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
  exit_reason TEXT CHECK (exit_reason IN ('STOP_LOSS', 'TAKE_PROFIT', 'TIME_STOP', 'MANUAL', NULL)),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- POSITIONS TABLE - Current open positions
CREATE TABLE positions (
  symbol TEXT PRIMARY KEY,
  quantity INTEGER NOT NULL,
  entry_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2) NOT NULL,
  unrealized_pnl DECIMAL(12,2),
  unrealized_pnl_percent DECIMAL(6,2),
  stop_loss DECIMAL(12,2),
  take_profit DECIMAL(12,2),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS TABLE - All order history
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity INTEGER NOT NULL,
  price DECIMAL(12,2),
  order_type TEXT CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED', 'REJECTED')),
  filled_quantity INTEGER DEFAULT 0,
  filled_price DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- DAILY_PERFORMANCE TABLE - Daily performance metrics
CREATE TABLE daily_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  trades_executed INTEGER DEFAULT 0,
  trades_won INTEGER DEFAULT 0,
  trades_lost INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2),
  total_pnl DECIMAL(12,2),
  daily_pnl DECIMAL(12,2),
  max_drawdown DECIMAL(6,2),
  ending_balance DECIMAL(12,2),
  average_confidence DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- WEEKLY_PERFORMANCE TABLE - Weekly summary
CREATE TABLE weekly_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL UNIQUE,
  trades_executed INTEGER DEFAULT 0,
  trades_won INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2),
  total_pnl DECIMAL(12,2),
  max_drawdown DECIMAL(6,2),
  profit_factor DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ALERTS TABLE - Price and system alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT,
  alert_type TEXT CHECK (alert_type IN ('PRICE', 'RISK', 'SIGNAL', 'SYSTEM')),
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PRICE_ALERTS TABLE - User-defined price alerts
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('ABOVE', 'BELOW')),
  is_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  triggered_at TIMESTAMP
);

-- WATCHLIST TABLE - User watchlist
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL UNIQUE,
  added_at TIMESTAMP DEFAULT NOW()
);

-- SIGNAL_ACCURACY TABLE - Track signal performance
CREATE TABLE signal_accuracy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_type TEXT NOT NULL,
  confidence_bucket TEXT CHECK (confidence_bucket IN ('HIGH', 'MEDIUM', 'LOW')),
  win_rate DECIMAL(5,2),
  sample_size INTEGER DEFAULT 0,
  average_pnl DECIMAL(12,2),
  last_updated TIMESTAMP DEFAULT NOW()
);

-- RISK_TRACKING TABLE - Daily risk limits
CREATE TABLE risk_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  daily_loss DECIMAL(12,2) DEFAULT 0,
  daily_limit DECIMAL(12,2) DEFAULT 5000,
  daily_limit_breached BOOLEAN DEFAULT FALSE,
  weekly_loss DECIMAL(12,2) DEFAULT 0,
  weekly_limit DECIMAL(12,2) DEFAULT 15000,
  weekly_limit_breached BOOLEAN DEFAULT FALSE,
  trades_executed INTEGER DEFAULT 0,
  max_trades_daily INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX idx_orders_symbol ON orders(symbol);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_daily_perf_date ON daily_performance(date DESC);
CREATE INDEX idx_risk_tracking_date ON risk_tracking(date DESC);

-- ROW LEVEL SECURITY (RLS) - Restrict to authenticated users
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust based on auth setup)
CREATE POLICY "Allow all" ON trades FOR ALL USING (true);
CREATE POLICY "Allow all" ON positions FOR ALL USING (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON daily_performance FOR ALL USING (true);
CREATE POLICY "Allow all" ON alerts FOR ALL USING (true);

-- SAMPLE DATA
INSERT INTO watchlist (symbol) VALUES 
  ('AAPL'), ('MSFT'), ('GOOGL'), ('AMZN'), ('NVDA');

INSERT INTO price_alerts (symbol, target_price, alert_type) VALUES
  ('AAPL', 230.00, 'ABOVE'),
  ('MSFT', 420.00, 'ABOVE'),
  ('NVDA', 900.00, 'ABOVE');

-- Create view for trade analytics
CREATE VIEW trade_summary AS
SELECT 
  symbol,
  COUNT(*) as total_trades,
  SUM(CASE WHEN side = 'BUY' THEN 1 ELSE 0 END) as buy_count,
  SUM(CASE WHEN side = 'SELL' THEN 1 ELSE 0 END) as sell_count,
  AVG(CASE WHEN status = 'CLOSED' THEN (exit_price - entry_price) ELSE NULL END) as avg_pnl,
  MAX(CASE WHEN status = 'CLOSED' THEN (exit_price - entry_price) ELSE NULL END) as max_pnl
FROM trades
GROUP BY symbol;

-- View for open positions
CREATE VIEW open_positions_view AS
SELECT 
  symbol,
  quantity,
  entry_price,
  current_price,
  (current_price - entry_price) * quantity as unrealized_pnl,
  ((current_price - entry_price) / entry_price * 100) as unrealized_pnl_percent
FROM positions
WHERE quantity > 0;

COMMIT;
