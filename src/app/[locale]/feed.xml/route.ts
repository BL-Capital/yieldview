import { getLatestAnalysis } from '@/lib/content'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  const lang = locale === 'en' ? 'en' : 'fr'

  try {
    const analysis = await getLatestAnalysis()

    const title = lang === 'fr' ? 'YieldField — Briefing Quotidien' : 'YieldField — Daily Briefing'
    const description = lang === 'fr'
      ? 'Briefing quotidien des marchés financiers, généré par IA.'
      : 'Daily AI-generated financial markets briefing.'
    const tagline = escapeXml(analysis.tagline[lang] || analysis.tagline.fr)
    const briefing = escapeXml(analysis.briefing[lang] || analysis.briefing.fr)
    const pubDate = new Date(analysis.generated_at).toUTCString()
    const guid = `https://yieldfield.io/${lang}#${analysis.date}`

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>https://yieldfield.io/${lang}</link>
    <description>${escapeXml(description)}</description>
    <language>${lang}</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <item>
      <title>${tagline}</title>
      <description>${briefing}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <link>https://yieldfield.io/${lang}</link>
    </item>
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    const title = lang === 'fr' ? 'YieldField — Briefing Quotidien' : 'YieldField — Daily Briefing'
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>https://yieldfield.io/${lang}</link>
    <description>No briefing available</description>
    <language>${lang}</language>
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
