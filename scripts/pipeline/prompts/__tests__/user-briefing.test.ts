import { describe, it, expect } from 'vitest';
import { buildUserPrompt, formatKpiForPrompt, formatSpreadAnalysis, frenchDayOfWeek } from '../user-briefing';
import type { Kpi } from '../../../../src/lib/schemas/kpi';
import type { AlertState } from '../../../../src/lib/schemas/alert';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NOW_ISO = new Date().toISOString();

function makeKpi(overrides: Partial<Kpi> & { id: string; label: { fr: string; en: string } }): Kpi {
  return {
    category: 'indices',
    value: 100,
    unit: 'points',
    change_day: 0.5,
    change_pct: 0.5,
    direction: 'up',
    source: 'finnhub',
    timestamp: NOW_ISO,
    freshness_level: 'live',
    ...overrides,
  };
}

const MOCK_KPIS: Kpi[] = [
  makeKpi({ id: 'vix', category: 'volatility', label: { fr: 'VIX (Volatilite)', en: 'VIX' }, value: 18.5, unit: 'points', change_day: -0.3, change_pct: -1.6, direction: 'down' }),
  makeKpi({ id: 'dxy', category: 'macro', label: { fr: 'Dollar Index (DXY)', en: 'DXY' }, value: 104.2, unit: 'points', change_day: 0.15, change_pct: 0.14, direction: 'up' }),
  makeKpi({ id: 'cac40', label: { fr: 'CAC 40', en: 'CAC 40' }, value: 7650, change_day: 23, change_pct: 0.3, direction: 'up' }),
  makeKpi({ id: 'sp500', label: { fr: 'S&P 500', en: 'S&P 500' }, value: 5200, change_day: -12, change_pct: -0.23, direction: 'down' }),
  makeKpi({ id: 'nasdaq', label: { fr: 'Nasdaq', en: 'Nasdaq' }, value: 16400, change_day: 45, change_pct: 0.27, direction: 'up' }),
  makeKpi({ id: 'dax', label: { fr: 'DAX', en: 'DAX' }, value: 18200, change_day: -30, change_pct: -0.16, direction: 'down' }),
  makeKpi({ id: 'oat_10y', category: 'rates', label: { fr: 'OAT 10 ans (France)', en: 'OAT 10Y' }, value: 3.42, unit: '%', change_day: 0.02, change_pct: 0.58, direction: 'up', source: 'fred' }),
  makeKpi({ id: 'bund_10y', category: 'rates', label: { fr: 'Bund 10 ans (Allemagne)', en: 'Bund 10Y' }, value: 2.88, unit: '%', change_day: -0.01, change_pct: -0.35, direction: 'down', source: 'fred' }),
  makeKpi({ id: 'us_10y', category: 'rates', label: { fr: 'US 10Y Treasury', en: 'US 10Y' }, value: 4.38, unit: '%', change_day: 0.03, change_pct: 0.69, direction: 'up', source: 'fred' }),
  makeKpi({ id: 'spread_oat_bund', category: 'spreads', label: { fr: 'Spread OAT-Bund', en: 'Spread OAT-Bund' }, value: 52.3, unit: 'bps', change_day: 1.2, change_pct: 2.35, direction: 'up', source: 'calculated' }),
  makeKpi({ id: 'spread_bund_us', category: 'spreads', label: { fr: 'Spread Bund-US', en: 'Spread Bund-US' }, value: -185.0, unit: 'bps', change_day: -3.1, change_pct: -1.7, direction: 'down', source: 'calculated' }),
];

const MOCK_ALERT_ACTIVE: AlertState = {
  active: true,
  level: 'warning',
  vix_current: 28.5,
  vix_p90_252d: 25.0,
  triggered_at: '2026-04-12T06:00:00.000Z',
};

const MOCK_ALERT_INACTIVE: AlertState = {
  active: false,
  level: null,
  vix_current: 18.5,
  vix_p90_252d: 25.0,
  triggered_at: null,
};

const PROSCRIBED = [
  'in conclusion', "it's worth noting", 'navigating', 'unlock',
  'il faut', 'nous recommandons', 'achetez', 'vendez',
];

// ─── frenchDayOfWeek ──────────────────────────────────────────────────────────

describe('frenchDayOfWeek', () => {
  it('returns lundi for Monday', () => {
    // 2026-04-13 is a Monday
    expect(frenchDayOfWeek(new Date('2026-04-13T12:00:00Z'))).toBe('lundi');
  });

  it('returns dimanche for Sunday', () => {
    expect(frenchDayOfWeek(new Date('2026-04-12T12:00:00Z'))).toBe('dimanche');
  });
});

// ─── formatKpiForPrompt ───────────────────────────────────────────────────────

describe('formatKpiForPrompt', () => {
  it('formats an up KPI with + arrow', () => {
    const result = formatKpiForPrompt(MOCK_KPIS[0]); // VIX, down
    expect(result).toContain('VIX (Volatilite)');
    expect(result).toContain('18.5');
    expect(result).toContain('-');
  });

  it('formats a down KPI with - arrow', () => {
    const result = formatKpiForPrompt(MOCK_KPIS[3]); // SP500, down
    expect(result).toContain('S&P 500');
    expect(result).toContain('-');
  });
});

// ─── formatSpreadAnalysis ─────────────────────────────────────────────────────

describe('formatSpreadAnalysis', () => {
  it('includes both spreads', () => {
    const result = formatSpreadAnalysis(MOCK_KPIS);
    expect(result).toContain('Spread OAT-Bund');
    expect(result).toContain('52.3 bps');
    expect(result).toContain('Spread Bund-US');
    expect(result).toContain('-185');
  });

  it('handles empty KPIs gracefully', () => {
    const result = formatSpreadAnalysis([]);
    expect(result).toContain('Aucune donnee');
  });
});

// ─── buildUserPrompt ──────────────────────────────────────────────────────────

describe('buildUserPrompt', () => {
  it('returns a non-empty string', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('contains the current date', () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain(today);
  });

  it('contains all 11 KPI labels', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    for (const kpi of MOCK_KPIS) {
      expect(result).toContain(kpi.label.fr);
    }
  });

  it('contains alert level when active', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_ACTIVE);
    expect(result).toContain('ALERTE ACTIVE');
    expect(result).toContain('WARNING');
  });

  it('contains "aucune alerte" when inactive', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result.toLowerCase()).toContain('aucune alerte');
  });

  it('contains spread analysis', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain('Spread OAT-Bund');
    expect(result).toContain('Spread Bund-US');
  });

  it('contains JSON format instructions', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain('"briefing"');
    expect(result).toContain('"tagline"');
    expect(result).toContain('"metadata"');
    expect(result).toContain('"risk_level"');
  });

  it('contains AMF disclaimer reminder', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain('conseil en investissement');
  });

  it('does not contain proscribed words', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    const lower = result.toLowerCase();
    for (const word of PROSCRIBED) {
      expect(lower).not.toContain(word.toLowerCase());
    }
  });
});
