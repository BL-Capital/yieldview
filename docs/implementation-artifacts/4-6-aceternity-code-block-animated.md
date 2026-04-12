# Story 4.6 : Aceternity Code Block Animated

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur de la page Coulisses,
**I want** voir les prompts IA dans des blocs de code animés avec coloration syntaxique et bouton de copie,
**so that** les prompts sont lisibles, copiables et l'aspect "technique sophistiqué" est renforcé.

**Business value :** Composant central de la page Coulisses — affiche les 6 versions de prompts. La qualité visuelle de ce composant impacte directement la crédibilité de Bryan comme expert IA.

---

## Acceptance Criteria

**AC1 -- Composant Code Block**
- [ ] `src/components/aceternity/code-block.tsx` créé (copy depuis Aceternity UI)
- [ ] Props : `language: string`, `filename?: string`, `code: string`, `highlightLines?: number[]`, `className?: string`
- [ ] Coloration syntaxique via `highlight.js` ou `prismjs` ou `shiki` (au choix de l'agent)
- [ ] Header avec nom de fichier + badge langage
- [ ] Ligne de fond sombre (`bg-zinc-950`)
- [ ] Lignes mises en évidence via `highlightLines` : fond légèrement plus clair

**AC2 -- Bouton Copy**
- [ ] Bouton "Copy" en haut à droite du code block
- [ ] Copie le contenu `code` dans le clipboard (`navigator.clipboard.writeText`)
- [ ] Feedback visuel : icône check + texte "Copied!" pendant 2s, puis reset
- [ ] `ShineBorder` (Story 4.7) appliqué au hover du bouton copy
- [ ] Toast Sonner : `toast.success("Copied to clipboard")`

**AC3 -- Vérification Sonner**
- [ ] `sonner` est déjà installé (sprint 3) — vérifier, sinon `pnpm add sonner`
- [ ] `<Toaster>` présent dans le layout root (vérifier, sinon ajouter)

**AC4 -- Animation entrée**
- [ ] Fade-in + slide-up au montage (Motion 12, `initial={{ opacity: 0, y: 20 }}`)
- [ ] Respect `prefers-reduced-motion` : pas d'animation

**AC5 -- Tests**
- [ ] Test : rendu avec `code="hello world"` et `language="text"`
- [ ] Test : bouton copy déclenche `navigator.clipboard.writeText` (mock)
- [ ] Tests dans `tests/components/aceternity/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Source
Aceternity UI Code Block : https://ui.aceternity.com/components/code-block

### Structure fichiers
```
src/components/aceternity/code-block.tsx
tests/components/aceternity/CodeBlock.test.tsx
```

### Librairie syntaxe recommandée
`shiki` est déjà populaire dans l'écosystème Next 15. Vérifier si déjà installé.
Alternative légère : `highlight.js` (bundle plus petit).

### Dépendances
- Story 3.1 : Motion 12 (animations)
- Story 4.7 : ShineBorder (bouton copy hover)
- Story 4.8 : PromptCodeBlock (utilisera ce composant)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
