# Story 2.10 : Script `generate-ai.ts`

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2b (semaine 3)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un script `scripts/pipeline/generate-ai.ts` qui orchestre les appels Claude Opus (briefing FR) et Claude Haiku (traduction EN), valide la sortie via `AnalysisSchema.parse()`, et produit l'objet `Analysis` complet,
**so that** le pipeline peut transformer les KPIs bruts et l'alerte VIX en briefing editorial bilingue publiable sur R2 (Story 2.12).

**Business value :** Ce script est le coeur du pipeline. C'est lui qui transforme les chiffres de marche en editorial lisible par Bryan et les utilisateurs. Sans lui, le site n'a pas de contenu editorial et reste une coquille vide de KPIs.

---

## Acceptance Criteria

**AC1 -- Fichier `scripts/pipeline/generate-ai.ts`**

- [ ] Fichier cree a `scripts/pipeline/generate-ai.ts`
- [ ] Compatible `pnpm tsx scripts/pipeline/generate-ai.ts` (pas de compilation prealable)
- [ ] Pas d'import Next.js -- script Node.js pur
- [ ] Export de `generateAnalysis(kpis: Kpi[], alert: AlertState): Promise<Analysis>` pour usage par `publish-r2.ts` (Story 2.12)
- [ ] Guard `main()` avec `process.argv[1] === fileURLToPath(import.meta.url)` (meme pattern que `fetch-data.ts`)

**AC2 -- Imports obligatoires**

- [ ] `buildKpis()` depuis `./fetch-data.js`
- [ ] `buildAlert()` depuis `./compute-alert.js`
- [ ] `generateBriefing()` depuis `../../src/lib/claude.js` (Story 2.8 -- wrapper Anthropic SDK)
- [ ] `buildUserPrompt()` depuis `./prompts/user-briefing.js` (Story 2.9 -- construit le prompt utilisateur avec les KPIs)
- [ ] System prompt charge depuis `./prompts/system-chartiste-lettre.md` via `fs.readFileSync(path, 'utf-8')`
- [ ] `AnalysisSchema` et `type Analysis` depuis `../../src/lib/schemas/analysis.js`
- [ ] `type Kpi` depuis `../../src/lib/schemas/kpi.js`
- [ ] `type AlertState` depuis `../../src/lib/schemas/alert.js`

**AC3 -- Orchestration sequentielle**

- [ ] Etape 1 : appeler `buildKpis()` pour obtenir `{ kpis, fetchedAt }`
- [ ] Etape 2 : extraire VIX des kpis, appeler `buildAlert(vixValue)` avec try/catch (fallback neutre si echec, meme pattern que `fetch-data.ts`)
- [ ] Etape 3 : construire le user prompt FR via `buildUserPrompt(kpis, alert)`
- [ ] Etape 4 : charger le system prompt depuis le fichier `.md`
- [ ] Etape 5 : appeler Claude Opus pour generer le briefing FR + tagline FR + metadata (JSON)
- [ ] Etape 6 : valider la reponse Opus avec Zod (schema partiel : `briefing.fr`, `tagline.fr`, `metadata`)
- [ ] Etape 7 : appeler Claude Haiku pour traduire `briefing.fr` et `tagline.fr` en anglais
- [ ] Etape 8 : assembler l'objet `Analysis` complet (metadata pipeline + editorial + kpis + alert)
- [ ] Etape 9 : valider avec `AnalysisSchema.parse(analysis)` -- throw si non conforme
- [ ] Etape 10 : output JSON sur stdout, logs sur stderr

**AC4 -- Appel Claude Opus (briefing FR)**

