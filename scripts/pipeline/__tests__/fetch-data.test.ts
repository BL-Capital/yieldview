import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeSpreads, buildKpis, fetchAllMarketData, PipelineError } from '../fetch-data';

// ─── Mock API clients ─────────────────────────────────────────────────────────

vi.mock('../../../src/lib/finnhub', () => ({
  fetchVIX: vi.fn(),
  fetchDXY: vi.fn(),
  fetchIndices: vi.fn(),
}));

vi.mock('../../../src/lib/fred', () => ({
  fetchOAT: vi.fn(),
  fetchBund: vi.fn(),
  fetchUS10Y: vi.fn(),
}));

import { fetchVIX, fetchDXY, fetchIndices } from '../../../src/lib/finnhub';
import { fetchOAT, fetchBund, fetchUS10Y } from '../../../src/lib/fred';

const mockFetchVIX = vi.mocked(fetchVIX);
const mockFetchDXY = vi.mocked(fetchDXY);
const mockFetchIndices = vi.mocked(fetchIndices);
const mockFetchOAT = vi.mocked(fetchOAT);
const mockFetchBund = vi.mocked(fetchBund);
const mockFetchUS10Y = vi.mocked(fetchUS10Y);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NOW_ISO = new Date().toISOString();

function makeQuote(value: number, changeDay = 0): ReturnType<typeof fetchVIX> extends Promise<infer T> ? T : never {
  return {
    value,
    change_day: changeDay,
    change_pct: 0,
    direction: changeDay > 0 ? 'up' : changeDay < 0 ? 'down' : 'flat',
    source: 'finnhub',
    timestamp: NOW_ISO,
    freshness_level: 'live',
  } as never;
}

function makeFredResult(value: number): ReturnType<typeof fetchOAT> extends Promise<infer T> ? T : never {
  return {
    value,
    change_day: 0,
    change_pct: 0,
    direction: 'flat',
    source: 'fred',
    timestamp: NOW_ISO,
    freshness_level: 'very_stale', // monthly series
  } as never;
}

function setupHappyPath() {
  mockFetchVIX.mockResolvedValue(makeQuote(18.5, -1.2));
  mockFetchDXY.mockResolvedValue(makeQuote(104.5, 0.3));
  mockFetchIndices.mockResolvedValue([
    { ...makeQuote(8100, 50), id: 'cac40' },
    { ...makeQuote(5200, -10), id: 'sp500' },
    { ...makeQuote(16400, 20), id: 'nasdaq' },
    { ...makeQuote(18200, -30), id: 'dax' },
  ]);
  mockFetchOAT.mockResolvedValue(makeFredResult(3.45));
  mockFetchBund.mockResolvedValue(makeFredResult(2.91));
  mockFetchUS10Y.mockResolvedValue(makeFredResult(4.38));
}

// ─── R2 fallback mock ────────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['R2_PUBLIC_URL'] = 'https://cdn.example.com';
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env['R2_PUBLIC_URL'];
});

// ─── computeSpreads ───────────────────────────────────────────────────────────

describe('computeSpreads', () => {
  it('computes positive OAT-Bund spread in bps', () => {
    const result = computeSpreads(3.45, 2.91, 4.38, 'very_stale', NOW_ISO);
    expect(result.spread_oat_bund.value).toBe(54); // (3.45 - 2.91) * 100
    expect(result.spread_oat_bund.direction).toBe('up');
    expect(result.spread_oat_bund.source).toBe('calculated');
  });

  it('computes negative Bund-US spread in bps', () => {
    const result = computeSpreads(3.45, 2.91, 4.38, 'live', NOW_ISO);
    expect(result.spread_bund_us.value).toBe(-147); // (2.91 - 4.38) * 100
    expect(result.spread_bund_us.direction).toBe('down');
  });

  it('returns flat direction when spread is zero', () => {
    const result = computeSpreads(3.0, 3.0, 4.0, 'live', NOW_ISO);
    expect(result.spread_oat_bund.value).toBe(0);
    expect(result.spread_oat_bund.direction).toBe('flat');
  });

  it('rounds to 2 decimal places', () => {
    // 3.457 - 2.912 = 0.545 → 54.5 bps
    const result = computeSpreads(3.457, 2.912, 4.0, 'live', NOW_ISO);
    expect(result.spread_oat_bund.value).toBe(54.5);
  });

  it('inherits freshness_level from FRED data', () => {
    const result = computeSpreads(3.45, 2.91, 4.38, 'stale', NOW_ISO);
    expect(result.spread_oat_bund.freshness_level).toBe('stale');
    expect(result.spread_bund_us.freshness_level).toBe('stale');
  });
});

// ─── fetchAllMarketData ───────────────────────────────────────────────────────

