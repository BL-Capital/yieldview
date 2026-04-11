---
title: "Architecture Decision Record: YieldField"
status: "final-draft"
workflowType: "architecture"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by Winston, System Architect, BMAD v6.3.0)"
methodology: "BMAD v6.3.0 — Phase 3 Solutioning — bmad-create-architecture workflow"
inputDocuments:
  - "docs/planning-artifacts/product-brief-yieldfield.md"
  - "docs/planning-artifacts/prd.md"
stepsCompleted:
  - "step-01-init"
  - "step-02-context"
  - "step-03-starter"
  - "step-04-decisions"
  - "step-05-patterns"
  - "step-06-structure"
  - "step-07-validation"
  - "step-08-complete"
---

# Architecture — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 2.0 (refaite en BMAD v6.3.0)
**Date :** 2026-04-11
**Architecte :** Emmanuel — WEDOOALL Solutions (System Architect)
**Méthodologie :** BMAD Method v6.3.0 — Phase 3 Solutioning
**Workflow :** `bmad-create-architecture` — 8 steps synthétisés en passe cohérente
**Input principal :** `docs/planning-artifacts/prd.md` (54 FRs + 23 NFRs, Level 3)

---

## 1. Project Context (Step 2)

### 1.1 Project profile

- **Type :** Site vitrine dynamique + pipeline IA quotidien (greenfield)
- **BMAD Level :** 3 (Complex, 12-40 stories)
- **Équipe :** 1 lead dev (Emmanuel) + Claude Code + 1 Product Owner (Bryan)
- **Timeline :** 6 semaines MVP + 2 semaines stabilisation = 8 semaines
- **Budget infrastructure :** ≤ 8 €/mois hors domaine

### 1.2 Contraintes structurantes (reprises du PRD)

1. **Coût ≤ 8 €/mois** — impose toute l'architecture serverless Cloudflare free tier
2. **Pas de backend serveur** — SSG + Edge Functions + R2 uniquement
3. **Pas de base SQL managée** — stockage JSON sur R2
4. **Pas de conseil d'investissement** — disclaimer légal omniprésent, formulations descriptives
5. **Bilingue FR/EN** dès le jour 1 — next-intl + génération IA bilingue
6. **APIs gratuites uniquement** — Finnhub primary + FRED + Alpha Vantage marginal
7. **Performance LCP < 2s / Lighthouse ≥ 90** — non négociable
8. **Aucune clé API dans le code** — secrets scanning + pre-commit hook

### 1.3 Qualité attributes clés (NFRs déterminantes)

- **Performance** (NFR1-6) — drive SSG, edge caching, bundle optimization
- **Reliability** (NFR7-9) — drive fallback strategies, retry logic, monitoring
- **Security** (NFR10-12) — drive secrets isolation, pre-commit hooks
- **Cost** (NFR13-14) — drive 100% free tier stack
- **Accessibility** (NFR15-17) — drive Radix Primitives + WCAG audits
- **i18n** (NFR20-21) — drive next-intl + bilingual AI generation

---

## 2. Starter Template Decision (Step 3)

### 2.1 Starter choisi

**Next.js 15 App Router — via `create-next-app@latest`**

```bash
npx create-next-app@latest yieldfield \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm
```

### 2.2 Justification

- **Next.js 15** : dernière version stable avec React 19 support, Partial Prerendering (PPR), Turbopack dev stable
- **App Router** : Server Components matures, Actions, nested layouts, parfait pour i18n routes `/fr`, `/en`
- **TypeScript strict** : robustesse obligatoire pour un projet multi-composants
- **Tailwind intégré** : design tokens cohérents, bundle optimisé par purge
- **src-dir** : sépare `src/` du config pour clarté

### 2.3 Ce que le starter décide (ne pas re-décider)

- Framework React : **Next.js 15**
- Language : **TypeScript 5.x strict**
- Styling : **Tailwind CSS 3.4.x**
- Dev server : **Turbopack**
- Linting : **ESLint 9 + config Next**
- Structure de base : `src/app/`, `src/components/`, `src/lib/`

---

## 3. Core Architectural Decisions (Step 4)

### 3.1 Decision Priority Analysis