- [ ] Utiliser `generateBriefing()` de `src/lib/claude.ts` (Story 2.8)
- [ ] Model : Claude Opus (le model exact est configure dans `claude.ts`, pas hardcode ici)
- [ ] `AbortSignal.timeout(30_000)` -- timeout 30 secondes (LLM generation lente)
- [ ] System prompt = contenu de `./prompts/system-chartiste-lettre.md`
- [ ] User prompt = sortie de `buildUserPrompt(kpis, alert)`
- [ ] Reponse attendue : JSON avec `{ briefing: { fr: string }, tagline: { fr: string }, metadata: { theme_of_day: { fr: string }, certainty, upcoming_event, risk_level } }`
- [ ] Log tokens utilises (input + output) sur stderr

**AC5 -- Retry sur JSON invalide**

- [ ] Si Claude retourne du JSON invalide (parse error ou Zod validation fail), retry UNE FOIS
- [ ] Le retry utilise un prompt "fix this JSON" qui inclut l'erreur Zod et la reponse originale
- [ ] Si le retry echoue aussi, throw `GenerateError`
- [ ] Max 2 tentatives total (1 essai + 1 retry) par appel Claude
- [ ] **PAS de fallback sur version precedente dans CE script** -- c'est `publish-r2.ts` (Story 2.12) qui gere le fallback R2

**AC6 -- Appel Claude Haiku (traduction EN)**

- [ ] Model : Claude Haiku (configure dans `claude.ts`)
- [ ] `AbortSignal.timeout(30_000)` (meme timeout)
- [ ] Input : `briefing.fr` + `tagline.fr` + `metadata.theme_of_day.fr` + `metadata.upcoming_event.fr` (si non null)
- [ ] Output : `{ briefing: { en: string }, tagline: { en: string }, theme_of_day: { en: string }, upcoming_event: { en: string } | null }`
- [ ] Meme logique retry que AC5 si JSON invalide
- [ ] Log tokens utilises

**AC7 -- Assemblage objet `Analysis`**

- [ ] Generer `pipeline_run_id` avec `crypto.randomUUID()`
- [ ] `date` = `new Date().toISOString().slice(0, 10)` (YYYY-MM-DD)
- [ ] `generated_at` = `new Date().toISOString()`
- [ ] `validated_at` = `null` (sera mis a jour par `publish-r2.ts` si validation manuelle)
- [ ] `version` = `'ai'`
- [ ] Fusionner les briefings FR + EN, taglines FR + EN, metadata avec traductions
- [ ] Inclure `kpis` et `alert` tels quels
- [ ] `ai_original` = copie de `{ briefing, tagline }` (pour preservation si override manuel)

**AC8 -- Log structure JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr -- jamais stdout)
- [ ] Log de demarrage : `{ level: 'info', msg: 'generate-ai start', kpi_count, alert_active }`
- [ ] Log apres Opus : `{ level: 'info', msg: 'opus complete', tokens_in, tokens_out, duration_ms }`
- [ ] Log apres Haiku : `{ level: 'info', msg: 'haiku complete', tokens_in, tokens_out, duration_ms }`
- [ ] Log final : `{ level: 'info', msg: 'generate-ai complete', duration_ms, pipeline_run_id }`
- [ ] En cas d'erreur : `{ level: 'error', msg, error: string, timestamp }`
- [ ] En cas de retry : `{ level: 'warn', msg: 'retry after invalid JSON', attempt: 2, error: string }`

**AC9 -- Tests Vitest**

- [ ] `scripts/pipeline/__tests__/generate-ai.test.ts` cree
- [ ] Mock de `../../src/lib/claude.js` (`generateBriefing`)
- [ ] Mock de `./fetch-data.js` (`buildKpis`)
- [ ] Mock de `./compute-alert.js` (`buildAlert`)
- [ ] Mock de `./prompts/user-briefing.js` (`buildUserPrompt`)
- [ ] Mock de `fs.readFileSync` pour le system prompt
- [ ] Test happy path : KPIs + alert -> Analysis valide
- [ ] Test retry : premier appel retourne JSON invalide, second reussit
- [ ] Test echec total : les 2 tentatives echouent -> throw `GenerateError`
- [ ] Test traduction Haiku : verifie que `briefing.en` et `tagline.en` sont remplis
- [ ] Test assemblage `Analysis` : tous les champs obligatoires presents, `pipeline_run_id` est un UUID
- [ ] `pnpm test` passe sans erreurs

