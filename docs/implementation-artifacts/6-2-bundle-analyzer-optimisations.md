# Story 6.2 : Bundle analyzer + optimisations

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 3
Priority: P0
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** développeur soucieux de la performance,
**I want** un bundle analyzer configuré et des optimisations appliquées pour respecter le budget < 280 KB gz,
**so that** le site charge en < 2s sur 4G et reste fluide sur mobile.

**Business value :** Un site finance qui charge lentement est perçu comme peu fiable. Le budget 280 KB gz garantit un LCP < 2.5s même sur connexions moyennes.

---

## Acceptance Criteria

**AC1 -- @next/bundle-analyzer installé**
- [ ] `@next/bundle-analyzer` ajouté en devDependency
- [ ] `next.config.ts` wrappé avec `withBundleAnalyzer` conditionnel sur `ANALYZE=true`
- [ ] Script `"analyze"` ajouté : `ANALYZE=true pnpm build`
- [ ] Rapport HTML généré dans `.next/analyze/`

**AC2 -- Audit bundle initial**
- [ ] Lancer `pnpm run analyze`
- [ ] Documenter la taille totale gz du first-load JS
- [ ] Identifier les top 5 contributors au bundle size
- [ ] Target : first-load JS < 280 KB gz

**AC3 -- Lazy-loading composants lourds**
- [ ] `HeroAvatar` (Rive runtime) : `next/dynamic` avec `ssr: false`
- [ ] `AuroraBackground` (Aceternity) : `next/dynamic` avec `ssr: false`
- [ ] Composants Lottie : `next/dynamic` avec `ssr: false`
- [ ] `TracingBeam` (page Coulisses) : `next/dynamic` avec `ssr: false`
- [ ] Vérifier que le runtime Rive n'est chargé qu'au premier usage

**AC4 -- Tree-shaking vérifié**
- [ ] Motion 12 : import uniquement `motion/react` (pas le bundle complet)
- [ ] Vérifier que seuls les composants utilisés de shadcn sont bundlés
- [ ] `highlight.js` : import uniquement les langages nécessaires (js, json, bash)

**AC5 -- Dynamic imports non-critiques**
- [ ] Composants below-the-fold : chargés via `next/dynamic`
- [ ] `PipelineLogsTable` : dynamique (visible uniquement sur Coulisses scroll)
- [ ] `NewsletterForm` : dynamique (footer, hors viewport initial)

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent (imports modifiés ne cassent pas les tests)
- [ ] `pnpm run build` : 0 erreur
- [ ] First-load JS < 280 KB gz confirmé

---

## Technical Notes

- `next/dynamic` avec `{ ssr: false }` est la méthode standard Next.js pour lazy-loading client-only
- Le wrapping `withBundleAnalyzer` ne doit pas affecter le build normal (conditionnel `ANALYZE`)
- Attention : si un composant est déjà importé statiquement dans un layout, le dynamic import n'apporte rien
- Vérifier que les animations dégradent gracieusement quand le composant est en loading (skeleton ou fade-in)

---

## Dependencies

- Aucune dependency de story
- Requires : tous les composants Sprint 1-5 en place
