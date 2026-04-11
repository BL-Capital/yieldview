---
title: "Epics & Stories: YieldField"
status: "final-draft"
workflowType: "epics-stories"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by Scrum Master, BMAD v6.3.0)"
inputDocuments:
  - "docs/planning-artifacts/product-brief-yieldfield.md"
  - "docs/planning-artifacts/prd.md"
  - "docs/planning-artifacts/architecture.md"
  - "docs/planning-artifacts/ux-design-specification.md"
  - "docs/planning-artifacts/component-catalog.md"
---

# Epics & Stories — YieldField

## Vue d'ensemble

- **Projet :** YieldField (Level 3 BMAD)
- **Total FRs couvertes :** 54/54
- **Total NFRs couvertes :** 23/23
- **Nombre d'epics :** 7
- **Nombre de stories :** 28
- **Estimation totale :** 142 points Fibonacci
- **Cadence :** 4 sprints × 1 semaine (core MVP) + 2 semaines stabilisation
- **Équipe :** Lead dev Emmanuel + Claude Code, PO Bryan

---

## Epic 1 — Foundation & Tooling Setup

**Objectif :** Mettre en place le squelette technique sur lequel tout le reste repose.

**FRs couvertes :** Aucune FR directement, mais prérequis pour FR10-FR20 (pipeline) et FR21-FR29 (homepage).
**NFRs adressées :** NFR5 (Rive < 100KB setup), NFR10-12 (Security foundation), NFR13 (Cost setup), NFR15 (WCAG setup via Radix).
**Sprint target :** Sprint 1 (semaine 1)
**Total points :** 18

### Story 1.1 — Setup Next.js 15 + React 19 + TypeScript (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `npx create-next-app@latest` exécuté avec flags : `--typescript --tailwind --app --src-dir --import-alias "@/*"`
- [ ] Smoke test React 19 : compile sans warnings bloquants
- [ ] `pnpm run dev` fonctionne, page d'accueil Next.js par défaut s'affiche
- [ ] Git repo déjà initialisé (existant) → premier commit du squelette
- [ ] Fallback documenté : si React 19 incompatible avec Rive/Aceternity, basculer Next 14 + React 18

### Story 1.2 — Design tokens Tailwind + Typography self-hosted (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `tailwind.config.ts` enrichi avec tokens YieldField (yield-dark, yield-gold, yield-ink, bull, bear, alert-*)
- [ ] Instrument Serif téléchargée et placée dans `public/fonts/` (self-hosted)
- [ ] Inter variable téléchargée et placée dans `public/fonts/`
- [ ] JetBrains Mono variable téléchargée et placée dans `public/fonts/`
- [ ] `next/font/local` configuré dans `src/app/layout.tsx`
- [ ] Classes `font-serif`, `font-sans`, `font-mono` fonctionnent

### Story 1.3 — shadcn/ui base components (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `npx shadcn@latest init` exécuté avec thème YieldField
- [ ] Composants P0 installés : `button`, `card`, `dialog`, `sheet`, `dropdown-menu`, `tooltip`, `sonner`, `scroll-area`, `separator`, `badge`, `input`, `label`, `form`
- [ ] Radix Primitives sous-jacents fonctionnels (accessibilité WCAG AA par défaut)
- [ ] Smoke test : `<Button variant="default">Test</Button>` rendu correctement

### Story 1.4 — next-intl bilingue FR/EN setup (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `npm install next-intl` installé
- [ ] `src/i18n.ts` configuré avec locales `['fr', 'en']` et default `'fr'`
- [ ] `messages/fr.json` et `messages/en.json` créés avec messages initiaux
- [ ] Middleware next-intl configuré pour routes `/fr/*` et `/en/*`
- [ ] Page de test `/fr/page.tsx` affiche un texte traduit

### Story 1.5 — Layout principal (Header + Footer + LanguageSwitcher) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `<Header>` composant créé avec logo YieldField + navigation + `<LanguageSwitcher>`
- [ ] `<Footer>` composant créé avec disclaimer légal bilingue + links + base du `<NewsletterForm>` (form non fonctionnel encore)
- [ ] `<LanguageSwitcher>` utilise shadcn `<DropdownMenu>` + fonctionne (change locale via `useRouter`)
- [ ] `src/app/[locale]/layout.tsx` inclut Header + Footer
- [ ] Navigation `/fr` ↔ `/en` fonctionne sans breakage

