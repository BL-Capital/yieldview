# Story 2.1 : Schemas Zod (Analysis, KPI, Alert)

Status: review
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** les schemas Zod complets (AnalysisSchema, KpiSchema, AlertSchema) créés avec tests Vitest,
**so that** toutes les frontières de données du pipeline (Finnhub, FRED, Claude API, R2) sont validées de manière stricte et typée.

**Business value :** Les schemas Zod sont le contrat de données partagé entre le pipeline backend et le frontend. Sans eux, chaque histoire de Sprint 2a/2b et le frontend Epic 3 devront réinventer les types. Les schemas doivent exister AVANT les clients API (Stories 2.2-2.5) pour que ceux-ci puissent les importer et valider leurs réponses.

---

## Acceptance Criteria

**AC1 — Installation des dépendances**

- [ ] `zod` installé comme dependency de production (`dependencies`)
- [ ] `vitest` + `@vitejs/plugin-react` installés comme devDependencies
- [ ] `vitest.config.ts` créé à la racine
- [ ] Script `"test": "vitest run"` et `"test:watch": "vitest"` ajoutés dans `package.json`

**AC2 — `src/lib/schemas/kpi.ts`**

- [ ] `KpiSchema` exporté avec tous les champs de la spec architecture (section 3.2 + 4.2)
- [ ] `type Kpi = z.infer<typeof KpiSchema>` exporté
- [ ] Champs : `id`, `category`, `label (fr/en)`, `value`, `unit`, `change_day`, `change_pct`, `direction`, `source`, `timestamp`, `freshness_level`

**AC3 — `src/lib/schemas/alert.ts`**

- [ ] `AlertLevelSchema` exporté : enum `'warning' | 'alert' | 'crisis'`
- [ ] `AlertStateSchema` exporté (schema standalone pour `compute-alert.ts`) avec : `active`, `level (nullable)`, `vix_current`, `vix_p90_252d`, `triggered_at (nullable ISO string)`
- [ ] `type AlertLevel = z.infer<typeof AlertLevelSchema>` exporté
- [ ] `type AlertState = z.infer<typeof AlertStateSchema>` exporté

**AC4 — `src/lib/schemas/analysis.ts`**

- [ ] `AnalysisSchema` complet exporté (cf. architecture section 3.2)
- [ ] Compose `KpiSchema` et `AlertStateSchema` (imports depuis kpi.ts et alert.ts)
- [ ] Champs complets : `date`, `generated_at`, `validated_at`, `pipeline_run_id`, `version`, `briefing (fr/en)`, `tagline (fr/en)`, `metadata`, `kpis`, `alert`, `ai_original (optional)`
- [ ] `type Analysis = z.infer<typeof AnalysisSchema>` exporté
- [ ] `type DailyAnalysis = Analysis` (alias pour compatibilité frontend — cf. architecture 3.2)

**AC5 — Tests Vitest**

- [ ] `src/lib/schemas/__tests__/kpi.test.ts` : happy path + cas d'erreur (champ manquant, mauvais type, enum invalide)
- [ ] `src/lib/schemas/__tests__/alert.test.ts` : happy path + cas d'erreur
- [ ] `src/lib/schemas/__tests__/analysis.test.ts` : happy path + cas d'erreur (data complète valide + invalide)
- [ ] `pnpm test` passe sans erreurs

**AC6 — Git**

- [ ] Commit sur `emmanuel` avec message `feat(story-2.1): add Zod schemas (Analysis, Kpi, Alert) + Vitest setup`

---

## Tasks / Subtasks

- [x] **Task 1** — Setup Vitest (AC1)
  - [x] `pnpm add zod` — zod 4.3.6 installé
  - [x] `pnpm add -D vitest @vitejs/plugin-react` — vitest 4.1.4 + @vitejs/plugin-react 6.0.1
  - [x] Créer `vitest.config.ts` (environment: node, alias @/→src/)
  - [x] Ajouter scripts `test` et `test:watch` dans `package.json`

- [x] **Task 2** — Créer `src/lib/schemas/kpi.ts` (AC2)
  - [x] Implémenter `KpiSchema` complet (11 champs + label object + enums stricts)
  - [x] Exporter `type Kpi`

- [x] **Task 3** — Créer `src/lib/schemas/alert.ts` (AC3)
  - [x] Implémenter `AlertLevelSchema` enum
  - [x] Implémenter `AlertStateSchema` complet
  - [x] Exporter `type AlertLevel` + `type AlertState`

