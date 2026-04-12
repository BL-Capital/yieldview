import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../src/lib/claude.js', () => ({
  generateBriefing: vi.fn(),
  translateToEN: vi.fn(),
}));

vi.mock('fs', () => ({
  default: { readFileSync: vi.fn().mockReturnValue('System prompt content') },
}));

import { generateBriefing, translateToEN } from '../../../src/lib/claude.js';
import { generateAnalysis, GenerateError } from '../generate-ai';

const mockGenerateBriefing = vi.mocked(generateBriefing);
const mockTranslateToEN = vi.mocked(translateToEN);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NOW_ISO = '2026-04-12T06:00:00.000Z';

const VALID_OPUS_JSON = JSON.stringify({
  briefing: { fr: 'Le VIX a 16.2, le CAC grappille 0.3% et le spread OAT-Bund reste etale a 54 bps. Les taux europeens dans leur couloir habituel.' },
  tagline: { fr: 'Seance calme, marches en attente' },
  metadata: {
    theme_of_day: { fr: 'Attentisme' },
    certainty: 'preliminary',
    upcoming_event: { fr: 'Minutes de la Fed' },
    risk_level: 'low',
  },
});

const VALID_HAIKU_JSON = JSON.stringify({
  briefing: { en: 'VIX at 16.2, CAC gains 0.3% and the OAT-Bund spread remains flat at 54 bps.' },
  tagline: { en: 'Calm session, markets on hold' },
  theme_of_day: { en: 'Wait and see' },
  upcoming_event: { en: 'Fed minutes' },
});

function makeKpi(id: string, value: number) {
  return {
    id,
    category: 'indices' as const,
    label: { fr: id, en: id },
    value,
    unit: 'points',
    change_day: 0.5,
    change_pct: 0.3,
    direction: 'up' as const,
    source: 'finnhub' as const,
    timestamp: NOW_ISO,
    freshness_level: 'live' as const,
  };
}

const MOCK_KPIS = [
  makeKpi('vix', 16.2),
  makeKpi('dxy', 104.2),
  makeKpi('cac40', 7650),
  makeKpi('sp500', 5200),
  makeKpi('nasdaq', 16400),
  makeKpi('dax', 18200),
  { ...makeKpi('oat_10y', 3.42), category: 'rates' as const, unit: '%', source: 'fred' as const },
  { ...makeKpi('bund_10y', 2.88), category: 'rates' as const, unit: '%', source: 'fred' as const },
  { ...makeKpi('us_10y', 4.38), category: 'rates' as const, unit: '%', source: 'fred' as const },
  { ...makeKpi('spread_oat_bund', 54), category: 'spreads' as const, unit: 'bps', source: 'calculated' as const },
  { ...makeKpi('spread_bund_us', -150), category: 'spreads' as const, unit: 'bps', source: 'calculated' as const },
];

const MOCK_ALERT: import('../../../src/lib/schemas/alert.js').AlertState = {
  active: false,
  level: null,
  vix_current: 16.2,
  vix_p90_252d: 25.0,
  triggered_at: null,
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockGenerateBriefing.mockResolvedValue(VALID_OPUS_JSON);
  mockTranslateToEN.mockResolvedValue(VALID_HAIKU_JSON);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generateAnalysis', () => {
  it('produces a valid Analysis on happy path', async () => {
    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);

    expect(result.briefing.fr).toContain('VIX');
    expect(result.briefing.en).toContain('VIX');
    expect(result.tagline.fr).toBeTruthy();
    expect(result.tagline.en).toBeTruthy();
    expect(result.metadata.risk_level).toBe('low');
    expect(result.metadata.certainty).toBe('preliminary');
    expect(result.kpis).toHaveLength(11);
    expect(result.alert).toEqual(MOCK_ALERT);
    expect(result.version).toBe('ai');
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.pipeline_run_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(result.validated_at).toBeNull();
  });

  it('preserves ai_original', async () => {
    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);

    expect(result.ai_original).toBeDefined();
    expect(result.ai_original!.briefing.fr).toEqual(result.briefing.fr);
    expect(result.ai_original!.tagline.en).toEqual(result.tagline.en);
  });

  it('retries Opus when first response is invalid JSON', async () => {
    mockGenerateBriefing
      .mockResolvedValueOnce('not-valid-json')
      .mockResolvedValueOnce(VALID_OPUS_JSON);

    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);
    expect(result.briefing.fr).toContain('VIX');
    expect(mockGenerateBriefing).toHaveBeenCalledTimes(2);
  });

  it('retries Opus when first response fails Zod validation', async () => {
    const incompleteJson = JSON.stringify({ briefing: { fr: 'too short' } });
    mockGenerateBriefing
      .mockResolvedValueOnce(incompleteJson)
      .mockResolvedValueOnce(VALID_OPUS_JSON);

    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);
    expect(result.briefing.fr).toContain('VIX');
    expect(mockGenerateBriefing).toHaveBeenCalledTimes(2);
  });

  it('throws GenerateError after 2 failed Opus attempts', async () => {
    mockGenerateBriefing
      .mockResolvedValueOnce('not-json')
      .mockResolvedValueOnce('still-not-json');

    await expect(generateAnalysis(MOCK_KPIS, MOCK_ALERT)).rejects.toThrow(GenerateError);
    expect(mockGenerateBriefing).toHaveBeenCalledTimes(2);
  });

  it('retries Haiku when first translation is invalid JSON', async () => {
    mockTranslateToEN
      .mockResolvedValueOnce('not-json')
      .mockResolvedValueOnce(VALID_HAIKU_JSON);

    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);
    expect(result.briefing.en).toContain('VIX');
    expect(mockTranslateToEN).toHaveBeenCalledTimes(2);
  });

  it('includes translated EN fields from Haiku', async () => {
    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);

    expect(result.briefing.en).toBe('VIX at 16.2, CAC gains 0.3% and the OAT-Bund spread remains flat at 54 bps.');
    expect(result.tagline.en).toBe('Calm session, markets on hold');
    expect(result.metadata.theme_of_day.en).toBe('Wait and see');
    expect(result.metadata.upcoming_event?.en).toBe('Fed minutes');
  });

  it('handles null upcoming_event', async () => {
    const opusNoEvent = JSON.stringify({
      briefing: { fr: 'Le VIX a 16.2, le CAC grappille 0.3% et le spread OAT-Bund reste etale a 54 bps. Marche calme en attente.' },
      tagline: { fr: 'Seance calme' },
      metadata: {
        theme_of_day: { fr: 'Calme' },
        certainty: 'definitive',
        upcoming_event: null,
        risk_level: 'low',
      },
    });
    const haikuNoEvent = JSON.stringify({
      briefing: { en: 'Translated briefing' },
      tagline: { en: 'Calm session' },
      theme_of_day: { en: 'Calm' },
      upcoming_event: null,
    });
    mockGenerateBriefing.mockResolvedValueOnce(opusNoEvent);
    mockTranslateToEN.mockResolvedValueOnce(haikuNoEvent);

    const result = await generateAnalysis(MOCK_KPIS, MOCK_ALERT);
    expect(result.metadata.upcoming_event).toBeNull();
  });
});
