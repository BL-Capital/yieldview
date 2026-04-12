'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { SecondaryKpi } from '@/data/mock-kpis'

interface SecondaryKpisMarqueeProps {
  kpis: SecondaryKpi[]
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

const speedClass: Record<string, string> = {
  slow: 'animate-[marquee_60s_linear_infinite]',
  normal: 'animate-[marquee_40s_linear_infinite]',
  fast: 'animate-[marquee_20s_linear_infinite]',
}

function KpiItem({ kpi }: { kpi: SecondaryKpi }) {
  const isBull = kpi.change >= 0
  const changeColor = isBull ? 'text-bull' : 'text-bear'
  const arrow = isBull ? '▲' : '▼'
  const sign = isBull ? '+' : ''

  return (
    <span className="inline-flex items-center gap-1.5 px-4">
      <span className="font-mono text-xs uppercase tracking-widest text-yield-gold/70">
        {kpi.label}
      </span>
      <span className="font-mono text-sm text-yield-ink">
        {kpi.value.toFixed(kpi.unit === '%' ? 2 : kpi.unit === '$/bbl' ? 1 : 0)}
        {kpi.unit ? ` ${kpi.unit}` : ''}
      </span>
      <span className={cn('font-mono text-xs', changeColor)}>
        {arrow} {sign}{kpi.change.toFixed(2)}%
      </span>
      <span className="text-yield-gold/30">·</span>
    </span>
  )
}

export function SecondaryKpisMarquee({
  kpis,
  className,
  speed = 'normal',
}: SecondaryKpisMarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [paused, setPaused] = useState(false)

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          'w-full overflow-x-auto border-y border-yield-dark-border py-2',
          className,
        )}
      >
        <div className="flex w-max items-center">
          {kpis.map((kpi) => (
            <KpiItem key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </div>
    )
  }

  const doubled = [...kpis, ...kpis]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border-y border-yield-dark-border py-2',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn('flex w-max items-center', speedClass[speed])}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {doubled.map((kpi, i) => (
          <KpiItem key={`${kpi.label}-${i}`} kpi={kpi} />
        ))}
      </div>
    </div>
  )
}