**Critical Decisions (bloquent l'implémentation) :**
- Pattern applicatif (SSG vs SSR vs ISR) ✅
- Stockage des données (R2 vs D1 vs rien) ✅
- Stratégie de génération IA (1 appel vs 2 vs Opus+Haiku) ✅
- Stratégie bilingue (next-intl vs alternative) ✅
- Pipeline scheduling (GitHub Actions vs Cloudflare cron) ✅

**Important Decisions (shape architecture) :**
- UI component libraries (shadcn + Aceternity + Magic UI) ✅
- Animation engine (Motion 12 + Rive + Lottie) ✅
- Edge functions (Open Graph images dynamic) ✅
- Newsletter service (Buttondown) ✅
- Analytics (Cloudflare Web Analytics) ✅

**Deferred Decisions (post-MVP) :**
- React Three Fiber (V2 yield curve 3D)
- Migration JSON → D1 si besoin de requêtage
- Podcast ElevenLabs (V2)
- White-label B2B architecture

### 3.2 Data Architecture

**Decision 1 : Pattern applicatif**

**Choisi : Static Site Generation (SSG) + ISR selective + Edge Functions pour dynamique**

**Pourquoi :**
- Contenu change 1×/jour → SSG parfait, pas besoin de SSR
- Cloudflare Pages = CDN global gratuit → latence < 100 ms partout
- Incremental Static Regeneration pour revalidation sur demande après pipeline
- Edge Functions (Workers) pour OG images dynamiques + newsletter endpoint

**Alternatives rejetées :**
- ❌ SSR complet : coût Edge Functions trop élevé à l'échelle
- ❌ SPA client-only : SEO médiocre, LCP dégradé
- ❌ Astro : moins d'écosystème React côté interactivité (Rive, Motion)

---

**Decision 2 : Stockage persistance**

**Choisi : Cloudflare R2 (compatible S3) avec structure JSON**

**Pourquoi :**
- **Free tier** : 10 GB storage gratuit, zéro egress cost
- **Simplicité** : lecture via `fetch()` HTTP public, aucune auth requise côté frontend
- **Compatibilité S3** : SDK AWS standard pour le pipeline d'écriture
- **Pas de SQL** : le projet n'a pas besoin de requêtage complexe, 1 fichier `latest.json` + archives suffit

**Structure R2 :**
```
r2://yieldfield-content/
├── latest.json                 # Version courante publiée
├── pending.json                # Version générée en attente de validation humaine
├── archive/
│   ├── 2026-04-14.json        # Archives quotidiennes
│   ├── 2026-04-15.json
│   └── ...
├── vix-history/
│   └── vix-252d.json          # Historique VIX 252 jours glissants pour percentile
└── logs/
    └── runs-last-7.json        # Logs des 7 derniers runs pipeline
```

**Alternatives rejetées :**
- ❌ Cloudflare D1 (SQLite edge) : complexité inutile pour un seul fichier quotidien
- ❌ Supabase : hors budget et dépendance externe (confirmé explicitement non)
- ❌ GitHub comme storage : rate limits + pas de edge CDN

---

**Decision 3 : Schéma de données `latest.json`**

**Structure cible :**

```typescript
interface DailyAnalysis {
  // Metadata
  date: string;                      // "2026-04-14"
  generated_at: string;              // ISO 8601
  validated_at: string | null;       // ISO 8601 if manually validated
  pipeline_run_id: string;           // UUID
  version: 'ai' | 'manual-override'; // source of truth
  
  // Editorial content
  briefing: {
    fr: string;  // 4-5 phrases français
    en: string;  // Traduction Claude Haiku
  };
  tagline: {
    fr: string;
    en: string;
  };
  
  // Metadata chips
  metadata: {
    theme_of_day: { fr: string; en: string };
    certainty: 'preliminary' | 'definitive';
    upcoming_event: { fr: string; en: string } | null;
    risk_level: 'low' | 'medium' | 'high' | 'crisis';
  };
  
  // Market data (KPIs)
  kpis: Array<{
    id: string;              // "oat_10y", "vix", "spread_oat_bund", etc.
    category: 'rates' | 'spreads' | 'indices' | 'volatility' | 'macro';
    label: { fr: string; en: string };
    value: number;
    unit: string;             // "%", "bps", "", "$"
    change_day: number;
    change_pct: number;
    direction: 'up' | 'down' | 'flat';
    source: 'finnhub' | 'fred' | 'alpha_vantage' | 'calculated';
    timestamp: string;
    freshness_level: 'live' | 'stale' | 'very_stale';
  }>;
  
  // VIX Alert state
  alert: {
    active: boolean;
    level: 'warning' | 'alert' | 'crisis' | null;
    vix_current: number;
    vix_p90_252d: number;
    triggered_at: string | null;
  };
  
  // Archive of AI original (preserved even if manually overridden)
  ai_original?: {
    briefing: { fr: string; en: string };
    tagline: { fr: string; en: string };
  };
}
```

### 3.3 Authentication & Security

**Decision 4 : Authentification**

**Choisi : Aucune authentification utilisateur (site public)**

- Pas de comptes, pas de login, pas de session
- Admin = Git push (seul accès au R2 via GitHub Actions)

**Newsletter** : Buttondown gère l'auth côté abonnés (double opt-in par email)

---

**Decision 5 : Secrets management**

- **Pipeline (GitHub Actions)** : secrets dans `Settings > Secrets and variables > Actions`
  - `ANTHROPIC_API_KEY`
  - `FINNHUB_API_KEY`
  - `FRED_API_KEY`
  - `ALPHA_VANTAGE_API_KEY`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `BUTTONDOWN_API_KEY`
- **Frontend (Cloudflare Pages)** : aucune clé API côté client. Les seuls env vars Cloudflare :
  - `NEXT_PUBLIC_SITE_URL`
  - `CF_ANALYTICS_TOKEN` (public, ok)
- **Protection** : pre-commit hook déjà en place + GitHub secret scanning activé

---

**Decision 6 : Data validation**

**Choisi : Zod + schémas stricts à chaque frontière**

- Validation du `latest.json` à la lecture côté frontend (protège contre corruption)
- Validation des réponses Claude API à l'écriture côté pipeline (protège contre hallucinations de structure)
- Validation des données Finnhub/FRED à l'ingestion (protège contre schema drift)

### 3.4 API & Communication

**Decision 7 : Pattern de communication pipeline**

**Choisi : Pipeline séquentiel monolithique dans GitHub Actions (pas de microservices)**

```
┌────────────────────────────────────────────────────────────┐
│ GitHub Actions cron 6h UTC (workflow: daily-pipeline.yml) │
└────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 1. fetch-data.ts   │  ← Parallel fetch Finnhub + FRED + Alpha Vantage
  │                    │     Retries x3, fallback derniers valides
  └────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 2. compute-alert.ts│  ← Calcul VIX percentile 90/252j
  │                    │     Update vix-history/vix-252d.json
  └────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 3. generate-ai.ts  │  ← Claude Opus (FR briefing + tagline + metadata)
  │                    │     → Claude Haiku (EN traduction)
  │                    │     Validation Zod du schema retourné
  └────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 4. pending-r2.ts   │  ← Upload pending.json sur R2
  │                    │     Trigger notification Bryan (email ou webhook)
  └────────────────────┘
           │
           ▼ (wait 15 minutes OR manual approval)
  ┌────────────────────┐
  │ 5. publish-r2.ts   │  ← Si no override: copie pending.json → latest.json
  │                    │     Si override: merge manual + conservation ai_original
  │                    │     Archive daté
  │                    │     Trigger Cloudflare Pages revalidate
  └────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 6. newsletter.ts   │  ← Fetch latest.json
  │                    │     Envoie à Buttondown via API
  └────────────────────┘
           │
           ▼
  ┌────────────────────┐
  │ 7. log-run.ts      │  ← Append à runs-last-7.json
  │                    │     Si 2 échecs consécutifs → GitHub Issue auto
  └────────────────────┘
```

**Pourquoi séquentiel monolithique :**
- Simplicité (pas d'orchestration complexe)
- Debug facile (un seul log)
- Pas de queue/event bus (coût nul)
- Erreur fail-fast avec fallback gracieux

**Alternatives rejetées :**
- ❌ Multiple workflows indépendants : perte de visibilité, coordination plus dure
- ❌ Cloudflare Workers scheduled : limite Free tier à 3 crons, moins de logs
- ❌ Event-driven : over-engineering pour 1 run/jour

---

**Decision 8 : API frontend → backend**

**Choisi : Aucune API interne. Le frontend lit directement R2 via fetch() HTTP public.**

```typescript
// Example: src/lib/content.ts
export async function getLatestAnalysis(): Promise<DailyAnalysis> {
  const url = `https://yieldfield-content.your-account.r2.cloudflarestorage.com/latest.json`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to load analysis');
  return LatestAnalysisSchema.parse(await res.json()); // Zod validation
}
```

**Exceptions (edge functions Cloudflare Workers) :**
1. `/api/og` — génération Open Graph images (@vercel/og sur Edge Runtime)
2. `/api/newsletter/subscribe` — proxy vers Buttondown (protège clé API)
3. `/api/revalidate` — webhook post-pipeline pour ISR

### 3.5 Frontend Architecture

**Decision 9 : State management**

**Choisi : React Server Components + props drilling local + Zustand pour état UI client minimal**

- **RSC** : fetch data (R2) dans les Server Components, pas de client fetch
- **Props drilling** : les 2 niveaux de profondeur max, pas besoin de context
- **Zustand** : uniquement pour état UI client (prefer dark/light, reduced-motion override, drawer states) — ≤ 2 stores

**Rejeté :**
- ❌ Redux/Redux Toolkit : overkill pour la taille du projet
- ❌ React Query / TanStack Query : pas de data fetching côté client (tout SSR)
- ❌ Jotai : pas de besoin d'atoms granulaires

---

**Decision 10 : UI components — stratégie en couches**

**Couche 1 — shadcn/ui + Radix Primitives (fondation accessible)**

Composants copy-paste dans `src/components/ui/` :
- Button, Card, Dialog, DropdownMenu, Input, Toast, Tooltip, Sheet, ScrollArea
- Source : `npx shadcn@latest add <component>`
- Radix Primitives sous-jacents → WCAG AA natif

**Couche 2 — Aceternity UI Pro (composants signature)**

Composants copy-paste dans `src/components/aceternity/` :
- Aurora Background
- Background Beams
- Bento Grid
- Tracing Beam
- Text Generate Effect
- Shimmer Glare Card
- Meteors
- Animated Tooltip

**Couche 3 — Magic UI (composants complémentaires open-source)**

Composants copy-paste dans `src/components/magic-ui/` :
- Number Ticker
- Animated Gradient Text
- Pulsating Dot
- Marquee
- Shine Border / Neon Gradient Card
- Dot Pattern

**Couche 4 — Business components (propres au projet)**

Dans `src/components/` :
- `dashboard/` : HeroSection, KpiBentoGrid, KpiCard, FreshnessIndicator
- `briefing/` : BriefingPanel, TaglineHeader, MetadataChips
- `coulisses/` : TimelineStep, PromptCodeBlock, PipelineLogsTable
- `alerts/` : AlertBanner, CrisisIndicator
- `rive/` : HeroAvatar (Rive wrapper)
- `lottie/` : LottieIcon (dotLottie wrapper)
- `common/` : Header, Footer, LanguageSwitcher, ContentContainer

**Pourquoi copy-paste plutôt que dependency npm :**
- Contrôle total (on peut modifier librement)
- Zéro runtime dependency supplémentaire
- Pas de conflit de version

---

**Decision 11 : Animation engine**

**Choisi : Motion 12 (anciennement Framer Motion) + Rive + Lottie/dotLottie**

- **Motion 12** (`motion`) : base d'animation React (layout animations, scroll-triggered, gesture) — exploit NFR reduced-motion
- **Rive** (`@rive-app/react-canvas`) : avatar interactif hero, state machines, ~60-100 KB
- **Lottie/dotLottie** (`@dotlottie/react-player`) : micro-animations (icônes KPI up/down/flat, loaders)

**Strategy performance (NFR3 < 250 KB bundle) :**
- Rive : lazy-loaded via `dynamic(() => import('@/components/rive/HeroAvatar'), { ssr: false })`
- Lottie : lazy-loaded par composant via IntersectionObserver
- Motion : tree-shaking agressif (imports spécifiques, pas `motion/react` tout entier)
- Aceternity/Magic UI : server-side skeleton pour le hero, hydratation progressive

### 3.6 Infrastructure & Deployment

**Decision 12 : Hosting**

**Choisi : Cloudflare Pages (free tier)**

- Build automatique à chaque push sur `main`
- Preview deployments sur chaque PR
- HTTPS auto
- CDN global
- Intégration native avec R2, Workers, Web Analytics

**Rejeté :**
- ❌ Vercel : free tier trop restrictif (bandwidth), pas intégré R2
- ❌ Netlify : pareil, moins intégré à Cloudflare ecosystem

---

**Decision 13 : CI/CD**

**GitHub Actions avec 3 workflows :**

1. **`daily-pipeline.yml`** — cron 6h UTC, exécute le pipeline complet (voir Decision 7)
2. **`lighthouse-ci.yml`** — sur chaque PR + main, bloque merge si score < 90
3. **`build-check.yml`** — sur chaque PR, vérifie typecheck + lint + tests unitaires

---

**Decision 14 : Monitoring**

- **Uptime** : UptimeRobot free tier (50 monitors)
- **Analytics** : Cloudflare Web Analytics (free, privacy-first, sans cookie)
- **Error tracking** : Sentry free tier (5k events/month) — Could Have, pas MVP
- **Logs pipeline** : GitHub Actions UI + `runs-last-7.json` sur R2 pour page Coulisses
- **Alertes** : GitHub Issues auto-créées si 2 runs consécutifs échouent

### 3.7 Cascading Implications

Chaque décision influence les autres :
- **R2 JSON storage** → pas besoin de React Query (tout en RSC)
- **SSG + ISR** → bundle JS initial minimal (favorise NFR3)
- **Opus → Haiku** → 2 appels séquentiels dans le pipeline (pas 1 seul appel bilingue)
- **Cloudflare Pages** → fonts self-hosted (pas de Google Fonts runtime, économise DNS lookup)
- **No auth** → pas de middleware edge, tout en statique

---

## 4. Implementation Patterns (Step 5)

### 4.1 Pattern : Data fetching in Server Components

```typescript
// src/app/[locale]/page.tsx
import { getLatestAnalysis } from '@/lib/content';
import { HeroSection } from '@/components/dashboard/HeroSection';

export const revalidate = 3600; // ISR, revalidate every hour

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: 'fr' | 'en' };
}) {
  const analysis = await getLatestAnalysis();
  return <HeroSection analysis={analysis} locale={locale} />;
}
```

**Règle :** data fetch dans les Server Components uniquement. Client Components reçoivent les données en props.

---

### 4.2 Pattern : Zod validation at boundaries

```typescript
// src/lib/schemas/analysis.ts
import { z } from 'zod';

