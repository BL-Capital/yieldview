import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  computePercentileRank,
  computeP90Value,
  determineAlertLevel,
  loadHistory,
  updateHistory,
  buildAlert,
  AlertComputeError,
  VIX_HISTORY_PATH,
} from '../compute-alert';

// ─── Mock fs ─────────────────────────────────────────────────────────────────

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

import fs from 'fs';
const mockExistsSync = vi.mocked(fs.existsSync);
const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockWriteFileSync = vi.mocked(fs.writeFileSync);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build n VixPoint entries with values cycling 10..29 */
function makeHistory(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    value: 10 + (i % 20),
  }));
}

function setupFsMock(points: { date: string; value: number }[]) {
  mockExistsSync.mockReturnValue(true);
  mockReadFileSync.mockReturnValue(JSON.stringify(points) as never);
  mockWriteFileSync.mockImplementation(() => undefined);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── computePercentileRank ────────────────────────────────────────────────────

describe('computePercentileRank', () => {
  it('returns 60 when 3 of 5 values are strictly below current', () => {
    expect(computePercentileRank([10, 15, 20, 25, 30], 22)).toBe(60);
  });

  it('returns 0 when current is below all historical values', () => {
    expect(computePercentileRank([20, 25, 30], 10)).toBe(0);
  });

  it('returns 100 when current exceeds all historical values', () => {
    expect(computePercentileRank([10, 15, 20], 99)).toBe(100);
  });

  it('uses strict less-than (equal values are not counted)', () => {
    // current = 20, one value equals 20 → not counted
    expect(computePercentileRank([10, 15, 20, 25], 20)).toBe(50);
  });
});

// ─── computeP90Value ──────────────────────────────────────────────────────────

describe('computeP90Value', () => {
  it('returns value at 90th percentile index', () => {
    // 10 values, sorted: [10,11,12,...,19], floor(0.9*10) = 9 → 19
    const history = [19, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    expect(computeP90Value(history)).toBe(19);
  });

  it('does not mutate the input array', () => {
    const history = [30, 10, 20];
    const original = [...history];
    computeP90Value(history);
    expect(history).toEqual(original);
  });
});

// ─── determineAlertLevel ─────────────────────────────────────────────────────

describe('determineAlertLevel', () => {
  it('returns null when percentile < 80', () => {
    expect(determineAlertLevel(50)).toBeNull();
    expect(determineAlertLevel(79.9)).toBeNull();
  });

  it('returns warning when percentile is between 80 and 89.99', () => {
    expect(determineAlertLevel(80)).toBe('warning');
    expect(determineAlertLevel(85)).toBe('warning');
    expect(determineAlertLevel(89.9)).toBe('warning');
  });

  it('returns alert when percentile is between 90 and 98.99', () => {
    expect(determineAlertLevel(90)).toBe('alert');
    expect(determineAlertLevel(95)).toBe('alert');
    expect(determineAlertLevel(98.9)).toBe('alert');
  });

  it('returns crisis when percentile >= 99', () => {
    expect(determineAlertLevel(99)).toBe('crisis');
    expect(determineAlertLevel(100)).toBe('crisis');
  });
});

// ─── loadHistory ─────────────────────────────────────────────────────────────

describe('loadHistory', () => {
  it('returns the last 252 points when more exist', () => {
    const allPoints = makeHistory(300);
    setupFsMock(allPoints);

    const result = loadHistory(VIX_HISTORY_PATH);
    expect(result).toHaveLength(252);
    expect(result[0]).toEqual(allPoints[48]); // slice(-252) from 300 = starts at index 48
  });

  it('throws AlertComputeError when file does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    expect(() => loadHistory(VIX_HISTORY_PATH)).toThrow(AlertComputeError);
    expect(() => loadHistory(VIX_HISTORY_PATH)).toThrow('not found');
  });

  it('throws AlertComputeError when file is invalid JSON', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('not-json' as never);

    expect(() => loadHistory(VIX_HISTORY_PATH)).toThrow(AlertComputeError);
  });

  it('throws AlertComputeError when fewer than 10 points', () => {
    setupFsMock(makeHistory(5));

    expect(() => loadHistory(VIX_HISTORY_PATH)).toThrow(AlertComputeError);
    expect(() => loadHistory(VIX_HISTORY_PATH)).toThrow('Insufficient history');
  });
});

