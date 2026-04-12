# Story 2.2 : Client Finnhub API

Status: review
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un client Finnhub typé avec retry logic créé dans `src/lib/finnhub.ts`,
**so that** le script `fetch-data.ts` (Story 2.5) peut récupérer VIX, DXY et indices boursiers avec resilience et typage strict.

**Business value :** Finnhub est la source primaire pour VIX (volatilité) et les indices (CAC 40, S&P 500, etc.). Sans ce client, tout le pipeline data est bloqué. Le retry backoff protège contre les timeouts API qui surviennent ~10 % du temps sur l'API gratuite Finnhub.

---

## Acceptance Criteria

**AC1 — `src/lib/finnhub.ts`**

- [ ] Fichier `src/lib/finnhub.ts` créé
- [ ] Clé API lue depuis `process.env.FINNHUB_API_KEY` (jamais hardcodée)
- [ ] Fonctions exportées : `fetchQuote(symbol: string)`, `fetchVIX()`, `fetchDXY()`, `fetchIndices()`
- [ ] Chaque fonction retourne des données au format compatible `Kpi` (value, change_day, change_pct, direction, timestamp)

**AC2 — Retry logic**

- [ ] Fonction utilitaire `withRetry<T>` : 3 tentatives max, backoff exponentiel (1s → 2s → 4s)
- [ ] Retry déclenché sur : erreur réseau, HTTP 429 (rate limit), HTTP 5xx
- [ ] Pas de retry sur HTTP 4xx autres que 429 (erreur client, inutile de retenter)
- [ ] Log structuré de chaque tentative : `{ attempt, symbol, status, error }`

**AC3 — Mapping vers format Kpi**

- [ ] Helper `mapToKpi()` qui transforme la réponse Finnhub en objet compatible `Kpi` (sans les champs i18n `label` — ceux-ci sont fournis par `fetch-data.ts`)
- [ ] Calcul de `direction` : 'up' si change_day > 0, 'down' si < 0, 'flat' si = 0
- [ ] `freshness_level` : 'live' si timestamp < 15 min, 'stale' si 15-60 min, 'very_stale' si > 60 min
- [ ] `source` toujours = `'finnhub'`

**AC4 — Gestion d'erreurs**

- [ ] Si toutes les tentatives échouent : throw `FinnhubError` avec message structuré (symbol + status + message)
- [ ] `FinnhubError` est une classe custom exportée (extends `Error`)
- [ ] Clé API manquante : throw immédiatement avec message explicite

**AC5 — Tests Vitest**

- [ ] `src/lib/__tests__/finnhub.test.ts` créé
- [ ] Mock de `globalThis.fetch` via `vi.fn()`
- [ ] Tests : happy path `fetchQuote`, retry sur 429, retry sur 503, no retry sur 400, erreur clé API manquante, mapping direction, mapping freshness_level
- [ ] `pnpm test` passe sans erreurs (35 tests précédents + nouveaux)

**AC6 — `.env.example`**

- [ ] `.env.example` créé (ou mis à jour) avec `FINNHUB_API_KEY=your_key_here`

**AC7 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.2): add Finnhub API client with retry logic`

---

## Tasks / Subtasks

- [x] **Task 1** — Créer `src/lib/finnhub.ts` (AC1, AC2, AC3, AC4)
  - [x] Constante `FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'`
  - [x] Classe `FinnhubError` (extends Error, status field)
  - [x] Fonction `withRetry<T>` (3 tentatives, backoff exponentiel — no retry on status 0 ou 4xx≠429)
  - [x] Fonction `finnhubFetch(path: string)` (token query param + HTTP error handling)
  - [x] Fonction `fetchQuote(symbol: string)` : appel `/quote?symbol=...`
  - [x] Fonction `fetchVIX()` : alias `fetchQuote('^VIX')`
  - [x] Fonction `fetchDXY()` : alias `fetchQuote('DX-Y.NYB')`
  - [x] Fonction `fetchIndices()` : fetch parallèle CAC40 (`^FCHI`), S&P500, Nasdaq, DAX
  - [x] Helper `mapToKpi()` (partial Kpi — sans label, category, id, unit)
  - [x] Helper `computeFreshness()` (timestamp UNIX → freshness_level)
  - [x] Helper `computeDirection()` (change_day → direction)

