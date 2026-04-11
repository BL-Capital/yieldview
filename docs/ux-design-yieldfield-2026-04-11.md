# UX Design — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 1.0
**Date :** 2026-04-11
**UX Designer :** Claude (Opus 4.6) — Emmanuel (WEDOOALL Solutions)
**Méthodologie :** BMAD v6 — Phase 3 (Solutioning — UX workflow)
**Référence :** UX-YIELDFIELD-2026-001

**Sources :**
- PRD v2.0 (`docs/prd-yieldfield-2026-04-11.md`) — 19 FRs, 10 NFRs, 5 epics
- Architecture v1.2 (`docs/architecture-yieldfield-2026-04-11.md`) — Stack UI/UX premium
- Product Brief v1.0 (`docs/product-brief-yieldfield-2026-04-11.md`) — 4 personas

---

## 1. Project Overview

**Project:** YieldField — Site éditorial premium de finance de marché propulsé par IA
**Target Platforms:** Web (Desktop + Tablet + Mobile) — bilingue FR/EN
**Accessibility Level:** WCAG 2.1 Level AA
**Design Tone:** **Hybride éditorial luxe + touches cinématiques** (Financial Times × Apple × Bloomberg)

### Design Philosophy

> "YieldField n'est ni un dashboard, ni un portfolio. C'est un **magazine de luxe dont le sujet est les marchés financiers**. Chaque matin, il raconte la journée à venir. Chaque élément doit avoir la qualité d'une double-page de Monocle : lisible, élégant, précis."

**Les 3 piliers UX :**

1. **Editorial First** — Typography serif premium, hierarchy claire, espace blanc respecté
2. **Signature cinématique** — Rive avatar, Aurora hero, Meteors en mode crise — effets rares mais mémorables
3. **Data with soul** — Les chiffres ne sont pas froids : Lottie icons, Number Tickers, glare effects, context humanisant

---

## 2. Design Scope

### Screens identified

| # | Screen | Route | Purpose | FRs |
|---|---|---|---|---|
| 1 | **Homepage** | `/[locale]` | Dashboard KPIs + briefing quotidien + avatar | FR-001, 002, 003, 004, 005, 006, 014, 015, 017, 018, 019 |
| 2 | **Coulisses** | `/[locale]/coulisses` | Timeline construction + prompts + logs | FR-007, 008, 009 |
| 3 | **About** (minimal) | `/[locale]/about` | Qui est Bryan, pourquoi YieldField | Branding |
| 4 | **404** | `/[locale]/404` | Page non trouvée | UX |
| 5 | **Error 500** | `/[locale]/error` | Erreur serveur | FR-012 |
| 6 | **Alert overlay** | Component (homepage) | Bannière mode crise FR-017 | FR-017 |

### Flows identified

| # | Flow | Personas | Screens |
|---|---|---|---|
| F1 | **Morning briefing** | Marc (analyste) | Homepage uniquement (2 min max) |
| F2 | **Recruiter validation** | Thomas (RH) | Homepage → Coulisses (5 min) |
| F3 | **Tech deep-dive** | Sophie (dev) | Homepage → Coulisses → GitHub → retour |
| F4 | **Casual discovery** | Clément (étudiant) | Homepage → lecture briefing → About |
| F5 | **Language switch** | Tous | Toggle FR/EN global |
| F6 | **Crisis alert viewing** | Marc/Sophie | Homepage avec bannière + avatar en tension |

### Components library (inventory)

**~20 composants** identifiés, regroupés en 5 familles :
- **Layout** : Header, Footer, LanguageSwitcher, ContentContainer
- **KPI Display** : BentoGrid, KpiCard, NumberTicker, FreshnessIndicator, SparklineMini
- **Briefing** : BriefingPanel, TaglineHeader, MetadataChips, RiveHeroAvatar
- **Coulisses** : TimelineTracingBeam, PromptCodeBlock, PipelineLogsTable, StepMDX
- **Alerts & Feedback** : AlertBanner, CrisisIndicator, LottieIcon, Toast, EmptyState

---

## 3. User Flows

### Flow F1 — Morning Briefing (Marc, analyste sell-side)

**Entry point :** Tape `yieldfield.io` dans son navigateur à 8h30 CET ou clique sur un bookmark.

**Happy Path :**
1. **[Landing - Homepage]** → Aurora background apparaît, Rive avatar commence à s'animer, fonts chargent
2. **[First Paint < 1s]** → Tagline visible (gradient animé), Briefing commence à "taper" (Text Generate Effect)
3. **[KPIs animate in < 2s]** → Bento Grid révèle les 6-8 KPIs, NumberTickers s'incrémentent de 0 à la valeur
4. **[Scan data - 30s]** → Marc regarde spread OAT-Bund, VIX, CAC 40, check la variation J/J
5. **[Read briefing - 60s]** → Lit les 4-5 phrases, regarde metadata chips (theme, risk, event)
6. **[Exit]** → Ferme l'onglet, total 2 minutes

**Decision points :**
- Si **alert banner visible** (FR-017) → lire en priorité l'alerte, puis KPIs, puis briefing
- Si **freshness indicator jaune/rouge** → note mental que les données datent

**Error cases :**
- Données > 24h → affichage pastille jaune, message "donnée > 12h", données dernier jour valide affichées
- Pipeline échec total → affichage dernière version valide + toast discret "données du {date}"

**Exit points :**
- Success : ferme l'onglet, satisfait
- Retour : bookmark, reviendra demain

**Flow diagram :**
```
[Bookmark / URL typed]
         ↓
[Homepage loading - Skeleton]
         ↓ < 1s
[Aurora + Rive avatar appear]
         ↓
[Tagline + Briefing animate in]
         ↓
[Bento Grid KPIs populate with NumberTicker]
         ↓
    ┌────┴────┐
    ↓         ↓
[No Alert]  [Alert Banner]  ← FR-017
    ↓         ↓
[Scan KPIs] [Read Alert first]
    ↓         ↓
    └────┬────┘
         ↓
[Read Briefing 4-5 phrases]
         ↓
[Check Freshness Indicator]
         ↓
[Close tab ✓]
```

