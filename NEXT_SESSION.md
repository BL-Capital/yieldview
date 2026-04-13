# NEXT_SESSION — YieldField Sprint 7 : Launch & GTM Execution

**Derniere mise a jour :** 2026-04-13
**Phase BMAD :** Phase 4 Implementation — **Sprint 7 a demarrer**

---

## TL;DR (30 secondes)

- **Epic 1+2+3+4+5+6** DONE — 62 stories, 165 pts, 351 tests, pushed `main`
- **Sprint 6 polish** : heartbeat CTA Coulisses, marquee repositionne, 404/500 pages, root not-found fix
- **Sprint 7** = Epic 7 : Domaine, juridique AMF, soft/hard launch, validation Bryan
- **Commit HEAD** : `a0c1846` (Sprint 6 + polish)
- **Issue GitHub** : #10 ouverte pour Bryan (Sprint 6 delivery)
- Attendre retours Bryan sur Sprint 6 avant de demarrer Sprint 7

---

## Etat du projet

| Epic | Statut | Stories | Points | Commit |
|------|--------|---------|--------|--------|
| 1 Foundation | DONE | 7/7 | 18 | — |
| 2 Data Pipeline | DONE | 14/14 | 39 | — |
| 3 Core UI Dashboard | DONE | 14/14 | 36 | `c3ed47e` |
| 4 Rive Avatar & Coulisses | DONE | 10/10 | 28 | `b4dbe95` |
| 5 Alert Banner, Newsletter | DONE | 10/10 | 28 | `38b2ddf` |
| 6 Quality, A11y, Perf | DONE | 7/7 | 16 | `9e3143a` |
| Polish Sprint 6 | DONE | — | — | `a0c1846` |
| **7 Launch & GTM** | **A FAIRE** | 0/6 | 10 | — |

---

## Sprint 7 — Epic 7 : Launch & GTM Execution

**Objectif** : Soft launch prive, hard launch public, distribution coordonnee.
**Owner** : Bryan (SupraPirox) — sprint principalement non-technique.

### Stories Sprint 7

| # | Story | Pts | Priorite | Owner |
|---|-------|-----|----------|-------|
| 7.1 | Domaine .io + DNS + HTTPS | 2 | P0 | Bryan |
| 7.2 | Revue juridique AMF ponctuelle | 2 | P0 | Bryan |
| 7.3 | Soft launch prive (2 semaines) | 1 | P0 | Bryan + Emmanuel |
| 7.4 | Hard launch coordonne (jour J) | 2 | P0 | Bryan |
| 7.5 | Interviews Marc (validation hypothese) | 2 | P1 | Bryan |
| 7.6 | Issue GitHub de validation globale | 1 | P0 | Emmanuel |

---

## Consignes prochaine session

### Si Bryan a repondu sur Issue #10
1. Lire ses retours et appliquer les corrections demandees
2. Creer les story specs Sprint 7 (bmad-create-story)
3. Story 7.6 : creer l'issue de validation globale avec les 6 livrables BMAD

### Si Bryan n'a pas encore repondu
1. NE PAS relancer Bryan
2. Optionnel — Sprint 6.5 polish si Emmanuel le demande :
   - Remplacer les Lottie placeholders (404-lost.lottie, error-maintenance.lottie) par de vrais assets
   - Ajouter une section "Comment ca marche" en 3 etapes sur la homepage (optionnel)
   - Corriger les toasts hardcodes EN dans code-block.tsx (i18n)
   - Corriger le riskLevel ternary default 'crisis' dans coulisses/page.tsx

### Rappels deferred V1.1
- Story 4.3 (Rive .riv asset) → V1.1
- `@cloudflare/workers-types` → Post-launch
- `next.config.ts` output strategy → Post-launch
- `next/font/google` reseau au build → Post-launch
- Toasts code-block hardcodes EN → V1.1
- Coulisses riskLevel ternary default → V1.1

---

## Points d'attention Sprint 7

- **Story 7.1** : Bryan doit choisir et acheter le domaine (Issue #2 en attente)
- **Story 7.2** : Budget juriste <= 500€ — validation disclaimers AMF
- **Story 7.3** : 10 briefings consecutifs sans couac technique requis
- **Story 7.6** : Creer l'issue de validation globale avec les 6 livrables BMAD

---

## Bryan (SupraPirox)

- Issue #10 ouverte — Sprint 6 delivery
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
- highlight.js tree-shaked (core + 4 langages)
- shadcn/ui Table deja installe
- `@vercel/og` pour OG image generation (Edge Runtime)
- Lighthouse CI active (>= 90 sur 4 categories)
- Playwright e2e tests dans tests/e2e/
- Bundle analyzer via ANALYZE=true pnpm build
- Heartbeat CTA Coulisses avec animation cardiaque (globals.css keyframes)
