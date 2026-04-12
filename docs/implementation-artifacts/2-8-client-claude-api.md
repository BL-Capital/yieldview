# Story 2.8 : Client Claude API (Anthropic SDK)

Status: ready-for-dev
Epic: 2 -- Data Pipeline Backend
Sprint: 2b (semaine 3)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un module `src/lib/claude.ts` qui encapsule le SDK Anthropic pour generer un briefing FR via Claude Opus 4.6 et le traduire en EN via Claude Haiku 4.5,
**so that** le script `generate-ai.ts` (Story 2.10) dispose d'une interface propre, testable et cost-controlled pour produire le contenu editorial bilingue du `AnalysisSchema`.

**Business value :** Ce client est le pont entre les donnees de marche (Stories 2.1-2.7) et le contenu editorial bilingue (Stories 2.9-2.10). Sans lui, aucune generation IA n'est possible. La strategie Opus FR + Haiku EN est une decision architecturale critique pour maintenir le budget Claude sous ~5 EUR/mois (1 run/jour, ~2048 tokens/run).

---

## Acceptance Criteria

**AC1 -- Installation du SDK**

- [ ] `pnpm add @anthropic-ai/sdk` execute
- [ ] Package ajoute dans `dependencies` de `package.json` (pas devDependencies)
- [ ] Version `^0.30.x` ou superieure compatible (architecture.md specifie `^0.30.x`)

**AC2 -- Module `src/lib/claude.ts`**

- [ ] Fichier `src/lib/claude.ts` cree
- [ ] Import du SDK : `import Anthropic from '@anthropic-ai/sdk'`
- [ ] Singleton client : instancie une seule fois, reutilise entre les appels
- [ ] Cle API lue via `process.env['ANTHROPIC_API_KEY']` (bracket notation obligatoire -- pre-commit hook)
- [ ] Si cle absente : throw `ClaudeError('ANTHROPIC_API_KEY is not set...', 0)` immediatement (pas de retry)

**AC3 -- Classe `ClaudeError`**

- [ ] `export class ClaudeError extends Error` avec `public readonly status: number`
- [ ] Pattern identique a `FinnhubError` dans `src/lib/finnhub.ts`
- [ ] `this.name = 'ClaudeError'`

**AC4 -- Fonction `generateBriefing(systemPrompt: string, userContent: string): Promise<string>`**

- [ ] Appel `client.messages.create()` avec :
  - `model: 'claude-opus-4-20250514'` (Claude Opus 4.6 -- modele FR generation)
  - `max_tokens: 2048` (controle de cout explicite)
  - `system: systemPrompt` (le prompt systeme du Chartiste Lettre, Story 2.9)
  - `messages: [{ role: 'user', content: userContent }]`
- [ ] Extraction du texte de la reponse : `response.content[0].text` (premier block type `text`)
- [ ] Si le premier block n'est pas de type `text` : throw `ClaudeError`
- [ ] Log structurel JSON sur stderr avec tokens utilises : `{ input_tokens, output_tokens }`
- [ ] Retourne la string brute (le parsing JSON est la responsabilite de `generate-ai.ts`)

**AC5 -- Fonction `translateToEN(frenchText: string): Promise<string>`**

- [ ] Appel `client.messages.create()` avec :
  - `model: 'claude-haiku-4-5-20250514'` (Claude Haiku 4.5 -- modele traduction EN)
  - `max_tokens: 2048`
  - `system: 'You are a professional financial translator. Translate the following French text to English. Preserve the tone, financial terminology, and formatting. Return only the translated text.'`
  - `messages: [{ role: 'user', content: frenchText }]`
- [ ] Meme extraction texte et logging que `generateBriefing`
- [ ] Retourne la traduction EN brute

**AC6 -- Retry avec backoff (pattern finnhub.ts)**

- [ ] Fonction `withRetry<T>(fn, context)` interne -- meme pattern que `finnhub.ts`
- [ ] `RETRY_DELAYS_MS = [1000, 2000, 4000]` (3 tentatives)
- [ ] Retry sur 429 (rate limit) et 5xx (erreur serveur)
- [ ] PAS de retry sur 4xx (sauf 429) : 400, 401, 403 = throw immediat
- [ ] PAS de retry sur status 0 (cle manquante) : throw immediat
- [ ] Log structurel JSON sur stderr a chaque retry : `{ level: 'warn', msg: 'Claude retry', attempt, model, status, error }`

**AC7 -- Log structure JSON (stderr)**

- [ ] Tous les logs via `console.error(JSON.stringify({...}))` -- jamais stdout
- [ ] Log au debut de chaque appel : `{ level: 'info', msg: 'claude call start', model, max_tokens }`
- [ ] Log apres succes : `{ level: 'info', msg: 'claude call ok', model, input_tokens, output_tokens }`
- [ ] Log d'erreur : `{ level: 'error', msg: 'claude call failed', model, status, error, timestamp }`

