import { describe, it, expect } from 'vitest';
import { AnalysisSchema } from '../analysis';

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

const validAnalysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:05:00.000Z',
  validated_at: null,
  pipeline_run_id: '550e8400-e29b-41d4-a716-446655440000',
  version: 'ai',
  briefing: {
    fr: 'Les taux souverains européens ont légèrement reculé en séance.',
    en: 'European sovereign rates slightly retreated during the session.',
  },
  tagline: {
    fr: 'Détente obligataire en zone euro',
    en: 'Bond market relief in the euro zone',
  },
  metadata: {
    theme_of_day: { fr: 'Politique monétaire BCE', en: 'ECB monetary policy' },
    certainty: 'preliminary',
    upcoming_event: { fr: 'Réunion BCE — 17 avril', en: 'ECB meeting — April 17' },
    risk_level: 'medium',
  },
  kpis: [validKpi],
  alert: {
    active: false,
    level: null,
    vix_current: 18.2,
    vix_p90_252d: 25.3,
    triggered_at: null,
  },
};

describe('AnalysisSchema', () => {
  it('validates a complete valid analysis', () => {
    expect(() => AnalysisSchema.parse(validAnalysis)).not.toThrow();
    const result = AnalysisSchema.parse(validAnalysis);
    expect(result.date).toBe('2026-04-12');
    expect(result.version).toBe('ai');
    expect(result.kpis).toHaveLength(1);
  });

  it('validates with validated_at set', () => {
    const withValidation = { ...validAnalysis, validated_at: '2026-04-12T06:20:00.000Z' };
    expect(() => AnalysisSchema.parse(withValidation)).not.toThrow();
  });

  it('validates with ai_original present (manual-override)', () => {
    const withOverride = {
      ...validAnalysis,
      version: 'manual-override',
      ai_original: {
        briefing: { fr: 'Original FR text', en: 'Original EN text' },
        tagline: { fr: 'Original tagline FR', en: 'Original tagline EN' },
      },
    };
    expect(() => AnalysisSchema.parse(withOverride)).not.toThrow();
  });

  it('validates with empty kpis array', () => {
    expect(() => AnalysisSchema.parse({ ...validAnalysis, kpis: [] })).not.toThrow();
  });

  it('validates with null upcoming_event', () => {
    const withNoEvent = {
      ...validAnalysis,
      metadata: { ...validAnalysis.metadata, upcoming_event: null },
    };
    expect(() => AnalysisSchema.parse(withNoEvent)).not.toThrow();
  });

  it('validates all risk_level values', () => {
    const levels = ['low', 'medium', 'high', 'crisis'] as const;
    for (const risk_level of levels) {
      const data = { ...validAnalysis, metadata: { ...validAnalysis.metadata, risk_level } };
      expect(() => AnalysisSchema.parse(data)).not.toThrow();
    }
  });

  it('validates all certainty values', () => {
    const certaintyValues = ['preliminary', 'definitive'] as const;
    for (const certainty of certaintyValues) {
      const data = { ...validAnalysis, metadata: { ...validAnalysis.metadata, certainty } };
      expect(() => AnalysisSchema.parse(data)).not.toThrow();
    }
  });

  it('rejects invalid date format', () => {
    expect(() => AnalysisSchema.parse({ ...validAnalysis, date: '12/04/2026' })).toThrow();
    expect(() => AnalysisSchema.parse({ ...validAnalysis, date: '2026-4-12' })).toThrow();
  });

  it('rejects invalid version', () => {
    expect(() => AnalysisSchema.parse({ ...validAnalysis, version: 'human' })).toThrow();
  });

  it('rejects invalid pipeline_run_id (not UUID)', () => {
    expect(() => AnalysisSchema.parse({ ...validAnalysis, pipeline_run_id: 'not-a-uuid' })).toThrow();
  });

  it('rejects invalid risk_level', () => {
    const data = { ...validAnalysis, metadata: { ...validAnalysis.metadata, risk_level: 'extreme' } };
    expect(() => AnalysisSchema.parse(data)).toThrow();
  });

  it('rejects missing briefing', () => {
    const { briefing: _briefing, ...rest } = validAnalysis;
    expect(() => AnalysisSchema.parse(rest)).toThrow();
  });

  it('rejects missing kpis', () => {
    const { kpis: _kpis, ...rest } = validAnalysis;
    expect(() => AnalysisSchema.parse(rest)).toThrow();
  });

  it('rejects invalid kpi within kpis array', () => {
    const invalidKpi = { ...validKpi, category: 'invalid_category' };
    expect(() => AnalysisSchema.parse({ ...validAnalysis, kpis: [invalidKpi] })).toThrow();
  });
});
