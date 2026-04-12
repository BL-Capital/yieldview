# Story 3.6 : Aceternity Bento Grid

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
**I want** voir les KPIs organisés dans une grille Bento asymétrique et moderne,
**so that** les indicateurs financiers sont présentés de façon visuellement différenciée (taille variable selon importance) et immédiatement lisibles.

**Business value :** La Bento Grid est la structure d'affichage des 6 KPIs principaux. Son asymétrie signale la hiérarchie de l'information (FR15 — KpiBentoGrid). C'est l'ossature visuelle du dashboard.

---

## Acceptance Criteria

**AC1 -- BentoGrid component**
- [ ] `src/components/aceternity/bento-grid.tsx` créé
- [ ] Props : `children: React.ReactNode`, `className?: string`
- [ ] Layout CSS Grid : `grid-cols-3` desktop, `grid-cols-2` tablet (md), `grid-cols-1` mobile (sm)
- [ ] `gap-4` entre items

**AC2 -- BentoGridItem component**
- [ ] `src/components/aceternity/bento-grid-item.tsx` créé
- [ ] Props : `className?: string`, `title?: string`, `description?: string`, `header?: React.ReactNode`, `icon?: React.ReactNode`, `children?: React.ReactNode`
- [ ] Variantes de taille via `className` : `col-span-1`, `col-span-2`, `row-span-2`
- [ ] Background : `bg-yield-navy/50` avec `backdrop-blur-sm`
- [ ] Border : `border border-yield-gold/20`
- [ ] Border radius : `rounded-xl`
- [ ] Hover : border gold 40% → 60% opacity (transition 200ms)

**AC3 -- Responsive**
- [ ] 3 colonnes desktop → 2 colonnes tablet → 1 colonne mobile
- [ ] `col-span-2` se réduit à `col-span-1` sur mobile (pas de débordement)
- [ ] Test smoke : grille de 6 items dummy rendue sans overflow

**AC4 -- Tests**
- [ ] Test : `BentoGrid` rend ses children
- [ ] Test : `BentoGridItem` affiche title + description
- [ ] Tests dans `tests/components/aceternity/bento-grid.test.tsx`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Source de référence
https://ui.aceternity.com/components/bento-grid

### Layout YieldField (6 KPIs) prévu dans Story 3.9
```
[ CAC 40 (2 cols) ]  [ S&P 500 (1 col) ]
[ EUR/USD (1 col) ]  [ Or (1 col) ]  [ BTC (1 col) ]
[ VIX (3 cols) ] ← grand format car KPI d'alerte
```

### Palette backgrounds
- Item standard : `bg-yield-navy/50 backdrop-blur-sm`
- Item VIX : `bg-yield-navy/70` (plus sombre, plus important)
- Item bull : léger tint `bg-yield-bull/5`
- Item bear : léger tint `bg-yield-bear/5`

### Fichiers à créer
```
src/components/aceternity/bento-grid.tsx
src/components/aceternity/bento-grid-item.tsx
tests/components/aceternity/bento-grid.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
