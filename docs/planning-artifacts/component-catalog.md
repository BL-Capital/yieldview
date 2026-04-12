---
title: "Component Catalog: YieldField — Bibliothèque de templates nommés"
status: "final-draft"
workflowType: "component-catalog"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by Sally, UX Designer)"
parentDocument: "docs/planning-artifacts/ux-design-specification.md"
purpose: "Catalogue nommé et exhaustif des composants Aceternity UI Pro, Magic UI, shadcn/ui, Rive et Lottie recommandés pour YieldField, avec leur URL, leur usage précis et leur priorité d'implémentation."
---

# Component Catalog — YieldField

## Objectif de ce document

Quand le développeur (toi/Claude Code) commencera l'implémentation, il ne doit **jamais hésiter** sur le nom exact du composant à installer. Ce catalogue donne pour chaque surface du site :

- Le **nom exact** du composant (tel qu'il s'appelle dans la bibliothèque officielle)
- Son **URL source** (page de la documentation officielle)
- Sa **priorité** dans le MVP (P0 = critique, P1 = important, P2 = nice-to-have)
- Son **emplacement** dans le projet (`src/components/...`)
- Les **props clés** à configurer
- Une **note éditoriale** sur l'adaptation YieldField

**Règle d'or :** ce catalogue est binding. Si un développeur veut utiliser un composant non listé ici, il faut un amendement explicite de ce document (via issue GitHub).

---

## 1. shadcn/ui — Fondation accessible (P0, critical)

**Source officielle :** https://ui.shadcn.com/docs/components

### 1.1 Composants P0 — MVP obligatoire

| # | Composant | URL | Usage dans YieldField | Props clés | Emplacement |
|---|---|---|---|---|---|
| 1 | **Button** | https://ui.shadcn.com/docs/components/button | CTA "Voir les Coulisses →", subscribe newsletter, fermer modals, retour accueil | `variant="default" \| "outline" \| "ghost" \| "link"`, `size="default" \| "sm" \| "lg"` | `src/components/ui/button.tsx` |
| 2 | **Card** | https://ui.shadcn.com/docs/components/card | Base de `<KpiCard>` (wrapped dans ShimmerGlare Aceternity), cards des étapes Coulisses | `className` pour design tokens | `src/components/ui/card.tsx` |
| 3 | **Dialog** | https://ui.shadcn.com/docs/components/dialog | Overlay "Détails d'alerte VIX" (click sur AlertBanner → detail view) | `open`, `onOpenChange`, Motion 12 integration via asChild | `src/components/ui/dialog.tsx` |
| 4 | **Sheet** | https://ui.shadcn.com/docs/components/sheet | Menu hamburger mobile (< 768px) avec navigation Home/Coulisses/About | `side="right"`, `open`, `onOpenChange` | `src/components/ui/sheet.tsx` |
| 5 | **DropdownMenu** | https://ui.shadcn.com/docs/components/dropdown-menu | Language switcher desktop (FR/EN avec drapeaux) | Utilisé dans `<LanguageSwitcher>` | `src/components/ui/dropdown-menu.tsx` |
| 6 | **Tooltip** | https://ui.shadcn.com/docs/components/tooltip | Détails KPI au hover (source, dernière update, sparkline optionnel), explications metadata chips | `delayDuration={500}` | `src/components/ui/tooltip.tsx` |
| 7 | **Toast** (Sonner) | https://ui.shadcn.com/docs/components/sonner | Feedback "Email copié", "Newsletter subscribed", "Language switched" | Via `<Toaster />` global + `toast.success()` | `src/components/ui/sonner.tsx` |
| 8 | **ScrollArea** | https://ui.shadcn.com/docs/components/scroll-area | Scrollbar custom stylée sur `<PipelineLogsTable>` (Coulisses) | `className` pour max-height | `src/components/ui/scroll-area.tsx` |
| 9 | **Separator** | https://ui.shadcn.com/docs/components/separator | Séparateurs entre sections dans Coulisses, en footer | `orientation="horizontal" \| "vertical"` | `src/components/ui/separator.tsx` |
| 10 | **Badge** | https://ui.shadcn.com/docs/components/badge | Metadata chips (theme, risk level, event) — servira de base surchargée avec Magic UI | `variant` étendu avec finance colors | `src/components/ui/badge.tsx` |
| 11 | **Input** | https://ui.shadcn.com/docs/components/input | Formulaire newsletter (email) dans footer | `type="email"`, `required` | `src/components/ui/input.tsx` |
| 12 | **Label** | https://ui.shadcn.com/docs/components/label | Associé à Input pour accessibilité WCAG | `htmlFor` | `src/components/ui/label.tsx` |
| 13 | **Form** | https://ui.shadcn.com/docs/components/form | Wrapper validation Zod pour NewsletterForm | Avec `react-hook-form` + Zod resolver | `src/components/ui/form.tsx` |