**AC10 -- Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.10): add generate-ai.ts pipeline orchestrator`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Creer `scripts/pipeline/generate-ai.ts` (AC1-AC8)
  - [ ] Classe `GenerateError` (extends Error)
  - [ ] Fonction `log()` -- pattern identique a `fetch-data.ts` et `compute-alert.ts`
  - [ ] Fonction `loadSystemPrompt(): string` -- lit `./prompts/system-chartiste-lettre.md` via `fs.readFileSync`
  - [ ] Fonction `callOpus(systemPrompt, userPrompt): Promise<OpusResponse>` -- appel + retry (AC4-AC5)
  - [ ] Fonction `callHaiku(frContent): Promise<HaikuResponse>` -- traduction + retry (AC6)
  - [ ] Fonction exportee `generateAnalysis(kpis: Kpi[], alert: AlertState): Promise<Analysis>` -- assemblage (AC7)
  - [ ] Fonction `main()` -- orchestration complete (AC3)
  - [ ] Guard ESM `if (process.argv[1] === fileURLToPath(import.meta.url))`

- [ ] **Task 2** -- Creer les tests Vitest (AC9)
  - [ ] `scripts/pipeline/__tests__/generate-ai.test.ts`
  - [ ] Mock tous les modules externes
  - [ ] Tests unitaires : happy path, retry, echec total, assemblage Analysis
  - [ ] `pnpm test` OK

- [ ] **Task 3** -- Git commit : `feat(story-2.10): add generate-ai.ts pipeline orchestrator`

- [ ] **Task 4** -- Update story status -> review

---

## Dev Notes

### Pattern `GenerateError`

```typescript
export class GenerateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenerateError';
  }
}
```

### Pattern `log()` (identique aux autres scripts pipeline)

```typescript
function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}
```

### Pattern `loadSystemPrompt()`

```typescript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadSystemPrompt(): string {
  const promptPath = path.join(__dirname, 'prompts', 'system-chartiste-lettre.md');
  return fs.readFileSync(promptPath, 'utf-8');
}
```

**Important :** utiliser `import.meta.url` pour resoudre le chemin relatif au script, pas `process.cwd()`. Le script peut etre execute depuis n'importe quel repertoire.

### Pattern appel Claude avec retry

```typescript
import { generateBriefing } from '../../src/lib/claude.js';

interface OpusResponse {
  briefing: { fr: string };
  tagline: { fr: string };
  metadata: {
    theme_of_day: { fr: string };
    certainty: 'preliminary' | 'definitive';
    upcoming_event: { fr: string } | null;
    risk_level: 'low' | 'medium' | 'high' | 'crisis';
  };
}

// Schema Zod partiel pour valider la reponse Opus
const OpusResponseSchema = z.object({
  briefing: z.object({ fr: z.string().min(50) }),
  tagline: z.object({ fr: z.string().min(10) }),
  metadata: z.object({
    theme_of_day: z.object({ fr: z.string() }),
    certainty: z.enum(['preliminary', 'definitive']),
    upcoming_event: z.object({ fr: z.string() }).nullable(),
    risk_level: z.enum(['low', 'medium', 'high', 'crisis']),
  }),
});

