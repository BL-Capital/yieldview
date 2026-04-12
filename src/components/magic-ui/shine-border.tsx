'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ShineBorderProps {
  children: React.ReactNode
  color?: string | string[]
  borderWidth?: number
  duration?: number
  className?: string
}

export function ShineBorder({
  children,
  color = '#C9A84C',
  borderWidth = 2,
  duration = 3,
  className,
}: ShineBorderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const colorStr = Array.isArray(color) ? color.join(', ') : color

  if (prefersReducedMotion) {
    return (
      <div
        className={cn('relative rounded-lg', className)}
        style={{ border: `${borderWidth}px solid ${Array.isArray(color) ? color[0] : color}` }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-lg overflow-hidden', className)}
      style={
        {
          '--shine-color': colorStr,
          '--shine-duration': `${duration}s`,
          '--border-width': `${borderWidth}px`,
          padding: `${borderWidth}px`,
          background: `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, ${colorStr} 10%, transparent 20%)`,
          animation: `shine-rotate ${duration}s linear infinite`,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes shine-rotate {
          from { --shine-angle: 0deg; }
          to { --shine-angle: 360deg; }
        }
        @property --shine-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
      `}</style>
      <div className="relative rounded-[calc(0.5rem-2px)] bg-yield-dark-base">
        {children}
      </div>
    </div>
  )
}

export default ShineBorder
