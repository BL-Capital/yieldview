# Story 3.4 : Magic UI Animated Gradient Text

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir le tagline principal du hero avec un dégradé doré animé,
**so that** l'accroche éditoriale de YieldField est visuellement distinctive et mémorable.

**Business value :** Le tagline "Le marché vous parle. Le Chartiste l'interprète." doit capturer l'attention en 3 secondes. L'animation gradient gold est un marqueur identitaire fort du design YieldField (FR22 — TaglineHeader).

---

## Acceptance Criteria

**AC1 -- Installation Magic UI**
- [ ] `npx magic-ui@latest add animated-gradient-text` exécuté
- [ ] Fichier `src/components/magic-ui/animated-gradient-text.tsx` présent

**AC2 -- Gradient adapté YieldField**
- [ ] Gradient personnalisé : `yield-gold` (#C9A84C) → `yield-gold-light` (#E8C97A) → `yield-gold` (#C9A84C)
- [ ] Animation en boucle douce (shimmer de gauche à droite)
- [ ] Durée cycle : 3s
- [ ] Appliqué via `background-clip: text` + `text-fill-color: transparent`

**AC3 -- Typographie**
- [ ] Utilise la font `font-serif` (Instrument Serif) du design system
- [ ] Taille : `text-display-1` (du @theme CSS — 4.5rem desktop, responsive)
- [ ] Poids : 400 (regular) — Instrument Serif n'a pas de bold natif

**AC4 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → gradient statique yield-gold, pas d'animation

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur

---

## Dev Notes

### Installation
```bash
npx magic-ui@latest add animated-gradient-text
```

### Customisation gradient dans le composant
Remplacer les couleurs par défaut Magic UI par les tokens YieldField dans le `style` ou `className` du composant.

### Fichiers attendus
```
src/components/magic-ui/animated-gradient-text.tsx
```

### Note
Composant simple (1 pt). Pas de tests unitaires requis au-delà du quality gate typecheck/lint. Le test visuel se fait dans le smoke test de Story 3.13.

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
