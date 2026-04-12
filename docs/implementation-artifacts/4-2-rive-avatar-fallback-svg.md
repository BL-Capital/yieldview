# Story 4.2 : Rive Avatar — Fallback SVG + Setup Package

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir un avatar expressif dans le hero qui reflète le niveau de risque du marché,
**so that** la page d'accueil communique l'état du marché de façon immédiate et mémorable.

**Business value :** L'avatar est l'élément signature de YieldField. Cette story établit la fondation (package + SVG fallback) qui rend le composant `<HeroAvatar>` fonctionnel pour le MVP, même sans le fichier `.riv` (Story 4.3 P1).

---

## Acceptance Criteria

**AC1 -- Installation dépendance**
- [ ] `pnpm add @rive-app/react-canvas` installé et dans `package.json`

**AC2 -- SVG Fallback Assets**
- [ ] `public/rive/low.svg` créé — visage serein, couleur or `#C9A84C`
- [ ] `public/rive/medium.svg` créé — visage concentré, couleur ambre `#F59E0B`
- [ ] `public/rive/high.svg` créé — visage alerte, couleur rouge `#DC2626`
- [ ] `public/rive/crisis.svg` créé — visage alarme, couleur `#991B1B`
- [ ] Chaque SVG : 120×120px, style minimaliste cohérent entre les 4 variantes
- [ ] Expressions distinctes et lisibles : pas de détails fins

**AC3 -- Composant `<HeroAvatar>`**
- [ ] `src/components/rive/HeroAvatar.tsx` créé
- [ ] Props : `riskLevel: 'low' | 'medium' | 'high' | 'crisis'`
- [ ] Mode actif par défaut : **fallback SVG** (jusqu'à disponibilité du `.riv`)
- [ ] Affiche le SVG correspondant au `riskLevel`
- [ ] Taille : 120×120px, centré
- [ ] Transition douce entre niveaux (`motion` fade 300ms)
- [ ] `aria-label` : `"Indicateur avatar risque marché : {level}"` / EN : `"Market risk avatar indicator: {level}"`
- [ ] Respect `prefers-reduced-motion` : pas de transition, swap instantané
- [ ] Architecture prête pour Rive : prop `useRive?: boolean` (default `false`)

**AC4 -- Intégration dans `<HeroSection>`**
- [ ] `src/components/dashboard/HeroSection.tsx` mis à jour pour inclure `<HeroAvatar>`
- [ ] Positionné au-dessus du `<RiskIndicator>` (Pulse Ring) ou à côté selon layout
- [ ] Reçoit `alertLevel` mappé vers `riskLevel` (`null` → `'low'`)

**AC5 -- Smoke test**
- [ ] `<HeroAvatar riskLevel="low">` affiche `low.svg`
- [ ] `<HeroAvatar riskLevel="crisis">` affiche `crisis.svg`
- [ ] Pas d'erreur console

**AC6 -- Tests**
- [ ] Test : chaque `riskLevel` charge le bon SVG (snapshot ou text assert)
- [ ] Test : `aria-label` correct selon `riskLevel`
- [ ] Tests dans `tests/components/rive/`

**AC7 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Installation
```bash
pnpm add @rive-app/react-canvas
```

### Structure fichiers
```
public/rive/
  low.svg
  medium.svg
  high.svg
  crisis.svg
src/components/rive/
  HeroAvatar.tsx
```

### Mapping riskLevel → SVG
```tsx
const SVG_MAP = {
  low: '/rive/low.svg',
  medium: '/rive/medium.svg',
  high: '/rive/high.svg',
  crisis: '/rive/crisis.svg',
} as const
```

### Mapping alertLevel (Story 3.13) → riskLevel
```tsx
const mapAlertToRisk = (level: AlertLevel | null): RiskLevel => {
  if (!level || level === 'low') return 'low'
  if (level === 'warning') return 'medium'
  if (level === 'alert') return 'high'
  return 'crisis'
}
```

### Dépendances
- Story 3.13 : HeroSection (fichier à modifier)
- Story 4.3 : Rive .riv asset (P1, optionnel — architecture anticipée)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
