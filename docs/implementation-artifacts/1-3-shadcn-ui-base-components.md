# Story 1.3 : shadcn/ui base components

Status: in-progress
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** les composants shadcn/ui fondamentaux (Button, Card, Dialog, Sheet, DropdownMenu, Tooltip, Sonner/Toast, ScrollArea, Separator, Badge, Input, Label, Form) installés et configurés dans `src/components/ui/` avec les design tokens YieldField,
**so that** toutes les stories UI suivantes (1.5 Layout, Epic 3 Core UI, Epic 4 Coulisses, Epic 5 Alerts) utilisent des composants accessibles WCAG AA par défaut (via Radix Primitives) sans réinventer de base UI.

**Business value :** shadcn/ui est la couche 1 du système de composants (cf. architecture.md Decision 10). Sans elle, pas de Button pour les CTA, pas de Dialog pour les overlays crisis mode, pas de DropdownMenu pour le LanguageSwitcher, pas de Toast pour les feedbacks (newsletter subscribed, copy to clipboard). C'est la fondation invisible qui porte l'accessibilité native.

---

## Acceptance Criteria

**AC1 — shadcn/ui initialisé avec configuration YieldField**

- [ ] `npx shadcn@latest init` exécuté avec les options suivantes :
  - Style : `new-york` (le plus sobre, aligné esthétique FT/Linear/Stripe)
  - Base color : custom (sera overridé par nos tokens @theme)
  - CSS variables : yes
  - `components.json` créé à la racine du projet avec configuration correcte :
    - `"$schema": "https://ui.shadcn.com/schema.json"`
    - `"style": "new-york"`
    - `"tailwind.cssVariables": true`
    - `"aliases.components": "@/components"`
    - `"aliases.utils": "@/lib/utils"`
- [ ] Fichier utilitaire `src/lib/utils.ts` créé avec la fonction `cn()` (tailwind-merge + clsx)
- [ ] Dépendances ajoutées au `package.json` : `tailwind-merge`, `clsx`, `class-variance-authority`, `lucide-react` (icons)
- [ ] `pnpm install` après ajout des dépendances

**AC2 — Composants P0 installés**

- [ ] Les 13 composants suivants installés via `npx shadcn@latest add <component>` dans `src/components/ui/` :
  1. `button` — CTA hero, ghost buttons, outline gold
  2. `card` — base pour KpiCard, AlertBanner, quote cards
  3. `dialog` — overlay détails alerte crisis
  4. `sheet` — navigation mobile hamburger menu
  5. `dropdown-menu` — LanguageSwitcher FR|EN
  6. `tooltip` — KPI hover info, metadata chips explications
  7. `sonner` — toast notifications (newsletter subscribed, copy to clipboard) — Note : shadcn utilise `sonner` (pas `toast`) depuis v0.8+
  8. `scroll-area` — PipelineLogsTable scroll custom
  9. `separator` — dividers sections
  10. `badge` — metadata chips (theme, risk level, event)
  11. `input` — NewsletterForm email input
  12. `label` — form labels accessible
  13. `form` — NewsletterForm structure (react-hook-form + zod integration intégrée)
- [ ] Chaque composant est un fichier `.tsx` dans `src/components/ui/`
- [ ] Aucune modification manuelle des composants à ce stade (on utilise les versions stock shadcn)

**AC3 — Dépendances Radix Primitives correctes**

- [ ] Les Radix Primitives suivants sont installés automatiquement par shadcn et visibles dans `package.json` :
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-tooltip`
  - `@radix-ui/react-scroll-area`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-label`
  - `@radix-ui/react-slot`
