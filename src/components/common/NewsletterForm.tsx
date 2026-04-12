'use client'

import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ShineBorder } from '@/components/magic-ui/shine-border'
import { LottieIcon } from '@/components/lottie/LottieIcon'

interface NewsletterFormProps {
  locale: string
  className?: string
}

const emailSchema = z.string().trim().toLowerCase().email()

const TEXTS = {
  fr: {
    label: 'Votre email',
    placeholder: 'votre@email.com',
    cta: "S'abonner",
    submitting: 'Envoi...',
    successToast: 'Merci ! Vérifiez votre email pour confirmer.',
    alreadyToast: 'Vous êtes déjà inscrit !',
    rateLimitToast: 'Trop de tentatives, réessayez dans 1 minute.',
    serverErrorToast: 'Erreur serveur, réessayez plus tard.',
    invalidEmail: 'Adresse email invalide.',
    successMessage: 'Email envoyé !',
  },
  en: {
    label: 'Your email',
    placeholder: 'your@email.com',
    cta: 'Subscribe',
    submitting: 'Sending...',
    successToast: 'Thanks! Check your email to confirm.',
    alreadyToast: "You're already subscribed!",
    rateLimitToast: 'Too many attempts, try again in 1 minute.',
    serverErrorToast: 'Server error, try again later.',
    invalidEmail: 'Invalid email address.',
    successMessage: 'Email sent!',
  },
} as const

export function NewsletterForm({ locale, className }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const lang = locale === 'en' ? 'en' : 'fr'
  const t = TEXTS[lang]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return // Guard against double submission
    setError(null)

    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      setError(t.invalidEmail)
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data }),
      })

      if (res.status === 201) {
        toast.success(t.successToast)
        setSuccess(true)
        return
      }

      if (res.status === 409) {
        toast.info(t.alreadyToast)
        return
      }

      if (res.status === 429) {
        toast.warning(t.rateLimitToast)
        return
      }

      toast.error(t.serverErrorToast)
    } catch {
      toast.error(t.serverErrorToast)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className={cn('flex flex-col items-center gap-2 py-4', className)}>
        <LottieIcon src="/lottie/email-sent.lottie" size={48} loop={false} />
        <p className="text-sm text-yield-gold">{t.successMessage}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col sm:flex-row items-start gap-3 max-w-md', className)}
      noValidate
    >
      <div className="flex-1 w-full">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.label}
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          onBlur={() => {
            if (email && !emailSchema.safeParse(email).success) {
              setError(t.invalidEmail)
            }
          }}
          placeholder={t.placeholder}
          aria-describedby={error ? 'newsletter-error' : undefined}
          aria-invalid={!!error}
          className="h-9 w-full rounded-md border border-border bg-yield-dark px-3 text-sm text-yield-ink placeholder:text-yield-ink/40 focus:outline-none focus:ring-1 focus:ring-yield-gold/50"
        />
        {error && (
          <p id="newsletter-error" className="mt-1 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      <ShineBorder color="#C9A84C" borderWidth={1} duration={3}>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'h-9 px-4 rounded-md bg-yield-gold/20 text-yield-gold text-sm font-medium',
            'transition-colors hover:bg-yield-gold/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {submitting ? t.submitting : t.cta}
        </button>
      </ShineBorder>
    </form>
  )
}