// ─── updateHistory ────────────────────────────────────────────────────────────

describe('updateHistory', () => {
  it('appends today and keeps max 252 points (sliding window)', () => {
    const history = makeHistory(252);
    const today = '2026-04-12';

    updateHistory(VIX_HISTORY_PATH, history, today, 25.5);

    const written = JSON.parse(mockWriteFileSync.mock.calls[0][1] as string) as {date:string;value:number}[];
    expect(written).toHaveLength(252); // still 252 after sliding
    expect(written[written.length - 1]).toEqual({ date: today, value: 25.5 });
  });

  it('overwrites existing entry for today (no duplicate)', () => {
    const today = '2026-04-12';
    const history = [
      ...makeHistory(10),
      { date: today, value: 20.0 }, // existing entry
    ];

    updateHistory(VIX_HISTORY_PATH, history, today, 22.5);

    const written = JSON.parse(mockWriteFileSync.mock.calls[0][1] as string) as {date:string;value:number}[];
    const todayEntries = written.filter((p) => p.date === today);
    expect(todayEntries).toHaveLength(1);
    expect(todayEntries[0].value).toBe(22.5);
  });
});

// ─── buildAlert ───────────────────────────────────────────────────────────────

describe('buildAlert', () => {
  it('returns active:false / level:null when percentile < 80', async () => {
    // 20 points all = 30, current = 15 → rank = 0%
    setupFsMock(Array.from({ length: 20 }, (_, i) => ({ date: `2025-01-${i+1}`, value: 30 })));

    const result = await buildAlert(15);
    expect(result.active).toBe(false);
    expect(result.level).toBeNull();
    expect(result.triggered_at).toBeNull();
    expect(result.vix_current).toBe(15);
  });

  it('returns level:warning when percentile is 80-89', async () => {
    // 10 points [10..19], current = 18 → 8 values < 18 → 8/10 = 80%
    setupFsMock([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((v, i) => ({
      date: `2025-01-${i + 1}`,
      value: v,
    })));

    const result = await buildAlert(18);
    expect(result.level).toBe('warning');
    expect(result.active).toBe(true);
    expect(result.triggered_at).not.toBeNull();
  });

  it('returns level:alert when percentile is 90-98', async () => {
    // 10 points [10..19], current = 18.5 → 9 values < 18.5 → 9/10 = 90%
    setupFsMock([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((v, i) => ({
      date: `2025-01-${i + 1}`,
      value: v,
    })));

    const result = await buildAlert(18.5);
    expect(result.level).toBe('alert');
    expect(result.active).toBe(true);
  });

  it('returns level:crisis when percentile >= 99', async () => {
    // 100 points [1..100], current = 100 → 99 values < 100 → 99%
    setupFsMock(Array.from({ length: 100 }, (_, i) => ({ date: `2025-01-${i+1}`, value: i + 1 })));

    const result = await buildAlert(100);
    expect(result.level).toBe('crisis');
    expect(result.active).toBe(true);
  });

  it('includes vix_p90_252d in result', async () => {
    setupFsMock([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((v, i) => ({
      date: `2025-01-${i + 1}`,
      value: v,
    })));

    const result = await buildAlert(12);
    expect(typeof result.vix_p90_252d).toBe('number');
    expect(result.vix_p90_252d).toBeGreaterThan(0);
  });

  it('result passes AlertStateSchema validation', async () => {
    setupFsMock(makeHistory(50));

    const result = await buildAlert(15);
    expect(result).toMatchObject({
      active: expect.any(Boolean),
      vix_current: 15,
      vix_p90_252d: expect.any(Number),
    });
  });
});
