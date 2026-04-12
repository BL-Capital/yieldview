'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CodeBlock } from '@/components/aceternity/code-block'
import { cn } from '@/lib/utils'

interface PromptVersion {
  label: string
  code: string
  notes?: string
}

interface PromptCodeBlockProps {
  versions: PromptVersion[]
  language?: string
  title?: string
  className?: string
}

export function PromptCodeBlock({
  versions,
  language = 'markdown',
  title,
  className,
}: PromptCodeBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!versions.length) return null

  // Clamp index to valid range if versions shrinks
  const safeIndex = Math.min(activeIndex, versions.length - 1)
  const active = versions[safeIndex]!

  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <p className="text-sm font-mono text-yield-gold/70 uppercase tracking-widest">{title}</p>
      )}

      {/* Version pills */}
      <div className="flex flex-wrap gap-2">
        {versions.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-mono border transition-all duration-200',
              i === safeIndex
                ? 'border-yield-gold bg-yield-gold/10 text-yield-gold shadow-[0_0_8px_rgba(201,168,76,0.3)]'
                : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300',
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Code block with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={safeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <CodeBlock code={active.code} language={language} filename={active.label} />
        </motion.div>
      </AnimatePresence>

      {/* Version notes */}
      {active.notes && (
        <p className="text-xs italic text-zinc-500 pl-1">{active.notes}</p>
      )}
    </div>
  )
}

export default PromptCodeBlock
