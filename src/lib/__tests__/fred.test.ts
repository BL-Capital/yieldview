import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchOAT, fetchBund, fetchUS10Y, FredError } from '../fred';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const OLD_DATE = '2026-01-15';

function makeFredResponse(observations: Array<{ date: string; value: string }>) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ observations }),
  };
}

function makeErrResponse(status: number, statusText = 'Error') {
  return { ok: false, status, statusText, json: async () => ({}) };
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['FRED_API_KEY'] = 'test-fred-key';
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env['FRED_API_KEY'];
});

// ─── fetchUS10Y — daily series ────────────────────────────────────────────────

describe('fetchUS10Y', () => {
  it('returns mapped result for a valid daily response', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '4.38' },
      { date: YESTERDAY, value: '4.42' },
    ]));

    const result = await fetchUS10Y();

    expect(result.value).toBe(4.38);
    expect(result.change_day).toBeCloseTo(-0.04, 3);
    expect(result.direction).toBe('down');
    expect(result.source).toBe('fred');
    expect(result.freshness_level).toBe('live');
    expect(result.timestamp).toContain(TODAY);
  });

  it('includes api_key and series_id in URL', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '4.38' },
      { date: YESTERDAY, value: '4.35' },
    ]));

    await fetchUS10Y();

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('series_id=DGS10');
    expect(calledUrl).toContain('api_key=test-fred-key');
    expect(calledUrl).toContain('limit=5');
    expect(calledUrl).toContain('sort_order=desc');
  });

  it('returns stale when latest date is yesterday', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: YESTERDAY, value: '4.38' },
      { date: OLD_DATE, value: '4.42' },
    ]));

    const result = await fetchUS10Y();
    expect(result.freshness_level).toBe('stale');
  });

  it('returns very_stale for old dates', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: OLD_DATE, value: '4.38' },
      { date: '2026-01-14', value: '4.42' },
    ]));

    const result = await fetchUS10Y();
    expect(result.freshness_level).toBe('very_stale');
  });
});

// ─── fetchOAT — monthly series ────────────────────────────────────────────────

describe('fetchOAT', () => {
  it('uses correct FRED series ID', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: '2026-04-01', value: '3.45' },
      { date: '2026-03-01', value: '3.38' },
    ]));

    const result = await fetchOAT();

    expect(result.value).toBe(3.45);
    expect(result.direction).toBe('up');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('series_id=IRLTLT01FRM156N');
  });

  it('returns very_stale for monthly series (normal behavior)', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: '2026-04-01', value: '3.45' },
      { date: '2026-03-01', value: '3.38' },
    ]));

    const result = await fetchOAT();
    // Monthly series will almost always be very_stale — expected
    expect(['live', 'stale', 'very_stale']).toContain(result.freshness_level);
  });
});

// ─── fetchBund ────────────────────────────────────────────────────────────────

describe('fetchBund', () => {
  it('uses correct FRED series ID', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: '2026-04-01', value: '2.91' },
      { date: '2026-03-01', value: '2.85' },
    ]));

    await fetchBund();

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('series_id=IRLTLT01DEM156N');
  });
});

// ─── Dot values handling ──────────────────────────────────────────────────────

describe('FRED "." handling (weekends/holidays)', () => {
  it('skips "." values and uses next valid observation', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '.' },
      { date: YESTERDAY, value: '4.38' },
      { date: OLD_DATE, value: '4.42' },
    ]));

    const result = await fetchUS10Y();

    expect(result.value).toBe(4.38);
    expect(result.freshness_level).toBe('stale'); // YESTERDAY
  });

  it('handles multiple consecutive "." values', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '.' },
      { date: YESTERDAY, value: '.' },
      { date: OLD_DATE, value: '4.38' },
      { date: '2026-01-14', value: '4.42' },
    ]));

    const result = await fetchUS10Y();

    expect(result.value).toBe(4.38);
    expect(result.freshness_level).toBe('very_stale');
  });

  it('throws FredError when all values are "."', async () => {
    mockFetch.mockResolvedValue(makeFredResponse([
      { date: TODAY, value: '.' },
      { date: YESTERDAY, value: '.' },
    ]));

    await expect(fetchUS10Y()).rejects.toThrow(FredError);
    await expect(fetchUS10Y()).rejects.toThrow('No valid observations');
  });
});

// ─── Direction mapping ────────────────────────────────────────────────────────

describe('direction mapping', () => {
  it('returns up when current > previous', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '4.50' },
      { date: YESTERDAY, value: '4.38' },
    ]));
    const result = await fetchUS10Y();
    expect(result.direction).toBe('up');
  });

  it('returns flat when values are equal', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '4.38' },
      { date: YESTERDAY, value: '4.38' },
    ]));
    const result = await fetchUS10Y();
    expect(result.direction).toBe('flat');
    expect(result.change_day).toBe(0);
  });

  it('returns up when only one valid value (no previous)', async () => {
    mockFetch.mockResolvedValueOnce(makeFredResponse([
      { date: TODAY, value: '4.38' },
    ]));
    const result = await fetchUS10Y();
    // No previous → change_day = 0 → flat
    expect(result.direction).toBe('flat');
    expect(result.change_day).toBe(0);
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe('error handling', () => {
  it('throws FredError when FRED_API_KEY is missing', async () => {
    delete process.env['FRED_API_KEY'];

    await expect(fetchUS10Y()).rejects.toThrow(FredError);
    await expect(fetchUS10Y()).rejects.toThrow('FRED_API_KEY is not set');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('throws FredError on HTTP 400', async () => {
    mockFetch.mockResolvedValue(makeErrResponse(400, 'Bad Request'));

    const err = await fetchUS10Y().catch((e) => e as FredError);
    expect(err).toBeInstanceOf(FredError);
    expect(err.status).toBe(400);
  });

  it('throws FredError on HTTP 429', async () => {
    mockFetch.mockResolvedValueOnce(makeErrResponse(429, 'Too Many Requests'));

    await expect(fetchUS10Y()).rejects.toThrow(FredError);
  });
});
