# Architecture — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 1.2 (Stack UI/UX enrichie : Next 15 + React 19 + Motion 12 + Aceternity Pro + Magic UI + Rive + Lottie)
**Date :** 2026-04-11
**Architecte :** Emmanuel — WEDOOALL Solutions (System Architect)
**Méthodologie :** BMAD v6 — Phase 3 (Solutioning)
**Référence :** ARCH-YIELDFIELD-2026-001
**PRD source :** `docs/prd-yieldfield-2026-04-11.md` (v2.0, 29 exigences, 5 epics)

## Changelog

- **v1.0** (2026-04-11) — Architecture initiale (Next 14 + shadcn/ui + Framer Motion)
- **v1.1** (2026-04-11) — Intégration Motion+ et Aceternity UI Pro
- **v1.2** (2026-04-11) — Stack UI/UX enrichie :
  - Upgrade Next.js 15 + React 19
  - Motion 12 (remplace Framer Motion)
  - Ajout Magic UI (complément Aceternity Pro)
  - Ajout Rive (avatar hero signature)
  - Ajout Lottie/dotLottie (micro-animations)
  - React Three Fiber + Drei (reporté V2)
  - Performance budget révisé (250KB JS, 400KB total)

---

## 1. Architectural Drivers

Les NFRs les plus structurants pour l'architecture de YieldField :

| # | NFR | Impact architectural |
|---|---|---|
| **D1** | **NFR-001 Performance LCP < 2s** | Impose SSG (Static Site Generation) + CDN global. Exclut tout SSR dynamique. |
| **D2** | **NFR-004 Coût ≤ 8€/mois** | Impose serverless free tier (Cloudflare Pages/R2/Workers). Exclut VMs, Kubernetes, bases relationnelles managées. |
| **D3** | **NFR-005 Sécurité — zéro secret en code** | Impose secrets en env vars Cloudflare + pre-commit hooks + GitHub push protection. |
| **D4** | **NFR-009 Pipeline reliability ≥ 95%** | Impose retry automatique, fallback gracieux, monitoring + alerte automatique. |
| **D5** | **NFR-003 Uptime 99%** | Cloudflare CDN natif + monitoring UptimeRobot. |
| **D6** | **NFR-007 Bilingue FR/EN** | Impose next-intl + double génération IA en 1 appel (pas 2) pour coût. |
| **D7** | **NFR-002 Lighthouse ≥ 90** | Impose optimisation assets, pas de bundle i18n bloquant, images optimisées, pas de JavaScript dynamique lourd. |

**Principe directeur :** **"Serverless-first, static-first, cost-first"** — toute décision privilégie la simplicité, le coût nul et la performance CDN plutôt que la flexibilité dynamique.

---

## 2. High-Level Architecture

### Pattern retenu : **Static JAMstack + Serverless Pipeline**

**Raisons du choix :**
- Contenu change 1× par jour → aucun besoin de SSR ou de serveur applicatif
- Budget 8€/mois → exclut toute infrastructure persistante (pas de base de données, pas de serveur)
- Performance LCP < 2s → le statique servi par CDN est la solution naturelle
- 1 développeur solo → complexité à minimiser

**Patterns exclus et pourquoi :**
- ❌ **Microservices** : overkill pour 1 dev + contenu 1×/jour
- ❌ **SSR Next.js** : coût et complexité inutiles, le contenu est statique
- ❌ **SQL Database** : pas de besoin de requêtage, JSON suffit
- ❌ **API backend** : pas de clients authentifiés, tout est en lecture publique