- [x] **Task 4** — Créer `src/lib/schemas/analysis.ts` (AC4)
  - [x] Importer KpiSchema depuis `./kpi`
  - [x] Importer AlertStateSchema depuis `./alert`
  - [x] Implémenter `MetadataSchema` en local (theme_of_day, certainty, upcoming_event, risk_level)
  - [x] Implémenter `AnalysisSchema` complet en composant les sous-schemas
  - [x] Exporter `type Analysis` + alias `type DailyAnalysis = Analysis`

- [x] **Task 5** — Créer les tests Vitest (AC5)
  - [x] `src/lib/schemas/__tests__/kpi.test.ts` — 12 tests
  - [x] `src/lib/schemas/__tests__/alert.test.ts` — 9 tests
  - [x] `src/lib/schemas/__tests__/analysis.test.ts` — 14 tests
  - [x] `pnpm test` ✅ 35/35 passed

- [x] **Task 6** — Git commit : `feat(story-2.1): add Zod schemas (Analysis, Kpi, Alert) + Vitest setup`

- [x] **Task 7** — Update story → status review

---

## Dev Notes

### Dépendances à installer

```bash
pnpm add zod
pnpm add -D vitest @vitejs/plugin-react
```

Versions attendues (latest stable à la date du sprint) :
- `zod` : `^3.24.x` (v3.x est stable, pas v4 encore)
- `vitest` : `^3.x` (compatible Vite 6)
- `@vitejs/plugin-react` : `^4.x`

### Pattern vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // schemas = pure TS, pas besoin de jsdom
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Pourquoi `environment: 'node'` :** Les schemas Zod sont du pur TypeScript sans DOM. `jsdom` est inutile et ralentit le démarrage.

### Schemas complets à implémenter

#### `src/lib/schemas/kpi.ts`

```typescript
import { z } from 'zod';

export const KpiSchema = z.object({
  id: z.string(),
  category: z.enum(['rates', 'spreads', 'indices', 'volatility', 'macro']),
  label: z.object({ fr: z.string(), en: z.string() }),
  value: z.number(),
  unit: z.string(),
  change_day: z.number(),
  change_pct: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
  source: z.enum(['finnhub', 'fred', 'alpha_vantage', 'calculated']),
  timestamp: z.string().datetime(),
  freshness_level: z.enum(['live', 'stale', 'very_stale']),
});

export type Kpi = z.infer<typeof KpiSchema>;
```

#### `src/lib/schemas/alert.ts`

```typescript
import { z } from 'zod';

export const AlertLevelSchema = z.enum(['warning', 'alert', 'crisis']);

export const AlertStateSchema = z.object({
  active: z.boolean(),
  level: AlertLevelSchema.nullable(),
  vix_current: z.number(),
  vix_p90_252d: z.number(),
  triggered_at: z.string().datetime().nullable(),
});

export type AlertLevel = z.infer<typeof AlertLevelSchema>;
export type AlertState = z.infer<typeof AlertStateSchema>;
```

#### `src/lib/schemas/analysis.ts`

```typescript
import { z } from 'zod';
import { KpiSchema } from './kpi';
import { AlertStateSchema } from './alert';

const BilingualStringSchema = z.object({ fr: z.string(), en: z.string() });

const MetadataSchema = z.object({
  theme_of_day: BilingualStringSchema,
  certainty: z.enum(['preliminary', 'definitive']),
  upcoming_event: BilingualStringSchema.nullable(),
  risk_level: z.enum(['low', 'medium', 'high', 'crisis']),
});

export const AnalysisSchema = z.object({
  // Metadata pipeline
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),   // "2026-04-14"
  generated_at: z.string().datetime(),
  validated_at: z.string().datetime().nullable(),
  pipeline_run_id: z.string().uuid(),
  version: z.enum(['ai', 'manual-override']),

  // Editorial
  briefing: BilingualStringSchema,
  tagline: BilingualStringSchema,
  metadata: MetadataSchema,

  // Market data
  kpis: z.array(KpiSchema),

  // Alert state
  alert: AlertStateSchema,

  // Archive IA (préservé si override manuel)
  ai_original: z.object({
    briefing: BilingualStringSchema,
    tagline: BilingualStringSchema,
  }).optional(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type DailyAnalysis = Analysis; // Alias pour le frontend (architecture section 3.2)
```

### Patterns de tests