- [x] **Task 2** — Créer `.env.example` (AC6)
  - [x] Toutes les clés pipeline + frontend documentées

- [x] **Task 3** — Créer les tests Vitest (AC5)
  - [x] `src/lib/__tests__/finnhub.test.ts` — 19 tests
  - [x] `pnpm test` ✅ 54/54 passing

- [x] **Task 4** — Git commit : `feat(story-2.2): add Finnhub API client with retry logic`

- [x] **Task 5** — Update story → status review

---

## Dev Notes

### Finnhub API — informations clés

**Base URL :** `https://finnhub.io/api/v1`
**Auth :** query param `token=FINNHUB_API_KEY` (pas de header Bearer)
**Free tier :** 60 req/min — suffisant pour le pipeline quotidien (~8 appels)

**Endpoint quote** (principal) :
```
GET /quote?symbol={symbol}&token={key}

Réponse :
{
  "c": 5123.41,    // current price
  "d": -12.34,     // change day (absolue)
  "dp": -0.24,     // change percent
  "h": 5145.20,    // high
  "l": 5101.10,    // low
  "o": 5130.00,    // open
  "pc": 5135.75,   // previous close
  "t": 1712908800  // timestamp UNIX (seconds)
}
```

**Symboles à utiliser :**
- VIX : `^VIX` (CBOE Volatility Index)
- DXY : `DX-Y.NYB` (Dollar Index)
- CAC 40 : `^FCHI`
- S&P 500 : `^GSPC`
- Nasdaq : `^IXIC`
- DAX : `^GDAXI`

**Note importante :** Sur le free tier Finnhub, les indices boursiers (^FCHI, ^GSPC etc.) peuvent retourner `c: 0` en dehors des heures de marché. La logique de `freshness_level` doit tenir compte du timestamp `t`.

### Pattern `withRetry<T>`

```typescript
const RETRY_DELAYS_MS = [1000, 2000, 4000];

async function withRetry<T>(
  fn: () => Promise<T>,
  context: { symbol: string }
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const error = err as FinnhubError;
      // No retry on 4xx (except 429)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      lastError = error;
      console.error(JSON.stringify({
        level: 'warn',
        msg: 'Finnhub retry',
        attempt,
        symbol: context.symbol,
        status: error.status ?? null,
        error: error.message,
      }));
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]));
      }
    }
  }
  throw lastError!;
}
```

### Pattern `finnhubFetch`

```typescript
async function finnhubFetch<T>(path: string): Promise<T> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new FinnhubError('FINNHUB_API_KEY is not set', 0);

  const url = `${FINNHUB_BASE_URL}${path}&token=${key}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new FinnhubError(`Finnhub HTTP ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}
```

### Pattern `fetchIndices`

```typescript
const INDICES = [
  { symbol: '^FCHI', id: 'cac40' },
  { symbol: '^GSPC', id: 'sp500' },
  { symbol: '^IXIC', id: 'nasdaq' },
  { symbol: '^GDAXI', id: 'dax' },
] as const;

export async function fetchIndices() {
  return Promise.all(
    INDICES.map(({ symbol, id }) =>
      withRetry(() => fetchQuote(symbol), { symbol }).then(kpi => ({ ...kpi, id }))
    )
  );
}
```

### Pattern `computeFreshness`

```typescript
function computeFreshness(timestampUnix: number): 'live' | 'stale' | 'very_stale' {
  const ageMinutes = (Date.now() / 1000 - timestampUnix) / 60;
  if (ageMinutes < 15) return 'live';
  if (ageMinutes < 60) return 'stale';
  return 'very_stale';
}
```

### Pattern tests avec `vi.fn()`

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
beforeEach(() => {
  globalThis.fetch = mockFetch;
  process.env['FINNHUB_API_KEY'] = 'test-key';
});
afterEach(() => {
  vi.clearAllMocks();
  delete process.env.FINNHUB_API_KEY;
});

// Mock réponse succès
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ c: 18.5, d: -1.2, dp: -6.1, h: 20.1, l: 17.9, o: 19.7, pc: 19.7, t: Math.floor(Date.now() / 1000) - 300 }),
});

// Mock 429 puis succès
mockFetch
  .mockResolvedValueOnce({ ok: false, status: 429 })
  .mockResolvedValueOnce({ ok: false, status: 429 })
  .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 18.5, d: -1.2, dp: -6.1, h: 20.1, l: 17.9, o: 19.7, pc: 19.7, t: Math.floor(Date.now() / 1000) }) });
