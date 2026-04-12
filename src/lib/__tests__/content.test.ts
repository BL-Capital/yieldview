import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLatestAnalysis } from '../content'
import VALID_ANALYSIS from '../../data/fallback-analysis.json'

describe('getLatestAnalysis', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns fallback when R2 URL not set', async () => {
    delete process.env['NEXT_PUBLIC_R2_PUBLIC_URL']
    const result = await getLatestAnalysis()
    expect(result.date).toBe(VALID_ANALYSIS.date)
    expect(result.kpis).toHaveLength(6)
  })

  it('returns fallback when fetch fails', async () => {
    process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] = 'https://fake-r2.example.com'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    const result = await getLatestAnalysis()
    expect(result.date).toBe(VALID_ANALYSIS.date)
  })

  it('returns fallback when fetch returns non-ok', async () => {
    process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] = 'https://fake-r2.example.com'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    const result = await getLatestAnalysis()
    expect(result.date).toBe(VALID_ANALYSIS.date)
  })

  it('returns parsed data when fetch succeeds', async () => {
    process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] = 'https://fake-r2.example.com'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => VALID_ANALYSIS,
    }))
    const result = await getLatestAnalysis()
    expect(result.date).toBe(VALID_ANALYSIS.date)
    expect(result.kpis).toHaveLength(6)
  })
})