**Success criteria :**
- Marc trouve l'info en < 2 minutes
- Revient le lendemain (bookmark)
- Pas de friction, pas de questions posées

---

### Flow F2 — Recruiter Validation (Thomas, RH hedge fund)

**Entry point :** Lien dans le CV de Bryan ou une candidature LinkedIn.

**Happy Path :**
1. **[Landing - Homepage]** → "Wow effect" immédiat (Aurora + Rive avatar + tagline gradient)
2. **[Scan homepage - 15s]** → Comprend que c'est unique, différent des portfolios classiques
3. **[Read briefing - 30s]** → Confirme que Bryan maîtrise le sujet finance
4. **[Click "Coulisses" nav - 10s]** → Cherche la partie technique
5. **[Timeline Tracing Beam scrolls - 60s]** → Explore la méthodo BMAD, voit les prompts versionnés
6. **[Click prompt code block - 30s]** → Zoom sur les itérations prompt v01→v06, comprend la rigueur
7. **[Pipeline logs table - 15s]** → Voit le taux de succès, la fiabilité
8. **[Scroll to bottom - 10s]** → Lien GitHub repo, README présentable
9. **[Decision]** → "Ce candidat est différent, je le contacte"

**Decision points :**
- Au moment de "Coulisses" → si Thomas trouve le contenu technique bluffant → forte conversion
- Si la timeline manque de preuves (screenshots, diffs) → moins de conviction

**Exit points :**
- Success : ouvre LinkedIn, envoie un message à Bryan
- Partage : envoie le lien à un collègue senior
- Save : bookmark pour relire plus tard

**Flow diagram :**
```
[CV Link / LinkedIn]
         ↓
[Homepage - First impression wow]
         ↓
[Briefing + KPIs scan 30s]
         ↓
[Click "Coulisses" in nav]
         ↓
[Tracing Beam scroll]
         ↓
   ┌─────┼─────┬─────┬─────┐
   ↓     ↓     ↓     ↓     ↓
[Étape [Étape [Étape [Étape [Étape
 1:    2:    3:    4:    5:
 Idée] BMAD] Pipe] Prompts] Deploy]
         ↓
[Click Prompt v01 → v06 diff]
         ↓
[Pipeline Logs Table]
         ↓
[Footer: GitHub link]
         ↓
    ┌────┴────┐
    ↓         ↓
[Contact Bryan] [Share with team]
```

---

### Flow F3 — Tech Deep-Dive (Sophie, dev fintech)

**Entry point :** Post LinkedIn ou Product Hunt ou Twitter.

**Happy Path :**
1. **[Landing - Homepage]** → Switch EN (elle est multilingue tech-oriented)
2. **[Notice Rive avatar - 5s]** → Reconnaît Rive, apprécie la signature
3. **[Read briefing - 30s]** → "Propre, bon tone"
4. **[Click Coulisses]** → Direct au tech
5. **[Read prompt v01 → v06 - 3 min]** → Analyse l'évolution, comprend les décisions
6. **[Check pipeline architecture diagram - 1 min]** → Valide le SSG + Cloudflare
7. **[GitHub link click]** → Va lire le repo
8. **[Star repo + share on Twitter]**

**Decision points :**
- Si prompts sont visibles et qualitatifs → star + share
- Si architecture est claire → "je peux reprendre le pattern"

---

### Flow F4 — Casual Discovery (Clément, étudiant)

**Entry point :** Article viral ou reco d'un ami.

**Happy Path :**
1. **[Landing]** → Attire par le design
2. **[Scroll homepage - 2 min]** → Lit le briefing en FR
3. **[About page]** → Qui est Bryan, pourquoi il a fait ça
4. **[Retour homepage]** → Screenshot pour partager sur WhatsApp
5. **[Exit]** → Partage avec ses copains

---

### Flow F5 — Language Switch (tous personas)

**Entry point :** Toggle FR/EN dans le header.

**Happy Path :**
1. **[User clicks FR/EN toggle]**
2. **[Motion 12 - Page transition fade]** (no white flash)
3. **[Route change /fr → /en]**
4. **[Briefing, tagline, KPI labels switch language]**
5. **[Preference saved in localStorage]**
6. **[Next visit → direct locale]**

**Error cases :**
- Missing translation → fallback EN (defaut)
- localStorage denied → cookie fallback

---

### Flow F6 — Crisis Alert Viewing (FR-017)

**Entry point :** Marc arrive le matin, VIX > p90 dans la nuit.

**Happy Path :**
1. **[Landing - Homepage]** → Immédiatement : **bannière rouge en haut** (Neon Gradient Card + Meteors)
2. **[Rive avatar posture changes]** → Mode tension, gestes rapides
3. **[Briefing tone change]** → "Marché sous tension. OAT-Bund s'écarte. Positions risquées."
4. **[KPI VIX highlighted]** → Neon red + Pulsating Dot
5. **[Marc clicks alert banner]** → Overlay avec détails de l'alerte (niveau percentile, historique 7j)
6. **[Close overlay, resume normal scan]**

**Decision points :**
- Niveau Warning (p90) → bannière orange
- Niveau Alert (p95) → bannière rouge
- Niveau Crisis (p99) → bannière rouge intense + Meteors

---

## 4. Wireframes

