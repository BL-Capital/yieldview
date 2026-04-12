const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

const RETRY_DELAYS_MS = [1000, 2000, 4000];

// ─── Error class ────────────────────────────────────────────────────────────

export class FinnhubError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'FinnhubError';
  }
}

// ─── Internal types ──────────────────────────────────────────────────────────

interface FinnhubQuoteRaw {
  c: number;  // current price
  d: number;  // change day (absolute)
  dp: number; // change percent
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp UNIX (seconds)
}

export interface FinnhubQuoteResult {
  value: number;
  change_day: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
  source: 'finnhub';
  timestamp: string; // ISO 8601
  freshness_level: 'live' | 'stale' | 'very_stale';
}

export interface FinnhubIndexResult extends FinnhubQuoteResult {
  id: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeDirection(changeDay: number): 'up' | 'down' | 'flat' {
  if (changeDay > 0) return 'up';
  if (changeDay < 0) return 'down';
  return 'flat';
}

function computeFreshness(timestampUnix: number): 'live' | 'stale' | 'very_stale' {
  const ageMinutes = (Date.now() / 1000 - timestampUnix) / 60;
  if (ageMinutes < 15) return 'live';
  if (ageMinutes < 60) return 'stale';
  return 'very_stale';
}

function mapToKpi(raw: FinnhubQuoteRaw): FinnhubQuoteResult {
  return {
    value: raw.c,
    change_day: raw.d,
    change_pct: raw.dp,
    direction: computeDirection(raw.d),
    source: 'finnhub',
    timestamp: new Date(raw.t * 1000).toISOString(),
    freshness_level: computeFreshness(raw.t),
  };
}

// ─── Retry ───────────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  context: { symbol: string },
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const error = err as FinnhubError;
      // No retry on configuration errors (status 0 = missing key)
      if (error.status === 0) throw error;
      // No retry on 4xx except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      lastError = error;
      console.error(
        JSON.stringify({
          level: 'warn',
          msg: 'Finnhub retry',
          attempt,
          symbol: context.symbol,
          status: (error as FinnhubError).status ?? null,
          error: error.message,
        }),
      );
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]));
      }
    }
  }

  throw lastError!;
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function finnhubFetch<T>(path: string): Promise<T> {
  const key = process.env['FINNHUB_API_KEY'];
  if (!key) {
    throw new FinnhubError(
      'FINNHUB_API_KEY is not set. Add it to your environment variables.',
      0,
    );
  }

  const url = `${FINNHUB_BASE_URL}${path}&token=${key}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });

  if (!res.ok) {
    throw new FinnhubError(`Finnhub HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  return res.json() as Promise<T>;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchQuote(symbol: string): Promise<FinnhubQuoteResult> {
  const raw = await withRetry(
    () => finnhubFetch<FinnhubQuoteRaw>(`/quote?symbol=${encodeURIComponent(symbol)}`),
    { symbol },
  );
  return mapToKpi(raw);
}

export async function fetchVIX(): Promise<FinnhubQuoteResult> {
  return fetchQuote('^VIX');
}

export async function fetchDXY(): Promise<FinnhubQuoteResult> {
  return fetchQuote('DX-Y.NYB');
}

const INDICES = [
  { symbol: '^FCHI', id: 'cac40' },
  { symbol: '^GSPC', id: 'sp500' },
  { symbol: '^IXIC', id: 'nasdaq' },
  { symbol: '^GDAXI', id: 'dax' },
] as const;

export async function fetchIndices(): Promise<FinnhubIndexResult[]> {
  return Promise.all(
    INDICES.map(({ symbol, id }) =>
      fetchQuote(symbol).then((result) => ({ ...result, id })),
    ),
  );
}
