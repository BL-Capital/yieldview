'use client'

import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type NeonVariant = 'warning' | 'alert' | 'crisis'

interface NeonGradientCardProps {
  variant?: NeonVariant
  className?: string
  children: React.ReactNode
}

const NEON_COLORS: Record<NeonVariant, string> = {
  warning: '#F59E0B',
  alert: '#DC2626',
  crisis: '#991B1B',
}

const GLOW_OPACITY: Record<NeonVariant, string> = {
  warning: '0.4',
  alert: '0.5',
  crisis: '0.6',
}

export function NeonGradientCard({
  variant = 'alert',
  className,
  children,
}: NeonGradientCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const color = NEON_COLORS[variant]
  const opacity = GLOW_OPACITY[variant]

  return (
    <div
      className={cn(
        'relative rounded-xl p-[1px]',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${color}, transparent 60%, ${color})`,
      }}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-1 rounded-xl blur-xl',
          !prefersReducedMotion && 'animate-pulse',
        )}
        style={{
          background: color,
          opacity,
        }}
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="relative rounded-xl bg-yield-dark-base p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}

export type { NeonVariant, NeonGradientCardProps }
