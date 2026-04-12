import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getLatestAnalysis } from '@/lib/content'
import { TracingBeam } from '@/components/aceternity/tracing-beam'
import { DotPattern } from '@/components/magic-ui/dot-pattern'
import { TimelineStep } from '@/components/coulisses/TimelineStep'
import { PromptCodeBlock } from '@/components/coulisses/PromptCodeBlock'
import { PipelineLogsTableLazy } from '@/components/coulisses/PipelineLogsTableLazy'
import { HeroAvatarLazy } from '@/components/rive/HeroAvatarLazy'
import { cn } from '@/lib/utils'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Coulisses' })
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  }
}

// Pipeline diagram SVG
function PipelineDiagram() {
  return (
    <svg viewBox="0 0 480 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg opacity-80">
      {['GitHub Actions', 'APIs', 'Claude', 'R2', 'Site'].map((label, i) => {
        const x = 40 + i * 100
        return (
          <g key={label}>
            <rect x={x - 35} y="20" width="70" height="36" rx="6" fill="#1A2733" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.6" />
            <text x={x} y="42" textAnchor="middle" fontSize="10" fill="#C9A84C" fontFamily="monospace">{label}</text>
            {i < 4 && <path d={`M${x + 35} 38 L${x + 65} 38`} stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5" markerEnd="url(#arr)" />}
          </g>
        )
      })}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#C9A84C" opacity="0.5" />
        </marker>
      </defs>
    </svg>
  )
}

// BMAD diagram SVG
function BmadDiagram() {
  return (
    <svg viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md opacity-80">
      {['Analyst', 'PM', 'Architect', 'Dev', 'Review'].map((label, i) => {
        const x = 40 + i * 80
        return (
          <g key={label}>
            <circle cx={x} cy="30" r="22" fill="#1A2733" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.6" />
            <text x={x} y="34" textAnchor="middle" fontSize="9" fill="#C9A84C" fontFamily="monospace">{label}</text>
            {i < 4 && <path d={`M${x + 22} 30 L${x + 58} 30`} stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5" markerEnd="url(#arr2)" />}
          </g>
        )
      })}
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#C9A84C" opacity="0.5" />
        </marker>
      </defs>
    </svg>
  )
}

export default async function CoulissesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'Coulisses' })
  const analysis = await getLatestAnalysis()

  const alertLevel = analysis.alert.active ? analysis.alert.level : null
  const riskLevel: 'low' | 'medium' | 'high' | 'crisis' = !alertLevel ? 'low'
    : alertLevel === 'warning' ? 'medium'
    : alertLevel === 'alert' ? 'high'
    : 'crisis'

  const promptVersions = [
    { label: 'v01', code: t('prompts.v01.notes'), notes: t('prompts.v01.notes') },
    { label: 'v02', code: t('prompts.v02.notes'), notes: t('prompts.v02.notes') },
    { label: 'v03', code: t('prompts.v03.notes'), notes: t('prompts.v03.notes') },
    { label: 'v04', code: t('prompts.v04.notes'), notes: t('prompts.v04.notes') },
    { label: 'v05', code: t('prompts.v05.notes'), notes: t('prompts.v05.notes') },
    { label: 'v06', code: t('prompts.v06.notes'), notes: t('prompts.v06.notes') },
  ]

  // FR prompts have full code content
  const frPromptVersions = locale === 'fr' ? [
    { label: 'v01', code: "Analyse les marchés financiers d'aujourd'hui et donne un résumé en français. Inclus le CAC 40, le S&P 500 et le VIX.\n\nDonnées : {data}", notes: "Premier jet — trop générique, pas de personnalité" },
    { label: 'v02', code: "Tu es un analyste financier senior. Analyse les marchés d'aujourd'hui et produis un briefing professionnel en français.\n\nConcentre-toi sur : CAC 40, S&P 500, VIX, Or, Pétrole.\nTon : professionnel, factuel, accessible.\n\nDonnées : {data}", notes: "Ajout du rôle d'analyste — meilleur cadrage" },
    { label: 'v03', code: "Tu es un analyste financier senior. Produis un briefing JSON structuré.\n\nSi VIX > percentile 90 (252j) → alert_level: 'alert'\nSi VIX > percentile 75 → alert_level: 'warning'\nSinon → alert_level: 'low'\n\nFormat :\n{\n  \"briefing\": { \"fr\": \"...\", \"en\": \"...\" },\n  \"tagline\": { \"fr\": \"...\", \"en\": \"...\" },\n  \"alert_level\": \"low|warning|alert|crisis\"\n}\n\nDonnées : {data}", notes: "Ajout structure JSON + niveau d'alerte VIX" },
    { label: 'v04', code: "Tu es Le Chartiste — analyste financier virtuel de YieldField. Ton style : magazine premium, factuel mais accessible.\n\nProduis un briefing JSON avec :\n- Briefing FR/EN (150-200 mots)\n- Tagline du jour\n- Thème du jour\n- Niveau d'alerte (VIX percentile)\n- Métadonnées\n\nDonnées : {data}", notes: "Ajout ton éditorial + thème du jour" },
    { label: 'v05', code: "Tu es Le Chartiste.\n\n<thinking>\n1. Tendance principale (indices)\n2. Signal de peur (VIX)\n3. Refuge (Or)\n4. Énergie (Pétrole)\n5. Corrélations notables\n6. Risque global\n</thinking>\n\nProduis UNIQUEMENT le JSON final.\n\nDonnées : {data}", notes: "Chain-of-thought interne + validation schema Zod" },
    { label: 'v06', code: "Tu es Le Chartiste, la voix analytique de YieldField.\n\nTon mandat : transformer des données brutes en intelligence éditoriale.\nTon style : Hemingway des marchés.\nTon audience : investisseurs individuels avertis.\n\n<thinking>\n1. Lire toutes les données\n2. Identifier le fait dominant\n3. Calculer le risque (VIX percentile)\n4. Rédiger FR puis EN\n5. Générer la tagline\n6. Valider la cohérence\n</thinking>\n\nOutput JSON uniquement.\nSchéma : {schema}\nDonnées : {data}", notes: "Version production — personnalité complète + sortie bilingue stricte" },
  ] : promptVersions

  return (
    <div className="relative min-h-screen bg-yield-dark-base">
      {/* Background dot pattern */}
      <DotPattern
        className="text-yield-gold/20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,white,transparent)]"
        width={24}
        height={24}
        cr={1}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href={`/${locale}`}
          className={cn(
            'inline-flex items-center gap-1 text-sm font-mono text-zinc-500',
            'hover:text-yield-gold transition-colors mb-12 block',
          )}
        >
          {t('backToHome')}
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
          <HeroAvatarLazy riskLevel={riskLevel} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
              {t('title')}
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Timeline with TracingBeam */}
        <TracingBeam>
          {/* Step 1 */}
          <TimelineStep
            step={1}
            title={t('steps.step1.title')}
            date={t('steps.step1.date')}
            description={t('steps.step1.description')}
            media={
              <blockquote className="border-l-2 border-yield-gold/40 pl-4 italic text-zinc-400 text-sm">
                &ldquo;{t('steps.step1.quote')}&rdquo;
              </blockquote>
            }
          />

          {/* Step 2 */}
          <TimelineStep
            step={2}
            title={t('steps.step2.title')}
            date={t('steps.step2.date')}
            description={t('steps.step2.description')}
            media={<BmadDiagram />}
          />

          {/* Step 3 */}
          <TimelineStep
            step={3}
            title={t('steps.step3.title')}
            date={t('steps.step3.date')}
            description={t('steps.step3.description')}
            media={<PipelineDiagram />}
          >
            <div className="mt-6">
              <p className="text-xs font-mono text-zinc-500 mb-3 uppercase tracking-widest">
                {t('logsSection.title')}
              </p>
              <PipelineLogsTableLazy />
            </div>
          </TimelineStep>

          {/* Step 4 */}
          <TimelineStep
            step={4}
            title={t('steps.step4.title')}
            date={t('steps.step4.date')}
            description={t('steps.step4.description')}
          >
            <PromptCodeBlock
              versions={frPromptVersions}
              language="markdown"
              title={locale === 'fr' ? 'Évolution des prompts' : 'Prompt Evolution'}
            />
          </TimelineStep>

          {/* Step 5 */}
          <TimelineStep
            step={5}
            title={t('steps.step5.title')}
            date={t('steps.step5.date')}
            description={t('steps.step5.description')}
            isLast
            media={
              <div className="inline-flex items-center gap-2 rounded-lg border border-yield-gold/20 bg-yield-gold/5 px-4 py-2">
                <span className="font-mono text-sm text-yield-gold">{t('steps.step5.metrics')}</span>
              </div>
            }
          />
        </TracingBeam>
      </div>
    </div>
  )
}