### Story 1.6 — Pre-commit hook de détection de secrets (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Scripts `scripts/pre-commit` et `scripts/setup-hooks.sh` vérifiés (existants dans le repo)
- [ ] `bash scripts/setup-hooks.sh` exécuté
- [ ] Test : commit d'un fichier avec faux secret échoue
- [ ] GitHub secret scanning + push protection activés sur le repo (déjà fait)

### Story 1.7 — GitHub Actions workflow structure (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `.github/workflows/build-check.yml` créé (typecheck + lint + tests unitaires sur chaque PR)
- [ ] `.github/workflows/lighthouse-ci.yml` créé (Lighthouse audit sur main, bloque si < 90)
- [ ] `.github/workflows/daily-pipeline.yml` squelette créé (cron 6h UTC, pas encore actif)
- [ ] Premier PR test déclenche build-check.yml avec succès

---

## Epic 2 — Data Pipeline Backend

**Objectif :** Collecter les données de marché, calculer les dérivés, générer le briefing IA, persister sur R2.

**FRs couvertes :** FR1-FR20 (génération + données + edge cases + archive)
**NFRs adressées :** NFR8 (pipeline reliability ≥ 95%), NFR9 (recovery), NFR10 (secrets)
**Sprint target :** Sprint 2 (semaine 2)
**Total points :** 32

### Story 2.1 — Schemas Zod (Analysis, KPI, Alert) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/lib/schemas/analysis.ts` créé avec `AnalysisSchema` complet (cf. Architecture section 3.2)
- [ ] `src/lib/schemas/kpi.ts` créé avec `KpiSchema`
- [ ] `src/lib/schemas/alert.ts` créé avec `AlertSchema`
- [ ] Tests unitaires Vitest : validation happy path + cas d'erreur
- [ ] Export types TypeScript depuis les schemas (`type Analysis = z.infer<typeof AnalysisSchema>`)

### Story 2.2 — Client Finnhub API (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/lib/finnhub.ts` client créé avec fonctions `fetchIndices()`, `fetchVIX()`, `fetchDXY()`
- [ ] Retry logic 3 tentatives avec backoff exponentiel
- [ ] Clé API lue depuis `process.env.FINNHUB_API_KEY`
- [ ] Tests unitaires avec mock `fetch`

### Story 2.3 — Client FRED API (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/lib/fred.ts` client créé avec fonctions `fetchOAT()`, `fetchBund()`, `fetchUS10Y()`
- [ ] Séries FRED correctes : `IRLTLT01FRM156N` (France 10Y), `IRLTLT01DEM156N` (Germany 10Y), `DGS10` (US 10Y)
- [ ] Tests unitaires

### Story 2.4 — Client Alpha Vantage (marginal, P1) (P1)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/lib/alpha-vantage.ts` client créé (usage marginal, pas critique)
- [ ] Retry désactivé (quota 25/jour trop serré)
- [ ] Commenté dans le pipeline, à activer si besoin

### Story 2.5 — Script `fetch-data.ts` + fallback (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `scripts/pipeline/fetch-data.ts` orchestrant Finnhub + FRED en parallèle
- [ ] Calculs dérivés : spread OAT-Bund, spread Bund-US
- [ ] Fallback : si une API échoue, utiliser dernière valeur valide depuis R2
- [ ] Output JSON validé par Zod avant de continuer
- [ ] Log structuré JSON (timestamps ISO 8601)

### Story 2.6 — Bootstrap VIX 252 jours (one-shot) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `scripts/pipeline/bootstrap-vix-history.ts` créé
- [ ] Fetch 252 derniers jours de VIX via Finnhub
- [ ] Upload vers R2 `vix-history/vix-252d.json`
- [ ] Exécutable en one-shot (`pnpm run bootstrap:vix`)

