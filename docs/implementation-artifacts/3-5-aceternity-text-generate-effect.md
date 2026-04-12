# Story 3.5 : Aceternity Text Generate Effect

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
**I want** voir le texte du briefing éditorial apparaître mot par mot comme s'il était généré en direct,
**so that** l'impression de "IA en train de penser" renforce le positionnement editorial + IA du site.

**Business value :** L'effet Text Generate simule la génération IA en temps réel — c'est l'un des 7 moments signature UX. Il renforce la crédibilité du pipeline IA auprès de Thomas (recruteur) et Sophie (dev fintech). FR23 — BriefingPanel.

---

## Acceptance Criteria

**AC1 -- Composant TextGenerateEffect**
- [ ] `src/components/aceternity/text-generate-effect.tsx` créé (copy-paste + adaptation)
- [ ] Props : `words: string`, `className?: string`, `duration?: number` (défaut 0.5)
- [ ] Animation : chaque mot apparaît avec `opacity: 0 → 1` + `filter: blur(4px) → blur(0)`
- [ ] Délai entre mots : 0.05s (configurable via prop `wordDelay?: number`)
- [ ] `"use client"` directive
- [ ] Dépendance Motion 12 (`motion/react`)

**AC2 -- Trigger viewport-enter**
- [ ] Animation démarre quand le composant entre dans le viewport (`IntersectionObserver` ou `whileInView` de Motion)
- [ ] Seuil : `0.1` (10% visible)
- [ ] Rejoue si le composant sort et rentre ? Non — `once: true`

**AC3 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → affiche tout le texte directement, `blur(0)`, `opacity: 1`
- [ ] Utilise `usePrefersReducedMotion` de Story 3.1

**AC4 -- Tests**
- [ ] Test : le texte complet est rendu dans le DOM (pas juste le premier mot)
- [ ] Test : en mode reduced-motion, pas d'animation (props vérifiables)
- [ ] Tests dans `tests/components/aceternity/text-generate-effect.test.tsx`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Source de référence
https://ui.aceternity.com/components/text-generate-effect

### Adaptation YieldField
- Font : `font-serif` (Instrument Serif) pour le premier paragraphe du briefing
- Taille : `text-body-lg` (1.125rem) ou `text-body` (1rem) selon breakpoint
- Couleur : `text-yield-ivory` (#F5F0E8)

### Dépendances
- Motion 12 (Story 3.1)
- `usePrefersReducedMotion` (Story 3.1)

### Fichiers à créer
```
src/components/aceternity/text-generate-effect.tsx
tests/components/aceternity/text-generate-effect.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
