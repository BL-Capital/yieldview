import { cn } from '@/lib/utils'

type FreshnessLevel = 'fresh' | 'aging' | 'stale'

interface FreshnessIndicatorProps {
  publishedAt: string
  freshnessLevel: FreshnessLevel
  locale: string
}

const levelColors: Record<FreshnessLevel, string> = {
  fresh: 'text-bull',
  aging: 'text-yield-gold',
  stale: 'text-bear',
}

const dotColors: Record<FreshnessLevel, string> = {
  fresh: 'bg-bull',
  aging: 'bg-yield-gold',
  stale: 'bg-bear',
}

function getMinutesAgo(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 60_000)
}

function formatAgo(minutes: number, locale: string): string {
  if (locale === 'fr') {
    if (minutes < 60) return `il y a ${minutes} min`
    const h = Math.floor(minutes / 60)
    return `il y a ${h}h`
  }
  if (minutes < 60) return `${minutes} min ago`
  const h = Math.floor(minutes / 60)
  return `${h}h ago`
}

export function FreshnessIndicator({ publishedAt, freshnessLevel, locale }: FreshnessIndicatorProps) {
  const minutes = getMinutesAgo(publishedAt)
  const agoLabel = formatAgo(minutes, locale)
  const colorClass = levelColors[freshnessLevel]
  const dotColor = dotColors[freshnessLevel]

  return (
    <div className={cn('flex items-center gap-2 text-xs font-mono', colorClass)}>
      {/* Pulsating dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            dotColor,
            'animate-pulse',
          )}
          aria-hidden="true"
        />
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotColor)} />
      </span>

      <span>Live · {locale === 'fr' ? 'Mis à jour' : 'Updated'} {agoLabel}</span>
    </div>
  )
}
