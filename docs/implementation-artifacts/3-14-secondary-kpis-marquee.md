# Story 3.14 : Business `<SecondaryKpisMarquee>`

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
**I want** voir un ticker financier en défilement horizontal continu avec les KPIs secondaires (pétrole, DAX, Nasdaq, taux OAT, etc.),
**so that** l'expérience ressemble à un terminal d'information financière et les données secondaires sont accessibles sans prendre de place dans la grille principale.

**Business value :** Le marquee renforce la densité informationnelle premium du site. FR27 — KPIs secondaires en scroll continu. C'est la bande passante des données supplémentaires qui donne l'impression de couverture totale des marchés.

---

## Acceptance Criteria

**AC1 -- Composant SecondaryKpisMarquee**
- [ ] `src/components/dashboard/SecondaryKpisMarquee.tsx` créé
- [ ] Props :
  ```typescript
  interface SecondaryKpisMarqueeProps {
    kpis: SecondaryKpi[]
    className?: string
    speed?: 'slow' | 'normal' | 'fast'   // défaut 'normal'
  }

  interface SecondaryKpi {
    label: string      // "DAX", "Nasdaq", "Pétrole WTI", "OAT 10Y"
    value: number
    change: number     // en %
    unit?: string
  }
  ```

**AC2 -- Animation défilement**
- [ ] Défilement horizontal de droite à gauche, continu (boucle infinie)
- [ ] Implémentation : duplication du contenu pour le loop seamless
- [ ] CSS `@keyframes marquee` avec `transform: translateX(-50%)` sur conteneur doublé
- [ ] Vitesses : `slow` = 60s, `normal` = 40s, `fast` = 20s par cycle

**AC3 -- Format d'un item KPI secondaire**
- [ ] Layout : `LABEL  valeur ▲/▼ +X.XX%`
- [ ] Label : `font-mono text-xs text-yield-gold/70 uppercase`
- [ ] Valeur : `font-mono text-sm text-yield-ivory`
- [ ] Badge variation : flèche ▲ (bull) ou ▼ (bear) + pourcentage coloré
- [ ] Séparateur entre items : `·` ou `|` en `text-yield-gold/30`

**AC4 -- Pause au hover**
- [ ] `onMouseEnter` → animation paused (`animation-play-state: paused`)
- [ ] `onMouseLeave` → animation running
- [ ] Permet la lecture d'un item sans qu'il disparaisse

**AC5 -- Respect reduced-motion**
- [ ] Si `prefers-reduced-motion: reduce` → liste statique horizontale scrollable (overflow-x: auto), pas d'animation

**AC6 -- KPIs secondaires mock**
- [ ] 8 KPIs minimum dans les données mock :
  1. DAX (pts)
  2. Nasdaq (pts)
  3. FTSE 100 (pts)
  4. Nikkei 225 (pts)
  5. Pétrole WTI ($/bbl)
  6. OAT 10Y (%)
  7. US10Y (%)
  8. Argent XAG ($/oz)
- [ ] Données mock dans `src/data/mock-kpis.ts` (fichier créé en Story 3.9)

**AC7 -- Tests**
- [ ] Test : 8 items rendus dans le DOM
- [ ] Test : en reduced-motion, pas de classe d'animation
- [ ] Test : pause hover (simuler mouseenter/leave)
- [ ] Tests dans `tests/components/dashboard/SecondaryKpisMarquee.test.tsx`

**AC8 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Pattern CSS marquee loop
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```
```tsx
// Doubler les items pour le loop seamless
const items = [...kpis, ...kpis]
```

### Alternative : Magic UI Marquee
Magic UI a un composant `<Marquee>` : `npx magic-ui@latest add marquee`
Si disponible et compatible, l'utiliser directement plutôt que de réimplémenter.

### Position dans le layout
Placé entre `KpiBentoGrid` et le CTA Coulisses dans `<HeroSection>`. Pleine largeur (`w-full`). Hauteur fixe `h-10`. Border top/bottom `border-y border-yield-gold/20`.

### Fichiers à créer
```
src/components/dashboard/SecondaryKpisMarquee.tsx
tests/components/dashboard/SecondaryKpisMarquee.test.tsx
```
(mise à jour `src/data/mock-kpis.ts` avec les KPIs secondaires)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
