# Story 4.5 : Magic UI Dot Pattern

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur de la page Coulisses,
**I want** voir un fond subtil avec pattern de points,
**so that** la page Coulisses a une identité visuelle distincte de la homepage.

**Business value :** Background décor, 1 point. Différencie la page Coulisses visuellement tout en restant dans la palette sombre YieldField.

---

## Acceptance Criteria

**AC1 -- Composant Dot Pattern**
- [ ] `src/components/magic-ui/dot-pattern.tsx` créé (copy depuis Magic UI)
- [ ] Props : `width?: number`, `height?: number`, `cx?: number`, `cy?: number`, `cr?: number`, `className?: string`
- [ ] Pattern SVG de points répétés en arrière-plan

**AC2 -- Utilisation page Coulisses**
- [ ] Utilisé comme background de `src/app/[locale]/coulisses/page.tsx`
- [ ] Opacity : 20% (`opacity-20`)
- [ ] Couleur dots : or `#C9A84C` avec opacity 40%
- [ ] Position : `absolute inset-0 -z-10`
- [ ] Pas de scroll avec le contenu (`fixed` ou `absolute`)

**AC3 -- Performance**
- [ ] SVG inline, pas d'image externe
- [ ] Pas d'impact sur LCP

**AC4 -- Tests**
- [ ] Test : rendu sans erreur
- [ ] Tests dans `tests/components/magic-ui/`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Source
Copy-paste depuis Magic UI : https://magicui.design/docs/components/dot-pattern

### Structure fichiers
```
src/components/magic-ui/dot-pattern.tsx
tests/components/magic-ui/DotPattern.test.tsx
```

### Utilisation
```tsx
// Dans page Coulisses
<div className="relative">
  <DotPattern className="absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
  {/* contenu page */}
</div>
```

### Dépendances
- Story 4.11 : page Coulisses (assemblage)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
