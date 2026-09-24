// ALPHA VANTAGE MARKET DATA INTEGRATION
// Save as: src/services/marketData.js

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetch candlestick data from Alpha Vantage
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @param {string} interval - Interval (1min, 5min, 15min, 30min, 60min, daily)
 * @returns {Promise<Array>} Chart data in TradingView format
 */
export const fetchCandleData = async (symbol, interval = 'daily') => {
  try {
    const params = new URLSearchParams({
      function:
        interval === 'daily' ? 'TIME_SERIES_DAILY' : `TIME_SERIES_INTRADAY`,
      symbol: symbol,
      interval: interval === 'daily' ? undefined : interval,
      apikey: ALPHA_VANTAGE_API_KEY,
      outputsize: 'full', // 'full' returns up to 20 years of data
    });

    // Remove undefined params
    Object.keys(params).forEach(
      (key) => params.get(key) === 'undefined' && params.delete(key)
    );

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();

    if (!data || data['Error Message']) {
      console.error('Alpha Vantage error:', data['Error Message']);
      return [];
    }

    // Parse time series data
    const timeSeries = data[`Time Series (${interval})`] || data['Time Series (Daily)'];
    if (!timeSeries) {
      console.warn('No time series data found');
      return [];
    }

    // Convert to TradingView format
    const chartData = Object.entries(timeSeries)
      .reverse() // Oldest first
      .map(([time, values]) => ({
        time: time,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
      }));

    return chartData;
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return [];
  }
};

/**
 * Fetch real-time quote for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Latest price data
 */
export const fetchQuote = async (symbol) => {
  try {
    const params = new URLSearchParams({
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();

    if (!data['Global Quote']) {
      console.error('No quote found for', symbol);
      return null;
    }

    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      timestamp: new Date().toISOString(),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']),
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
};

/**
 * Fetch multiple symbols at once
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Object>} Map of symbols to quote data
 */
export const fetchMultipleQuotes = async (symbols) => {
  const quotes = {};

  // Fetch sequentially to respect API rate limits
  for (const symbol of symbols) {
    const quote = await fetchQuote(symbol);
    if (quote) {
      quotes[symbol] = quote;
    }
    // Add delay to avoid rate limiting (free tier: 5 requests/min)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return quotes;
};

/**
 * Format price change for display
 * @param {number} price - Current price
 * @param {number} change - Price change amount
 * @param {number} changePercent - Percentage change
 * @returns {Object} Formatted data
 */
export const formatPriceChange = (price, change, changePercent) => {
  return {
    price: price.toFixed(2),
    change: change.toFixed(2),
    changePercent: changePercent.toFixed(2),
    isPositive: change >= 0,
    color: change >= 0 ? '#27ae60' : '#e74c3c',
    arrow: change >= 0 ? '↑' : '↓',
  };
};

---

// USAGE EXAMPLE:

// In your React component:
/*
import { fetchCandleData, fetchQuote } from './services/marketData';

function ChartPage() {
  const [chartData, setChartData] = useState([]);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // Fetch chart data
      const data = await fetchCandleData('AAPL', 'daily');
      setChartData(data);

      // Fetch latest quote
      const q = await fetchQuote('AAPL');
      setQuote(q);
    };

    loadData();
  }, []);

  return (
    <div>
      <TradingChart symbol="AAPL" data={chartData} />
      {quote && <p>Price: ${quote.price}</p>}
    </div>
  );
}
*/

---

// ⚠️ IMPORTANT: API RATE LIMITS

// Free Tier: 5 requests per minute, 500 requests per day
//
// Recommendations:
// 1. Cache data in Supabase to reduce API calls
// 2. Don't refresh charts faster than every 5 minutes
// 3. Use daily data instead of intraday when possible
// 4. Batch requests when fetching multiple symbols

// Next Phase: We'll add Supabase caching to minimize API calls