### 1.2 Composants P1 — Nice-to-have V1.1

| # | Composant | URL | Usage potentiel |
|---|---|---|---|
| 14 | **NavigationMenu** | https://ui.shadcn.com/docs/components/navigation-menu | Navigation desktop riche si on ajoute des sous-sections (V2) |
| 15 | **Popover** | https://ui.shadcn.com/docs/components/popover | Mini-chart preview des KPIs au click |
| 16 | **Accordion** | https://ui.shadcn.com/docs/components/accordion | FAQ sur la page About |
| 17 | **Table** | https://ui.shadcn.com/docs/components/table | Alternative à PipelineLogsTable si besoin data-dense |
| 18 | **Switch** | https://ui.shadcn.com/docs/components/switch | Settings panel (V2) pour override reduced-motion, theme variant |
| 19 | **Skeleton** | https://ui.shadcn.com/docs/components/skeleton | Loading states pendant lazy load de Rive/Aceternity |

### 1.3 Commandes d'installation batch

```bash
# P0 — MVP obligatoire
npx shadcn@latest add button card dialog sheet dropdown-menu tooltip sonner scroll-area separator badge input label form

# P1 — V1.1 (si temps disponible)
npx shadcn@latest add navigation-menu popover accordion table switch skeleton
```

---

## 2. Aceternity UI Pro — Composants signature animés (P0-P1)

**Source officielle :** https://ui.aceternity.com/components
**Abonnement :** Bryan a un accès Pro ✅

### 2.1 Composants P0 — Moments signature critiques

| # | Composant | URL | Moment signature | Props clés | Emplacement |
|---|---|---|---|---|---|
| 1 | **Aurora Background** | https://ui.aceternity.com/components/aurora-background | **Moment 1** : Hero homepage, aurore boréale lente en arrière-plan charbon + or | `showRadialGradient`, custom `className` with yield-dark | `src/components/aceternity/aurora-background.tsx` |
| 2 | **Background Beams** | https://ui.aceternity.com/components/background-beams | **Moment 1** : Faisceaux subtils en overlay sur Aurora (opacity 40%) pour profondeur | `className` positionnement absolute | `src/components/aceternity/background-beams.tsx` |
| 3 | **Text Generate Effect** | https://ui.aceternity.com/components/text-generate-effect | **Moment 2** : Briefing du jour qui se "tape" mot par mot | `words`, `className`, `filter={false}` (pas de blur), `duration` | `src/components/aceternity/text-generate-effect.tsx` |
| 4 | **Bento Grid** | https://ui.aceternity.com/components/bento-grid | **Moment 3** : Grille asymétrique des 6-8 KPIs | `<BentoGrid>` + `<BentoGridItem>` children, `icon` slot | `src/components/aceternity/bento-grid.tsx` |
| 5 | **Shimmer Button** (ou équivalent pour cards) | https://ui.aceternity.com/components/shimmer-button | **Moment 3** : Effet de passage lumineux sur CTA hero "Voir les Coulisses" | `shimmerColor`, `shimmerSize`, `borderRadius` | `src/components/aceternity/shimmer-button.tsx` |
| 6 | **Card Glare** (alternative : Glare Card) | https://ui.aceternity.com/components/glare-card | **Moment 3** : Effet hover sur les cards du Bento Grid (lumière qui balaie) | Wrapper HOC autour de `<KpiCard>` | `src/components/aceternity/glare-card.tsx` |
| 7 | **Tracing Beam** | https://ui.aceternity.com/components/tracing-beam | **Moment 5** : Parcours vertical animé de la page Coulisses (suit le scroll) | Wrapper toute la page, sections children | `src/components/aceternity/tracing-beam.tsx` |
| 8 | **Code Block** (Animated) | https://ui.aceternity.com/components/code-block | **Moment 5** : Affichage des prompts versionnés v01→v06 avec diff | `language`, `filename`, `code`, `highlightLines` | `src/components/aceternity/code-block.tsx` |
| 9 | **Meteors** | https://ui.aceternity.com/components/meteors | **Moment 6** : Mode crisis, météores qui tombent en arrière-plan de l'AlertBanner | `number={20}` pour warning, `40` pour alert, `60` pour crisis | `src/components/aceternity/meteors.tsx` |

