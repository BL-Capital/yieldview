# Story 3.3 : Magic UI Number Ticker

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
**I want** voir les valeurs numériques des KPIs s'animer en comptant jusqu'à leur valeur finale quand ils entrent dans le viewport,
**so that** l'affichage des données financières est vivant et attire l'attention sur les chiffres clés.

**Business value :** Le NumberTicker transforme des chiffres statiques en preuve vivante que les données sont fraîches et calculées. C'est l'un des 7 moments signature UX (FR25 — animation des valeurs KPI).

---

## Acceptance Criteria

**AC1 -- Installation Magic UI**
- [ ] `npx magic-ui@latest add number-ticker` exécuté
- [ ] Fichier `src/components/magic-ui/number-ticker.tsx` présent et fonctionnel
- [ ] Pas de modification du composant source (utiliser tel quel sauf customisation nécessaire)

**AC2 -- Trigger viewport-enter**
- [ ] Animation démarre uniquement quand le composant entre dans le viewport
- [ ] Utilise `IntersectionObserver` (ou l'implémentation Magic UI si déjà incluse)
- [ ] Seuil d'activation : 20% visible (`threshold: 0.2`)
- [ ] Ne se rejoue pas au défilement retour (once: true)

**AC3 -- Variants numériques**
- [ ] Supporte les entiers : `1234` → affiche `1 234` formaté
- [ ] Supporte les décimaux : `2.47` → affiche `2.47` (2 décimales)
- [ ] Supporte les négatifs : `-0.83` → commence à 0, descend à `-0.83`
- [ ] Props : `value: number`, `decimalPlaces?: number`, `prefix?: string`, `suffix?: string`

**AC4 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → affiche la valeur finale directement (pas d'animation)
- [ ] Utilise le hook `usePrefersReducedMotion` de Story 3.1

**AC5 -- Tests unitaires**
- [ ] Test : rendu avec valeur entière, décimale, négative
- [ ] Test : `decimalPlaces`, `prefix`, `suffix` appliqués
- [ ] Tests dans `tests/components/magic-ui/number-ticker.test.tsx`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Installation
```bash
npx magic-ui@latest add number-ticker
```
Si l'installation CLI échoue (network, etc.) → copy-paste manuel depuis https://magicui.design/docs/components/number-ticker

### Dépendance
- Motion 12 (Story 3.1 doit être done)
- Hook `usePrefersReducedMotion` (Story 3.1)

### Formatage des nombres
Pour les KPIs financiers, le formatage doit utiliser `Intl.NumberFormat` dans le parent (`<KpiCard>`), pas dans NumberTicker. NumberTicker reçoit le nombre brut et gère juste l'animation.

### Fichiers attendus
```
src/components/magic-ui/number-ticker.tsx   (généré par Magic UI CLI ou copié)
tests/components/magic-ui/number-ticker.test.tsx
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
