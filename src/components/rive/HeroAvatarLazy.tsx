'use client'

import dynamic from 'next/dynamic'
import type { RiskLevel } from './HeroAvatar'

const HeroAvatar = dynamic(
  () => import('./HeroAvatar').then((mod) => ({ default: mod.HeroAvatar })),
  {
    ssr: false,
    loading: () => (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800 animate-pulse" />
    ),
  }
)

interface HeroAvatarLazyProps {
  riskLevel: RiskLevel
  className?: string
}

export function HeroAvatarLazy({ riskLevel, className }: HeroAvatarLazyProps) {
  return <HeroAvatar riskLevel={riskLevel} className={className} />
}
