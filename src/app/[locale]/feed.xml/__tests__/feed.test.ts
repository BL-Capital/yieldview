// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/content', () => ({
  getLatestAnalysis: vi.fn(),
}))

import { GET } from '../route'
import { getLatestAnalysis } from '@/lib/content'

const mockAnalysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:30:00.000Z',
  validated_at: null,
  pipeline_run_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  version: 'ai' as const,
  briefing: { fr: 'Briefing FR.', en: 'Briefing EN.' },
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

describe('/[locale]/feed.xml', () => {
  it('returns 200 with RSS content type for FR', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const req = new Request('http://localhost/fr/feed.xml')
    const res = await GET(req, { params: Promise.resolve({ locale: 'fr' }) })

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
  })

  it('returns valid XML with FR content', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const res = await GET(new Request('http://localhost/fr/feed.xml'), { params: Promise.resolve({ locale: 'fr' }) })
    const xml = await res.text()

    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('Tagline FR')
    expect(xml).toContain('Briefing FR.')
    expect(xml).toContain('<language>fr</language>')
  })

  it('returns EN content for en locale', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const res = await GET(new Request('http://localhost/en/feed.xml'), { params: Promise.resolve({ locale: 'en' }) })
    const xml = await res.text()

    expect(xml).toContain('Tagline EN')
    expect(xml).toContain('Briefing EN.')
    expect(xml).toContain('<language>en</language>')
  })

  it('sets cache control header', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const res = await GET(new Request('http://localhost/fr/feed.xml'), { params: Promise.resolve({ locale: 'fr' }) })

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600')
  })

  it('returns fallback RSS when analysis fails', async () => {
    vi.mocked(getLatestAnalysis).mockRejectedValue(new Error('Fetch failed'))

    const res = await GET(new Request('http://localhost/fr/feed.xml'), { params: Promise.resolve({ locale: 'fr' }) })
    const xml = await res.text()

    expect(res.status).toBe(200)
    expect(xml).toContain('No briefing available')
  })

  it('escapes XML special characters', async () => {
    const xssAnalysis = {
      ...mockAnalysis,
      tagline: { fr: 'Test <script>alert("xss")</script>', en: 'Test' },
    }
    vi.mocked(getLatestAnalysis).mockResolvedValue(xssAnalysis)

    const res = await GET(new Request('http://localhost/fr/feed.xml'), { params: Promise.resolve({ locale: 'fr' }) })
    const xml = await res.text()

    expect(xml).not.toContain('<script>')
    expect(xml).toContain('&lt;script&gt;')
  })
})
