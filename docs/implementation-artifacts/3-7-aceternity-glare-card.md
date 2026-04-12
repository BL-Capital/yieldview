# Story 3.7 : Aceternity Glare Card (hover effect)

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir un effet shimmer doré qui balaie les cartes KPI au survol,
**so that** l'interaction hover sur les données financières donne une sensation premium et invite à l'exploration.

**Business value :** Le Glare Card est l'amplificateur visuel des KpiCards. Il transforme le survol d'une donnée en micro-interaction mémorable. Scope de repli possible vers Sprint 4/6 si débordement Sprint 3.

---

## Acceptance Criteria

**AC1 -- GlareCard component**
- [ ] `src/components/aceternity/glare-card.tsx` créé
- [ ] Props : `children: React.ReactNode`, `className?: string`
- [ ] Effet : shimmer lumineux (linear gradient semi-transparent) qui suit la position de la souris
- [ ] Implémentation via `onMouseMove` → calcul position relative → `background` radial gradient
- [ ] `"use client"` directive (event handlers)

**AC2 -- Shimmer doré YieldField**
- [ ] Couleur shimmer : `rgba(201, 168, 76, 0.15)` (yield-gold à 15% opacity)
- [ ] Rayon du shimmer : 200px
- [ ] Transition fluide : le gradient suit la souris sans lag (requestAnimationFrame si besoin)

**AC3 -- Reset au mouse-leave**
- [ ] Au `onMouseLeave` : shimmer disparaît progressivement (transition 300ms opacity → 0)

**AC4 -- Disabled en reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → pas d'effet glare (composant rend ses children sans overlay)
- [ ] Utilise `usePrefersReducedMotion`

**AC5 -- Tests**
- [ ] Test : children rendus correctement
- [ ] Test : en mode reduced-motion, pas d'overlay glare
- [ ] Tests dans `tests/components/aceternity/glare-card.test.tsx`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Source de référence
https://ui.aceternity.com/components/card-hover-effect (ou glare effect)

### Pattern implémentation
```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  setGlarePosition({ x, y })
}
```

### Wrapper usage dans KpiCard
`GlareCard` wrappera le `BentoGridItem` dans `<KpiCard>` (Story 3.8).

### Fichiers à créer
```
src/components/aceternity/glare-card.tsx
tests/components/aceternity/glare-card.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
