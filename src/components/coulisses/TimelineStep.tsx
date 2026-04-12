'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface TimelineStepProps {
  step: number
  title: string
  date?: string
  description: string
  media?: React.ReactNode
  children?: React.ReactNode
  isLast?: boolean
  className?: string
}

export function TimelineStep({
  step,
  title,
  date,
  description,
  media,
  children,
  isLast = false,
  className,
}: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: Math.min(step * 0.08, 0.4) }}
      className={cn('relative flex gap-6 pb-12', isLast && 'pb-0', className)}
    >
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center">
        {/* Numbered dot */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-yield-gold bg-yield-dark-base shadow-[0_0_12px_rgba(201,168,76,0.3)] z-10">
          <span className="text-sm font-mono font-bold text-yield-gold">{step}</span>
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="mt-2 flex-1 w-px bg-gradient-to-b from-yield-gold/40 to-zinc-700/30 min-h-8" />
        )}
      </div>

      {/* Right column: content */}
      <div className="flex-1 min-w-0 pb-2">
        {/* Header */}
        <div className="flex flex-wrap items-baseline gap-3 mb-3">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          {date && (
            <span className="text-xs font-mono text-yield-gold/60 border border-yield-gold/20 rounded px-2 py-0.5">
              {date}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{description}</p>

        {/* Optional media slot */}
        {media && <div className="mb-4">{media}</div>}

        {/* Children slot (CodeBlock, Table, etc.) */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  )
}

export default TimelineStep