### 2.2 Composants P1 — Enrichissements visuels

| # | Composant | URL | Usage potentiel |
|---|---|---|---|
| 10 | **Sparkles** | https://ui.aceternity.com/components/sparkles | Particules dorées subtiles autour de la tagline (accent, pas dominant) |
| 11 | **Animated Tooltip** | https://ui.aceternity.com/components/animated-tooltip | Tooltip avec animation sur avatar Rive (citation du Chartiste Lettré) |
| 12 | **Moving Border** | https://ui.aceternity.com/components/moving-border | Bordure animée sur le CTA "Voir les Coulisses" (alternative au Shimmer Button) |
| 13 | **Spotlight** | https://ui.aceternity.com/components/spotlight | Effet spotlight sur la section hero (alternative à Aurora si perf issue) |
| 14 | **3D Card** | https://ui.aceternity.com/components/3d-card | Effet parallax 3D sur les cards KPI au mouvement souris (V2) |
| 15 | **Background Lines** | https://ui.aceternity.com/components/background-lines | Lignes animées en fond des pages 404/500 (éditorial non-générique) |
| 16 | **Infinite Moving Cards** | https://ui.aceternity.com/components/infinite-moving-cards | Marquee alternatif pour KPIs secondaires (alternative à Magic UI Marquee) |
| 17 | **Text Reveal Card** | https://ui.aceternity.com/components/text-reveal-card | Pour les étapes Coulisses avec reveal progressif au scroll |
| 18 | **Hover Border Gradient** | https://ui.aceternity.com/components/hover-border-gradient | Bordure gradient animée sur le newsletter form submit button |
| 19 | **Background Boxes** | https://ui.aceternity.com/components/background-boxes | Fond quadrillé animé pour la page 404 (éditorial) |
| 20 | **World Map** | https://ui.aceternity.com/components/world-map | V2 : visualisation des marchés mondiaux (Asia/EU/US timezones) |

### 2.3 Composants rejetés (pour éviter surcharge)

- ❌ **Wobble Card** — trop joueur, pas le ton éditorial
- ❌ **Animated Modal** — shadcn Dialog suffit avec Motion 12
- ❌ **Floating Dock** — Mac-like, pas adapté au ton magazine
- ❌ **Hero Parallax** — trop lourd, redondant avec Aurora + Beams
- ❌ **Apple Cards Carousel** — pas de contenu à carouser en MVP
- ❌ **Timeline Radix** — conflit avec Tracing Beam
- ❌ **Layout Grid** — Bento Grid remplit ce besoin

### 2.4 Méthode d'installation (copy-paste)

Les composants Aceternity Pro ne sont **pas** des npm packages. Ils se copient-collent :

