# Story 4.8 : Business — `<TimelineStep>` + `<PromptCodeBlock>`

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
**I want** naviguer dans les étapes de création du projet avec un affichage clair des prompts et leur évolution,
**so that** je comprends le processus BMAD + IA qui produit le contenu YieldField et je peux copier les prompts qui m'intéressent.

**Business value :** Composants business clés de la page Coulisses. Ils transforment les données MDX/JSON en une expérience narrative interactive.

---

## Acceptance Criteria

**AC1 -- Composant `<TimelineStep>`**
- [ ] `src/components/coulisses/TimelineStep.tsx` créé
- [ ] Props :
  - `step: number` (numéro affiché)
  - `title: string`
  - `date?: string`
  - `description: string`
  - `media?: React.ReactNode` (slot pour image SVG, diagram, etc.)
  - `children?: React.ReactNode` (slot pour CodeBlock, PipelineTable, etc.)
  - `isLast?: boolean` (supprime la ligne connectrice)
- [ ] Layout : dot numéroté à gauche + ligne connectrice verticale + contenu à droite
- [ ] Dot : cercle or `#C9A84C` avec numéro `step` centré
- [ ] Ligne : `border-l-2 border-zinc-700`
- [ ] Reveal au scroll : `motion` `fadeInUp` avec délai progressif par step
- [ ] Respect `prefers-reduced-motion` : pas d'animation

**AC2 -- Composant `<PromptCodeBlock>`**
- [ ] `src/components/coulisses/PromptCodeBlock.tsx` créé
- [ ] Wrapper autour de `<CodeBlock>` (Story 4.6) avec navigation entre versions
- [ ] Props :
  - `versions: Array<{ label: string; code: string; notes?: string }>`
  - `language?: string` (défaut `'markdown'`)
  - `title?: string`
- [ ] Navigation pills : `v01 | v02 | v03 | ...` (tabs ou boutons pills)
- [ ] Au moins 3 versions navigables
- [ ] Notes de version affichées sous le code block (italique, gris)
- [ ] Version active mise en évidence dans les pills (fond gold)
- [ ] Animation de transition entre versions : fade cross (Motion 12)

**AC3 -- Tests**
- [ ] Test `TimelineStep` : rendu avec props minimales sans erreur
- [ ] Test `TimelineStep` : slot `children` rendu
- [ ] Test `PromptCodeBlock` : clic sur pill v02 affiche la version v02
- [ ] Tests dans `tests/components/coulisses/`

**AC4 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/coulisses/
  TimelineStep.tsx
  PromptCodeBlock.tsx
tests/components/coulisses/
  TimelineStep.test.tsx
  PromptCodeBlock.test.tsx
```

### Pattern TimelineStep reveal
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.5, delay: step * 0.1 }}
>
```

### Utilisation PromptCodeBlock
```tsx
<PromptCodeBlock
  title="Évolution des prompts"
  versions={[
    { label: 'v01', code: '...', notes: 'Premier jet, trop générique' },
    { label: 'v06', code: '...', notes: 'Version finale en production' },
  ]}
/>
```

### Dépendances
- Story 3.1 : Motion 12 (animations)
- Story 4.4 : TracingBeam (utilisera TimelineStep)
- Story 4.6 : CodeBlock (PromptCodeBlock wrappera CodeBlock)
- Story 4.10 : Contenu MDX (fournit les données)
- Story 4.11 : page Coulisses (assemblage)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
