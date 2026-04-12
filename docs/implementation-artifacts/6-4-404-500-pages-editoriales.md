# Story 6.4 : 404 + 500 pages éditoriales

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 2
Priority: P0
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur arrivant sur une URL inexistante ou confronté à une erreur serveur,
**I want** une page 404/500 éditoriale avec l'identité visuelle YieldField,
**so that** je ne sois pas dérouté et que je puisse facilement revenir à la page d'accueil.

**Business value :** Les pages d'erreur sont un moment signature — transformer un échec en impression positive avec le design premium YieldField.

---

## Acceptance Criteria

**AC1 -- Page 404 (not-found.tsx)**
- [ ] `src/app/[locale]/not-found.tsx` créé
- [ ] Background : `BackgroundBoxes` (Aceternity) en mode subtil
- [ ] Illustration : Lottie animation (404 themed, asset `.lottie`)
- [ ] Titre bilingue : "Page introuvable" / "Page not found"
- [ ] Sous-titre avec ton éditorial (pas "Erreur 404" générique)
- [ ] Bouton CTA : retour accueil (`<Link href="/">`)
- [ ] Style shadcn Button variant `default`
- [ ] `prefers-reduced-motion` : Lottie frame 0 statique, BackgroundBoxes statique

**AC2 -- Page 500 (error.tsx)**
- [ ] `src/app/[locale]/error.tsx` créé (client component `'use client'`)
- [ ] Background : `BackgroundBoxes` (Aceternity) variante sombre
- [ ] Illustration : Lottie animation (error/maintenance themed)
- [ ] Titre bilingue : "Quelque chose s'est mal passé" / "Something went wrong"
- [ ] Bouton retry : appelle `reset()` (prop du Error Boundary)
- [ ] Bouton retour accueil
- [ ] `prefers-reduced-motion` respecté

**AC3 -- Traductions i18n**
- [ ] Messages ajoutés dans `messages/fr.json` et `messages/en.json`
- [ ] Clés : `errors.404.title`, `errors.404.subtitle`, `errors.404.cta`
- [ ] Clés : `errors.500.title`, `errors.500.subtitle`, `errors.500.retry`, `errors.500.cta`

**AC4 -- Assets Lottie**
- [ ] Asset `.lottie` 404 ajouté dans `public/lottie/` (< 50 KB)
- [ ] Asset `.lottie` 500/error ajouté dans `public/lottie/` (< 50 KB)
- [ ] Utilise `@lottiefiles/dotlottie-react` (existant dans le projet)
- [ ] `aria-hidden="true"` sur les animations (décoratives)

**AC5 -- Design tokens respectés**
- [ ] Fond : `yield-dark` (#0A0E1A)
- [ ] Texte : conforme au design system
- [ ] Boutons : tokens existants
- [ ] Responsive : mobile-first, pas de scroll horizontal

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : test de rendu pour chaque page
- [ ] `pnpm run build` : 0 erreur
- [ ] Navigation vers `/fr/xyz` affiche la 404

---

## Technical Notes

- `not-found.tsx` dans Next.js 15 App Router est automatiquement affiché pour les routes inexistantes
- `error.tsx` doit être un Client Component (`'use client'`) et reçoit `{ error, reset }` en props
- BackgroundBoxes est déjà installé (Aceternity) — réutiliser l'existant
- Pour les assets Lottie : utiliser des animations libres de droits depuis LottieFiles ou créer des simples
- Le global `not-found.tsx` à la racine de `[locale]` capte toutes les 404 sous cette locale

---

## Dependencies

- BackgroundBoxes (Aceternity) déjà installé Sprint 3
- DotLottie player déjà installé Sprint 4
- next-intl déjà configuré Sprint 1
