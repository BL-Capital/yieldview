/**
 * Alpha Vantage API client — MARGINAL USE ONLY
 * Free tier: 25 req/day — NO retry logic to preserve quota.
 * This client is commented out by default in fetch-data.ts.
 * Activate only if additional data sources are needed.
 */

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// ─── Error class ─────────────────────────────────────────────────────────────

export class AlphaVantageError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AlphaVantageError';
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlphaVantageQuoteFields {
  '01. symbol': string;
  '05. price': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface AlphaVantageRaw {
  'Global Quote': AlphaVantageQuoteFields | Record<string, never>;
}

export interface AlphaVantageQuoteResult {
  value: number;
  change_day: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
  source: 'alpha_vantage';
  timestamp: string; // ISO 8601 from latest trading day
  freshness_level: 'live' | 'stale' | 'very_stale';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeDirection(changeDay: number): 'up' | 'down' | 'flat' {
  if (changeDay > 0) return 'up';
  if (changeDay < 0) return 'down';
  return 'flat';
}

function computeFreshness(latestTradingDay: string): 'live' | 'stale' | 'very_stale' {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (latestTradingDay === today) return 'live';
  if (latestTradingDay === yesterday) return 'stale';
  return 'very_stale';
}

function mapToKpi(quote: AlphaVantageQuoteFields): AlphaVantageQuoteResult {
  const value = parseFloat(quote['05. price']);
  const changeDay = parseFloat(quote['09. change']);
  const changePct = parseFloat(quote['10. change percent'].replace('%', ''));

  if (!Number.isFinite(value) || !Number.isFinite(changeDay) || !Number.isFinite(changePct)) {
    throw new AlphaVantageError('Alpha Vantage: non-numeric value in Global Quote fields', 0);
  }

  return {
    value,
    change_day: changeDay,
    change_pct: changePct,
    direction: computeDirection(changeDay),
    source: 'alpha_vantage',
    timestamp: new Date(quote['07. latest trading day'] + 'T12:00:00.000Z').toISOString(),
    freshness_level: computeFreshness(quote['07. latest trading day']),
  };
}

// ─── Core fetch — NO RETRY ────────────────────────────────────────────────────

async function alphaVantageFetch<T>(params: Record<string, string>): Promise<T> {
  // No retry — free tier is 25 req/day
  const key = process.env['ALPHA_VANTAGE_API_KEY'];
  if (!key) {
    throw new AlphaVantageError(
      'ALPHA_VANTAGE_API_KEY is not set. Add it to your environment variables.',
      0,
    );
  }

  const query = new URLSearchParams({ ...params, apikey: key }).toString();
  const url = `${ALPHA_VANTAGE_BASE_URL}?${query}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });

  if (!res.ok) {
    throw new AlphaVantageError(
      `Alpha Vantage HTTP ${res.status}: ${res.statusText}`,
      res.status,
    );
  }

  return res.json() as Promise<T>;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch a global quote from Alpha Vantage.
 * WARNING: consumes 1 of 25 daily requests. Use sparingly.
 */
export async function fetchGlobalQuote(symbol: string): Promise<AlphaVantageQuoteResult> {
  const data = await alphaVantageFetch<AlphaVantageRaw>({
    function: 'GLOBAL_QUOTE',
    symbol,
  });

  const quote = data['Global Quote'];
  if (!quote || !('05. price' in quote) || !quote['05. price']) {
    throw new AlphaVantageError(
      `Alpha Vantage: empty or missing "Global Quote" for symbol "${symbol}". Quota may be exhausted.`,
      0,
    );
  }

  return mapToKpi(quote as AlphaVantageQuoteFields);
}
