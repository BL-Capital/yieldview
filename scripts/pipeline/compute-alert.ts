import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AlertStateSchema, type AlertState, type AlertLevel } from '../../src/lib/schemas/alert.js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VixPoint {
  date: string;  // "YYYY-MM-DD"
  value: number;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class AlertComputeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlertComputeError';
  }
}

// ─── Thresholds ───────────────────────────────────────────────────────────────

const ALERT_THRESHOLDS = {
  warning: 80,  // >= p80 → warning
  alert:   90,  // >= p90 → alert
  crisis:  99,  // >= p99 → crisis
} as const;

// ─── Paths ────────────────────────────────────────────────────────────────────

export const VIX_HISTORY_PATH = path.join(process.cwd(), 'data', 'vix-history.json');

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── Pure functions (testable) ────────────────────────────────────────────────

/**
 * Percentile rank: proportion of historical values STRICTLY below current VIX
 * Formula: rank = (count of values < current) / total_count * 100
 */
export function computePercentileRank(history: number[], current: number): number {
  const count = history.filter((v) => v < current).length;
  return (count / history.length) * 100;
}

/**
 * Value at the 90th percentile of the history (the real P90 threshold)
 */
export function computeP90Value(history: number[]): number {
  const sorted = [...history].sort((a, b) => a - b);
  const idx = Math.floor(0.90 * sorted.length);
  return sorted[idx] ?? sorted[sorted.length - 1]!;
}

export function determineAlertLevel(percentileRank: number): AlertLevel | null {
  if (percentileRank >= ALERT_THRESHOLDS.crisis)  return 'crisis';
  if (percentileRank >= ALERT_THRESHOLDS.alert)   return 'alert';
  if (percentileRank >= ALERT_THRESHOLDS.warning) return 'warning';
  return null;
}

// ─── I/O functions ────────────────────────────────────────────────────────────

export function loadHistory(filePath: string = VIX_HISTORY_PATH): VixPoint[] {
  if (!fs.existsSync(filePath)) {
    throw new AlertComputeError('vix-history.json not found — run bootstrap:vix first');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    throw new AlertComputeError('vix-history.json is invalid JSON');
  }

  if (!Array.isArray(raw)) {
    throw new AlertComputeError('vix-history.json must be an array');
  }

  // Validate each element has the expected shape
  const points = (raw as unknown[]).filter(
    (item): item is VixPoint =>
      typeof item === 'object' && item !== null &&
      typeof (item as VixPoint).date === 'string' &&
      typeof (item as VixPoint).value === 'number' &&
      Number.isFinite((item as VixPoint).value),
  );
  if (points.length < 10) {
    throw new AlertComputeError(
      `Insufficient history: need at least 10 valid points, got ${points.length}`,
    );
  }

  // Take last 252 points (already sorted chronologically by Story 2.6)
  return points.slice(-252);
}

export function updateHistory(
  filePath: string,
  currentHistory: VixPoint[],
  today: string,
  vixCurrent: number,
): void {
  // Remove any existing entry for today (prevent duplicates)
  const filtered = currentHistory.filter((p) => p.date !== today);
  // Add today's point
  const updated = [...filtered, { date: today, value: vixCurrent }];
  // Sliding window: keep last 252 points
  const windowed = updated.slice(-252);
  fs.writeFileSync(filePath, JSON.stringify(windowed, null, 2), 'utf-8');
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function buildAlert(vixCurrent: number): Promise<AlertState> {
  const filePath = VIX_HISTORY_PATH;
  const today = new Date().toISOString().slice(0, 10);

  log('info', 'compute-alert start', { vix_current: vixCurrent });

  const points = loadHistory(filePath);
  const history = points.map((p) => p.value);

  const percentileRank = computePercentileRank(history, vixCurrent);
  const vixP90Value = computeP90Value(history);
  const level = determineAlertLevel(percentileRank);
  const active = level !== null;

  log('info', 'compute-alert result', {
    history_count: history.length,
    percentile: Math.round(percentileRank * 100) / 100,
    vix_p90_252d: vixP90Value,
    level,
    active,
  });

  // Update local history with today's VIX (sliding window)
  updateHistory(filePath, points, today, vixCurrent);

  const result: AlertState = {
    active,
    level,
    vix_current: vixCurrent,
    vix_p90_252d: vixP90Value,
    triggered_at: active ? new Date().toISOString() : null,
  };

  // Zod validation — throws if non-conformant (should never happen)
  return AlertStateSchema.parse(result);
}

// ─── Standalone entry point ───────────────────────────────────────────────────

async function main(): Promise<void> {
  const { fetchVIX } = await import('../../src/lib/finnhub.js');
  const { value: vixCurrent } = await fetchVIX();
  const alertState = await buildAlert(vixCurrent);
  process.stdout.write(JSON.stringify(alertState, null, 2) + '\n');
}

// Only run when executed directly (not when imported by tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(
      JSON.stringify({
        level: 'error',
        msg: 'compute-alert fatal',
        error: String(err),
        timestamp: new Date().toISOString(),
      }),
    );
    process.exit(1);
  });
}