describe('fetchAllMarketData', () => {
  it('returns Finnhub + FRED data on happy path', async () => {
    setupHappyPath();

    const { finnhub, fred } = await fetchAllMarketData();

    expect('vix' in finnhub).toBe(true);
    expect('oat_10y' in fred).toBe(true);
  });

  it('activates R2 fallback when Finnhub fails', async () => {
    mockFetchVIX.mockRejectedValue(new Error('Finnhub down'));
    mockFetchDXY.mockRejectedValue(new Error('Finnhub down'));
    mockFetchIndices.mockRejectedValue(new Error('Finnhub down'));
    mockFetchOAT.mockResolvedValue(makeFredResult(3.45));
    mockFetchBund.mockResolvedValue(makeFredResult(2.91));
    mockFetchUS10Y.mockResolvedValue(makeFredResult(4.38));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        kpis: [
          { id: 'vix', source: 'finnhub', value: 20.0, change_day: 0, change_pct: 0, direction: 'flat', category: 'volatility', unit: '', label: { fr: 'VIX', en: 'VIX' }, timestamp: NOW_ISO, freshness_level: 'stale' },
        ],
      }),
    });

    const { finnhub } = await fetchAllMarketData();
    expect('fallback' in finnhub).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('https://cdn.example.com/latest.json');
  });

  it('activates R2 fallback when FRED fails', async () => {
    setupHappyPath();
    mockFetchOAT.mockRejectedValue(new Error('FRED down'));
    mockFetchBund.mockRejectedValue(new Error('FRED down'));
    mockFetchUS10Y.mockRejectedValue(new Error('FRED down'));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ kpis: [{ id: 'oat_10y', source: 'fred', value: 3.4, change_day: 0, change_pct: 0, direction: 'flat', category: 'rates', unit: '%', label: { fr: 'OAT', en: 'OAT' }, timestamp: NOW_ISO, freshness_level: 'very_stale' }] }),
    });

    const { fred } = await fetchAllMarketData();
    expect('fallback' in fred).toBe(true);
  });

  it('throws PipelineError when R2 is also unavailable', async () => {
    mockFetchVIX.mockRejectedValue(new Error('Finnhub down'));
    mockFetchDXY.mockRejectedValue(new Error('Finnhub down'));
    mockFetchIndices.mockRejectedValue(new Error('Finnhub down'));
    mockFetchOAT.mockResolvedValue(makeFredResult(3.45));
    mockFetchBund.mockResolvedValue(makeFredResult(2.91));
    mockFetchUS10Y.mockResolvedValue(makeFredResult(4.38));

    mockFetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) });

    await expect(fetchAllMarketData()).rejects.toThrow(PipelineError);
  });

  it('throws PipelineError when R2_PUBLIC_URL is missing', async () => {
    delete process.env['R2_PUBLIC_URL'];
    mockFetchVIX.mockRejectedValue(new Error('Finnhub down'));
    mockFetchDXY.mockRejectedValue(new Error('Finnhub down'));
    mockFetchIndices.mockRejectedValue(new Error('Finnhub down'));
    mockFetchOAT.mockResolvedValue(makeFredResult(3.45));
    mockFetchBund.mockResolvedValue(makeFredResult(2.91));
    mockFetchUS10Y.mockResolvedValue(makeFredResult(4.38));

    await expect(fetchAllMarketData()).rejects.toThrow('R2_PUBLIC_URL is not set');
  });
});

// ─── buildKpis ────────────────────────────────────────────────────────────────

describe('buildKpis', () => {
  it('generates 11 KPIs on happy path', async () => {
    setupHappyPath();

    const { kpis, fetchedAt } = await buildKpis();

    expect(kpis).toHaveLength(11);
    expect(fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('all KPIs have bilingual labels', async () => {
    setupHappyPath();

    const { kpis } = await buildKpis();

    for (const kpi of kpis) {
      expect(kpi.label.fr).toBeTruthy();
      expect(kpi.label.en).toBeTruthy();
    }
  });

  it('includes spread KPIs with source=calculated', async () => {
    setupHappyPath();

    const { kpis } = await buildKpis();

    const oatBund = kpis.find((k) => k.id === 'spread_oat_bund');
    const bundUs = kpis.find((k) => k.id === 'spread_bund_us');

    expect(oatBund).toBeDefined();
    expect(oatBund?.source).toBe('calculated');
    expect(oatBund?.category).toBe('spreads');
    expect(oatBund?.unit).toBe('bps');

    expect(bundUs).toBeDefined();
    expect(bundUs?.source).toBe('calculated');
  });

  it('excludes invalid KPIs silently (no throw)', async () => {
    setupHappyPath();
    // Override one mock to return an invalid value that won't pass KpiSchema
    mockFetchVIX.mockResolvedValue({
      value: 'not-a-number' as unknown as number, // invalid
      change_day: 0,
      change_pct: 0,
      direction: 'flat',
      source: 'finnhub',
      timestamp: NOW_ISO,
      freshness_level: 'live',
    });

    const { kpis } = await buildKpis();

    // vix should be excluded, rest present
    expect(kpis.find((k) => k.id === 'vix')).toBeUndefined();
    expect(kpis.length).toBe(10); // 11 - 1 invalid
  });
});
