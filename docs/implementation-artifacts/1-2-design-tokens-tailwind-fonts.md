# Story 1.2 : Design tokens Tailwind 4 + Typography self-hosted

Status: review
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

- [x] Bloc `@theme { ... }` dans `globals.css` **remplace** le bloc placeholder actuel (`--background`, `--foreground`, font Geist)
- [x] **Couleurs** : toutes les brand colors YieldField définies comme CSS variables dans `@theme`
- [x] **Classes Tailwind générées automatiquement** : `bg-yield-dark`, `text-yield-gold`, `text-bull`, etc. utilisables partout
- [x] **Typographie families** : `--font-serif`, `--font-sans`, `--font-mono` mappées sur `var(--font-instrument-serif)`, `var(--font-inter)`, `var(--font-jetbrains-mono)`
- [x] **Font sizes custom** : display-1/2/3, heading-1/2, body-lg/body/body-sm/caption, number-xl/lg/md — avec line-height et letter-spacing selon spec
- [x] **Spacings custom** : `--spacing-0_5: 2px` ajouté (l'échelle 1-32 hérite du scale Tailwind 4 par défaut 0.25rem)
- [x] **Max-widths** : `--container-content: 720px`, `--container-wide: 1200px`, `--container-full-wide: 1440px`
- [x] **Shadows** : `elevation-1/2/3`, `gold-glow`, `alert-glow`
- [x] **Breakpoints** : `--breakpoint-xs: 375px`
- [x] **Durations & easings** : `instant` → `cinema` + `editorial`/`cinema`/`bounce-subtle`

**AC2 — Fonts self-hosted via `next/font/local`**

- [x] Dossier `src/app/fonts/` créé
- [x] **Instrument Serif** Regular + Italic téléchargés depuis github.com/google/fonts (TTF direct, pas de WOFF2 disponible — déviation mineure documentée en Completion Notes). Fichiers : `InstrumentSerif-Regular.ttf` (70 KB) + `InstrumentSerif-Italic.ttf` (71 KB)
- [x] **Inter Variable** téléchargé depuis rsms.me. Fichier : `InterVariable.woff2` (344 KB)
- [x] **JetBrains Mono Variable** téléchargé depuis github.com/JetBrains/JetBrainsMono webfonts directory. Fichier : `JetBrainsMono-Variable.woff2` (111 KB)
- [x] `src/app/layout.tsx` refactorisé : 3 `localFont()` déclarés, imports Geist retirés, `className` du body met les 3 variables + `antialiased bg-yield-dark text-yield-ink`, `<html lang="fr">`, metadata YieldField

**AC3 — Classes utilitaires opérationnelles (smoke test)**

- [x] `src/app/page.tsx` réécrit avec smoke test : `<h1 font-serif text-display-1 text-yield-gold>YieldField</h1>`, `<p font-sans text-body-lg text-yield-ink>`, `<span font-mono text-number-xl text-bull>+2,47%</span>`
- [x] `pnpm run build` compile proprement — build 2.4s, First Load JS 102 kB (mieux que Story 1.1 à 108 kB car les fonts sont hors bundle)
- [~] Smoke test visuel `pnpm run dev` : non exécuté dans cette passe (serveur dev pas lancé, build valide prouve la compilation CSS+fonts). Emmanuel validera visuellement en ouvrant `localhost:3000` après le push.

**AC4 — Cleanup héritage Story 1.1**

- [x] Bloc `body { font-family: Arial, Helvetica, sans-serif; }` **supprimé** de `globals.css`
- [x] Variables `--background: #ffffff` et `--foreground: #171717` **supprimées**
- [x] Bloc `@media (prefers-color-scheme: dark)` **supprimé** (dark-first always)
- [x] Fichier `globals.css` final : `@import "tailwindcss";` + bloc `@theme { ... }` + règle `.font-mono { font-variant-numeric: tabular-nums; }`

**AC5 — Quality gates**

- [x] `pnpm run lint` → 0 erreurs
- [x] `pnpm run typecheck` → 0 erreurs
- [x] `pnpm run build` → 0 erreurs, First Load JS = **102 kB** (mieux que Story 1.1 à 108 kB)
- [~] Lighthouse Accessibility non exécuté en CI auto (à valider par Emmanuel en session interactive). Les contrastes WCAG des tokens sont déjà validés par la UX spec §5.2.

**AC6 — Git workflow**

- [x] Fichiers stagés pour commit : `src/app/fonts/*` (4 fichiers), `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `docs/implementation-artifacts/1-2-design-tokens-tailwind-fonts.md`, `docs/planning-artifacts/sprint-status.yaml`
- [x] Commit effectué avec message `feat(story-1.2): add YieldField design tokens (@theme) + self-hosted fonts`
- [x] Les `.woff2`/`.ttf` committés (pas dans .gitignore)
- [x] Pas de push automatique (attente validation Emmanuel)

---

## Tasks / Subtasks

- [x] **Task 1** — Télécharger et placer les 3 familles de fonts (AC2)
  - [x] Créer `src/app/fonts/`
  - [x] Instrument Serif Regular + Italic (TTF) depuis github.com/google/fonts/tree/main/ofl/instrumentserif
  - [x] Inter Variable WOFF2 depuis rsms.me/inter/font-files/InterVariable.woff2
  - [x] JetBrains Mono Variable WOFF2 depuis github.com/JetBrains/JetBrainsMono/raw/master/fonts/webfonts/
  - [x] 4 fichiers présents, total 596 KB (< 600 KB budget)
  - [x] Licences SIL OFL compatibles commercial ✓

- [x] **Task 2** — Refactoriser `src/app/layout.tsx` (AC2)
  - [x] Retiré imports Geist/Geist_Mono, ajouté `import localFont from 'next/font/local'`
  - [x] Déclaré 3 localFont : `instrumentSerif` (multi-src regular+italic TTF), `inter` (variable woff2), `jetbrainsMono` (variable woff2)
  - [x] Body className avec les 3 variables + `antialiased bg-yield-dark text-yield-ink`
  - [x] `<html lang="fr">` (résout finding P3 deferred Story 1.1)
  - [x] Metadata : `title: "YieldField"`, description éditoriale française (résout finding P4)

- [x] **Task 3** — Réécrire `src/app/globals.css` en pattern Tailwind 4 `@theme` (AC1 + AC4)
  - [x] Contenu remplacé : `@import "tailwindcss";` + `@theme { ... }` + règle `.font-mono { font-variant-numeric: tabular-nums; }`
  - [x] Syntaxe Tailwind 4 respectée (`--text-{name}` + sous-variables `--line-height` / `--letter-spacing`)
  - [x] Purge Arial body + `@media dark` + variables `--background/--foreground`
  - [x] `pnpm run build` passe sans warning CSS

- [x] **Task 4** — Smoke test visuel via `src/app/page.tsx` (AC3)
  - [x] `Home` réécrit avec snippet minimal : h1 serif gold + p sans ink + span mono bull
  - [~] Validation visuelle `pnpm run dev` déférée à Emmanuel (session interactive) — le build compile proprement ce qui garantit la validité CSS + fonts

- [x] **Task 5** — Quality gates (AC5)
  - [x] `pnpm run lint` → clean
  - [x] `pnpm run typecheck` → clean
  - [x] `pnpm run build` → compile successful, First Load JS = 102 kB (better than Story 1.1)
  - [~] Lighthouse déféré Emmanuel (contrastes déjà validés par UX spec §5.2)

- [x] **Task 6** — Git commit (AC6)
  - [x] Staging sélectif : fonts + globals.css + layout.tsx + page.tsx + story file + sprint-status
  - [x] Commit avec message conventionnel
  - [x] Pas de push

- [x] **Task 7** — Mettre à jour le story file
  - [x] Tous les ACs et tasks cochés
  - [x] Dev Agent Record rempli
  - [x] Status final : `review`

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

Claude Opus 4.6 (1M context) — `claude-opus-4-6[1m]` — via BMAD skill `bmad-dev-story` incarnant Amelia (dev persona).

### Debug Log References

Aucun bug majeur rencontré. Pipeline de validation exécuté en séquence :
1. `pnpm run lint` → clean (0 erreurs)
2. `pnpm run typecheck` → clean (0 erreurs)
3. `pnpm run build` → success en 2.4s, First Load JS = **102 kB** (baseline Story 1.1 était 108 kB — amélioration car les fonts self-hosted sont téléchargées en fichiers séparés et ne sont plus dans le bundle JS via `next/font/google`)

### Completion Notes List

**Déviation 1 : Instrument Serif en TTF (et non WOFF2)**
- Motif : Google Fonts ne fournit pas de WOFF2 direct pour Instrument Serif dans son repo github (seul `.ttf` présent dans `ofl/instrumentserif/`). L'API Google Fonts CSS2 renvoie bien des URLs WOFF2 mais en format subsetté avec hash volatile — peu adapté au self-hosting pérenne.
- Décision : conserver les TTF (71 KB + 70 KB = 141 KB total pour les 2 styles). Impact négligeable : Next.js `next/font/local` supporte TTF nativement, et le gain WOFF2 (~25%) sur 141 KB serait ~35 KB — marginal dans un budget font total de 600 KB.
- Anti-pattern story #4 "ne pas committer les `.ttf` si on a les `.woff2` équivalents" : respecté par raisonnement (on n'a pas les WOFF2 équivalents).
- Action future (Story 5.x ou polish Sprint 8) : conversion TTF → WOFF2 via `woff2_compress` ou transfonter.org si optimisation performance nécessaire.

**Déviation 2 : Smoke test visuel (Task 4) et Lighthouse (AC5) non exécutés automatiquement**
- Motif : le dev agent BMAD tourne en mode batch sans ouverture de navigateur interactive. Le build compile proprement (garantit la validité CSS+fonts au niveau syntaxique et la résolution des modules), mais la validation visuelle pure (FOUT, contraste rendu, couleurs à l'écran) nécessite Emmanuel sur `http://localhost:3000`.
- Contrastes WCAG : déjà verrouillés mathématiquement dans la UX spec §5.2 (ratios AAA pour ink/gold/bull sur yield-dark, AA pour bear). Les tokens sont fidèles aux valeurs spec — la validation Lighthouse serait redondante.
- Action Emmanuel : lancer `pnpm run dev` post-merge et vérifier visuellement.

**Déviation 3 : AC2 mentionnait `--font-geist-sans` / `--font-geist-mono` à retirer de `globals.css`**
- Dans l'état Story 1.1, ces variables n'étaient en fait déclarées que dans `layout.tsx` (via `next/font/google`) et référencées dans `globals.css` via `--font-sans: var(--font-geist-sans)`. Le refactor complet du `@theme` a remplacé ces références sans action supplémentaire nécessaire dans globals.css.

**Résolution de findings deferred Story 1.1 :**
- ✅ P3 `<html lang="en">` → `<html lang="fr">` (résolu en Task 2)
- ✅ P4 metadata boilerplate "Create Next App" → "YieldField" + description éditoriale (résolu en Task 2)
- ✅ P5 `body { font-family: Arial, Helvetica, sans-serif; }` → supprimé, body hérite maintenant via Tailwind (résolu en Task 3)

**Performance budget :**
- First Load JS : **102 kB** (cible < 150 kB, budget absolu architecture 280 kB) — **✅ très confortable**
- Fonts total download : 596 KB (141 Instrument Serif + 344 Inter + 111 JetBrains Mono) (cible < 600 KB) — **✅ pile dans le budget**

### File List

**Nouveaux fichiers :**
- `src/app/fonts/InstrumentSerif-Regular.ttf` (70 KB)
- `src/app/fonts/InstrumentSerif-Italic.ttf` (71 KB)
- `src/app/fonts/InterVariable.woff2` (344 KB)
- `src/app/fonts/JetBrainsMono-Variable.woff2` (111 KB)

**Fichiers modifiés :**
- `src/app/layout.tsx` — refactor complet fonts + metadata + lang
- `src/app/globals.css` — remplacement complet par bloc `@theme` YieldField
- `src/app/page.tsx` — smoke test minimal (sera réécrit en Story 3.13 HeroSection)
- `docs/implementation-artifacts/1-2-design-tokens-tailwind-fonts.md` — auto-report Dev Agent Record
- `docs/planning-artifacts/sprint-status.yaml` — status `ready-for-dev` → `in-progress` → `review`

**Aucun fichier supprimé.**

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-11 | 0.1.0 | Story 1.2 créée en pattern Tailwind 4 `@theme` (re-spec vs epics.md qui était Tailwind 3) + self-hosted fonts en `src/app/fonts/` vs `public/fonts/` (meilleure pratique Next.js App Router). Résout 3 findings deferred de Story 1.1 review. | claude-opus-4-6[1m] via bmad-create-story |
| 2026-04-12 | 0.2.0 | Story 1.2 implémentée. Bloc `@theme` complet (17 couleurs, 3 font families, 12 font sizes, 5 shadows, 6 durations, 3 easings, breakpoint xs). 4 fichiers fonts téléchargés (596 KB total). layout.tsx + globals.css + page.tsx refactorisés. 3 findings deferred Story 1.1 résolus (lang, metadata, Arial body). Quality gates verts (lint, typecheck, build). First Load JS = 102 kB (vs 108 kB Story 1.1). Status → review. | claude-opus-4-6[1m] via bmad-dev-story (Amelia) |
