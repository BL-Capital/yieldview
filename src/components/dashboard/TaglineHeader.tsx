'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { AnimatedGradientText } from '@/components/magic-ui/animated-gradient-text'
import { fadeInUp } from '@/lib/motion-variants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function TaglineHeader() {
  const t = useTranslations('Hero')
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-display-1 font-serif leading-tight">
        <AnimatedGradientText>{t('tagline')}</AnimatedGradientText>
      </h1>
    </motion.div>
  )
}