**AC8 -- Tests Vitest avec SDK mocke**

- [ ] `src/lib/__tests__/claude.test.ts` cree
- [ ] Mock du module `@anthropic-ai/sdk` -- NE PAS appeler l'API reelle
- [ ] Test `generateBriefing` : appel reussi, verifie model + max_tokens + system prompt + retour texte
- [ ] Test `translateToEN` : appel reussi, verifie model Haiku + retour traduction
- [ ] Test cle manquante : throw `ClaudeError` status 0, pas de retry
- [ ] Test retry 429 : retry 3x puis succes
- [ ] Test retry 500 : retry 3x puis succes
- [ ] Test no retry 400 : throw immediat, 1 seul appel
- [ ] Test no retry 401 : throw immediat, 1 seul appel
- [ ] Test echec apres 3 retries : throw `ClaudeError`
- [ ] Test logging tokens : verifie que `input_tokens` et `output_tokens` sont logues
- [ ] `pnpm test` passe sans erreurs

**AC9 -- Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.8): add Claude API client with Opus/Haiku wrapper`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Installer le SDK Anthropic (AC1)
  - [ ] `pnpm add @anthropic-ai/sdk`
  - [ ] Verifier `package.json` contient le package dans `dependencies`

- [ ] **Task 2** -- Creer `src/lib/claude.ts` (AC2-AC7)
  - [ ] Classe `ClaudeError` (extends Error, status: number)
  - [ ] Constante `RETRY_DELAYS_MS = [1000, 2000, 4000]`
  - [ ] Fonction `log(level, msg, extra)` -- pattern identique a `finnhub.ts` stderr JSON
  - [ ] Fonction `withRetry<T>(fn, context)` -- copier le pattern exact de `finnhub.ts`
  - [ ] Fonction `getClient(): Anthropic` -- singleton, verifie cle API
  - [ ] Fonction `generateBriefing(systemPrompt, userContent): Promise<string>`
  - [ ] Fonction `translateToEN(frenchText): Promise<string>`
  - [ ] Exports : `ClaudeError`, `generateBriefing`, `translateToEN`

- [ ] **Task 3** -- Creer les tests Vitest (AC8)
  - [ ] `src/lib/__tests__/claude.test.ts`
  - [ ] Mock complet du SDK `@anthropic-ai/sdk`
  - [ ] Tests succes (generateBriefing, translateToEN)
  - [ ] Tests erreur (cle manquante, 400, 401, 429, 500, echec 3 retries)
  - [ ] Tests logging tokens
  - [ ] `pnpm test` passe

- [ ] **Task 4** -- Git commit : `feat(story-2.8): add Claude API client with Opus/Haiku wrapper`

- [ ] **Task 5** -- Update story -> status review

---

## Dev Notes

### Architecture : strategie Opus + Haiku (2 appels sequentiels)

L'architecture (section 3.7) specifie : "Opus -> Haiku -> 2 appels sequentiels dans le pipeline (pas 1 seul appel bilingue)". Le premier appel (Opus) genere le briefing FR complet (briefing + tagline + metadata en JSON). Le second appel (Haiku) traduit uniquement les champs textuels en EN. La separation est motivee par le cout : Haiku est ~60x moins cher que Opus par token.

**Important** : ce module ne fait PAS le parsing JSON de la reponse Opus. Il retourne la string brute. Le parsing/validation Zod est la responsabilite de `generate-ai.ts` (Story 2.10).

### Pattern `withRetry` (copier de finnhub.ts)

```typescript
const RETRY_DELAYS_MS = [1000, 2000, 4000];

