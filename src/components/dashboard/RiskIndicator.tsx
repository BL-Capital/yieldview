import { cn } from '@/lib/utils'

type AlertLevel = 'low' | 'warning' | 'alert' | 'crisis' | null

interface RiskIndicatorProps {
  alertLevel: AlertLevel
  locale?: string
}

const configs: Record<string, {
  color: string
  ringCount: 1 | 2 | 3
  animClass: string
  glow: string
  pulseMin: string
  pulseMax: string
}> = {
  low: {
    color: '#C9A84C',
    ringCount: 1,
    animClass: 'animate-[pulse-ring_3s_ease-in-out_infinite]',
    glow: '',
    pulseMin: '0.3',
    pulseMax: '0.6',
  },
  warning: {
    color: '#F59E0B',
    ringCount: 2,
    animClass: 'animate-[pulse-ring_2s_ease-in-out_infinite]',
    glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    pulseMin: '0.5',
    pulseMax: '0.8',
  },
  alert: {
    color: '#DC2626',
    ringCount: 3,
    animClass: 'animate-[pulse-ring_1.2s_ease-in-out_infinite]',
    glow: 'drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]',
    pulseMin: '0.6',
    pulseMax: '1.0',
  },
  crisis: {
    color: '#991B1B',
    ringCount: 3,
    animClass: 'animate-[pulse-ring_0.8s_ease-in-out_infinite]',
    glow: 'drop-shadow-[0_0_30px_rgba(153,27,27,0.8)]',
    pulseMin: '0.8',
    pulseMax: '1.0',
  },
}

const levelLabels: Record<string, { fr: string; en: string }> = {
  low: { fr: 'calme', en: 'calm' },
  warning: { fr: 'vigilance', en: 'watch' },
  alert: { fr: 'alerte', en: 'alert' },
  crisis: { fr: 'crise', en: 'crisis' },
}

export function RiskIndicator({ alertLevel, locale = 'fr' }: RiskIndicatorProps) {
  const level = alertLevel ?? 'low'
  const cfg = configs[level] ?? configs.low!
  const levelLabel = levelLabels[level]?.[locale === 'fr' ? 'fr' : 'en'] ?? level
  const ariaLabel =
    locale === 'fr'
      ? `Indicateur de risque marché : ${levelLabel}`
      : `Market risk indicator: ${levelLabel}`

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 120, height: 120 }}
      aria-label={ariaLabel}
      role="img"
    >
      {/* Concentric rings */}
      {Array.from({ length: cfg.ringCount }, (_, i) => {
        const size = 40 + i * 28
        const delayMs = i * 200
        return (
          <div
            key={i}
            aria-hidden="true"
            className={cn(
              'absolute rounded-full border-2',
              cfg.animClass,
              cfg.glow,
              'motion-safe:' + cfg.animClass,
            )}
            style={{
              width: size,
              height: size,
              borderColor: cfg.color,
              animationDelay: `${delayMs}ms`,
              ['--pulse-min' as string]: cfg.pulseMin,
              ['--pulse-max' as string]: cfg.pulseMax,
            }}
          />
        )
      })}

      {/* Center dot */}
      <div
        aria-hidden="true"
        className="absolute h-3 w-3 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
    </div>
  )
}
