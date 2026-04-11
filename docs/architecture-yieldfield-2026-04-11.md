# Architecture — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 1.0
**Date :** 2026-04-11
**Architecte :** Emmanuel — WEDOOALL Solutions (System Architect)
**Méthodologie :** BMAD v6 — Phase 3 (Solutioning)
**Référence :** ARCH-YIELDFIELD-2026-001
**PRD source :** `docs/prd-yieldfield-2026-04-11.md` (v2.0, 29 exigences, 5 epics)

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

**Choice:** **Next.js 14 (App Router) + React 18 + TypeScript**

**Rationale:**
- App Router supporte nativement SSG + ISR, parfait pour contenu mis à jour 1×/jour
- Edge Runtime Cloudflare compatible (via `@cloudflare/next-on-pages`)
- Écosystème Claude Code optimisé pour Next.js
- next-intl pour i18n FR/EN avec routing `/fr` et `/en`
- TypeScript obligatoire pour robustesse et DX

**Trade-offs:**
- ✓ SSG performant, prerender complet, SEO excellent
- ✓ Hot reload rapide, DX Claude Code optimale
- ✗ Learning curve App Router pour Bryan (mitigé par Claude Code)
- ✗ Bundle légèrement plus lourd que Astro (mais reste < 200KB gzipped)

**Alternatives considérées et rejetées :**
- **Astro** : plus léger mais moins d'écosystème React côté interactivité
- **Remix** : nécessite SSR runtime (pas purement statique)
- **SvelteKit** : moins d'assistance Claude Code, équipe pas familière

---

### Styling & UI

**Choice:** **Tailwind CSS + shadcn/ui + Framer Motion**

**Rationale:**
- Tailwind : classes utilitaires, purge automatique, bundle minimal
- shadcn/ui : composants React copy-paste de qualité premium (sobres, accessibles)
- Framer Motion : animations fluides pour hero number ticker et transitions scroll
- Aligné design system #0A1628 + #C9A84C via `tailwind.config.ts`

**Trade-offs:**
- ✓ Rapidité de dev, qualité design "luxe" atteignable
- ✗ Bundle Framer Motion ≈ 50KB (acceptable pour l'effet visuel)

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
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── coulisses/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── revalidate/
│   │   │   └── og/
│   │   └── layout.tsx
│   ├── components/             # Composants React
│   │   ├── ui/                 # shadcn/ui
│   │   ├── dashboard/          # KPIs, HeroMetric
│   │   ├── briefing/           # Briefing display
│   │   └── coulisses/          # Timeline, prompts
│   ├── lib/                    # Utils & clients
│   │   ├── r2.ts
│   │   ├── content.ts
│   │   └── i18n.ts
│   └── types/                  # TypeScript types
│       └── content.ts
├── messages/                   # i18n translations
│   ├── fr.json
│   └── en.json
├── scripts/
│   ├── pipeline/               # Pipeline scripts
│   │   ├── fetch-market-data.ts
│   │   ├── analyze-with-claude.ts
│   │   ├── detect-vix-alert.ts
│   │   ├── publish-to-r2.ts
│   │   └── notify-on-failure.ts
│   ├── pre-commit              # Secret scanner (déjà existant)
│   └── setup-hooks.sh          # Install hooks (déjà existant)
├── prompts/                    # Versioned AI prompts
│   ├── briefing-v01.md
│   ├── briefing-v02.md
│   └── ...
├── tests/
│   ├── unit/                   # Vitest
│   └── e2e/                    # Playwright
├── .github/
│   └── workflows/
│       ├── daily-pipeline.yml
│       ├── lighthouse-check.yml
│       └── ci.yml
├── docs/                       # Documentation BMAD
│   ├── product-brief-*.md
│   ├── prd-*.md
│   ├── architecture-*.md
│   └── bmm-workflow-status.yaml
├── bmad/                       # BMAD config
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

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

---

## 14. Phase de déploiement initial (bootstrap)

Actions ponctuelles AVANT de lancer le pipeline quotidien :

1. **Créer le bucket R2** `yieldfield-content` dans Cloudflare
2. **Bootstrapper l'historique VIX** (1 script `scripts/bootstrap-vix-history.ts` qui fetch 252 jours de VIX et upload dans R2 `archive/`)
3. **Configurer les secrets** GitHub Actions + Cloudflare Pages env vars
4. **Créer les prompts v01** dans `prompts/briefing-v01.md`
5. **Premier run manuel** du pipeline (`workflow_dispatch`)
6. **Valider le résultat** dans R2 + frontend local
7. **Activer le cron** (commenté initialement)
8. **Configurer UptimeRobot** sur le domaine
9. **Configurer Cloudflare Web Analytics** (token dans env)
10. **Domaine DNS** (après Issue #2 résolue)

---

## 15. Hand-off to Phase 4 — Sprint Planning

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