async function withRetry<T>(
  fn: () => Promise<T>,
  context: { model: string },
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const error = err as ClaudeError;
      // No retry on configuration errors (status 0 = missing key)
      if (error.status === 0) throw error;
      // No retry on 4xx except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      lastError = error;
      log('warn', 'Claude retry', {
        attempt,
        model: context.model,
        status: error.status ?? null,
        error: error.message,
      });
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]));
      }
    }
  }

  throw lastError!;
}
```

### Pattern `ClaudeError` (identique a FinnhubError)

```typescript
export class ClaudeError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ClaudeError';
  }
}
```

### Pattern singleton client + lecture cle API

```typescript
import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;

  const key = process.env['ANTHROPIC_API_KEY'];
  if (!key) {
    throw new ClaudeError(
      'ANTHROPIC_API_KEY is not set. Add it to your environment variables.',
      0,
    );
  }

  _client = new Anthropic({ apiKey: key });
  return _client;
}
```

### Pattern `generateBriefing`

```typescript
export async function generateBriefing(
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const model = 'claude-opus-4-20250514';
  const maxTokens = 2048;

  log('info', 'claude call start', { model, max_tokens: maxTokens });

  const response = await withRetry(
    async () => {
      const client = getClient();
      const res = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      });
      return res;
    },
    { model },
  );

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new ClaudeError(
      `Unexpected response block type: ${block?.type ?? 'empty'}`,
      0,
    );
  }

  log('info', 'claude call ok', {
    model,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });

  return block.text;
}
```

### Pattern `translateToEN`

```typescript
export async function translateToEN(frenchText: string): Promise<string> {
  const model = 'claude-haiku-4-5-20250514';
  const maxTokens = 2048;

  log('info', 'claude call start', { model, max_tokens: maxTokens });

  const response = await withRetry(
    async () => {
      const client = getClient();
      const res = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system:
          'You are a professional financial translator. Translate the following French text to English. Preserve the tone, financial terminology, and formatting. Return only the translated text.',
        messages: [{ role: 'user', content: frenchText }],
      });
      return res;
    },
    { model },
  );

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new ClaudeError(
      `Unexpected response block type: ${block?.type ?? 'empty'}`,
      0,
    );
  }

  log('info', 'claude call ok', {
    model,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });

  return block.text;
}
```

### Pattern log structure JSON (stderr)

```typescript
function log(level: string, msg: string, extra?: Record<string, unknown>): void {
  console.error(JSON.stringify({ level, msg, ...extra }));
}
```

### Gestion des erreurs SDK Anthropic

Le SDK `@anthropic-ai/sdk` throw des erreurs de type `Anthropic.APIError` qui ont un champ `status`. Il faut catcher ces erreurs et les convertir en `ClaudeError` :

```typescript
import Anthropic from '@anthropic-ai/sdk';

// Dans withRetry, le fn() doit catcher les erreurs SDK :
async () => {
  try {
    const res = await client.messages.create({...});
    return res;
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      throw new ClaudeError(
        `Claude API ${err.status}: ${err.message}`,
        err.status,
      );
    }
    throw new ClaudeError(String(err), 0);
  }
}
```

**Important** : cette conversion doit se faire DANS le `fn()` passe a `withRetry`, pour que `withRetry` puisse lire le `status` de `ClaudeError` et decider du retry.

### Pattern tests (mock SDK)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock le module SDK
vi.mock('@anthropic-ai/sdk', () => {
  const MockAnthropic = vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn(),
    },
  }));
  // Ajouter la classe APIError pour les tests d'erreur
  MockAnthropic.APIError = class APIError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = 'APIError';
    }
  };
  return { default: MockAnthropic };
});

import Anthropic from '@anthropic-ai/sdk';
import { generateBriefing, translateToEN, ClaudeError } from '../claude';

function makeResponse(text: string, inputTokens = 100, outputTokens = 200) {
  return {
    content: [{ type: 'text', text }],
    usage: { input_tokens: inputTokens, output_tokens: outputTokens },
  };
}

beforeEach(() => {
  process.env['ANTHROPIC_API_KEY'] = 'test-key';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  delete process.env['ANTHROPIC_API_KEY'];
});
```

### Contraintes importantes

1. **Bracket notation** : `process.env['ANTHROPIC_API_KEY']` -- obligatoire, pre-commit hook bloque `process.env.ANTHROPIC_API_KEY`
2. **Jamais stdout** pour les logs -- uniquement `console.error(JSON.stringify(...))` (stderr)
3. **`max_tokens: 2048`** explicite a chaque appel -- controle de cout, decision architecture (NFR13)
4. **Models exacts** : `claude-opus-4-20250514` pour FR, `claude-haiku-4-5-20250514` pour EN -- cf. architecture Decision 3
5. **Pas de parsing JSON** dans ce module -- retourne la string brute, le parsing est dans `generate-ai.ts` (Story 2.10)
6. **Singleton client** -- evite de re-instancier le SDK a chaque appel (performance + best practice SDK)
7. **`ClaudeError.status`** doit etre un number pour que `withRetry` puisse checker `>= 400 && < 500`

### Anti-patterns

1. **NE PAS** utiliser `process.env.ANTHROPIC_API_KEY` (dot notation) -- pre-commit hook le bloque
2. **NE PAS** parser le JSON de la reponse Opus dans ce module -- c'est la responsabilite de Story 2.10
3. **NE PAS** creer de types pour la structure du briefing ici -- les schemas Zod sont dans `src/lib/schemas/analysis.ts`
4. **NE PAS** retrier sur 400/401/403 -- erreurs de configuration, pas transitoires
5. **NE PAS** logger les tokens sur stdout -- stderr uniquement
6. **NE PAS** hardcoder la cle API ou un fallback -- throw si absente
7. **NE PAS** importer ce module depuis le frontend Next.js -- c'est un module pipeline uniquement
8. **NE PAS** utiliser le SDK Vercel AI (`@ai-sdk/anthropic`) -- le projet utilise le SDK officiel `@anthropic-ai/sdk`

