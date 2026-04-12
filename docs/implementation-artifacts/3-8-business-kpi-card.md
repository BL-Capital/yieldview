# Story 3.8 : Business `<KpiCard>`

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir chaque indicateur financier dans une carte dédiée avec valeur animée, variation colorée et label,
**so that** je comprends en un coup d'oeil la situation des marchés (hausse/baisse, amplitude).

**Business value :** KpiCard est le composant central du dashboard. Il consomme GlareCard + NumberTicker + BentoGridItem pour créer l'expérience premium des données financières. FR16 — KPI cards.

---

## Acceptance Criteria

**AC1 -- Composant KpiCard**
- [ ] `src/components/dashboard/KpiCard.tsx` créé
- [ ] Props interface `KpiCardProps` :
  ```typescript
  interface KpiCardProps {
    label: string               // "CAC 40", "S&P 500", etc.
    value: number               // valeur numérique brute
    change: number              // variation en % (positif = bull, négatif = bear)
    changeAbsolute?: number     // variation absolue optionnelle
    unit?: string               // "pts", "%", "€", "$"
    decimalPlaces?: number      // défaut 2
    className?: string
    colSpan?: 1 | 2 | 3        // pour BentoGrid
    rowSpan?: 1 | 2
  }
  ```
- [ ] Exporte en named export ET default

**AC2 -- Structure visuelle**
- [ ] Wrapper : `GlareCard` (Story 3.7) > `BentoGridItem` (Story 3.6)
- [ ] Label : `text-xs font-mono text-yield-gold/70 uppercase tracking-widest`
- [ ] Valeur principale : `NumberTicker` (Story 3.3) avec `prefix`/`suffix` selon unit
- [ ] Badge variation : `+2.47%` ou `-0.83%`
  - Bull (change > 0) : `bg-yield-bull/20 text-yield-bull border-yield-bull/40`
  - Bear (change < 0) : `bg-yield-bear/20 text-yield-bear border-yield-bear/40`
  - Neutral (change = 0) : `bg-yield-ivory/10 text-yield-ivory/60`
- [ ] Signe explicite : `+` pour positif, `-` pour négatif

**AC3 -- Variante KPI d'alerte (VIX)**
- [ ] Si `label === "VIX"` ou prop `isAlert?: boolean` :
  - Background : `bg-yield-navy/70` (plus foncé)
  - Border : `border-yield-gold/40` (plus visible)
  - Taille de valeur plus grande : `text-kpi-main` (3rem)

**AC4 -- Formatage des nombres**
- [ ] Valeurs > 1000 : format `1 234.56` (espace comme séparateur milliers, locale `fr-FR`)
- [ ] Valeurs < 1 : garde au moins 4 décimales (ex: `0.0023`)
- [ ] Utilise `Intl.NumberFormat` avec `locale: 'fr-FR'`

**AC5 -- Accessibilité**
- [ ] `aria-label` complet : `"CAC 40 : 7 234 points, variation +2.47%"`
- [ ] Couleurs de variation pas uniquement indicateur (texte présent)

**AC6 -- Tests unitaires**
- [ ] Test : rendu avec KPI bull (change > 0) → classe `text-yield-bull` présente
- [ ] Test : rendu avec KPI bear (change < 0) → classe `text-yield-bear` présente
- [ ] Test : `aria-label` correctement formaté
- [ ] Test : formatage `Intl.NumberFormat` sur 3 cas (int, décimal, >1000)
- [ ] Tests dans `tests/components/dashboard/KpiCard.test.tsx`

**AC7 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Dépendances
- Story 3.3 : `NumberTicker`
- Story 3.6 : `BentoGridItem`
- Story 3.7 : `GlareCard`
- Motion 12 (Story 3.1)

### Données mock pour les tests
```typescript
const mockKpi = {
  label: "CAC 40",
  value: 7234.56,
  change: 2.47,
  changeAbsolute: 174.23,
  unit: "pts",
  decimalPlaces: 2,
}
```

### KPIs attendus dans le dashboard (6 P0)
1. CAC 40 (pts, col-span-2)
2. S&P 500 (pts, col-span-1)
3. EUR/USD (4 décimales, col-span-1)
4. Or/XAU ($/oz, col-span-1)
5. Bitcoin (k$, col-span-1)
6. VIX (isAlert=true, col-span-3)

### Fichiers à créer
```
src/components/dashboard/KpiCard.tsx
tests/components/dashboard/KpiCard.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
