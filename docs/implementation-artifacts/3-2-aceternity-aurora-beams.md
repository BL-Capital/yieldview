# Story 3.2 : Aceternity Aurora Background + Background Beams

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir un fond animé Aurora + faisceaux lumineux derrière le hero,
**so that** la première impression visuelle est premium et cohérente avec le positionnement éditorial "magazine de marchés".

**Business value :** L'Aurora est l'élément visuel le plus distinctif du design YieldField. C'est ce qui différencie d'un site finance générique. Thomas (recruteur) doit percevoir immédiatement la qualité de production.

---

## Acceptance Criteria

**AC1 -- AuroraBackground component**
- [ ] `src/components/aceternity/aurora-background.tsx` créé (copy-paste depuis ui.aceternity.com + adaptation)
- [ ] Props : `children: React.ReactNode`, `className?: string`
- [ ] Couleurs Aurora adaptées au design YieldField : `yield-dark` (#0A1628) en base, `yield-gold` (#C9A84C) + `yield-navy` (#0F2040) dans le gradient animé
- [ ] Animation CSS keyframes via Tailwind custom animate (pas Motion 12 pour les bg effects)
- [ ] `"use client"` directive présente
- [ ] Accessible : `aria-hidden="true"` sur les éléments décoratifs

**AC2 -- BackgroundBeams component**
- [ ] `src/components/aceternity/background-beams.tsx` créé
- [ ] Overlay 40% opacity sur l'Aurora (pas de masque total du fond)
- [ ] SVG animé avec faisceaux convergents
- [ ] Respect `prefers-reduced-motion` : animation stoppée (no motion)
- [ ] `"use client"` directive

**AC3 -- Composition Aurora + Beams**
- [ ] `src/components/aceternity/aurora-with-beams.tsx` créé — wrapper de composition
- [ ] Aurora en `position: relative`, Beams en `position: absolute inset-0`
- [ ] Z-index correct : Aurora (z-0) → Beams (z-10) → children (z-20)
- [ ] Smoke test visuel sur page test `/test-aurora` (à supprimer avant merge)

**AC4 -- Tests**
- [ ] Test de rendu : `AuroraBackground` rend ses `children`
- [ ] Test de rendu : `BackgroundBeams` s'affiche sans erreur
- [ ] Tests dans `tests/components/aceternity/`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Source de référence
Aceternity UI : https://ui.aceternity.com/components/aurora-background
Aceternity UI : https://ui.aceternity.com/components/background-beams

### Palette Aurora YieldField
```css
/* Couleurs dans les keyframes Aurora */
--aurora-1: #C9A84C;   /* yield-gold */
--aurora-2: #0F2040;   /* yield-navy */
--aurora-3: #1A3A6B;   /* yield-blue-mid */
--aurora-4: #0A1628;   /* yield-dark (base) */
```

### Structure fichiers à créer
```
src/components/aceternity/aurora-background.tsx
src/components/aceternity/background-beams.tsx
src/components/aceternity/aurora-with-beams.tsx
tests/components/aceternity/aurora-background.test.tsx
tests/components/aceternity/background-beams.test.tsx
```

### Note sur les animations
Aceternity utilise souvent `@keyframes` avec `background-size` et `background-position`. Ces animations doivent être ajoutées dans `globals.css` ou via `tailwind.config` CSS si besoin. Avec Tailwind 4, utiliser `@keyframes` directement dans `globals.css` sous le bloc `@theme`.

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