### Story 2.7 — Script `compute-alert.ts` avec VIX percentile (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `scripts/pipeline/compute-alert.ts` lit VIX current + vix-history/vix-252d.json
- [ ] Calcule le 90e percentile glissant sur 252 jours ouvrés
- [ ] Détermine le niveau d'alerte (none / warning p90 / alert p95 / crisis p99)
- [ ] Met à jour `vix-history/vix-252d.json` avec le nouveau point du jour
- [ ] Retourne un `AlertState` conforme au schema Zod

### Story 2.8 — Client Claude API (Anthropic SDK) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `npm install @anthropic-ai/sdk`
- [ ] `src/lib/claude.ts` client wrapper créé avec 2 fonctions : `generateBriefingFR()` (Opus) + `translateToEN()` (Haiku)
- [ ] Clé API lue depuis `process.env.ANTHROPIC_API_KEY`
- [ ] Monitoring coût : log tokens utilisés par appel
- [ ] Tests avec mocks

### Story 2.9 — Prompt système v01 (Chartiste Lettré) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `prompts/briefing-v01.md` créé avec :
  - Role prompting "You are The Literate Chartist..."
  - 2-3 exemples few-shot de style (Matt Levine-esque)
  - Liste de proscription explicite (no "leverage", no em-dashes, etc.)
  - Instructions de format JSON (briefing + tagline + metadata)
- [ ] `prompts/translation-haiku-v01.md` créé pour la traduction EN

### Story 2.10 — Script `generate-ai.ts` (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `scripts/pipeline/generate-ai.ts` orchestre : Claude Opus FR → Validation Zod → Claude Haiku EN → Validation Zod
- [ ] Prend en input les données market + alert level
- [ ] Output JSON conforme à `AnalysisSchema`
- [ ] Gestion hallucinations : si validation Zod échoue, retry avec prompt enrichi
- [ ] Max 2 retries avant fallback sur version précédente

### Story 2.11 — R2 client + Script `pending-r2.ts` (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `npm install @aws-sdk/client-s3`
- [ ] `src/lib/r2.ts` client wrapper créé (S3-compat vers Cloudflare R2)
- [ ] `scripts/pipeline/pending-r2.ts` upload le JSON généré dans `r2://yieldfield-content/pending.json`
- [ ] Notification : crée un GitHub issue "Briefing pending validation" avec lien vers diff

### Story 2.12 — Script `publish-r2.ts` (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `scripts/pipeline/publish-r2.ts` : si pas d'override en 15 min, copie `pending.json` → `latest.json`
- [ ] Si override manuel détecté : merge manual content + conserve `ai_original`
- [ ] Archive daté dans `r2://yieldfield-content/archive/YYYY-MM-DD.json`
- [ ] Trigger Cloudflare Pages revalidation via webhook

### Story 2.13 — GitHub Actions `daily-pipeline.yml` (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] Workflow cron `0 6 * * 1-5` (6h UTC jours ouvrés)
- [ ] Séquence : fetch-data → compute-alert → generate-ai → pending-r2 → wait 15min → publish-r2 → newsletter → log-run
- [ ] Secrets GitHub Actions configurés (Claude, Finnhub, FRED, R2)
- [ ] Manual trigger `workflow_dispatch` activé
- [ ] Premier run manuel avec succès

### Story 2.14 — Script `log-run.ts` + GitHub Issue auto (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `scripts/pipeline/log-run.ts` append à `r2://yieldfield-content/logs/runs-last-7.json`
- [ ] Garde seulement les 7 derniers runs (rotation)
- [ ] Si 2 runs consécutifs échouent : crée automatiquement une GitHub Issue avec le label "pipeline-failure"

---

## Epic 3 — Core UI Components (Dashboard)

**Objectif :** Construire l'expérience visuelle du hero homepage : Aurora + Avatar + Briefing + Bento KPIs.

**FRs couvertes :** FR21-FR29 (editorial experience homepage), FR15-17 (KPI display)
**NFRs adressées :** NFR1-6 (performance), NFR15-16 (accessibility)
**Sprint target :** Sprint 3 (semaine 3)
**Total points :** 34

