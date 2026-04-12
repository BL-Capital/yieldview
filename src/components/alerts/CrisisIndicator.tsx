'use client'

import type { AlertLevel } from '@/lib/schemas/alert'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ShineBorder } from '@/components/magic-ui/shine-border'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface CrisisIndicatorProps {
  level: AlertLevel
  vix: number
  percentile: number
  locale: string
  children: React.ReactNode
}

const ALERT_COLORS: Record<AlertLevel, string> = {
  warning: '#F59E0B',
  alert: '#DC2626',
  crisis: '#991B1B',
}

const TOOLTIP_TEXT: Record<string, string> = {
  fr: 'VIX au p{percentile} sur 252 jours de trading',
  en: 'VIX at p{percentile} over 252 trading days',
}

export function CrisisIndicator({
  level,
  vix,
  percentile,
  locale,
  children,
}: CrisisIndicatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const color = ALERT_COLORS[level]
  const lang = locale === 'en' ? 'en' : 'fr'
  const tooltipText = TOOLTIP_TEXT[lang]!.replace('{percentile}', Math.round(percentile).toString())

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative">
            <ShineBorder
              color={color}
              borderWidth={2}
              duration={prefersReducedMotion ? 0 : 2}
            >
              {children}
            </ShineBorder>

            {/* Pulsating dot */}
            <span
              className={cn(
                'absolute -top-1 -right-1 z-10 h-3 w-3 rounded-full',
                !prefersReducedMotion && 'animate-pulse',
              )}
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-yield-dark-base text-yield-ink border-white/10">
          <p className="text-xs font-mono">{tooltipText}</p>
          <p className="text-xs text-gray-400 mt-0.5">VIX: {vix.toFixed(1)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
