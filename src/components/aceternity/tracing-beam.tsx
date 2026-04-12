'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

interface TracingBeamProps {
  children: React.ReactNode
  className?: string
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // All hooks called unconditionally
  const contentHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', 'calc(100% - 6px)'])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative mx-auto max-w-4xl', className)}>
        <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-700" />
        <div className="pl-16">{children}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn('relative mx-auto max-w-4xl', className)}>
      {/* Background track line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800" />

      {/* Animated beam */}
      <div className="absolute left-8 top-0 bottom-0 w-px overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            height: contentHeight,
            background: 'linear-gradient(to bottom, transparent, #C9A84C, #F59E0B)',
            boxShadow: '0 0 8px 2px rgba(201,168,76,0.4)',
          }}
        />
      </div>

      {/* Dot at current beam position */}
      <motion.div
        className="absolute left-8 -translate-x-1/2 z-10"
        style={{ top: dotTop }}
      >
        <div className="h-3 w-3 rounded-full border-2 border-yield-gold bg-yield-dark-base shadow-[0_0_6px_rgba(201,168,76,0.8)]" />
      </motion.div>

      <div className="pl-16">{children}</div>
    </div>
  )
}

export default TracingBeam
