import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadJSON } from '../../src/lib/r2.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VixPoint {
  date: string;  // "YYYY-MM-DD"
  value: number;
}

interface FredObservation {
  date: string;   // "YYYY-MM-DD"
  value: string;  // number or "." for missing data
}

interface FredResponse {
  observations: FredObservation[];
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class BootstrapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BootstrapError';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── FRED VIXCLS fetch ────────────────────────────────────────────────────────

/**
 * Parse FRED observations into VixPoint[], filtering out "." (weekends/holidays)
 */
export function parseFredObservations(observations: FredObservation[]): VixPoint[] {
  return observations
    .filter((obs) => obs.value !== '.' && !isNaN(parseFloat(obs.value)))
    .map((obs) => ({
      date: obs.date,
      value: Math.round(parseFloat(obs.value) * 100) / 100,
    }));
}

export function deduplicateAndSort(points: VixPoint[]): VixPoint[] {
  const map = new Map<string, number>();
  for (const { date, value } of points) {
    map.set(date, value); // last value wins for duplicate dates
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

/**
 * Fetch VIX historical data from FRED series VIXCLS (VIX Closing Levels).
 * Free tier, no quota limit, official Federal Reserve data.
 * Replaces previous Finnhub /stock/candle endpoint (premium only).
 */
export async function fetchVixHistory(): Promise<VixPoint[]> {
  const key = process.env['FRED_API_KEY'];
  if (!key) throw new BootstrapError('FRED_API_KEY is not set');

  // Fetch ~400 observations to guarantee >= 252 trading days
  const today = new Date().toISOString().slice(0, 10);
  const oneYearAgo = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=VIXCLS&observation_start=${oneYearAgo}&observation_end=${today}` +
    `&sort_order=asc&api_key=${key}&file_type=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });

  if (!res.ok) {
    throw new BootstrapError(`FRED HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as FredResponse;

  if (!data.observations || data.observations.length === 0) {
    throw new BootstrapError('FRED returned empty observations for VIXCLS');
  }

  return parseFredObservations(data.observations);
}

// ─── Local write ─────────────────────────────────────────────────────────────

export function writeLocal(points: VixPoint[]): void {
  const dir = path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'vix-history.json');
  fs.writeFileSync(filePath, JSON.stringify(points, null, 2), 'utf-8');
  log('info', 'data/vix-history.json written', { count: points.length });
}

// ─── R2 upload ────────────────────────────────────────────────────────────────

export async function uploadToR2(points: VixPoint[]): Promise<void> {
  const hasR2 = process.env['R2_ACCESS_KEY_ID'] && process.env['R2_SECRET_ACCESS_KEY'] &&
                process.env['R2_BUCKET_NAME'] && process.env['R2_ENDPOINT'];

  if (!hasR2) {
    log('warn', 'R2 env vars manquantes — skip upload R2', {});
    return;
  }

  await uploadJSON('vix-history/vix-252d.json', points);
  log('info', 'R2 upload complete', { key: 'vix-history/vix-252d.json' });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  log('info', 'bootstrap-vix start (FRED VIXCLS)', {});

  const raw = await fetchVixHistory();
  log('info', 'FRED observations fetched', { count: raw.length });

  const points = deduplicateAndSort(raw);

  writeLocal(points);
  await uploadToR2(points);

  log('info', 'bootstrap-vix complete', { total_points: points.length });
}

// Only run when executed directly (not when imported by tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'bootstrap-vix fatal', { error: String(err) });
    process.exit(1);
  });
}