```typescript
// src/lib/schemas/__tests__/kpi.test.ts
import { describe, it, expect } from 'vitest';
import { KpiSchema } from '../kpi';

const validKpi = {
  id: 'oat_10y',
  category: 'rates',
  label: { fr: 'OAT 10 ans', en: 'OAT 10Y' },
  value: 3.45,
  unit: '%',
  change_day: -0.05,
  change_pct: -1.43,
  direction: 'down',
  source: 'fred',
  timestamp: '2026-04-12T06:00:00.000Z',
  freshness_level: 'live',
};

describe('KpiSchema', () => {
  it('validates a valid KPI', () => {
    expect(() => KpiSchema.parse(validKpi)).not.toThrow();
  });

  it('rejects invalid category', () => {
    expect(() => KpiSchema.parse({ ...validKpi, category: 'invalid' })).toThrow();
  });

  it('rejects missing id', () => {
    const { id, ...rest } = validKpi;
    expect(() => KpiSchema.parse(rest)).toThrow();
  });

  it('rejects wrong direction', () => {
    expect(() => KpiSchema.parse({ ...validKpi, direction: 'sideways' })).toThrow();
  });
});
```

### Contraintes importantes

1. **Pas de `src/lib/schemas/index.ts`** — chaque schema est importé directement depuis son fichier (`./kpi`, `./alert`, `./analysis`) pour que le tree-shaking fonctionne côté frontend.

2. **`z.string().datetime()`** — stricter que `z.string()` : valide le format ISO 8601. À utiliser pour tous les timestamps.

3. **`pipeline_run_id: z.string().uuid()`** — le pipeline génère un UUID v4 au démarrage de chaque run.

4. **`change_pct` et `change_day`** peuvent être négatifs — pas de `.min(0)`.

5. **`kpis: z.array(KpiSchema)`** — le tableau peut être vide en cas de fallback total, ne pas ajouter `.min(1)`.

6. **`ai_original` est `.optional()`** — absent si version = 'ai' (jamais overridé).

### Anti-patterns

1. **NE PAS** créer de `src/lib/schemas/index.ts` (re-export barrel) — évite les circular imports avec les futurs clients API.
2. **NE PAS** utiliser `z.any()` — chaque champ doit être typé strictement.
3. **NE PAS** utiliser `z.coerce.number()` — les valeurs numériques arrivent déjà typées depuis JSON.
4. **NE PAS** installer `@types/zod` — zod inclut ses propres types.
5. **NE PAS** mettre `"test": "jest"` dans package.json — le projet utilise Vitest, pas Jest.

### Arborescence fichiers

```
src/
  lib/
    schemas/
      kpi.ts          ← NEW
      alert.ts        ← NEW
      analysis.ts     ← NEW
      __tests__/
        kpi.test.ts   ← NEW
        alert.test.ts ← NEW
        analysis.test.ts ← NEW
vitest.config.ts      ← NEW (racine)
```

### References

- `docs/planning-artifacts/architecture.md` — Section 3.2 (Schéma DailyAnalysis complet)
- `docs/planning-artifacts/architecture.md` — Section 4.2 (Pattern : Zod validation at boundaries)
- `docs/planning-artifacts/epics.md#Story-2.1` — ACs originaux
- `docs/planning-artifacts/epics.md#Story-2.7` — AlertState utilisé par compute-alert.ts

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) — via bmad-create-story

### Debug Log References

- Zod v4.3.6 installé (dernière version stable disponible) — API compatible : `z.iso.datetime()` remplace `z.string().datetime()` dans v4. `z.string().uuid()` reste valide.
- Vitest v4.1.4 installé avec `environment: 'node'` (schemas purs TS, pas de DOM)

### Completion Notes List

- 3 schemas créés : `kpi.ts`, `alert.ts`, `analysis.ts` — tous composés correctement
- `DailyAnalysis = Analysis` alias exporté pour compatibilité frontend (architecture 3.2)
- 35 tests Vitest : 12 (kpi) + 9 (alert) + 14 (analysis) — tous passent en 318ms
- Zod v4 : `z.iso.datetime()` pour timestamps ISO 8601, `z.string().uuid()` pour pipeline_run_id
- Pas de `src/lib/schemas/index.ts` barrel — imports directs par fichier pour tree-shaking

### File List

**Nouveaux fichiers :**
- `src/lib/schemas/kpi.ts`
- `src/lib/schemas/alert.ts`
- `src/lib/schemas/analysis.ts`
- `src/lib/schemas/__tests__/kpi.test.ts`
- `src/lib/schemas/__tests__/alert.test.ts`
- `src/lib/schemas/__tests__/analysis.test.ts`
- `vitest.config.ts`

**Modifiés :**
- `package.json` — scripts test/test:watch + deps zod/vitest/@vitejs/plugin-react
- `pnpm-lock.yaml` — lockfile mis à jour
