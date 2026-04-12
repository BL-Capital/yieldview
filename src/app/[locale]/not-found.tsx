'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { BackgroundBoxes } from '@/components/aceternity/background-boxes'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export default function NotFound() {
  const t = useTranslations('Errors')
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4">
      <BackgroundBoxes />

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Lottie 404 illustration */}
        <div className="w-48 h-48 mx-auto mb-8" aria-hidden="true">
          <DotLottieReact
            src="/lottie/404-lost.lottie"
            loop={!prefersReducedMotion}
            autoplay={!prefersReducedMotion}
            className="w-full h-full"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
          {t('notFound.title')}
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          {t('notFound.subtitle')}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/80 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t('notFound.cta')}
        </Link>
      </div>
    </div>
  )
}
