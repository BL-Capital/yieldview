import { cache } from 'react'
import { z } from 'zod'

const PipelineRunSchema = z.object({
  runId: z.string(),
  startedAt: z.string().datetime(),
  status: z.enum(['success', 'warning', 'error', 'running']),
  latencyMs: z.number().int().nonnegative(),
  outputFilename: z.string(),
  error: z.string().optional(),
})

export type PipelineRun = z.infer<typeof PipelineRunSchema>

const PipelineRunsSchema = z.array(PipelineRunSchema).max(7)

const FALLBACK_RUNS: PipelineRun[] = [
  { runId: 'mock-1', startedAt: new Date(Date.now() - 86400000).toISOString(), status: 'success', latencyMs: 1234, outputFilename: 'analysis-mock-1.json' },
  { runId: 'mock-2', startedAt: new Date(Date.now() - 172800000).toISOString(), status: 'success', latencyMs: 987, outputFilename: 'analysis-mock-2.json' },
  { runId: 'mock-3', startedAt: new Date(Date.now() - 259200000).toISOString(), status: 'warning', latencyMs: 2341, outputFilename: 'analysis-mock-3.json', error: 'Alpha Vantage rate limit hit' },
]

const R2_BASE_URL = process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] ?? ''

export const getPipelineLogs = cache(async (): Promise<PipelineRun[]> => {
  if (!R2_BASE_URL) {
    console.warn('[pipeline-logs] NEXT_PUBLIC_R2_PUBLIC_URL not set, using fallback')
    return FALLBACK_RUNS
  }

  try {
    const res = await fetch(`${R2_BASE_URL}/logs/runs-last-7.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) throw new Error(`R2 HTTP ${res.status}`)

    const json: unknown = await res.json()
    return PipelineRunsSchema.parse(json)
  } catch (err) {
    console.warn('[pipeline-logs] R2 fetch failed, using fallback:', err)
    return FALLBACK_RUNS
  }
})
