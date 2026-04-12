'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface TextGenerateEffectProps {
  words: string
  className?: string
  duration?: number
  wordDelay?: number
}

export function TextGenerateEffect({
  words,
  className,
  duration = 0.5,
  wordDelay = 0.05,
}: TextGenerateEffectProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLParagraphElement>(null)
  const wordList = words.split(' ')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (prefersReducedMotion) {
    return <p ref={containerRef} className={cn('font-serif', className)}>{words}</p>
  }

  return (
    <p ref={containerRef} className={cn('font-serif', className)}>
      {wordList.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={isVisible ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration, delay: i * wordDelay, ease: 'easeOut' }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
