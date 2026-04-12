import type { Metadata } from 'next'
import { getLatestAnalysis } from './content'

export async function buildMetadata(locale: string): Promise<Metadata> {
  const lang = locale === 'en' ? 'en' : 'fr'

  try {
    const analysis = await getLatestAnalysis()
    const tagline = analysis.tagline[lang] || analysis.tagline.fr
    const briefing = analysis.briefing[lang] || analysis.briefing.fr
    // Split on sentence-ending period (followed by space or end of string)
    const sentenceMatch = briefing.match(/^(.+?\.)\s/)
    const description = sentenceMatch ? sentenceMatch[1] : briefing.slice(0, 160)
    const ogImage = `/api/og?locale=${lang}&date=${analysis.date}`

    return {
      title: tagline,
      description,
      openGraph: {
        title: tagline,
        description,
        images: [ogImage],
        type: 'website',
        siteName: 'YieldField',
        locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: tagline,
        description,
        images: [ogImage],
      },
    }
  } catch {
    return {
      title: 'YieldField — Finance × IA',
      description:
        lang === 'fr'
          ? 'Briefing quotidien des marchés financiers, généré par IA.'
          : 'Daily AI-generated financial markets briefing.',
      openGraph: {
        title: 'YieldField — Finance × IA',
        images: ['/og-fallback.png'],
        type: 'website',
        siteName: 'YieldField',
        locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'YieldField — Finance × IA',
        images: ['/og-fallback.png'],
      },
    }
  }
}
