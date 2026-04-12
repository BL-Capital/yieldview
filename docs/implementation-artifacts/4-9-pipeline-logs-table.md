# Story 4.9 : Business — `<PipelineLogsTable>`

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
**I want** voir les 7 dernières exécutions du pipeline nocturne avec leur statut,
**so that** la transparence du système est démontrée concrètement et Bryan prouve que son pipeline tourne vraiment.

**Business value :** Élément de preuve sociale technique. Un visiteur qui voit des logs réels comprend que YieldField est un vrai système automatisé, pas une démo statique.

---

## Acceptance Criteria

**AC1 -- Composant `<PipelineLogsTable>`**
- [ ] `src/components/coulisses/PipelineLogsTable.tsx` créé
- [ ] Utilise shadcn `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableCell>`
- [ ] Wrapped dans shadcn `<ScrollArea>` (hauteur max 400px, scroll interne)
- [ ] Colonnes :
  - `Date` : format `DD MMM YYYY HH:mm` (locale-aware via `Intl.DateTimeFormat`)
  - `Status` : badge avec Pulsating Dot coloré
  - `Latency` : en millisecondes (ex: `1 234 ms`)
  - `Output` : nom du fichier produit (ex: `analysis-2026-04-12.json`)

**AC2 -- Status badges**
- [ ] `success` : dot vert pulsant + texte "Success" vert
- [ ] `warning` : dot ambre + texte "Warning" ambre (avec `title` tooltip cause)
- [ ] `error` : dot rouge + texte "Error" rouge (avec `title` tooltip cause)
- [ ] `running` : dot bleu pulsant + texte "Running" bleu
- [ ] Dot pulsant = animation CSS `pulse` (1.5s, respect `prefers-reduced-motion`)

**AC3 -- Fetch données depuis R2**
- [ ] Fonction `getPipelineLogs()` dans `src/lib/r2/pipeline-logs.ts`
- [ ] Fetch `runs-last-7.json` depuis le bucket R2 (même pattern que `getLatestAnalysis()`)
- [ ] Schema Zod : `PipelineRunSchema` (date ISO, status, latencyMs, outputFilename, error?)
- [ ] Fallback : si R2 indisponible → array de 3 runs mockés (pas d'erreur visible)
- [ ] Revalidation : 1h (ISR)

**AC4 -- Intégration Server Component**
- [ ] `<PipelineLogsTable>` est un async Server Component
- [ ] Appelle `getPipelineLogs()` directement dans le composant

**AC5 -- Tests**
- [ ] Test : rendu avec données mockées, 7 rows affichées
- [ ] Test : status "success" → badge vert
- [ ] Test : `getPipelineLogs` retourne fallback si fetch échoue (mock fetch)
- [ ] Tests dans `tests/components/coulisses/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/components/coulisses/PipelineLogsTable.tsx
src/lib/r2/pipeline-logs.ts
tests/components/coulisses/PipelineLogsTable.test.tsx
tests/lib/r2/pipeline-logs.test.ts
```

### Schema Zod attendu (runs-last-7.json)
```ts
const PipelineRunSchema = z.object({
  runId: z.string(),
  startedAt: z.string().datetime(),
  status: z.enum(['success', 'warning', 'error', 'running']),
  latencyMs: z.number().int().nonneg(),
  outputFilename: z.string(),
  error: z.string().optional(),
})
export const PipelineRunsSchema = z.array(PipelineRunSchema).max(7)
```

### Pattern R2 fetch (même que Story 2.11/3.12)
```ts
const url = `${process.env.R2_PUBLIC_URL}/logs/runs-last-7.json`
const res = await fetch(url, { next: { revalidate: 3600 } })
```

### Dépendances
- Story 2.11/2.12 : R2 client + publish (pattern à réutiliser)
- Story 1.3 : shadcn Table, ScrollArea (composants à vérifier installés)
- Story 2.1 : Zod schemas (pattern)
- Story 4.11 : page Coulisses (assemblage)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
