'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export type RiskLevel = 'low' | 'medium' | 'high' | 'crisis'

interface HeroAvatarProps {
  riskLevel: RiskLevel
  className?: string
}

const SVG_MAP: Record<RiskLevel, string> = {
  low:    '/rive/low.svg',
  medium: '/rive/medium.svg',
  high:   '/rive/high.svg',
  crisis: '/rive/crisis.svg',
}

const ARIA_LABELS: Record<RiskLevel, { fr: string; en: string }> = {
  low:    { fr: 'Indicateur avatar risque marché : faible',  en: 'Market risk avatar indicator: low' },
  medium: { fr: 'Indicateur avatar risque marché : modéré',  en: 'Market risk avatar indicator: medium' },
  high:   { fr: 'Indicateur avatar risque marché : élevé',   en: 'Market risk avatar indicator: high' },
  crisis: { fr: 'Indicateur avatar risque marché : crise',   en: 'Market risk avatar indicator: crisis' },
}

export function HeroAvatar({ riskLevel, className }: HeroAvatarProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const src = SVG_MAP[riskLevel]
  const ariaLabel = ARIA_LABELS[riskLevel].fr

  const avatarContent = (
    <Image
      src={src}
      alt={ariaLabel}
      width={120}
      height={120}
      priority
    />
  )

  if (prefersReducedMotion) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ width: 120, height: 120 }}
        aria-label={ariaLabel}
        role="img"
      >
        {avatarContent}
      </div>
    )
  }

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: 120, height: 120 }}
      aria-label={ariaLabel}
      role="img"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={riskLevel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {avatarContent}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default HeroAvatar