- [ ] `sonner` package installé (toast library, remplace l'ancien `@radix-ui/react-toast` + composant custom)
- [ ] `react-hook-form` et `@hookform/resolvers` installés (requis par le composant `form`)
- [ ] `zod` installé (résolveur de schéma pour `form`)

**AC4 — Smoke test composant**

- [ ] Modifier temporairement `src/app/page.tsx` pour un smoke test :
  - `<Button variant="default">Test Button</Button>` rendu correctement avec style YieldField
  - `<Badge>Badge Test</Badge>` rendu correctement
  - `<Card>` avec contenu test
- [ ] Les composants héritent automatiquement des design tokens YieldField via CSS variables (pas de style inline hardcodé)

**AC5 — Quality gates**

- [ ] `pnpm run lint` passe sans erreur
- [ ] `pnpm run typecheck` passe sans erreur
- [ ] `pnpm run build` passe sans erreur, First Load JS reste raisonnable (attendu ~110-130 kB avec les composants tree-shakeable)

**AC6 — Git workflow**

- [ ] Tous les fichiers (components/ui/*, lib/utils.ts, components.json, package.json modifié) committés sur `emmanuel`
- [ ] Commit message : `feat(story-1.3): add shadcn/ui base components (13 components + Radix Primitives)`

---

## Tasks / Subtasks

- [ ] **Task 1** — Initialiser shadcn/ui (AC1)
  - [ ] Exécuter `npx shadcn@latest init` avec configuration YieldField
  - [ ] Vérifier `components.json` généré
  - [ ] Vérifier `src/lib/utils.ts` créé avec `cn()`
  - [ ] Vérifier les dépendances installées (`tailwind-merge`, `clsx`, `class-variance-authority`, `lucide-react`)

- [ ] **Task 2** — Installer les 13 composants P0 (AC2 + AC3)
  - [ ] `npx shadcn@latest add button card dialog sheet dropdown-menu tooltip sonner scroll-area separator badge input label form`
  - [ ] Vérifier les 13 fichiers créés dans `src/components/ui/`
  - [ ] Vérifier que les Radix Primitives, sonner, react-hook-form, @hookform/resolvers, zod sont dans `package.json`

- [ ] **Task 3** — Smoke test via page.tsx (AC4)
  - [ ] Ajouter les imports Button, Badge, Card dans page.tsx
  - [ ] Rendre un Button + Badge + Card avec les classes Tailwind YieldField
  - [ ] `pnpm run dev` → vérifier le rendu (déféré Emmanuel pour validation visuelle)

- [ ] **Task 4** — Quality gates (AC5)
  - [ ] `pnpm run lint` → 0 erreurs
  - [ ] `pnpm run typecheck` → 0 erreurs
  - [ ] `pnpm run build` → compile proprement, noter le First Load JS

- [ ] **Task 5** — Git commit (AC6)
  - [ ] Staging sélectif de tous les fichiers ajoutés/modifiés
  - [ ] Commit avec message conventionnel
  - [ ] Pas de push

- [ ] **Task 6** — Update story file
  - [ ] Cocher toutes les tasks et ACs
  - [ ] Remplir Dev Agent Record
  - [ ] Status → review

---

## Dev Notes

### Architecture constraints (from architecture.md v2.1)

- **shadcn/ui est copy-paste, PAS un package npm** (architecture.md section 5.2 note importante). Les composants sont copiés dans `src/components/ui/` et deviennent du code source propre au projet. Zéro runtime dependency.
- **Radix Primitives** sont les seules vraies dépendances npm ajoutées (`@radix-ui/react-*`). Ils fournissent l'accessibilité WCAG AA native.
- **Style `new-york`** est le plus sobre des styles shadcn. Il utilise des bordes fines et un design plus "flat" — aligné avec l'esthétique YieldField (FT/Linear/Stripe).
- **`cn()` utility** : fonction `src/lib/utils.ts` combinant `clsx` + `tailwind-merge` pour gérer les classes CSS conditionnelles sans conflits.

### Compatibilité Tailwind 4

- shadcn/ui a été mis à jour pour Tailwind 4 (v0.9+). La commande `npx shadcn@latest init` détecte automatiquement Tailwind 4 et adapte la configuration.
- Les composants générés utilisent des CSS variables (`--background`, `--foreground`, etc.) qui DOIVENT être mappées vers nos tokens YieldField. L'init va potentiellement ajouter des variables CSS dans `globals.css` — il faudra les intégrer ou les aligner avec notre bloc `@theme` existant.
- **ATTENTION :** si `shadcn init` modifie `globals.css`, il faut préserver notre bloc `@theme` YieldField et ne pas le laisser écraser. Revérifier le fichier après init.

### Composants shadcn et leur usage dans YieldField (UX spec)

| Composant | Usage YieldField | Première story d'utilisation |
|---|---|---|
| Button | CTA hero "Voir les Coulisses", ghost buttons, outline gold | Story 1.5 (Layout) |
| Card | KpiCard, AlertBanner, quote cards | Story 3.6 (KpiCard) |
| Dialog | Overlay détails alerte crisis | Story 5.3 (AlertBanner) |
| Sheet | Navigation mobile hamburger menu | Story 1.5 (Layout) |
| DropdownMenu | LanguageSwitcher FR\|EN | Story 1.5 (Layout) |
| Tooltip | KPI hover info, metadata chips | Story 3.6 (KpiCard) |
| Sonner | Toast newsletter subscribed, copy clipboard | Story 4.4 (PromptCodeBlock) |
| ScrollArea | PipelineLogsTable scroll | Story 4.3 (PipelineLogsTable) |
| Separator | Dividers entre sections | Story 1.5 (Layout) |
| Badge | Metadata chips theme/risk/event | Story 3.8 (MetadataChips) |
| Input | NewsletterForm email | Story 7.3 (NewsletterForm) |
| Label | Form labels accessible | Story 7.3 |
| Form | NewsletterForm (react-hook-form + zod) | Story 7.3 |

### shadcn init interactive prompts (anticipated)

La commande `npx shadcn@latest init` va poser des questions interactives. Réponses attendues :
- **Which style would you like to use?** → `new-york`
- **Which color would you like to use as the base color?** → `neutral` (sera overridé par nos tokens)
- **Do you want to use CSS variables for theming?** → `yes`

Alternativement, utiliser le mode non-interactif si supporté : `npx shadcn@latest init --style new-york --base-color neutral --css-variables`

### Anti-patterns à éviter

1. **NE PAS installer shadcn comme dépendance npm** (`npm install shadcn-ui` n'existe pas et serait un faux package). Utiliser `npx shadcn@latest`.
2. **NE PAS modifier les composants shadcn dans cette story.** Story 1.3 installe les versions stock. Les customisations (couleurs gold, variantes YieldField) viendront dans les stories Epic 3+.
3. **NE PAS écraser le bloc `@theme` de globals.css.** Si shadcn init ajoute des variables CSS, les intégrer proprement ou s'assurer qu'elles ne conflictent pas.
4. **NE PAS utiliser `@radix-ui/react-toast`** directement — shadcn utilise `sonner` comme remplacement depuis v0.8+.
5. **NE PAS installer de composants non listés** (pas de Accordion, Tabs, etc. à ce stade — ils viendront quand les stories les requièrent).

### Testing standards

Pas de tests automatisés pour cette story (setup composants, pas de logique métier). Smoke test visuel via page.tsx.

### Budget performance

- First Load JS cible : < 150 kB. Les composants shadcn sont tree-shakeable — seuls ceux importés dans le bundle final comptent. L'installation ne les ajoute pas au bundle tant qu'ils ne sont pas importés.
- Les Radix Primitives sont légers (~5-15 kB par composant gzipped).

### Previous Story Intelligence (Story 1.2)

- **Status :** review (commit `129cd39`)
- **globals.css :** bloc `@theme` complet avec 17 couleurs, 12 font sizes, 5 shadows, 6 durations, 3 easings. Le fichier ne contient QUE `@import "tailwindcss";` + `@theme { ... }` + `.font-mono { font-variant-numeric: tabular-nums; }`.
- **layout.tsx :** 3 localFont() (Instrument Serif TTF, Inter Variable WOFF2, JetBrains Mono Variable WOFF2), `<html lang="fr">`, `<body className="... antialiased bg-yield-dark text-yield-ink">`
- **page.tsx :** smoke test minimal (h1 serif gold + p sans ink + span mono bull) — sera réécrit/enrichi dans cette story pour le smoke test shadcn
- **Leçon :** Next.js + Tailwind 4 compilent proprement, les tokens @theme fonctionnent, build 102 kB First Load JS

### Project Structure Notes

- **Path alias `@/*`** opérationnel (tsconfig.json `paths: {"@/*": ["./src/*"]}`).
- **`src/components/ui/`** n'existe pas encore — sera créé par `npx shadcn@latest init`.
- **`src/lib/utils.ts`** n'existe pas encore — sera créé par shadcn init.
- **`components.json`** n'existe pas encore — sera créé par shadcn init à la racine du projet.

### References

- `docs/planning-artifacts/epics.md#Story-1.3` (lignes 59-65) — AC d'origine
- `docs/planning-artifacts/architecture.md#Decision-10` — stratégie composants en couches
- `docs/planning-artifacts/architecture.md#5.2` — dépendances cibles (Radix, tailwind-merge, CVA, clsx)
- `docs/planning-artifacts/ux-design-specification.md#10.1` — familles de composants (Famille A = shadcn/ui)
- `docs/implementation-artifacts/1-2-design-tokens-tailwind-fonts.md` — story précédente (tokens @theme)

---

## Dev Agent Record

### Agent Model Used

À renseigner par le dev agent.

### Debug Log References

À renseigner.

### Completion Notes List

À renseigner.

### File List

À renseigner.

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-12 | 0.1.0 | Story 1.3 créée avec context exhaustif : 13 composants shadcn P0 listés, compatibilité Tailwind 4 documentée, mapping usage UX spec, anti-patterns, budget performance. | claude-opus-4-6[1m] via bmad-create-story |
