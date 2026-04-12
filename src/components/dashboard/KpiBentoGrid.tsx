'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Kpi } from '@/lib/schemas/kpi'
import { BentoGrid } from '@/components/aceternity/bento-grid'
import { KpiCard } from './KpiCard'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

interface KpiBentoGridProps {
  kpis: Kpi[]
  locale?: string
  className?: string
}

// Layout config: which KPI gets which colSpan
const COL_SPANS: Record<string, 1 | 2 | 3> = {
  cac40: 2,
  spx: 1,
  eurusd: 1,
  gold: 1,
  btc: 1,
  vix: 3,
}

const ALERT_IDS = ['vix']

export function KpiBentoGrid({ kpis, locale = 'fr', className }: KpiBentoGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn('w-full', className)}
    >
      <BentoGrid>
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.id}
            variants={prefersReducedMotion ? undefined : fadeInUp}
            className={cn(
              COL_SPANS[kpi.id] === 3
                ? 'col-span-1 sm:col-span-2 lg:col-span-3'
                : COL_SPANS[kpi.id] === 2
                  ? 'col-span-1 sm:col-span-2'
                  : 'col-span-1',
            )}
          >
            <KpiCard
              kpi={kpi}
              locale={locale}
              isAlert={ALERT_IDS.includes(kpi.id)}
              colSpan={COL_SPANS[kpi.id] ?? 1}
            />
          </motion.div>
        ))}
      </BentoGrid>
    </motion.div>
  )
}
