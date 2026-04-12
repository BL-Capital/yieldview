import { fetchVIX, fetchDXY, fetchIndices } from '../../src/lib/finnhub.js';
import { fetchOAT, fetchBund, fetchUS10Y } from '../../src/lib/fred.js';
import { KpiSchema, type Kpi } from '../../src/lib/schemas/kpi.js';
import { buildAlert } from './compute-alert.js';
import type { FinnhubQuoteResult, FinnhubIndexResult } from '../../src/lib/finnhub.js';
import type { FredSeriesResult } from '../../src/lib/fred.js';
import type { AlertState } from '../../src/lib/schemas/alert.js';

// ─── Error ────────────────────────────────────────────────────────────────────

export class PipelineError extends Error {
  constructor(
    message: string,
    public readonly source: 'finnhub' | 'fred' | 'r2',
  ) {
    super(message);
    this.name = 'PipelineError';
  }
}

// ─── Labels & meta ────────────────────────────────────────────────────────────

const KPI_LABELS: Record<string, { fr: string; en: string }> = {
  vix:             { fr: 'VIX (Volatilité)',         en: 'VIX (Volatility)' },
  dxy:             { fr: 'Dollar Index (DXY)',        en: 'Dollar Index (DXY)' },
  cac40:           { fr: 'CAC 40',                   en: 'CAC 40' },
  sp500:           { fr: 'S&P 500',                  en: 'S&P 500' },
  nasdaq:          { fr: 'Nasdaq',                   en: 'Nasdaq' },
  dax:             { fr: 'DAX',                      en: 'DAX' },
  oat_10y:         { fr: 'OAT 10 ans (France)',      en: 'OAT 10Y (France)' },
  bund_10y:        { fr: 'Bund 10 ans (Allemagne)',  en: 'Bund 10Y (Germany)' },
  us_10y:          { fr: 'T-Note 10 ans (US)',       en: 'T-Note 10Y (US)' },
  spread_oat_bund: { fr: 'Spread OAT-Bund',          en: 'OAT-Bund Spread' },
  spread_bund_us:  { fr: 'Spread Bund-US',           en: 'Bund-US Spread' },
};

const KPI_META: Record<string, { category: Kpi['category']; unit: string }> = {
  vix:             { category: 'volatility', unit: '' },
  dxy:             { category: 'macro',      unit: '' },
  cac40:           { category: 'indices',    unit: '' },
  sp500:           { category: 'indices',    unit: '' },
  nasdaq:          { category: 'indices',    unit: '' },
  dax:             { category: 'indices',    unit: '' },
  oat_10y:         { category: 'rates',      unit: '%' },
  bund_10y:        { category: 'rates',      unit: '%' },
  us_10y:          { category: 'rates',      unit: '%' },
  spread_oat_bund: { category: 'spreads',    unit: 'bps' },
  spread_bund_us:  { category: 'spreads',    unit: 'bps' },
};

// ─── Logging ──────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── Internal types ──────────────────────────────────────────────────────────

interface FinnhubResults {
  vix: FinnhubQuoteResult;
  dxy: FinnhubQuoteResult;
  indices: FinnhubIndexResult[];
}

interface FredResults {
  oat_10y: FredSeriesResult;
  bund_10y: FredSeriesResult;
  us_10y: FredSeriesResult;
}

// ─── R2 fallback ─────────────────────────────────────────────────────────────

async function fetchR2Fallback(failedSource: 'finnhub' | 'fred'): Promise<Kpi[]> {
  const baseUrl = process.env['R2_PUBLIC_URL'];
  if (!baseUrl) throw new PipelineError('R2_PUBLIC_URL is not set', 'r2');

  log('warn', 'fallback R2 activé', { source: failedSource });

  const res = await fetch(`${baseUrl}/latest.json`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    throw new PipelineError(`R2 fallback HTTP ${res.status}`, 'r2');
  }

  const data = (await res.json()) as { kpis: Kpi[] };
  const sourceFilter: Kpi['source'][] =
    failedSource === 'finnhub' ? ['finnhub'] : ['fred'];

  return data.kpis.filter((kpi) => sourceFilter.includes(kpi.source));
}