export const KpiSchema = z.object({
  id: z.string(),
  category: z.enum(['rates', 'spreads', 'indices', 'volatility', 'macro']),
  label: z.object({ fr: z.string(), en: z.string() }),
  value: z.number(),
  unit: z.string(),
  change_day: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
  timestamp: z.string().datetime(),
  freshness_level: z.enum(['live', 'stale', 'very_stale']),
});

export const AnalysisSchema = z.object({
  date: z.string(),
  generated_at: z.string().datetime(),
  briefing: z.object({ fr: z.string(), en: z.string() }),
  tagline: z.object({ fr: z.string(), en: z.string() }),
  metadata: z.object({
    theme_of_day: z.object({ fr: z.string(), en: z.string() }),
    certainty: z.enum(['preliminary', 'definitive']),
    upcoming_event: z.object({ fr: z.string(), en: z.string() }).nullable(),
    risk_level: z.enum(['low', 'medium', 'high', 'crisis']),
  }),
  kpis: z.array(KpiSchema),
  alert: z.object({
    active: z.boolean(),
    level: z.enum(['warning', 'alert', 'crisis']).nullable(),
    vix_current: z.number(),
    vix_p90_252d: z.number(),
  }),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
```

**Règle :** toute donnée qui traverse une frontière (HTTP, fichier, API externe) est validée par Zod.

---

### 4.3 Pattern : Progressive hydration pour performance

```typescript
// src/app/[locale]/page.tsx (Server Component)
import { HeroSkeleton } from '@/components/dashboard/HeroSkeleton';
import dynamic from 'next/dynamic';

// Rive avatar : client-only, lazy, avec fallback SVG
const HeroAvatar = dynamic(() => import('@/components/rive/HeroAvatar'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

// Aceternity Aurora : client pour l'animation, mais skeleton côté SSR
const AuroraBackground = dynamic(
  () => import('@/components/aceternity/AuroraBackground'),
  { ssr: true, loading: () => null }
);
```

**Règle :** tout composant "luxe" est lazy-loaded avec skeleton. Le hero doit rendre en < 1 s même si Rive ne charge pas.

---

### 4.4 Pattern : i18n avec next-intl

```typescript
// src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['fr', 'en'] as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Règle :** aucun texte hardcodé. Tous les labels UI passent par `useTranslations()`. Les contenus dynamiques (briefing, tagline) sont déjà bilingues dans `latest.json`.

---

### 4.5 Pattern : Prompts versionnés

**Convention :** un fichier markdown par version de prompt.

```
prompts/
├── briefing-v01.md           # Version initiale
├── briefing-v02.md           # +proscription list
├── briefing-v03.md           # +few-shot Matt Levine
├── briefing-v04.md           # +anchoring numérique
├── briefing-v05.md           # +variabilité ouverture
├── briefing-v06.md           # Version production actuelle
└── translation-haiku-v01.md  # Prompt traduction EN
```

**Règle :** chaque nouvelle version = nouveau fichier + commit explicite. Le diff entre versions est lisible dans le repo et affiché dans la page Coulisses.

---

### 4.6 Pattern : Fallback gracieux

```typescript
// src/lib/content.ts
export async function getLatestAnalysis(): Promise<Analysis> {
  try {
    const res = await fetch(R2_URL + '/latest.json', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`R2 fetch failed: ${res.status}`);
    return AnalysisSchema.parse(await res.json());
  } catch (error) {
    console.error('Failed to load latest.json, falling back to stale', error);
    // Fallback to last known good version from build-time bundle
    return (await import('@/data/fallback-analysis.json')).default;
  }
}
```

**Règle :** chaque point de failure externe a un fallback. Le site doit rendre en mode dégradé avec un indicateur visible.

---

### 4.7 Pattern : Reduced motion respect

```typescript
// src/hooks/usePrefersReducedMotion.ts
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    mq.addEventListener('change', (e) => setPrefersReduced(e.matches));
  }, []);
  return prefersReduced;
}

// Usage in any animated component
const NumberTicker = ({ value }: { value: number }) => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <span>{value}</span>;
  return <motion.span animate={{ ... }}>{value}</motion.span>;
};
```

**Règle :** toute animation respecte `prefers-reduced-motion`. Rive avatar → pose statique en reduced motion.

---

## 5. Source Tree Structure (Step 6)

### 5.1 Top-level structure

```
yieldfield/
├── _bmad/                          # BMAD v6.3.0 config (après upgrade)
├── .claude/                        # BMAD skills (41 skills v6.3.0)
├── .github/
│   └── workflows/
│       ├── daily-pipeline.yml      # Cron quotidien
│       ├── lighthouse-ci.yml       # Performance gates
│       └── build-check.yml         # Typecheck + lint + test
├── docs/
│   ├── PRD_BMAD_Site_Finance_Bryan_v1.0.docx   # Historique utilisateur
│   ├── PRD_BMAD_Site_Finance_Bryan_v1.1.docx
│   └── planning-artifacts/
│       ├── product-brief-yieldfield.md          # BMAD Phase 1
│       ├── prd.md                               # BMAD Phase 2
│       ├── architecture.md                      # BMAD Phase 3 (ce fichier)
│       ├── ux-design-specification.md           # BMAD Phase 3 (UX)
│       ├── epics.md                             # BMAD Phase 3 (bmad-create-epics-and-stories)
│       └── sprint-plan.md                       # BMAD Phase 4
├── messages/                       # Translations next-intl
│   ├── fr.json
│   └── en.json
├── prompts/                        # Prompts IA versionnés
│   ├── briefing-v01.md
│   ├── briefing-v02.md
│   ├── ...
│   └── translation-haiku-v01.md
├── public/
│   ├── fonts/                      # Self-hosted fonts
│   │   ├── InstrumentSerif-Regular.woff2
│   │   ├── InstrumentSerif-Italic.woff2
│   │   ├── Inter-variable.woff2
│   │   └── JetBrainsMono-variable.woff2
│   ├── rive/
│   │   └── avatar.riv              # Rive avatar file (< 100 KB)
│   ├── lottie/
│   │   ├── arrow-up.lottie
│   │   ├── arrow-down.lottie
│   │   ├── flat.lottie
│   │   └── ...
│   └── og-fallback.png             # Fallback OG image
├── scripts/
│   ├── pipeline/
│   │   ├── fetch-data.ts           # Step 1 pipeline
│   │   ├── compute-alert.ts        # Step 2 pipeline
│   │   ├── generate-ai.ts          # Step 3 pipeline
│   │   ├── pending-r2.ts           # Step 4 pipeline
│   │   ├── publish-r2.ts           # Step 5 pipeline
│   │   ├── newsletter.ts           # Step 6 pipeline
│   │   ├── log-run.ts              # Step 7 pipeline
│   │   └── bootstrap-vix-history.ts  # One-shot init VIX 252 jours
│   ├── pre-commit                   # Scan secrets (existant)
│   └── setup-hooks.sh               # Install hooks (existant)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── coulisses/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── error.tsx
│   │   ├── api/
│   │   │   ├── og/route.tsx         # Dynamic OG images (@vercel/og)
│   │   │   ├── newsletter/subscribe/route.ts  # Buttondown proxy
│   │   │   └── revalidate/route.ts  # Post-pipeline webhook
│   │   └── layout.tsx               # Root layout
│   ├── components/
│   │   ├── ui/                      # shadcn/ui
│   │   ├── aceternity/              # Aceternity UI Pro
│   │   ├── magic-ui/                # Magic UI
│   │   ├── dashboard/               # Business: Hero, KpiCard, Bento
│   │   ├── briefing/                # Business: Briefing, Tagline, MetadataChips
│   │   ├── coulisses/               # Business: Timeline, PromptCodeBlock, LogsTable
│   │   ├── alerts/                  # Business: AlertBanner, CrisisIndicator
│   │   ├── rive/                    # Rive wrapper: HeroAvatar
│   │   ├── lottie/                  # Lottie wrapper: LottieIcon
│   │   └── common/                  # Header, Footer, LanguageSwitcher
│   ├── lib/
│   │   ├── content.ts               # R2 client, fetch latest.json
│   │   ├── schemas/                 # Zod schemas
│   │   │   ├── analysis.ts
│   │   │   ├── kpi.ts
│   │   │   └── alert.ts
│   │   ├── r2.ts                    # R2 write client (pipeline)
│   │   ├── claude.ts                # Anthropic SDK wrapper (pipeline)
│   │   ├── finnhub.ts               # Finnhub API client (pipeline)
│   │   ├── fred.ts                  # FRED API client (pipeline)
│   │   ├── i18n.ts                  # next-intl config
│   │   └── motion-config.ts         # Motion 12 reduced-motion config
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useRiveAvatar.ts
│   │   └── useAnalytics.ts
│   ├── stores/
│   │   ├── ui-store.ts              # Zustand: drawer states, etc.
│   │   └── settings-store.ts        # Zustand: theme override, etc.
│   ├── data/
│   │   └── fallback-analysis.json   # Fallback in case of R2 failure
│   ├── types/
│   │   ├── content.ts
│   │   └── rive.ts
│   └── i18n.ts                      # next-intl request config
├── tests/
│   ├── unit/                        # Vitest
│   │   ├── lib/
│   │   └── components/
│   └── e2e/                         # Playwright
│       ├── homepage.spec.ts
│       ├── coulisses.spec.ts
│       ├── i18n.spec.ts
│       └── accessibility.spec.ts
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── next.config.mjs                  # Cloudflare Pages preset
├── tailwind.config.ts               # Design tokens (cf. UX design spec)
├── tsconfig.json
├── package.json
├── README.md
└── LICENSE
```

### 5.2 Key dependencies (`package.json`)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-intl": "^3.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x",
    "@radix-ui/react-toast": "^1.x",
    "@radix-ui/react-tooltip": "^1.x",
    "tailwindcss": "^3.4.x",
    "tailwind-merge": "^2.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "motion": "^12.0.0",
    "@rive-app/react-canvas": "^4.x",
    "@dotlottie/react-player": "^1.x",
    "@vercel/og": "^0.6.x",
    "@aws-sdk/client-s3": "^3.x",
    "@anthropic-ai/sdk": "^0.30.x",
    "zod": "^3.x",
    "lucide-react": "^0.x",
    "zustand": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/node": "^20.x",
    "vitest": "^2.x",
    "@playwright/test": "^1.x",
    "@lhci/cli": "^0.14.x",
    "eslint": "^9.x",
    "prettier": "^3.x"
  }
}
```

**Note importante :** shadcn/ui, Aceternity UI Pro et Magic UI **ne sont pas des dépendances npm**. Ils sont copy-pasted dans `src/components/ui/`, `src/components/aceternity/`, et `src/components/magic-ui/`. Cela garantit zéro runtime dependency et contrôle total.

---

## 6. Architecture Validation (Step 7)

### 6.1 FR → Architecture mapping

Chaque capacité (FR) du PRD est-elle supportée par un composant architectural ? Vérification complète :

**Capability Area 1 — Daily Editorial Content (FR1-FR8) :**
- FR1-FR8 → Pipeline `generate-ai.ts` (Claude Opus + Haiku) + `pending-r2.ts` + `publish-r2.ts` ✅
- Override manuel → dual file pattern (`pending.json` + `latest.json`) ✅
- VIX tension tone → `compute-alert.ts` injecte le niveau de risque dans le prompt ✅

**Capability Area 2 — Market Data & KPIs (FR9-FR20) :**
- FR9-FR12 → `fetch-data.ts` avec clients Finnhub/FRED/Alpha Vantage ✅
- FR13-FR14 → Calculs locaux dans `compute-alert.ts` + sauvegarde `vix-history/` ✅
- FR15-FR17 → Bento Grid React component consumé depuis `latest.json` ✅
- FR18-FR20 → Fallback logic dans `fetch-data.ts` + Archive R2 ✅

**Capability Area 3 — Editorial Experience (FR21-FR29) :**
- FR21 → `<HeroAvatar>` Rive wrapper avec state machine ✅
- FR22-FR23 → Text Generate Effect (Aceternity) + Animated Gradient Text (Magic UI) ✅
- FR24 → `<MetadataChips>` React component ✅
- FR25-FR26 → `<NumberTicker>` (Magic UI) + `<PulsatingDot>` (Magic UI) ✅
- FR27 → `<Marquee>` (Magic UI) ✅
- FR28 → `<AlertBanner>` avec Meteors (Aceternity) + Neon Gradient Card (Magic UI) ✅
- FR29 → Disclaimer rendu en-tête du `<BriefingPanel>` ✅

**Capability Area 4 — Coulisses Page (FR30-FR37) :**
- FR30 → CTA dans `<HeroSection>` vers `/[locale]/coulisses` ✅
- FR31 → `<TracingBeam>` (Aceternity) ✅
- FR32 → MDX files dans `src/app/[locale]/coulisses/` ou `messages/coulisses/` ✅
- FR33-FR34 → `<PromptCodeBlock>` avec Copy button shine ✅
- FR35 → `<PipelineLogsTable>` consommant `logs/runs-last-7.json` ✅
- FR36 → `<RiveAvatarPreview>` avec toggles des états ✅
- FR37 → Diagramme SVG statique dans MDX ✅

**Capability Area 5 — i18n & Navigation (FR38-FR43) :**
- FR38-FR42 → next-intl + `<LanguageSwitcher>` ✅
- FR43 → `<Header>` avec nav globale ✅

**Capability Area 6 — Distribution & Engagement (FR44-FR49) :**
- FR44-FR46 → `/api/newsletter/subscribe` + Buttondown integration + step 6 pipeline ✅
- FR47-FR48 → `/api/og` Edge Function avec @vercel/og ✅
- FR49 → Route `/[locale]/feed.xml` statique SSG ✅

**Capability Area 7 — Observability & Operations (FR50-FR54) :**
- FR50 → UptimeRobot config externe ✅
- FR51 → GitHub Actions logs + `runs-last-7.json` ✅
- FR52 → Cloudflare Web Analytics script dans `layout.tsx` ✅
- FR53 → Script Node dans `log-run.ts` crée Issue via `gh api` ✅
- FR54 → Retry logic dans `fetch-data.ts` + `generate-ai.ts` ✅

**Coverage :** 54/54 FRs ✅

### 6.2 NFR → Architecture mapping

- **NFR1-6 Performance** → SSG + Edge Caching + progressive hydration + bundle budget ✅
- **NFR7-9 Reliability** → Fallback strategies, retry, monitoring ✅
- **NFR10-12 Security** → Secrets isolation, pre-commit hook, GitHub secret scanning ✅
- **NFR13-14 Cost** → 100 % free tier stack ✅
- **NFR15-17 Accessibility** → Radix Primitives + audits Axe/NVDA ✅
- **NFR18-19 Compatibility** → Next.js standard browser support + responsive breakpoints ✅
- **NFR20-21 i18n** → next-intl + bilingual AI generation ✅
- **NFR22-23 Observability** → GitHub Actions logs + Cloudflare Analytics ✅

**Coverage :** 23/23 NFRs ✅

### 6.3 Risques architecturaux

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| A1 | Claude API rate limit ou quota épuisé | Low | High | Monitoring coût Anthropic + alert à 10 €/mois + modèle Haiku pour traduction |
| A2 | Finnhub free tier insuffisant (60 req/min OK pour 1 build/jour mais marge faible) | Low | Medium | FRED en backup + cache 24h + quota monitoring |
| A3 | VIX archive insuffisante (< 252 j) au lancement | Medium | Medium | Bootstrap one-shot script avec historique CBOE public |
| A4 | GitHub Actions cron retard jusqu'à 60 min | High | Low | Cron 6h UTC pour publication avant 8h30 CET (marge 2h30) |
| A5 | Rive avatar non prêt au launch | Medium | Medium | Fallback SVG statique. Intégration Rive incrémentale post-MVP |
| A6 | React 19 incompatibilité libs tierces | Medium | Medium | Smoke tests au setup initial. Fallback Next 14 + React 18 si blocage |
| A7 | Aceternity/Magic UI client-heavy dégradent LCP | Medium | Medium | Progressive hydration + SSR skeletons + Lighthouse CI bloque merge si < 90 |
| A8 | R2 public bucket exposé aux scrapers | Low | Low | Rate limiting Cloudflare côté lecture + structure JSON minimaliste |
| A9 | Override manuel pas utilisable par Bryan en mobilité | Medium | Low | Notification email avec lien direct vers PR/edit GitHub |
| A10 | Bundle JS dépasse 250 KB avec toutes les libs premium | Medium | Medium | Bundle analyzer à chaque build + lazy-loading strict + tree-shaking |
| A11 | Motion 12 bundle mobile | Low | Medium | Tree-shaking imports, lazy-load non-critical animations |
| A12 | Lottie assets insuffisants ou qualité insuffisante | Low | Low | Fallback Lucide React statique |
| A13 | Alpha Vantage API définitivement dépréciée | Medium | Low | Alpha Vantage marginal uniquement, retrait complet possible sans impact |
| A14 | Hallucinations Claude sur chiffres financiers | Medium | High | Validation Zod + mode override humain + alerte si 2 jours d'écart avec données brutes |

### 6.4 Implementation sequence (dependencies-first)

**Semaine 1 — Foundation**
1. `create-next-app` + Tailwind + shadcn/ui base
2. next-intl + routes `/fr` `/en` squelette
3. Design tokens Tailwind (cf. UX spec)
4. Fonts self-hosted (Instrument Serif + Inter + JetBrains Mono)
5. Layout `<Header>` + `<Footer>` + `<LanguageSwitcher>`
6. Clone dépôt GitHub, structure source tree

**Semaine 2 — Data pipeline backbone**
7. Clients API : Finnhub, FRED, Alpha Vantage
8. Zod schemas : Analysis, KPI, Alert
9. R2 client (S3-compat SDK)
10. Script `fetch-data.ts` + mock output JSON
11. Script `compute-alert.ts` avec VIX percentile
12. Bootstrap script `bootstrap-vix-history.ts` (one-shot)

**Semaine 3 — AI generation + storage**
13. Client Claude API (SDK Anthropic)
14. Prompt `briefing-v01.md` + traduction Haiku
15. Script `generate-ai.ts` + validation Zod
16. Script `pending-r2.ts` + `publish-r2.ts`
17. Script `log-run.ts` + GitHub Issue auto
18. GitHub Actions workflow `daily-pipeline.yml`
19. Premier run manuel (`workflow_dispatch`)

**Semaine 4 — Core UI components**
20. Aceternity Aurora Background + Bento Grid
21. Magic UI Number Ticker + Animated Gradient + Pulsating Dot
22. `<KpiCard>`, `<KpiBentoGrid>`, `<FreshnessIndicator>`
23. `<BriefingPanel>`, `<TaglineHeader>`, `<MetadataChips>`
24. `<HeroSection>` assemblage

**Semaine 5 — Rive, Coulisses, Alert**
25. Rive avatar (fallback SVG d'abord, réel après)
26. `<HeroAvatar>` intégration avec state machine
27. Lottie icons pour KPI arrows
28. Aceternity Tracing Beam → page Coulisses
29. `<PromptCodeBlock>` + `<PipelineLogsTable>`
30. `<AlertBanner>` conditionnel (Meteors + Neon)

**Semaine 6 — i18n complet + Distribution**
31. Traductions FR/EN complètes
32. `/api/og` Edge Function (@vercel/og)
33. `/api/newsletter/subscribe` proxy Buttondown
34. Script `newsletter.ts` dans pipeline
35. Open Graph dynamique + Twitter Cards
36. Flux RSS statique

**Semaines 7-8 — Stabilisation**
37. Accessibilité WCAG 2.1 AA (Axe + NVDA + zoom 200 %)
38. Lighthouse CI + optimisations bundle
39. Tests e2e Playwright
40. Soft launch (sous-domaine staging 2 semaines)
41. Revue juridique ciblée
42. Domaine .io + DNS + HTTPS
43. Hard launch public

---

## 7. Gate Check & Completeness (Step 8)

### 7.1 Architecture validation checklist

- [x] Tous les FRs (54) mappés à des composants ou scripts
- [x] Tous les NFRs (23) adressés par une décision architecturale explicite
- [x] Toutes les décisions critiques tranchées (pattern applicatif, stockage, IA, bilingue, scheduling)
- [x] Stack technique entièrement compatible avec le budget ≤ 8 €/mois
- [x] Risques identifiés et mitigés (14 risques catalogués)
- [x] Patterns d'implémentation documentés (7 patterns)
- [x] Source tree structure définie
- [x] Dependencies listées avec versions majeures
- [x] Implementation sequence ordonnée par dépendances (6+2 semaines)
- [x] Compatible avec workflow UX Design en parallèle
- [x] Prêt pour `bmad-create-epics-and-stories` et `bmad-sprint-planning`

### 7.2 Points encore ouverts (non-bloquants)

- **Nom de domaine final** (Issue GitHub #2) — nécessaire pour HTTPS + OG + SEO, mais dev peut démarrer sans
- **Budget exact revue juridique** (500 € estimé)
- **Modalité notification override** (email + lien GitHub PR vs Slack webhook vs dashboard custom)
- **Cadence exacte rotation prompts** (hebdo vs conditionnel) — à définir en Phase 4

### 7.3 Décisions documentées

L'ensemble de cette architecture est **binding** pour les workflows suivants :
- UX Designer (Sally) ne concevra que ce qui est supporté par l'architecture
- Epic writer (John) ne créera que des stories implémentables avec cette architecture
- Developer (Amelia) implementera exactement cette structure et ces patterns

Toute déviation nécessite un amendement explicite de ce document.

---

## 8. Changelog vs architecture v1.x (avant upgrade BMAD v6.3.0)

| # | Changement | Motivation |
|---|---|---|
| 1 | Produit via workflow BMAD v6.3.0 officiel (step files lus manuellement) | Upgrade méthodologique v6.0 → v6.3.0 |
| 2 | Stack inchangée (Next 15, React 19, Motion 12, Aceternity Pro + Magic UI, Rive, Lottie, Cloudflare) | Décisions déjà validées avant upgrade |
| 3 | Schéma `latest.json` formalisé avec TypeScript types | Meilleure traçabilité et validation |
| 4 | Pattern pipeline séquentiel explicite (7 steps) | Refléter la structure réelle du backend |
| 5 | Dual file pattern pending.json + latest.json pour override humain | Résoudre la tension "IA jamais manuelle" vs "override" |
| 6 | Risques architecturaux passés de 12 à 14 (A13 Alpha Vantage, A14 hallucinations financières) | Enrichissement depuis le Skeptic review du Product Brief |
| 7 | Implementation sequence réordonnée en 43 étapes sur 8 semaines | Alignement avec timeline PRD v2 révisée |

---

## 9. Completion

**Status :** FINAL-DRAFT — Prêt pour :
1. Workflow parallèle `bmad-create-ux-design` (Sally)
2. Gate check `bmad-check-implementation-readiness` (Winston)
3. Workflow `bmad-create-epics-and-stories` (John)
4. Workflow `bmad-sprint-planning` (Scrum Master)
5. Workflow `bmad-dev-story` (Amelia)

**Validation requise auprès du Product Owner (Bryan)** :
- Ajoutée à l'issue GitHub de validation globale (Phase E du plan d'upgrade)

---

*Document généré via BMAD v6.3.0 workflow `bmad-create-architecture` — 8 steps synthétisés en une passe cohérente.*
*System Architect facilitateur : Claude (Opus 4.6 avec contexte 1M) jouant le rôle de Winston, System Architect BMAD.*
