import { cn } from '@/lib/utils'

type AlertLevel = 'calm' | 'warning' | 'alert' | 'crisis' | null

interface MetadataChipsProps {
  publishedAt: string
  readingTimeMin: number
  alertLevel: AlertLevel
  locale: string
}

const alertConfig: Record<string, { label: { fr: string; en: string }; className: string }> = {
  calm: {
    label: { fr: 'Marché calme', en: 'Calm market' },
    className: 'bg-bull/20 text-bull border-bull/40',
  },
  warning: {
    label: { fr: 'Vigilance', en: 'Watch' },
    className: 'bg-alert-warning/20 text-alert-warning border-alert-warning/40',
  },
  alert: {
    label: { fr: 'Alerte', en: 'Alert' },
    className: 'bg-alert-alert/20 text-alert-alert border-alert-alert/40',
  },
  crisis: {
    label: { fr: 'ALERTE CRITIQUE', en: 'CRITICAL ALERT' },
    className: 'bg-alert-crisis/30 text-white border-alert-crisis/60 font-bold',
  },
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const chipBase = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono'

export function MetadataChips({ publishedAt, readingTimeMin, alertLevel, locale }: MetadataChipsProps) {
  const dateLabel = formatDate(publishedAt, locale)
  const readLabel = locale === 'fr' ? `${readingTimeMin} min de lecture` : `${readingTimeMin} min read`

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Date */}
      <span className={cn(chipBase, 'border-yield-dark-border text-yield-ink-muted')}>
        {locale === 'fr' ? 'Mis à jour le' : 'Updated'} {dateLabel}
      </span>

      {/* Reading time */}
      <span className={cn(chipBase, 'border-yield-dark-border text-yield-ink-muted')}>
        {readLabel}
      </span>

      {/* Alert level */}
      {alertLevel && alertLevel in alertConfig && (
        <span className={cn(chipBase, alertConfig[alertLevel]!.className)}>
          {alertConfig[alertLevel]!.label[locale === 'fr' ? 'fr' : 'en']}
        </span>
      )}
    </div>
  )
}
