'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface NumberTickerProps {
  value: number
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function NumberTicker({
  value,
  decimalPlaces = 2,
  prefix = '',
  suffix = '',
  className,
  duration = 1500,
}: NumberTickerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? value : 0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.disconnect()

          const startValue = 0
          const endValue = value

          const animate = (timestamp: number) => {
            if (!startRef.current) startRef.current = timestamp
            const elapsed = timestamp - startRef.current
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeOutCubic(progress)

            setDisplayed(startValue + (endValue - startValue) * eased)

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(animate)
            }
          }

          rafRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0.2 },
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration, prefersReducedMotion])

  const formatted = displayed.toFixed(decimalPlaces)

  return (
    <span ref={containerRef} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