### Story 3.1 — Motion 12 install + setup reduced-motion (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `npm install motion`
- [ ] Imports tree-shakeable (`import { motion, AnimatePresence } from 'motion/react'`)
- [ ] Hook `usePrefersReducedMotion` créé dans `src/hooks/`
- [ ] Test : animation respectant `prefers-reduced-motion`

### Story 3.2 — Aceternity Aurora Background + Background Beams (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/aceternity/aurora-background.tsx` copy-pasté depuis ui.aceternity.com
- [ ] `src/components/aceternity/background-beams.tsx` copy-pasté
- [ ] Couleurs adaptées aux design tokens (yield-dark + yield-gold)
- [ ] Composition : Aurora en fond + Beams en overlay 40% opacity
- [ ] Smoke test visuel sur page test

### Story 3.3 — Magic UI Number Ticker (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/components/magic-ui/number-ticker.tsx` installé via `npx magic-ui@latest add number-ticker`
- [ ] Props : `value`, `duration=1500`, `decimalPlaces`
- [ ] Respect `useReducedMotion` : affiche directement la valeur
- [ ] Trigger au viewport-enter (IntersectionObserver)
- [ ] Tests unitaires

### Story 3.4 — Magic UI Animated Gradient Text (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/components/magic-ui/animated-gradient-text.tsx` installé
- [ ] Gradient adapté : `yield-gold → yield-gold-light → yield-gold`
- [ ] Utilisé dans `<TaglineHeader>` (mais composant créé plus tard)

### Story 3.5 — Aceternity Text Generate Effect (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/components/aceternity/text-generate-effect.tsx` copy-pasté
- [ ] Props : `words` (string), `duration`, `filter={false}` (pas de blur)
- [ ] Respect `useReducedMotion` : affiche directement
- [ ] Test : briefing de 4 phrases qui s'affiche mot par mot

### Story 3.6 — Aceternity Bento Grid (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/aceternity/bento-grid.tsx` + `bento-grid-item.tsx` copy-pasté
- [ ] Responsive : 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- [ ] Test : grille de 6 cards dummy rendue

### Story 3.7 — Aceternity Glare Card (hover effect) (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/components/aceternity/glare-card.tsx` copy-pasté
- [ ] Wrapper HOC utilisable autour de n'importe quelle card
- [ ] Effet hover : shimmer qui balaie la card de gauche à droite
- [ ] Désactivé en `prefers-reduced-motion`

### Story 3.8 — Business: `<KpiCard>` (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `src/components/dashboard/KpiCard.tsx` créé
- [ ] Composition : Glare Card (wrapper) + shadcn Card (base) + NumberTicker + LottieIcon + label
- [ ] Reçoit un `KpiData` en prop et affiche tout
- [ ] Tailwind classes : background `yield-dark-elevated`, border `yield-dark-border`, padding 24px
- [ ] Variantes couleur selon direction (bull/bear/neutral)
- [ ] Accessible : `aria-label` descriptif complet

### Story 3.9 — Business: `<KpiBentoGrid>` (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/dashboard/KpiBentoGrid.tsx` créé
- [ ] Reçoit `kpis: KpiData[]` et les distribue dans le Bento layout asymétrique
- [ ] Motion 12 stagger animation à l'entrée (delay progressif de 100ms)
- [ ] Responsive : 3 cols desktop, 2 cols tablet, 1 col mobile

### Story 3.10 — Business: `<BriefingPanel>` + `<TaglineHeader>` + `<MetadataChips>` (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `<TaglineHeader>` avec Animated Gradient Text (Magic UI) + Instrument Serif display-1
- [ ] `<BriefingPanel>` avec Text Generate Effect (Aceternity) + Inter body-lg
- [ ] `<MetadataChips>` avec shadcn Badge + style finance (theme, risk, event)
- [ ] Apparition en cascade via Motion 12 variants
- [ ] Bilingue FR/EN via next-intl useTranslations

### Story 3.11 — Magic UI Ripple (Freshness Indicator) (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/components/magic-ui/ripple.tsx` installé
- [ ] Utilisé dans `<FreshnessIndicator>` avec color variant (vert/jaune/rouge)
- [ ] Affiche "Live · Updated X minutes ago" à côté
- [ ] Couleur conditionnelle selon `freshness_level` du JSON