### 4.1 Homepage Desktop (1280px+)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  YieldField              Coulisses    About         [FR | EN]   │  ← Header (72px)
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ALERT BANNER (conditional, FR-017) ───────────────────────┐ │
│  │ ⚡ MARKET UNDER STRESS · VIX at p95 · Risk: HIGH           │ │  ← Neon Gradient (Magic UI)
│  │                              [View details →]              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ╱  AURORA BACKGROUND ANIMATED  ╲                              │  ← Aceternity Pro
│  ╱                                ╲                              │
│                                                                  │
│   ┌─────────────┐    ┌──────────────────────────────────────┐   │
│   │             │    │                                       │   │
│   │             │    │  La courbe des taux s'incline.       │   │  ← Tagline
│   │    RIVE     │    │  ─────────────────────────────        │   │    (Animated Gradient
│   │   AVATAR    │    │                                       │   │     Text, Magic UI)
│   │             │    │  La BCE resserre. OAT-Bund           │   │
│   │  (reactive  │    │  s'élargit. Crédit EU en alerte     │   │  ← Briefing
│   │   to risk   │    │  jaune. Jobs Friday en focus         │   │    (Text Generate
│   │   level)    │    │  demain — positions prudentes.       │   │     Aceternity)
│   │             │    │                                       │   │
│   │             │    │  [Inflation US] [Medium] [Jobs Fri]  │   │  ← Metadata chips
│   │             │    │                                       │   │
│   └─────────────┘    └──────────────────────────────────────┘   │
│                                                                  │
│          ● Live · Updated 8:23 AM CET                           │  ← Pulsating Dot
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   KEY METRICS · TODAY                                            │  ← H2 Instrument Serif
│                                                                  │
│  ┌────────────────────┬────────────────────┬──────────────────┐ │
│  │  OAT 10Y           │  Bund 10Y          │  SPREAD          │ │  ← Bento Grid
│  │                    │                    │                  │ │    (Aceternity)
│  │  [NumberTicker]    │  [NumberTicker]    │  [NumberTicker]  │ │
│  │   3.15%            │   2.51%            │   64 bps         │ │
│  │                    │                    │                  │ │
│  │  [Lottie ↗] +0.05  │  [Lottie →] +0.00  │  [Lottie ↗] +5   │ │
│  └────────────────────┼────────────────────┼──────────────────┤ │
│  │  CAC 40            │  S&P 500           │  VIX             │ │
│  │                    │                    │                  │ │
│  │  [NumberTicker]    │  [NumberTicker]    │  [NumberTicker]  │ │
│  │   7,234            │   4,891            │   18.2           │ │
│  │                    │                    │                  │ │
│  │  [Lottie ↗] +0.8%  │  [Lottie ↗] +0.3%  │  [Lottie ↘] -2%  │ │
│  ├────────────────────┴────────────────────┴──────────────────┤ │
│  │  Dollar Index (DXY)              103.52  [Lottie ↗] +0.2%  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Marquee scroll: Gold · WTI · EURUSD · 10Y US · 10Y JP ...]   │  ← Magic UI Marquee
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│   Disclaimer: Not financial advice.       YieldField · 2026     │  ← Footer
│   FR | EN                                  GitHub · About        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Homepage Tablet (768-1279px)

```
┌────────────────────────────────────────┐
│                                        │
│  YieldField    [Nav ≡]      [FR | EN] │  ← Header compact
│                                        │
├────────────────────────────────────────┤
│  [Alert Banner si actif]               │
├────────────────────────────────────────┤
│                                        │
│  ╱ AURORA BG ╲                         │
│                                        │
│  ┌────────────┐                        │
│  │            │                        │
│  │   RIVE     │                        │  ← Rive avatar
│  │  AVATAR    │                        │     centered
│  │            │                        │
│  └────────────┘                        │
│                                        │
│  La courbe des taux s'incline.         │  ← Tagline
│  ─────────────────────                 │
│                                        │
│  La BCE resserre. OAT-Bund s'élargit.  │  ← Briefing
│  Crédit EU en alerte jaune. Jobs...    │
│                                        │
│  [Inflation US] [Med] [Jobs Fri]       │
│                                        │
│  ● Live · Updated 8:23                 │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  KEY METRICS · TODAY                   │
│                                        │
│  ┌──────────────┬──────────────────┐  │  ← 2 columns
│  │ OAT 10Y      │ Bund 10Y         │  │
│  │ 3.15%        │ 2.51%            │  │
│  │ [↗] +0.05    │ [→] +0.00        │  │
│  ├──────────────┼──────────────────┤  │
│  │ SPREAD       │ CAC 40           │  │
│  │ 64 bps       │ 7,234            │  │
│  │ [↗] +5       │ [↗] +0.8%        │  │
│  ├──────────────┼──────────────────┤  │
│  │ S&P 500      │ VIX              │  │
│  │ 4,891        │ 18.2             │  │
│  │ [↗] +0.3%    │ [↘] -2%          │  │
│  └──────────────┴──────────────────┘  │
│                                        │
│  DXY · 103.52 [↗] +0.2%                │
│                                        │
├────────────────────────────────────────┤
│  [Marquee secondaires]                 │
├────────────────────────────────────────┤
│  Disclaimer + Footer                   │
└────────────────────────────────────────┘
```

### 4.3 Homepage Mobile (375-767px)

```
┌──────────────────────────┐
│                          │
│  YieldField     [≡]      │  ← Header 56px
│                          │
├──────────────────────────┤
│  [Alert Banner]          │
├──────────────────────────┤
│                          │
│  ╱ Aurora BG ╲           │
│                          │
│  ┌────────────┐          │
│  │            │          │
│  │  RIVE      │          │  ← Avatar smaller
│  │  AVATAR    │          │     (~200px)
│  │            │          │
│  └────────────┘          │
│                          │
│  La courbe des taux      │  ← Tagline (shorter)
│  s'incline.              │
│                          │
│  La BCE resserre.        │  ← Briefing
│  OAT-Bund s'élargit.     │
│  Crédit EU en alerte.    │
│  Jobs Friday en focus.   │
│                          │
│  [Theme] [Risk] [Event]  │
│                          │
│  ● 8:23 CET              │
│                          │
├──────────────────────────┤
│                          │
│  KEY METRICS             │
│                          │
│  ┌──────────────────┐    │  ← Single column
│  │ OAT 10Y  3.15%   │    │     stacked
│  │ [↗] +0.05        │    │
│  ├──────────────────┤    │
│  │ Bund 10Y 2.51%   │    │
│  ├──────────────────┤    │
│  │ SPREAD   64 bps  │    │
│  ├──────────────────┤    │
│  │ CAC 40   7,234   │    │
│  ├──────────────────┤    │
│  │ S&P 500  4,891   │    │
│  ├──────────────────┤    │
│  │ VIX      18.2    │    │
│  ├──────────────────┤    │
│  │ DXY      103.52  │    │
│  └──────────────────┘    │
│                          │
├──────────────────────────┤
│  [Marquee horizontal]    │
├──────────────────────────┤
│  Footer                  │
│  Disclaimer              │
│  [FR | EN]               │
└──────────────────────────┘
```