async function callOpus(systemPrompt: string, userPrompt: string): Promise<OpusResponse> {
  const start = Date.now();

  for (let attempt = 1; attempt <= 2; attempt++) {
    const prompt = attempt === 1
      ? userPrompt
      : `The previous response was invalid JSON. Error: ${lastError}\n\nOriginal response:\n${lastRaw}\n\nPlease fix and return valid JSON.`;

    const result = await generateBriefing({
      model: 'opus',
      system: systemPrompt,
      user: prompt,
      signal: AbortSignal.timeout(30_000),
    });

    log('info', attempt === 1 ? 'opus complete' : 'opus retry complete', {
      attempt,
      tokens_in: result.usage.input_tokens,
      tokens_out: result.usage.output_tokens,
      duration_ms: Date.now() - start,
    });

    // Parse JSON from Claude response
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.content);
    } catch {
      lastError = 'Invalid JSON';
      lastRaw = result.content;
      if (attempt === 2) throw new GenerateError('Opus returned invalid JSON after retry');
      log('warn', 'retry after invalid JSON', { attempt: 2, error: 'parse error' });
      continue;
    }

    // Zod validation
    const validation = OpusResponseSchema.safeParse(parsed);
    if (!validation.success) {
      lastError = validation.error.message;
      lastRaw = result.content;
      if (attempt === 2) throw new GenerateError(`Opus Zod validation failed after retry: ${lastError}`);
      log('warn', 'retry after invalid JSON', { attempt: 2, error: lastError });
      continue;
    }

    return validation.data;
  }

  throw new GenerateError('Unreachable');
}
```

**Note critique :** la signature exacte de `generateBriefing()` depend de Story 2.8 (`src/lib/claude.ts`). Si Story 2.8 n'est pas encore implementee au moment du dev, creer un mock local. La fonction attend probablement `{ model, system, user, signal }` et retourne `{ content: string, usage: { input_tokens: number, output_tokens: number } }`.

### Pattern appel Haiku (traduction)

```typescript
interface HaikuResponse {
  briefing: { en: string };
  tagline: { en: string };
  theme_of_day: { en: string };
  upcoming_event: { en: string } | null;
}

async function callHaiku(frContent: {
  briefing_fr: string;
  tagline_fr: string;
  theme_of_day_fr: string;
  upcoming_event_fr: string | null;
}): Promise<HaikuResponse> {
  // Meme pattern retry que callOpus
  // System prompt = instructions de traduction
  // User prompt = contenu FR a traduire
}
```

### Pattern assemblage `Analysis`

```typescript
import { AnalysisSchema, type Analysis } from '../../src/lib/schemas/analysis.js';
import crypto from 'crypto';

