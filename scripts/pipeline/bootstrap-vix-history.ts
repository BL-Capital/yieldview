import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VixPoint {
  date: string;  // "YYYY-MM-DD"
  value: number;
}

interface FinnhubCandleRaw {
  s: string;
  t: number[];
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  v: number[];
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

// ─── Candle fetch ─────────────────────────────────────────────────────────────

export function parseCandles(data: FinnhubCandleRaw): VixPoint[] {
  return data.t.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10),
    value: Math.round((data.c[i] ?? 0) * 100) / 100,
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

export async function fetchVixCandles(from: number, to: number): Promise<VixPoint[]> {
  const key = process.env['FINNHUB_API_KEY'];
  if (!key) throw new BootstrapError('FINNHUB_API_KEY is not set');

  const url =
    `https://finnhub.io/api/v1/stock/candle` +
    `?symbol=%5EVIX&resolution=D&from=${from}&to=${to}&token=${key}`;

  let lastError: Error | undefined;
  const delays = [1000, 2000, 4000];

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new BootstrapError(`Finnhub HTTP ${res.status}`);
      const data = (await res.json()) as FinnhubCandleRaw;
      if (data.s !== 'ok') throw new BootstrapError(`Finnhub candle status: ${data.s}`);
      return parseCandles(data);
    } catch (err) {
      lastError = err as Error;
      if (attempt < 3) await new Promise((r) => setTimeout(r, delays[attempt - 1]));
    }
  }
  throw lastError!;
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
  const accessKeyId     = process.env['R2_ACCESS_KEY_ID'];
  const secretAccessKey = process.env['R2_SECRET_ACCESS_KEY'];
  const bucket          = process.env['R2_BUCKET_NAME'];
  const endpoint        = process.env['R2_ENDPOINT'];

  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint) {
    log('warn', 'R2 env vars manquantes — skip upload R2', {});
    return;
  }

  try {
    // Dynamic import — @aws-sdk/client-s3 will be formally installed in Story 2.11
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

    const client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: 'vix-history/vix-252d.json',
        Body: JSON.stringify(points, null, 2),
        ContentType: 'application/json',
      }),
    );

    log('info', 'R2 upload complete', { key: 'vix-history/vix-252d.json' });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND' ||
        String(err).includes('Cannot find module') ||
        String(err).includes('ERR_MODULE_NOT_FOUND')) {
      log('warn', '@aws-sdk/client-s3 not installed — skip R2 upload (install in Story 2.11)', {});
      return;
    }
    throw err;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 365 * 24 * 60 * 60;

  log('info', 'bootstrap-vix start', {
    from: new Date(from * 1000).toISOString(),
    to: new Date(to * 1000).toISOString(),
  });

  const raw = await fetchVixCandles(from, to);
  log('info', 'candles fetched', { count: raw.length });

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
