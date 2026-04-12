'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { AlertLevel } from '@/lib/schemas/alert'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { NeonGradientCard } from '@/components/magic-ui/neon-gradient-card'
import { Meteors } from '@/components/aceternity/meteors'
import { ShineBorder } from '@/components/magic-ui/shine-border'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AlertBannerProps {
  level: AlertLevel
  vix: number
  percentile: number
  triggeredAt: string | null
  locale: string
}

const TITLES: Record<string, Record<AlertLevel, string>> = {
  fr: {
    warning: 'Marché sous surveillance',
    alert: 'Marché sous tension',
    crisis: 'Alerte de marché',
  },
  en: {
    warning: 'Market Watch',
    alert: 'Market Under Stress',
    crisis: 'Market Alert',
  },
}

const DISMISS_LABELS: Record<string, string> = {
  fr: 'Fermer',
  en: 'Dismiss',
}

const DETAILS_LABELS: Record<string, string> = {
  fr: 'Voir les détails →',
  en: 'View details →',
}

const DIALOG_TITLES: Record<string, string> = {
  fr: 'Détails de l\'alerte VIX',
  en: 'VIX Alert Details',
}

function formatTriggeredAt(triggeredAt: string | null, locale: string): string {
  if (!triggeredAt) return locale === 'fr' ? 'Inconnue' : 'Unknown'
  try {
    return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(triggeredAt))
  } catch {
    return triggeredAt
  }
}

const SESSION_KEY = 'yf-alert-dismissed'

export function AlertBanner({
  level,
  vix,
  percentile,
  triggeredAt,
  locale,
}: AlertBannerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [dismissed, setDismissed] = useState(false)

  // Read sessionStorage client-side only to avoid hydration mismatch
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setDismissed(true)
    }
  }, [])

  const lang = locale === 'en' ? 'en' : 'fr'
  const title = TITLES[lang]![level]
  const meteorDensity = level === 'crisis' ? 'high' as const : level === 'alert' ? 'medium' as const : 'low' as const

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, 'true')
    setDismissed(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') handleDismiss()
  }

  const motionProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -100, opacity: 0 }, transition: { type: 'spring' as const, bounce: 0.3 } }

  return (
    <AnimatePresence mode="wait">
      {!dismissed && (
      <motion.div
        key="alert-banner"
        role="alert"
        aria-live="assertive"
        onKeyDown={handleKeyDown}
        className="w-full max-w-5xl mx-auto mb-6"
        {...motionProps}
      >
        <ShineBorder color="#DC2626" borderWidth={2} duration={2}>
          <NeonGradientCard variant={level} className="relative">
            <Meteors density={meteorDensity} />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <h2 className="text-lg font-heading font-semibold text-white mb-1">
                  {title}
                </h2>
                <p className="text-sm text-gray-300 font-mono">
                  VIX at p{Math.round(percentile)} (252d window) — {lang === 'fr' ? 'Actuel' : 'Current'}: {vix.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {lang === 'fr' ? 'Depuis' : 'Since'}: {formatTriggeredAt(triggeredAt, lang)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button variant="outline" size="sm" className="text-xs border-white/20 text-white hover:bg-white/10" />
                    }
                  >
                    {DETAILS_LABELS[lang]}
                  </DialogTrigger>
                  <DialogContent className="bg-yield-dark-base border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {DIALOG_TITLES[lang]}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {lang === 'fr'
                          ? 'Indicateur de volatilité du marché basé sur le VIX.'
                          : 'Market volatility indicator based on the VIX.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIX {lang === 'fr' ? 'actuel' : 'current'}</span>
                        <span className="text-white font-mono">{vix.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'fr' ? 'Seuil' : 'Threshold'} p90</span>
                        <span className="text-white font-mono">{percentile.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'fr' ? 'Déclenché' : 'Triggered'}</span>
                        <span className="text-white font-mono">{formatTriggeredAt(triggeredAt, lang)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'fr' ? 'Niveau' : 'Level'}</span>
                        <span className="text-white font-mono capitalize">{level}</span>
                      </div>
                      <div className="mt-4 rounded-lg bg-white/5 p-3">
                        <p className="text-xs text-gray-500">
                          {lang === 'fr'
                            ? 'Historique 7 jours — bientôt disponible'
                            : '7-day history — coming soon'}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  aria-label={DISMISS_LABELS[lang]}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {DISMISS_LABELS[lang]}
                </Button>
              </div>
            </div>
          </NeonGradientCard>
        </ShineBorder>
      </motion.div>
      )}
    </AnimatePresence>
  )
}

export type { AlertBannerProps }