export async function generateAnalysis(kpis: Kpi[], alert: AlertState): Promise<Analysis> {
  const systemPrompt = loadSystemPrompt();
  const userPrompt = buildUserPrompt(kpis, alert);

  // Opus : briefing FR
  const opus = await callOpus(systemPrompt, userPrompt);

  // Haiku : traduction EN
  const haiku = await callHaiku({
    briefing_fr: opus.briefing.fr,
    tagline_fr: opus.tagline.fr,
    theme_of_day_fr: opus.metadata.theme_of_day.fr,
    upcoming_event_fr: opus.metadata.upcoming_event?.fr ?? null,
  });

  // Assemblage
  const analysis: Analysis = {
    date: new Date().toISOString().slice(0, 10),
    generated_at: new Date().toISOString(),
    validated_at: null,
    pipeline_run_id: crypto.randomUUID(),
    version: 'ai',
    briefing: {
      fr: opus.briefing.fr,
      en: haiku.briefing.en,
    },
    tagline: {
      fr: opus.tagline.fr,
      en: haiku.tagline.en,
    },
    metadata: {
      theme_of_day: {
        fr: opus.metadata.theme_of_day.fr,
        en: haiku.theme_of_day.en,
      },
      certainty: opus.metadata.certainty,
      upcoming_event: opus.metadata.upcoming_event
        ? { fr: opus.metadata.upcoming_event.fr, en: haiku.upcoming_event?.en ?? '' }
        : null,
      risk_level: opus.metadata.risk_level,
    },
    kpis,
    alert,
    ai_original: {
      briefing: { fr: opus.briefing.fr, en: haiku.briefing.en },
      tagline: { fr: opus.tagline.fr, en: haiku.tagline.en },
    },
  };

  // Validation finale Zod
  return AnalysisSchema.parse(analysis);
}
```

### Pattern `main()` standalone

```typescript
async function main(): Promise<void> {
  const start = Date.now();

  const { kpis, fetchedAt } = await buildKpis();

  // Alert state (meme pattern try/catch que fetch-data.ts)
  const vixKpi = kpis.find((k) => k.id === 'vix');
  let alert: AlertState = {
    active: false, level: null,
    vix_current: 0, vix_p90_252d: 0,
    triggered_at: null,
  };

  if (vixKpi) {
    try {
      alert = await buildAlert(vixKpi.value);
    } catch (err) {
      log('warn', 'compute-alert skipped', { error: String(err) });
      alert = { ...alert, vix_current: vixKpi.value };
    }
  }

  log('info', 'generate-ai start', { kpi_count: kpis.length, alert_active: alert.active });

  const analysis = await generateAnalysis(kpis, alert);

  log('info', 'generate-ai complete', {
    duration_ms: Date.now() - start,
    pipeline_run_id: analysis.pipeline_run_id,
  });

  process.stdout.write(JSON.stringify(analysis, null, 2) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'generate-ai fatal', { error: String(err) });
    process.exit(1);
  });
}
```

### Pattern tests Vitest (mock claude.ts)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules AVANT les imports
vi.mock('../../../src/lib/claude', () => ({
  generateBriefing: vi.fn(),
}));

vi.mock('../fetch-data', () => ({
  buildKpis: vi.fn(),
}));

vi.mock('../compute-alert', () => ({
  buildAlert: vi.fn(),
}));

vi.mock('../prompts/user-briefing', () => ({
  buildUserPrompt: vi.fn(),
}));

vi.mock('fs');

import { generateBriefing } from '../../../src/lib/claude';
import { buildKpis } from '../fetch-data';
import { buildAlert } from '../compute-alert';
import { buildUserPrompt } from '../prompts/user-briefing';
import fs from 'fs';

const mockGenerateBriefing = vi.mocked(generateBriefing);
const mockBuildKpis = vi.mocked(buildKpis);
const mockBuildAlert = vi.mocked(buildAlert);
const mockBuildUserPrompt = vi.mocked(buildUserPrompt);
const mockFs = vi.mocked(fs);

describe('generateAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFs.readFileSync.mockReturnValue('You are The Literate Chartist...');
    mockBuildUserPrompt.mockReturnValue('KPIs: ...');
  });

  it('produces a valid Analysis on happy path', async () => {
    // Setup mocks for Opus + Haiku responses
    // Assert AnalysisSchema.parse succeeds
    // Assert pipeline_run_id is a valid UUID
  });

  it('retries once on invalid JSON from Opus', async () => {
    // First call returns malformed JSON
    // Second call returns valid JSON
    // Assert generateBriefing called twice
  });

  it('throws GenerateError after 2 failed attempts', async () => {
    // Both calls return invalid JSON
    // Assert GenerateError thrown
  });
});
```

### Contraintes importantes

1. **Bracket notation** : `process.env['ANTHROPIC_API_KEY']` -- obligatoire partout, pre-commit hook bloque les dot notation `process.env.VAR`
2. **Jamais stdout** pour les logs -- uniquement `console.error(JSON.stringify(...))` (stderr)
3. **stdout propre** : seul `process.stdout.write(JSON.stringify(result))` en mode standalone
4. **Extension `.js`** dans les imports relatifs -- obligatoire pour ESM avec `pnpm tsx` : `import from './fetch-data.js'`
5. **`AnalysisSchema.parse()`** obligatoire avant return -- validation de conformite Zod
6. **`crypto.randomUUID()`** pour `pipeline_run_id` -- natif Node.js, pas de lib externe
7. **`AbortSignal.timeout(30_000)`** pour les appels Claude -- 30 secondes (plus long que le 10s des API data)
8. **`z.iso.datetime()`** -- Zod v4 syntax pour les champs datetime (pas `z.string().datetime()`)
9. **`import.meta.url`** pour resoudre les paths relatifs au script (pas `process.cwd()`)

