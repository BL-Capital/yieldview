'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    // Beam definitions
    const beams = Array.from({ length: 6 }, (_, i) => ({
      x: (width / 7) * (i + 1),
      angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.3,
      width: 1 + Math.random() * 1.5,
      alpha: 0.03 + Math.random() * 0.04,
      speed: 0.0002 + Math.random() * 0.0003,
      phase: Math.random() * Math.PI * 2,
    }))

    let start: number | null = null

    const draw = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start

      ctx.clearRect(0, 0, width, height)

      for (const beam of beams) {
        const sway = Math.sin(elapsed * beam.speed + beam.phase) * 40
        const x = beam.x + sway

        const gradient = ctx.createLinearGradient(x, 0, x, height)
        gradient.addColorStop(0, `rgba(201, 168, 76, ${beam.alpha * 2})`)
        gradient.addColorStop(0.4, `rgba(201, 168, 76, ${beam.alpha})`)
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)')

        ctx.save()
        ctx.globalAlpha = 0.4
        ctx.strokeStyle = gradient
        ctx.lineWidth = beam.width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x + Math.sin(beam.angle) * height, height)
        ctx.stroke()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full opacity-40', className)}
    />
  )
}
