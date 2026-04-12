# Story 6.3 : Accessibility audit (Axe + zoom 200%)

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 3
Priority: P0
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** utilisateur en situation de handicap,
**I want** le site soit conforme WCAG 2.1 AA sans aucune issue critique,
**so that** je puisse naviguer et lire le briefing quotidien avec un lecteur d'écran ou à fort zoom.

**Business value :** Conformité WCAG AA = obligation légale en France, et élargit l'audience. Un site finance accessible inspire confiance.

---

## Acceptance Criteria

**AC1 -- Axe DevTools audit programmatique**
- [ ] `@axe-core/react` ajouté en devDependency (dev-only, tree-shaken en prod)
- [ ] Script utilitaire `scripts/a11y-audit.ts` qui lance Axe sur les pages clés
- [ ] Pages auditées : `/fr`, `/fr/coulisses`, `/fr/not-found` (404)
- [ ] Résultat : 0 violations `serious` ou `critical`
- [ ] Violations `moderate` documentées si acceptées (avec justification)

**AC2 -- Focus indicators**
- [ ] Tous les éléments interactifs (boutons, liens, inputs) ont un focus ring visible
- [ ] Focus ring = `ring-2 ring-offset-2 ring-yield-gold` (conforme contrast ratio 3:1)
- [ ] Navigation clavier complète : Tab traverse tous les éléments interactifs dans l'ordre logique
- [ ] Skip-to-content link ajouté en haut de page

**AC3 -- Zoom 200% sans scroll horizontal**
- [ ] Test à 200% zoom navigateur : aucun overflow horizontal sur aucune page
- [ ] Tous les CTA restent cliquables et visibles
- [ ] Le texte reste lisible (pas de troncature)
- [ ] Les grilles (Bento) se réorganisent en colonnes simples

**AC4 -- prefers-reduced-motion validation**
- [ ] Activer `prefers-reduced-motion: reduce` dans le navigateur
- [ ] Toutes les animations Motion 12 : désactivées ou instantanées
- [ ] Aurora Background : statique
- [ ] Meteors : non rendus
- [ ] NumberTicker : valeur affichée directement sans animation
- [ ] Tracing Beam : trait statique
- [ ] Lottie : frame 0 statique

**AC5 -- Semantic HTML & ARIA**
- [ ] Landmarks : `<header>`, `<main>`, `<nav>`, `<footer>` présents
- [ ] Headings : hiérarchie h1 > h2 > h3 sans saut
- [ ] Images/SVG décoratifs : `aria-hidden="true"` ou `role="presentation"`
- [ ] Lottie animations : `aria-label` descriptif ou `aria-hidden` si décoratif
- [ ] Formulaire newsletter : labels associés, `aria-describedby` pour erreurs

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Technical Notes

- `@axe-core/react` ne s'active qu'en dev mode — ne pas l'inclure en prod
- Le script `scripts/a11y-audit.ts` peut utiliser Puppeteer + axe-core pour un audit headless
- Les composants shadcn/ui (Radix) sont déjà accessibles — vérifier qu'on n'a pas cassé leurs props ARIA
- Le skip-to-content link doit être visible au focus uniquement (`sr-only focus:not-sr-only`)

---

## Dependencies

- Story 6.4 (404/500 pages) doit être créée avant l'audit complet
- Sinon aucune dépendance bloquante
