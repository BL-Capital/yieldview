import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { getLatestAnalysis } from '@/lib/content'
import { HeroSection } from '@/components/dashboard/HeroSection'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const analysis = await getLatestAnalysis()
  const tagline = locale === 'fr' ? analysis.tagline.fr : analysis.tagline.en

  return {
    title: `YieldField — ${analysis.date}`,
    description: tagline,
    openGraph: {
      title: `YieldField — ${analysis.date}`,
      description: tagline,
    },
  }
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const analysis = await getLatestAnalysis()

  return <HeroSection analysis={analysis} locale={locale} />
}