1. Aller sur https://ui.aceternity.com/components/<component-name>
2. Copier le code du composant
3. Coller dans `src/components/aceternity/<component-name>.tsx`
4. Ajuster imports (tailwind-merge, clsx)
5. Adapter les couleurs au design tokens YieldField (remplacer `bg-black` par `bg-yield-dark`, etc.)

**Note importante :** Aceternity Pro inclut aussi des composants "advanced" (avec 3D, shaders) que Bryan a payé. Si tu veux l'exploiter au maximum, explore https://ui.aceternity.com/pro pour les composants Pro exclusifs (signalés par un badge "Pro"). Bryan a l'accès, profite-en.

---

## 3. Magic UI — Composants complémentaires open-source (P0-P1)

**Source officielle :** https://magicui.design/docs/components
**Licence :** MIT, gratuit

### 3.1 Composants P0 — Indispensables

| # | Composant | URL | Usage dans YieldField | Props clés | Emplacement |
|---|---|---|---|---|---|
| 1 | **Number Ticker** | https://magicui.design/docs/components/number-ticker | **Moment 3** : Chiffres KPI qui s'incrémentent de 0 vers valeur cible | `value`, `direction="up"`, `delay`, `decimalPlaces` | `src/components/magic-ui/number-ticker.tsx` |
| 2 | **Animated Gradient Text** | https://magicui.design/docs/components/animated-gradient-text | **Moment 1** : Tagline du jour avec gradient or animé | `speed`, custom gradient colors yield-gold → yield-gold-light | `src/components/magic-ui/animated-gradient-text.tsx` |
| 3 | **Marquee** | https://magicui.design/docs/components/marquee | **Moment 1** : Bandeau défilant des KPIs secondaires en bas de hero | `reverse`, `pauseOnHover`, `vertical` | `src/components/magic-ui/marquee.tsx` |
| 4 | **Neon Gradient Card** | https://magicui.design/docs/components/neon-gradient-card | **Moment 6** : Base de l'AlertBanner en mode crisis (couleur variable selon niveau) | `borderSize`, `borderRadius`, neon colors | `src/components/magic-ui/neon-gradient-card.tsx` |
| 5 | **Shine Border** | https://magicui.design/docs/components/shine-border | **Moment 6** : Bordure lumineuse sur AlertBanner crisis + copy button Code Block | `borderRadius`, `borderWidth`, `color`, `duration` | `src/components/magic-ui/shine-border.tsx` |
| 6 | **Ripple** (ou Pulsating Dot) | https://magicui.design/docs/components/ripple | Indicateur "Live" pulsant avec timestamp de dernière update | `mainCircleSize`, `mainCircleOpacity`, `numCircles` | `src/components/magic-ui/ripple.tsx` |
| 7 | **Dot Pattern** | https://magicui.design/docs/components/dot-pattern | **Moment 5** : Background discret de la page Coulisses (ambient, opacity 20%) | `width`, `height`, `cx`, `cy`, `cr` | `src/components/magic-ui/dot-pattern.tsx` |
| 8 | **Grid Pattern** | https://magicui.design/docs/components/grid-pattern | Alternative à Dot Pattern pour certaines sections | Même API | `src/components/magic-ui/grid-pattern.tsx` |

### 3.2 Composants P1 — Enrichissements

