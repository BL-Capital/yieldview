// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Analysis } from '../../../src/lib/schemas/analysis'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { sendDailyNewsletter, NewsletterError } from '../newsletter'

const mockAnalysis: Analysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:30:00.000Z',
  validated_at: null,
  pipeline_run_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  version: 'ai',
  briefing: { fr: 'Briefing FR', en: 'Briefing EN' },
  tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
  metadata: {
    theme_of_day: { fr: 'Thème', en: 'Theme' },
    certainty: 'definitive',
    upcoming_event: null,
    risk_level: 'low',
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

describe('newsletter.ts', () => {
  beforeEach(() => {
    vi.stubEnv('BUTTONDOWN_API_KEY', 'test-key')
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('sends newsletter successfully', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await sendDailyNewsletter(mockAnalysis)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.buttondown.email/v1/emails',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Tagline FR'),
      }),
    )
  })

  it('sends both FR and EN briefing in body', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await sendDailyNewsletter(mockAnalysis)

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.body).toContain('Briefing FR')
    expect(body.body).toContain('Briefing EN')
    expect(body.status).toBe('sent')
  })

  it('retries on 5xx errors and eventually fails', async () => {
    mockFetch.mockResolvedValue(new Response('Server Error', { status: 500 }))

    await expect(sendDailyNewsletter(mockAnalysis)).rejects.toThrow(NewsletterError)
    expect(mockFetch).toHaveBeenCalledTimes(3)
  }, 30000)

  it('throws when BUTTONDOWN_API_KEY is missing', async () => {
    delete process.env['BUTTONDOWN_API_KEY']

    await expect(sendDailyNewsletter(mockAnalysis)).rejects.toThrow('BUTTONDOWN_API_KEY is not set')
  })

  it('sends Authorization header with token', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await sendDailyNewsletter(mockAnalysis)

    const headers = mockFetch.mock.calls[0][1].headers
    expect(headers['Authorization']).toBe('Token test-key')
  })
})
