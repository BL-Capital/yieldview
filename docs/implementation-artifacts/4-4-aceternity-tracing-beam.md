# Story 4.4 : Aceternity Tracing Beam

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur de la page Coulisses,
**I want** voir un beam lumineux qui suit mon scroll à travers les étapes du projet,
**so that** la lecture de la page Coulisses est guidée visuellement et mémorable.

**Business value :** Le Tracing Beam est l'élément "signature moment" de la page Coulisses. Il transforme une liste d'étapes en un parcours narratif visuel.

---

## Acceptance Criteria

**AC1 -- Composant Tracing Beam**
- [ ] `src/components/aceternity/tracing-beam.tsx` créé (copy depuis Aceternity UI)
- [ ] Props : `children: React.ReactNode`, `className?: string`
- [ ] Le beam suit la position de scroll verticale en temps réel
- [ ] Couleur du beam : gold `#C9A84C` avec glow subtle
- [ ] Ligne de fond : gris sombre `#1F2937` (visible en arrière-plan)
- [ ] Dot actif à la position courante du beam

**AC2 -- Scroll behavior**
- [ ] Animation fluide via `useScroll` + `useTransform` (Motion 12)
- [ ] Beam ne dépasse pas le contenu (clamped entre top et bottom du container)
- [ ] Fonctionne sur mobile (touch scroll)

**AC3 -- Reduced motion**
- [ ] `prefers-reduced-motion: reduce` → ligne statique pleine hauteur, pas d'animation de beam
- [ ] Le contenu reste lisible dans les deux modes

**AC4 -- Fallback**
- [ ] Si erreur JS → contenu enfants affichés normalement (graceful degradation)
- [ ] Pas de layout shift au chargement

**AC5 -- Tests**
- [ ] Test : rendu des children sans erreur
- [ ] Test : className forwarding
- [ ] Tests dans `tests/components/aceternity/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Source
Copy-paste depuis Aceternity UI : https://ui.aceternity.com/components/tracing-beam
Adapter les imports pour Motion 12 (`motion/react` au lieu de `framer-motion`).

### Structure fichiers
```
src/components/aceternity/tracing-beam.tsx
tests/components/aceternity/TracingBeam.test.tsx
```

### Adaptation Motion 12
```tsx
// Remplacer framer-motion par motion/react
import { motion, useScroll, useTransform } from 'motion/react'
```

### Utilisation dans Coulisses
```tsx
<TracingBeam>
  <TimelineStep step={1} ... />
  <TimelineStep step={2} ... />
  ...
</TracingBeam>
```

### Dépendances
- Story 3.1 : Motion 12 setup (prérequis)
- Story 4.8 : TimelineStep (utilisera ce composant)
- Story 4.11 : page Coulisses (assemblage final)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
