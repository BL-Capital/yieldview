import { cn } from '@/lib/utils'
import type { Analysis } from '@/lib/schemas/analysis'
import { AuroraWithBeams } from '@/components/aceternity/aurora-with-beams'
import { RiskIndicator } from './RiskIndicator'
import { TaglineHeader } from './TaglineHeader'
import { MetadataChips } from './MetadataChips'
import { BriefingPanel } from './BriefingPanel'
import { FreshnessIndicator } from './FreshnessIndicator'
import { KpiBentoGrid } from './KpiBentoGrid'
import { SecondaryKpisMarquee } from './SecondaryKpisMarquee'
import { STATIC_SECONDARY_KPIS } from '@/data/mock-kpis'

interface HeroSectionProps {
  analysis: Analysis
  locale: string
}

// Map analysis alert level → RiskIndicator alert level
function mapAlertLevel(
  analysis: Analysis,
): 'low' | 'warning' | 'alert' | 'crisis' | null {
  if (!analysis.alert.active || !analysis.alert.level) return 'low'
  const lvl = analysis.alert.level
  if (lvl === 'warning') return 'warning'
  if (lvl === 'alert') return 'alert'
  if (lvl === 'crisis') return 'crisis'
  return 'low'
}

// Map analysis risk_level → FreshnessLevel
function mapFreshnessLevel(analysis: Analysis): 'fresh' | 'aging' | 'stale' {
  const latestKpi = analysis.kpis[0]
  if (!latestKpi) return 'stale'
  const ageMin = Math.floor(
    (Date.now() - new Date(latestKpi.timestamp).getTime()) / 60_000,
  )
  if (ageMin < 120) return 'fresh'
  if (ageMin < 480) return 'aging'
  return 'stale'
}

const DISCLAIMER: Record<string, string> = {
  fr: 'Les informations présentées sont à titre informatif uniquement et ne constituent pas un conseil en investissement.',
  en: 'The information presented is for informational purposes only and does not constitute investment advice.',
}

export function HeroSection({ analysis, locale }: HeroSectionProps) {
  const alertLevel = mapAlertLevel(analysis)
  const freshnessLevel = mapFreshnessLevel(analysis)
  const publishedAt = analysis.generated_at
  const disclaimer = DISCLAIMER[locale] ?? DISCLAIMER.fr!

  return (
    <AuroraWithBeams alertLevel={alertLevel} className="min-h-screen">
      <div className={cn('flex flex-col items-center px-4 py-16 sm:py-24 gap-8 sm:gap-10')}>
        {/* 1. Risk Indicator */}
        <RiskIndicator alertLevel={alertLevel} locale={locale} />

        {/* 2. Tagline */}
        <TaglineHeader />

        {/* 3. Metadata chips */}
        <MetadataChips
          publishedAt={publishedAt}
          readingTimeMin={3}
          alertLevel={
            analysis.alert.active && analysis.alert.level
              ? analysis.alert.level
              : 'low'
          }
          locale={locale}
        />

        {/* 4. Briefing */}
        <BriefingPanel
          briefingFr={analysis.briefing.fr}
          briefingEn={analysis.briefing.en}
          locale={locale}
          disclaimer={disclaimer}
          className="w-full"
        />

        {/* 5. Freshness */}
        <FreshnessIndicator
          publishedAt={publishedAt}
          freshnessLevel={freshnessLevel}
          locale={locale}
        />

        {/* 6. KPI Bento Grid */}
        <div className="w-full max-w-5xl">
          <KpiBentoGrid kpis={analysis.kpis} locale={locale} />
        </div>

        {/* 7. Secondary KPIs Marquee */}
        <SecondaryKpisMarquee kpis={STATIC_SECONDARY_KPIS} />

        {/* 8. CTA Coulisses */}
        <a
          href={`/${locale}/coulisses`}
          className={cn(
            'mt-4 inline-flex items-center gap-2',
            'rounded-full border border-yield-gold px-6 py-2.5',
            'text-sm font-mono text-yield-gold',
            'transition-colors hover:bg-yield-gold/10',
          )}
        >
          {locale === 'fr' ? 'Voir les Coulisses' : 'Behind the Scenes'} →
        </a>
      </div>
    </AuroraWithBeams>
  )
}
