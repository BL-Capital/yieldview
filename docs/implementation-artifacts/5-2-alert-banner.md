# Story 5.2 : Business `<AlertBanner>`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur de YieldField,
**I want** voir une bannière d'alerte dramatique quand le VIX dépasse le percentile 90,
**so that** je suis immédiatement informé d'une tension de marché inhabituelle, comme un bulletin d'information qui interrompt une émission.

**Business value :** Moment signature #6 UX — le mode crisis différencie YieldField de tout autre site finance. C'est un changement d'ambiance complet, pas une simple modal d'avertissement.

---

## Acceptance Criteria

**AC1 -- Composant AlertBanner créé**
- [ ] `src/components/alerts/AlertBanner.tsx` créé
- [ ] Directive `'use client'`
- [ ] Props : `level: AlertLevel`, `vix: number`, `percentile: number`, `triggeredAt: string | null`, `locale: string`
- [ ] Composition : `NeonGradientCard` (variant=level) + `Meteors` (density selon level) + `ShineBorder` (rouge)

**AC2 -- Animation d'entrée Motion 12**
- [ ] Slide from top : `initial={{ y: -100, opacity: 0 }}`
- [ ] Spring bounce : `animate={{ y: 0, opacity: 1 }}` avec `transition={{ type: 'spring', bounce: 0.3 }}`
- [ ] Import depuis `motion/react` (PAS `framer-motion`)
- [ ] Respect `prefers-reduced-motion` : fade simple sans slide/bounce

**AC3 -- Contenu AlertBanner**
- [ ] Titre bilingue : FR "Marché sous tension" / EN "Market Under Stress"
- [ ] Sous-titre : `VIX at p{percentile} (252d window) — Current: {vix}`
- [ ] Timestamp : `Since: {triggeredAt}` formaté locale-aware
- [ ] Icône warning/alert appropriée

**AC4 -- Bouton "View details →"**
- [ ] Ouvre un `<Dialog>` shadcn avec overlay
- [ ] Dialog contient : VIX actuel, seuil p90, date déclenchement, historique 7j (placeholder)
- [ ] Animation Motion 12 entry/exit sur Dialog

**AC5 -- Bouton "Dismiss"**
- [ ] Cache le banner pour la session en cours (sessionStorage)
- [ ] Escape key dismiss le banner
- [ ] `aria-label` descriptif

**AC6 -- Accessibilité**
- [ ] `role="alert"` sur le container
- [ ] `aria-live="assertive"`
- [ ] Focus trap dans Dialog quand ouvert
- [ ] Escape ferme Dialog et Banner

**AC7 -- Tests**
- [ ] Test : rendu AlertBanner avec level warning/alert/crisis
- [ ] Test : bouton Dismiss cache le banner
- [ ] Test : Dialog s'ouvre au clic "View details"
- [ ] Test : reduced-motion → fade simple, pas de slide
- [ ] Test : role="alert" et aria-live présents
- [ ] Tests dans `src/components/alerts/__tests__/`

**AC8 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/alerts/
  AlertBanner.tsx (new)
  __tests__/AlertBanner.test.tsx (new)
```

### Pattern Motion 12 entry
```tsx
import { motion } from 'motion/react'

<motion.div
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: 'spring', bounce: 0.3 }}
>
  <NeonGradientCard variant={level}>
    <Meteors density={level === 'crisis' ? 'high' : 'medium'} />
    <ShineBorder color="red" />
    {/* content */}
  </NeonGradientCard>
</motion.div>
```

### Bilingue via next-intl
Utiliser `useTranslations('alerts')` ou record inline FR/EN (pattern existant dans HeroSection).

### Dépendances
- Story 5.1 : NeonGradientCard + Meteors
- shadcn Dialog (déjà installé)
- ShineBorder (src/components/magic-ui/shine-border.tsx, déjà installé)
- `AlertLevel` type (src/lib/schemas/alert.ts)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