| # | Composant | URL | Usage potentiel |
|---|---|---|---|
| 9 | **Animated Beam** | https://magicui.design/docs/components/animated-beam | Connexions animées dans le diagramme pipeline (Coulisses) |
| 10 | **Border Beam** | https://magicui.design/docs/components/border-beam | Bordure qui fait le tour d'une card (alternative à Shine Border) |
| 11 | **Shimmer Button** | https://magicui.design/docs/components/shimmer-button | Alternative au Shimmer Button d'Aceternity pour CTAs |
| 12 | **Animated List** | https://magicui.design/docs/components/animated-list | Liste des logs pipeline avec apparition progressive |
| 13 | **Word Rotate** | https://magicui.design/docs/components/word-rotate | Rotation de mots dans la tagline (V2 : "daily • curated • bilingual") |
| 14 | **Flip Text** | https://magicui.design/docs/components/flip-text | Effet flip sur les chiffres quand la valeur change J+1 |
| 15 | **Typing Animation** | https://magicui.design/docs/components/typing-animation | Alternative au Text Generate Effect d'Aceternity (choisir un des deux) |
| 16 | **Avatar Circles** | https://magicui.design/docs/components/avatar-circles | V2 : liste des abonnés newsletter en footer (preuve sociale) |
| 17 | **Orbiting Circles** | https://magicui.design/docs/components/orbiting-circles | V2 : visualisation orbitale des sources de données (FRED, Finnhub, Claude) autour d'un centre YieldField |
| 18 | **Hyper Text** | https://magicui.design/docs/components/hyper-text | V2 : effet "Matrix" sur certains titres techniques (Coulisses) |
| 19 | **Sparkles Text** | https://magicui.design/docs/components/sparkles-text | Effet scintillant sur le titre "COULISSES" de la page |
| 20 | **Bento Grid** (Magic UI version) | https://magicui.design/docs/components/bento-grid | Alternative à Aceternity Bento (choisir un des deux selon préférence visuelle) |

### 3.3 Composants rejetés

- ❌ **Meteors** (Magic UI) — Aceternity Meteors est plus abouti
- ❌ **Globe** — trop gros pour le MVP, reporté V2 avec React Three Fiber
- ❌ **Cool Mode** — gadget, hors ton
- ❌ **Confetti** — pas adapté au ton sobre d'un magazine finance

### 3.4 Méthode d'installation

Magic UI propose la **CLI** pour copier-coller automatique :

```bash
# P0 — MVP obligatoire
npx magic-ui@latest add number-ticker animated-gradient-text marquee neon-gradient-card shine-border ripple dot-pattern grid-pattern

# P1 — V1.1
npx magic-ui@latest add animated-beam border-beam shimmer-button animated-list word-rotate flip-text sparkles-text
```

---

## 4. Rive — Avatar hero interactif (P0)

**Source officielle :** https://rive.app/community et https://rive.app/docs

### 4.1 Ressource à créer (1 fichier unique)

| # | Asset | Format | Taille cible | Rôle |
|---|---|---|---|---|
| 1 | **avatar.riv** | Fichier Rive binaire | < 120 KB | Avatar hero unique réactif au niveau de risque |

### 4.2 Spécifications du fichier avatar.riv

**State Machine inputs :**
- `riskLevel` (number 0-3) : 0=low, 1=medium, 2=high, 3=crisis
- `themeOfDay` (string) : enum (optional, pour variations secondaires)
- `mouseX` (number 0-1) : pour tracking souris gauche/droite
- `mouseY` (number 0-1) : pour tracking souris haut/bas
- `clicked` (trigger) : pour micro-animation au clic

**States principaux :**
- `idle_low` : pose détendue, lecture journal, sourire léger
- `idle_medium` : concentré devant écran, expression sérieuse
- `idle_high` : tension, gestes animés, sourcils froncés
- `idle_crisis` : expression tendue, respiration visible, lunettes qui glissent
- `wake_up` : animation d'entrée (ouverture des yeux)
- `wink` : clin d'œil au clic
- `look_around` : suivi souris

**Contrainte file size :** < 120 KB (P0 budget). Utiliser compression Rive, optimiser les meshes, limiter les bones.

### 4.3 Ressources de création

**Option A — Rive Community (gratuit) :**
- Parcourir https://rive.app/community pour récupérer un avatar libre de droits adapté
- Exemples de personnages : chercher "character", "avatar", "reading"
- Modifier les couleurs et ajuster le state machine à nos besoins