### Story 3.12 — Content client `r2.ts` (lecture SSR) (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/lib/content.ts` avec fonction `getLatestAnalysis()` 
- [ ] Fetch avec `next: { revalidate: 3600 }` (ISR 1h)
- [ ] Validation Zod du contenu
- [ ] Fallback sur `src/data/fallback-analysis.json` si R2 down
- [ ] Tests unitaires avec mocks

### Story 3.13 — `<HeroSection>` + `src/app/[locale]/page.tsx` (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `<HeroSection>` orchestre : Aurora + Avatar (SVG fallback d'abord) + Tagline + Briefing + MetadataChips + Freshness + BentoGrid
- [ ] `src/app/[locale]/page.tsx` Server Component fetch data + rend `<HeroSection>`
- [ ] Smoke test : page `/fr` affiche tout avec données mockées
- [ ] Smoke test : page `/en` affiche tout traduit

---

## Epic 4 — Rive Avatar & Coulisses Page

**Objectif :** Intégrer l'avatar Rive signature + construire la page Coulisses (Tracing Beam, Prompts, Logs).

**FRs couvertes :** FR21 (Rive avatar), FR30-37 (Coulisses)
**NFRs adressées :** NFR5 (Rive < 100KB), NFR17 (screen reader)
**Sprint target :** Sprint 4 (semaine 4, début stabilisation)
**Total points :** 28

### Story 4.1 — Lottie icons library (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `npm install @dotlottie/react-player`
- [ ] 5 animations P0 téléchargées depuis LottieFiles et placées dans `public/lottie/`
- [ ] `src/components/lottie/LottieIcon.tsx` wrapper créé
- [ ] Lazy-loaded via IntersectionObserver
- [ ] Intégration dans `<KpiCard>` pour les flèches

### Story 4.2 — Rive avatar fallback SVG + setup package (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `npm install @rive-app/react-canvas`
- [ ] `public/rive/avatar-fallback.svg` créé (illustration statique)
- [ ] 4 variantes SVG : `low.svg`, `medium.svg`, `high.svg`, `crisis.svg`
- [ ] `src/components/rive/HeroAvatar.tsx` wrapper avec fallback SVG actif par défaut
- [ ] Smoke test : affichage SVG selon `riskLevel` prop

### Story 4.3 — Rive avatar.riv asset (P1) (P1)
**Points :** 5
**Acceptance criteria :**
- [ ] Fichier `public/rive/avatar.riv` créé (< 120 KB)
- [ ] State machine avec inputs `riskLevel`, `mouseX`, `mouseY`, `clicked`
- [ ] 4 states idle (low/medium/high/crisis) + wake_up + wink
- [ ] Intégration dans `<HeroAvatar>` qui bascule du SVG vers Rive
- [ ] Respect `prefers-reduced-motion` (pose statique)
- [ ] Peut être reporté à V1.1 si timeline serrée (SVG fallback suffisant pour MVP)

### Story 4.4 — Aceternity Tracing Beam (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/aceternity/tracing-beam.tsx` copy-pasté
- [ ] Beam suit le scroll
- [ ] Sections enfants ajoutées comme children
- [ ] Respect `prefers-reduced-motion` (ligne statique)

### Story 4.5 — Magic UI Dot Pattern (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/components/magic-ui/dot-pattern.tsx` installé
- [ ] Utilisé en background de la page Coulisses avec opacity 20%

### Story 4.6 — Aceternity Code Block Animated (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/aceternity/code-block.tsx` copy-pasté
- [ ] Props : `language`, `filename`, `code`, `highlightLines`
- [ ] Copy button avec Magic UI `ShineBorder` au hover
- [ ] Feedback Toast (sonner) "Copied to clipboard"

### Story 4.7 — Magic UI Shine Border (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/components/magic-ui/shine-border.tsx` installé
- [ ] Utilisé sur le copy button des Code Blocks + sur les boutons newsletter + AlertBanner

