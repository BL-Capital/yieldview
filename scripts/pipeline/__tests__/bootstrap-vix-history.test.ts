import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseCandles,
  deduplicateAndSort,
  fetchVixCandles,
  uploadToR2,
  writeLocal,
  BootstrapError,
  type VixPoint,
} from '../bootstrap-vix-history';

// ─── Mock fs ─────────────────────────────────────────────────────────────────

vi.mock('fs', () => ({
  default: {
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

import fs from 'fs';
const mockMkdirSync = vi.mocked(fs.mkdirSync);
const mockWriteFileSync = vi.mocked(fs.writeFileSync);

// ─── Mock fetch ───────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['FINNHUB_API_KEY'] = 'test-key';
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env['FINNHUB_API_KEY'];
  delete process.env['R2_ACCESS_KEY_ID'];
  delete process.env['R2_SECRET_ACCESS_KEY'];
  delete process.env['R2_BUCKET_NAME'];
  delete process.env['R2_ENDPOINT'];
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCandleResponse(overrides: Partial<{ s: string; t: number[]; c: number[] }> = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      s: overrides.s ?? 'ok',
      t: overrides.t ?? [1712000000, 1712086400, 1712172800],
      c: overrides.c ?? [16.52, 17.21, 16.89],
      h: [17.0, 17.8, 17.2],
      l: [15.9, 16.5, 16.1],
      o: [16.1, 17.0, 16.5],
      v: [0, 0, 0],
    }),
  };
}

// ─── parseCandles ─────────────────────────────────────────────────────────────

describe('parseCandles', () => {
  it('maps timestamps to YYYY-MM-DD dates', () => {
    const data = {
      s: 'ok',
      t: [1712000000],
      c: [16.52],
      h: [17.0], l: [15.9], o: [16.1], v: [0],
    };
    const result = parseCandles(data);
    expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result[0].value).toBe(16.52);
  });

  it('rounds values to 2 decimal places', () => {
    const data = {
      s: 'ok',
      t: [1712000000],
      c: [16.5555],
      h: [17.0], l: [15.9], o: [16.1], v: [0],
    };
    const result = parseCandles(data);
    expect(result[0].value).toBe(16.56);
  });

  it('throws on mismatched t/c array lengths', () => {
    const data = {
      s: 'ok',
      t: [1712000000],
      c: [] as number[],
      h: [], l: [], o: [], v: [],
    };
    expect(() => parseCandles(data)).toThrow('mismatch');
  });
});

// ─── deduplicateAndSort ───────────────────────────────────────────────────────

describe('deduplicateAndSort', () => {
  it('sorts chronologically ascending', () => {
    const points: VixPoint[] = [
      { date: '2026-04-12', value: 17.0 },
      { date: '2026-04-10', value: 15.0 },
      { date: '2026-04-11', value: 16.0 },
    ];
    const result = deduplicateAndSort(points);
    expect(result.map((p) => p.date)).toEqual(['2026-04-10', '2026-04-11', '2026-04-12']);
  });

  it('deduplicates by keeping the last value for a given date', () => {
    const points: VixPoint[] = [
      { date: '2026-04-10', value: 15.0 },
      { date: '2026-04-10', value: 16.5 }, // duplicate — last wins
    ];
    const result = deduplicateAndSort(points);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(16.5);
  });

  it('handles empty array', () => {
    expect(deduplicateAndSort([])).toEqual([]);
  });
});

// ─── fetchVixCandles ──────────────────────────────────────────────────────────

describe('fetchVixCandles', () => {
  it('returns VixPoint array on happy path', async () => {
    mockFetch.mockResolvedValueOnce(makeCandleResponse());

    const result = await fetchVixCandles(1712000000, 1743536000);

    expect(result).toHaveLength(3);
    expect(result[0].value).toBe(16.52);
    expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('includes %5EVIX (URL-encoded) and token in URL', async () => {
    mockFetch.mockResolvedValueOnce(makeCandleResponse());

    await fetchVixCandles(1712000000, 1743536000);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('%5EVIX');
    expect(calledUrl).toContain('token=test-key');
    expect(calledUrl).toContain('resolution=D');
  });

  it('throws BootstrapError when FINNHUB_API_KEY is missing', async () => {
    delete process.env['FINNHUB_API_KEY'];

    await expect(fetchVixCandles(1712000000, 1743536000)).rejects.toThrow(BootstrapError);
    await expect(fetchVixCandles(1712000000, 1743536000)).rejects.toThrow('FINNHUB_API_KEY is not set');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('throws BootstrapError when s !== "ok"', async () => {
    vi.useFakeTimers();
    mockFetch.mockResolvedValue(makeCandleResponse({ s: 'no_data' }));

    const promise = expect(fetchVixCandles(1712000000, 1743536000)).rejects.toThrow('no_data');
    await vi.runAllTimersAsync();
    await promise;
    vi.useRealTimers();
  });

  it('throws BootstrapError on HTTP error', async () => {
    vi.useFakeTimers();
    mockFetch.mockResolvedValue({ ok: false, status: 429 });

    const promise = expect(fetchVixCandles(1712000000, 1743536000)).rejects.toThrow(BootstrapError);
    await vi.runAllTimersAsync();
    await promise;
    vi.useRealTimers();
  });
});

// ─── writeLocal ───────────────────────────────────────────────────────────────

describe('writeLocal', () => {
  it('calls mkdirSync and writeFileSync', () => {
    const points: VixPoint[] = [{ date: '2026-04-10', value: 15.0 }];

    writeLocal(points);

    expect(mockMkdirSync).toHaveBeenCalledWith(expect.stringContaining('data'), { recursive: true });
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining('vix-history.json'),
      expect.stringContaining('"2026-04-10"'),
      'utf-8',
    );
  });
});

// ─── uploadToR2 ───────────────────────────────────────────────────────────────

describe('uploadToR2', () => {
  it('skips upload and does not throw when R2 env vars are missing', async () => {
    const points: VixPoint[] = [{ date: '2026-04-10', value: 15.0 }];

    // No R2 env vars set — should complete without error
    await expect(uploadToR2(points)).resolves.toBeUndefined();
  });

  it('skips upload when only some R2 vars are set', async () => {
    process.env['R2_ACCESS_KEY_ID'] = 'key';
    // Missing the others
    const points: VixPoint[] = [{ date: '2026-04-10', value: 15.0 }];

    await expect(uploadToR2(points)).resolves.toBeUndefined();
  });
});
