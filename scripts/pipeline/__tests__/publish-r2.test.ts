import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock R2 client ───────────────────────────────────────────────────────────

vi.mock('../../../src/lib/r2.js', () => ({
  uploadJSON: vi.fn(),
}));

import { uploadJSON } from '../../../src/lib/r2.js';
const mockUploadJSON = vi.mocked(uploadJSON);

import { publishAnalysis, PublishError } from '../publish-r2';
import type { Analysis } from '../../../src/lib/schemas/analysis';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const MOCK_ANALYSIS: Analysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:00:00.000Z',
  validated_at: null,
  pipeline_run_id: '550e8400-e29b-41d4-a716-446655440000',
  version: 'ai',
  briefing: { fr: 'Briefing FR long enough for validation.', en: 'Briefing EN long enough for validation.' },
  tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
  metadata: {
    theme_of_day: { fr: 'Attentisme', en: 'Wait and see' },
    certainty: 'preliminary',
    upcoming_event: { fr: 'Minutes de la Fed', en: 'Fed minutes' },
    risk_level: 'low',
  },
  kpis: [],
  alert: { active: false, level: null, vix_current: 16.2, vix_p90_252d: 25.0, triggered_at: null },
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockUploadJSON.mockResolvedValue(undefined);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('publishAnalysis', () => {
  it('uploads latest.json and archive', async () => {
    await publishAnalysis(MOCK_ANALYSIS);

    expect(mockUploadJSON).toHaveBeenCalledTimes(2);
    expect(mockUploadJSON).toHaveBeenCalledWith('latest.json', MOCK_ANALYSIS);
    expect(mockUploadJSON).toHaveBeenCalledWith('archive/2026-04-12.json', MOCK_ANALYSIS);
  });

  it('uses the analysis date for archive key', async () => {
    const analysis = { ...MOCK_ANALYSIS, date: '2026-03-15' };
    await publishAnalysis(analysis);

    expect(mockUploadJSON).toHaveBeenCalledWith('archive/2026-03-15.json', analysis);
  });

  it('propagates R2 upload errors', async () => {
    mockUploadJSON.mockRejectedValueOnce(new Error('R2 down'));

    await expect(publishAnalysis(MOCK_ANALYSIS)).rejects.toThrow('R2 down');
  });
});
