'use client'

import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  children?: React.ReactNode
  className?: string
  alertLevel?: 'low' | 'warning' | 'alert' | 'crisis' | null
}

const alertGradients: Record<string, string> = {
  low: 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.08),rgba(10,22,40,0))]',
  warning: 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.12),rgba(10,22,40,0))]',
  alert: 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.10),rgba(10,22,40,0))]',
  crisis: 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(153,27,27,0.15),rgba(26,5,5,0))]',
}

export function AuroraBackground({
  children,
  className,
  alertLevel = 'low',
}: AuroraBackgroundProps) {
  const level = alertLevel ?? 'low'
  const gradient = alertGradients[level] ?? alertGradients.low

  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-yield-dark overflow-hidden',
        className,
      )}
    >
      {/* Aurora layers — decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Base aurora gradient */}
        <div
          className={cn(
            'absolute inset-0 animate-aurora-pulse',
            gradient,
          )}
        />
        {/* Animated aurora blobs */}
        <div
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-20 blur-[100px] animate-aurora-blob-1"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }}
        />
        <div
          className="absolute -top-20 right-0 h-[500px] w-[500px] rounded-full opacity-10 blur-[120px] animate-aurora-blob-2"
          style={{ background: 'radial-gradient(circle, #0f2040 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-15 blur-[80px] animate-aurora-blob-3"
          style={{ background: 'radial-gradient(circle, #1a3a6b 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
