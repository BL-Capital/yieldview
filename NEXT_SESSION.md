# NEXT_SESSION — YieldField Sprint 6 : Quality, Accessibility, Performance

**Derniere mise a jour :** 2026-04-12
**Phase BMAD :** Phase 4 Implementation — **Sprint 6 a demarrer**

---

## TL;DR (30 secondes)

- **Epic 1+2+3+4+5** DONE — 55 stories, 149 pts, 349 tests, pushed `main`
- **Sprint 6** = Epic 6 : Lighthouse CI, bundle analyzer, a11y audit, 404/500, analytics, e2e
- **Commit HEAD** : `38b2ddf` (Sprint 5 livre)
- **Issue GitHub** : #9 ouverte pour Bryan (Sprint 5 delivery)
- Attendre retours Bryan sur Sprint 5 avant de demarrer Sprint 6

---

## Etat du projet

| Epic | Statut | Stories | Points | Commit |
|------|--------|---------|--------|--------|
| 1 Foundation | DONE | 7/7 | 18 | — |
| 2 Data Pipeline | DONE | 14/14 | 39 | — |
| 3 Core UI Dashboard | DONE | 14/14 | 36 | `c3ed47e` |
| 4 Rive Avatar & Coulisses | DONE | 10/10 | 28 | `b4dbe95` |
| 5 Alert Banner, Newsletter | DONE | 10/10 | 28 | `38b2ddf` |
| **6 Quality, A11y, Perf** | **A FAIRE** | 0/7 | 16 | — |

---

## Sprint 6 — Epic 6 : Quality, Accessibility, Performance

**Objectif** : Lighthouse CI, bundle analyzer, a11y audit, 404/500 pages, analytics, e2e.
**FRs** : FR50-54
**NFRs** : NFR1-6, NFR15-17, NFR22-23

### Stories Sprint 6

| # | Story | Pts | Priorite |
|---|-------|-----|----------|
| 6.1 | Lighthouse CI config + gates | 3 | P0 |
| 6.2 | Bundle analyzer + optimisations | 3 | P0 |
| 6.3 | Accessibility audit (Axe + zoom 200%) | 3 | P0 |
| 6.4 | 404 + 500 pages editoriales | 2 | P0 |
| 6.5 | Cloudflare Web Analytics integration | 1 | P0 |
| 6.6 | UptimeRobot setup | 1 | P0 |
| 6.7 | Tests e2e Playwright | 3 | P1 |

---

## Workflow Sprint

1. Lire `docs/planning-artifacts/epics.md` — section Epic 6
2. Creer les story specs (`bmad-create-story`) pour chaque story P0
3. Dev batch sequentiel
4. Code review (`bmad-code-review`) — Blind + Edge + Auditor
5. Security audit (`yieldfield-security-audit`) — 4 gates
6. Commit + push + Issue #10 pour Bryan

---

## Points d'attention Sprint 6

- **Story 6.1** : Lighthouse CI — verifier compat Cloudflare Pages (pas Vercel)
- **Story 6.2** : Budget bundle < 280 KB gz — verifier lazy-loading Rive, Lottie, Aceternity
- **Story 6.3** : Axe DevTools — tester homepage + coulisses + newsletter form
- **Story 6.4** : 404/500 pages — Background Boxes (Aceternity) + Lottie + bouton retour

---

## Deferred items

- Story 4.3 (Rive .riv asset) → V1.1
- `@cloudflare/workers-types` → Epic 7
- `next.config.ts` output strategy → Epic 7
- `next/font/google` reseau au build → Epic 7

---

## Bryan (SupraPirox)

- Issue #9 ouverte — attendre retours Sprint 5
- NE PAS relancer Bryan sur les issues en attente

---

## Rappels techniques

- pnpm : `/c/Program Files/nodejs/node_modules/corepack/shims/pnpm.cmd`
- Motion 12 : `motion/react` (PAS `framer-motion`)
- React 19 compatible obligatoire
- `prefers-reduced-motion` sur TOUTES les animations
- next-intl pour i18n (FR/EN)
- `Intl.NumberFormat` pour formatage locale-aware
- `@lottiefiles/dotlottie-react` (PAS `@dotlottie/react-player`)
- highlight.js pour syntax highlighting
- shadcn/ui Table deja installe
- `@vercel/og` pour OG image generation (Edge Runtime)