### Anti-patterns

1. **NE PAS** hardcoder le nom du model Claude -- utiliser le wrapper `claude.ts` de Story 2.8 qui gere la config
2. **NE PAS** faire les appels Opus et Haiku en parallele -- Haiku a besoin du contenu FR produit par Opus
3. **NE PAS** implementer un fallback sur `latest.json` de R2 dans ce script -- c'est `publish-r2.ts` (Story 2.12) qui gere le fallback
4. **NE PAS** appeler `fetchVIX()` directement -- utiliser `buildKpis()` + extraction du VIX depuis les KPIs (evite double fetch)
5. **NE PAS** utiliser `process.env.VAR` (dot notation) -- pre-commit hook bloque
6. **NE PAS** oublier `ai_original` dans l'assemblage -- necessaire pour Story 2.12 (preservation si override manuel)
7. **NE PAS** utiliser `require()` -- projet ESM, imports uniquement
8. **NE PAS** mettre le prompt Haiku de traduction dans ce script -- il sera dans `prompts/translation-haiku-v01.md` (Story 2.9). Le charger via `fs.readFileSync` comme le system prompt
9. **NE PAS** creer `src/lib/claude.ts` dans cette story -- c'est Story 2.8. Si pas encore fait, mocker l'import
10. **NE PAS** creer les fichiers prompts dans cette story -- c'est Story 2.9. Si pas encore fait, utiliser un placeholder

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              <- existant (Story 2.5) -- importer buildKpis
    compute-alert.ts           <- existant (Story 2.7) -- importer buildAlert
    generate-ai.ts             <- NEW (cette story)
    prompts/
      system-chartiste-lettre.md   <- Story 2.9 (prerequis, doit exister)
      user-briefing.ts             <- Story 2.9 (prerequis, doit exister)
      translation-haiku-v01.md     <- Story 2.9 (prerequis, doit exister)
    __tests__/
      fetch-data.test.ts       <- existant (Story 2.5)
      compute-alert.test.ts    <- existant (Story 2.7)
      generate-ai.test.ts      <- NEW (cette story)
src/
  lib/
    claude.ts                  <- Story 2.8 (prerequis, doit exister)
    schemas/
      analysis.ts              <- existant (Story 2.1) -- AnalysisSchema
      kpi.ts                   <- existant (Story 2.1) -- Kpi type
      alert.ts                 <- existant (Story 2.1) -- AlertState type
