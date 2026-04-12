'use client'

import { useEffect, useRef, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { cn } from '@/lib/utils'

interface LottieIconProps {
  src: string
  size?: number
  loop?: boolean
  autoplay?: boolean
  className?: string
}

// Static SVG arrow fallback shapes by src filename pattern
function FallbackArrow({ src, size }: { src: string; size: number }) {
  const isUp = src.includes('arrow-up')
  const isDown = src.includes('arrow-down')
  const isSpike = src.includes('trend-spike')
  const isPulse = src.includes('loading-pulse')

  if (isUp || isSpike) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 5L19 14H5L12 5Z" fill={isSpike ? '#F59E0B' : '#22C55E'} />
      </svg>
    )
  }
  if (isDown) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 19L5 10H19L12 19Z" fill="#EF4444" />
      </svg>
    )
  }
  if (isPulse) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="#C9A84C" />
      </svg>
    )
  }
  // neutral
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="2" fill="#6B7280" />
    </svg>
  )
}

export function LottieIcon({
  src,
  size = 24,
  loop = true,
  autoplay = true,
  className,
}: LottieIconProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [hasError, setHasError] = useState(false)
  const checkedRef = useRef(false)

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const shouldAnimate = autoplay && !prefersReducedMotion
  const shouldLoop = loop && !prefersReducedMotion

  if (hasError || prefersReducedMotion) {
    return (
      <span
        aria-hidden="true"
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
      >
        <FallbackArrow src={src} size={size} />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <DotLottieReact
        src={src}
        autoplay={shouldAnimate}
        loop={shouldLoop}
        style={{ width: size, height: size }}
        onError={() => setHasError(true)}
      />
    </span>
  )
}

export default LottieIcon
