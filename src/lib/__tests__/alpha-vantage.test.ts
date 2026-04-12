import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGlobalQuote, AlphaVantageError } from '../alpha-vantage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const OLD_DATE = '2026-01-15';

function makeQuoteResponse(overrides: Partial<{
  price: string; change: string; changePct: string; tradingDay: string; symbol: string;
}> = {}) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({
      'Global Quote': {
        '01. symbol': overrides.symbol ?? 'IBM',
        '05. price': overrides.price ?? '133.3100',
        '07. latest trading day': overrides.tradingDay ?? TODAY,
        '08. previous close': '133.5000',
        '09. change': overrides.change ?? '-0.1900',
        '10. change percent': overrides.changePct ?? '-0.1423%',
      },
    }),
  };
}

function makeErrResponse(status: number, statusText = 'Error') {
  return { ok: false, status, statusText, json: async () => ({}) };
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['ALPHA_VANTAGE_API_KEY'] = 'test-key';
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env['ALPHA_VANTAGE_API_KEY'];
});

// ─── fetchGlobalQuote — happy path ────────────────────────────────────────────

describe('fetchGlobalQuote', () => {
  it('returns mapped result for a valid response', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse());

    const result = await fetchGlobalQuote('IBM');

    expect(result.value).toBe(133.31);
    expect(result.change_day).toBeCloseTo(-0.19, 4);
    expect(result.change_pct).toBeCloseTo(-0.1423, 4);
    expect(result.source).toBe('alpha_vantage');
    expect(result.direction).toBe('down');
    expect(result.freshness_level).toBe('live');
    expect(result.timestamp).toContain(TODAY);
  });

  it('includes apikey and function in URL', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse());

    await fetchGlobalQuote('IBM');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('apikey=test-key');
    expect(calledUrl).toContain('function=GLOBAL_QUOTE');
    expect(calledUrl).toContain('symbol=IBM');
  });

  it('does NOT retry on error (single fetch call)', async () => {
    mockFetch.mockResolvedValueOnce(makeErrResponse(500, 'Server Error'));

    await expect(fetchGlobalQuote('IBM')).rejects.toThrow(AlphaVantageError);
    expect(mockFetch).toHaveBeenCalledTimes(1); // no retry
  });
});

// ─── Direction mapping ────────────────────────────────────────────────────────

describe('direction mapping', () => {
  it('returns up when change is positive', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ change: '1.50', changePct: '1.12%' }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.direction).toBe('up');
  });

  it('returns down when change is negative', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ change: '-0.19', changePct: '-0.14%' }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.direction).toBe('down');
  });

  it('returns flat when change is zero', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ change: '0.00', changePct: '0.00%' }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.direction).toBe('flat');
  });
});

// ─── Freshness mapping ────────────────────────────────────────────────────────

describe('freshness_level mapping', () => {
  it('returns live for today', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ tradingDay: TODAY }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.freshness_level).toBe('live');
  });

  it('returns stale for yesterday', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ tradingDay: YESTERDAY }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.freshness_level).toBe('stale');
  });

  it('returns very_stale for older dates', async () => {
    mockFetch.mockResolvedValueOnce(makeQuoteResponse({ tradingDay: OLD_DATE }));
    const result = await fetchGlobalQuote('IBM');
    expect(result.freshness_level).toBe('very_stale');
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe('error handling', () => {
  it('throws AlphaVantageError when API key is missing', async () => {
    delete process.env['ALPHA_VANTAGE_API_KEY'];

    await expect(fetchGlobalQuote('IBM')).rejects.toThrow(AlphaVantageError);
    await expect(fetchGlobalQuote('IBM')).rejects.toThrow('ALPHA_VANTAGE_API_KEY is not set');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('throws AlphaVantageError on HTTP 403', async () => {
    mockFetch.mockResolvedValueOnce(makeErrResponse(403, 'Forbidden'));

    const err = await fetchGlobalQuote('IBM').catch((e) => e as AlphaVantageError);
    expect(err).toBeInstanceOf(AlphaVantageError);
    expect(err.status).toBe(403);
  });

  it('throws AlphaVantageError on empty Global Quote (quota exhausted)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ 'Global Quote': {} }),
    });

    await expect(fetchGlobalQuote('IBM')).rejects.toThrow(AlphaVantageError);
    await expect(fetchGlobalQuote('IBM')).rejects.toThrow('empty or missing');
  });

  it('throws AlphaVantageError when Global Quote key is missing entirely', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
    });

    await expect(fetchGlobalQuote('IBM')).rejects.toThrow(AlphaVantageError);
  });
});