### Arborescence fichiers

```
src/
  lib/
    claude.ts                  <- NEW (cette story)
    finnhub.ts                 <- existant (reference pattern retry + error)
    fred.ts                    <- existant (reference pattern error class)
    schemas/
      analysis.ts              <- existant (consommateur en Story 2.10)
      alert.ts                 <- existant
    __tests__/
      claude.test.ts           <- NEW (cette story)
      finnhub.test.ts          <- existant (reference pattern tests mock)
      fred.test.ts             <- existant
```

### Modeles Claude -- identifiants exacts

| Usage | Modele | ID API exact | Justification |
|-------|--------|-------------|---------------|
| Generation FR (briefing + tagline + metadata) | Claude Opus 4.6 | `claude-opus-4-20250514` | Qualite editoriale maximale pour le contenu principal |
| Traduction EN | Claude Haiku 4.5 | `claude-haiku-4-5-20250514` | ~60x moins cher, suffisant pour de la traduction |

### Cout estime par run quotidien

- Opus : ~1500 input tokens + ~800 output tokens = ~$0.04/run
- Haiku : ~500 input tokens + ~400 output tokens = ~$0.001/run
- Total : ~$0.041/run x 30 jours = ~$1.23/mois (bien sous le budget ~5 EUR/mois)

### References existantes

- `src/lib/finnhub.ts` -- `FinnhubError`, `withRetry()`, `RETRY_DELAYS_MS`, pattern bracket notation, log stderr (Story 2.2) [Source: src/lib/finnhub.ts]
- `src/lib/fred.ts` -- `FredError` pattern identique (Story 2.3) [Source: src/lib/fred.ts]
- `src/lib/__tests__/finnhub.test.ts` -- Pattern mock `fetch`, `vi.useFakeTimers`, `beforeEach`/`afterEach` (Story 2.2) [Source: src/lib/__tests__/finnhub.test.ts]
- `src/lib/schemas/analysis.ts` -- `AnalysisSchema` avec `briefing: BilingualStringSchema` (Story 2.1) [Source: src/lib/schemas/analysis.ts]
- `docs/planning-artifacts/architecture.md` -- Section 3.1 Decision Priority "Opus+Haiku", Section 3.4 pipeline sequentiel step 3, Section 3.7 "2 appels sequentiels", Section 5.2 `"@anthropic-ai/sdk": "^0.30.x"`, Risk A1 "monitoring cout Anthropic" [Source: docs/planning-artifacts/architecture.md]
- `docs/planning-artifacts/prd.md` -- NFR13 "Claude API (~5 EUR)" [Source: docs/planning-artifacts/prd.md]
- `.env.example` -- `ANTHROPIC_API_KEY=your_anthropic_api_key_here` deja present [Source: .env.example]

### Intelligence Story precedente (2.7)

- Pattern `withRetry` dans `finnhub.ts` fonctionne bien -- copier et adapter pour le SDK (le SDK throw `Anthropic.APIError` au lieu de `FinnhubError`)
- Bracket notation `process.env['KEY']` rigoureusement appliquee dans toutes les stories precedentes
- Log structure JSON stderr est le pattern standard du pipeline -- coherent dans fetch-data.ts, compute-alert.ts, finnhub.ts, fred.ts
- Les tests utilisent `vi.useFakeTimers()` + `vi.runAllTimersAsync()` pour les retry delays (pattern valide de finnhub.test.ts)
- Les mocks de modules externes se font via `vi.mock('module-name')` au top-level du fichier test

### Note sur la version SDK

L'architecture specifie `^0.30.x`. La derniere version disponible est `0.88.0` (npm, avril 2026). Le caret `^0.30.x` autorise toute version `>= 0.30.0 < 1.0.0`, donc `0.88.0` est compatible. Utiliser la derniere version stable lors de `pnpm add @anthropic-ai/sdk` (pas de pinning strict necessaire).

L'API `client.messages.create()` est stable depuis v0.20+ et la structure de reponse `{ content: [{ type: 'text', text: string }], usage: { input_tokens, output_tokens } }` n'a pas change.

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
- `src/lib/claude.ts`
- `src/lib/__tests__/claude.test.ts`

**Fichiers modifies :**
- `package.json` -- ajout `@anthropic-ai/sdk` dans dependencies
- `pnpm-lock.yaml` -- mis a jour automatiquement
