# Story 5.6 : Business `<NewsletterForm>` avec shadcn Form

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur de YieldField,
**I want** un formulaire d'inscription newsletter discret en footer,
**so that** je peux recevoir le briefing quotidien par email sans popup intrusif ni scroll blocker.

**Business value :** Capture newsletter "soft" — jamais en popup, jamais en blocker. Le formulaire apparaît naturellement en footer et comme CTA secondaire après le briefing.

---

## Acceptance Criteria

**AC1 -- Composant NewsletterForm créé**
- [ ] `src/components/common/NewsletterForm.tsx` créé
- [ ] Directive `'use client'`
- [ ] shadcn `Form` + `Input` + `Label` + `Button`
- [ ] ShineBorder (Magic UI) sur le bouton submit

**AC2 -- Validation client**
- [ ] Zod schema côté client : `z.string().email()`
- [ ] Message d'erreur bilingue FR/EN
- [ ] Validation en temps réel (onBlur)

**AC3 -- Soumission vers API**
- [ ] POST vers `/api/newsletter/subscribe` avec `{ email }`
- [ ] Loading state sur le bouton (spinner ou disabled)
- [ ] Gestion erreurs : 400 (email invalide), 409 (déjà inscrit), 429 (rate limit), 502 (erreur serveur)

**AC4 -- Feedback utilisateur**
- [ ] Succès : Toast Sonner "Merci ! Vérifiez votre email pour confirmer" / "Thanks! Check your email to confirm"
- [ ] Erreur 409 : Toast "Vous êtes déjà inscrit !" / "You're already subscribed!"
- [ ] Erreur 429 : Toast "Trop de tentatives, réessayez dans 1 minute" / "Too many attempts, try again in 1 minute"
- [ ] Erreur serveur : Toast "Erreur serveur, réessayez plus tard" / "Server error, try again later"

**AC5 -- LottieIcon success**
- [ ] Animation Lottie `email-sent.lottie` affichée en success state (remplace le formulaire temporairement)
- [ ] Fichier `public/lottie/email-sent.lottie` ajouté (< 30KB)
- [ ] Respect `prefers-reduced-motion` (frame 0 figée)

**AC6 -- Intégration Footer**
- [ ] `src/components/common/Footer.tsx` modifié pour inclure `<NewsletterForm>`
- [ ] Placement discret, sous le disclaimer

**AC7 -- Accessibilité**
- [ ] `<label>` associé à l'input email
- [ ] `aria-describedby` pour les messages d'erreur
- [ ] Focus visible sur input et button
- [ ] Enter key soumet le formulaire

**AC8 -- Bilingue**
- [ ] Tous les textes (label, placeholder, button, toasts) en FR et EN
- [ ] Utilise `locale` prop ou `useTranslations`

**AC9 -- Tests**
- [ ] Test : rendu du formulaire avec input et button
- [ ] Test : soumission avec email valide → toast succès
- [ ] Test : soumission avec email invalide → message erreur inline
- [ ] Test : gestion 409, 429, 502 → toasts appropriés
- [ ] Test : LottieIcon affiché en success state
- [ ] Tests dans `src/components/common/__tests__/`

**AC10 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/common/
  NewsletterForm.tsx (new)
  __tests__/NewsletterForm.test.tsx (new)
  Footer.tsx (modified)
public/lottie/
  email-sent.lottie (new)
```

### shadcn Form pattern
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
```

Note : Vérifier si `react-hook-form` et `@hookform/resolvers` sont déjà installés. Si non, `pnpm add react-hook-form @hookform/resolvers`.

### Dépendances
- Story 5.5 : endpoint `/api/newsletter/subscribe`
- shadcn Form, Input, Label, Button (ui/)
- ShineBorder (magic-ui/)
- LottieIcon (lottie/)
- Sonner (ui/sonner.tsx, déjà installé)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