// ─── Fetch Finnhub ────────────────────────────────────────────────────────────

async function fetchFinnhubData(): Promise<FinnhubResults> {
  const start = Date.now();
  const [vix, dxy, indices] = await Promise.all([fetchVIX(), fetchDXY(), fetchIndices()]);
  log('info', 'Finnhub fetched', { source: 'finnhub', duration_ms: Date.now() - start });
  return { vix, dxy, indices };
}

// ─── Fetch FRED ──────────────────────────────────────────────────────────────

async function fetchFredData(): Promise<FredResults> {
  const start = Date.now();
  const [oat_10y, bund_10y, us_10y] = await Promise.all([
    fetchOAT(),
    fetchBund(),
    fetchUS10Y(),
  ]);
  log('info', 'FRED fetched', { source: 'fred', duration_ms: Date.now() - start });
  return { oat_10y, bund_10y, us_10y };
}

// ─── Fetch all (with fallback) ────────────────────────────────────────────────

export async function fetchAllMarketData(): Promise<{
  finnhub: FinnhubResults | { fallback: Kpi[] };
  fred: FredResults | { fallback: Kpi[] };
}> {
  const [finnhubResult, fredResult] = await Promise.allSettled([
    fetchFinnhubData(),
    fetchFredData(),
  ]);

  let finnhub: FinnhubResults | { fallback: Kpi[] };
  if (finnhubResult.status === 'fulfilled') {
    finnhub = finnhubResult.value;
  } else {
    try {
      finnhub = { fallback: await fetchR2Fallback('finnhub') };
    } catch (err) {
      log('error', 'Finnhub + R2 fallback both failed', { error: String(err) });
      finnhub = { fallback: [] };
    }
  }

  let fred: FredResults | { fallback: Kpi[] };
  if (fredResult.status === 'fulfilled') {
    fred = fredResult.value;
  } else {
    try {
      fred = { fallback: await fetchR2Fallback('fred') };
    } catch (err) {
      log('error', 'FRED + R2 fallback both failed', { error: String(err) });
      fred = { fallback: [] };
    }
  }

  return { finnhub, fred };
}

// ─── Spread computation ───────────────────────────────────────────────────────

export interface SpreadResult {
  value: number;
  change_day: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
  source: 'calculated';
  freshness_level: 'live' | 'stale' | 'very_stale';
  timestamp: string;
}

export function computeSpreads(
  oat: number,
  bund: number,
  us: number,
  freshnessLevel: 'live' | 'stale' | 'very_stale',
  timestamp: string,
): { spread_oat_bund: SpreadResult; spread_bund_us: SpreadResult } {
  const calcBps = (a: number, b: number): number =>
    Math.round((a - b) * 100 * 100) / 100; // bps, 2 decimal places

  const oatBundVal = calcBps(oat, bund);
  const bundUsVal = calcBps(bund, us);

  const toSpread = (value: number): SpreadResult => ({
    value,
    change_day: 0,
    change_pct: 0,
    direction: value > 0 ? 'up' : value < 0 ? 'down' : 'flat',
    source: 'calculated',
    freshness_level: freshnessLevel,
    timestamp,
  });

  return {
    spread_oat_bund: toSpread(oatBundVal),
    spread_bund_us: toSpread(bundUsVal),
  };
}

// ─── Build complete KPI array ─────────────────────────────────────────────────

function toKpi(
  id: string,
  partial: { value: number; change_day: number; change_pct: number; direction: 'up' | 'down' | 'flat'; source: Kpi['source']; timestamp: string; freshness_level: Kpi['freshness_level'] },
): unknown {
  return {
    id,
    label: KPI_LABELS[id],
    category: KPI_META[id].category,
    unit: KPI_META[id].unit,
    ...partial,
  };
}

function isFinnhubResults(v: unknown): v is FinnhubResults {
  return typeof v === 'object' && v !== null && 'vix' in v;
}

function isFredResults(v: unknown): v is FredResults {
  return typeof v === 'object' && v !== null && 'oat_10y' in v;
}