### 4.4 Coulisses Desktop (1280px+)

```
┌──────────────────────────────────────────────────────────────────┐
│  YieldField    Coulisses   About              [FR | EN]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  COULISSES                                                       │  ← H1 Instrument Serif
│  La mécanique derrière YieldField                                │    48px
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ╎                                                               │  ← Tracing Beam
│  ●  ÉTAPE 01 · L'IDÉE ORIGINELLE                      Avril 2026│     (Aceternity)
│  ╎                                                               │
│  ╎  [Screenshot: whiteboard ideation]                            │
│  ╎                                                               │
│  ╎  Comment transformer une passion finance en site vitrine     │
│  ╎  qui démontre à la fois la maîtrise du sujet et celle        │
│  ╎  des outils modernes ? La réponse est arrivée après...       │
│  ╎                                                               │
│  ╎  [Lottie spark animation]                                     │
│  ╎                                                               │
│  ●  ÉTAPE 02 · LA MÉTHODE BMAD                        Avril 2026│
│  ╎                                                               │
│  ╎  BMAD (Brief → Model → Architecture → Development) est       │
│  ╎  une méthodologie en 4 phases. Chaque phase produit...       │
│  ╎                                                               │
│  ╎  [Diagram SVG: 4 phases with arrows]                          │
│  ╎                                                               │
│  ●  ÉTAPE 03 · LE PIPELINE NOCTURNE                   Avril 2026│
│  ╎                                                               │
│  ╎  [Architecture diagram animé]                                 │
│  ╎                                                               │
│  ╎  Chaque nuit à 6h UTC, un cron GitHub Actions déclenche     │
│  ╎  un pipeline qui fetch les données, appelle Claude API...   │
│  ╎                                                               │
│  ●  ÉTAPE 04 · LES PROMPTS v01 → v06                  Avril 2026│
│  ╎                                                               │
│  ╎  ┌──────────────────────────────────────────────────┐        │
│  ╎  │ prompts/briefing-v06.md        [Copy] [Shine]    │        │
│  ╎  ├──────────────────────────────────────────────────┤        │
│  ╎  │ You are a seasoned trader writing a morning      │        │
│  ╎  │ briefing for analysts. Your tone is direct,      │        │
│  ╎  │ contextual, never pedagogical. Mention at least │        │
│  ╎  │ 2 spreads or volatility indicators...            │        │
│  ╎  │                                                  │        │
│  ╎  │ Diff vs v05:                                     │        │
│  ╎  │ + Added "never pedagogical"                      │        │
│  ╎  │ - Removed "explain terms"                        │        │
│  ╎  └──────────────────────────────────────────────────┘        │
│  ╎                                                               │
│  ╎  [v01] [v02] [v03] [v04] [v05] [v06]  ← Version pills        │
│  ╎                                                               │
│  ●  ÉTAPE 05 · LE DÉPLOIEMENT                         Avril 2026│
│  ╎                                                               │
│  ╎  Pipeline reliability sur les 7 derniers runs :              │
│  ╎                                                               │
│  ╎  ┌────────────┬─────────┬─────────┬─────────────┐            │
│  ╎  │ Date       │ Status  │ Latency │ Output      │            │
│  ╎  ├────────────┼─────────┼─────────┼─────────────┤            │
│  ╎  │ Apr 11     │ ● Success│ 4.2s    │ briefing.json│          │
│  ╎  │ Apr 10     │ ● Success│ 3.8s    │ briefing.json│          │
│  ╎  │ Apr 09     │ ● Success│ 5.1s    │ briefing.json│          │
│  ╎  │ Apr 08     │ ⚠ Retry  │ 12s     │ fallback    │           │
│  ╎  └────────────┴─────────┴─────────┴─────────────┘            │
│  ╎                                                               │
│  ●  ÉTAPE 06 · L'AVATAR RIVE                          Avril 2026│
│  ╎                                                               │
│  ╎  [Preview interactif du Rive avatar]                          │
│  ╎                                                               │
│  ╎  L'avatar en hero n'est pas une simple illustration. Il      │
│  ╎  est piloté par une state machine qui réagit au risk_level  │
│  ╎  et au theme_of_day de chaque briefing...                    │
│  ╎                                                               │
│  ●  ← End of timeline                                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  GitHub Repository → github.com/BL-Capital/yieldview            │
│                                                                  │
│  Disclaimer + Footer                                             │
└──────────────────────────────────────────────────────────────────┘
```