**Option B — Rive Editor (création custom) :**
- Utiliser l'éditeur visuel Rive (https://editor.rive.app/)
- Bryan peut créer l'avatar sans code
- Environ 1-2 jours de travail pour un résultat propre
- Inspiration : avatars des démos officielles Rive (très cinematic)

**Option C — Fallback SVG statique :**
- Illustration SVG statique avec variantes (low/medium/high/crisis)
- Créé via Figma / Illustrator
- Utilisé en fallback si Rive ne charge pas ou si `prefers-reduced-motion`

**Priorité :** démarrer avec Option C (SVG statique) pour débloquer le dev, puis basculer sur Option A/B progressivement.

### 4.4 Package npm

```bash
npm install @rive-app/react-canvas
```

Emplacement wrapper : `src/components/rive/HeroAvatar.tsx`

---

## 5. Lottie / dotLottie — Micro-animations (P0-P1)

**Source officielle :** https://lottiefiles.com et https://dotlottie.io

### 5.1 Assets P0 — MVP obligatoire

| # | Asset | Format | Usage dans YieldField | Source recommandée | Taille cible |
|---|---|---|---|---|---|
| 1 | **arrow-up.lottie** | dotLottie compressé | Icône "hausse" dans KPI Card | https://lottiefiles.com/animations/arrow-up (libre de droits) | < 15 KB |
| 2 | **arrow-down.lottie** | dotLottie compressé | Icône "baisse" dans KPI Card | https://lottiefiles.com/animations/arrow-down | < 15 KB |
| 3 | **arrow-flat.lottie** | dotLottie compressé | Icône "stable" dans KPI Card | https://lottiefiles.com/animations/minus-horizontal | < 15 KB |
| 4 | **loading-spinner.lottie** | dotLottie compressé | Loader pendant fetch de `latest.json` (rarement visible grâce à SSR) | https://lottiefiles.com/animations/loading | < 20 KB |
| 5 | **email-sent.lottie** | dotLottie compressé | Feedback après subscribe newsletter | https://lottiefiles.com/animations/email-success | < 20 KB |

### 5.2 Assets P1 — Nice-to-have

| # | Asset | Usage |
|---|---|---|
| 6 | **error-404.lottie** | Animation sur page 404 éditoriale |
| 7 | **error-500.lottie** | Animation sur page 500 éditoriale |
| 8 | **copy-success.lottie** | Feedback visuel après "Copy" d'un prompt dans Coulisses |
| 9 | **chart-up.lottie** | Animation sur le titre "COULISSES" — un mini graph qui se dessine |
| 10 | **bell-alert.lottie** | Icône du AlertBanner crisis (optionnel, peut être statique Lucide) |

### 5.3 Méthode d'acquisition

**Gratuit sur LottieFiles :**
1. Créer un compte LottieFiles (gratuit)
2. Chercher les animations par mots-clés (arrow, loading, email, etc.)
3. Filtrer par "Free" et "License: Free to use"
4. Télécharger en format **dotLottie** (40-60 % plus léger que JSON classique)
5. Placer dans `public/lottie/<name>.lottie`

**Alternative : génération avec IA :**
- LottieFiles propose un outil de génération par IA (en beta)
- Permet de customiser les couleurs pour matcher la palette YieldField

### 5.4 Package npm

```bash
npm install @dotlottie/react-player
```

Emplacement wrapper : `src/components/lottie/LottieIcon.tsx`

```typescript
// src/components/lottie/LottieIcon.tsx
import { DotLottiePlayer } from '@dotlottie/react-player';

export function LottieIcon({ src, autoplay = true, loop = false, className }: Props) {
  return (
    <DotLottiePlayer
      src={src}
      autoplay={autoplay}
      loop={loop}
      className={className}
    />
  );
}
```

---

## 6. Motion 12 — Orchestration d'animations (P0)

**Source officielle :** https://motion.dev/docs

### 6.1 APIs clés à maîtriser (P0)

