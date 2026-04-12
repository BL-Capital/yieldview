import { describe, it, expect } from 'vitest';
import { KpiSchema } from '../kpi';

const validKpi = {
  id: 'oat_10y',
  category: 'rates',
  label: { fr: 'OAT 10 ans', en: 'OAT 10Y' },
  value: 3.45,
  unit: '%',
  change_day: -0.05,
  change_pct: -1.43,
  direction: 'down',
  source: 'fred',
  timestamp: '2026-04-12T06:00:00.000Z',
  freshness_level: 'live',
};

describe('KpiSchema', () => {
  it('validates a valid KPI', () => {
    expect(() => KpiSchema.parse(validKpi)).not.toThrow();
    const result = KpiSchema.parse(validKpi);
    expect(result.id).toBe('oat_10y');
    expect(result.value).toBe(3.45);
  });

  it('validates all category values', () => {
    const categories = ['rates', 'spreads', 'indices', 'volatility', 'macro'] as const;
    for (const category of categories) {
      expect(() => KpiSchema.parse({ ...validKpi, category })).not.toThrow();
    }
  });

  it('validates all direction values', () => {
    const directions = ['up', 'down', 'flat'] as const;
    for (const direction of directions) {
      expect(() => KpiSchema.parse({ ...validKpi, direction })).not.toThrow();
    }
  });

  it('validates all source values', () => {
    const sources = ['finnhub', 'fred', 'alpha_vantage', 'calculated'] as const;
    for (const source of sources) {
      expect(() => KpiSchema.parse({ ...validKpi, source })).not.toThrow();
    }
  });

  it('accepts negative change values', () => {
    expect(() => KpiSchema.parse({ ...validKpi, change_day: -2.5, change_pct: -5.0 })).not.toThrow();
  });

  it('rejects invalid category', () => {
    expect(() => KpiSchema.parse({ ...validKpi, category: 'invalid' })).toThrow();
  });

  it('rejects invalid direction', () => {
    expect(() => KpiSchema.parse({ ...validKpi, direction: 'sideways' })).toThrow();
  });

  it('rejects invalid source', () => {
    expect(() => KpiSchema.parse({ ...validKpi, source: 'bloomberg' })).toThrow();
  });

  it('rejects missing id', () => {
    const { id: _id, ...rest } = validKpi;
    expect(() => KpiSchema.parse(rest)).toThrow();
  });

  it('rejects non-numeric value', () => {
    expect(() => KpiSchema.parse({ ...validKpi, value: 'not-a-number' })).toThrow();
  });

  it('rejects invalid timestamp format', () => {
    expect(() => KpiSchema.parse({ ...validKpi, timestamp: '2026-04-12' })).toThrow();
  });

  it('rejects invalid freshness_level', () => {
    expect(() => KpiSchema.parse({ ...validKpi, freshness_level: 'fresh' })).toThrow();
  });
});
