# Story 3.11 : Magic UI Ripple (Freshness Indicator)

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
**I want** voir un indicateur visuel de fraîcheur des données avec un point pulsant et un label "Live · Updated X minutes ago",
**so that** je sache immédiatement que les données sont récentes et générées automatiquement (pas stale).

**Business value :** La fraîcheur est un argument de crédibilité fort auprès de Thomas (recruteur). FR17 (FreshnessIndicator) + FR26 (Pulsating Dot). C'est la promesse que le pipeline tourne réellement.

---

## Acceptance Criteria

**AC1 -- Installation Magic UI Ripple**
- [ ] `npx magic-ui@latest add ripple` exécuté
- [ ] Fichier `src/components/magic-ui/ripple.tsx` présent

**AC2 -- Composant FreshnessIndicator**
- [ ] `src/components/dashboard/FreshnessIndicator.tsx` créé
- [ ] Props :
  ```typescript
  interface FreshnessIndicatorProps {
    publishedAt: string      // ISO date string
    freshnessLevel: 'fresh' | 'aging' | 'stale'
    locale: string
  }
  ```
- [ ] Calcul âge données : `Math.floor((Date.now() - new Date(publishedAt).getTime()) / 60000)` en minutes
- [ ] Affichage : `"Live · Mis à jour il y a X minutes"` (FR) / `"Live · Updated X minutes ago"` (EN)
- [ ] Couleur conditionnelle selon `freshnessLevel` :
  - `fresh` (< 2h) : `text-yield-bull` (#22C55E) — vert
  - `aging` (2-8h) : `text-yield-gold` (#C9A84C) — or
  - `stale` (> 8h) : `text-yield-bear` (#EF4444) — rouge

**AC3 -- Pulsating Dot (Ripple)**
- [ ] Utilise le composant `Ripple` de Magic UI adapté en petite taille
- [ ] Ou alternative : point CSS avec animation `@keyframes pulse` (plus léger)
- [ ] Couleur du point = couleur `freshnessLevel`
- [ ] Taille : 8px dot + ripple 20px max
- [ ] Positionné à gauche du label "Live"

**AC4 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → point statique, pas de ripple

**AC5 -- Tests**
- [ ] Test : label FR correct avec `locale='fr'`
- [ ] Test : couleur `text-yield-bear` quand `freshnessLevel='stale'`
- [ ] Tests dans `tests/components/dashboard/FreshnessIndicator.test.tsx`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Fichiers à créer
```
src/components/magic-ui/ripple.tsx   (généré par Magic UI CLI)
src/components/dashboard/FreshnessIndicator.tsx
tests/components/dashboard/FreshnessIndicator.test.tsx
```

### Note sur le calcul de fraîcheur
La pipeline tourne à 6h30 CET. À 7h00, les données ont 30 minutes → `fresh`. À 15h00, elles ont 8h30 → `stale`. Cette logique est dans le pipeline (Story 2.12 publie `freshness_level` dans le JSON). Le composant consomme le champ calculé, pas la date brute.

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
