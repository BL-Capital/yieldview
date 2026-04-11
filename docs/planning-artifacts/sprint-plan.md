---
title: "Sprint Plan: YieldField"
status: "final-draft"
workflowType: "sprint-plan"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (Scrum Master)"
inputDocuments:
  - "docs/planning-artifacts/epics.md"
  - "docs/planning-artifacts/prd.md"
  - "docs/planning-artifacts/architecture.md"
  - "docs/planning-artifacts/ux-design-specification.md"
---

# Sprint Plan — YieldField

## Résumé

- **Project Level :** 3 (Complex)
- **Total stories :** 57
- **Total points :** 142
- **Nombre de sprints :** 5 (4 core + 1 stabilisation) + 1 sprint launch
- **Cadence :** 1 semaine par sprint
- **Équipe :** Lead dev Emmanuel + Claude Code (2-3 points/jour effective capacity)
- **Target completion :** Hard launch public semaine 8

---

## Team capacity calculation

**Lead dev (Emmanuel) avec Claude Code :**
- 5 jours / semaine
- 6h productive / jour
- Velocity estimée : 2-3 points/jour avec Claude Code (= 10-15 points/sprint soit 12 en moyenne stabilisée)
- Premier sprint : 10 points (apprentissage du setup)
- Sprint standard : 13-15 points
- Sprint stabilisation : 10 points (moins de dev, plus d'audits)

**Product Owner (Bryan) :**
- Capacité : validation + orientation + GTM (en parallèle du dev Emmanuel)
- Owner Epic 7 à partir de Sprint 5

**Buffer recommandé :** 15-20% pour imprévus, bugs, apprentissage. Les sprints ne doivent pas dépasser 85% de la capacité théorique.

---

## Sprint 1 (Semaine 1) — Foundation & Tooling

**Goal :** Avoir un squelette Next.js 15 + shadcn/ui + next-intl + design tokens qui affiche une page d'accueil minimale en FR et EN.

**Points :** 18/18 (100% d'Epic 1)
**Epic :** Epic 1 — Foundation & Tooling Setup

### Stories incluses :
- **Story 1.1** — Setup Next.js 15 + React 19 + TypeScript (3 points)
- **Story 1.2** — Design tokens Tailwind + Typography self-hosted (3 points)
- **Story 1.3** — shadcn/ui base components (3 points)
- **Story 1.4** — next-intl bilingue FR/EN setup (3 points)
- **Story 1.5** — Layout principal (Header + Footer + LanguageSwitcher) (3 points)
- **Story 1.6** — Pre-commit hook de détection de secrets (1 point)
- **Story 1.7** — GitHub Actions workflow structure (2 points)

### Risques sprint 1 :
- **R1** : Incompatibilité React 19 avec une lib tierce → fallback Next 14 + React 18 si blocage. Mitigation : smoke test en story 1.1.
- **R2** : Self-hosting fonts complexe si les fichiers Google Fonts ne sont pas directement disponibles. Mitigation : télécharger via `google-webfonts-helper`.

### Definition of Done sprint 1 :
- [ ] Page `/fr` et `/en` affichent un "Hello world" traduit
- [ ] Header + Footer visibles avec LanguageSwitcher fonctionnel
- [ ] Tailwind design tokens configurés et utilisables (`bg-yield-dark`, `text-yield-gold`, etc.)
- [ ] shadcn/ui composants P0 installés et testables (smoke test Button)
- [ ] Pre-commit hook bloque les commits avec secrets
- [ ] CI passe sur une PR test

---

## Sprint 2 (Semaine 2) — Data Pipeline Backend

**Goal :** Pipeline nocturne opérationnel : fetch Finnhub + FRED + compute VIX alert + génération IA bilingue + stockage R2.

**Points :** 32 (total Epic 2)
**Epic :** Epic 2 — Data Pipeline Backend

### Stories incluses :
- **Story 2.1** — Schemas Zod (3 points)
- **Story 2.2** — Client Finnhub API (3 points)
- **Story 2.3** — Client FRED API (2 points)
- **Story 2.4** — Client Alpha Vantage marginal (P1) (1 point)
- **Story 2.5** — Script `fetch-data.ts` + fallback (5 points)
- **Story 2.6** — Bootstrap VIX 252 jours (3 points)
- **Story 2.7** — Script `compute-alert.ts` (3 points)
- **Story 2.8** — Client Claude API (3 points)
- **Story 2.9** — Prompt système v01 Chartiste Lettré (3 points)
- **Story 2.10** — Script `generate-ai.ts` (5 points)
- **Story 2.11** — R2 client + `pending-r2.ts` (2 points)
- **Story 2.12** — Script `publish-r2.ts` (2 points)
- **Story 2.13** — GitHub Actions `daily-pipeline.yml` (2 points)
- **Story 2.14** — Script `log-run.ts` + GitHub Issue auto (2 points)

### ⚠️ Sprint dense — 32 points en 1 semaine

Cette semaine est **ambitieuse** (32 points vs 13-15 typique). Justification :
- Le pipeline est majoritairement du scripting isolé, parallélisable
- Claude Code excelle sur les scripts Node/TypeScript avec schemas clairs
- Les stories sont petites et indépendantes

**Scope de repli possible :** Si Sprint 2 déborde, Story 2.4 (Alpha Vantage) peut être reportée en Epic 5 post-launch sans impact majeur. Story 2.14 (log-run GitHub Issue auto) peut être simplifiée en simple log texte.

### Risques sprint 2 :
- **R1** : Hallucinations Claude sur la structure JSON attendue → fallback sur prompt plus strict + validation Zod retry
- **R2** : Finnhub rate limit hit (60 req/min peut saturer si retries mal configurés) → espacer les calls, cache agressif
- **R3** : Bootstrapping 252 jours de VIX peut prendre du temps → one-shot manuel, pas bloquant

### Definition of Done sprint 2 :
- [ ] Premier run manuel du pipeline (`workflow_dispatch`) réussi
- [ ] `r2://yieldfield-content/latest.json` créé et lisible
- [ ] Briefing FR + EN généré avec voix Chartiste Lettré
- [ ] Alert level calculé correctement
- [ ] Archive et logs persistés

---

## Sprint 3 (Semaine 3) — Core UI (Hero Dashboard)

**Goal :** Hero homepage fonctionnel avec Aurora + (SVG fallback avatar) + Tagline + Briefing + Bento KPIs visibles.

**Points :** 34/34 (100% d'Epic 3)
**Epic :** Epic 3 — Core UI Components (Dashboard)

### Stories incluses :
- **Story 3.1** — Motion 12 install + setup reduced-motion (2 points)
- **Story 3.2** — Aceternity Aurora Background + Beams (3 points)
- **Story 3.3** — Magic UI Number Ticker (2 points)
- **Story 3.4** — Magic UI Animated Gradient Text (1 point)
- **Story 3.5** — Aceternity Text Generate Effect (2 points)
- **Story 3.6** — Aceternity Bento Grid (3 points)
- **Story 3.7** — Aceternity Glare Card (2 points)
- **Story 3.8** — Business: `<KpiCard>` (5 points)
- **Story 3.9** — Business: `<KpiBentoGrid>` (3 points)
- **Story 3.10** — Business: BriefingPanel + TaglineHeader + MetadataChips (5 points)
- **Story 3.11** — Magic UI Ripple / FreshnessIndicator (1 point)
- **Story 3.12** — Content client `r2.ts` SSR (2 points)
- **Story 3.13** — `<HeroSection>` + `page.tsx` (3 points)

### Risques sprint 3 :
- **R1** : Aceternity components client-heavy dégradent LCP → progressive hydration + SSR skeleton + Lighthouse CI bloquant
- **R2** : Bundle size risque d'exploser → lazy-loading strict, tree-shaking Motion 12

### Definition of Done sprint 3 :
- [ ] Page `/fr` et `/en` affichent le hero complet (Aurora + Avatar SVG + Tagline + Briefing + 6 KPIs + Freshness)
- [ ] NumberTickers s'animent au viewport-enter
- [ ] Responsive 3 breakpoints fonctionnels
- [ ] Lighthouse ≥ 85 (cible 90 en stabilisation)

---

## Sprint 4 (Semaine 4) — Rive Avatar & Coulisses Page

**Goal :** Avatar Rive intégré (avec fallback SVG) + page Coulisses complète (Tracing Beam + Prompts + Logs) + Lottie icons sur KPIs.

**Points :** 28 (= 23 P0 + 5 P1 Rive .riv)
**Epic :** Epic 4 — Rive Avatar & Coulisses Page

### Stories incluses (P0 obligatoires) :
- **Story 4.1** — Lottie icons library (2 points)
- **Story 4.2** — Rive avatar fallback SVG + setup (3 points)
- **Story 4.4** — Aceternity Tracing Beam (3 points)
- **Story 4.5** — Magic UI Dot Pattern (1 point)
- **Story 4.6** — Aceternity Code Block Animated (3 points)
- **Story 4.7** — Magic UI Shine Border (1 point)
- **Story 4.8** — Business: TimelineStep + PromptCodeBlock (3 points)
- **Story 4.9** — Business: PipelineLogsTable (3 points)
- **Story 4.10** — Content Coulisses 5+ étapes MDX (3 points)
- **Story 4.11** — `page.tsx` Coulisses (1 point)

**Total P0 :** 23 points

### Stories P1 (si capacity disponible) :
- **Story 4.3** — Rive avatar.riv asset (5 points) — **peut être reportée V1.1**

### Risques sprint 4 :
- **R1** : Création de l'avatar Rive réel prend plus de temps que prévu → SVG statique reste actif, Rive reporté V1.1
- **R2** : Tracing Beam Aceternity complexe à intégrer avec scroll → fallback timeline statique si issue

### Definition of Done sprint 4 :
- [ ] Page Coulisses rendue avec 5+ étapes, Tracing Beam fonctionnel
- [ ] Prompts v01-v06 visibles dans CodeBlocks avec copy button
- [ ] Pipeline logs table alimentée depuis R2
- [ ] LottieIcons sur KPI arrows fonctionnels
- [ ] Rive avatar OU fallback SVG actif (pas blocking)

---

## Sprint 5 (Semaine 5) — Alerts, Newsletter, Distribution

**Goal :** AlertBanner crisis mode + Newsletter form + OG images dynamiques + RSS feed opérationnels.

**Points :** 24/24 (100% d'Epic 5)
**Epic :** Epic 5 — Alert Banner, Newsletter, Distribution

### Stories incluses :
- **Story 5.1** — Neon Gradient Card + Meteors (2 points)
- **Story 5.2** — `<AlertBanner>` (5 points)
- **Story 5.3** — `<CrisisIndicator>` (2 points)
- **Story 5.4** — Conditional rendering AlertBanner (1 point)
- **Story 5.5** — Newsletter endpoint `/api/newsletter/subscribe` (3 points)
- **Story 5.6** — `<NewsletterForm>` avec shadcn Form (3 points)
- **Story 5.7** — OG image dynamique `/api/og` (5 points)
- **Story 5.8** — Meta tags OG + Twitter Card (2 points)
- **Story 5.9** — RSS feed (1 point) — P1
- **Story 5.10** — Newsletter step dans pipeline (2 points)

### Risques sprint 5 :
- **R1** : OG image Edge Runtime + @vercel/og peut avoir des gotchas → test early, fallback statique
- **R2** : Buttondown API rate limit sur envois bulk → batch + retry

### Definition of Done sprint 5 :
- [ ] AlertBanner s'affiche conditionnellement en mode crisis
- [ ] Newsletter form fonctionnel (subscribe + confirmation email)
- [ ] Partage LinkedIn/Twitter affiche une OG image dynamique du jour
- [ ] Pipeline envoie le briefing aux abonnés newsletter

---

## Sprint 6 (Semaine 6-7) — Stabilisation Quality

**Goal :** Atteindre Lighthouse ≥ 90, WCAG AA, bundle < 280 KB, tests e2e passants. Polish tout.

**Points :** 16/16 (100% d'Epic 6)
**Epic :** Epic 6 — Quality, Accessibility, Performance

### Stories incluses :
- **Story 6.1** — Lighthouse CI config + gates (3 points)
- **Story 6.2** — Bundle analyzer + optimisations (3 points)
- **Story 6.3** — Accessibility audit Axe + NVDA + zoom (3 points)
- **Story 6.4** — 404 + 500 pages éditoriales (2 points)
- **Story 6.5** — Cloudflare Web Analytics (1 point)
- **Story 6.6** — UptimeRobot setup (1 point)
- **Story 6.7** — Tests e2e Playwright (3 points) — P1

### Risques sprint 6 :
- **R1** : Lighthouse < 90 malgré optimisations → réduire scope visuel (sacrifier certains effets)
- **R2** : Accessibilité issues bloquantes → prioriser résolution, reporter autres stories

### Definition of Done sprint 6 :
- [ ] Lighthouse ≥ 90 sur 4 catégories (CI bloquant)
- [ ] Bundle initial < 280 KB gzipped
- [ ] 0 serious/critical Axe issues
- [ ] Navigation clavier complète
- [ ] Tests e2e Playwright passent sur homepage + Coulisses
- [ ] Analytics + Uptime actifs
- [ ] Pages 404 + 500 éditoriales rendues

---

## Sprint 7 (Semaine 8) — Launch & GTM

**Goal :** Hard launch public. Distribution coordonnée. Validation hypothèse Marc.

**Points :** 10/10 (100% d'Epic 7)
**Epic :** Epic 7 — Launch & GTM Execution
**Owner principal :** Bryan (Product Owner)

### Stories incluses :
- **Story 7.1** — Domaine .io + DNS + HTTPS (2 points) — owner Bryan
- **Story 7.2** — Revue juridique AMF ponctuelle (2 points) — owner Emmanuel
- **Story 7.3** — Soft launch privé 2 semaines (1 point) — shared (cette étape commence en semaine 6, exécution sur 7-8)
- **Story 7.4** — Hard launch coordonné (2 points) — owner Bryan
- **Story 7.5** — Interviews Marc (2 points) — owner Bryan (en parallèle)
- **Story 7.6** — Issue GitHub validation globale Bryan (1 point) — owner Emmanuel

### Risques sprint 7 :
- **R1** : Domaine .io indisponible → fallback yieldview.com ou autre TLD
- **R2** : Juriste non disponible à temps → report hard launch semaine 9
- **R3** : Soft launch révèle bugs bloquants → hotfix + report hard launch

### Definition of Done sprint 7 :
- [ ] Site live sur domaine .io
- [ ] Disclaimer validé juridiquement
- [ ] 10 briefings consécutifs publiés en soft launch sans couac
- [ ] Hard launch exécuté (LinkedIn + Show HN + Reddit + Product Hunt)
- [ ] Interviews Marc démarrées
- [ ] Issue GitHub de validation créée pour Bryan

---

## Traceability Matrix — FR → Story → Sprint

### Epic 1 — Foundation
| FR | Story | Sprint |
|---|---|---|
| (prerequisite) | 1.1-1.7 | 1 |

### Epic 2 — Data Pipeline
| FR | Story | Sprint |
|---|---|---|
| FR1, FR2, FR3, FR4 | 2.10 (generate-ai) | 2 |
| FR5, FR6, FR7 | 2.11, 2.12 (pending + publish) | 2 |
| FR8 | 2.7 (compute-alert) | 2 |
| FR9, FR10, FR11, FR12 | 2.2, 2.3, 2.4, 2.5 (clients + fetch) | 2 |
| FR13 | 2.5 (calcul dérivés) | 2 |
| FR14 | 2.7 (percentile VIX) | 2 |
| FR18, FR19 | 2.5 (fallback gracieux) | 2 |
| FR20 | 2.12 (archive) | 2 |

### Epic 3 — Core UI
| FR | Story | Sprint |
|---|---|---|
| FR15 | 3.9 (BentoGrid) | 3 |
| FR16 | 3.8 (KpiCard) | 3 |
| FR17 | 3.11 (Freshness) | 3 |
| FR21 | 4.2, 4.3 (Avatar) | 4 |
| FR22 | 3.10 (TaglineHeader) | 3 |
| FR23 | 3.10 (BriefingPanel) | 3 |
| FR24 | 3.10 (MetadataChips) | 3 |
| FR25 | 3.3 (NumberTicker) | 3 |
| FR26 | 3.11 (Pulsating Dot) | 3 |
| FR27 | Story from Epic 5 (Marquee) | 3-5 |
| FR29 | 3.10 (Disclaimer in Briefing) | 3 |

### Epic 4 — Coulisses
| FR | Story | Sprint |
|---|---|---|
| FR30 | 3.13 (CTA hero) | 3 |
| FR31 | 4.4 (Tracing Beam) | 4 |
| FR32 | 4.10 (5+ étapes) | 4 |
| FR33 | 4.8 (PromptCodeBlock diff) | 4 |
| FR34 | 4.6, 4.8 (Copy button) | 4 |
| FR35 | 4.9 (PipelineLogsTable) | 4 |
| FR36 | 4.2, 4.3 (Rive preview) | 4 |
| FR37 | 4.10 (diagram dans MDX) | 4 |

### Epic 5 — Distribution
| FR | Story | Sprint |
|---|---|---|
| FR28 | 5.2 (AlertBanner) | 5 |
| FR44 | 5.5, 5.6 (Newsletter subscribe) | 5 |
| FR45 | 5.10 (Newsletter pipeline step) | 5 |
| FR46 | 5.5 (double opt-in Buttondown) | 5 |
| FR47 | 5.7, 5.8 (OG dynamic) | 5 |
| FR48 | 5.8 (Twitter Card) | 5 |
| FR49 | 5.9 (RSS) | 5 |

### Epic 6 — Observability & Quality
| FR | Story | Sprint |
|---|---|---|
| FR50 | 6.6 (UptimeRobot) | 6 |
| FR51 | 2.14 (log-run) + 6.7 (e2e tests) | 2, 6 |
| FR52 | 6.5 (Cloudflare Analytics) | 6 |
| FR53 | 2.14 (GitHub Issue auto) | 2 |
| FR54 | 2.5 (retry in fetch-data) | 2 |

### FRs UI global
| FR | Story | Sprint |
|---|---|---|
| FR38, FR39, FR40, FR41, FR42 | 1.4, 1.5 (next-intl setup) | 1 |
| FR43 | 1.5 (header nav) | 1 |

**Coverage :** 54/54 FRs mappées ✅

---

## Validation & dependencies

### Dependencies cross-sprints
- **Sprint 2 dépend de Sprint 1** : schemas Zod nécessitent TypeScript setup
- **Sprint 3 dépend de Sprint 1 + 2** : affichage UI a besoin des données
- **Sprint 4 dépend de Sprint 3** : Coulisses réutilise des composants du hero
- **Sprint 5 dépend de Sprint 2** : newsletter pipeline step dépend du pipeline nocturne
- **Sprint 6 dépend de Tous** : stabilisation vient après le feature work
- **Sprint 7 dépend de Sprint 6** : launch requiert quality validée

### Parallélisable
- Sprint 2 (backend) peut partiellement chevaucher Sprint 3 (frontend) si Bryan dispose
- Sprint 5 peut commencer pendant Sprint 4 pour les stories indépendantes (OG, RSS)
- Sprint 7 story 7.3 (soft launch) démarre en semaine 6

### Parcours critique
Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 6 → Sprint 7

Sprint 5 peut se dérouler partiellement en parallèle.

---

## Definition of Done global (le projet est "done" quand)

- [ ] Site live sur domaine .io
- [ ] Pipeline nocturne succès ≥ 95 % sur 7 jours glissants
- [ ] Briefing publié avant 8h30 CET 100 % des jours ouvrés semaine 1
- [ ] Lighthouse ≥ 90 sur 4 catégories
- [ ] Bilingue FR/EN 100 %
- [ ] Page Coulisses avec ≥ 5 étapes + ≥ 3 prompts
- [ ] Fallback testé
- [ ] Disclaimer légal validé juridiquement
- [ ] 0 clé API dans le code
- [ ] README GitHub présentable
- [ ] Revue BMAD par un tiers (Bryan valide)
- [ ] Newsletter fonctionnelle avec ≥ 1 abonnement test
- [ ] OG images dynamiques fonctionnelles
- [ ] Analytics actifs
- [ ] Hypothèse Marc validée ou déclassée

---

## Next steps post-sprint plan

1. **Commit du sprint plan** dans le repo
2. **Création du sprint-status.yaml** (suivi opérationnel)
3. **Issue GitHub de validation** pour Bryan (Story 7.6)
4. **Démarrage Sprint 1** dès validation Bryan (ou immédiat si timeline serrée)
5. **Sprint reviews hebdomadaires** (vendredi 17h) pour ajuster

---

*Document généré via BMAD v6.3.0 workflow `bmad-sprint-planning` avec les 7 epics de `epics.md` en input.*
*Scrum Master facilitateur : Claude (Opus 4.6 avec contexte 1M).*