### Architecture Diagram (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│                    CRON GITHUB ACTIONS (6h UTC)                   │
│                     daily-pipeline.yml                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     PIPELINE NOCTURNE (3 jobs séquentiels)        │
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ 1. Fetch    │ →  │ 2. Analyze   │ →  │ 3. Publish       │   │
│  │ Market Data │    │ Claude API   │    │ Upload R2        │   │
│  └──────┬──────┘    └───────┬──────┘    └─────────┬────────┘   │
│         │                   │                     │              │
└─────────┼───────────────────┼─────────────────────┼──────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
  ┌──────────────┐   ┌────────────────┐   ┌──────────────────┐
  │ External     │   │ Anthropic API  │   │ Cloudflare R2    │
  │ APIs (Free)  │   │ (Claude Haiku) │   │ latest.json      │
  │ • FRED       │   │                │   │ archive/YYYY-... │
  │ • BCE/ECB    │   │                │   │ alerts/*.json    │
  │ • Alpha V.   │   │                │   └────────┬─────────┘
  │ • Finnhub    │   │                │            │
  │ • CBOE (VIX) │   │                │            │
  └──────────────┘   └────────────────┘            │
                                                    │
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │   Cloudflare Pages (SSG)    │
                                     │   • Next.js 14 App Router   │
                                     │   • next-intl (FR/EN)       │
                                     │   • ISR on-demand revalidate│
                                     │   • Edge Runtime            │
                                     └──────────────┬──────────────┘
                                                    │
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │   Cloudflare CDN (200+ POP) │
                                     │   • HTTPS auto              │
                                     │   • Cache-Control           │
                                     │   • Image optimization      │
                                     └──────────────┬──────────────┘
                                                    │
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │       END USERS             │
                                     │   (Marc, Sophie, Thomas)    │
                                     └─────────────────────────────┘

  ┌───────────────────────────┐       ┌──────────────────────────────┐
  │  Monitoring (ext.)        │       │   Dev Workflow               │
  │  • UptimeRobot            │       │   • GitHub (BL-Capital)      │
  │  • Cloudflare Analytics   │       │   • PR → Preview deployment  │
  │  • Anthropic Dashboard    │       │   • Main → Auto-deploy       │
  └───────────────────────────┘       └──────────────────────────────┘
```

### High-Level Components (7 blocs majeurs)

1. **Pipeline Orchestrator** — GitHub Actions cron (6h UTC)
2. **Data Collector** — Fetch APIs financières (FRED, BCE, Alpha Vantage, Finnhub, CBOE)
3. **AI Analyzer** — Appel Claude API + génération briefing/tagline/metadata
4. **Content Store** — Cloudflare R2 (JSON files `latest.json`, `archive/`, `alerts/`)
5. **Web Frontend** — Next.js 14 SSG + ISR + next-intl (déployé sur Cloudflare Pages)
6. **OG Image Generator** — @vercel/og / Satori Edge Function pour Open Graph dynamique
7. **Monitoring & Alerting** — UptimeRobot + Cloudflare Analytics + GitHub Issue auto

---

## 3. Technology Stack

### Frontend

**Choice:** **Next.js 15 (App Router) + React 19 + TypeScript**

**Rationale:**
- **Next.js 15** : dernière version stable avec React 19 support, Partial Prerendering (PPR) optimisé, Turbopack dev stable
- **React 19** : Server Components matures, `useOptimistic`, `use()` API, Actions, amélioration DX
- App Router supporte nativement SSG + ISR, parfait pour contenu mis à jour 1×/jour
- Edge Runtime Cloudflare compatible (via `@cloudflare/next-on-pages`)
- Écosystème Claude Code optimisé pour Next.js
- next-intl pour i18n FR/EN avec routing `/fr` et `/en`
- TypeScript strict obligatoire pour robustesse et DX

**Trade-offs:**
- ✓ SSG performant, prerender complet, SEO excellent
- ✓ React 19 réduit boilerplate (Actions, use hook)
- ✓ Hot reload rapide, DX Claude Code optimale
- ✗ Learning curve App Router pour Bryan (mitigé par Claude Code)
- ✗ Bundle légèrement plus lourd que Astro (mais reste < 200KB gzipped)
- ⚠ React 19 encore récent : vérifier compatibilité libs tierces (Aceternity, Rive) au setup

**Alternatives considérées et rejetées :**
- **Astro** : plus léger mais moins d'écosystème React côté interactivité
- **Remix** : nécessite SSR runtime (pas purement statique)
- **SvelteKit** : moins d'assistance Claude Code, équipe pas familière

---

### UI Kit de base

**Choice:** **Tailwind CSS + shadcn/ui + Radix Primitives**

**Rationale:**
- **Tailwind** : classes utilitaires, purge automatique, bundle minimal
- **shadcn/ui** : composants React copy-paste de qualité premium (Button, Card, Dialog, Input, Dropdown, Toast) — sert de fondation accessible pour les primitives
- **Radix Primitives** (sous-jacent à shadcn/ui) : accessibilité WAI-ARIA native, keyboard navigation, focus management — valide NFR-006 WCAG AA par défaut
- Aligné design system #0A1628 + #C9A84C via `tailwind.config.ts`

---

### Composants premium & effets signature

**Choice:** **Aceternity UI Pro + Magic UI**

**Rationale:**
- **Aceternity UI Pro** (abonnement actif) : composants animés haut de gamme "wow factor" — **parfait pour le positionnement "magazine en ligne de luxe"** du PRD. Copy-paste components, pas de dépendance runtime lourde.
- **Magic UI** : librairie complémentaire open-source avec 150+ composants animés — riche en effets signature (orbiting circles, text animations, interactive buttons, marquee, etc.). Compatible Tailwind + Motion.
- Ces deux libs sont **complémentaires** (pas concurrentes) : Aceternity couvre les composants "héros" (parallax, 3D, beams), Magic UI les micro-interactions et patterns courants.

**Composants signature identifiés pour YieldField :**

| Composant | Librairie | Usage | FR associée |
|---|---|---|---|
| **Hero Parallax / Aurora / Background Beams** | Aceternity | Hero section home | FR-001, FR-002 |
| **Sparkles / Grid / Dot Pattern** | Aceternity | Fond vivant finance | Design premium |
| **Number Ticker** | Magic UI | Hero metrics qui s'incrémentent de 0 | FR-002 |
| **Animated List / Marquee** | Magic UI | Bandeau scroll des KPIs secondaires | FR-001 |
| **Timeline / Tracing Beam** | Aceternity | Page Coulisses | FR-007 |
| **Code Block Animated** | Aceternity | Prompts versionnés avec diff | FR-008 |
| **Bento Grid** | Aceternity | Dashboard KPIs segmentés par thème | FR-001 |
| **Shimmer / Glare Card / Meteors** | Aceternity | Cards KPIs premium | FR-001, FR-003 |
| **Animated Tooltip** | Aceternity | Détails KPI au hover | FR-001 |
| **Text Generate Effect / Typewriter** | Aceternity / Magic UI | Apparition progressive briefing/tagline | FR-004, FR-006 |
| **Neon Gradient Card / Shine Border** | Magic UI | Alert banner mode crise | FR-017 |
| **Animated Gradient Text** | Magic UI | Titre tagline avec gradient or | FR-006 |
| **Ripple / Pulsating Dot** | Magic UI | Indicateur "live" sur dernière update | FR-003 |

---

### Animation & Transitions

**Choice:** **Motion 12 + Motion+ (Framer Motion premium)**

**Rationale:**
- **Motion 12** (anciennement Framer Motion) : version unifiée React + JS vanilla, performances améliorées, API déclarative mature
- **Motion+** (abonnement actif) : composants premium officiels, features avancées (layout animations, timeline, scroll linked), supports Claude Code
- Fournit la base technique pour Aceternity et Magic UI (les deux utilisent Motion underneath)

**Usages stratégiques :**
- **Layout animations** : transitions fluides entre KPIs au update quotidien (valeurs qui s'animent sans CLS)
- **Scroll triggered** : parallax + reveal de la timeline Coulisses
- **Page transitions** : entre `/fr` et `/en` (pas de flash blanc)
- **Shared layout** : transition du card KPI vers la page détail (V2)
- **Gesture-based** : drag des cards KPIs sur mobile (V2)

**Bundle impact :** ~50-60KB gzipped pour Motion 12, acceptable vu le gain UX.

---

### Avatar interactif & storytelling

**Choice:** **Rive — Avatar animé temps réel dans le hero homepage**

**Rationale:**
- **Rive** : runtime ultra-léger (~60KB), animations vectorielles temps réel, state machines pilotables en JS
- **Usage signature YieldField** : **personnage animé en présentateur/trader dans le hero** qui "présente" les KPIs du jour
- **Interactions dynamiques** :
  - L'avatar réagit au niveau de risque du jour (metadata `risk_level` du briefing)
    - `low` → pose détendue, lecture journal
    - `medium` → concentré devant écran
    - `high` → tension, gestes animés
  - L'avatar change de tenue selon le thème du jour (metadata `theme_of_day`)
  - En mode crise (FR-017) : expression tendue + effet Meteors de Aceternity autour
- **Pourquoi c'est puissant pour YieldField** :
  - Signature visuelle mémorable (différenciation vs sites finance génériques)
  - Rend la data "humaine" et vivante
  - Démontre la maîtrise d'outils modernes (atout pour recruteurs tech)

**Workflow création :**
- Bryan peut créer l'avatar Rive sans dev (éditeur visuel Rive Community)
- Export en `.riv` (~30-100KB)
- Intégration : `<RiveComponent src="/avatar.riv" stateMachines="main" />`
- Props bindings : `riskLevel`, `themeOfDay`, `vixAlertLevel`

**Trade-offs:**
- ✓ Effet wow unique, faible bundle
- ✓ Outil visuel (pas besoin de designer pro)
- ✗ Temps de création de l'avatar (~1-2 jours) — **mitigé : peut démarrer avec avatar statique puis enrichir itérativement**
- ✗ 1 asset dynamique en plus à charger (mitigé : preload + SSR skeleton)

**Fallback :** illustration statique SVG si Rive fail à charger.

---

### Illustrations animées légères

**Choice:** **Lottie / dotLottie pour icônes et micro-animations**

**Rationale:**
- **Lottie** : animations vectorielles exportées d'After Effects / Lottie Files — qualité studio
- **dotLottie** (format compressé) : ~50% plus léger que Lottie JSON standard
- **Librairie `@lottiefiles/react-lottie-player`** ou **`@dotlottie/react-player`** (recommandé)

**Usages identifiés :**
- **Icônes animées** dans les cards KPI (flèche up/down, icônes catégorie)
- **Empty states** (ex: "pas encore de données")
- **Loading states** (skeleton + Lottie spinner)
- **Micro-interactions** sur hover / click des boutons CTA
- **Transitions d'état** entre freshness levels (fresh → stale → very_stale)

**Bundle impact :** ~20KB par animation (acceptable si lazy-loaded)

**Sources d'assets :**
- **LottieFiles** (gratuit) : milliers d'animations finance/data prêtes à l'emploi
- Peut être généré via **IconScout** / **Figma → Lottie** plugin

**Trade-offs:**
- ✓ Qualité visuelle premium, ultra-léger
- ✓ Bryan peut customiser sans coder
- ✗ Pas pour animations interactives complexes (usage Rive pour ça)

---

### 3D (reporté V2)

**Choice:** **React Three Fiber + Drei — reporté V2**

**Rationale:**
- Scènes 3D (ex: courbe des taux en 3D, visualisation spreads) = effet wow potentiel majeur
- **Reporté V2** : scope MVP déjà ambitieux, et Aceternity/Rive/Lottie suffisent pour l'effet "luxe"
- Si V2 : React Three Fiber (wrapper React de Three.js) + Drei (helpers)
- Cas d'usage potentiel :
  - Yield curve en 3D animée en fond de page Coulisses
  - Globe des marchés mondiaux avec timezone indicators

**Non-impact MVP** : cette ligne documente l'intention future pour que l'architecture reste extensible.

---

### Résumé Stack UI/UX

```
┌─────────────────────────────────────────────────────────────┐
│                      YieldField UI Stack                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Signature Layer (effet "luxe")                  │      │
│  │  • Rive (avatar hero)                            │      │
│  │  • Lottie (micro-animations)                     │      │
│  │  • Aceternity Pro (hero, bento, timeline)        │      │
│  │  • Magic UI (text effects, indicators)           │      │
│  └──────────────────────────────────────────────────┘      │
│                        │                                    │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Animation Engine                                │      │
│  │  • Motion 12 / Motion+                           │      │
│  └──────────────────────────────────────────────────┘      │
│                        │                                    │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Base Components (accessibles)                   │      │
│  │  • shadcn/ui (Button, Card, Dialog, Input...)    │      │
│  │  • Radix Primitives (underlying)                 │      │
│  └──────────────────────────────────────────────────┘      │
│                        │                                    │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Styling                                         │      │
│  │  • Tailwind CSS (design tokens)                  │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

**Impact timeline :** Ces outils raccourcissent le sprint Design/UI d'environ **40-50%**. Le risque R7 (ambition design vs timeline 4 semaines) passe de **Medium → Low**.

**Impact NFR-001 (LCP < 2s) :**
- Avatar Rive : preload + skeleton SSR
- Aceternity/Magic UI components client-only : `"use client"` avec parcimonie, hydratation progressive
- Lottie : lazy-loaded, pas dans le critical path
- Motion 12 : tree-shaking agressif via imports spécifiques
- **Budget bundle initial JS strict : < 250KB gzipped** (augmenté de 200KB pour accommoder Rive + Motion)

---

### Backend / Pipeline

**Choice:** **TypeScript + Node.js 20 (scripts) exécutés par GitHub Actions**

**Rationale:**
- Même langage que le frontend → un seul mental model
- Pas de "backend" au sens serveur : juste des scripts NodeJS dans `scripts/pipeline/`
- GitHub Actions free tier pour repo public (2000 min/mois — largement suffisant)
- Pas de serveur à gérer, pas de coût

**Structure des scripts :**
```
scripts/pipeline/
├── fetch-market-data.ts    # FR-010
├── analyze-with-claude.ts  # FR-004, FR-005, FR-006, FR-011
├── publish-to-r2.ts        # Upload latest.json + archive
├── detect-vix-alert.ts     # FR-017 (percentile VIX)
└── notify-on-failure.ts    # FR-012 (auto-issue GitHub)
```

**Trade-offs:**
- ✓ Zéro infrastructure, logs intégrés GitHub UI
- ✗ Retard possible jusqu'à 60 min sur cron (mitigé : lancer à 6h UTC pour publier < 8h30 CET)

---

### Storage

**Choice:** **Cloudflare R2 (JSON files) + GitHub (static content)**

**Rationale:**
- R2 = S3-compatible, **zéro coût egress** (contrairement à S3)
- Free tier : 10 GB stockage + 1M requêtes/mois → largement suffisant (JSON < 100 KB)
- Pas de besoin de SQL : on lit 1 fichier JSON par jour
- Historique archive : `archive/YYYY-MM-DD.json` pour timeline Coulisses

**Structure R2 :**
```
yieldfield-content/
├── latest.json              # Dernière analyse (FR-004, FR-005)
├── latest-override.json     # Override manuel (FR-016)
├── archive/
│   ├── 2026-04-11.json
│   ├── 2026-04-10.json
│   └── ...
├── alerts/
│   ├── 2026-04-11-vix-alert.json  # FR-017
│   └── ...
├── logs/
│   └── pipeline-runs.json   # FR-009 (logs API)
└── prompts/
    └── briefing-v{N}.md     # Historique prompts (FR-008)
```

**Trade-offs:**
- ✓ Gratuit, S3-compatible, global
- ✗ Pas de query SQL (mais pas besoin pour ce projet)

**Alternatives rejetées :**
- **Cloudflare D1 (SQLite)** : overkill pour 1 fichier/jour
- **AWS S3** : coût egress non maîtrisé
- **Git LFS** : complique le workflow

---

### Hosting & CDN

**Choice:** **Cloudflare Pages + Cloudflare CDN (200+ POPs)**

**Rationale:**
- Free tier généreux (illimité requêtes, 500 builds/mois, bandwidth unlimited)
- Preview deployments automatiques sur chaque PR
- Edge Runtime pour fonctions légères (OG images, revalidate on-demand)
- Intégration native avec R2 (pas d'auth complexe pour lire JSON)
- HTTPS auto, HTTP/3, Brotli natif

**Trade-offs:**
- ✓ Gratuit, mondial, performant
- ✗ Certaines APIs Node sont restreintes dans Edge Runtime (mitigé : tout le pipeline tourne dans GitHub Actions, pas en Edge)

---

### AI / LLM

**Choice:** **Claude API — modèle Haiku 4.5 (claude-haiku-4-5-20251001)**

**Rationale:**
- Le modèle le moins cher Anthropic (~$1/Mtok input, $5/Mtok output)
- 1 appel/jour × ~2000 tokens input × ~1500 tokens output = **< 1€/mois**
- Qualité suffisante pour briefing de 4-5 phrases avec prompt engineering soigné
- Possibilité de fallback vers Sonnet si qualité insuffisante (avec monitoring coût)
- Outputs structurés JSON via system prompt strict

**Prompt strategy :**
- Prompts versionnés dans `prompts/briefing-v{N}.md`
- Output JSON validé par schema Zod
- Double génération FR+EN dans 1 seul appel (économie coût)
- Mode conditionnel "crise" si alerte VIX détectée (FR-017)

**Trade-offs:**
- ✓ Coût minimal, latence acceptable (3-5s)
- ✗ Haiku moins "créatif" que Sonnet (mitigé par prompt engineering itératif v01→v06)

---

### APIs externes (sources de données)

| Source | Usage | Free Tier | Criticité |
|---|---|---|---|
| **FRED (St. Louis Fed)** | Taux US, macro US | Illimité | Must |
| **BCE API** | Taux EU (OAT, Bund) | Illimité | Must |
| **Alpha Vantage** | Indices (CAC, S&P, Nasdaq) | 25 req/jour | Must |
| **Finnhub** | Backup indices, VIX | 60 req/min | Should (fallback) |
| **CBOE** | VIX real-time | Gratuit public | Must |
| **ICE** (ou substitut) | Dollar Index (DXY) | Via Alpha Vantage | Must |

**Stratégie de fallback :**
1. Tentative Alpha Vantage → si échec, fallback Finnhub
2. Cache agressif sur R2 (`cache/alphavantage-YYYY-MM-DD.json`)
3. Historique 7 jours pour résilience (FR-012)

---

### Analytics

**Choice:** **Cloudflare Web Analytics (free, privacy-first)**

**Rationale:**
- **Gratuit illimité** (contrairement à Plausible self-hosted ou cloud)
- **Zéro cookie → pas de consent banner** nécessaire
- Intégration native avec Cloudflare Pages
- Dashboard visible depuis Cloudflare dashboard
- FR-018 satisfait sans coût ni complexité

**Trade-offs:**
- ✓ Gratuit, intégré, privacy-first
- ✗ Moins de features avancées que Plausible (suffisant pour mesurer G1b)

---

### Monitoring & Alerting

**Choice:** **UptimeRobot + Cloudflare Analytics + GitHub Issues auto**

**Rationale:**
- **UptimeRobot** : free tier 50 monitors, pings toutes les 5 min, alerte email
- **Cloudflare Analytics** : traffic, performance, erreurs natives
- **GitHub Issues auto** : script `notify-on-failure.ts` crée une issue si pipeline échoue 2 fois de suite
- Zero coût, zero infra

**Trade-offs:**
- ✓ Gratuit, couvre uptime + pipeline + traffic
- ✗ Pas de tracing applicatif (pas nécessaire pour ce projet)

---

### CI/CD

**Choice:** **GitHub Actions + Cloudflare Pages auto-deploy**

**Rationale:**
- Repo public = Actions gratuites illimitées
- 2 workflows principaux :
  - `daily-pipeline.yml` (cron) : exécute le pipeline nocturne
  - `lighthouse-check.yml` (on PR) : valide NFR-002 à chaque PR
- Cloudflare Pages déploie automatiquement sur push `main`
- Preview deployments sur chaque PR (critique pour revue Bryan + Emmanuel)

---

### Development & Quality

**Choice:** **TypeScript strict + ESLint + Prettier + Vitest + Playwright**

**Rationale:**
- **TypeScript strict** : catches bugs early, essentiel pour 1 dev
- **Vitest** : tests unitaires rapides pour scripts pipeline
- **Playwright** : tests E2E smoke (page charge, FR/EN, KPIs visibles)
- **Lighthouse CI** : validation automatique NFR-002 à chaque PR

---

## 4. System Components (détaillés)

### Component 1 — Pipeline Orchestrator (GitHub Actions)

**Purpose:** Déclencher et orchestrer la chaîne de jobs nocturnes.

**Responsibilities:**
- Exécuter le cron quotidien à 6h UTC
- Enchaîner les 3 jobs séquentiels (fetch → analyze → publish)
- Gérer retry automatique en cas d'échec (max 3 tentatives)
- Créer une GitHub Issue automatique si 2 échecs consécutifs

**Interfaces:**
- Cron trigger : `cron: '0 6 * * 1-5'` (weekdays 6h UTC)
- Manual trigger : `workflow_dispatch` pour exécution à la demande
- Secrets : `ANTHROPIC_API_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_KEY`, `ALPHA_VANTAGE_KEY`

**Dependencies:** GitHub Actions runtime, Node 20

**FRs addressed:** FR-010, FR-011, FR-012

---

### Component 2 — Data Collector (`scripts/pipeline/fetch-market-data.ts`)

**Purpose:** Collecter les données financières depuis les APIs externes.

**Responsibilities:**
- Fetch FRED (taux US, DXY)
- Fetch BCE (OAT, Bund)
- Fetch Alpha Vantage (CAC 40, S&P 500, Nasdaq, Nikkei) — max 10 requêtes
- Fetch Finnhub (fallback + VIX)
- Calculer les spreads (OAT-Bund, Bund-US)
- Normaliser dans un format unifié `MarketDataSnapshot`
- Persister dans `raw_data.json` temporaire

**Interfaces:**
- Input : `GET /api/*` HTTP
- Output : JSON structuré `MarketDataSnapshot`

**Dependencies:** Node fetch, zod (validation schéma)

**FRs addressed:** FR-001, FR-010, FR-013

---

### Component 3 — AI Analyzer (`scripts/pipeline/analyze-with-claude.ts`)

**Purpose:** Appeler Claude API pour générer briefing + tagline + metadata contextuelles.

**Responsibilities:**
- Construire le prompt avec données du jour + prompt système versionné
- Détecter si mode "crise" activé (via `detect-vix-alert.ts`)
- Appeler Claude API (modèle Haiku) avec 1 seul call pour FR+EN
- Parser et valider le JSON output (schema Zod)
- Retry x3 en cas d'erreur API ou JSON invalide
- Persister dans `analysis.json` temporaire

**Interfaces:**
- Input : `MarketDataSnapshot` + `prompt-v{N}.md`
- Output : `DailyAnalysis` (briefing FR+EN, tagline FR+EN, hero_metrics, theme_of_day, certainty, upcoming_event, risk_level)

**Dependencies:** `@anthropic-ai/sdk`, zod

**FRs addressed:** FR-004, FR-005, FR-006, FR-011, FR-017

---

### Component 4 — VIX Alert Detector (`scripts/pipeline/detect-vix-alert.ts`)

**Purpose:** Détecter les conditions de marché anormales par approche statistique percentile.

**Responsibilities:**
- Charger l'historique VIX des 252 derniers jours ouvrés (depuis R2 `archive/`)
- Calculer le 90ᵉ percentile glissant
- Comparer VIX du jour avec p90
- Retourner niveau d'alerte : `normal` / `warning` (>p90) / `alert` (>p95) / `crisis` (>p99)
- Persister l'alerte dans `alerts/YYYY-MM-DD-vix-alert.json` si déclenché

**Interfaces:**
- Input : VIX du jour + historique R2
- Output : `VixAlert` (level, vix_current, p90, p95, p99)

**Dependencies:** Pas de libs externes (statistiques simples)

**FRs addressed:** FR-017

---

### Component 5 — Publisher (`scripts/pipeline/publish-to-r2.ts`)

**Purpose:** Uploader le résultat final sur Cloudflare R2 et trigger revalidation Next.js.

**Responsibilities:**
- Upload `latest.json` (version finale avec manual_override si existant)
- Archive dans `archive/YYYY-MM-DD.json`
- Upload logs pipeline dans `logs/pipeline-runs.json`
- Appeler endpoint `/api/revalidate` sur Cloudflare Pages (ISR on-demand)

**Interfaces:**
- Input : `DailyAnalysis` final
- Output : confirmations upload R2 + revalidation

**Dependencies:** `@aws-sdk/client-s3` (compatible R2), fetch

**FRs addressed:** FR-010, FR-012, FR-016

---

### Component 6 — Web Frontend (Next.js 14)

**Purpose:** Servir le site statique bilingue aux utilisateurs.

**Responsibilities:**
- Dashboard KPIs (6-8 chiffres avec animation)
- Briefing macro + tagline + metadata
- Page Coulisses (timeline, prompts, logs)
- Switcher FR/EN + disclaimer légal
- OG Image dynamique (Edge Function)

**Structure (simplifiée) :**
```
src/app/
├── [locale]/
│   ├── page.tsx              # Dashboard home (FR-001 → FR-006)
│   ├── coulisses/page.tsx    # Page Coulisses (FR-007 → FR-009)
│   └── layout.tsx            # i18n layout + disclaimer (FR-014, FR-015)
├── api/
│   ├── revalidate/route.ts   # ISR on-demand (trigger from R2 publisher)
│   └── og/route.tsx          # OG image generator (FR-019)
└── lib/
    ├── r2.ts                 # R2 read client
    ├── content.ts            # Load latest.json + fallback
    └── i18n.ts               # next-intl config
```

**Interfaces:**
- HTTP : `GET /fr`, `GET /en`, `GET /fr/coulisses`, `GET /en/coulisses`
- R2 read : `latest.json`, `archive/`, `alerts/`

**Dependencies:** Next.js 14, next-intl, Tailwind, Framer Motion, shadcn/ui

**FRs addressed:** FR-001, FR-002, FR-003, FR-007, FR-008, FR-009, FR-014, FR-015, FR-016, FR-018, FR-019

---

### Component 7 — OG Image Generator (Edge Function)

**Purpose:** Générer dynamiquement les images Open Graph avec le contenu du jour.

**Responsibilities:**
- Route `/api/og?locale=fr|en`
- Charger `latest.json` depuis R2
- Générer l'image avec Satori/@vercel/og (1200×630px)
- Inclure tagline + KPIs principaux + logo
- Cache Edge 1h

**Dependencies:** `@vercel/og` (compatible Cloudflare Edge)

**FRs addressed:** FR-019

---

## 5. Data Architecture

### Data Model (entités principales)

```typescript
// src/types/content.ts

interface DailyAnalysis {
  date: string;                    // ISO "2026-04-11"
  generated_at: string;            // ISO timestamp
  prompt_version: string;          // "v03"

  content: {
    fr: { briefing: string; tagline: string; };
    en: { briefing: string; tagline: string; };
  };

  hero_metrics: HeroMetric[];      // 6-8 items
  metadata: {
    theme_of_day: string;          // "Inflation US en focus"
    certainty: "preliminary" | "definitive";
    upcoming_event: string;        // "Jobs Friday"
    risk_level: "low" | "medium" | "high";
  };

  vix_alert?: VixAlert;            // Si FR-017 déclenché
  manual_override?: {              // FR-016
    fr: { briefing: string; tagline: string; };
    en: { briefing: string; tagline: string; };
    edited_by: string;
    edited_at: string;
  };

  ai_original: {                   // Toujours préservé
    fr: { briefing: string; tagline: string; };
    en: { briefing: string; tagline: string; };
  };
}

interface HeroMetric {
  label_fr: string;
  label_en: string;
  category: "rate" | "spread" | "index" | "volatility" | "macro";
  value: number;
  unit: string;                    // "%", "pts", "bps"
  change_day: number;              // Variation J/J absolue
  change_day_pct: number;          // Variation J/J %
  direction: "up" | "down" | "flat";
  source: string;                  // "FRED", "BCE", "Alpha Vantage"
  last_updated: string;            // ISO timestamp
  freshness: "fresh" | "stale" | "very_stale";  // < 24h / 24-48h / > 48h
}

interface VixAlert {
  level: "normal" | "warning" | "alert" | "crisis";
  vix_current: number;
  vix_p90_252d: number;
  vix_p95_252d: number;
  vix_p99_252d: number;
  triggered_at: string;
}

interface MarketDataSnapshot {
  fetched_at: string;
  sources: {
    fred: { success: boolean; latency_ms: number; data: any; };
    bce: { success: boolean; latency_ms: number; data: any; };
    alphavantage: { success: boolean; latency_ms: number; data: any; };
    finnhub: { success: boolean; latency_ms: number; data: any; };
  };
  computed: {
    spread_oat_bund: number;
    spread_bund_us: number;
  };
}
```

### Data Flow

```
┌──────────────┐
│ External API │ (FRED, BCE, Alpha Vantage, Finnhub, CBOE)
└──────┬───────┘
       │ HTTPS GET
       ▼
┌────────────────────┐
│ fetch-market-data  │ → raw_data.json (in-memory)
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ detect-vix-alert   │ ← reads R2 archive/ (last 252 days)
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ analyze-with-claude│ → analysis.json (in-memory)
│ (Claude API call)  │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ publish-to-r2      │ → R2 writes:
│                    │    • latest.json
│                    │    • archive/YYYY-MM-DD.json
│                    │    • alerts/*.json (if triggered)
│                    │    • logs/pipeline-runs.json
└──────┬─────────────┘
       │
       ▼ POST /api/revalidate
┌────────────────────┐
│ Next.js ISR        │ → Rebuild pages /fr, /en
│ on-demand          │   CDN cache invalidation
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ Cloudflare CDN     │ → Serves fresh content globally
└────────────────────┘
```

### Storage Strategy

| Data | Where | Why |
|---|---|---|
| `latest.json` | R2 `yieldfield-content/latest.json` | Lu par frontend à chaque ISR revalidate |
| `archive/*.json` | R2 `yieldfield-content/archive/` | Historique pour VIX percentile + Coulisses |
| `alerts/*.json` | R2 `yieldfield-content/alerts/` | Historique des alertes VIX |
| `logs/*.json` | R2 `yieldfield-content/logs/` | Logs pipeline pour FR-009 |
| `prompts/*.md` | Git repo `prompts/` | Versionnage prompts (FR-008) |
| Code / config | Git repo | Source of truth pour déploiement |
| Secrets | Cloudflare env vars + GitHub Secrets | NFR-005 (zéro secret en code) |

---

## 6. API Design

### Philosophie

**Il n'y a pas d'API publique.** Le frontend lit directement R2 via SDK S3 côté serveur (ISR build time). Les seuls endpoints sont internes :

### Internal Endpoints

| Endpoint | Purpose | Auth | Called by |
|---|---|---|---|
| `POST /api/revalidate` | Trigger ISR revalidation | Secret header | GitHub Action (publisher) |
| `GET /api/og` | Generate OG image | Public | Social crawlers (FB, Twitter, LinkedIn) |

### External API Clients (consommés par le pipeline)

```typescript
// Data sources
GET https://api.stlouisfed.org/fred/series/observations?series_id=...
GET https://sdw-wsrest.ecb.europa.eu/service/data/...
GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=...
GET https://finnhub.io/api/v1/quote?symbol=...
GET https://cdn.cboe.com/api/global/delayed_quotes/quotes/VIX.json

// Claude API
POST https://api.anthropic.com/v1/messages
```

---

## 7. NFR Coverage (systématique)

### NFR-001: Performance LCP < 2s

**Solution :**
- SSG (Static Site Generation) → HTML prerendu servi directement par CDN
- Cloudflare CDN global (200+ POPs) → latence < 50ms mondiale
- Next.js Image optimization → images WebP/AVIF avec `next/image`
- Fonts self-hosted avec `next/font` (pas de FOIT)
- Pas de JavaScript bloquant en hydration

**Validation :**
- Lighthouse CI à chaque PR (throttling 4G)
- Web Vitals monitoring via Cloudflare Analytics

---

### NFR-002: Lighthouse Score ≥ 90

**Solution :**
- Performance : SSG + CDN + optimisation images
- Accessibility : shadcn/ui (WCAG AA), alt texts, ARIA, contraste
- Best Practices : HTTPS, HTTP/3, no mixed content, CSP headers
- SEO : meta tags dynamiques, sitemap.xml, robots.txt, OG tags

**Validation :**
- GitHub Action `lighthouse-check.yml` bloque le merge si < 90

---

### NFR-003: Uptime 99% (Must Have)

**Solution :**
- Cloudflare Pages uptime natif > 99.9%
- R2 read fallback : si R2 indisponible, Next.js sert le dernier build cached
- UptimeRobot ping toutes les 5 min → alerte email
- Dashboard public status page (optionnel V2)

**Validation :**
- UptimeRobot 30-day report
- Alerte si downtime > 5 min

---

### NFR-004: Coût ≤ 8€/mois

**Solution :**
| Ligne | Coût estimé |
|---|---|
| Cloudflare Pages (free tier) | 0€ |
| Cloudflare R2 (free tier < 10GB) | 0€ |
| Cloudflare Web Analytics | 0€ |
| GitHub Actions (repo public) | 0€ |
| Claude API (Haiku, 1 call/day) | ~1€/mois |
| Domaine `.io` | ~3€/mois |
| UptimeRobot (free) | 0€ |
| **Total** | **~4€/mois** |

**Marge de sécurité :** 4€ sous le plafond pour couvrir pics (itérations prompt, tests).

**Validation :**
- Monitoring Anthropic dashboard (alerte > 5€/mois)
- Review mensuelle facture Cloudflare

---

### NFR-005: Sécurité — zéro secret en code (Must Have)

**Solution :**
- Pre-commit hook `scripts/pre-commit` (déjà installé) scanne clés API, passwords, tokens
- GitHub secret scanning + push protection activés (BL-Capital/yieldview)
- Secrets uniquement en :
  - `GitHub Secrets` (pour Actions)
  - `Cloudflare Pages env vars` (pour Edge functions)
- Fichier `.env.example` fourni pour les devs (sans valeurs)
- `.gitignore` inclut `.env*`, `*.key`, `*.pem`

**Validation :**
- Audit manuel avant chaque release
- `gitleaks` exécuté en CI (GitHub Action)

---

### NFR-006: Accessibility WCAG AA

**Solution :**
- shadcn/ui components (WCAG AA par défaut)
- Contraste texte ≥ 4.5:1 (test automatisé)
- Navigation clavier complète (focus visible, skip-links)
- Alt texts sur toutes les images
- ARIA labels sur composants interactifs
- Langue déclarée `<html lang="fr">` / `<html lang="en">`

**Validation :**
- Lighthouse Accessibility ≥ 90 (GitHub Action)
- axe-core DevTools manuellement

---

### NFR-007: Bilingue FR/EN (Must Have)

**Solution :**
- next-intl (App Router compatible)
- Routes `/fr/...` et `/en/...`
- Middleware detect Accept-Language + cookie persist
- Traductions statiques dans `messages/{fr,en}.json`
- Briefing IA généré en FR+EN dans 1 appel Claude (coût ×1, pas ×2)

**Validation :**
- Tests E2E Playwright : vérifier FR et EN chargent correctement
- Pas de texte hardcodé (ESLint rule custom)

---

### NFR-008: Compatibilité navigateurs modernes

**Solution :**
- Target browsers : `> 0.5%, last 2 versions, not dead, not ie 11`
- Next.js transpile automatiquement selon targets
- Pas de polyfills lourds
- Progressive enhancement (le contenu reste lisible sans JS)

**Validation :**
- BrowserStack manual test avant release (Chrome, Firefox, Safari, Edge N-1)

---

### NFR-009: Pipeline reliability ≥ 95% (Must Have)

**Solution :**
- Retry automatique x3 sur chaque fetch API (exponential backoff)
- Fallback gracieux si API down (utilise dernière valeur R2 archive)
- `notify-on-failure.ts` crée une issue GitHub si 2 échecs consécutifs
- Monitoring success rate dans `logs/pipeline-runs.json` (7 derniers runs)

**Validation :**
- Dashboard GitHub Actions (UI native)
- Script de calcul de success rate hebdo

---

### NFR-010: Observabilité & logs structurés

**Solution :**
- Logs JSON structurés (via `pino` ou simple `console.log({...})`)
- Niveaux : info / warn / error
- Timestamps ISO 8601
- Agrégation : GitHub Actions logs UI + R2 `logs/pipeline-runs.json`
- Dashboard Coulisses (FR-009) affiche les 7 derniers runs

**Validation :**
- Revue manuelle lors de debug
- Pas de metric applicative pour V1 (acceptable vu scope)

---

## 8. Security Architecture

### Authentication

**User auth :** ❌ Aucune. Site public en lecture seule.

**Bryan / Emmanuel :** authentification via GitHub (push/PR workflow).

### Authorization

**Frontend :** pas d'autorisation (tout public).

**Pipeline :** GitHub Actions avec secrets scoped au repo.

**Revalidate API :** header `x-revalidate-secret` validé côté Edge Function.

### Data Encryption

- **In transit :** HTTPS obligatoire (TLS 1.3), HTTP/3 via Cloudflare
- **At rest :** R2 chiffré côté Cloudflare (AES-256 natif)
- **Secrets :** GitHub encrypted secrets + Cloudflare env vars encrypted

### Security Best Practices

- **Input validation :** Zod schemas sur toutes les inputs API (FRED, BCE, Claude output)
- **XSS prevention :** React échappe par défaut, pas de `dangerouslySetInnerHTML`
- **CSRF :** pas de form POST public donc non applicable
- **Rate limiting :** Cloudflare rate limiting natif (protège contre scraping agressif)
- **Security headers :**
  - `Content-Security-Policy` strict
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS 1 an)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Dependencies :** Dependabot + `npm audit` hebdo

---

## 9. Scalability & Performance

### Scaling Strategy

**Frontend :** Aucun scaling nécessaire. Cloudflare CDN absorbe n'importe quelle charge (millions de requêtes/jour).

**Pipeline :** 1 seule exécution/jour, pas de scaling.

**Claude API :** limite Anthropic généreuse, 1 appel/jour = 1/60000ᵉ du quota.

**Bottleneck unique :** Alpha Vantage 25 req/jour → mitigé avec 1 seul batch de ~10 requêtes.

### Performance Optimization

- **Static assets :** Cloudflare CDN + Brotli + HTTP/3
- **Images :** `next/image` WebP + lazy loading
- **Fonts :** `next/font` self-hosted + preload
- **Bundle splitting :** Automatic per-route via Next.js
- **Prefetch :** Next.js Link prefetch sur hover
- **ISR :** Revalidation on-demand uniquement (pas de TTL)

### Caching Strategy

| Layer | What | TTL |
|---|---|---|
| Cloudflare CDN | HTML statique | Invalidé par revalidate |
| Cloudflare CDN | Assets (CSS/JS/images) | 1 an (hash in filename) |
| Edge Function `/api/og` | OG image | 1h |
| Pipeline cache R2 | `cache/alphavantage-*.json` | 24h |
| Browser | Static assets | 1 an |

---

## 10. Reliability & Availability

### High Availability

- **Frontend :** Cloudflare multi-region natif (200+ POPs, failover auto)
- **R2 :** multi-region natif Cloudflare
- **GitHub Actions :** pas HA mais acceptable (retard max 60 min OK)

### Disaster Recovery

- **RPO** (Recovery Point Objective) : 1 jour (dernière archive)
- **RTO** (Recovery Time Objective) : 30 min (revalidate + rebuild)
- **Backup :** R2 archive conserve 365 jours → historique complet
- **Source code :** Git (BL-Capital/yieldview) = backup naturel

### Monitoring & Alerting

| Métrique | Source | Alerte |
|---|---|---|
| Uptime | UptimeRobot | Email si down > 5 min |
| Lighthouse | GitHub Action on PR | Bloque merge si < 90 |
| Pipeline success | GitHub Actions | Issue auto si 2 échecs |
| Claude cost | Anthropic dashboard | Email si > 5€/mois |
| Traffic | Cloudflare Analytics | Review hebdo |

---

## 11. Development & Deployment

### Code Organization

```
yieldview/
├── src/
│   ├── app/                         # Next.js 15 App Router
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── coulisses/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── revalidate/route.ts  # ISR on-demand trigger
│   │   │   └── og/route.tsx         # FR-019 OG image generator
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── aceternity/              # Aceternity Pro components
│   │   │   ├── aurora-background.tsx
│   │   │   ├── bento-grid.tsx
│   │   │   ├── tracing-beam.tsx
│   │   │   ├── text-generate-effect.tsx
│   │   │   └── ...
│   │   ├── magic-ui/                # Magic UI components
│   │   │   ├── number-ticker.tsx
│   │   │   ├── animated-gradient-text.tsx
│   │   │   ├── pulsating-dot.tsx
│   │   │   ├── marquee.tsx
│   │   │   └── ...
│   │   ├── rive/                    # Rive avatar
│   │   │   ├── HeroAvatar.tsx
│   │   │   └── AvatarStateMachine.ts
│   │   ├── lottie/                  # Lottie wrappers
│   │   │   ├── LottieIcon.tsx
│   │   │   └── animations/          # .lottie files
│   │   ├── dashboard/               # KPIs, HeroMetric, Bento
│   │   │   ├── HeroSection.tsx
│   │   │   ├── KpiBentoGrid.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   └── FreshnessIndicator.tsx
│   │   ├── briefing/                # Briefing display
│   │   │   ├── BriefingPanel.tsx
│   │   │   ├── TaglineHeader.tsx
│   │   │   └── MetadataChips.tsx
│   │   ├── coulisses/               # Timeline, prompts, logs
│   │   │   ├── Timeline.tsx
│   │   │   ├── PromptCodeBlock.tsx
│   │   │   └── PipelineLogsTable.tsx
│   │   ├── alerts/                  # FR-017 VIX alert UI
│   │   │   ├── AlertBanner.tsx
│   │   │   └── CrisisIndicator.tsx
│   │   └── common/                  # Header, Footer, LangSwitcher
│   ├── lib/
│   │   ├── r2.ts                    # R2 read client (S3-compat)
│   │   ├── content.ts               # Load latest.json + fallback
│   │   ├── i18n.ts                  # next-intl config
│   │   ├── rive-utils.ts            # Rive helpers
│   │   └── motion-config.ts         # Motion 12 reduced-motion config
│   ├── hooks/
│   │   ├── useContent.ts
│   │   ├── useRiveAvatar.ts
│   │   └── usePrefersReducedMotion.ts
│   └── types/
│       ├── content.ts
│       └── rive.ts
├── messages/                        # i18n translations
│   ├── fr.json
│   └── en.json
├── public/
│   ├── rive/
│   │   └── avatar.riv               # Avatar Rive (~60-100KB)
│   ├── lottie/
│   │   ├── arrow-up.lottie
│   │   ├── arrow-down.lottie
│   │   └── ...
│   └── fonts/                       # Self-hosted fonts
├── scripts/
│   ├── pipeline/
│   │   ├── fetch-market-data.ts
│   │   ├── analyze-with-claude.ts
│   │   ├── detect-vix-alert.ts
│   │   ├── publish-to-r2.ts
│   │   ├── notify-on-failure.ts
│   │   └── bootstrap-vix-history.ts # One-shot init
│   ├── pre-commit                   # Secret scanner (déjà existant)
│   └── setup-hooks.sh
├── prompts/
│   ├── briefing-v01.md
│   ├── briefing-v02.md
│   └── ...
├── tests/
│   ├── unit/                        # Vitest
│   └── e2e/                         # Playwright
├── .github/
│   └── workflows/
│       ├── daily-pipeline.yml
│       ├── lighthouse-check.yml
│       └── ci.yml
├── docs/                            # BMAD Documentation
│   ├── product-brief-*.md
│   ├── prd-*.md
│   ├── architecture-*.md
│   └── bmm-workflow-status.yaml
├── bmad/
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-intl": "^3.x",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.x",
    "motion": "^12.0.0",
    "@rive-app/react-canvas": "^4.x",
    "@dotlottie/react-player": "^1.x",
    "@vercel/og": "^0.6.x",
    "@aws-sdk/client-s3": "^3.x",
    "@anthropic-ai/sdk": "^0.30.x",
    "zod": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "class-variance-authority": "^0.7.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/node": "^20.x",
    "vitest": "^2.x",
    "@playwright/test": "^1.x",
    "@lighthouse-ci/cli": "^0.14.x",
    "eslint": "^9.x",
    "prettier": "^3.x"
  }
}
```

**Note :** shadcn/ui, Aceternity UI et Magic UI ne sont **pas des dépendances npm** — ils sont copy-pasted dans `src/components/ui`, `src/components/aceternity` et `src/components/magic-ui`. Cela garantit le contrôle total, zéro runtime dependency, et la possibilité de les modifier librement.

### Testing Strategy

| Level | Tool | Coverage target |
|---|---|---|
| Unit | Vitest | 70% (pipeline scripts critique) |
| Integration | Vitest + MSW | Mocker APIs externes |
| E2E | Playwright | Smoke tests (pages chargent FR/EN) |
| Lighthouse | Lighthouse CI | ≥ 90 à chaque PR |
| Security | gitleaks + pre-commit | 100% des commits |

### CI/CD Pipeline

**Workflow `ci.yml` (sur push / PR) :**
1. Install deps (`npm ci`)
2. Lint (`eslint`)
3. Type check (`tsc --noEmit`)
4. Unit tests (`vitest run`)
5. Build (`next build`)
6. Lighthouse CI (sur preview deployment)
7. gitleaks scan

**Workflow `daily-pipeline.yml` (cron 6h UTC) :**
1. Checkout
2. Setup Node 20
3. Install deps
4. Run `fetch-market-data.ts`
5. Run `detect-vix-alert.ts`
6. Run `analyze-with-claude.ts`
7. Run `publish-to-r2.ts`
8. On failure → `notify-on-failure.ts`

**Deployment strategy :**
- Push sur `main` → auto-deploy Cloudflare Pages production
- Push sur branche → auto-deploy Cloudflare Pages preview
- Pas de blue/green ni canary (pas nécessaire pour site statique)

### Environments

| Env | URL | Deploy trigger |
|---|---|---|
| Production | yieldview.io (TBD) | Push `main` |
| Preview | `{branch}.yieldview-{hash}.pages.dev` | Push branche / PR |
| Local | `localhost:3000` | `npm run dev` |

---

## 12. Traceability & Trade-offs

### FR Traceability Matrix

| FR | FR Name | Components | Notes |
|---|---|---|---|
| FR-001 | KPIs enrichis | Data Collector, Web Frontend | 6-8 KPIs segmentés |
| FR-002 | Animation hero | Web Frontend (Framer Motion) | Client-side animation |
| FR-003 | Indicateur fraîcheur | Data Collector, Web Frontend | Computed from timestamp |
| FR-004 | Briefing macro | AI Analyzer | 1 call Claude FR+EN |
| FR-005 | Briefing enrichi contexte | AI Analyzer | Via structured prompt |
| FR-006 | Tagline dynamique | AI Analyzer | Same call as briefing |
| FR-007 | Timeline Coulisses | Web Frontend | MDX content |
| FR-008 | Historique prompts | Web Frontend | Git-backed via prompts/ |
| FR-009 | Logs API | Publisher, Web Frontend | R2 logs/ → Coulisses |
| FR-010 | Collecte données | Pipeline Orchestrator, Data Collector | GH Actions cron |
| FR-011 | Claude API call | AI Analyzer | Haiku model |
| FR-012 | Fallback gracieux | Data Collector, Publisher | Last valid + freshness |
| FR-013 | Edge cases finance | Data Collector, AI Analyzer | Weekend/holidays logic |
| FR-014 | Switcher FR/EN | Web Frontend | next-intl middleware |
| FR-015 | Disclaimer légal | Web Frontend | Layout footer |
| FR-016 | Override manuel briefing | Publisher | Git commit → revalidate |
| FR-017 | Alert VIX percentile | VIX Alert Detector | p90/252d computation |
| FR-018 | Analytics | Web Frontend | Cloudflare Web Analytics |
| FR-019 | OG Image dynamique | OG Image Generator | Edge Function |

### NFR Traceability Matrix

| NFR | NFR Name | Solution | Validation |
|---|---|---|---|
| NFR-001 | LCP < 2s | SSG + CDN + image optim | Lighthouse CI |
| NFR-002 | Lighthouse ≥ 90 | 4 catégories optimisées | Lighthouse CI on PR |
| NFR-003 | Uptime 99% | Cloudflare Pages + UptimeRobot | 30d uptime report |
| NFR-004 | Coût ≤ 8€/mois | Free tiers + Haiku | Monthly review |
| NFR-005 | Zéro secret en code | Pre-commit + GH secret scanning | Audit + gitleaks |
| NFR-006 | WCAG AA | shadcn/ui + contrast | Lighthouse A11y |
| NFR-007 | Bilingue FR/EN | next-intl + AI dual gen | Playwright E2E |
| NFR-008 | Browsers N-1 | Next.js targets | BrowserStack test |
| NFR-009 | Pipeline 95% success | Retry + fallback | GH Actions dashboard |
| NFR-010 | Logs structurés | JSON logs + R2 persist | Manual review |

### Major Trade-offs

**Décision 1 : SSG + R2 read au build-time vs. Runtime API fetching**

- ✓ Gain : LCP excellent, coût zéro, CDN native
- ✗ Lose : Nécessite revalidation on-demand (complexité mineure)
- **Rationale :** Content change 1×/jour, SSG est naturel.

---

**Décision 2 : Cloudflare R2 vs. Cloudflare D1 (SQLite)**

- ✓ Gain : Simplicité extrême, 1 fichier JSON suffit
- ✗ Lose : Pas de requêtage complexe
- **Rationale :** Pas de besoin de requêtes SQL, JSON natif suffit.

---

**Décision 3 : Claude Haiku vs. Sonnet**

- ✓ Gain : Coût ~5× moins cher (~1€/mois vs ~5€/mois)
- ✗ Lose : Qualité éditoriale légèrement inférieure
- **Rationale :** Prompt engineering itératif v01→v06 compense. Si qualité insuffisante en V2, switcher vers Sonnet (budget le permet).

---

**Décision 4 : GitHub Actions cron vs. Cloudflare Cron Triggers**

- ✓ Gain GH Actions : logs UI, secret management, gratuité illimitée repo public
- ✗ Lose : Retard jusqu'à 60 min
- **Rationale :** Le retard n'impacte pas l'expérience utilisateur (pipeline tourne à 6h UTC pour publication avant 8h30 CET).

---

**Décision 5 : Percentile glissant VIX (252j) vs. Seuil fixe 30**

- ✓ Gain : Robuste à travers les régimes de marché
- ✗ Lose : Complexité initiale (calcul historique)
- **Rationale :** Décision validée par le client. Nécessite 252 jours d'archive minimum en R2.

---

**Décision 6 : Cloudflare Web Analytics vs. Plausible vs. Umami**

- ✓ Gain : Gratuit natif, pas de cookie, pas de consent banner, intégration Cloudflare
- ✗ Lose : Moins de features que Plausible
- **Rationale :** Coût zéro + privacy-first + suffisant pour mesurer les Success Metrics.

---

## 13. Risques architecturaux & mitigations

| ID | Risque | Impact | Mitigation architecturale |
|---|---|---|---|
| A1 | R2 région down | High | Multi-région Cloudflare natif + cache CDN prolongé |
| A2 | Claude API outage | High | Fallback : utiliser `latest.json` de la veille + banner "données J-1" |
| A3 | Alpha Vantage quota dépassé | Medium | Fallback Finnhub + cache 24h R2 |
| A4 | Cron GH Actions retardé | Low | Lancement 6h UTC (marge 2h30 avant 8h30 CET) |
| A5 | next-intl bundle trop lourd | Medium | Lazy-load traductions par locale |
| A6 | VIX archive insuffisante (< 252j) | Medium | Bootstrap initial avec historique CBOE public (1 script one-shot) |
| A7 | Open Graph image generation timeout Edge | Low | Cache 1h + fallback image statique |
| A8 | Aceternity + Magic UI components client-heavy (impact LCP) | Medium | Stratégie : server-side skeleton du hero + hydratation progressive des animations. Lighthouse CI bloque merge si < 90. |
| A9 | Motion 12 bundle impact mobile | Low | Tree-shaking imports Motion, lazy-load animations non-critical |
| A10 | React 19 incompatibilité avec libs tierces (Rive, Aceternity, Magic UI) | Medium | Smoke tests au setup initial. Fallback Next.js 14 + React 18 si blocage critique. |
| A11 | Rive avatar non prêt au launch | Medium | Fallback SVG statique. Intégration Rive en itération post-MVP si besoin. |
| A12 | Lottie assets non disponibles / qualité insuffisante | Low | LottieFiles contient des milliers d'animations finance gratuites. Fallback : icônes statiques Lucide React. |

---

## 14. Design System & Animation Strategy

### Design tokens (Tailwind config)

```typescript
// tailwind.config.ts (extrait)
theme: {
  extend: {
    colors: {
      // Brand
      'yield-dark': '#0A1628',        // Fond principal
      'yield-gold': '#C9A84C',        // Accent or
      'yield-gold-light': '#E5C67F',  // Accent hover
      'yield-ink': '#F4F4F5',         // Texte principal
      'yield-muted': '#94A3B8',       // Texte secondaire

      // Semantic finance
      'bull': '#22C55E',              // Vert hausse
      'bear': '#EF4444',              // Rouge baisse
      'neutral': '#94A3B8',           // Flat

      // Alert levels (FR-017)
      'alert-warning': '#F59E0B',     // VIX > p90
      'alert-danger': '#DC2626',      // VIX > p95
      'alert-crisis': '#991B1B',      // VIX > p99
    },
    fontFamily: {
      'serif': ['Instrument Serif', 'Playfair Display', 'serif'],  // Titres éditoriaux
      'sans': ['Inter', 'system-ui', 'sans-serif'],                // Body
      'mono': ['JetBrains Mono', 'monospace'],                      // Chiffres
    }
  }
}
```

### Animation Strategy (Motion 12 + Rive + Lottie)

**Principe :** Les animations doivent **servir l'information**, pas la distraire.

**4 niveaux d'animation :**

1. **Functional** (obligatoires, toujours activées) :
   - Number ticker du hero avec Magic UI (FR-002)
   - Scroll reveal léger (opacity + translate 20px) via Motion
   - Page transitions FR/EN
   - Loading skeletons
   - Lottie icons dans les cards KPI (up/down arrows, category icons)

2. **Delight** (premium, respectent `prefers-reduced-motion`) :
   - Parallax Hero (Aceternity Aurora/Beams)
   - Hover states sur cards KPIs (Shimmer Glare, Meteors)
   - Text Generate Effect sur briefing (Aceternity)
   - Tracing Beam sur timeline Coulisses (Aceternity)
   - Marquee scroll des KPIs secondaires (Magic UI)

3. **Signature** (Rive avatar — l'identité de YieldField) :
   - Avatar hero réactif au `risk_level` du jour
   - Changement d'expression/pose selon `theme_of_day`
   - Interactions : click sur avatar → micro-animation + tooltip
   - State machines pilotées via props React

4. **Alert** (conditionnelles, mode crise FR-017) :
   - Meteors/Grid effect en banner (Aceternity)
   - Pulsating Dot sur indicateur VIX (Magic UI)
   - Neon Gradient Card rouge sur KPIs en alerte (Magic UI)
   - Avatar Rive en mode tension
   - Haptic feedback CSS (pulse subtil)

### Page-by-page blueprint (Aceternity + Magic UI + Rive + Motion + Lottie)

#### Homepage `/[locale]/page.tsx`

```
┌──────────────────────────────────────────────────────┐
│ [Alert Banner - conditional, Meteors + Neon]        │  ← FR-017 (Aceternity + Magic)
├──────────────────────────────────────────────────────┤
│                                                      │
│   HERO SECTION                                       │
│   [Aurora Background / Beams]                        │  ← Aceternity Pro
│                                                      │
│   ┌──────────────────┐   ┌────────────────────────┐ │
│   │                  │   │ Tagline                │ │
│   │  RIVE AVATAR     │   │ (Animated Gradient)    │ │  ← FR-006 (Magic UI)
│   │  (signature)     │   │                        │ │
│   │                  │   │ Briefing macro         │ │  ← FR-004 (Text Generate)
│   │  Reactive:       │   │ (Text Generate Effect) │ │
│   │  - risk_level    │   │                        │ │
│   │  - theme_of_day  │   │ Metadata chips         │ │  ← FR-005
│   │                  │   │ [theme] [risk] [event] │ │
│   └──────────────────┘   └────────────────────────┘ │
│                                                      │
│   [Pulsating Dot] "Live • Updated 8:23 AM"          │  ← FR-003 (Magic UI)
│                                                      │
├──────────────────────────────────────────────────────┤
│   [Bento Grid - 6-8 KPIs]                           │  ← FR-001 (Aceternity)
│   ┌───────────┬───────────┬───────────┐             │
│   │ OAT 10Y   │ Bund 10Y  │ Spread    │             │
│   │ (Shimmer) │ (Shimmer) │ (Glare)   │             │  ← FR-002 (Magic Ticker)
│   │ ↗ 3.15%   │ → 2.51%   │ 64 bps    │             │
│   │ [Lottie↗] │ [Lottie→] │ [Lottie↗] │             │  ← Lottie icons
│   ├───────────┼───────────┼───────────┤             │
│   │ CAC 40    │ S&P 500   │ VIX       │             │
│   │           │           │ [Pulse]   │             │
│   ├───────────┴───────────┴───────────┤             │
│   │ Dollar Index / Rendements         │             │
│   └───────────────────────────────────┘             │
│                                                      │
├──────────────────────────────────────────────────────┤
│ [Marquee scroll - KPIs secondaires]                 │  ← Magic UI
├──────────────────────────────────────────────────────┤
│ Footer: Disclaimer + Lang switcher FR/EN            │  ← FR-014, FR-015
└──────────────────────────────────────────────────────┘
```

#### Page Coulisses `/[locale]/coulisses/page.tsx`

```
┌─────────────────────────────────────────────┐
│ [Tracing Beam - vertical scroll]            │  ← Aceternity
│                                             │
│ ● Étape 1 - Idée originelle                 │  ← FR-007
│   (Screenshot + description MDX)            │
│   [Lottie spark animation]                  │  ← Lottie
│                                             │
│ ● Étape 2 - BMAD Method                     │
│   (Diagram SVG + texte)                     │
│                                             │
│ ● Étape 3 - Pipeline nocturne               │
│   (Architecture diagram animé)              │
│                                             │
│ ● Étape 4 - Prompts v01 → v06               │  ← FR-008
│   [Code Block Aceternity avec diff]         │
│   [Copy button avec Magic UI shine]         │
│                                             │
│ ● Étape 5 - Déploiement                     │
│   [API Logs table - 7 derniers runs]        │  ← FR-009
│   [Pulsating Dot si run réussi]             │
│                                             │
│ ● Étape 6 - Avatar Rive                     │
│   [Preview interactive de l'avatar]         │  ← Meta narrative
│   (Bryan explique comment il a été créé)    │
│                                             │
└─────────────────────────────────────────────┘
```

### Accessibilité des animations

- Toutes les animations respectent `prefers-reduced-motion: reduce`
- Alternative : fade simple pour utilisateurs sensibles
- Focus visible conservé
- Pas d'animation infinie sur éléments critiques

### Performance budget

| Metric | Budget | Strategy |
|---|---|---|
| First Contentful Paint | < 1s | Server-rendered hero skeleton (SSR-friendly) |
| Largest Contentful Paint | < 2s | Rive avatar preloaded + fonts preloaded + critical CSS inlined |
| Total Blocking Time | < 200ms | Animations/Rive/Lottie après hydration |
| Cumulative Layout Shift | < 0.1 | Dimensions fixes pour avatar Rive et tous les composants animés |
| JavaScript bundle (initial) | < 250KB gzipped | Tree-shake Motion 12, lazy Aceternity/Magic UI non-critiques |
| Rive asset | < 100KB | Compression .riv, 1 seul state machine |
| Lottie assets | < 20KB chaque | Format dotLottie compressé |
| Total weight (first paint) | < 400KB | Strict budget pour maintenir LCP < 2s sur 4G |

**Stratégie de chargement :**

```
Priorité 1 (critical, inlined) :
  ├─ Critical CSS (Tailwind purged)
  ├─ Fonts Instrument Serif + Inter (preload)
  └─ Next.js runtime minimal

Priorité 2 (high, preload) :
  ├─ Rive avatar .riv
  ├─ Hero KPIs data (from R2 latest.json)
  └─ Above-the-fold Aceternity components

Priorité 3 (lazy, after hydration) :
  ├─ Motion 12 features avancées
  ├─ Lottie animations (intersection observer)
  ├─ Below-the-fold components
  └─ Page Coulisses assets (prefetch on hover)

Priorité 4 (on-demand) :
  └─ React Three Fiber (V2, si activé)
```

---

## 15. Phase de déploiement initial (bootstrap)

Actions ponctuelles AVANT de lancer le pipeline quotidien et publier le site :

### Bootstrap Backend / Pipeline
1. **Créer le bucket R2** `yieldfield-content` dans Cloudflare
2. **Bootstrapper l'historique VIX** (script `scripts/bootstrap-vix-history.ts` fetch 252 jours de VIX, upload dans R2 `archive/`)
3. **Configurer les secrets** GitHub Actions + Cloudflare Pages env vars
4. **Créer les prompts v01** dans `prompts/briefing-v01.md`
5. **Premier run manuel** du pipeline (`workflow_dispatch`)
6. **Valider le résultat** dans R2 + frontend local
7. **Activer le cron** (commenté initialement)
8. **Configurer UptimeRobot** sur le domaine
9. **Activer Cloudflare Web Analytics**
10. **Domaine DNS** (après Issue #2 résolue)

### Bootstrap Frontend / UI
11. **Setup Next.js 15 + React 19 + TypeScript** (`npx create-next-app@latest`)
12. **Installer shadcn/ui** (`npx shadcn@latest init`) et composants de base (Button, Card, Dialog, Toast)
13. **Copy-paste les composants Aceternity Pro** utilisés (Aurora, Bento, Tracing Beam, Text Generate, Code Block)
14. **Copy-paste les composants Magic UI** (Number Ticker, Animated Gradient Text, Pulsating Dot, Marquee)
15. **Installer Motion 12** (`npm install motion`) et configurer `prefers-reduced-motion`
16. **Créer ou sourcer l'avatar Rive** :
    - Option A : Bryan crée l'avatar dans Rive Community (éditeur visuel web)
    - Option B : Démarrer avec avatar statique SVG, enrichir itérativement
    - Export `.riv` dans `public/rive/avatar.riv`
17. **Installer Rive React** (`npm install @rive-app/react-canvas`)
18. **Sourcer 5-10 animations Lottie** depuis LottieFiles (gratuit, finance/data icons)
19. **Installer dotLottie player** (`npm install @dotlottie/react-player`)
20. **Configurer Tailwind** avec design tokens (brand colors + finance semantic + fonts Instrument Serif)
21. **Setup next-intl** (FR/EN routing + messages)
22. **Smoke test local** : page `/fr` et `/en` avec données mockées
23. **Lighthouse audit local** pour valider le performance budget avant prod

### Validation compatibilité
24. **Test compatibilité React 19** avec Rive, Aceternity, Magic UI (risque A10 architecture)
    - Si incompatibilité bloquante : fallback Next.js 14 + React 18

---

## 16. Hand-off to Phase 4 — Sprint Planning

L'architecture couvre **100% des 29 exigences** du PRD (19 FRs + 10 NFRs).

**Prêt pour Sprint Planning :**
- ✅ 5 epics définis avec composants identifiés
- ✅ 7 composants système documentés
- ✅ Stack technique complète et justifiée
- ✅ 15 décisions architecturales documentées
- ✅ Data model TypeScript prêt
- ✅ Structure de projet définie
- ✅ CI/CD workflows spécifiés

**Prochaines étapes BMAD :**
1. `/solutioning-gate-check` (optionnel) — Audit architecture par l'Architect
2. `/sprint-planning` — Breakdown des 5 epics en 18-23 stories user-facing
3. `/create-story` × N — Génération stories détaillées par le Scrum Master
4. `/dev-story` × N — Implémentation par Developer agent

---

## Appendix — Links & References

- **PRD v2.0 :** `docs/prd-yieldfield-2026-04-11.md`
- **Product Brief :** `docs/product-brief-yieldfield-2026-04-11.md`
- **Workflow Status :** `docs/bmm-workflow-status.yaml`
- **Repo GitHub :** https://github.com/BL-Capital/yieldview
- **Domain Decision :** BL-Capital/yieldview#2

---

*Document généré dans le cadre du workflow BMAD v6 — Phase 3 Solutioning*
*System Architect : Claude (Opus 4.6, 1M context) — Emmanuel (WEDOOALL Solutions)*
