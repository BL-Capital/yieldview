import { ImageResponse } from '@vercel/og'
import { getLatestAnalysis } from '@/lib/content'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr'

  try {
    const analysis = await getLatestAnalysis()

    const tagline = analysis.tagline[locale] || analysis.tagline.fr
    const briefingFull = analysis.briefing[locale] || analysis.briefing.fr
    // Split on sentence-ending period (followed by space or end of string)
    const sentenceMatch = briefingFull.match(/^(.+?\.)\s/)
    const briefingSnippet = sentenceMatch ? sentenceMatch[1] : briefingFull.slice(0, 160)
    const date = analysis.date

    // Pick a key KPI (first one available)
    const keyKpi = analysis.kpis[0]
    const kpiLabel = keyKpi ? (keyKpi.label[locale] || keyKpi.label.fr) : ''
    const kpiValue = keyKpi
      ? `${keyKpi.direction === 'up' ? '▲' : keyKpi.direction === 'down' ? '▼' : '—'} ${keyKpi.change_pct > 0 ? '+' : ''}${keyKpi.change_pct.toFixed(2)}%`
      : ''

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
            backgroundColor: '#0F0F0F',
            color: '#F5F0E8',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #8B7332)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0F0F0F',
              }}>
                Y
              </div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>YieldField</span>
            </div>
            <span style={{ fontSize: '16px', color: '#C9A84C', fontFamily: 'monospace' }}>{date}</span>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2, color: '#C9A84C' }}>
              {tagline}
            </div>
            <div style={{ fontSize: '18px', lineHeight: 1.5, color: '#F5F0E8CC', maxWidth: '900px' }}>
              {briefingSnippet.length > 200 ? briefingSnippet.slice(0, 200) + '...' : briefingSnippet}
            </div>
            {keyKpi && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#F5F0E8' }}>{kpiLabel}</span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: keyKpi.direction === 'up' ? '#22C55E' : keyKpi.direction === 'down' ? '#EF4444' : '#F5F0E8',
                }}>
                  {kpiValue}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #C9A84C33', paddingTop: '20px' }}>
            <span style={{ fontSize: '14px', color: '#F5F0E880' }}>
              Finance × IA — {locale === 'fr' ? 'Briefing quotidien' : 'Daily Briefing'}
            </span>
            <span style={{ fontSize: '14px', color: '#C9A84C', fontFamily: 'monospace' }}>
              yieldfield.io
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      },
    )
  } catch (error) {
    console.error('[og] Generation failed:', error)

    // Fallback: return a simple static-like image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F0F0F',
            color: '#F5F0E8',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#C9A84C', marginBottom: '16px' }}>
            YieldField
          </div>
          <div style={{ fontSize: '24px', color: '#F5F0E880' }}>
            Finance × IA
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      },
    )
  }
}