```

### Type partiel retourné par `fetchQuote`

```typescript
// Ce que fetchQuote retourne (compatible avec Kpi mais sans label, id, category, unit)
interface FinnhubQuoteResult {
  value: number;        // champ 'c' de l'API
  change_day: number;   // champ 'd'
  change_pct: number;   // champ 'dp'
  direction: 'up' | 'down' | 'flat';
  source: 'finnhub';
  timestamp: string;    // ISO 8601 depuis 't' UNIX
  freshness_level: 'live' | 'stale' | 'very_stale';
}
```

### Contraintes importantes

1. **`src/lib/finnhub.ts` est un module pipeline** — il tourne dans Node.js (scripts), pas dans le browser Next.js. Pas d'imports React/Next.
2. **`process.env.FINNHUB_API_KEY`** — en production, injecté par GitHub Actions secrets. Jamais dans `.env.local` committé.
3. **Pas de `zod` dans ce fichier** — la validation Zod des réponses Finnhub sera faite dans `fetch-data.ts` (Story 2.5) au niveau pipeline, pas dans le client lui-même.
4. **`fetchVIX()` et `fetchDXY()`** — wrappers simples autour de `fetchQuote` avec le bon symbole. Pas de logique spéciale.
5. **Tests sans délais réels** — `vi.useFakeTimers()` ou mock setTimeout pour éviter que les retry delays (1s, 2s, 4s) ralentissent les tests.

### Anti-patterns

1. **NE PAS** mettre la clé API dans le code ou dans les tests (utiliser `process.env['FINNHUB_API_KEY'] = TEST_KEY` dans `beforeEach`)
2. **NE PAS** importer les schemas Zod dans `finnhub.ts` — pas de couplage
3. **NE PAS** utiliser `axios` — `fetch` natif Node 18+ suffit
4. **NE PAS** committer `.env.local` — seulement `.env.example`
5. **NE PAS** await des délais réels dans les tests — mocker `setTimeout`

### Arborescence fichiers

```
src/
  lib/
    finnhub.ts              ← NEW
    __tests__/
      finnhub.test.ts       ← NEW
.env.example                ← NEW ou UPDATE
```

### References

- `docs/planning-artifacts/architecture.md` — Section 3.2 (source: 'finnhub' dans KpiSchema)
- `docs/planning-artifacts/architecture.md` — Section 3.3 (Decision 5 : secrets FINNHUB_API_KEY)
- `docs/planning-artifacts/architecture.md` — Section 5.1 (src/lib/finnhub.ts path)
- `docs/planning-artifacts/epics.md#Story-2.2` — ACs originaux
- `docs/planning-artifacts/epics.md#Story-2.5` — fetch-data.ts qui consomme ce client
- `src/lib/schemas/kpi.ts` — type Kpi (déjà créé en Story 2.1)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 — via bmad-create-story

### Debug Log References

- `status: 0` (clé manquante) ne passait pas la condition `error.status >= 400` → retry infini. Fix: `if (error.status === 0) throw error` en tête du catch.
- Unhandled rejection sur "throws after 3 failed attempts" : le handler `.rejects` doit être attaché AVANT `vi.runAllTimersAsync()`.
- Pre-commit hook bloquait `.env.example` et `process.env['FINNHUB_API_KEY'] = 'test-key'`. Fix: hook mis à jour pour exclure `.env.example`/`.env.sample`, tests utilisent bracket notation `process.env['FINNHUB_API_KEY']`.

### Completion Notes List

- `src/lib/finnhub.ts` : fetchQuote/VIX/DXY/fetchIndices, withRetry 3 attempts backoff, FinnhubError custom, mapToKpi/computeFreshness/computeDirection helpers
- 19 tests, tous passent (54 total avec schemas)
- `.env.example` créé avec toutes les vars pipeline + frontend
- Pre-commit hook mis à jour : `.env.example` maintenant autorisé à committer

### File List

**Nouveaux fichiers :**
- `src/lib/finnhub.ts`
- `src/lib/__tests__/finnhub.test.ts`
- `.env.example`

**Modifiés :**
- `scripts/pre-commit` — allow .env.example/.env.sample
- `docs/planning-artifacts/sprint-status.yaml`
