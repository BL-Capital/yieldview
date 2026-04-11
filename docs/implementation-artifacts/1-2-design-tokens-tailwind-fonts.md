# Story 1.2 : Design tokens Tailwind 4 + Typography self-hosted

Status: ready-for-dev
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 3
Priority: P0
Created: 2026-04-11
Author: Scrum Master (BMAD v6.3.0 `bmad-create-story`)

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** les design tokens YieldField (couleurs, typographie, spacings, shadows, screens, transitions) opérationnels dans `src/app/globals.css` via le pattern Tailwind 4 `@theme` + les 3 typographies self-hosted (Instrument Serif, Inter, JetBrains Mono) chargées via `next/font/local`,
**so that** toutes les stories UI suivantes (1.3 shadcn, 1.5 Layout, Epic 3 Core UI, Epic 4 Coulisses, Epic 5 Alerts) utilisent directement `bg-yield-dark`, `text-yield-gold`, `font-serif`, `text-display-1`, etc. sans aucune couleur ou taille hardcodée.

**Business value :** Story bloquante pour tout le visuel. Sans design tokens opérationnels, impossible de respecter la charte YieldField (yield-dark #0A1628, yield-gold #C9A84C, Instrument Serif éditoriale, chiffres JetBrains Mono) qui est l'essence du positionnement "finance × IA éditoriale premium". Les contrastes WCAG AA/AAA sont verrouillés dès cette story (cf. UX spec section 5.2).

---

## Acceptance Criteria

**AC1 — `src/app/globals.css` enrichi avec `@theme` YieldField (pattern Tailwind 4)**

> ⚠️ **Pas de `tailwind.config.ts`.** Tailwind 4 utilise exclusivement le pattern `@theme` CSS inline. Cf. architecture.md v2.1 section 2.3 et Story 1.1 Dev Notes.

- [ ] Bloc `@theme inline { ... }` (ou `@theme { ... }` si pas de CSS vars globales requises) dans `globals.css` **remplace** le bloc placeholder actuel (`--background`, `--foreground`, font Geist)
- [ ] **Couleurs** : toutes les brand colors YieldField définies comme CSS variables dans `@theme` :
  - `--color-yield-dark: #0A1628`
  - `--color-yield-dark-elevated: #0F1E38`
  - `--color-yield-dark-border: #1E3A5F`
  - `--color-yield-gold: #C9A84C`
  - `--color-yield-gold-light: #E5C67F`
  - `--color-yield-gold-dim: #9A7E3A`
  - `--color-yield-ink: #F4F4F5`
  - `--color-yield-ink-muted: #94A3B8`
  - `--color-yield-ink-dim: #64748B`
  - `--color-bull: #22C55E`
  - `--color-bull-dim: #15803D`
  - `--color-bear: #EF4444`
  - `--color-bear-dim: #B91C1C`
  - `--color-neutral: #94A3B8`
  - `--color-alert-warning: #F59E0B`
  - `--color-alert-alert: #DC2626`
  - `--color-alert-crisis: #991B1B`
- [ ] **Classes Tailwind générées automatiquement** : `bg-yield-dark`, `text-yield-gold`, `border-yield-dark-border`, `bg-alert-crisis`, `text-bull`, etc. utilisables dans n'importe quel composant
- [ ] **Typographie families** :
  - `--font-serif: var(--font-instrument-serif), Georgia, serif`
  - `--font-sans: var(--font-inter), system-ui, sans-serif`
  - `--font-mono: var(--font-jetbrains-mono), Menlo, monospace`
- [ ] **Font sizes custom** (syntaxe Tailwind 4 : `--text-{name}` + `--text-{name}--line-height` + `--text-{name}--letter-spacing`) :
  - Display (Instrument Serif) : `display-1` (clamp 3rem → 5.5rem, lh 1.1, ls -0.02em), `display-2` (clamp 2.5rem → 4rem, lh 1.15, ls -0.01em), `display-3` (clamp 2rem → 3rem, lh 1.2)
  - Headings (Inter) : `heading-1` (2rem, lh 1.3), `heading-2` (1.5rem, lh 1.4)
  - Body (Inter) : `body-lg` (1.25rem, lh 1.6), `body` (1rem, lh 1.7), `body-sm` (0.875rem, lh 1.5), `caption` (0.75rem, lh 1.4, ls 0.05em)
  - Numbers (JetBrains Mono) : `number-xl` (clamp 2rem → 3rem, lh 1), `number-lg` (1.75rem, lh 1), `number-md` (1.25rem, lh 1)
- [ ] **Spacings custom** : `--spacing-0_5: 2px`, et l'échelle 1-4-6-8-12-16-24-32 (4/8/12/16/24/32/48/64/96/128 px)
- [ ] **Max-widths** : `--container-content: 720px`, `--container-wide: 1200px`, `--container-full-wide: 1440px` (→ classes `max-w-content`, `max-w-wide`, `max-w-full-wide`)
- [ ] **Shadows** : `--shadow-elevation-1`, `--shadow-elevation-2`, `--shadow-elevation-3`, `--shadow-gold-glow`, `--shadow-alert-glow`
- [ ] **Breakpoints** : `--breakpoint-xs: 375px` (ajoute un breakpoint custom en plus des défauts sm/md/lg/xl/2xl de Tailwind 4)
- [ ] **Durations & easings** : `--transition-duration-instant: 100ms` ... `--transition-duration-cinema: 1200ms` + `--ease-editorial`, `--ease-cinema`, `--ease-bounce-subtle`

**AC2 — Fonts self-hosted via `next/font/local`**

- [ ] Dossier `src/app/fonts/` créé (co-localisé avec `layout.tsx` — convention Next.js 13+ App Router, pas `public/fonts/` qui empêche l'optimisation Next.js)
- [ ] **Instrument Serif** (Regular 400 + Italic 400 suffisants pour MVP) téléchargée depuis Google Fonts ou github google/fonts, fichiers `InstrumentSerif-Regular.woff2` et `InstrumentSerif-Italic.woff2` dans `src/app/fonts/`
- [ ] **Inter Variable** (une seule variable font couvre tous les poids) téléchargée depuis https://rsms.me/inter/ ou github rsms/inter, fichier `InterVariable.woff2` (≈ 310 KB) dans `src/app/fonts/`
- [ ] **JetBrains Mono Variable** (variable font unique) téléchargée depuis https://github.com/JetBrains/JetBrainsMono/releases, fichier `JetBrainsMono-Variable.woff2` dans `src/app/fonts/`
- [ ] `src/app/layout.tsx` refactorisé :
  - Supprimer les imports `Geist, Geist_Mono` depuis `next/font/google`
  - Importer `localFont from 'next/font/local'`
  - Déclarer 3 `localFont()` → `instrumentSerif`, `inter`, `jetbrainsMono` avec `variable: '--font-instrument-serif'` (etc.), `display: 'swap'`, et pour les variables fonts : `weight: '100 900'` et `style: 'normal'` (Inter et JetBrains Mono), pour Instrument Serif : deux `src` (regular + italic)
  - Appliquer les 3 variables au `<body>` : `className={\`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased\`}`
  - Retirer les vieilles variables CSS `--font-geist-sans` / `--font-geist-mono` côté globals.css

**AC3 — Classes utilitaires opérationnelles (smoke test)**

- [ ] Modifier temporairement `src/app/page.tsx` pour un smoke test visuel (sera réécrit en Story 3.13) :
  - `<body class="bg-yield-dark text-yield-ink">` (via layout)
  - `<h1 class="font-serif text-display-1 text-yield-gold">YieldField</h1>`
  - `<p class="font-sans text-body-lg text-yield-ink">Sous-titre body test</p>`
  - `<span class="font-mono text-number-xl text-bull">+2,47%</span>`
- [ ] `pnpm run dev` → `http://localhost:3000` affiche :
  - Fond bleu nuit (#0A1628)
  - Titre en Instrument Serif grand, doré (#C9A84C)
  - Texte body en Inter
  - Chiffre en JetBrains Mono vert bull (#22C55E)
- [ ] Devtools : inspection confirme les font-family actives et absence de FOUT (flash of unstyled text) grâce à `display: 'swap'`
- [ ] `pnpm run build` compile sans warnings liés aux fonts (taille bundle fonts < 400 KB total)

**AC4 — Cleanup héritage Story 1.1**

Purge des résidus template create-next-app (finding defer Story 1.1 review — globals.css Arial body) :

- [ ] Bloc `body { font-family: Arial, Helvetica, sans-serif; }` **supprimé** de `globals.css` (remplacé par héritage Tailwind via `@theme`)
- [ ] Variables `--background: #ffffff` et `--foreground: #171717` **supprimées** ou remplacées par `--color-yield-dark` / `--color-yield-ink` selon besoin
- [ ] Bloc `@media (prefers-color-scheme: dark)` supprimé (YieldField est **dark-first always**, pas de light mode, cf. UX spec)
- [ ] Fichier `globals.css` final : uniquement `@import "tailwindcss";` + `@theme { ... }` (pas d'autres règles CSS au-delà d'un éventuel reset minimal)

**AC5 — Quality gates**

- [ ] `pnpm run lint` passe sans erreur
- [ ] `pnpm run typecheck` passe sans erreur
- [ ] `pnpm run build` passe sans erreur, bundle First Load JS reste sous les 150 KB (vs 108 KB de base Story 1.1, budget absolu 280 KB de l'architecture)
- [ ] Contrastes WCAG validés manuellement sur le smoke test `page.tsx` (Devtools → Lighthouse Accessibility ≥ 95 attendu)

**AC6 — Git workflow**

- [ ] Tous les nouveaux fichiers (fonts + globals.css modifié + layout.tsx modifié + page.tsx smoke test) committés sur la branche `emmanuel`
- [ ] Commit message : `feat(story-1.2): add YieldField design tokens (@theme) + self-hosted fonts`
- [ ] Les fichiers `.woff2` sont committés (pas dans .gitignore) — ils font partie du code source, ~500 KB total
- [ ] `git status` clean après commit

---

## Tasks / Subtasks

- [ ] **Task 1** — Télécharger et placer les 3 familles de fonts (AC2)
  - [ ] Créer `src/app/fonts/` (mkdir)
  - [ ] Télécharger Instrument Serif Regular + Italic WOFF2 depuis Google Fonts (https://fonts.google.com/specimen/Instrument+Serif)
  - [ ] Télécharger Inter Variable WOFF2 depuis https://rsms.me/inter/font-files/InterVariable.woff2
  - [ ] Télécharger JetBrains Mono Variable WOFF2 depuis https://github.com/JetBrains/JetBrainsMono/releases (dernier release, `JetBrainsMono-Variable.ttf` → convertir en WOFF2 ou utiliser woff2 déjà fourni si dispo)
  - [ ] Vérifier les 3-4 fichiers `.woff2` présents dans `src/app/fonts/`, taille totale < 600 KB
  - [ ] Vérifier que les licences (SIL Open Font License) sont compatibles avec un site commercial (oui pour les 3)

- [ ] **Task 2** — Refactoriser `src/app/layout.tsx` (AC2)
  - [ ] Retirer `import { Geist, Geist_Mono } from "next/font/google"` et les appels `Geist({...})` / `Geist_Mono({...})`
  - [ ] Ajouter `import localFont from 'next/font/local'`
  - [ ] Déclarer `const instrumentSerif = localFont({ src: [{path: './fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal'}, {path: './fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic'}], variable: '--font-instrument-serif', display: 'swap' })`
  - [ ] Déclarer `const inter = localFont({ src: './fonts/InterVariable.woff2', variable: '--font-inter', display: 'swap', weight: '100 900' })`
  - [ ] Déclarer `const jetbrainsMono = localFont({ src: './fonts/JetBrainsMono-Variable.woff2', variable: '--font-jetbrains-mono', display: 'swap', weight: '100 900' })`
  - [ ] Mettre à jour `<body className={\`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-yield-dark text-yield-ink\`}>`
  - [ ] Mettre à jour `<html lang="fr">` (le site est français — cf. finding deferred Story 1.1. Story 1.4 rendra `lang` dynamique via next-intl mais pour Story 1.2 on hardcode `fr`)
  - [ ] Mettre à jour `metadata` : `title: "YieldField"`, `description: "Finance de marché éclairée par l'IA — un briefing quotidien tenu par un chartiste virtuel."` (cf. finding deferred Story 1.1)

- [ ] **Task 3** — Réécrire `src/app/globals.css` en pattern Tailwind 4 `@theme` (AC1 + AC4)
  - [ ] Supprimer tout le contenu actuel sauf `@import "tailwindcss";` en tête
  - [ ] Ajouter un bloc `@theme { ... }` contenant tous les tokens listés en AC1 (couleurs, fonts families, font sizes, spacings, max-widths, shadows, breakpoints, transitions)
  - [ ] **Attention syntaxe Tailwind 4** : les propriétés de `fontSize` sont exprimées via variables séparées :
    ```css
    --text-display-1: clamp(3rem, 6vw, 5.5rem);
    --text-display-1--line-height: 1.1;
    --text-display-1--letter-spacing: -0.02em;
    ```
  - [ ] Ajouter `font-variant-numeric: tabular-nums;` dans une règle CSS standard ciblant `.font-mono` ou `.tabular-nums` (Tailwind 4 n'a pas de métadonnée `fontVariantNumeric` native dans `@theme`, il faut le gérer via règle CSS après le `@theme`)
  - [ ] Smoke check : `pnpm run build` → aucune erreur de parsing CSS

- [ ] **Task 4** — Smoke test visuel via `src/app/page.tsx` (AC3)
  - [ ] Réécrire le contenu du `Home` avec le snippet minimal (fond yield-dark, titre display-1 gold Instrument Serif, body Inter, chiffre number-xl bull JetBrains Mono)
  - [ ] `pnpm run dev` → visiter `http://localhost:3000`
  - [ ] Vérifier visuellement : les 3 polices s'affichent correctement, les couleurs sont exactes (Devtools color picker : `#0A1628` background, `#C9A84C` titre, etc.)
  - [ ] Vérifier via Devtools → Network : les 3-4 fichiers `.woff2` chargés avec status 200, content-type `font/woff2`
  - [ ] Vérifier Devtools → Elements : `<html lang="fr">`, les CSS variables `--font-instrument-serif`, `--font-inter`, `--font-jetbrains-mono` sont présentes au niveau `<body>`

- [ ] **Task 5** — Quality gates complets (AC5)
  - [ ] `pnpm run lint` → 0 erreurs
  - [ ] `pnpm run typecheck` → 0 erreurs
  - [ ] `pnpm run build` → compile proprement, noter le First Load JS (attendu ~115-130 KB avec les fonts embarquées dans le bundle)
  - [ ] Lighthouse Accessibility sur `localhost:3000` ≥ 95 (cible 100 idéalement)
  - [ ] Vérifier qu'aucun `console.warn` ou `console.error` n'apparaît dans le navigateur

- [ ] **Task 6** — Git commit (AC6)
  - [ ] `git add src/app/fonts/ src/app/globals.css src/app/layout.tsx src/app/page.tsx`
  - [ ] `git commit -m "feat(story-1.2): add YieldField design tokens (@theme) + self-hosted fonts"` avec description détaillant les 3 polices ajoutées, le bloc @theme, et la purge du placeholder Arial/Geist
  - [ ] Ne pas push (attente validation Emmanuel)

- [ ] **Task 7** — Mettre à jour le story file (auto-report dev agent)
  - [ ] Cocher toutes les tasks et ACs
  - [ ] Remplir la section Dev Agent Record (agent model, debug log, completion notes, file list, change log)
  - [ ] Status : `ready-for-dev` → `in-progress` au début → `review` en fin

---

## Dev Notes

### Architecture constraints (from `architecture.md` v2.1)

- **Tailwind 4.2.2** — pattern `@theme` CSS inline exclusif. **NE JAMAIS créer `tailwind.config.ts`** (section 2.3 + section 8.bis entrée #1). Cette story est exactement l'application de cette décision.
- **Dark-first always** — pas de light mode, pas de `@media (prefers-color-scheme: dark)`. Le site est en dark mode en permanence (cf. UX spec).
- **Fonts self-hosted** — pas de CDN Google Fonts runtime. Tout via `next/font/local` pour garantir zéro dépendance réseau à l'exécution (cf. risque architectural A? build-time réseau, deferred Story 1.1).
- **Path alias `@/*`** — déjà opérationnel depuis Story 1.1. Pas nécessaire pour cette story, juste bon à savoir.

### Pattern Tailwind 4 `@theme` — exemple complet minimal

Pour référence (structure attendue, valeurs partielles — le dev agent doit compléter avec **toutes** les valeurs listées en AC1) :

```css
@import "tailwindcss";

@theme {
  /* === Couleurs === */
  --color-yield-dark: #0A1628;
  --color-yield-dark-elevated: #0F1E38;
  --color-yield-dark-border: #1E3A5F;
  --color-yield-gold: #C9A84C;
  --color-yield-gold-light: #E5C67F;
  --color-yield-gold-dim: #9A7E3A;
  --color-yield-ink: #F4F4F5;
  --color-yield-ink-muted: #94A3B8;
  --color-yield-ink-dim: #64748B;
  --color-bull: #22C55E;
  --color-bull-dim: #15803D;
  --color-bear: #EF4444;
  --color-bear-dim: #B91C1C;
  --color-neutral: #94A3B8;
  --color-alert-warning: #F59E0B;
  --color-alert-alert: #DC2626;
  --color-alert-crisis: #991B1B;

  /* === Typography families (les --font-* sont résolues via next/font/local) === */
  --font-serif: var(--font-instrument-serif), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), Menlo, monospace;

  /* === Typography sizes === */
  --text-display-1: clamp(3rem, 6vw, 5.5rem);
  --text-display-1--line-height: 1.1;
  --text-display-1--letter-spacing: -0.02em;
  --text-display-2: clamp(2.5rem, 5vw, 4rem);
  --text-display-2--line-height: 1.15;
  --text-display-2--letter-spacing: -0.01em;
  --text-display-3: clamp(2rem, 4vw, 3rem);
  --text-display-3--line-height: 1.2;

  --text-heading-1: 2rem;
  --text-heading-1--line-height: 1.3;
  --text-heading-1--font-weight: 600;
  --text-heading-2: 1.5rem;
  --text-heading-2--line-height: 1.4;
  --text-heading-2--font-weight: 600;

  --text-body-lg: 1.25rem;
  --text-body-lg--line-height: 1.6;
  --text-body: 1rem;
  --text-body--line-height: 1.7;
  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.5;
  --text-caption: 0.75rem;
  --text-caption--line-height: 1.4;
  --text-caption--letter-spacing: 0.05em;

  --text-number-xl: clamp(2rem, 4vw, 3rem);
  --text-number-xl--line-height: 1;
  --text-number-lg: 1.75rem;
  --text-number-lg--line-height: 1;
  --text-number-md: 1.25rem;
  --text-number-md--line-height: 1;

  /* === Spacings custom === */
  --spacing-0_5: 2px;
  /* 1-32 suivent l'échelle déjà définie par Tailwind 4 par défaut (0.25rem base) */
  /* Note : en Tailwind 4 le spacing scale est multiplicatif basé sur --spacing (défaut 0.25rem) */

  /* === Max-widths === */
  --container-content: 720px;
  --container-wide: 1200px;
  --container-full-wide: 1440px;

  /* === Shadows === */
  --shadow-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-elevation-2: 0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-elevation-3: 0 10px 20px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-gold-glow: 0 0 30px rgba(201, 168, 76, 0.3);
  --shadow-alert-glow: 0 0 40px rgba(220, 38, 38, 0.4);

  /* === Breakpoints custom === */
  --breakpoint-xs: 375px;
  /* sm/md/lg/xl/2xl restent les défauts Tailwind 4 (640/768/1024/1280/1536) */

  /* === Transitions === */
  --transition-duration-instant: 100ms;
  --transition-duration-fast: 200ms;
  --transition-duration-normal: 300ms;
  --transition-duration-slow: 500ms;
  --transition-duration-slower: 800ms;
  --transition-duration-cinema: 1200ms;

  --ease-editorial: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-cinema: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce-subtle: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Tabular-nums pour toutes les classes font-mono (chiffres alignés verticalement) */
.font-mono {
  font-variant-numeric: tabular-nums;
}
```

### Pattern `next/font/local` pour variable fonts + multi-weight

```typescript
// src/app/layout.tsx
import localFont from 'next/font/local';
import './globals.css';

// Variable font : un seul fichier couvre tous les poids
const inter = localFont({
  src: './fonts/InterVariable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900', // plage de poids supportée
});

const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: '100 900',
});

// Font static : multi-src pour regular + italic
const instrumentSerif = localFont({
  src: [
    {
      path: './fonts/InstrumentSerif-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/InstrumentSerif-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
});
```

### Sources de téléchargement (URLs validées)

| Font | URL | Format |
|---|---|---|
| **Instrument Serif** | https://fonts.google.com/specimen/Instrument+Serif → "Download family" (zip contient les TTF, à convertir en WOFF2 si besoin) OU https://github.com/google/fonts/tree/main/ofl/instrumentserif | WOFF2 (~30 KB par fichier) |
| **Inter Variable** | https://rsms.me/inter/font-files/InterVariable.woff2 (direct WOFF2 variable) | WOFF2 (~310 KB) |
| **JetBrains Mono Variable** | https://github.com/JetBrains/JetBrainsMono/releases → dernier release → `JetBrainsMono-2.304.zip` → `fonts/variable/JetBrainsMono[wght].ttf` → convertir en WOFF2 via https://transfonter.org/ | WOFF2 (~180 KB) |

**Conversion TTF → WOFF2** si nécessaire : utiliser https://transfonter.org/ (gratuit, pas d'inscription) ou la lib `woff2` npm en local. **Privilégier le WOFF2 déjà prêt** quand il existe (Inter en particulier).

### Anti-patterns à éviter

1. **NE PAS créer `tailwind.config.ts` / `tailwind.config.js`.** Tailwind 4 l'ignore totalement (ou émet un warning). Tout se passe dans `globals.css`.
2. **NE PAS utiliser `next/font/google`** pour les polices YieldField. C'est self-hosted exclusivement (contrainte architecture : zéro dépendance runtime Google Fonts).
3. **NE PAS placer les fonts dans `public/fonts/`.** `next/font/local` est optimisé pour un path relatif depuis le fichier qui l'importe. `src/app/fonts/` est la convention Next.js 13+ App Router.
4. **NE PAS committer les fichiers `.ttf`** si on a déjà les `.woff2` équivalents. WOFF2 est ~25 % plus compact et est supporté par 97 % des navigateurs depuis 2020.
5. **NE PAS laisser le bloc `body { font-family: Arial, ... }`** dans `globals.css`. C'est un résidu du template create-next-app qui écrase les CSS variables Tailwind (finding P3 deferred Story 1.1 review).
6. **NE PAS laisser `@media (prefers-color-scheme: dark)`** dans `globals.css`. Le site est dark-first always (pas de bascule).
7. **NE PAS hardcoder de couleurs** `#0A1628` ou `rgb(201, 168, 76)` dans `layout.tsx` ou `page.tsx`. Toujours via les classes Tailwind générées par `@theme` (`bg-yield-dark`, `text-yield-gold`).

### Testing standards

**Pour cette story :** pas de test automatisé (pas encore de logique métier). Les "tests" sont :
- Smoke test visuel manuel via `pnpm run dev` sur `page.tsx`
- Devtools inspection (couleurs, font-family, network WOFF2)
- `pnpm run build` + lint + typecheck propres
- Lighthouse Accessibility ≥ 95 sur la page de smoke test

**Tests automatisés viendront en Story 1.7** (Vitest setup) et **Story 6.7** (Playwright e2e avec visual regression possible).

### Budget performance

- **First Load JS cible** : < 150 KB (vs 108 KB de base Story 1.1 sans fonts). L'ajout des 3 fonts self-hosted (~500 KB total) est **hors** du JS bundle — les WOFF2 sont téléchargées séparément par le navigateur et cachées.
- **Fonts total download** : < 600 KB cumulé (Instrument Serif 60 KB + Inter 310 KB + JetBrains Mono 180 KB ≈ 550 KB)
- **FOUT prevention** : `display: 'swap'` autorise un court FOUT contrôlé. Acceptable pour un site éditorial dark (le flash est peu visible sur fond yield-dark).

### WCAG validation (rappel UX spec section 5.2)

| Combinaison | Ratio attendu | WCAG |
|---|---|---|
| `text-yield-ink` sur `bg-yield-dark` | 17.4:1 | AAA |
| `text-yield-ink-muted` sur `bg-yield-dark` | 6.3:1 | AAA |
| `text-yield-gold` sur `bg-yield-dark` | 7.9:1 | AAA |
| `text-bull` sur `bg-yield-dark` | 7.2:1 | AAA |
| `text-bear` sur `bg-yield-dark` | 5.5:1 | AA |
| `text-alert-warning` sur `bg-yield-dark` | 8.8:1 | AAA |

Toutes les combinaisons respectent au minimum WCAG AA. **Les couleurs ne doivent pas être modifiées sans revalidation des ratios.**

### Project Structure Notes

**Alignement parfait avec `architecture.md` v2.1 :**
- Section 2.3 Stack figé : Tailwind 4 + `@theme` ✓
- Section 5.2 Dependencies : pas d'ajout npm dans cette story (on utilise `@tailwindcss/postcss` déjà installé Story 1.1) ✓

**Variance vs `epics.md` (Story 1.2 AC originales lignes 49-58) :**
- Epics.md dit "tailwind.config.ts enrichi" → **on override à `globals.css` avec `@theme`** (déviation Tailwind 4 documentée en architecture.md v2.1 section 8.bis)
- Epics.md dit "public/fonts/" → **on override à `src/app/fonts/`** (meilleure pratique Next.js App Router pour `next/font/local`)
- Ces deux variances sont **alignées** avec la direction prise en Story 1.1, pas des divergences nouvelles.

**Conflits détectés :** aucun.

### References

- `docs/planning-artifacts/epics.md#Story-1.2` (lignes 49-58) — AC d'origine (à re-spécer en Tailwind 4 post-story)
- `docs/planning-artifacts/architecture.md#2.3-Ce-que-le-starter-décide` (versions figées) — stack Tailwind 4 verrouillé
- `docs/planning-artifacts/architecture.md#8.bis` — changelog v2.0 → v2.1 avec justification Tailwind 4
- `docs/planning-artifacts/ux-design-specification.md#5.1-Design-tokens` (lignes 294-390) — tokens originaux (format Tailwind 3, à convertir en Tailwind 4)
- `docs/planning-artifacts/ux-design-specification.md#5.2-Contrast-ratios` (lignes 392-404) — validation WCAG verrouillée
- `docs/implementation-artifacts/1-1-setup-nextjs-15-react-19.md` — Story précédente + findings deferred résolus par 1.2
- `docs/implementation-artifacts/deferred-work.md` — liste des findings reportés dont 3 sont résolus par cette story (Arial body, metadata boilerplate, html lang)
- [Tailwind 4 theme docs](https://tailwindcss.com/docs/theme) — syntaxe `@theme` officielle
- [Next.js next/font/local docs](https://nextjs.org/docs/app/api-reference/components/font#local-fonts) — pattern variable fonts

---

## Previous Story Intelligence (Story 1.1)

- **Status :** done (review Sonnet 4.6 passée, 2 patches appliqués, 6 defers)
- **Commit refs :** `6b71eeb` (init), `0a08051` (review mark), `78935c0` (review fixes)
- **Stack installé opérationnel :** Next 15.5.15 + React 19.1.0 + TS 5.9.3 + Tailwind 4.2.2 + pnpm 10.33.0 + ESLint 9.39.4
- **Scripts disponibles :** `pnpm dev` (Turbopack), `pnpm build` (Webpack stable), `pnpm lint` (`eslint .`), `pnpm typecheck`, `pnpm start`
- **Fichiers à toucher (tous existants Story 1.1) :** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- **Fichiers à créer :** `src/app/fonts/` + 4 fichiers `.woff2`
- **Findings deferred résolus par cette story :**
  - `html lang="en"` → passera à `lang="fr"` (Story 1.4 rendra dynamique)
  - Metadata boilerplate "Create Next App" → remplacée par "YieldField"
  - `font-family: Arial, Helvetica, sans-serif` en body → supprimée

---

## Dev Agent Record

### Agent Model Used

À renseigner par le dev agent à l'exécution.

### Debug Log References

À renseigner.

### Completion Notes List

À renseigner.

### File List

À renseigner.

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-11 | 0.1.0 | Story 1.2 créée en pattern Tailwind 4 `@theme` (re-spec vs epics.md qui était Tailwind 3) + self-hosted fonts en `src/app/fonts/` vs `public/fonts/` (meilleure pratique Next.js App Router). Résout 3 findings deferred de Story 1.1 review. | claude-opus-4-6[1m] via bmad-create-story |