| # | API | URL | Usage YieldField |
|---|---|---|---|
| 1 | **motion** component | https://motion.dev/docs/react-motion-component | Toute animation déclarative (`<motion.div>`, `<motion.section>`) |
| 2 | **AnimatePresence** | https://motion.dev/docs/react-animate-presence | Transitions de page Home ↔ Coulisses, entry/exit AlertBanner |
| 3 | **useReducedMotion** | https://motion.dev/docs/react-use-reduced-motion | Respect `prefers-reduced-motion` sur toutes animations |
| 4 | **Variants** | https://motion.dev/docs/react-variants | Stagger animation du Bento Grid et des MetadataChips |
| 5 | **Layout animations** | https://motion.dev/docs/react-layout-animations | Transitions fluides quand KPIs se réorganisent (resize, language switch) |
| 6 | **Scroll-triggered** (`whileInView`) | https://motion.dev/docs/react-scroll-animations | Reveal du Bento Grid et des sections au scroll |

### 6.2 Motion+ exclusives (Bryan a l'accès)

Motion+ inclut des composants prêts à l'emploi à vérifier sur https://motion.dev/plus :

- **Spring physics presets** avancés (plus réalistes que les basics)
- **Scroll-linked animations** Studio-grade
- **Gesture handlers** complexes (drag, pinch, rotate)
- **Timeline sequencing** pour orchestrer plusieurs animations

**Action recommandée :** explorer les templates Motion+ (dashboard, hero, onboarding) pour voir s'il y a des prêts-à-l'emploi qui accélèrent le dev.

### 6.3 Package npm

```bash
npm install motion
```

### 6.4 Pattern d'import critique pour bundle size

```typescript
// ❌ Mauvais (bundle lourd)
import * as Motion from 'motion/react';

// ✅ Bon (tree-shakeable)
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
```

---

## 7. Résumé — Catalogue complet par zone du site

### 7.1 Hero Homepage

**Composants utilisés :**
- `<AuroraBackground>` (Aceternity) — fond
- `<BackgroundBeams>` (Aceternity) — overlay subtil
- `<HeroAvatar>` custom avec **Rive avatar.riv** — signature
- `<AnimatedGradientText>` (Magic UI) — tagline
- `<TextGenerateEffect>` (Aceternity) — briefing
- `<Badge>` (shadcn) — metadata chips (base)
- `<Ripple>` (Magic UI) — freshness indicator
- `<BentoGrid>` + `<BentoGridItem>` (Aceternity) — KPI layout
- `<GlareCard>` (Aceternity) — hover sur KpiCard
- `<NumberTicker>` (Magic UI) — valeurs KPI
- `<LottieIcon>` (custom wrapper) — arrows up/down/flat
- `<Marquee>` (Magic UI) — KPIs secondaires
- `<ShimmerButton>` (Aceternity) — CTA "Voir les Coulisses →"
- `motion` + `AnimatePresence` — orchestration entry animations

### 7.2 Page Coulisses

**Composants utilisés :**
- `<DotPattern>` (Magic UI) — background ambient
- `<TracingBeam>` (Aceternity) — parcours vertical
- `<CodeBlock>` (Aceternity) — affichage prompts
- `<ShineBorder>` (Magic UI) — copy button des Code Blocks
- `<ScrollArea>` (shadcn) — PipelineLogsTable scroll
- `<Card>` (shadcn) — base des étapes timeline
- `<Ripple>` (Magic UI) — status dots dans logs table
- `<Tooltip>` (shadcn) — hover info sur logs
- `motion` — scroll-triggered reveal des étapes

### 7.3 Alert Banner (mode crisis)

**Composants utilisés :**
- `<NeonGradientCard>` (Magic UI) — base bannière
- `<Meteors>` (Aceternity) — pluie de météores
- `<ShineBorder>` (Magic UI) — bordure lumineuse rouge
- `<Button>` (shadcn) — "View details" + "Dismiss"
- `<Dialog>` (shadcn) — overlay détails
- `motion` — entry spring + exit fade