```

### Dependencies sur stories non implementees

Ce script depend de 2 stories qui n'existent peut-etre pas encore :

| Dependance | Story | Que faire si absente |
|---|---|---|
| `src/lib/claude.ts` | 2.8 | Creer un fichier stub minimal avec la signature attendue. Le test mockera de toute facon |
| `scripts/pipeline/prompts/*` | 2.9 | Creer un placeholder `.md` minimal pour le system prompt. Le test mockera `fs.readFileSync` |

**Strategie recommandee :** implementer Story 2.8 et 2.9 AVANT 2.10. Si le dev agent les implemente en batch, l'ordre est 2.8 -> 2.9 -> 2.10.

### AnalysisSchema rappel (source : `src/lib/schemas/analysis.ts`)

Les champs obligatoires que `generateAnalysis` doit remplir :

| Champ | Type | Source |
|---|---|---|
| `date` | `string` (YYYY-MM-DD) | `new Date().toISOString().slice(0, 10)` |
| `generated_at` | `string` (ISO datetime) | `new Date().toISOString()` |
| `validated_at` | `string \| null` | `null` (sera set par publish-r2) |
| `pipeline_run_id` | `string` (UUID) | `crypto.randomUUID()` |
| `version` | `'ai' \| 'manual-override'` | `'ai'` |
| `briefing` | `{ fr: string, en: string }` | Opus FR + Haiku EN |
| `tagline` | `{ fr: string, en: string }` | Opus FR + Haiku EN |
| `metadata` | objet complexe | Opus FR + Haiku EN pour bilingues |
| `kpis` | `Kpi[]` | Pass-through de `buildKpis()` |
| `alert` | `AlertState` | Pass-through de `buildAlert()` |
| `ai_original` | `{ briefing, tagline }` (optionnel) | Copie des briefing/tagline pour archivage |

### Distinction Opus vs Haiku

| Aspect | Claude Opus | Claude Haiku |
|---|---|---|
| Role | Generation editoriale FR | Traduction FR -> EN |
| System prompt | `system-chartiste-lettre.md` (long, avec few-shot) | `translation-haiku-v01.md` (court, instructions traduction) |
| User prompt | `buildUserPrompt(kpis, alert)` (KPIs formates) | Le contenu FR a traduire |
| Output | JSON `{ briefing.fr, tagline.fr, metadata }` | JSON `{ briefing.en, tagline.en, theme_of_day.en, upcoming_event.en }` |
| Cout | Plus cher (tokens longs) | Pas cher (traduction courte) |
| Timeout | 30s | 30s |

### References existantes

- `src/lib/schemas/analysis.ts` -- `AnalysisSchema`, `Analysis` type (Story 2.1) [Source: src/lib/schemas/analysis.ts]
- `src/lib/schemas/kpi.ts` -- `KpiSchema`, `Kpi` type (Story 2.1) [Source: src/lib/schemas/kpi.ts]
- `src/lib/schemas/alert.ts` -- `AlertStateSchema`, `AlertState` type (Story 2.1) [Source: src/lib/schemas/alert.ts]
- `scripts/pipeline/fetch-data.ts` -- `buildKpis()`, `PipelineError`, `log()` pattern, guard ESM (Story 2.5) [Source: scripts/pipeline/fetch-data.ts]
- `scripts/pipeline/compute-alert.ts` -- `buildAlert()`, `AlertComputeError` (Story 2.7) [Source: scripts/pipeline/compute-alert.ts]
- `scripts/pipeline/__tests__/fetch-data.test.ts` -- pattern mock vitest, `vi.mock()`, `vi.mocked()` (Story 2.5) [Source: scripts/pipeline/__tests__/fetch-data.test.ts]
- `docs/planning-artifacts/architecture.md` -- Section 3.2 `DailyAnalysis`, Section 3.4 pipeline sequentiel, Section 4.5 prompts versionnes [Source: docs/planning-artifacts/architecture.md#3.4, #4.5]
- `docs/planning-artifacts/epics.md` -- Story 2.10 AC, Story 2.8 + 2.9 (dependencies) [Source: docs/planning-artifacts/epics.md#Story-2.10]

### Note sur Zod v4 syntax

Le projet utilise `zod ^4.3.6`. Attention a la syntaxe :
- `z.iso.datetime()` au lieu de `z.string().datetime()` (Zod v3 syntax)
- `z.enum([...])` fonctionne pareil
- `z.object({}).parse()` fonctionne pareil
- Les `safeParse()` retournent `{ success, data, error }` comme en v3

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 -- via bmad-create-story

### Debug Log References

_A completer lors de l'implementation_

### Completion Notes List

_A completer lors de l'implementation_

### File List

**Nouveaux fichiers :**
- `scripts/pipeline/generate-ai.ts`
- `scripts/pipeline/__tests__/generate-ai.test.ts`

**Fichiers existants requis (dependencies, NE PAS creer) :**
- `src/lib/claude.ts` (Story 2.8)
- `scripts/pipeline/prompts/system-chartiste-lettre.md` (Story 2.9)
- `scripts/pipeline/prompts/user-briefing.ts` (Story 2.9)
- `scripts/pipeline/prompts/translation-haiku-v01.md` (Story 2.9)