### Story 4.8 — Business: `<TimelineStep>` + `<PromptCodeBlock>` (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/coulisses/TimelineStep.tsx` créé avec titre, date, description, média slot
- [ ] `src/components/coulisses/PromptCodeBlock.tsx` créé (wrapper autour Aceternity Code Block avec affichage diffs)
- [ ] Motion 12 reveal au scroll
- [ ] Au moins 3 versions de prompts affichables avec navigation pills

### Story 4.9 — Business: `<PipelineLogsTable>` (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/coulisses/PipelineLogsTable.tsx` créé
- [ ] Utilise shadcn `<Table>` + `<ScrollArea>`
- [ ] Chaque row : date, status (avec Pulsating Dot couleur), latency, output filename
- [ ] Fetch `r2://yieldfield-content/logs/runs-last-7.json` via getStaticProps/server component

### Story 4.10 — Content Coulisses : 5+ étapes MDX (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] 5 étapes minimum documentées dans `messages/fr/coulisses.json` et `messages/en/coulisses.json`
- [ ] Étape 1 : Idée originelle
- [ ] Étape 2 : Méthode BMAD
- [ ] Étape 3 : Pipeline nocturne (avec diagram SVG)
- [ ] Étape 4 : Prompts v01→v06 (avec diffs)
- [ ] Étape 5 : Déploiement Cloudflare
- [ ] Option étape 6 : Avatar Rive meta-narrative

### Story 4.11 — `src/app/[locale]/coulisses/page.tsx` (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Page Server Component créée
- [ ] Assemble : Dot Pattern + Tracing Beam + TimelineSteps + PipelineLogsTable
- [ ] Lien depuis hero homepage fonctionnel
- [ ] Responsive sur 3 breakpoints

---

## Epic 5 — Alert Banner, Newsletter, Distribution

**Objectif :** Construire le mode crisis, le formulaire newsletter, les OG images dynamiques, le RSS feed.

**FRs couvertes :** FR17 (alert VIX), FR28 (alert banner UI), FR44-49 (newsletter + OG + RSS)
**NFRs adressées :** NFR1-2 (perf sur OG gen), NFR13 (cost Buttondown free tier)
**Sprint target :** Sprint 5 (semaine 5)
**Total points :** 24

### Story 5.1 — Magic UI Neon Gradient Card + Aceternity Meteors (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/components/magic-ui/neon-gradient-card.tsx` installé
- [ ] `src/components/aceternity/meteors.tsx` copy-pasté
- [ ] Couleurs adaptables : warning=#F59E0B, alert=#DC2626, crisis=#991B1B

### Story 5.2 — Business: `<AlertBanner>` (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `src/components/alerts/AlertBanner.tsx` créé
- [ ] Composition : Neon Gradient Card + Meteors + Shine Border + Content
- [ ] Motion 12 entry : slide from top + spring bounce
- [ ] Props : `level`, `vix`, `percentile`, `triggeredAt`
- [ ] Button "View details →" ouvre `<Dialog>` shadcn avec historique 7j
- [ ] Button "Dismiss" cache temporairement (session)
- [ ] Respect `prefers-reduced-motion` (pas de shake, fade simple)
- [ ] `role="alert"` + `aria-live="assertive"`
- [ ] Escape key dismisses

### Story 5.3 — Business: `<CrisisIndicator>` (P1)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/components/alerts/CrisisIndicator.tsx` créé
- [ ] Version spéciale du KpiCard VIX quand alert active
- [ ] Shine Border rouge permanent
- [ ] Pulsating Dot alert color
- [ ] Tooltip explique le niveau de percentile

### Story 5.4 — Conditional rendering AlertBanner dans HeroSection (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] `<HeroSection>` vérifie `analysis.alert.active` et affiche `<AlertBanner>` si true
- [ ] Push les autres contenus vers le bas sans CLS
- [ ] Test : mock analysis avec alert active → banner visible

### Story 5.5 — Newsletter endpoint `/api/newsletter/subscribe` (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/app/api/newsletter/subscribe/route.ts` créé
- [ ] POST avec `{ email }` → proxy vers Buttondown API
- [ ] Double opt-in activé côté Buttondown
- [ ] Validation email côté serveur
- [ ] Rate limiting simple (IP-based, 3/min)
- [ ] Tests intégration

