'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface BackgroundBoxesProps {
  className?: string
  variant?: 'default' | 'dark'
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

export function BackgroundBoxes({ className, variant = 'default' }: BackgroundBoxesProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const rows = 6
  const cols = 8
  const total = rows * cols
  const colors = variant === 'dark'
    ? ['#1e3a5f', '#0f1e38', '#1e3a5f', '#0a1628']
    : ['#1e3a5f', '#c9a84c20', '#1e3a5f', '#c9a84c10']

  const timings = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        duration: 4 + seededRandom(i) * 4,
        delay: seededRandom(i + total) * 2,
      })),
    [total]
  )

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden opacity-30 pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const color = colors[i % colors.length]
          if (prefersReducedMotion) {
            return (
              <div
                key={i}
                className="border border-yield-dark-border/20"
                style={{ backgroundColor: color }}
              />
            )
          }
          return (
            <motion.div
              key={i}
              className="border border-yield-dark-border/20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundColor: color,
              }}
              transition={{
                duration: timings[i].duration,
                repeat: Infinity,
                delay: timings[i].delay,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
