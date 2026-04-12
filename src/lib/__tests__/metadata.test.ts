// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/content', () => ({
  getLatestAnalysis: vi.fn(),
}))

import { buildMetadata } from '../metadata'
import { getLatestAnalysis } from '@/lib/content'

const mockAnalysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:30:00.000Z',
  validated_at: null,
  pipeline_run_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  version: 'ai' as const,
  briefing: { fr: 'Briefing français complet.', en: 'Full english briefing.' },
  tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
  metadata: {
    theme_of_day: { fr: 'Thème', en: 'Theme' },
    certainty: 'definitive' as const,
    upcoming_event: null,
    risk_level: 'low' as const,
  },
  kpis: [],
  alert: {
    active: false,
    level: null,
    vix_current: 22.4,
    vix_p90_252d: 28.0,
    triggered_at: null,
  },
}

describe('buildMetadata', () => {
  it('returns French meta tags for fr locale', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const meta = await buildMetadata('fr')

    expect(meta.title).toBe('Tagline FR')
    expect(meta.description).toBe('Briefing français complet.')
    expect(meta.openGraph?.locale).toBe('fr_FR')
  })

  it('returns English meta tags for en locale', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const meta = await buildMetadata('en')

    expect(meta.title).toBe('Tagline EN')
    expect(meta.description).toBe('Full english briefing.')
    expect(meta.openGraph?.locale).toBe('en_US')
  })

  it('includes OG image with locale and date', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const meta = await buildMetadata('fr')

    const images = meta.openGraph?.images as string[]
    expect(images?.[0]).toContain('/api/og?locale=fr&date=2026-04-12')
  })

  it('sets twitter card to summary_large_image', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const meta = await buildMetadata('en')

    const twitter = meta.twitter as Record<string, unknown>
    expect(twitter?.card).toBe('summary_large_image')
  })

  it('returns fallback meta when analysis fails', async () => {
    vi.mocked(getLatestAnalysis).mockRejectedValue(new Error('Fetch failed'))

    const meta = await buildMetadata('fr')

    expect(meta.title).toBe('YieldField — Finance × IA')
    expect(meta.openGraph?.images).toEqual(['/og-fallback.png'])
  })
})