### Story 5.6 — Business: `<NewsletterForm>` avec shadcn Form (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `src/components/common/NewsletterForm.tsx` créé
- [ ] shadcn Form + Input + Label + Button
- [ ] Magic UI `ShineBorder` sur submit button
- [ ] Validation Zod côté client
- [ ] Feedback Toast Sonner "Thanks! Check your email to confirm"
- [ ] LottieIcon `email-sent.lottie` en success state
- [ ] Bilingue FR/EN
- [ ] Accessible (labels, aria)

### Story 5.7 — OG image dynamique `/api/og/route.tsx` (P0)
**Points :** 5
**Acceptance criteria :**
- [ ] `npm install @vercel/og`
- [ ] `src/app/api/og/route.tsx` Edge Runtime
- [ ] Génère dynamiquement : fond yield-dark + logo + tagline + 1 chiffre clé + snippet briefing + date + signature
- [ ] Query params pour bilingue (`?locale=fr` ou `?locale=en`)
- [ ] Cache 1h via headers
- [ ] Fallback image statique si génération échoue

### Story 5.8 — Meta tags OG + Twitter Card dynamiques (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/app/[locale]/layout.tsx` génère `<meta>` dynamiques
- [ ] `og:image` pointe vers `/api/og?locale={locale}&date={date}`
- [ ] `og:title` = tagline du jour
- [ ] `og:description` = première phrase du briefing
- [ ] Twitter Card `summary_large_image`

### Story 5.9 — RSS feed `/[locale]/feed.xml` (P1)
**Points :** 1
**Acceptance criteria :**
- [ ] `src/app/[locale]/feed.xml/route.ts` créé
- [ ] Génère un RSS 2.0 valide avec le dernier briefing
- [ ] Cache 1h

### Story 5.10 — Newsletter step dans pipeline `newsletter.ts` (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `scripts/pipeline/newsletter.ts` fetch `latest.json` après publication
- [ ] Envoie via Buttondown API à tous les abonnés
- [ ] Log structuré du résultat
- [ ] Retry 3x si échec

---

## Epic 6 — Quality, Accessibility, Performance

**Objectif :** Atteindre les NFRs de performance, accessibilité, observabilité avant le lancement public.

**FRs couvertes :** FR50-54 (observabilité), parts de FR41 (i18n polish)
**NFRs adressées :** NFR1-6 (performance), NFR15-17 (accessibility), NFR22-23 (observability)
**Sprint target :** Semaine 7 (stabilisation)
**Total points :** 16

### Story 6.1 — Lighthouse CI config + gates (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `@lhci/cli` installé
- [ ] `.lighthouserc.json` configuré avec thresholds ≥ 90 sur 4 catégories
- [ ] GitHub Actions `lighthouse-ci.yml` bloque merge si un score < 90
- [ ] Premier audit passe

### Story 6.2 — Bundle analyzer + optimisations (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] `@next/bundle-analyzer` installé et configuré
- [ ] Audit de `pnpm build` → bundle initial < 280 KB gz (budget amplifié)
- [ ] Lazy-loading vérifié pour : HeroAvatar (Rive), AuroraBackground (Aceternity), Lottie icons
- [ ] Tree-shaking Motion 12 confirmé
- [ ] Dynamic imports pour composants non-critiques

### Story 6.3 — Accessibility audit (Axe + NVDA + zoom 200%) (P0)
**Points :** 3
**Acceptance criteria :**
- [ ] Axe DevTools run sur homepage, Coulisses, 404, 500 → 0 serious/critical issues
- [ ] Test manuel NVDA (Windows) : parcours complet homepage → Coulisses → newsletter
- [ ] Test zoom 200% : aucun scroll horizontal, tout reste cliquable
- [ ] Focus indicators visibles sur tous les éléments interactifs
- [ ] Test `prefers-reduced-motion` : toutes animations désactivées

### Story 6.4 — 404 + 500 pages éditoriales (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] `src/app/[locale]/not-found.tsx` créé avec Background Boxes (Aceternity) + Lottie 404 + bouton retour
- [ ] `src/app/[locale]/error.tsx` idem pour 500
- [ ] Style éditorial, bilingue, respect design tokens
- [ ] Pas d'effet générique "error 404"

