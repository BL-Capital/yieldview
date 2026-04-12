import { AnalysisSchema, type Analysis } from './schemas/analysis'

const R2_BASE_URL = process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] ?? ''

export async function getLatestAnalysis(): Promise<Analysis> {
  if (!R2_BASE_URL) {
    console.warn('[content] NEXT_PUBLIC_R2_PUBLIC_URL not set, using fallback')
    return loadFallback()
  }

  try {
    const res = await fetch(`${R2_BASE_URL}/latest.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      throw new Error(`R2 HTTP ${res.status}`)
    }

    const json: unknown = await res.json()
    return AnalysisSchema.parse(json)
  } catch (err) {
    console.warn('[content] R2 fetch failed, using fallback:', err)
    return loadFallback()
  }
}

async function loadFallback(): Promise<Analysis> {
  try {
    const fallback = (await import('../data/fallback-analysis.json', { assert: { type: 'json' } })).default
    return AnalysisSchema.parse(fallback)
  } catch (err) {
    throw new Error(`[content] Fallback analysis data invalid: ${err}`)
  }
}
