# Story 4.7 : Magic UI Shine Border

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir un effet shine lumineux sur les boutons et éléments interactifs clés,
**so that** les interactions importantes (copy, newsletter, alert) sont visuellement distinguées.

**Business value :** Polish visuel premium — l'effet ShineBorder sur les CTAs renforce la perception de qualité de l'interface.

---

## Acceptance Criteria

**AC1 -- Composant Shine Border**
- [ ] `src/components/magic-ui/shine-border.tsx` créé (copy depuis Magic UI)
- [ ] Props : `children: React.ReactNode`, `color?: string | string[]`, `borderWidth?: number`, `duration?: number`, `className?: string`
- [ ] Effet : bordure animée qui "tourne" autour de l'élément avec un point lumineux
- [ ] Couleur par défaut : gold `#C9A84C`

**AC2 -- Intégrations**
- [ ] Bouton "Copy" du Code Block (Story 4.6) : ShineBorder au hover
- [ ] Bouton "Voir les Coulisses" (CTA hero, Story 3.13) : ShineBorder au hover
- [ ] Pas d'application globale — uniquement ces deux points dans ce sprint

**AC3 -- Reduced motion**
- [ ] `prefers-reduced-motion: reduce` → effet désactivé, bordure statique gold

**AC4 -- Tests**
- [ ] Test : rendu sans erreur avec enfant button
- [ ] Tests dans `tests/components/magic-ui/`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Source
Magic UI Shine Border : https://magicui.design/docs/components/shine-border

### Structure fichiers
```
src/components/magic-ui/shine-border.tsx
tests/components/magic-ui/ShineBorder.test.tsx
```

### Utilisation type
```tsx
<ShineBorder color={['#C9A84C', '#F59E0B']} borderWidth={2}>
  <button>Copy</button>
</ShineBorder>
```

### Dépendances
- Story 4.6 : CodeBlock (intégration copy button)
- Story 3.13 : HeroSection CTA (intégration bouton)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