### Story 6.5 — Cloudflare Web Analytics integration (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Script Cloudflare Web Analytics ajouté dans `src/app/[locale]/layout.tsx`
- [ ] Dashboard Cloudflare affiche les données dans les 24h
- [ ] Validation : pas de cookie, pas de consent banner

### Story 6.6 — UptimeRobot setup (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Compte UptimeRobot créé
- [ ] Monitor configuré sur `https://yieldfield.io` (ou staging URL en attendant domaine)
- [ ] Alert email si downtime > 5 min
- [ ] Status page publique (optionnel)

### Story 6.7 — Tests e2e Playwright (P1) (P1)
**Points :** 3
**Acceptance criteria :**
- [ ] `@playwright/test` installé et configuré
- [ ] `tests/e2e/homepage.spec.ts` : smoke test rendu + NumberTickers + CTA Coulisses
- [ ] `tests/e2e/coulisses.spec.ts` : scroll + Tracing Beam + click Prompt Code Block
- [ ] `tests/e2e/i18n.spec.ts` : switch FR/EN
- [ ] `tests/e2e/accessibility.spec.ts` : audits Axe intégrés

---

## Epic 7 — Launch & GTM Execution

**Objectif :** Soft launch privé, hard launch public, distribution coordonnée.

**FRs couvertes :** Distribution (owner Bryan)
**NFRs adressées :** NFR7 uptime (à valider en prod)
**Sprint target :** Semaine 8 + post-launch weekly
**Total points :** 10

### Story 7.1 — Domaine .io + DNS + HTTPS (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] Issue GitHub #2 résolue par Bryan (nom choisi)
- [ ] Domaine acheté (Namecheap ou Gandi, < 5€/mois)
- [ ] DNS configuré sur Cloudflare
- [ ] HTTPS automatique via Cloudflare
- [ ] Résolution < 200 ms
- [ ] Test depuis 3 régions (FR, EU, US)

### Story 7.2 — Revue juridique AMF ponctuelle (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] Juriste contacté (budget ≤ 500€)
- [ ] Validation des formulations du disclaimer
- [ ] Validation du prompt système (proscription list)
- [ ] Cas limites validés (mode crisis, niveaux de risque)
- [ ] Go légal pour publication publique

### Story 7.3 — Soft launch privé (2 semaines) (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Sous-domaine `staging.yieldfield.io` créé
- [ ] `robots.txt` disallow
- [ ] 10 briefings consécutifs publiés sans couac technique
- [ ] Cartes OG des 10 briefings archivées
- [ ] Bryan publie 3 posts LinkedIn "building in public" (J-10, J-5, J-1)

### Story 7.4 — Hard launch coordonné (jour J) (P0)
**Points :** 2
**Acceptance criteria :**
- [ ] Post LinkedIn long de Bryan publié J 9h CET
- [ ] Thread X de 6 tweets publié
- [ ] Show HN soumis à 15h CET
- [ ] Post r/FinancialCareers + r/FrenchInvest publié
- [ ] Product Hunt planifié J+3
- [ ] Bryan répond à tous les commentaires sous 1h pendant 48h

### Story 7.5 — Interviews Marc (validation hypothèse) (P1)
**Points :** 2
**Acceptance criteria :**
- [ ] 5 analystes juniors contactés via LinkedIn
- [ ] 5 interviews de 20 min réalisées
- [ ] Sondage Twitter/X diffusé
- [ ] Résultat documenté : si ≥ 3/5 confirment le pain, hypothèse Marc validée
- [ ] Si non validée : update du brief, recentrage sur Thomas + Sophie

### Story 7.6 — Issue GitHub de validation globale pour Bryan (P0)
**Points :** 1
**Acceptance criteria :**
- [ ] Issue #3 créée dans BL-Capital/yieldview
- [ ] Liste les 6 livrables BMAD v6.3.0 avec liens (Product Brief, PRD, Architecture, UX Design, Component Catalog, Sprint Plan)
- [ ] Assignée à SupraPirox (Bryan)
- [ ] Bryan valide ou commente dans les 48h
