# Story 5.1 : Magic UI Neon Gradient Card + Aceternity Meteors

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** développeur travaillant sur le mode crisis,
**I want** disposer des composants Neon Gradient Card (Magic UI) et Meteors (Aceternity) installés et adaptés,
**so that** je puisse composer l'AlertBanner (Story 5.2) avec ces effets visuels premium.

**Business value :** Fondation visuelle du moment signature #6 (mode crisis) — les effets Meteors + Neon Gradient créent l'ambiance dramatique "bulletin d'alerte" jamais vue sur un site finance.

---

## Acceptance Criteria

**AC1 -- Neon Gradient Card installé**
- [ ] `src/components/magic-ui/neon-gradient-card.tsx` créé
- [ ] Copié depuis Magic UI, adapté au design system YieldField
- [ ] Props : `variant?: 'warning' | 'alert' | 'crisis'`, `className?: string`, `children: ReactNode`
- [ ] Couleurs par variant :
  - `warning` → neon jaune `#F59E0B`
  - `alert` → neon rouge `#DC2626`
  - `crisis` → neon rouge foncé `#991B1B`
- [ ] Classe CSS `'use client'` directive

**AC2 -- Meteors installé**
- [ ] `src/components/aceternity/meteors.tsx` créé
- [ ] Copy-paste depuis Aceternity UI, adapté
- [ ] Props : `density?: 'low' | 'medium' | 'high'`, `className?: string`
- [ ] Density map : `low` → 8 meteors, `medium` → 15, `high` → 25
- [ ] Couleurs héritées du parent (CSS custom properties)

**AC3 -- Respect prefers-reduced-motion**
- [ ] Neon Gradient Card : glow statique, pas d'animation pulse
- [ ] Meteors : aucun meteor affiché, fond statique simple
- [ ] Utilise le hook `usePrefersReducedMotion` existant

**AC4 -- Tests**
- [ ] Test `NeonGradientCard` : rendu avec chaque variant (warning, alert, crisis)
- [ ] Test `Meteors` : rendu avec chaque density
- [ ] Test reduced-motion : Meteors non rendu quand reduced-motion activé
- [ ] Tests dans `src/components/magic-ui/__tests__/` et `src/components/aceternity/__tests__/`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/magic-ui/
  neon-gradient-card.tsx (new)
  __tests__/neon-gradient-card.test.tsx (new)
src/components/aceternity/
  meteors.tsx (new)
  __tests__/meteors.test.tsx (new)
```

### Pattern variant couleur
```tsx
const NEON_COLORS: Record<string, string> = {
  warning: '#F59E0B',
  alert: '#DC2626',
  crisis: '#991B1B',
}
```

### Dépendances
- Aucune nouvelle dépendance npm
- Hook `usePrefersReducedMotion` (src/hooks/)
- Consommé par Story 5.2 (AlertBanner)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
