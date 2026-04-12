import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseFredObservations,
  deduplicateAndSort,
  fetchVixHistory,
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

// ─── Mock R2 ──────────────────────────────────────────────────────────────────

vi.mock('../../../src/lib/r2.js', () => ({
  uploadJSON: vi.fn(),
}));

import { uploadJSON } from '../../../src/lib/r2.js';
const mockUploadJSON = vi.mocked(uploadJSON);

// ─── Mock fetch ───────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  process.env['FRED_API_KEY'] = 'test-fred-key';
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env['FRED_API_KEY'];
  delete process.env['R2_ACCESS_KEY_ID'];
  delete process.env['R2_SECRET_ACCESS_KEY'];
  delete process.env['R2_BUCKET_NAME'];
  delete process.env['R2_ENDPOINT'];
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFredResponse(observations: { date: string; value: string }[]) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ observations }),
  };
}

// ─── parseFredObservations ────────────────────────────────────────────────────

describe('parseFredObservations', () => {
  it('parses valid observations into VixPoints', () => {
    const result = parseFredObservations([
      { date: '2026-04-10', value: '16.52' },
      { date: '2026-04-11', value: '17.21' },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ date: '2026-04-10', value: 16.52 });
    expect(result[1]).toEqual({ date: '2026-04-11', value: 17.21 });
  });

  it('filters out "." values (weekends/holidays)', () => {
    const result = parseFredObservations([
      { date: '2026-04-10', value: '16.52' },
      { date: '2026-04-11', value: '.' },
      { date: '2026-04-12', value: '.' },
      { date: '2026-04-13', value: '17.21' },
    ]);
    expect(result).toHaveLength(2);
  });

  it('rounds values to 2 decimal places', () => {
    const result = parseFredObservations([
      { date: '2026-04-10', value: '16.5555' },
    ]);
    expect(result[0].value).toBe(16.56);
  });

  it('returns empty array when all values are dots', () => {
    const result = parseFredObservations([
      { date: '2026-04-10', value: '.' },
      { date: '2026-04-11', value: '.' },
    ]);
    expect(result).toEqual([]);
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
      { date: '2026-04-10', value: 16.5 },
    ];
    const result = deduplicateAndSort(points);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(16.5);
  });

  it('handles empty array', () => {
    expect(deduplicateAndSort([])).toEqual([]);
  });
});

// ─── fetchVixHistory ──────────────────────────────────────────────────────────

describe('fetchVixHistory', () => {
  it('returns VixPoint array from FRED VIXCLS', async () => {
    mockFetch.mockResolvedValueOnce(
      makeFredResponse([
        { date: '2026-04-10', value: '16.52' },
        { date: '2026-04-11', value: '.' },
        { date: '2026-04-13', value: '17.21' },
      ]),
    );

    const result = await fetchVixHistory();
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-04-10');
    expect(result[1].value).toBe(17.21);
  });

  it('includes VIXCLS series in URL', async () => {
    mockFetch.mockResolvedValueOnce(
      makeFredResponse([{ date: '2026-04-10', value: '16.52' }]),
    );

    await fetchVixHistory();

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('series_id=VIXCLS');
    expect(calledUrl).toContain('api_key=test-fred-key');
  });

  it('throws BootstrapError when FRED_API_KEY is missing', async () => {
    delete process.env['FRED_API_KEY'];

    await expect(fetchVixHistory()).rejects.toThrow(BootstrapError);
    await expect(fetchVixHistory()).rejects.toThrow('FRED_API_KEY is not set');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('throws BootstrapError on HTTP error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 400, statusText: 'Bad Request' });

    await expect(fetchVixHistory()).rejects.toThrow(BootstrapError);
  });

  it('throws BootstrapError on empty observations', async () => {
    mockFetch.mockResolvedValue(makeFredResponse([]));

    await expect(fetchVixHistory()).rejects.toThrow('empty observations');
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
  it('skips upload when R2 env vars are missing', async () => {
    const points: VixPoint[] = [{ date: '2026-04-10', value: 15.0 }];
    await expect(uploadToR2(points)).resolves.toBeUndefined();
    expect(mockUploadJSON).not.toHaveBeenCalled();
  });

  it('uploads when all R2 env vars are set', async () => {
    process.env['R2_ACCESS_KEY_ID'] = 'key';
    process.env['R2_SECRET_ACCESS_KEY'] = 'secret';
    process.env['R2_BUCKET_NAME'] = 'bucket';
    process.env['R2_ENDPOINT'] = 'https://endpoint';
    mockUploadJSON.mockResolvedValueOnce(undefined);

    const points: VixPoint[] = [{ date: '2026-04-10', value: 15.0 }];
    await uploadToR2(points);

    expect(mockUploadJSON).toHaveBeenCalledWith('vix-history/vix-252d.json', points);
  });
});
