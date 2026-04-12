// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

// Mock @vercel/og
vi.mock('@vercel/og', () => ({
  ImageResponse: class MockImageResponse {
    body: ReadableStream | null = null
    status = 200
    headers: Headers

    constructor(element: React.ReactElement, options?: { width?: number; height?: number; headers?: Record<string, string> }) {
      this.headers = new Headers(options?.headers)
      this.headers.set('content-type', 'image/png')
    }
  },
}))

// Mock content module
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
  briefing: { fr: 'Briefing français.', en: 'English briefing.' },
  tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
  metadata: {
    theme_of_day: { fr: 'Thème', en: 'Theme' },
    certainty: 'definitive' as const,
    upcoming_event: null,
    risk_level: 'low' as const,
  },
  kpis: [{
    id: 'cac40',
    category: 'indices' as const,
    label: { fr: 'CAC 40', en: 'CAC 40' },
    value: 7234.56,
    unit: 'pts',
    change_day: 174.23,
    change_pct: 2.47,
    direction: 'up' as const,
    source: 'finnhub' as const,
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live' as const,
  }],
  alert: {
    active: false,
    level: null,
    vix_current: 22.4,
    vix_p90_252d: 28.0,
    triggered_at: null,
  },
}

describe('/api/og', () => {
  it('returns 200 with image/png content type', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const req = new Request('http://localhost/api/og')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/png')
  })

  it('respects locale=en parameter', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const req = new Request('http://localhost/api/og?locale=en')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })

  it('defaults to fr locale', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const req = new Request('http://localhost/api/og')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })

  it('returns fallback image when analysis fetch fails', async () => {
    vi.mocked(getLatestAnalysis).mockRejectedValue(new Error('Network error'))

    const req = new Request('http://localhost/api/og')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/png')
  })

  it('sets cache control header', async () => {
    vi.mocked(getLatestAnalysis).mockResolvedValue(mockAnalysis)

    const req = new Request('http://localhost/api/og')
    const res = await GET(req)

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600')
  })
})
