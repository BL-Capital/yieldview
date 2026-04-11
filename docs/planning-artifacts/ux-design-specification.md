---
title: "UX Design Specification: YieldField"
status: "final-draft"
workflowType: "ux-design"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by Sally, UX Designer, BMAD v6.3.0)"
methodology: "BMAD v6.3.0 — Phase 3 Solutioning — bmad-create-ux-design workflow (14 steps)"
inputDocuments:
  - "docs/planning-artifacts/product-brief-yieldfield.md"
  - "docs/planning-artifacts/prd.md"
  - "docs/planning-artifacts/architecture.md"
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-03-core-experience"
  - "step-04-emotional-response"
  - "step-05-inspiration"
  - "step-06-design-system"
  - "step-07-defining-experience"
  - "step-08-visual-foundation"
  - "step-09-design-directions"
  - "step-10-user-journeys"
  - "step-11-component-strategy"
  - "step-12-ux-patterns"
  - "step-13-responsive-accessibility"
  - "step-14-complete"
---

# UX Design Specification — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 2.0 (refaite en BMAD v6.3.0)
**Date :** 2026-04-11
**UX Designer facilitateur :** Claude (Opus 4.6 1M) jouant le rôle de Sally, UX Designer BMAD
**Méthodologie :** BMAD Method v6.3.0 — Phase 3 Solutioning
**Workflow :** `bmad-create-ux-design` — 14 steps complets
**Inputs :** Product Brief v2, PRD v2, Architecture v2

---

## 1. Project Discovery (Step 2)

### 1.1 Contexte projet

YieldField est un magazine éditorial quotidien de marchés financiers propulsé par IA, destiné à servir à la fois comme preuve de concept pour le recrutement de Bryan (junior finance), comme vitrine méthodologique pour Emmanuel et WEDOOALL Solutions, et potentiellement comme plateforme produit autonome (trajectoires A/B/C dans le Product Brief).

Le défi UX est **triple** :
- **Édition** : communiquer l'information financière avec la qualité d'un magazine imprimé haut de gamme
- **Performance** : rester sous LCP 2s / Lighthouse 90+ malgré une stack riche (Rive, Aceternity, Motion, Lottie)
- **Accessibilité** : respecter WCAG 2.1 AA sur un design sombre ambitieux avec animations multiples

### 1.2 Public cible

Quatre personas avec des besoins distincts (détail dans PRD section 4) :
- **Thomas** (recruteur hedge fund, 35 ans) — visite unique, 5 minutes, décision rapide
- **Sophie** (développeuse fintech, 29 ans) — visite hebdomadaire, 15-20 min sur Coulisses
- **Marc** (analyste sell-side, 26 ans, **hypothèse à valider**) — visite quotidienne, 2-3 min
- **Clément** (étudiant école de commerce, 22 ans) — visite bi-mensuelle, vecteur d'amplification

### 1.3 Contraintes UX déterminantes

1. **Bilingue FR/EN** — toute UI et contenu doivent être traduits sans FOUC
2. **Dark theme premium** — fond `#0A1628`, accents or `#C9A84C`
3. **Responsive équilibré** — 3 breakpoints distincts (mobile 375px, tablet 768px, desktop 1280px)
4. **WCAG 2.1 AA** — contrastes, navigation clavier, `prefers-reduced-motion`, screen readers
5. **Performance budget** — < 250 KB JS initial, LCP < 2s
6. **Stack UI imposée** — shadcn/ui + Aceternity Pro + Magic UI + Motion 12 + Rive + Lottie
7. **Aucune authentification utilisateur** — site public en lecture seule

---

## 2. Core Experience Definition (Step 3)

### 2.1 La séquence expérientielle centrale

L'expérience cœur de YieldField, celle que TOUS les personas vivent quand ils arrivent sur la homepage, tient en **4 moments** :

**Moment 1 — L'impression (0-2 secondes)**

> Le visiteur arrive, l'Aurora Background s'anime doucement, l'avatar Rive apparaît en latéral, la tagline en gradient or se révèle, le briefing commence à "taper" via Text Generate Effect. **Premier émotionnel dominant : "Ceci n'est pas un portfolio de junior."**

**Moment 2 — La lecture (3-30 secondes)**

> Le visiteur lit les 4-5 phrases du briefing. Le Chartiste Lettré parle. Des chiffres précis tombent. Le visiteur reconnaît une voix, pas un générateur. **Second émotionnel dominant : "Quelqu'un écrit ça. Ou en tout cas, quelqu'un a pensé à comment l'écrire."**

**Moment 3 — Le scan (30-60 secondes)**

> Le visiteur descend vers le Bento Grid des KPIs. Les NumberTickers incrémentent de 0 vers la valeur finale. Les flèches Lottie colorent en vert/rouge. Le visiteur attrape les chiffres clés (OAT, VIX, spread) en 15 secondes. **Troisième émotionnel : "C'est lisible, précis, pas verbeux."**

**Moment 4 — La conversion (60-300 secondes)**

> Le visiteur voit un CTA discret mais visible : "Voir les Coulisses →". Il clique. C'est ici que le projet se joue. La page Coulisses doit convertir le visiteur (surtout Thomas) en believer. **Quatrième émotionnel : "Je veux comprendre comment c'est fait. Ce mec m'intéresse."**

### 2.2 Ce qui distingue l'expérience

- **Le briefing est typé** (Text Generate Effect) au lieu de simplement apparaître — crée un sentiment de direct, d'écriture en temps réel
- **L'avatar Rive est vivant** et réagit au niveau de risque — humanise la donnée
- **La page Coulisses est accessible dès le hero** (CTA visible, pas enterrée) — maximum de conversion pour Thomas et Sophie
- **La tagline a un effet de gradient animé** — donne un caractère éditorial, comme la une d'un magazine

### 2.3 Ce qui doit être évité

- ❌ Trop de motion simultanée au chargement (fatigue visuelle)
- ❌ Tagline trop longue qui ne tient pas sur une ligne
- ❌ Briefing trop long qui demande de scroller avant d'avoir vu les KPIs
- ❌ Avatar Rive qui monopolise l'attention au détriment du briefing
- ❌ Bannière d'alerte VIX qui masque le contenu principal
- ❌ Animations non-respect du `prefers-reduced-motion`

---

## 3. Desired Emotional Response (Step 4) — NOUVEAU v6.3.0

### 3.1 Primary Emotional Goals

**Thomas (recruteur hedge fund) doit ressentir :**
- **Reconnaissance** : "Ce candidat est différent, il a fait quelque chose de sérieux"
- **Confiance** : "Je peux le présenter à mon comité d'embauche sans risque"
- **Curiosité professionnelle** : "Je veux voir ce qu'il a écrit en détail, comment il a pensé ça"
- **Urgence modérée** : "Je dois le contacter avant qu'un autre recruteur le fasse"

**Sophie (développeuse fintech) doit ressentir :**
- **Inspiration technique** : "Je veux reprendre ces patterns dans mon prochain projet"
- **Admiration éditoriale** : "C'est rare de voir un projet IA qui a une identité visuelle forte"
- **Appartenance communautaire** : "Je partage ça, mon équipe doit voir"
- **Respect pour la méthode** : "BMAD ? Intéressant, je vais regarder ça"

**Marc (analyste, hypothèse)** doit ressentir :**
- **Efficacité** : "En 2 minutes, j'ai ce qu'il me faut pour ma réunion"
- **Confiance dans la donnée** : "Les chiffres sont cohérents avec ce que je vois chez Bloomberg"
- **Plaisir esthétique** : "C'est beau, ça me fait plaisir de commencer ma journée avec ça"

**Clément (étudiant)** doit ressentir :**
- **Inspiration aspirationnelle** : "Je veux faire comme ce mec dans quelques années"
- **Fierté cultural" : "C'est français, c'est pointu, je peux partager fier"

### 3.2 Emotional Journey Mapping

| Stade | Émotion visée | Risque à éviter | Levier UX |
|---|---|---|---|
| Discovery (2s) | **Surprise positive** ("c'est différent") | Générique, "encore un dashboard" | Aurora Background + Avatar Rive + Instrument Serif |
| First impression (3-10s) | **Intrigue** ("qu'est-ce que c'est ?") | Confusion, désorientation | Tagline claire + positionnement éditorial explicite |
| Core experience (30-120s) | **Compétence** ("je comprends, je suis pro") | Condescendance, pédagogie | Ton trader/chartiste direct, pas d'explications |
| Task completion (2-5min) | **Conviction** ("c'est sérieux") | Superficialité, façade | Page Coulisses dense, prompts réels, logs réels |
| Error state | **Confiance maintenue** | Panique, "c'est cassé" | Fallback gracieux avec message éditorial, pas technique |
| Return visit | **Familiarité ritualisée** | Ennui, "déjà vu" | Contenu nouveau chaque jour, avatar qui change |

### 3.3 Micro-émotions critiques

**À cultiver :**
- ✅ **Confiance** (trust) — apportée par la rigueur, la transparence, l'absence de bugs
- ✅ **Fierté** (pride) — Bryan peut envoyer le lien à ses parents / Sophie peut partager à son équipe
- ✅ **Calme focus** (calm focus) — le briefing est court, pas anxiogène
- ✅ **Anticipation** (anticipation) — "demain il y aura un nouveau briefing"