export async function buildKpis(): Promise<{ kpis: Kpi[]; fetchedAt: string }> {
  const fetchedAt = new Date().toISOString();
  const start = Date.now();

  log('info', 'fetch-data start', { fetchedAt });

  const { finnhub, fred } = await fetchAllMarketData();

  const rawKpis: unknown[] = [];

  if (isFinnhubResults(finnhub)) {
    rawKpis.push(toKpi('vix', finnhub.vix));
    rawKpis.push(toKpi('dxy', finnhub.dxy));
    for (const idx of finnhub.indices) {
      rawKpis.push(toKpi(idx.id, idx));
    }
  } else {
    // Fallback: use KPIs from R2 directly (already Kpi-shaped)
    rawKpis.push(...finnhub.fallback);
  }

  let oat = 0, bund = 0, us = 0;
  let fredTimestamp = fetchedAt;
  let fredFreshness: Kpi['freshness_level'] = 'very_stale';

  if (isFredResults(fred)) {
    rawKpis.push(toKpi('oat_10y', fred.oat_10y));
    rawKpis.push(toKpi('bund_10y', fred.bund_10y));
    rawKpis.push(toKpi('us_10y', fred.us_10y));
    oat = fred.oat_10y.value;
    bund = fred.bund_10y.value;
    us = fred.us_10y.value;
    fredTimestamp = fred.oat_10y.timestamp;
    fredFreshness = fred.oat_10y.freshness_level;
  } else {
    rawKpis.push(...fred.fallback);
    // Extract values for spread computation from fallback KPIs
    const oatKpi = fred.fallback.find((k) => k.id === 'oat_10y');
    const bundKpi = fred.fallback.find((k) => k.id === 'bund_10y');
    const usKpi = fred.fallback.find((k) => k.id === 'us_10y');
    if (oatKpi && bundKpi && usKpi) {
      oat = oatKpi.value;
      bund = bundKpi.value;
      us = usKpi.value;
      fredTimestamp = oatKpi.timestamp;
      fredFreshness = oatKpi.freshness_level;
    }
  }

  // Compute spreads only if we have ALL three FRED values
  if (oat !== 0 && bund !== 0 && us !== 0) {
    const spreads = computeSpreads(oat, bund, us, fredFreshness, fredTimestamp);
    rawKpis.push(toKpi('spread_oat_bund', spreads.spread_oat_bund));
    rawKpis.push(toKpi('spread_bund_us', spreads.spread_bund_us));
  }

  // Validate each KPI with Zod — exclude invalid ones
  const kpis: Kpi[] = [];
  for (const raw of rawKpis) {
    try {
      kpis.push(KpiSchema.parse(raw));
    } catch (err) {
      log('error', 'KPI invalide — exclu de l\'output', {
        id: (raw as { id?: string }).id ?? 'unknown',
        error: String(err),
      });
    }
  }

  log('info', 'fetch-data complete', { kpi_count: kpis.length, duration_ms: Date.now() - start });

  return { kpis, fetchedAt };
}

// ─── Alert state ─────────────────────────────────────────────────────────────

const NEUTRAL_ALERT: AlertState = {
  active: false,
  level: null,
  vix_current: 0,
  vix_p90_252d: 0,
  triggered_at: null,
};

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  const { kpis, fetchedAt } = await buildKpis();

  // Reuse the VIX value already fetched by buildKpis() — no second API call
  const vixKpi = kpis.find((k) => k.id === 'vix');
  let alert: AlertState = NEUTRAL_ALERT;

  if (vixKpi) {
    try {
      alert = await buildAlert(vixKpi.value);
    } catch (err) {
      log('warn', 'compute-alert skipped — vix history unavailable', { error: String(err) });
      alert = { ...NEUTRAL_ALERT, vix_current: vixKpi.value };
    }
  }

  process.stdout.write(JSON.stringify({ kpis, fetchedAt, alert }, null, 2) + '\n');
}

// Only run when executed directly (not when imported by tests or other modules)
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'fetch-data fatal error', { error: String(err) });
    process.exit(1);
  });
}
