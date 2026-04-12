import { cache } from 'react'
import { AnalysisSchema, type Analysis } from './schemas/analysis'

const R2_BASE_URL = process.env['NEXT_PUBLIC_R2_PUBLIC_URL'] ?? ''

/**
 * Emergency fallback — used only when fallback-analysis.json is itself corrupted.
 * Returns a minimal valid Analysis so the page never 500s.
 */
const EMERGENCY_ANALYSIS: Analysis = {
  date: '1970-01-01',
  generated_at: '1970-01-01T00:00:00.000Z',
  validated_at: null,
  pipeline_run_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  version: 'manual-override',
  briefing: {
    fr: 'Données temporairement indisponibles. Veuillez réessayer plus tard.',
    en: 'Data temporarily unavailable. Please try again later.',
  },
  tagline: { fr: 'YieldField', en: 'YieldField' },
  metadata: {
    theme_of_day: { fr: 'Données indisponibles', en: 'Data unavailable' },
    certainty: 'preliminary',
    upcoming_event: null,
    risk_level: 'low',
  },
  kpis: [],
  alert: {
    active: false,
    level: null,
    vix_current: 0,
    vix_p90_252d: 0,
    triggered_at: null,
  },
}

// P8: cache() deduplicates calls within a single server render pass
export const getLatestAnalysis = cache(async (): Promise<Analysis> => {
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
})

async function loadFallback(): Promise<Analysis> {
  try {
    const fallback = (await import('../data/fallback-analysis.json', { with: { type: 'json' } })).default
    return AnalysisSchema.parse(fallback)
  } catch (err) {
    console.error('[content] Fallback analysis data invalid, using emergency data:', err)
    return EMERGENCY_ANALYSIS
  }
}
