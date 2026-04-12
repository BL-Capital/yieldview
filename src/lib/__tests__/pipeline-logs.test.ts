import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Must mock before import to intercept module-level cache
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, cache: (fn: unknown) => fn }
})

describe('getPipelineLogs', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns fallback runs when R2 URL is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_R2_PUBLIC_URL', '')
    const { getPipelineLogs } = await import('../pipeline-logs')
    const runs = await getPipelineLogs()
    expect(runs.length).toBeGreaterThanOrEqual(1)
    expect(runs[0]).toHaveProperty('runId')
    expect(runs[0]).toHaveProperty('status')
  })

  it('falls back gracefully when fetch fails', async () => {
    vi.stubEnv('NEXT_PUBLIC_R2_PUBLIC_URL', 'https://r2.example.com')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    const { getPipelineLogs } = await import('../pipeline-logs')
    const runs = await getPipelineLogs()
    expect(runs.length).toBeGreaterThanOrEqual(1)
  })

  it('falls back gracefully when R2 returns non-200', async () => {
    vi.stubEnv('NEXT_PUBLIC_R2_PUBLIC_URL', 'https://r2.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    const { getPipelineLogs } = await import('../pipeline-logs')
    const runs = await getPipelineLogs()
    expect(runs.length).toBeGreaterThanOrEqual(1)
  })

  it('returns parsed runs from R2 when valid JSON', async () => {
    const mockRuns = [
      {
        runId: 'run-1',
        startedAt: new Date().toISOString(),
        status: 'success',
        latencyMs: 1500,
        outputFilename: 'analysis-2026-04-12.json',
      },
    ]
    vi.stubEnv('NEXT_PUBLIC_R2_PUBLIC_URL', 'https://r2.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRuns,
    }))
    const { getPipelineLogs } = await import('../pipeline-logs')
    const runs = await getPipelineLogs()
    expect(runs).toHaveLength(1)
    expect(runs[0]!.runId).toBe('run-1')
    expect(runs[0]!.status).toBe('success')
  })

  it('falls back when R2 returns invalid schema', async () => {
    vi.stubEnv('NEXT_PUBLIC_R2_PUBLIC_URL', 'https://r2.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ invalid: true }],
    }))
    const { getPipelineLogs } = await import('../pipeline-logs')
    const runs = await getPipelineLogs()
    // Falls back to FALLBACK_RUNS
    expect(runs.length).toBeGreaterThanOrEqual(1)
    expect(runs[0]).toHaveProperty('runId')
  })
})