### 7.4 Newsletter Footer

**Composants utilisés :**
- `<Form>` + `<Input>` + `<Label>` + `<Button>` (shadcn) — formulaire
- `<HoverBorderGradient>` (Aceternity) — bouton submit animé
- `<Toast>` / Sonner (shadcn) — feedback "Subscribed!"
- `<LottieIcon>` avec `email-sent.lottie` — animation post-subscribe

### 7.5 Language Switcher

**Composants utilisés :**
- `<DropdownMenu>` (shadcn) — menu (desktop)
- `<Sheet>` (shadcn) — alternative mobile
- `motion` — fade transition entre locales

### 7.6 404 / 500 pages

**Composants utilisés :**
- `<BackgroundBoxes>` (Aceternity) — fond quadrillé animé
- `<LottieIcon>` avec `error-404.lottie` / `error-500.lottie`
- `<Button>` (shadcn) — "Retour accueil"
- Typo **Instrument Serif** display-1 pour "404"

---

## 8. Liste finale d'installation (commandes batch)

```bash
# 1. shadcn/ui — P0
npx shadcn@latest add button card dialog sheet dropdown-menu tooltip sonner scroll-area separator badge input label form

# 2. Magic UI — P0
npx magic-ui@latest add number-ticker animated-gradient-text marquee neon-gradient-card shine-border ripple dot-pattern grid-pattern

# 3. Aceternity Pro — copy-paste manuel
# Copier depuis https://ui.aceternity.com/components :
# - aurora-background
# - background-beams
# - text-generate-effect
# - bento-grid
# - shimmer-button (ou moving-border en alternative)
# - glare-card
# - tracing-beam
# - code-block
# - meteors

# 4. npm packages
npm install motion
npm install @rive-app/react-canvas
npm install @dotlottie/react-player
npm install @anthropic-ai/sdk
npm install @aws-sdk/client-s3
npm install zod
npm install next-intl
npm install zustand
npm install lucide-react

# 5. Rive asset
# Créer/télécharger avatar.riv dans public/rive/
# Option A : LottieFiles Community
# Option B : Éditeur Rive (https://editor.rive.app/)
# Option C : Fallback SVG statique d'abord

# 6. Lottie assets
# Télécharger depuis https://lottiefiles.com (gratuit) :
# - arrow-up.lottie, arrow-down.lottie, arrow-flat.lottie
# - loading-spinner.lottie, email-sent.lottie
# Placer dans public/lottie/
```

---

## 9. Check list d'accès à vérifier

Avant de démarrer le dev, valider :

- [x] **shadcn/ui** — gratuit, rien à vérifier ✅
- [x] **Magic UI** — gratuit open-source, rien à vérifier ✅
- [ ] **Aceternity UI Pro** — Bryan a confirmé qu'il a l'accès (URL: https://ui.aceternity.com/pro)
- [ ] **Motion+** — Bryan a confirmé qu'il a l'accès (URL: https://motion.dev/plus)
- [ ] **Rive Pro** — vérifier si Bryan a un compte payant (pour features avancées) ou si Community suffit (URL: https://rive.app/pricing)
- [ ] **LottieFiles Pro** — gratuit pour les usages non-commerciaux, vérifier si un abonnement est nécessaire pour certaines animations

---

## 10. Ce catalogue n'est PAS figé

Si pendant l'implémentation tu trouves un meilleur composant (Aceternity ou Magic UI sortent souvent de nouveaux composants), tu peux **l'ajouter à ce catalogue via un commit explicite** avec :
- Nom du composant
- URL source
- Justification pourquoi il remplace/complète un existant
- Impact sur le bundle size

**Règle :** tout nouveau composant doit passer le bundle check Lighthouse CI et être approuvé par Emmanuel.

---

*Document généré pour accompagner le UX Design Specification v2 et servir de bible d'implémentation pendant les sprints de développement.*
*Maintenu par : Emmanuel (lead dev) + Claude Code (implémentation).*
