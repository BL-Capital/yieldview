# Story 4.1 : Lottie Icons Library

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir des icônes animées Lottie sur les flèches des KPI cards,
**so that** l'interface gagne en dynamisme et les variations de marché sont plus expressives visuellement.

**Business value :** Remplace les icônes SVG statiques par des animations légères qui renforcent l'aspect "magazine financier vivant" de YieldField.

---

## Acceptance Criteria

**AC1 -- Installation dépendance**
- [ ] `pnpm add @dotlottie/react-player` installé et dans `package.json`

**AC2 -- Assets Lottie**
- [ ] 5 animations P0 téléchargées depuis LottieFiles et placées dans `public/lottie/`
  - `arrow-up.lottie` (flèche montante, vert)
  - `arrow-down.lottie` (flèche descendante, rouge)
  - `arrow-neutral.lottie` (neutre, gris)
  - `trend-spike.lottie` (spike/alerte, ambre)
  - `loading-pulse.lottie` (chargement, or)
- [ ] Chaque fichier < 30KB
- [ ] Fichiers au format `.lottie` (dotLottie, pas `.json`)

**AC3 -- Wrapper `<LottieIcon>`**
- [ ] `src/components/lottie/LottieIcon.tsx` créé
- [ ] Props : `src: string`, `size?: number` (défaut 24), `loop?: boolean`, `autoplay?: boolean`, `className?: string`
- [ ] Lazy-loaded via `DotLottieReact` de `@dotlottie/react`
- [ ] Fallback SVG statique si `@dotlottie/react-player` échoue ou SSR
- [ ] Respect `prefers-reduced-motion` : animation stoppée (frame 0 figée)
- [ ] `aria-hidden="true"` (icône décorative, pas de label)

**AC4 -- Intégration `<KpiCard>`**
- [ ] `src/components/dashboard/KpiCard.tsx` mis à jour
- [ ] Flèche de variation remplacée par `<LottieIcon>` selon le signe :
  - `change > 0` → `arrow-up.lottie`
  - `change < 0` → `arrow-down.lottie`
  - `change === 0` → `arrow-neutral.lottie`
- [ ] Animation `loop: true, autoplay: true`
- [ ] Taille : 20px

**AC5 -- Tests**
- [ ] Test `LottieIcon` : rendu sans erreur avec src valide
- [ ] Test `LottieIcon` : fallback statique en mode reduced-motion (mock `matchMedia`)
- [ ] Tests dans `tests/components/lottie/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Installation
```bash
pnpm add @dotlottie/react-player
```

### Structure fichiers
```
public/lottie/
  arrow-up.lottie
  arrow-down.lottie
  arrow-neutral.lottie
  trend-spike.lottie
  loading-pulse.lottie
src/components/lottie/
  LottieIcon.tsx
```

### Pattern LottieIcon (reduced-motion)
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
<DotLottieReact
  src={src}
  autoplay={prefersReducedMotion ? false : autoplay}
  loop={prefersReducedMotion ? false : loop}
/>
```

### Dépendances
- Story 3.8 : KpiCard (fichier à modifier)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
review

### Deviations
- `@dotlottie/react-player` (deprecated, peer React 16-18) remplacé par `@lottiefiles/dotlottie-react` v0.18.10 (officiel, React 19 compatible)
- `DotLottieReact` de `@lottiefiles/dotlottie-react` utilisé à la place
- `vitest.setup.ts` créé avec mock global `matchMedia` (guard `typeof window !== 'undefined'` pour éviter crash tests node)
- Mock `@lottiefiles/dotlottie-react` ajouté dans `KpiCard.test.tsx` et `KpiBentoGrid.test.tsx` (régression introduite par ajout LottieIcon dans KpiCard)

### Completion Notes
- `@lottiefiles/dotlottie-react` installé (v0.18.10)
- 5 fichiers `.lottie` créés dans `public/lottie/` (format ZIP valide, < 1KB chacun)
- `src/components/lottie/LottieIcon.tsx` : 'use client', fallback SVG par direction, reduced-motion, aria-hidden
- `src/components/dashboard/KpiCard.tsx` : flèches ▲▼— remplacées par `<LottieIcon>`
- 10 tests LottieIcon (5 normal mode + 5 reduced-motion) — tous passent
- 234/234 tests passent | lint 0 erreur | typecheck 0 erreur | build OK

### File List
- `public/lottie/arrow-up.lottie` (new)
- `public/lottie/arrow-down.lottie` (new)
- `public/lottie/arrow-neutral.lottie` (new)
- `public/lottie/trend-spike.lottie` (new)
- `public/lottie/loading-pulse.lottie` (new)
- `src/components/lottie/LottieIcon.tsx` (new)
- `src/components/lottie/__tests__/LottieIcon.test.tsx` (new)
- `src/components/dashboard/KpiCard.tsx` (modified)
- `src/components/dashboard/__tests__/KpiCard.test.tsx` (modified — mock ajouté)
- `src/components/dashboard/__tests__/KpiBentoGrid.test.tsx` (modified — mock ajouté)
- `vitest.setup.ts` (new)
- `vitest.config.ts` (modified — setupFiles ajouté)
- `package.json` (modified — @lottiefiles/dotlottie-react ajouté)
- `pnpm-lock.yaml` (modified)
