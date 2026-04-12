# Story 3.9 : Business `<KpiBentoGrid>`

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
**I want** voir les 6 KPIs organisés dans une grille Bento asymétrique avec apparition en stagger,
**so that** la présentation des marchés est hiérarchisée visuellement (VIX en bas pleine largeur) et dynamique à l'entrée dans le viewport.

**Business value :** KpiBentoGrid orchestre les 6 KpiCards dans la mise en page définitive. C'est le composant qui traduit la hiérarchie éditoriale des données (FR15). L'animation stagger rend la révélation progressive et non chaotique.

---

## Acceptance Criteria

**AC1 -- Composant KpiBentoGrid**
- [ ] `src/components/dashboard/KpiBentoGrid.tsx` créé
- [ ] Props :
  ```typescript
  interface KpiBentoGridProps {
    kpis: KpiData[]   // tableau de KpiData depuis le JSON pipeline
    className?: string
  }
  ```
- [ ] Type `KpiData` importé depuis `src/lib/schemas.ts` (Epic 2 Story 2.1)

**AC2 -- Layout des 6 KPIs**
- [ ] Desktop (3 cols) :
  ```
  [ CAC 40 · col-span-2 ]  [ S&P 500 · col-span-1 ]
  [ EUR/USD · col-span-1 ] [ Or · col-span-1 ] [ BTC · col-span-1 ]
  [ VIX · col-span-3 ]
  ```
- [ ] Tablet (2 cols) : réorganisation en 2 colonnes, VIX col-span-2
- [ ] Mobile (1 col) : toutes les cartes en col-span-1, VIX en dernier

**AC3 -- Animation stagger Motion 12**
- [ ] Wrapper avec `motion.div` variants `staggerContainer` (Story 3.1)
- [ ] Chaque `KpiCard` enveloppé dans `motion.div` avec variant `fadeInUp`
- [ ] Délai progressif de 100ms entre chaque card (`staggerChildren: 0.1`)
- [ ] Trigger : `whileInView` avec `once: true` et `viewport={{ amount: 0.2 }}`

**AC4 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → pas de stagger, toutes les cards apparaissent directement
- [ ] Utilise `usePrefersReducedMotion`

**AC5 -- Données mockées**
- [ ] Exporte `MOCK_KPIS: KpiData[]` depuis `src/data/mock-kpis.ts`
- [ ] 6 entrées couvrant CAC 40, S&P 500, EUR/USD, Or, Bitcoin, VIX
- [ ] Utilisé dans le smoke test et le développement local

**AC6 -- Tests**
- [ ] Test : les 6 KpiCards sont rendus
- [ ] Test : avec `MOCK_KPIS`, rendu sans erreur
- [ ] Tests dans `tests/components/dashboard/KpiBentoGrid.test.tsx`

**AC7 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Dépendances
- Story 3.1 : Motion 12 + variants
- Story 3.6 : BentoGrid
- Story 3.8 : KpiCard
- Story 2.1 : schemas Zod (KpiData type)

### Type KpiData (depuis schemas.ts)
```typescript
// Rappel structure depuis Story 2.1
type KpiData = {
  id: string
  label: string
  value: number
  change_pct: number
  change_abs?: number
  unit?: string
  source: string
  timestamp: string
}
```

### Mapping KpiData → KpiCardProps
Le composant fait le mapping : `change_pct` → `change`, `change_abs` → `changeAbsolute`, etc.

### Fichiers à créer
```
src/components/dashboard/KpiBentoGrid.tsx
src/data/mock-kpis.ts
tests/components/dashboard/KpiBentoGrid.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
