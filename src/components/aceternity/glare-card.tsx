'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface GlareCardProps {
  children: React.ReactNode
  className?: string
}

export function GlareCard({ children, className }: GlareCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setGlare({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Glare overlay */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(200px circle at ${glare.x}px ${glare.y}px, rgba(201, 168, 76, 0.15), transparent)`,
          }}
        />
      )}
      {children}
    </div>
  )
}
