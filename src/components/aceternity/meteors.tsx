'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type MeteorDensity = 'low' | 'medium' | 'high'

interface MeteorsProps {
  density?: MeteorDensity
  className?: string
}

const DENSITY_MAP: Record<MeteorDensity, number> = {
  low: 8,
  medium: 15,
  high: 25,
}

// Deterministic seed-based PRNG to avoid SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface MeteorStyle {
  left: string
  delay: string
  duration: string
}

function generateMeteorStyles(count: number): MeteorStyle[] {
  return Array.from({ length: count }, (_, i) => ({
    left: `${seededRandom(i * 3 + 1) * 100}%`,
    delay: `${seededRandom(i * 3 + 2) * 3}s`,
    duration: `${1.5 + seededRandom(i * 3 + 3) * 2}s`,
  }))
}

export function Meteors({ density = 'medium', className }: MeteorsProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const count = DENSITY_MAP[density]
  const styles = useMemo(() => generateMeteorStyles(count), [count])

  if (prefersReducedMotion) return null

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden rounded-xl', className)} aria-hidden="true">
      {styles.map((style, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-current shadow-[0_0_0_1px_#ffffff10] animate-meteor"
          style={{
            top: '-5%',
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        >
          <span
            className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2"
            style={{
              background: 'linear-gradient(to right, currentColor, transparent)',
            }}
          />
        </span>
      ))}

      <style>{`
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation-name: meteor;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

export type { MeteorDensity, MeteorsProps }
