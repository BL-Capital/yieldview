import { cn } from '@/lib/utils'
import type { Analysis } from '@/lib/schemas/analysis'
import { AuroraWithBeams } from '@/components/aceternity/aurora-with-beams'
import { HeroAvatar } from '@/components/rive/HeroAvatar'
import type { RiskLevel } from '@/components/rive/HeroAvatar'
import { AlertBanner } from '@/components/alerts/AlertBanner'
import { RiskIndicator } from './RiskIndicator'
import { TaglineHeader } from './TaglineHeader'
import { MetadataChips } from './MetadataChips'
import { BriefingPanel } from './BriefingPanel'
import { FreshnessIndicator } from './FreshnessIndicator'
import { KpiBentoGrid } from './KpiBentoGrid'
import { SecondaryKpisMarquee } from './SecondaryKpisMarquee'
import type { SecondaryKpi } from '@/data/mock-kpis'

interface HeroSectionProps {
  analysis: Analysis
  locale: string
  secondaryKpis: SecondaryKpi[]
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

// Map alertLevel → RiskLevel pour HeroAvatar
function mapToRiskLevel(alertLevel: 'low' | 'warning' | 'alert' | 'crisis' | null): RiskLevel {
  if (!alertLevel || alertLevel === 'low') return 'low'
  if (alertLevel === 'warning') return 'medium'
  if (alertLevel === 'alert') return 'high'
  return 'crisis'
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

export function HeroSection({ analysis, locale, secondaryKpis }: HeroSectionProps) {
  const alertLevel = mapAlertLevel(analysis)
  const freshnessLevel = mapFreshnessLevel(analysis)
  const publishedAt = analysis.generated_at
  const disclaimer = DISCLAIMER[locale] ?? DISCLAIMER.fr!

  return (
    <AuroraWithBeams alertLevel={alertLevel} className="min-h-screen">
      <div className={cn('flex flex-col items-center px-4 py-16 sm:py-24 gap-8 sm:gap-10')}>
        {/* 0. Alert Banner (conditional) */}
        {analysis.alert.active && analysis.alert.level && (
          <AlertBanner
            level={analysis.alert.level}
            vix={analysis.alert.vix_current}
            percentile={analysis.alert.vix_p90_252d}
            triggeredAt={analysis.alert.triggered_at}
            locale={locale}
          />
        )}

        {/* 1. Hero Avatar */}
        <HeroAvatar riskLevel={mapToRiskLevel(alertLevel)} className="mb-2" />

        {/* 2. Risk Indicator */}
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

        {/* 6. Secondary KPIs Marquee — bandeau défilant avant les gros KPIs */}
        <SecondaryKpisMarquee kpis={secondaryKpis} />

        {/* 7. KPI Bento Grid */}
        <div className="w-full max-w-5xl">
          <KpiBentoGrid kpis={analysis.kpis} locale={locale} />
        </div>

        {/* 8. CTA Coulisses — heartbeat pulse "les coulisses c'est la vie du site" */}
        <div className="relative mt-4">
          {/* Heartbeat rings — strong glow */}
          <span className="absolute -inset-3 rounded-full border-2 border-yield-gold/60 animate-[heartbeat_1.8s_ease-in-out_infinite] shadow-[0_0_15px_rgba(201,168,76,0.4)] motion-reduce:animate-none" />
          <span className="absolute -inset-5 rounded-full border border-yield-gold/30 animate-[heartbeat_1.8s_ease-in-out_0.3s_infinite] shadow-[0_0_25px_rgba(201,168,76,0.2)] motion-reduce:animate-none" />
          <a
            href={`/${locale}/coulisses`}
            className={cn(
              'relative inline-flex items-center gap-3',
              'rounded-full border-2 border-yield-gold px-8 py-3',
              'text-base font-mono text-yield-gold',
              'shadow-[0_0_20px_rgba(201,168,76,0.25)]',
              'transition-all hover:bg-yield-gold/10 hover:scale-105',
              'hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]',
            )}
          >
            <span className="inline-block w-3 h-3 rounded-full bg-yield-gold shadow-[0_0_8px_rgba(201,168,76,0.8)] animate-[pulse-dot_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
            {locale === 'fr' ? 'Voir les Coulisses' : 'Behind the Scenes'}
          </a>
        </div>
      </div>
    </AuroraWithBeams>
  )
}