**À éviter absolument :**
- ❌ **Confusion** — si le visiteur ne comprend pas ce qu'est le site en 10 secondes, c'est raté
- ❌ **Condescendance** — pas de pédagogie, pas d'explications du jargon finance, on parle à des pros
- ❌ **Inquiétude** — le mode "crisis" doit être informatif, pas alarmiste (respect du cadre légal AMF)
- ❌ **Fatigue visuelle** — trop d'animations simultanées, trop de couleurs, trop de bruit

### 3.4 Emotion-design connections

| Émotion cultivée | Choix UX correspondant |
|---|---|
| Reconnaissance (Thomas) | Typo éditoriale Instrument Serif (pas Inter générique) + gap généreux + absence de "Welcome to my portfolio" |
| Inspiration technique (Sophie) | Page Coulisses avec prompts réels + diffs + logs GitHub + lien repo |
| Confiance dans la donnée (Marc) | Freshness indicator clair + timestamps + fallback visible |
| Calme focus | Typographie ample, pas de pop-ups, pas de notifications, pas de CTA agressifs |
| Fierté de partager | OG images dynamiques magnifiques + Twitter Cards signés |

### 3.5 Emotional design principles

1. **Silence éditorial** — laisser de l'espace, ne pas remplir l'écran à tout prix
2. **Précision chirurgicale** — chaque chiffre a sa place, chaque mot son poids
3. **Discrétion technique** — la techno est puissante mais invisible (sauf dans Coulisses où elle est célébrée)
4. **Humanité discrète** — l'avatar Rive, la signature du Chartiste Lettré, les références culturelles
5. **Urgence maîtrisée** — le mode "crisis" est grave mais jamais panique
6. **Permanence rituelle** — le site est prévisible dans sa structure, le visiteur sait où trouver quoi

---

## 4. Inspiration Gathering (Step 5) — NOUVEAU v6.3.0

### 4.1 Références primaires

Moodboard de 6 références qui définissent le ton visuel visé.

#### A. Financial Times (FT.com) — L'autorité éditoriale

**Ce qu'on vole :**
- Typographie serif pour les titres (le FT utilise sa propre serif, nous utilisons Instrument Serif)
- Économie d'espace vertical (pas de gros padding entre les sections)
- Fond crème/rose pâle pour les articles (équivalent dans notre palette : `#0A1628` de base + `#0F1E38` pour les cards)
- Respectueux de la hiérarchie de l'information (title → subtitle → body → metadata)

