const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// Series IDs
const SERIES_OAT = 'IRLTLT01FRM156N';   // France OAT 10Y (monthly, BIS via FRED)
const SERIES_BUND = 'IRLTLT01DEM156N';  // Germany Bund 10Y (monthly)
const SERIES_US10Y = 'DGS10';           // US 10Y Treasury (daily)

// ─── Error class ─────────────────────────────────────────────────────────────

export class FredError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'FredError';
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FredObservation {
  date: string;   // "2026-04-11"
  value: string;  // "4.38" or "." (weekend/holiday — no data)
}

interface FredResponse {
  observations: FredObservation[];
}

export interface FredSeriesResult {
  value: number;
  change_day: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
  source: 'fred';
  timestamp: string; // ISO 8601
  freshness_level: 'live' | 'stale' | 'very_stale';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeFredFreshness(dateStr: string): 'live' | 'stale' | 'very_stale' {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return 'live';
  if (dateStr === yesterday) return 'stale';
  return 'very_stale';
}

function isValidValue(v: string): boolean {
  return v !== '.' && !isNaN(parseFloat(v));
}

function parseObservations(observations: FredObservation[]): FredSeriesResult {
  const valid = observations.filter((o) => isValidValue(o.value));

  if (valid.length === 0) {
    throw new FredError('No valid observations in FRED response', 0);
  }

  const latest = valid[0];
  const previous = valid[1];

  const currentValue = parseFloat(latest.value);
  const previousValue = previous ? parseFloat(previous.value) : currentValue;
  const changeDay = parseFloat((currentValue - previousValue).toFixed(4));
  const changePct =
    previousValue !== 0
      ? parseFloat(((currentValue - previousValue) / previousValue * 100).toFixed(4))
      : 0;

  return {
    value: currentValue,
    change_day: changeDay,
    change_pct: changePct,
    direction: changeDay > 0 ? 'up' : changeDay < 0 ? 'down' : 'flat',
    source: 'fred',
    // FRED dates are "YYYY-MM-DD" — use T12:00:00Z to avoid timezone drift
    timestamp: new Date(latest.date + 'T12:00:00.000Z').toISOString(),
    freshness_level: computeFredFreshness(latest.date),
  };
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function fredFetch(seriesId: string): Promise<FredSeriesResult> {
  const key = process.env.FRED_API_KEY;
  if (!key) {
    throw new FredError('FRED_API_KEY is not set. Add it to your environment variables.', 0);
  }

  // limit=5 to ensure we get at least 2 valid values after filtering "." (long weekends)
  const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&limit=5&sort_order=desc&api_key=${key}&file_type=json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new FredError(`FRED HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  const data: FredResponse = await res.json();
  return parseObservations(data.observations);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** France OAT 10Y — série IRLTLT01FRM156N (mensuelle) */
export async function fetchOAT(): Promise<FredSeriesResult> {
  return fredFetch(SERIES_OAT);
}

/** Germany Bund 10Y — série IRLTLT01DEM156N (mensuelle) */
export async function fetchBund(): Promise<FredSeriesResult> {
  return fredFetch(SERIES_BUND);
}

/** US Treasury 10Y — série DGS10 (journalière) */
export async function fetchUS10Y(): Promise<FredSeriesResult> {
  return fredFetch(SERIES_US10Y);
}
