import { cn } from '@/lib/utils'
import type { Kpi } from '@/lib/schemas/kpi'
import { BentoGridItem } from '@/components/aceternity/bento-grid-item'
import { GlareCard } from '@/components/aceternity/glare-card'
import { NumberTicker } from '@/components/magic-ui/number-ticker'

interface KpiCardProps {
  kpi: Kpi
  locale?: string
  className?: string
  colSpan?: 1 | 2 | 3
  isAlert?: boolean
}

function formatValue(value: number, unit: string): { value: number; decimalPlaces: number; prefix: string; suffix: string } {
  if (unit === '%') return { value, decimalPlaces: 2, prefix: '', suffix: '%' }
  if (unit === 'pts') return { value, decimalPlaces: 0, prefix: '', suffix: ' pts' }
  if (unit === '$/oz') return { value, decimalPlaces: 2, prefix: '$', suffix: '/oz' }
  if (unit === '$/bbl') return { value, decimalPlaces: 2, prefix: '$', suffix: '/bbl' }
  if (unit === '$/BTC') {
    const inK = value / 1000
    return { value: inK, decimalPlaces: 1, prefix: '$', suffix: 'k' }
  }
  return { value, decimalPlaces: 2, prefix: '', suffix: unit ? ` ${unit}` : '' }
}

const colSpanClass: Record<number, string> = {
  1: '',
  2: 'sm:col-span-2',
  3: 'sm:col-span-2 lg:col-span-3',
}

export function KpiCard({ kpi, locale = 'fr', className, colSpan = 1, isAlert = false }: KpiCardProps) {
  const label = locale === 'en' ? kpi.label.en : kpi.label.fr
  const { value, decimalPlaces, prefix, suffix } = formatValue(kpi.value, kpi.unit)

  const isBull = kpi.direction === 'up'
  const isBear = kpi.direction === 'down'

  const changeSign = kpi.change_pct >= 0 ? '+' : ''
  const changeColor = isBull
    ? 'bg-bull/20 text-bull border-bull/40'
    : isBear
      ? 'bg-bear/20 text-bear border-bear/40'
      : 'bg-yield-ink-muted/10 text-yield-ink-muted border-yield-ink-muted/30'

  const ariaLabel = `${label} : ${kpi.value} ${kpi.unit}, variation ${changeSign}${kpi.change_pct.toFixed(2)}%`

  return (
    <GlareCard className={cn(colSpanClass[colSpan] ?? '', className)}>
      <BentoGridItem
        className={cn(
          'h-full',
          isAlert && 'bg-yield-dark-elevated/70 border-yield-gold/40',
        )}
        aria-label={ariaLabel}
      >
        {/* Label */}
        <p className="mb-2 text-xs font-mono uppercase tracking-widest text-yield-gold/70">
          {label}
        </p>

        {/* Value */}
        <div className={cn('font-mono font-bold', isAlert ? 'text-number-xl' : 'text-number-lg')}>
          <NumberTicker
            value={value}
            decimalPlaces={decimalPlaces}
            prefix={prefix}
            suffix={suffix}
          />
        </div>

        {/* Change badge */}
        <span
          className={cn(
            'mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono',
            changeColor,
          )}
        >
          {isBull ? '▲' : isBear ? '▼' : '—'} {changeSign}{kpi.change_pct.toFixed(2)}%
        </span>
      </BentoGridItem>
    </GlareCard>
  )
}

export default KpiCard