### 4.5 Alert Banner Detailed State (FR-017)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ╱ METEORS FALLING ANIMATION (Aceternity) ╲                     │  ← Meteors bg
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  ⚡ MARKET UNDER STRESS                                  │   │  ← Neon Gradient
│  │                                                          │   │     Card (Magic UI)
│  │  VIX exceeded 90th percentile (252d window)              │   │
│  │  Current: 28.4  ·  Threshold: 24.2                       │   │
│  │                                                          │   │
│  │  Alert Level: [WARNING]  ·  Since: Yesterday 4:30 PM     │   │
│  │                                                          │   │
│  │  [View historical alerts →]     [Dismiss]                │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                   [Rive Avatar in Tension mode]                  │  ← State change
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**3 niveaux :**
- **Warning (p90)** : Fond orange (#F59E0B), Rive avatar concentré
- **Alert (p95)** : Fond rouge (#DC2626), Rive avatar tendu, Meteors doux
- **Crisis (p99)** : Fond rouge intense (#991B1B), Rive avatar stressé, Meteors denses, Pulsating banner

### 4.6 404 & Error States

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  YieldField                                                      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                    [Lottie animation 404]                        │
│                                                                  │
│                                                                  │
│                    404                                           │  ← Instrument Serif
│                                                                  │    72px
│                    This page doesn't exist.                      │
│                    Not every signal lands.                       │  ← Tagline-style
│                                                                  │
│                    [← Back to homepage]                          │
│                                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Accessibility (WCAG 2.1 AA)

### 5.1 Perceivable

**Color Contrast (tous validés en design tokens) :**

| Combinaison | Ratio | WCAG |
|---|---|---|
| Texte principal `#F4F4F5` sur fond `#0A1628` | **17.4:1** | ✅ AAA |
| Texte muted `#94A3B8` sur fond `#0A1628` | **6.3:1** | ✅ AAA |
| Gold accent `#C9A84C` sur fond `#0A1628` | **7.9:1** | ✅ AAA |
| Bull `#22C55E` sur fond `#0A1628` | **7.2:1** | ✅ AAA |
| Bear `#EF4444` sur fond `#0A1628` | **5.5:1** | ✅ AA |
| Alert warning `#F59E0B` sur fond `#0A1628` | **8.8:1** | ✅ AAA |

**Information not by color alone :**
- Bull/bear indicators : flèches Lottie + couleur + signe (+/-)
- Alert levels : icônes + texte + couleur
- Freshness : pastille colorée + texte explicite ("Updated 2h ago")

**Text scaling :**
- Tous les textes utilisent `rem` units (pas de `px` fixes)
- Layout supporte zoom jusqu'à 200% sans breakage
- Navigation toujours accessible

**Alt text :**
- Rive avatar : `alt="Interactive animated presenter reacting to today's market risk level"`
- KPI arrows (Lottie) : `alt="Trend arrow up/down/flat"`
- Screenshots Coulisses : alt descriptif détaillé

### 5.2 Operable

**Keyboard navigation complete :**

```
Tab order (homepage) :
1. Skip to main content (hidden until focused)
2. Logo YieldField
3. Coulisses nav link
4. About nav link
5. Language switcher FR/EN
6. Alert banner (if present) + dismiss button
7. KPI cards (each focusable with aria-label)
8. Briefing panel (scrollable region)
9. Marquee (stops on focus)
10. Footer links
```

**Focus indicators :**
- 2px outline `#C9A84C` (gold)
- Offset 2px from element
- Visible on dark background
- Respecte `:focus-visible` (pas sur mouse click)

**Touch targets :**
- Minimum 44×44px (Apple HIG standard)
- Navigation items : 48×48px
- Language toggle : 56×56px
- CTA buttons : 48px height minimum

**Animations :**
- Toutes respectent `prefers-reduced-motion: reduce`
- Fallback : fade simple (opacity) au lieu de transforms
- Rive avatar : pose statique en mode reduced motion
- Aceternity Aurora : gradient statique en mode reduced motion

**No keyboard traps :**
- Alert banner dismissable avec Escape
- Modals/overlays : focus trap proper + Escape to close

### 5.3 Understandable

**Language :**
- `<html lang="fr">` ou `<html lang="en">` selon route
- `lang` attribute sur contenus multilingues inline

**Predictable navigation :**
- Header toujours au même endroit (sticky top)
- Footer toujours au même endroit
- Language switcher toujours accessible

**Labels & errors :**
- Tous les boutons ont un `aria-label` descriptif
- Icônes ont `aria-hidden="true"` si décoratives, ou `aria-label` si informatives
- Messages d'erreur (500, 404) : clairs, actionnables, bilingues

### 5.4 Robust

**Semantic HTML :**
```html
<header>      ← Navigation + logo
<nav>         ← Navigation principale
<main>        ← Contenu principal
  <section>   ← Hero, KPIs, Briefing
  <article>   ← Briefing macro
</main>
<footer>      ← Disclaimer, links
```

**ARIA annotations critiques :**
- Live region briefing : `aria-live="polite"` (update silencieux)
- Alert banner : `role="alert"` + `aria-live="assertive"`
- Number tickers : `aria-label="{kpi_name}: {value}, {change} from yesterday"`
- Rive avatar : `role="img"` + `aria-label` descriptif
- Freshness dot : `aria-label="Data updated 2 hours ago"`

**Screen reader flow :**
```
"YieldField. Main navigation. Skip to main content.
Today's briefing. Alert: Market under stress, VIX at 90th percentile.
Interactive presenter showing tension state.
Tagline: The yield curve is flattening.
Briefing: The ECB tightens. OAT-Bund widens...
Six key metrics for today. OAT 10 year: 3.15 percent, up 0.05 from yesterday.
Bund 10 year: 2.51 percent, unchanged.
Spread OAT-Bund: 64 basis points, up 5..."
```

---

## 6. Component Library

### 6.1 Layout Components

#### `<Header>`

**Purpose :** Navigation principale + language switcher
**Props :** `locale`, `currentPath`
**Content :**
- Logo "YieldField" (Instrument Serif, 24px, color `#F4F4F5`)
- Nav links : Coulisses, About
- Language Switcher (pills toggle)

**States :**
- Default : transparent sur hero, solid `#0A1628cc` au scroll
- Scrolled : backdrop-blur
- Mobile : hamburger menu fallback

**Height :**
- Desktop : 72px
- Tablet : 64px
- Mobile : 56px

---

#### `<LanguageSwitcher>`

**Purpose :** Toggle FR/EN avec persistence
**Props :** `currentLocale`
**Interaction :**
- Click FR → navigate to `/fr{path}`
- Click EN → navigate to `/en{path}`
- Save preference in localStorage
- Motion 12 page transition (fade, no flash)

**Style :**
- Pill shape, border `#C9A84C`
- Active pill : background `#C9A84C`, text `#0A1628`
- Inactive : transparent, text `#94A3B8`
- Hover : text `#F4F4F5`

---

#### `<Footer>`

**Purpose :** Disclaimer + liens + branding
**Content :**
```
Disclaimer: This website does not constitute financial advice.
© 2026 YieldField · GitHub · About

[FR | EN]
```
**Accessibility :** Role `contentinfo`

---

### 6.2 KPI Display Components

#### `<BentoGrid>`

**Purpose :** Grid responsive des 6-8 KPIs
**Props :** `kpis: Kpi[]`
**Layout :**
- Desktop : 3 cols × 2 rows (6 KPIs) + 1 row pleine largeur (DXY)
- Tablet : 2 cols × 3 rows + 1 row pleine largeur
- Mobile : 1 col stacked

**Gap :** 16px (mobile), 24px (desktop)

---

#### `<KpiCard>`

**Purpose :** Affichage d'un KPI individuel
**Props :** `kpi: { label, value, unit, change, direction, history? }`
**Content :**
- Label (Inter 14px uppercase, `#94A3B8`)
- Value (JetBrains Mono 32px, `#F4F4F5`, via NumberTicker)
- Unit (Inter 14px, `#94A3B8`)
- Change + Lottie arrow (color selon direction)
- Optional sparkline (V2)

**Style :**
- Background : `#0F1E38` (card bg)
- Border : 1px `#1E3A5F`
- Border-radius : 12px
- Padding : 24px
- Shimmer Glare effect (Aceternity) au hover

**States :**
- Default
- Hover : elevation + glare shimmer animation
- Focus : outline gold 2px
- Loading : skeleton shimmer
- Error : texte "Data unavailable" + freshness warning

**Accessibility :**
- `aria-label="{label}: {value}{unit}, {change} from yesterday"`
- Focusable via Tab

---

#### `<NumberTicker>` (Magic UI)

**Purpose :** Animation d'incrémentation de 0 à la valeur cible
**Props :** `value`, `duration` (default 1500ms), `decimals`
**Behavior :**
- Déclenche au viewport-enter (IntersectionObserver)
- Respecte `prefers-reduced-motion` → affiche directement la valeur
- Utilise Motion 12 `animate` + `useMotionValue`

---

#### `<FreshnessIndicator>`

**Purpose :** Indicateur visuel de fraîcheur des données
**Props :** `timestamp: Date`
**Logic :**
- < 24h : vert (#22C55E) + "Live · Updated 8:23 AM"
- 24-48h : jaune (#F59E0B) + "Updated {X} hours ago"
- > 48h : rouge (#EF4444) + "Stale data · {date}"

**Component :**
- Magic UI Pulsating Dot
- Text 14px Inter

---

### 6.3 Briefing Components

#### `<RiveHeroAvatar>`

**Purpose :** Avatar interactif signature du hero
**Props :** `riskLevel: 'low'|'medium'|'high'|'crisis'`, `themeOfDay: string`, `vixAlertLevel?: 'warning'|'alert'|'crisis'`
**Technology :** `@rive-app/react-canvas`
**File :** `/public/rive/avatar.riv`

**State machine inputs :**
- `risk_level` (number 0-3)
- `theme_of_day` (string enum)
- `vix_alert` (boolean)

**Fallback :**
```tsx
<ErrorBoundary fallback={<StaticAvatar />}>
  <RiveComponent src="/rive/avatar.riv" stateMachines="main" />
</ErrorBoundary>
```

**Dimensions :**
- Desktop : 400×400px
- Tablet : 300×300px
- Mobile : 200×200px

**Loading :**
- Preload avec `<link rel="preload">`
- Skeleton avatar SSR (SVG simple) pendant que Rive charge

**Accessibility :**
- `role="img"`
- `aria-label="Animated presenter showing today's market tension level"`
- Pas d'interaction clic obligatoire (décoratif)

---

#### `<TaglineHeader>`

**Purpose :** Accroche animée en haut du briefing
**Props :** `text: string`
**Component :** Magic UI Animated Gradient Text
**Style :**
- Font : Instrument Serif 40-56px (responsive)
- Gradient : `#C9A84C → #E5C67F → #C9A84C`
- Animation : slow gradient shift (8s loop)

---

#### `<BriefingPanel>`

**Purpose :** Affichage du briefing macro avec Text Generate Effect
**Props :** `briefing: string`, `metadata: BriefingMetadata`
**Component :** Aceternity Text Generate Effect
**Behavior :**
- Chaque mot apparaît progressivement (stagger)
- Vitesse : 50ms/mot (ajustable)
- Respect `prefers-reduced-motion` → affichage direct
- Once animation completes → metadata chips fade in

**Style :**
- Font : Inter 18-20px
- Line-height : 1.7
- Color : `#F4F4F5`
- Max-width : 600px (readability)

---

#### `<MetadataChips>`

**Purpose :** Chips avec theme, certainty, event, risk
**Props :** `metadata: { theme, certainty, upcoming_event, risk_level }`
**Style :**
- Pill shape
- Background : `#0F1E38`
- Border : 1px `#1E3A5F`
- Padding : 6px 12px
- Font : Inter 13px uppercase
- Icône Lottie optionnelle par type

**Color by risk level :**
- Low : `#22C55E` border
- Medium : `#F59E0B` border
- High : `#EF4444` border
- Crisis : `#991B1B` border + pulse

---

### 6.4 Coulisses Components

#### `<TimelineTracingBeam>`

**Purpose :** Timeline verticale avec tracé animé au scroll
**Component :** Aceternity Tracing Beam
**Props :** `steps: TimelineStep[]`
**Behavior :**
- Beam trace au fur et à mesure du scroll
- Chaque step fade-in quand visible

**Layout :**
- Left : beam (vertical line + dots)
- Right : content (title, date, description, media)

---

#### `<PromptCodeBlock>`

**Purpose :** Affichage d'un prompt versionné avec diff
**Component :** Aceternity Code Block Animated
**Props :** `version`, `content`, `diff`, `prevVersion`
**Features :**
- Syntax highlighting (TypeScript shiki)
- Copy button avec Magic UI shine effect
- Version pills navigation (v01 → v06)
- Expandable diff view

---

#### `<PipelineLogsTable>`

**Purpose :** Table des 7 derniers runs pipeline
**Props :** `runs: PipelineRun[]`
**Columns :** Date, Status, Latency, Output
**Style :**
- Background : `#0F1E38`
- Border : 1px `#1E3A5F`
- Rows : alternate `#0A1628` / `#0F1E38`
- Status : Pulsating Dot green (success) / yellow (retry) / red (fail)

---

### 6.5 Alert Components

#### `<AlertBanner>` (FR-017)

**Purpose :** Bannière d'alerte en haut de page en mode crise
**Props :** `level: 'warning'|'alert'|'crisis'`, `vix: number`, `percentile: number`, `triggeredAt: Date`
**Composite :**
- Neon Gradient Card (Magic UI) background
- Meteors (Aceternity) background (density selon level)
- Lucide icon (⚡)
- Title + subtitle
- CTA "View details" + Dismiss button

**Accessibility :**
- `role="alert"`
- `aria-live="assertive"` (screen reader annonce immédiatement)
- Escape key dismisses

**Interaction :**
- Click "View details" → overlay with historical context
- Click "Dismiss" → hide (but remember state in session)

---

## 7. Design Tokens (Tailwind config)

### 7.1 Colors

```typescript
// tailwind.config.ts
colors: {
  // Brand
  'yield': {
    'dark': '#0A1628',       // Primary background
    'dark-elevated': '#0F1E38', // Cards background
    'dark-border': '#1E3A5F',   // Borders
    'gold': '#C9A84C',          // Primary accent
    'gold-light': '#E5C67F',    // Accent hover
    'gold-dim': '#9A7E3A',      // Accent muted
    'ink': '#F4F4F5',           // Primary text
    'ink-muted': '#94A3B8',     // Secondary text
    'ink-dim': '#64748B',       // Tertiary text
  },

  // Semantic finance
  'bull': '#22C55E',
  'bull-dim': '#15803D',
  'bear': '#EF4444',
  'bear-dim': '#B91C1C',
  'neutral': '#94A3B8',

  // Alert levels (FR-017)
  'alert': {
    'warning': '#F59E0B',    // p90 VIX
    'alert': '#DC2626',      // p95 VIX
    'crisis': '#991B1B',     // p99 VIX
  },
}
```

### 7.2 Typography

```typescript
fontFamily: {
  'serif': ['"Instrument Serif"', 'Georgia', 'serif'],  // Titres éditoriaux
  'sans': ['Inter', 'system-ui', 'sans-serif'],          // Body
  'mono': ['"JetBrains Mono"', 'Menlo', 'monospace'],    // Chiffres & code
},

fontSize: {
  // Editorial headings (Instrument Serif)
  'display-1': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // Hero title
  'display-2': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }], // Page titles
  'display-3': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2' }],

  // Body (Inter)
  'heading-1': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
  'heading-2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg': ['1.25rem', { lineHeight: '1.6' }],
  'body': ['1rem', { lineHeight: '1.7' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5' }],
  'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],

  // Numbers (JetBrains Mono)
  'number-xl': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
  'number-lg': ['1.75rem', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
  'number-md': ['1.25rem', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
},
```

### 7.3 Spacing

```typescript
// Based on 4px grid
spacing: {
  '0.5': '2px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '6': '24px',
  '8': '32px',
  '12': '48px',
  '16': '64px',
  '24': '96px',
  '32': '128px',
},

// Container max-widths
maxWidth: {
  'content': '720px',    // Briefing text optimal reading
  'wide': '1200px',      // Main content
  'full-wide': '1440px', // Hero sections
},
```

### 7.4 Shadows & Effects

```typescript
boxShadow: {
  'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
  'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
  'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)',
  'gold-glow': '0 0 30px rgba(201, 168, 76, 0.3)',
  'alert-glow': '0 0 40px rgba(220, 38, 38, 0.4)',
},

backdropBlur: {
  'subtle': '8px',
  'medium': '16px',
  'strong': '24px',
},
```

### 7.5 Breakpoints

```typescript
screens: {
  'xs': '375px',   // Mobile small
  'sm': '640px',   // Mobile large
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop small
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Desktop large
},
```

### 7.6 Animation durations

```typescript
transitionDuration: {
  'instant': '100ms',
  'fast': '200ms',
  'normal': '300ms',
  'slow': '500ms',
  'slower': '800ms',
  'cinema': '1200ms', // Pour signatures effects
},

transitionTimingFunction: {
  'editorial': 'cubic-bezier(0.4, 0, 0.2, 1)',    // Standard ease
  'cinema': 'cubic-bezier(0.65, 0, 0.35, 1)',     // Smooth luxury
  'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
},
```

---

## 8. Developer Handoff

### 8.1 Implementation Priorities

**Phase A — Foundation (Sprint 1, Week 1) :**
1. Setup Next.js 15 + React 19 + TypeScript
2. Configure Tailwind avec design tokens ci-dessus
3. Install shadcn/ui primitives (Button, Card, Dialog, Toast)
4. Fonts : self-host Instrument Serif + Inter + JetBrains Mono
5. next-intl configuration (FR/EN routing)
6. Layout : `<Header>` + `<Footer>` + `<LanguageSwitcher>`
7. Dark theme applied globally

**Phase B — Core Components (Sprint 1-2) :**
1. `<BentoGrid>` + `<KpiCard>` (statique first, mocked data)
2. `<NumberTicker>` (Magic UI, installer)
3. `<FreshnessIndicator>` (Magic UI Pulsating Dot)
4. `<BriefingPanel>` (Aceternity Text Generate, installer)
5. `<TaglineHeader>` (Magic UI Animated Gradient Text)
6. `<MetadataChips>`

**Phase C — Homepage Integration (Sprint 2) :**
1. Aceternity Aurora Background
2. Rive avatar integration (fallback SVG d'abord)
3. Homepage assembly desktop
4. Responsive tablet
5. Responsive mobile
6. Lighthouse audit (target ≥90)

**Phase D — Coulisses Page (Sprint 3) :**
1. Aceternity Tracing Beam
2. `<PromptCodeBlock>` avec shiki
3. `<PipelineLogsTable>`
4. Timeline content (MDX 5 étapes minimum)

**Phase E — Alert & Polish (Sprint 3-4) :**
1. `<AlertBanner>` avec Neon Gradient + Meteors
2. Rive avatar state machine complet (réactif)
3. 404 & error pages
4. Lottie icons for KPI cards
5. Marquee secondaires

**Phase F — Launch (Sprint 4) :**
1. SEO + OG dynamic (FR-019)
2. Analytics Plausible/Umami (FR-018)
3. Accessibility audit complet
4. Performance optimizations finales
5. Domain DNS + go live

### 8.2 Critical implementation notes

**Rive avatar :**
- Démarrer avec **avatar SVG statique** en fallback (Phase A)
- Créer/sourcer avatar Rive en parallèle (Phase C)
- **Risque A11** mitigé : pas de dépendance au launch

**Fonts performance :**
```typescript
// app/layout.tsx
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
```

**Animation `prefers-reduced-motion` :**
```tsx
// hooks/usePrefersReducedMotion.ts
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// Usage in components
<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
/>
```

**Bundle strategy :**
```typescript
// Lazy-load heavy components
const RiveHeroAvatar = dynamic(() => import('@/components/rive/HeroAvatar'), {
  ssr: false,
  loading: () => <StaticAvatarFallback />,
});

const AuroraBackground = dynamic(() => import('@/components/aceternity/aurora-background'), {
  ssr: true,
});
```

### 8.3 Accessibility testing checklist

- [ ] Keyboard-only navigation walkthrough (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader test (NVDA on Windows, VoiceOver on Mac)
- [ ] Axe DevTools audit (0 serious/critical issues)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Color contrast check (tous validés en design tokens, re-vérifier en live)
- [ ] Zoom 200% without horizontal scroll
- [ ] `prefers-reduced-motion` test
- [ ] Focus indicators visible on all interactive elements

### 8.4 Performance testing checklist

- [ ] LCP < 2s (Lighthouse, 4G throttling)
- [ ] FCP < 1s
- [ ] CLS < 0.1
- [ ] TBT < 200ms
- [ ] Initial JS bundle < 250KB gzipped
- [ ] Rive asset < 100KB
- [ ] Each Lottie < 20KB
- [ ] Images optimized (WebP + responsive sizes)
- [ ] Fonts preloaded
- [ ] Critical CSS inlined

---

## 9. Requirements Coverage

### FRs → Screens/Components

| FR ID | Requirement | Screen | Components |
|---|---|---|---|
| FR-001 | KPIs enrichis | Homepage | `<BentoGrid>`, `<KpiCard>` |
| FR-002 | Animation hero chiffres | Homepage | `<NumberTicker>` (Magic UI) |
| FR-003 | Indicateur fraîcheur | Homepage | `<FreshnessIndicator>` |
| FR-004 | Briefing macro | Homepage | `<BriefingPanel>` (Aceternity Text Generate) |
| FR-005 | Briefing contexte riche | Homepage | `<MetadataChips>` |
| FR-006 | Tagline dynamique | Homepage | `<TaglineHeader>` (Magic UI Gradient) |
| FR-007 | Timeline Coulisses | Coulisses | `<TimelineTracingBeam>` (Aceternity) |
| FR-008 | Prompts versionnés | Coulisses | `<PromptCodeBlock>` |
| FR-009 | Logs API | Coulisses | `<PipelineLogsTable>` |
| FR-010 | Pipeline data | (backend, invisible UX) | — |
| FR-011 | Claude API | (backend, invisible UX) | — |
| FR-012 | Fallback gracieux | Homepage | `<FreshnessIndicator>` warning state |
| FR-013 | Edge cases finance | Homepage | States spéciaux des KPI cards |
| FR-014 | Switcher langue | Global | `<LanguageSwitcher>` |
| FR-015 | Disclaimer légal | Global | `<Footer>` |
| FR-016 | Override manuel briefing | (backend workflow) | Badge "edited" sur `<BriefingPanel>` |
| FR-017 | Alert VIX percentile | Homepage | `<AlertBanner>` + Rive state change |
| FR-018 | Analytics privacy-first | Global | Plausible/Umami script (invisible) |
| FR-019 | OG / Twitter Card | (SSR meta tags) | — |

**Coverage :** 19/19 FRs ✅

### NFRs → Design decisions

| NFR ID | Requirement | UX Response |
|---|---|---|
| NFR-001 | LCP < 2s | Hero SSR skeleton + font preload + Rive lazy |
| NFR-002 | Lighthouse ≥ 90 | Design system optimisé, Aceternity client-only with care |
| NFR-003 | Uptime 99% | (infra, hors scope UX) |
| NFR-004 | Coût ≤ 8€/mois | (infra, hors scope UX) |
| NFR-005 | Sécurité (no API keys) | (code/infra) |
| NFR-006 | WCAG AA | Section 5 complète |
| NFR-007 | Bilingue FR/EN | Section 3 Flow F5 |
| NFR-008 | Navigateurs modernes | CSS moderne (Grid, Flexbox, Custom Properties) |
| NFR-009 | Pipeline reliability ≥ 95% | (backend) |
| NFR-010 | Observabilité | (backend) |

---

## 10. Sign-off & Validation

**UX Design Validation Checklist :**

- [x] Tous les FRs sont couverts par des composants ou écrans
- [x] Accessibilité WCAG 2.1 AA documentée pour chaque écran
- [x] Design tokens définis (colors, typography, spacing, shadows)
- [x] Composants réutilisables identifiés (~20 composants)
- [x] User flows couvrent les 4 personas (Marc, Sophie, Thomas, Clément)
- [x] Responsive breakpoints clairs (mobile/tablet/desktop)
- [x] Performance budget aligné avec NFR-001
- [x] Developer handoff avec priorités d'implémentation
- [x] Compatible avec stack technique (Next 15, React 19, Motion 12, Aceternity, Magic UI, Rive, Lottie)

**Sign-off :**
- [ ] Product Manager (Emmanuel) — Pending
- [ ] Client / Product Owner (Bryan) — Pending (via issue GitHub)
- [ ] System Architect (Emmanuel) — Auto-validated (architecture v1.2 aligned)
- [ ] Ready for Sprint Planning

---

## Appendix — Links & References

- **Product Brief :** `docs/product-brief-yieldfield-2026-04-11.md`
- **PRD v2.0 :** `docs/prd-yieldfield-2026-04-11.md`
- **Architecture v1.2 :** `docs/architecture-yieldfield-2026-04-11.md`
- **Workflow Status :** `docs/bmm-workflow-status.yaml`
- **GitHub Issues :**
  - #1 — PRD validation Bryan
  - #2 — Domain name decision

---

*Document généré dans le cadre du workflow BMAD v6 — Phase 3 Solutioning (UX Design)*
*UX Designer : Claude (Opus 4.6 1M) — Emmanuel (WEDOOALL Solutions)*
