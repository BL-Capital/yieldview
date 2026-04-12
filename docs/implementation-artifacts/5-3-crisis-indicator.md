# Story 5.3 : Business `<CrisisIndicator>`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 2
Priority: P1
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur de YieldField en mode crisis,
**I want** voir le KPI VIX visuellement transformé avec un indicateur rouge pulsant,
**so that** l'état d'alerte est renforcé visuellement dans la grille de données, pas seulement dans le banner.

**Business value :** Cohérence visuelle du mode crisis — le stress se propage de la bannière jusqu'aux données individuelles, renforçant l'immersion.

---

## Acceptance Criteria

**AC1 -- Composant CrisisIndicator créé**
- [ ] `src/components/alerts/CrisisIndicator.tsx` créé
- [ ] Directive `'use client'`
- [ ] Props : `level: AlertLevel`, `vix: number`, `percentile: number`, `locale: string`

**AC2 -- Version spéciale KpiCard VIX**
- [ ] Wrap la KpiCard VIX quand `alert.active === true`
- [ ] ShineBorder rouge permanent qui pulse
- [ ] Pulsating Dot en couleur alert (warning=#F59E0B, alert=#DC2626, crisis=#991B1B)

**AC3 -- Tooltip explicatif**
- [ ] shadcn Tooltip sur hover
- [ ] Contenu : "VIX at p{percentile} over 252 trading days"
- [ ] Bilingue FR/EN

**AC4 -- Respect prefers-reduced-motion**
- [ ] ShineBorder : bordure rouge statique, pas de pulse
- [ ] Pulsating Dot : point statique, pas d'animation

**AC5 -- Tests**
- [ ] Test : rendu CrisisIndicator avec chaque level
- [ ] Test : Tooltip contient le bon percentile
- [ ] Test : reduced-motion → pas de pulse
- [ ] Tests dans `src/components/alerts/__tests__/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/alerts/
  CrisisIndicator.tsx (new)
  __tests__/CrisisIndicator.test.tsx (new)
```

### Dépendances
- ShineBorder (src/components/magic-ui/shine-border.tsx)
- shadcn Tooltip (src/components/ui/tooltip.tsx)
- `AlertLevel` type (src/lib/schemas/alert.ts)
- KpiCard (src/components/dashboard/KpiCard.tsx)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
