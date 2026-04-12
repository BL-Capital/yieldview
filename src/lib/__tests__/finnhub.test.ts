import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchQuote, fetchVIX, fetchDXY, fetchIndices, FinnhubError } from '../finnhub';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NOW_UNIX = Math.floor(Date.now() / 1000);

function makeQuoteRaw(overrides: Partial<{
  c: number; d: number; dp: number; h: number; l: number; o: number; pc: number; t: number;
}> = {}) {
  return {
    c: 18.5,
    d: -1.2,
    dp: -6.09,
    h: 20.1,
    l: 17.9,
    o: 19.7,
    pc: 19.7,
    t: NOW_UNIX - 300, // 5 minutes ago → 'live'
    ...overrides,
  };
}

function mockOk(data: unknown) {
  return { ok: true, status: 200, statusText: 'OK', json: async () => data };
}

function mockErr(status: number, statusText = 'Error') {
  return { ok: false, status, statusText, json: async () => ({}) };
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

const TEST_KEY = 'test-key';

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['FINNHUB_API_KEY'] = TEST_KEY;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  delete process.env['FINNHUB_API_KEY'];
});

// ─── fetchQuote ───────────────────────────────────────────────────────────────

describe('fetchQuote', () => {
  it('returns mapped KPI for a valid response', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw()));

    const result = await fetchQuote('^VIX');

    expect(result.value).toBe(18.5);
    expect(result.change_day).toBe(-1.2);
    expect(result.change_pct).toBe(-6.09);
    expect(result.direction).toBe('down');
    expect(result.source).toBe('finnhub');
    expect(result.freshness_level).toBe('live');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('includes token in URL', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw()));
    await fetchQuote('^VIX');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('token=test-key');
    expect(calledUrl).toContain('%5EVIX');
  });

  it('throws FinnhubError when FINNHUB_API_KEY is missing', async () => {
    delete process.env['FINNHUB_API_KEY'];

    await expect(fetchQuote('^VIX')).rejects.toThrow(FinnhubError);
    await expect(fetchQuote('^VIX')).rejects.toThrow('FINNHUB_API_KEY is not set');
  });

  it('throws FinnhubError on HTTP 400 (no retry)', async () => {
    mockFetch.mockResolvedValue(mockErr(400, 'Bad Request'));

    await expect(fetchQuote('INVALID')).rejects.toThrow(FinnhubError);
    // Only 1 call — no retry on 4xx
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── Direction mapping ────────────────────────────────────────────────────────

describe('direction mapping', () => {
  it('maps positive change to up', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ d: 1.5 })));
    const result = await fetchQuote('^GSPC');
    expect(result.direction).toBe('up');
  });

  it('maps negative change to down', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ d: -0.01 })));
    const result = await fetchQuote('^GSPC');
    expect(result.direction).toBe('down');
  });

  it('maps zero change to flat', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ d: 0 })));
    const result = await fetchQuote('^GSPC');
    expect(result.direction).toBe('flat');
  });
});

// ─── Freshness mapping ────────────────────────────────────────────────────────

describe('freshness_level mapping', () => {
  it('returns live for timestamp < 15 min ago', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ t: NOW_UNIX - 5 * 60 })));
    const result = await fetchQuote('^VIX');
    expect(result.freshness_level).toBe('live');
  });

  it('returns stale for timestamp 15-60 min ago', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ t: NOW_UNIX - 30 * 60 })));
    const result = await fetchQuote('^VIX');
    expect(result.freshness_level).toBe('stale');
  });

  it('returns very_stale for timestamp > 60 min ago', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ t: NOW_UNIX - 90 * 60 })));
    const result = await fetchQuote('^VIX');
    expect(result.freshness_level).toBe('very_stale');
  });
});

// ─── Retry logic ─────────────────────────────────────────────────────────────

describe('retry logic', () => {
  it('retries on 429 and succeeds on 3rd attempt', async () => {
    mockFetch
      .mockResolvedValueOnce(mockErr(429, 'Too Many Requests'))
      .mockResolvedValueOnce(mockErr(429, 'Too Many Requests'))
      .mockResolvedValueOnce(mockOk(makeQuoteRaw()));

    const promise = fetchQuote('^VIX');
    // Advance through the retry delays
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result.value).toBe(18.5);
  });

  it('retries on 503 and succeeds on 2nd attempt', async () => {
    mockFetch
      .mockResolvedValueOnce(mockErr(503, 'Service Unavailable'))
      .mockResolvedValueOnce(mockOk(makeQuoteRaw()));

    const promise = fetchQuote('^VIX');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.value).toBe(18.5);
  });

  it('throws after 3 failed attempts', async () => {
    mockFetch.mockResolvedValue(mockErr(503, 'Service Unavailable'));

    const promise = fetchQuote('^VIX');
    // Attach rejection handler BEFORE running timers to avoid unhandled rejection
    const assertion = expect(promise).rejects.toThrow(FinnhubError);
    await vi.runAllTimersAsync();
    await assertion;

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('does not retry on 400', async () => {
    mockFetch.mockResolvedValue(mockErr(400, 'Bad Request'));

    await expect(fetchQuote('BAD')).rejects.toThrow(FinnhubError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 401 (invalid key)', async () => {
    mockFetch.mockResolvedValue(mockErr(401, 'Unauthorized'));

    await expect(fetchQuote('^VIX')).rejects.toThrow(FinnhubError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

// ─── fetchVIX / fetchDXY ─────────────────────────────────────────────────────

describe('fetchVIX', () => {
  it('fetches VIX using correct symbol', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 22.3 })));
    const result = await fetchVIX();
    expect(result.value).toBe(22.3);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('%5EVIX');
  });
});

describe('fetchDXY', () => {
  it('fetches DXY using correct symbol', async () => {
    mockFetch.mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 104.5 })));
    const result = await fetchDXY();
    expect(result.value).toBe(104.5);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('DX-Y.NYB');
  });
});

// ─── fetchIndices ────────────────────────────────────────────────────────────

describe('fetchIndices', () => {
  it('returns 4 indices in parallel', async () => {
    // Mock 4 calls
    mockFetch
      .mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 8100 }))) // CAC40
      .mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 5200 }))) // S&P500
      .mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 16400 }))) // Nasdaq
      .mockResolvedValueOnce(mockOk(makeQuoteRaw({ c: 18200 }))); // DAX

    const results = await fetchIndices();

    expect(results).toHaveLength(4);
    expect(results[0].id).toBe('cac40');
    expect(results[0].value).toBe(8100);
    expect(results[1].id).toBe('sp500');
    expect(results[2].id).toBe('nasdaq');
    expect(results[3].id).toBe('dax');
  });

  it('each index has source finnhub', async () => {
    mockFetch
      .mockResolvedValue(mockOk(makeQuoteRaw()));

    const results = await fetchIndices();
    results.forEach((r) => expect(r.source).toBe('finnhub'));
  });
});
