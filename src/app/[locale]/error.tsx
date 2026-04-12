'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Button, buttonVariants } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary page. Uses hardcoded strings instead of useTranslations
 * because if the i18n provider itself threw, useTranslations would re-throw
 * and create an infinite error loop.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [locale, setLocale] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    // Detect locale from URL path without depending on next-intl
    const path = window.location.pathname
    setLocale(path.startsWith('/en') ? 'en' : 'fr')
  }, [])

  useEffect(() => {
    console.error('[YieldField] Unhandled error:', error)
  }, [error])

  const text = locale === 'fr'
    ? {
        title: 'Quelque chose s\u2019est mal passé',
        subtitle: 'Une erreur inattendue est survenue. Notre équipe est sur le coup.',
        retry: 'Réessayer',
        cta: 'Retour à l\u2019accueil',
      }
    : {
        title: 'Something went wrong',
        subtitle: 'An unexpected error occurred. Our team is on it.',
        retry: 'Try again',
        cta: 'Back to home',
      }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 bg-yield-dark-base">
      <div className="relative z-10 text-center max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
          {text.title}
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          {text.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} variant="default">
            {text.retry}
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: 'outline' })}
          >
            {text.cta}
          </Link>
        </div>
      </div>
    </div>
  )
}
