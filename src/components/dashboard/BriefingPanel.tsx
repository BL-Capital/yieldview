'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect'
import { fadeInUp } from '@/lib/motion-variants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface BriefingPanelProps {
  briefingFr: string
  briefingEn: string
  locale: string
  disclaimer: string
  className?: string
}

function splitParagraphs(text: string, max = 4): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, max)
}

export function BriefingPanel({
  briefingFr,
  briefingEn,
  locale,
  disclaimer,
  className,
}: BriefingPanelProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const text = locale === 'fr' ? briefingFr : briefingEn
  const paragraphs = splitParagraphs(text)
  const [first, ...rest] = paragraphs

  return (
    <div className={cn('max-w-2xl mx-auto text-center space-y-4', className)}>
      {/* First paragraph — TextGenerateEffect */}
      {first && (
        <TextGenerateEffect
          words={first}
          className="text-body-lg text-yield-ink leading-relaxed"
        />
      )}

      {/* Remaining paragraphs — staggered fadeInUp */}
      {rest.map((para, i) => (
        <motion.p
          key={i}
          variants={prefersReducedMotion ? undefined : fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: (i + 1) * 0.15 }}
          className="text-body text-yield-ink-muted leading-relaxed"
        >
          {para}
        </motion.p>
      ))}

      {/* Disclaimer légal */}
      <p className="mt-6 text-xs text-yield-ink-dim italic">{disclaimer}</p>
    </div>
  )
}