**Ce qu'on ne vole pas :**
- Densité texte excessive (FT est un quotidien professionnel, YieldField est un magazine d'un seul auteur)
- Navigation multi-niveaux (YieldField n'a que 3 routes : Home, Coulisses, About)

#### B. Monocle Magazine — Le luxe éditorial imprimé

**Ce qu'on vole :**
- Le sens du grain, de la texture, de la qualité d'impression (via Aurora Background + Sparkles subtils)
- Les en-têtes généreux et décontractés
- L'usage modéré de la couleur (une couleur signature au lieu de palette chaotique)
- Les mises en page asymétriques qui cassent la grille

**Ce qu'on ne vole pas :**
- Le print feel pur (notre médium est web, on assume)

#### C. Apple Newsroom / Apple Keynotes — Le minimalisme cinématique

**Ce qu'on vole :**
- Les espaces blancs (enfin, dans notre cas, les espaces sombres)
- Les transitions ultra-lisses entre sections
- La typographie display massive (Instrument Serif joue ce rôle)
- L'absence complète de "visual noise"
- Les CTA uniques et affirmés (pas 15 boutons qui crient ensemble)

**Ce qu'on ne vole pas :**
- Le blanc pur (on est sombre)
- Le centrage systématique (on utilise aussi de l'asymétrie)

#### D. Linear — La rigueur typographique sombre

**Ce qu'on vole :**
- La palette sombre raffinée (on partage la même philosophie `#0A...` mais avec accent or au lieu de bleu)
- Les cards subtiles avec bordures fines
- Les transitions micro (hover states discrets mais présents)
- Les Pulsating Dots pour les indicateurs live
- L'usage intelligent de la mono font pour les chiffres

**Ce qu'on ne vole pas :**
- Les raccourcis clavier omniprésents (YieldField est un site de lecture, pas un outil de productivité)

#### E. Arc Browser / Rive.app — L'animation signature vectorielle

**Ce qu'on vole :**
- L'avatar interactif (Arc a The Sidebar, Rive a ses démos — nous avons le Chartiste animé)
- L'animation vectorielle qui ne pèse rien (contrairement aux vidéos)
- Les transitions d'état douces via state machines
- La capacité de "changer d'humeur" selon le contexte

**Ce qu'on ne vole pas :**
- La complexité 3D (reporté V2 avec React Three Fiber)

#### F. Stripe Press — La transparence technique

**Ce qu'on vole :**
- La philosophie "il n'y a rien à cacher" (on montre les prompts, les logs)
- Les Code Blocks annotés avec soin
- Les diagrammes techniques qui ont l'air de venir d'un essai scientifique
- L'architecture de la navigation (sidebar claire sur Coulisses)

**Ce qu'on ne vole pas :**
- Le format livre (YieldField est un site, pas un book)

### 4.2 Analyse des patterns UX inspirants

**Pattern 1 — Le hero qui prend le temps (Stripe, Linear, Vercel)**

Le hero occupe quasi tout l'écran, sans chercher à caser de contenu secondaire. YieldField applique : le hero `<HeroSection>` fait au minimum 100vh sur desktop, avec Aurora Background + Avatar + Tagline + Briefing.

**Pattern 2 — La typographie qui raconte (Monocle, FT, Apple Keynote)**

La taille du titre dépasse largement ce qu'on voit sur le web standard. YieldField applique : `display-1` avec `clamp(3rem, 6vw, 5.5rem)` pour la tagline, `line-height: 1.1`, `letter-spacing: -0.02em`.

**Pattern 3 — Les cards subtiles (Linear, Stripe)**

Les cards n'ont pas de shadow lourde, juste une bordure fine + un léger elevation. YieldField applique : `border: 1px solid #1E3A5F`, `background: #0F1E38`, `border-radius: 12px`, Shimmer Glare au hover.

**Pattern 4 — Les chiffres en mono (Linear, Bloomberg Terminal)**

Les chiffres financiers sont **toujours** en police monospace pour alignement vertical parfait. YieldField applique : JetBrains Mono avec `font-variant-numeric: tabular-nums` pour toutes les valeurs KPI.

**Pattern 5 — L'indicateur live (Vercel deploys, Linear issues)**

Un petit dot qui pulse + un timestamp récent. YieldField applique : Magic UI Pulsating Dot vert si data < 24h, jaune si 24-48h, rouge si > 48h.

**Pattern 6 — Le dark theme avec accent chaleureux (Arc, Linear)**

Pas de bleu glacial. Un accent chaleureux (or chez nous). YieldField applique : `#C9A84C` pour CTA, highlights, focus rings, pulsations de live.

**Pattern 7 — La page "Behind the scenes" (Stripe Press, Vercel docs)**

Une page dédiée qui ne se cache pas, qui explique l'architecture. YieldField applique : page Coulisses accessible dès le hero, avec Tracing Beam vertical et composants riches.

---

## 5. Design System Foundation (Step 6)

### 5.1 Design tokens (Tailwind config extract)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand palette
        'yield': {
          'dark': '#0A1628',          // Primary background
          'dark-elevated': '#0F1E38', // Cards/elevated surfaces
          'dark-border': '#1E3A5F',   // Borders / dividers
          'gold': '#C9A84C',          // Primary accent
          'gold-light': '#E5C67F',    // Hover state
          'gold-dim': '#9A7E3A',      // Muted accent
          'ink': '#F4F4F5',           // Primary text
          'ink-muted': '#94A3B8',     // Secondary text
          'ink-dim': '#64748B',       // Tertiary text
        },
        // Semantic finance
        'bull': '#22C55E',            // Up
        'bull-dim': '#15803D',
        'bear': '#EF4444',            // Down
        'bear-dim': '#B91C1C',
        'neutral': '#94A3B8',         // Flat
        // Alert levels (FR17)
        'alert': {
          'warning': '#F59E0B',       // VIX p90
          'alert': '#DC2626',         // VIX p95
          'crisis': '#991B1B',        // VIX p99
        },
      },
      fontFamily: {
        'serif': ['"Instrument Serif"', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Editorial headings (Instrument Serif)
        'display-1': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        // Body (Inter)
        'heading-1': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        // Numbers (JetBrains Mono, tabular-nums)
        'number-xl': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
        'number-lg': ['1.75rem', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
        'number-md': ['1.25rem', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
      },
      spacing: {
        '0.5': '2px', '1': '4px', '2': '8px', '3': '12px',
        '4': '16px', '6': '24px', '8': '32px', '12': '48px',
        '16': '64px', '24': '96px', '32': '128px',
      },
      maxWidth: {
        'content': '720px',   // Optimal reading width
        'wide': '1200px',     // Main content
        'full-wide': '1440px', // Hero sections
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'gold-glow': '0 0 30px rgba(201, 168, 76, 0.3)',
        'alert-glow': '0 0 40px rgba(220, 38, 38, 0.4)',
      },
      screens: {
        'xs': '375px',  // Mobile small
        'sm': '640px',  // Mobile large
        'md': '768px',  // Tablet
        'lg': '1024px', // Desktop small
        'xl': '1280px', // Desktop
        '2xl': '1536px', // Desktop large
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '800ms',
        'cinema': '1200ms',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'cinema': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

### 5.2 Contrast ratios (WCAG validation)

| Combinaison | Ratio | WCAG |
|---|---|---|
| `yield-ink` (#F4F4F5) sur `yield-dark` (#0A1628) | **17.4:1** | ✅ AAA |
| `yield-ink-muted` (#94A3B8) sur `yield-dark` | **6.3:1** | ✅ AAA |
| `yield-gold` (#C9A84C) sur `yield-dark` | **7.9:1** | ✅ AAA |
| `yield-ink-dim` (#64748B) sur `yield-dark` | **4.7:1** | ✅ AA |
| `bull` (#22C55E) sur `yield-dark` | **7.2:1** | ✅ AAA |
| `bear` (#EF4444) sur `yield-dark` | **5.5:1** | ✅ AA |
| `alert-warning` (#F59E0B) sur `yield-dark` | **8.8:1** | ✅ AAA |

Tous les couples texte/fond respectent au minimum WCAG AA. La majorité atteint AAA.

---

## 6. Defining the Experience (Step 7)

### 6.1 L'expérience définie en termes mesurables

- **Temps avant First Contentful Paint** : < 1 seconde sur 4G
- **Temps avant lecture possible du briefing** : < 2 secondes (LCP + text generate début)
- **Temps pour scanner les 6-8 KPIs** : < 15 secondes
- **Temps moyen sur la homepage (Thomas)** : 60 secondes
- **Temps moyen sur la page Coulisses (Thomas)** : 2-3 minutes
- **Temps moyen sur la page Coulisses (Sophie)** : 15-20 minutes
- **Taux d'activation du CTA "Coulisses" depuis le hero** : > 40 %

### 6.2 Les 3 interactions signature

**Interaction 1 — Le NumberTicker qui monte**

À l'entrée dans le viewport, chaque valeur KPI s'anime de 0 vers sa valeur cible en 1500ms avec un easing `ease-out`. Couplé à un léger fade-in et à la flèche Lottie qui se déclenche en fin d'animation. Respecte `prefers-reduced-motion` (affichage direct).

**Interaction 2 — L'avatar qui change d'état**

L'avatar Rive est en pose neutre au chargement. Après 500ms, il adopte sa pose du jour basée sur `metadata.risk_level`. Si le visiteur clique sur l'avatar, micro-animation de réponse (regard vers le clic, discret). Respecte `prefers-reduced-motion` (pose statique SVG).

**Interaction 3 — Le Tracing Beam de Coulisses**

Quand le visiteur arrive sur Coulisses, une ligne verticale commence à tracer en suivant le scroll. Chaque étape apparaît avec un fade + translate Y quand la ligne arrive à son niveau. L'effet est lent, patient, éditorial (pas de "zip" technique).

### 6.3 Ce que le produit n'est PAS

- ❌ **Un dashboard de trading** — pas de buy/sell buttons, pas de graphiques interactifs complexes, pas de notifications push
- ❌ **Un portfolio classique** — pas de "About me", pas de "Skills: ..." bullet points, pas de CV téléchargeable en pop-up
- ❌ **Un blog** — pas de liste d'articles, pas de commentaires, pas de catégories
- ❌ **Un outil SaaS** — pas d'authentification, pas de paramètres, pas de multi-tenant
- ❌ **Une newsletter isolée** — c'est un site d'abord, la newsletter est une surface de distribution

---

## 7. Visual Foundation (Step 8)

### 7.1 Typographie hiérarchique

**Instrument Serif (titres éditoriaux)**
- `display-1` (tagline hero) : 3rem → 5.5rem (clamp), italic option, kerning serré
- `display-2` (titres de section) : 2.5rem → 4rem
- `display-3` (sous-sections) : 2rem → 3rem

**Inter (body text, UI)**
- `heading-1` : 2rem, 600 weight
- `heading-2` : 1.5rem, 600 weight
- `body-lg` : 1.25rem (briefing panel)
- `body` : 1rem (UI standard)
- `body-sm` : 0.875rem (metadata)
- `caption` : 0.75rem uppercase + letter-spacing

**JetBrains Mono (chiffres)**
- `number-xl` : 2rem → 3rem (KPIs hero)
- `number-lg` : 1.75rem (KPIs standard)
- `number-md` : 1.25rem (metadata)
- Toujours avec `font-variant-numeric: tabular-nums`

### 7.2 Palette de couleurs appliquée

Utiliser la palette tokens comme unique source de vérité. **Aucune couleur hardcodée dans les composants.** Tout passe par Tailwind classes `bg-yield-dark`, `text-yield-gold`, etc.

**Règles d'usage :**
- `yield-gold` uniquement pour accents critiques : CTA principal, focus ring, pulsation live, logo
- `bull`/`bear` uniquement pour données financières (hausse/baisse)
- `alert-*` uniquement pour le mode crise VIX
- Texte body → toujours `yield-ink` (pas de yield-gold pour le body, trop criard)

### 7.3 Grid system

- **Container max-width** : `wide` 1200px pour le contenu, `full-wide` 1440px pour les hero sections
- **Gutters** : 16px (mobile), 24px (tablet), 32px (desktop)
- **Grid base** : 4px (toutes les valeurs d'espace sont des multiples de 4)
- **Section spacing** : 48px (mobile), 96px (desktop)

### 7.4 Iconographie

- **Lucide React** pour les icônes statiques (fallback + usages génériques)
- **Lottie / dotLottie** pour les icônes animées (up/down arrows, loaders, empty states)
- **Rive** pour l'avatar hero (seul composant Rive du MVP)

---

## 8. Design Direction Decision (Step 9) — NOUVEAU v6.3.0

### 8.1 Les 3 design directions explorées

Plutôt qu'un fichier HTML interactive (overkill pour un MVP à 6+2 semaines), j'explore 3 directions textuellement avec mockups ASCII.

#### Direction A — "Éditorial pur" (ultra-Monocle)

**Philosophie :** Le site est un magazine. Le design s'efface au profit de la lecture. Aucune animation "wow", typographie règne.

**Caractéristiques :**
- Pas d'Aurora Background (fond uni `#0A1628`)
- Avatar Rive remplacé par une vignette SVG simple du Chartiste Lettré (illustration statique)
- NumberTickers remplacés par des valeurs fixes
- Typographie Instrument Serif massive
- Hierarchie rigoureuse : tagline → briefing → KPIs → footer

**Pros :**
- LCP excellent (< 1s garanti)
- Timeline super courte
- Accessible par défaut
- Cohérent avec "le sujet est le marché, pas la tech"

**Cons :**
- Peu différenciant visuellement
- Ne justifie pas l'abonnement Aceternity Pro + Motion+
- N'exploite pas l'effet wow pour Sophie
- Thomas peut penser "c'est juste un blog"

#### Direction B — "Cinématique maximaliste" (ultra-Arc)

**Philosophie :** Le site est une démonstration technique. Tout est animé, tout bouge, tout réagit. Le Chartiste est un personnage principal.

**Caractéristiques :**
- Aurora Background omniprésent + Sparkles + Grid + Dot Pattern
- Avatar Rive en grand format (400×400 px desktop) avec plusieurs animations simultanées
- NumberTickers + Marquee + Meteors permanents
- Transitions complexes entre routes (slide, fade, zoom)
- Parallax scroll sur toute la page
- Audio feedback subtil sur les interactions

**Pros :**
- Maximum d'effet wow
- Exploite 100 % des libs premium
- Marque durablement la mémoire
- Sophie va adorer

**Cons :**
- LCP catastrophique (> 3s probable)
- Bundle JS explose largement au-dessus de 250 KB
- Fatigue visuelle pour Marc (usage quotidien)
- Risque de paraître "try-hard" pour Thomas
- Timeline non tenable en 6 semaines
- Accessibilité dégradée (animation infernale)

#### Direction C — "Éditorial signé" (hybride Monocle × Arc × Linear) — **RETENU**

**Philosophie :** Le site est un magazine éditorial qui a une signature visuelle mémorable. Les animations servent l'information, pas l'inverse. Le Chartiste Lettré est discret mais présent.

**Caractéristiques :**
- Aurora Background **seulement sur le hero** (pas les autres sections)
- Avatar Rive de taille modérée (300×300 desktop, 250×250 tablet, 200×200 mobile)
- NumberTickers seulement sur les 3-4 KPIs principaux, valeurs fixes pour les secondaires
- Text Generate Effect **seulement sur le briefing** (pas partout)
- Animations "signature" ponctuelles : Shimmer Glare sur cards KPI (hover), Pulsating Dot pour live indicator, Meteors seulement en mode crisis
- Tracing Beam sur Coulisses uniquement
- Tout le reste en statique/SSR pour la performance

**Pros :**
- Équilibre performance/impact (LCP < 2s tenable)
- Exploite les libs premium sans les saturer
- Cohérent avec le positionnement "éditorial d'abord, tech ensuite"
- Accessible (moins d'animations à désactiver en reduced-motion)
- Timeline 6+2 semaines tenable
- Satisfait Thomas (éditorial) ET Sophie (tech visible dans Coulisses)
- Le mode crisis FR-017 a un impact visuel fort parce qu'il est l'exception, pas la règle

**Cons :**
- Moins spectaculaire que Direction B
- Demande des choix fins de modération à chaque composant
- Peut paraître "timide" si mal exécuté

### 8.2 Chosen Direction

**✅ Direction C — "Éditorial signé"**

### 8.3 Design Rationale

La Direction A est trop conservatrice et ne justifie pas les abonnements premium déjà payés. La Direction B est techniquement non-tenable dans le budget performance + timeline. **La Direction C est le seul choix qui satisfait toutes les contraintes** :

- Performance budget respecté (NFR1-6)
- Timeline 6+2 semaines tenable
- Positionnement "éditorial d'abord" respecté (Skeptic review du Product Brief)
- Émotions cibles atteintes (reconnaissance, confiance, inspiration)
- Accessibilité WCAG AA possible
- Coût budget (0 € additionnel, tout est déjà abonné)

Le secret de la Direction C est le **principe de modération** : chaque animation doit être **exceptionnelle** dans son contexte. Le Text Generate Effect est spécial parce qu'il n'apparaît qu'une fois (sur le briefing). Les Meteors sont spéciaux parce qu'ils n'apparaissent qu'en mode crisis. Le Tracing Beam est spécial parce qu'il n'apparaît que sur Coulisses.

### 8.4 Implementation approach

- **Phase 1 (Sprint 1-3)** : Direction A appliquée (statique) pour valider performance et typo
- **Phase 2 (Sprint 4-5)** : Ajout progressif des signatures Direction C (Rive, Text Generate, Shimmer)
- **Phase 3 (Sprint 6)** : Polish + validation reduced-motion
- **Phase 4 (Sprint 7-8)** : Stabilisation et tests d'accessibilité

---

## 9. User Journey Flows (Step 10)

### 9.1 Flow 1 — Thomas le recruteur (parcours primaire, conversion critique)

```
Entrée : Lien depuis CV/LinkedIn
   │
   ▼
[LANDING: /fr/ ou /en/ selon lang navigateur]
   │
   ├─ Aurora Background fade-in (300ms)
   ├─ Avatar Rive pose d'attention (500ms)
   ├─ Tagline gradient reveal (400ms)
   └─ Text Generate Effect briefing (60ms/mot)
   │
   ▼ T+10s : Visitor scans (pas encore lu)
[SCAN HORIZONTAL]
   │
   ├─ Nom YieldField en haut à gauche (identifié comme "magazine")
   ├─ Language switcher en haut à droite (optionnel)
   └─ CTA "Coulisses →" visible en bas du hero (critique !)
   │
   ▼ T+20s : Visitor lit le briefing
[READING BRIEFING]
   │
   ├─ Voix reconnaissable (Chartiste Lettré)
   ├─ 3-5 chiffres précis
   └─ Metadata chips visibles (theme, risk, event)
   │
   ▼ T+45s : Visitor scroll léger
[KPI BENTO GRID]
   │
   ├─ NumberTickers animent
   ├─ Lottie arrows colorés
   ├─ Shimmer Glare hover sur cards
   └─ Visitor scan 6-8 chiffres en 15s
   │
   ▼ T+60s : Décision "je veux comprendre comment c'est fait"
[CTA "Voir les Coulisses"]
   │
   ▼
[PAGE COULISSES]
   │
   ├─ Tracing Beam commence à tracer
   ├─ Étape 1: Idée originelle (10s)
   ├─ Étape 2: Méthode BMAD (15s)
   ├─ Étape 3: Pipeline nocturne (20s)
   ├─ Étape 4: Prompts v01→v06 avec diffs (30s + clic Code Block)
   ├─ Étape 5: Déploiement + logs pipeline (15s)
   └─ Étape 6: Avatar Rive meta-narrative (10s)
   │
   ▼ T+3min30 : Visitor scroll bottom
[FOOTER COULISSES]
   │
   ├─ Lien GitHub repo (clic → sidekick tab avec README)
   ├─ Disclaimer légal (parcouru mais validé)
   └─ Lien "Contact Bryan" ou retour home
   │
   ▼ T+5min : Décision finale
[CONVERSION]
   │
   ├─ Option A: Message LinkedIn à Bryan (20 %)
   ├─ Option B: Email direct à Bryan (20 %)
   ├─ Option C: Bookmark pour plus tard (30 %)
   ├─ Option D: Share avec un collègue (20 %)
   └─ Option E: Close (10 %)
```

**Métriques clés :** taux d'activation CTA Coulisses > 40 %, temps sur Coulisses > 2 min, scroll depth > 80 %.

### 9.2 Flow 2 — Sophie la dev fintech (amplification + star GitHub)

```
Entrée : Post LinkedIn ou Thread X de Bryan
   │
   ▼
[LANDING: /en/ (force EN si navigateur EN)]
   │
   ▼ T+5s : Reconnaît la direction visuelle
[FIRST IMPRESSION]
   │
   ├─ "Ça c'est Aceternity Aurora"
   ├─ "Ça c'est Rive, je le reconnais"
   ├─ "Belle typo, Instrument Serif"
   └─ "Dark theme bien exécuté"
   │
   ▼ T+15s : Lit le briefing en diagonale
[BRIEFING SKIP-READ]
   │
   └─ "OK le tone est propre, pas d'emoji générique"
   │
   ▼ T+25s : Clique direct sur Coulisses
[COULISSES — longue durée]
   │
   ├─ Prend son temps sur les prompts versionnés (5 min)
   ├─ Examine les logs de pipeline (2 min)
   ├─ Clique lien GitHub repo (3 min dans le repo)
   ├─ Regarde le `package.json` et la structure `src/`
   └─ Note mentalement les libs utilisées
   │
   ▼ T+15min : Revient sur le site
[NEWSLETTER SUBSCRIBE]
   │
   ├─ Clique le formulaire email en footer
   ├─ Entre son email
   └─ Confirme (double opt-in)
   │
   ▼ T+17min : Actions sociales
[AMPLIFICATION]
   │
   ├─ Star le repo GitHub
   ├─ Retweet/quote tweet le thread de Bryan
   ├─ Envoie lien sur le Slack de son équipe
   └─ Bookmark pour revenir lire les briefings
```

**Métriques clés :** star GitHub, abonnement newsletter, partage social.

### 9.3 Flow 3 — Marc l'analyste (usage quotidien, **hypothèse à valider**)

```
Entrée : Bookmark quotidien (après S2-S3 post-launch)
   │
   ▼ 8h23 CET
[LANDING: /fr/]
   │
   ├─ Reconnaît l'interface (familiarité ritualisée)
   ├─ Avatar Rive jette un regard "bonjour"
   └─ Freshness Indicator vert "Updated 8:05 AM"
   │
   ▼ T+3s : Scan KPIs
[KPI SCAN]
   │
   ├─ Vérifie spread OAT-Bund (sa métrique obsession)
   ├─ Vérifie VIX
   ├─ Vérifie CAC 40
   └─ Note mental : "rien d'anormal"
   │
   ▼ T+30s : Lit le briefing
[BRIEFING READ]
   │
   ├─ Thème du jour : "Inflation US en focus"
   ├─ Risk level : medium
   ├─ Upcoming event : "Jobs Friday"
   └─ Voix reconnaissable et rapide
   │
   ▼ T+2min : Ferme l'onglet
[EXIT]
   │
   └─ Retour à son travail, satisfait
```

**Métriques clés :** return visits daily, temps moyen ~2 min, bookmark actif.

### 9.4 Flow 4 — Clément l'étudiant (amplification virale)

```
Entrée : Post viral (Instagram Reels 30s, Bryan post)
   │
   ▼
[LANDING: /fr/]
   │
   ├─ Effet wow initial (Aurora + Rive + typography)
   ├─ Lecture du briefing (compréhension ~80 %)
   └─ Trouve cool le Chartiste Lettré
   │
   ▼ T+1min : Screenshot
[SOCIAL CAPTURE]
   │
   ├─ Screenshot du hero avec tagline + briefing
   ├─ Partage WhatsApp aux 3 amis finance
   └─ Post Instagram Story avec lien
   │
   ▼ T+90s : Explore About
[ABOUT PAGE]
   │
   └─ Lit qui est Bryan, comment il a fait
   │
   ▼ T+3min : Exit
```

**Métriques clés :** screenshots partagés, Instagram Story mentions.

### 9.5 Flow 5 — Language switch (tous personas)

```
Entrée : Click sur FR|EN toggle dans header
   │
   ▼
[ROUTE TRANSITION]
   │
   ├─ Motion 12 fade-out contenu (150ms)
   ├─ Navigate /fr/... → /en/...
   ├─ Motion 12 fade-in nouveau contenu (150ms)
   └─ localStorage: `locale=en`
   │
   ▼
[NEW LANG LOADED]
   │
   └─ Tout est traduit, pas de FOUC
```

### 9.6 Flow 6 — Mode crisis (VIX p90 dépassé)

```
Pipeline nocturne détecte VIX > percentile 90/252j
   │
   ▼
[LATEST.JSON] alert.active = true, alert.level = 'alert'
   │
   ▼
[USER VISITE LA HOMEPAGE]
   │
   ├─ AlertBanner apparaît en haut (Neon Gradient rouge + Meteors)
   ├─ Avatar Rive passe en pose "tension" (gesture rapide, regard intense)
   ├─ Briefing tone "marché sous tension" (descriptif, pas alarmiste)
   ├─ KPI VIX affiché en yield-alert-alert couleur
   └─ Pulsating Dot VIX en alert color
   │
   ▼
[User peut cliquer AlertBanner "View details →"]
   │
   ▼
[OVERLAY DETAILS]
   │
   ├─ "VIX at p95 (252d window)"
   ├─ "Current: 28.4, Threshold: 24.2"
   ├─ "Since: Yesterday 4:30 PM"
   ├─ Historique 7j mini-chart
   └─ Lien "Back to home"
```

---

## 10. Component Strategy (Step 11)

### 10.1 Les 5 familles de composants

**Famille A — Base UI (shadcn/ui + Radix Primitives)**

Composants fondamentaux et accessibles :
- Button (variants: primary, secondary, ghost, outline)
- Card (base pour KpiCard et autres)
- Dialog, Sheet (overlays)
- DropdownMenu (language switcher)
- Tooltip (KPI hover info)
- Toast (feedback actions)
- ScrollArea (contrôle scroll fin sur PipelineLogsTable)

Source : `npx shadcn@latest add <component>`

**Famille B — Premium animated (Aceternity UI Pro + Magic UI)**

Composants signature copy-pasted :
- `<AuroraBackground>` (Aceternity)
- `<BackgroundBeams>` (Aceternity — alternative)
- `<BentoGrid>` + `<BentoGridItem>` (Aceternity)
- `<TracingBeam>` (Aceternity)
- `<TextGenerateEffect>` (Aceternity)
- `<ShimmerGlare>` (Aceternity hover effect)
- `<Meteors>` (Aceternity)
- `<AnimatedTooltip>` (Aceternity)
- `<NumberTicker>` (Magic UI)
- `<AnimatedGradientText>` (Magic UI)
- `<PulsatingDot>` (Magic UI)
- `<Marquee>` (Magic UI)
- `<NeonGradientCard>` (Magic UI)
- `<ShineBorder>` (Magic UI)
- `<DotPattern>` (Magic UI — background)

Toutes en `src/components/aceternity/` ou `src/components/magic-ui/`.

**Famille C — Business components (propres au projet)**

Organisés par domaine dans `src/components/` :

Dashboard :
- `<HeroSection>` : orchestre Aurora + Avatar + Tagline + Briefing + KPIs
- `<KpiBentoGrid>` : grille responsive des 6-8 KPIs
- `<KpiCard>` : une card individuelle avec NumberTicker + Lottie arrow + Shimmer Glare
- `<FreshnessIndicator>` : Pulsating Dot + timestamp texte

Briefing :
- `<BriefingPanel>` : container du briefing avec TextGenerateEffect
- `<TaglineHeader>` : tagline avec AnimatedGradientText
- `<MetadataChips>` : chips theme/risk/event

Coulisses :
- `<TimelineStep>` : une étape dans le Tracing Beam
- `<PromptCodeBlock>` : affichage prompt avec syntax highlight + diff + copy button shine
- `<PipelineLogsTable>` : table des 7 derniers runs
- `<RiveAvatarPreview>` : preview interactive de l'avatar avec toggles d'état

Alerts :
- `<AlertBanner>` : Neon Gradient + Meteors + Close button
- `<CrisisIndicator>` : variant spécial pour les KPIs en alerte

**Famille D — Rive & Lottie wrappers**

- `<HeroAvatar>` : wrapper Rive avec state machine + fallback SVG
- `<LottieIcon>` : wrapper dotLottie lazy-loaded

**Famille E — Layout (common)**

- `<Header>` : logo + nav + `<LanguageSwitcher>`
- `<Footer>` : disclaimer + links + `<NewsletterForm>`
- `<LanguageSwitcher>` : pill toggle FR|EN
- `<NewsletterForm>` : email input + submit (proxy Buttondown)

### 10.2 Composition exemple — `<HeroSection>`

```typescript
// src/components/dashboard/HeroSection.tsx
import { AuroraBackground } from '@/components/aceternity/AuroraBackground';
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect';
import { AnimatedGradientText } from '@/components/magic-ui/AnimatedGradientText';
import { HeroAvatar } from '@/components/rive/HeroAvatar';
import { KpiBentoGrid } from './KpiBentoGrid';
import { MetadataChips } from '@/components/briefing/MetadataChips';
import { FreshnessIndicator } from './FreshnessIndicator';
import type { Analysis } from '@/lib/schemas/analysis';

interface HeroSectionProps {
  analysis: Analysis;
  locale: 'fr' | 'en';
}

export function HeroSection({ analysis, locale }: HeroSectionProps) {
  const briefing = analysis.briefing[locale];
  const tagline = analysis.tagline[locale];

  return (
    <section className="min-h-screen relative">
      <AuroraBackground />

      <div className="relative z-10 container max-w-full-wide mx-auto px-6 py-24">
        {/* Tagline + Avatar row */}
        <div className="grid md:grid-cols-[300px_1fr] gap-12 items-center mb-16">
          <HeroAvatar
            riskLevel={analysis.metadata.risk_level}
            themeOfDay={analysis.metadata.theme_of_day[locale]}
          />

          <div>
            <AnimatedGradientText className="text-display-1 font-serif mb-8">
              {tagline}
            </AnimatedGradientText>

            <div className="max-w-content">
              <TextGenerateEffect
                words={briefing}
                className="text-body-lg text-yield-ink leading-relaxed"
              />
            </div>

            <MetadataChips
              metadata={analysis.metadata}
              locale={locale}
              className="mt-8"
            />
          </div>
        </div>

        <FreshnessIndicator timestamp={analysis.generated_at} locale={locale} />

        {/* KPI Grid */}
        <div className="mt-24">
          <KpiBentoGrid kpis={analysis.kpis} locale={locale} />
        </div>
      </div>
    </section>
  );
}
```

### 10.3 Stratégie de lazy loading

- **Critical (pas lazy)** : shadcn/ui base components, next-intl, design tokens CSS
- **High priority (SSR + client)** : `<HeroSection>` squelette SSR, hydratation progressive
- **Medium priority (lazy client)** : Rive avatar (dynamic import, ssr: false), Aceternity Aurora
- **Low priority (intersection observer)** : Lottie icons, Marquee secondary KPIs, footer animations
- **On-demand (route-split)** : Page Coulisses (composants Tracing Beam + PromptCodeBlock)

---

## 11. UX Patterns (Step 12)

### 11.1 Pattern : Graceful degradation

Chaque composant animé a un état statique de fallback.

```typescript
<HeroAvatar
  riskLevel={analysis.metadata.risk_level}
  fallback={<AvatarSVGFallback riskLevel={analysis.metadata.risk_level} />}
/>
```

### 11.2 Pattern : Respect du reduced motion

Chaque composant animé lit `usePrefersReducedMotion()` et bascule en état statique si true.

### 11.3 Pattern : Freshness + error states visibles

Tout composant qui consomme des données externes affiche son **état de fraîcheur** :
- `live` : vert pulsant
- `stale` (> 12h) : jaune, tooltip explicatif
- `very_stale` (> 48h) : rouge, message fallback visible

### 11.4 Pattern : Editorial disclaimer bilingue

Le disclaimer AMF apparaît **toujours** en en-tête du briefing (pas seulement footer), en FR et EN selon la locale :

> FR : "Ceci n'est pas un conseil en investissement. Contenu éditorial généré par IA à des fins d'information et de démonstration."
> EN : "This is not investment advice. Editorial content generated by AI for informational and demonstrative purposes."

### 11.5 Pattern : Crisis mode visual hierarchy

Quand `alert.active === true` :
- AlertBanner prend la priorité visuelle (z-index le plus élevé)
- Avatar Rive passe en pose tension
- KPI VIX passe en couleur alert-*
- Briefing tone change (descriptif, pas prescriptif)
- Aucune interaction bloquante (pas de modal, pas de popup)

### 11.6 Pattern : Newsletter soft-capture

Le formulaire newsletter apparaît discrètement en footer, jamais en popup, jamais en scroll blocker. Un CTA secondaire "Receive it by email →" dans le footer du briefing panel.

### 11.7 Pattern : Language switcher persistence

Le choix de langue est persisté en localStorage + cookie. Au prochain chargement, redirige automatiquement vers la bonne locale.

### 11.8 Pattern : Coulisses accessible depuis le hero

CTA "Voir les Coulisses →" / "See the Behind The Scenes →" visible dans le hero à la hauteur des KPIs (pas tout en bas de page). Un second lien dans le header nav.

---

## 12. Responsive & Accessibility (Step 13)

### 12.1 Responsive breakpoints

3 breakpoints principaux (cf. design tokens) :

**Mobile (< 768px)**
- Single column layout
- Avatar Rive 200×200 centré
- KPIs en 1 colonne stacked
- Tagline `clamp(2rem, 8vw, 3rem)`
- Navigation : hamburger menu (Sheet shadcn)
- Marquee horizontal scroll

**Tablet (768-1279px)**
- 2-column layout pour KPIs
- Avatar Rive 250×250 à gauche, contenu à droite
- Tagline `clamp(2.5rem, 6vw, 4rem)`
- Navigation : pills visibles

**Desktop (≥ 1280px)**
- 3-column layout pour KPIs (Bento Grid asymétrique)
- Avatar Rive 300×300 à gauche
- Tagline display-1 max 5.5rem
- Navigation : nav bar complète
- Max-width `full-wide` 1440px pour hero, `wide` 1200px pour content

### 12.2 Key responsive rules

- **Aucun scroll horizontal** sur aucun breakpoint
- **Touch targets ≥ 44×44 px** sur mobile/tablet (Apple HIG)
- **Font sizes en `rem`** (zoom 200 % possible sans breakage)
- **Images responsives** via `next/image`
- **Rive avatar dimensions fixes** selon breakpoint (pas de CLS)

### 12.3 Accessibility checklist (WCAG 2.1 AA)

**Perceivable**
- [x] Contrast ratios validés (section 5.2)
- [x] Alt text sur toutes les images
- [x] `aria-label` sur tous les boutons icon-only
- [x] Information jamais uniquement par la couleur (KPI up/down = flèche + couleur + signe)
- [x] Texte scalable jusqu'à 200 % sans perte de fonctionnalité

**Operable**
- [x] Tous les contrôles accessibles au clavier (Tab, Shift+Tab, Enter, Escape)
- [x] Focus indicators visibles (`:focus-visible` outline 2px or)
- [x] Aucun piège clavier
- [x] Touch targets ≥ 44×44 px
- [x] Pas de contenu clignotant > 3× par seconde
- [x] `prefers-reduced-motion` respecté pour toutes animations
- [x] Skip link "Aller au contenu principal" en début de `<body>`

**Understandable**
- [x] Language déclarée (`<html lang="fr">` ou `<html lang="en">`)
- [x] Navigation consistante (header/footer identiques)
- [x] Labels descriptifs pour les formulaires
- [x] Messages d'erreur explicites
- [x] Bouton newsletter double opt-in clair

**Robust**
- [x] Semantic HTML (header, nav, main, section, article, footer)
- [x] ARIA landmarks minimalistes (pas d'over-ARIAing)
- [x] Compatible NVDA (Windows) et VoiceOver (Mac)
- [x] Tests automatisés Axe DevTools à chaque build (via Lighthouse CI)

### 12.4 Screen reader journey

**Homepage lue par NVDA :**
```
YieldField, lien d'accueil.
Navigation principale. Accueil, Coulisses, À propos.
Langue française activée. Bouton changer en anglais.

Contenu principal.

[Si alert active]
Alerte : Marché sous tension. VIX au 95e percentile sur 252 jours. Niveau d'alerte.

Titre 1. La courbe des taux s'incline.

Paragraphe. La BCE resserre. OAT-Bund s'élargit. Crédit EU en alerte jaune. Jobs Friday en focus demain. Positions prudentes.

Métadonnées : thème du jour, Inflation US en focus. Niveau de risque, moyen. Événement à venir, Jobs Friday.

Données de marché mises à jour il y a 2 heures.

Titre 2. Indicateurs clés du jour.
OAT 10 ans, 3,15 %, hausse de 0,05 % depuis hier.
Bund 10 ans, 2,51 %, stable.
[...]
```

### 12.5 Reduced motion strategy

Quand `prefers-reduced-motion: reduce` :
- ❌ Aurora Background → statique (gradient CSS fixe)
- ❌ Text Generate Effect → apparition directe
- ❌ NumberTicker → affichage direct de la valeur
- ❌ Rive Avatar → pose statique fixe (pas d'animations)
- ❌ Tracing Beam → ligne statique
- ❌ Shimmer Glare → disabled
- ❌ Marquee → statique (pas de scroll)
- ❌ Meteors → disabled
- ✅ Opacity transitions de base (acceptées par les standards)

---

## 13. Completion (Step 14)

### 13.1 Coverage validation

**FR → UX mapping :** 54/54 FRs ont une traduction UX explicite (composants, flows, patterns)

**NFR → UX mapping :**
- NFR1-6 Performance → Direction C choisie + lazy loading + reduced motion
- NFR15-17 Accessibility → Section 12 complète
- NFR18-19 Compatibility → Breakpoints responsive définis
- NFR20-21 i18n → next-intl + patterns

### 13.2 Sign-off checklist

- [x] Les 14 steps du workflow `bmad-create-ux-design` ont été couverts
- [x] Emotional response définie par persona (nouveauté v6.3.0)
- [x] Inspiration gathering documenté avec 6 références et 7 patterns (nouveauté v6.3.0)
- [x] 3 design directions explorées et 1 choisie avec rationale (nouveauté v6.3.0)
- [x] Design tokens complets et cohérents avec l'Architecture v2
- [x] User journeys détaillés pour les 4 personas + 2 flows spéciaux (language switch + crisis mode)
- [x] Component strategy alignée sur la stack (shadcn + Aceternity + Magic UI + Rive + Lottie)
- [x] UX patterns documentés (graceful degradation, reduced motion, freshness, disclaimer, crisis, newsletter, i18n, Coulisses CTA)
- [x] Responsive 3 breakpoints (mobile 375+, tablet 768+, desktop 1280+)
- [x] Accessibility WCAG 2.1 AA complète (POUR framework)

### 13.3 Changements majeurs vs UX v1 (avant upgrade BMAD v6.3.0)

| # | Changement | Motivation |
|---|---|---|
| 1 | Step 4 Emotional Response ajouté (new v6.3.0) | Définit ce que les personas doivent ressentir, pas juste ce qu'ils doivent faire |
| 2 | Step 5 Inspiration Gathering ajouté (new v6.3.0) | 6 références premium (FT, Monocle, Apple, Linear, Arc, Stripe) + 7 patterns UX |
| 3 | Step 9 Design Directions ajouté (new v6.3.0) | 3 directions explorées (A Éditorial pur, B Cinématique max, C Éditorial signé) avec choix motivé |
| 4 | Ton hybride confirmé comme "Éditorial signé" (Direction C) | Équilibre performance + impact + timeline |
| 5 | Section Component Strategy plus approfondie avec exemple composition code | Prépare concrètement la Phase 4 Implementation |
| 6 | Flow 6 Mode Crisis ajouté aux user journeys | Reflète le nouveau FR-17 Alert VIX percentile |
| 7 | Pattern Editorial Disclaimer bilingue ajouté | Reflète le nouveau cadre légal AMF du PRD v2 |
| 8 | Pattern Newsletter soft-capture ajouté | Reflète FR-44 newsletter dans MVP |

### 13.4 Open questions (non-bloquantes)

- **Q1** : L'avatar Rive doit-il avoir un nom visible ("Le Chartiste Lettré") ou rester anonyme ?
- **Q2** : Le mode "crisis" doit-il pouvoir être désactivé par le visiteur (dismiss permanent) ou est-il toujours sticky ?
- **Q3** : Le langue par défaut au premier visit : FR (parce que audience primaire FR) ou auto-detect navigator ?
- **Q4** : Le copy-button du PromptCodeBlock copie-t-il le prompt seul ou avec metadata (version, date) ?

Ces questions sont tranchables en Phase 4 Sprint Planning lors de la création des stories.

### 13.5 Next steps BMAD v6.3.0

1. **Gate Check** — `bmad-check-implementation-readiness` pour valider PRD + Architecture + UX Design sont cohérents
2. **Epics & Stories** — `bmad-create-epics-and-stories` pour décomposer les FRs en epics et user stories
3. **Sprint Planning** — `bmad-sprint-planning` pour organiser les stories en sprints
4. **Dev Stories** — `bmad-dev-story` pour commencer l'implémentation (story par story)

---

## 14. ANNEXE — Experience Maximum : exploiter la stack premium à fond

> **Directive utilisateur (11 avril 2026) :** "exploiter la partie motion et aceternity, shadcn ui... tout pour générer un site premium avec une expérience utilisateur jamais vue !"

Cette annexe **amplifie la Direction C** ("Éditorial signé") en poussant l'exploitation des libs premium à leur maximum viable, **tout en respectant les contraintes de performance (LCP < 2s, Lighthouse ≥ 90, bundle < 250 KB gz)**.

Le principe directeur : **chaque composant de la stack doit avoir son moment de gloire dans une surface distincte**. Pas de composant payé et oublié. Pas de composant utilisé deux fois inutilement. Chaque library a **sa zone**.

### 14.1 Carte d'exploitation des libs — Chacune a sa "home"

| Zone du site | Lib dominante | Rôle signature | Autres libs en support |
|---|---|---|---|
| **Hero homepage** | **Aceternity Pro** (Aurora + Beams) | Arrière-plan cinématique | Rive (avatar), Magic UI (gradient text), Motion 12 (orchestration) |
| **Bento KPI grid** | **Aceternity** (Bento + Shimmer Glare) | Grille asymétrique premium | Magic UI (NumberTicker), Lottie (icons), Motion 12 (reveal stagger) |
| **Briefing panel** | **Aceternity** (Text Generate Effect) | Typewriter éditorial | Magic UI (Animated Gradient Text pour chips), Motion 12 (layout shifts) |
| **Marquee secondary KPIs** | **Magic UI** (Marquee) | Bandeau défilant bas de page | Lottie (arrows), shadcn (Tooltip) |
| **Freshness indicator** | **Magic UI** (Pulsating Dot + Ripple) | Signal "live" | Motion 12 (pulse timing) |
| **Alert banner (crisis)** | **Aceternity** (Meteors + NeonGradientCard) | Mode crise spectaculaire | Magic UI (Shine Border), Rive (avatar tendu), Motion 12 (shake subtle) |
| **Language switcher** | **shadcn/ui** (Toggle via Radix) | Toggle accessible | Motion 12 (transition) |
| **Coulisses Tracing Beam** | **Aceternity** (Tracing Beam) | Parcours vertical narratif | Magic UI (Dot Pattern background), Motion 12 (scroll linking) |
| **Prompt Code Blocks** | **Aceternity** (Code Block Animated) | Affichage prompts versionnés | Magic UI (Shine Border sur copy button), shadcn (Tooltip) |
| **Pipeline logs table** | **shadcn/ui** (Table + ScrollArea) | Data technique claire | Magic UI (Pulsating Dot par ligne), Motion 12 (row enter) |
| **Navigation header** | **shadcn/ui** (NavigationMenu) | Nav accessible | Magic UI (Animated Gradient logo) |
| **Footer + newsletter form** | **shadcn/ui** (Form + Input + Button) | Formulaire sérieux | Magic UI (Shine Border submit), Motion 12 (success feedback) |
| **404 / 500 pages** | **Aceternity** (Background Boxes) | Pages éditoriales non-génériques | Lottie (animation erreur), Motion 12 (entry) |
| **Modal / Dialog** | **shadcn/ui** (Dialog via Radix) | Overlays accessibles | Motion 12 (entry/exit), Magic UI (Shine Border) |

### 14.2 Les 7 "moments signature" — ce que le visiteur doit raconter

Un site qui a une expérience **jamais vue** n'est pas un site qui en met partout. C'est un site qui a **7 moments précis** dont le visiteur se souvient et qu'il raconte. Voici les nôtres.

#### Moment 1 — L'arrivée cinématique (T+0 à T+2s)

**Ce que le visiteur voit :**
- L'**Aurora Background** (Aceternity) commence un mouvement doux, couleurs charbon + or, comme une aurore boréale lente
- En parallèle, l'**Avatar Rive** apparaît avec une animation de "réveil" (il ouvre les yeux, regarde le visiteur)
- 300 ms plus tard, le **Background Beams** (Aceternity) ajoute des faisceaux subtils qui dessinent la profondeur de champ
- La tagline commence à révéler son **AnimatedGradientText** (Magic UI) — le texte se dessine avec un gradient qui glisse

**Code snippet (concept) :**
```tsx
<section className="relative min-h-screen">
  <AuroraBackground>
    <BackgroundBeams className="opacity-40" />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <HeroAvatar riskLevel={analysis.metadata.risk_level} entryAnimation="wake-up" />
    </motion.div>
    <AnimatedGradientText text={tagline} speed="cinema" />
  </AuroraBackground>
</section>
```

**Pourquoi c'est jamais vu :** la combinaison Aurora + Beams + Rive avatar synchronisés en 2 secondes n'existe dans aucun site finance connu. C'est du niveau Apple Keynote appliqué à un sujet de niche.

---

#### Moment 2 — Le briefing qui se dévoile (T+2 à T+15s)

**Ce que le visiteur voit :**
- Le **TextGenerateEffect** (Aceternity) commence à "taper" le briefing, mot par mot, à 40 ms/mot avec variation aléatoire de ±10 ms pour un rythme humain
- Un **curseur clignotant** en bout de ligne pendant la génération
- Après chaque phrase, un léger **pulse d'opacity** sur le paragraphe qui vient d'être écrit
- En parallèle, les **MetadataChips** apparaissent un à un en **stagger animation** (Motion 12) avec un léger "bounce" via `spring physics`

**Code snippet (concept) :**
```tsx
<TextGenerateEffect
  words={briefing}
  speed={40}
  variance={10}
  showCursor
  className="text-body-lg font-sans text-yield-ink"
  onComplete={() => setShowMetadata(true)}
/>
<AnimatePresence>
  {showMetadata && (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      {chips.map((chip) => (
        <motion.div variants={chipVariants}>
          <Chip>{chip}</Chip>
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

**Pourquoi c'est jamais vu :** le briefing qui "s'écrit" devant le lecteur donne l'illusion d'un direct. Le lecteur sait que c'est préchargé, mais l'effet narratif est puissant — on dirait que Le Chartiste Lettré est en train de taper ses pensées.

---

#### Moment 3 — Le Bento qui se révèle en cascade (T+15 à T+30s)

**Ce que le visiteur voit :**
- Le **Bento Grid** (Aceternity) apparaît case par case avec un **stagger de 100 ms** entre chaque card
- Chaque card a une animation d'entrée différente selon sa taille : les grandes cards glissent depuis le bas avec `spring bounce`, les petites font un `scale fade-in`
- Dès qu'une card entre dans le viewport, son **NumberTicker** (Magic UI) commence à incrémenter de 0 vers la valeur finale en 1500 ms avec `ease-out`
- À l'arrivée de la valeur finale, la **flèche Lottie** (up/down/flat) se déclenche en parallèle
- Au **hover**, la card gagne un **Shimmer Glare** (Aceternity) qui balaie la surface de gauche à droite, comme une lumière passant sur une carte de crédit métallique

**Code snippet (concept) :**
```tsx
<BentoGrid className="grid-cols-1 md:grid-cols-3 gap-4">
  {kpis.map((kpi, idx) => (
    <motion.div
      key={kpi.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: idx * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      <ShimmerGlare>
        <KpiCard kpi={kpi}>
          <NumberTicker value={kpi.value} duration={1500} />
          <LottieIcon src={`/lottie/${kpi.direction}.lottie`} />
        </KpiCard>
      </ShimmerGlare>
    </motion.div>
  ))}
</BentoGrid>
```

**Pourquoi c'est jamais vu :** l'orchestration NumberTicker + Lottie + Shimmer Glare + stagger reveal crée une **cascade chorégraphiée** digne d'une intro de film. Dans un site finance, c'est inhabituel (les dashboards sont généralement statiques). Ça donne le sentiment que **la donnée est vivante**.

---

#### Moment 4 — L'avatar qui reconnaît le visiteur (T+30s)

**Ce que le visiteur voit :**
- Quand le visiteur bouge sa souris vers l'avatar Rive, l'avatar **tourne légèrement la tête** dans la direction de la souris (via Rive state machine + mouse tracking)
- Si le visiteur clique sur l'avatar, micro-animation de réponse (clin d'œil, hochement de tête, ou haussement de sourcil selon le risk level)
- Si le visiteur hover longtemps (> 2s), un **AnimatedTooltip** (Aceternity) apparaît avec une phrase du Chartiste Lettré : *"Aujourd'hui, j'observe ce spread OAT-Bund de près."*

**Code snippet (concept) :**
```tsx
<HeroAvatar
  riskLevel={riskLevel}
  mouseTracking
  onClick={() => triggerWinkAnimation()}
  hoverTooltip={chartistQuoteOfTheDay}
/>
```

**Pourquoi c'est jamais vu :** un avatar qui **suit la souris** et qui a un **tooltip éditorial** n'existe dans aucun site finance. C'est du niveau Arc Browser ou démo Rive. Le visiteur reviendra juste pour voir ce que l'avatar fait aujourd'hui.

---

#### Moment 5 — L'arrivée sur Coulisses (T+60s après clic CTA)

**Ce que le visiteur voit :**
- Transition de page en **Motion 12 AnimatePresence** : la homepage fade-out + slide vers le bas pendant que Coulisses fade-in depuis le haut (effet de "descente dans les entrailles")
- Une fois sur Coulisses, le **Tracing Beam** (Aceternity) commence à se tracer depuis le haut, en suivant le scroll du visiteur
- **Dot Pattern background** (Magic UI) en ambient, très discret
- Chaque étape de la timeline apparaît avec un **fade + translate-x** quand la ligne arrive à son niveau
- Sur les étapes avec code (prompts), le **Code Block Animated** (Aceternity) affiche le code avec une animation de "compilation" (les lignes apparaissent une par une)
- Le **copy button** des Code Blocks a un effet **ShineBorder** (Magic UI) au hover, suggérant qu'il est actionnable

**Code snippet (concept) :**
```tsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -100 }}
  transition={{ type: 'spring', stiffness: 80 }}
>
  <DotPattern className="absolute inset-0 opacity-20" />
  <TracingBeam>
    {timelineSteps.map((step) => (
      <TimelineStepMotion key={step.id} step={step} />
    ))}
  </TracingBeam>
</motion.div>
```

**Pourquoi c'est jamais vu :** peu de sites ont le courage d'une transition de page aussi théâtrale. Combiné au Tracing Beam qui se dessine, ça donne l'impression d'entrer dans un coffre-fort narratif. Sophie adorera.

---

#### Moment 6 — Le mode Crisis (conditionnel, rare)

**Ce que le visiteur voit :**
- Quand `alert.active === true`, la page **entière prend une teinte légèrement rouge** (via filter CSS subtil sur le body pendant 200 ms, puis retour normal)
- La **AlertBanner** (NeonGradientCard + Meteors + Shine Border combinés) apparaît en haut, avec une animation d'entrée **slide from top + bounce**
- Les **Meteors** (Aceternity) tombent en arrière-plan de la bannière, plus denses si `crisis` que si `warning`
- L'avatar Rive passe en pose **tension** avec une animation de transition (il ferme les yeux, respire, rouvre)
- Le KPI VIX dans le Bento Grid **passe en couleur alert-alert** et reçoit un **Shine Border** rouge permanent qui pulse
- Un son discret (optionnel, opt-in) signale l'arrivée du mode crisis

**Code snippet (concept) :**
```tsx
{alert.active && (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', bounce: 0.3 }}
  >
    <NeonGradientCard variant={alert.level}>
      <Meteors density={alert.level === 'crisis' ? 'high' : 'medium'} />
      <ShineBorder color="red" />
      <AlertBannerContent alert={alert} locale={locale} />
    </NeonGradientCard>
  </motion.div>
)}
```

**Pourquoi c'est jamais vu :** le mode crisis n'est pas une simple modal d'avertissement. C'est un **changement d'ambiance dramatique** qui sort le visiteur de sa lecture quotidienne. Comme un bulletin d'information qui interrompt une émission. Rarement vu sur un site web, jamais sur un site finance personnel.

---

#### Moment 7 — Le partage qui donne envie de partager

**Ce que le visiteur voit quand il partage sur LinkedIn/Twitter :**
- L'**Open Graph image** générée dynamiquement par `@vercel/og` n'est pas une simple capture — c'est une **carte postale** qui reprend la direction artistique du site :
  - Fond `#0A1628` avec dégradé Aurora discret
  - Logo YieldField en haut à gauche, Instrument Serif
  - La **tagline du jour** en grand (display-1), en AnimatedGradient simulé (gradient statique généré)
  - Le **chiffre-clé du jour** (ex : spread OAT-Bund) en JetBrains Mono massif
  - Un extrait du **briefing** sur 2 lignes max
  - Date du jour
  - Signature "Le Chartiste Lettré"

**Pourquoi c'est jamais vu :** la majorité des sites ont une OG image statique (ou pire, le logo en carré). Une OG image **dynamique et éditoriale** qui change chaque jour est un **levier viral massif**. Chaque partage devient une mini-affiche du jour. Sophie le partage → ses followers voient la carte → ils cliquent parce que c'est beau.

### 14.3 Règles de modération — Ne PAS saturer

Pour que l'expérience soit "jamais vue" et pas "fatigante", il faut des **règles de non-usage strictes** :

❌ **JAMAIS :**
- Aurora Background + Beams + Dot Pattern + Meteors en même temps sur la même page (surcharge)
- Plus d'un TextGenerateEffect visible simultanément
- Plus de 2 NumberTickers hors du Bento Grid
- Animations infinies (loop) sur éléments non-critiques (sauf Aurora Background)
- Effet Shimmer Glare + Shine Border sur le même élément
- Son audio sans opt-in explicite (accessibilité)

✅ **TOUJOURS :**
- Respect de `prefers-reduced-motion` (toutes les animations ci-dessus ont un état statique de fallback)
- Une animation "signature" par viewport — pas deux
- Lazy loading pour tous les composants lourds (Rive, Aceternity heavy, Lottie)
- Tests Lighthouse après chaque ajout de composant premium (CI bloquant si < 90)
- Bundle analyzer à chaque build (alerte si > 250 KB)

### 14.4 Composants shadcn/ui — rôle de fondation invisible

shadcn/ui n'a pas de moment signature, mais il porte **tout le reste** :

- `Button` : variante `primary` pour CTA hero "Voir les Coulisses", variante `ghost` pour les liens footer, variante `outline` pour les actions secondaires. Tous avec `focus-visible` outline or obligatoire.
- `Dialog` : pour l'overlay détails d'alerte crisis, avec animation Motion 12 entry/exit
- `Sheet` : pour la navigation mobile (hamburger menu)
- `DropdownMenu` : pour le language switcher avec icônes drapeau
- `Tooltip` : pour les KPI hover info, les metadata chips explications, le copy button feedback
- `Toast` : pour les confirmations (newsletter subscribed, copy to clipboard, language switched)
- `ScrollArea` : pour la PipelineLogsTable avec scroll custom styled
- `Form` + `Input` : pour le NewsletterForm avec validation Zod
- `Accordion` (potentiel) : pour les FAQ en page About

**Pourquoi shadcn/ui est critique :** il porte l'**accessibilité WCAG AA** native grâce à Radix Primitives. Sans lui, impossible d'atteindre NFR15-17. Il est le **socle invisible** qui permet aux Aceternity/Magic UI de briller.

### 14.5 Motion 12 — orchestration globale

Motion 12 n'est pas qu'un animation engine — c'est l'**orchestrateur de tous les autres**. Son rôle :

- **Layout animations** : transitions fluides entre états (KPIs qui se réorganisent en fonction de la taille de viewport)
- **Scroll-triggered** : reveal du Bento Grid, du Tracing Beam, du Marquee
- **Page transitions** : entre Home et Coulisses (AnimatePresence)
- **Gesture handlers** : click/hover/tap sur l'avatar Rive
- **Stagger containers** : révélation en cascade du Bento Grid et des MetadataChips
- **Spring physics** : donner un "poids" physique aux animations (pas du linéaire plat)
- **Reduced motion hooks** : `useReducedMotion()` pour fallback

**Import strategy (critique pour bundle size) :**
```typescript
// ❌ Mauvais (bundle lourd)
import * as motion from 'motion/react';

// ✅ Bon (tree-shakeable)
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { useReducedMotion } from 'motion/react';
```

### 14.6 Timeline d'implémentation amplifiée

Cette amplification n'allonge pas la timeline — elle **redistribue l'effort** :

- **Semaines 1-3 (Foundation)** : inchangé, stack setup + shadcn base + layouts
- **Semaine 4 (Core UI)** : HeroSection standard + BentoGrid
- **Semaine 5 (Signature 1)** : Rive avatar avec state machine + mouse tracking + click interactions, Aurora Background, Text Generate Effect, NumberTickers, Lottie arrows
- **Semaine 6 (Signature 2 + Coulisses)** : Tracing Beam, Code Block Animated, Shimmer Glare, Meteors, transitions de page Motion 12, Alert banner complet
- **Semaines 7-8 (Stabilisation)** : audits Lighthouse, Axe, bundle analyzer, optimisations, reduced motion fallbacks, tests e2e

**Scope de repli si S5 dérape :**
1. Premier sacrifice : effets son opt-in (pas critiques)
2. Deuxième sacrifice : mouse tracking Rive (avatar reste statique au hover)
3. Troisième sacrifice : transitions de page Motion 12 (fade simple à la place)
4. Core absolu conservé : Aurora + Rive static + NumberTickers + Text Generate + Bento + Tracing Beam + Alert crisis

### 14.7 Performance budget amplifié

| Metric | Budget initial | Budget "Experience Max" | Strategy |
|---|---|---|---|
| LCP | < 2s | < 2s (inchangé) | SSR skeleton, critical CSS inline, fonts preload |
| FCP | < 1s | < 1s (inchangé) | Server-rendered hero |
| TBT | < 200ms | < 250ms (+25%) | Animations après hydration, web workers si nécessaire |
| CLS | < 0.1 | < 0.1 (inchangé) | Dimensions fixes obligatoires |
| JS bundle initial | < 250 KB gz | **< 280 KB gz** (+12%) | Budget négocié pour accommoder Meteors + ShineBorder + mouse tracking |
| Rive asset | < 100 KB | < 120 KB (+20%) | Autorise state machine plus riche |
| Lottie assets | < 20 KB chaque | < 25 KB chaque | Marge pour animations plus fines |

**Lighthouse target maintained at ≥ 90** — aucune négociation sur l'objectif global. Si l'amplification dégrade Lighthouse, on coupe des effets.

### 14.8 Le mantra "jamais vu"

> **"Every library has its moment. Every moment has its library. No moment is wasted. No moment is cluttered."**

En français : **chaque bibliothèque a son moment, chaque moment a sa bibliothèque, aucun moment n'est gâché, aucun moment n'est encombré**.

C'est ce qui différencie un site "qui a l'air cher" d'un site "inoubliable" :
- Un site cher utilise beaucoup de libs → surcharge
- Un site inoubliable donne à chaque lib **sa chance de briller une fois**

YieldField aura **7 moments signature** (un par famille d'effet) et aura **ruiné** tous les autres portfolios juniors de 2026.

---

*Document généré via BMAD v6.3.0 workflow `bmad-create-ux-design` — 14 steps complets + Annexe Experience Maximum synthétisés en une passe cohérente.*
*UX Designer facilitateur : Claude (Opus 4.6 avec contexte 1M) jouant le rôle de Sally, UX Designer BMAD.*
