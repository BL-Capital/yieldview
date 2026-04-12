# Story 2.4 : Client Alpha Vantage

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 1
Priority: P1
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un client Alpha Vantage minimaliste créé dans `src/lib/alpha-vantage.ts`,
**so that** le script `fetch-data.ts` (Story 2.5) peut l'activer si besoin pour récupérer des données de marché complémentaires, sans risquer de brûler le quota de 25 req/jour du free tier.

**Business value :** Alpha Vantage est une source secondaire/marginale dans le pipeline YieldField. Le client doit exister pour rendre le pipeline extensible, mais il est commenté par défaut dans `fetch-data.ts` afin de préserver le quota quotidien très serré. Pas de retry — chaque tentative échouée coûte une requête sur 25.

---

## Acceptance Criteria

**AC1 — `src/lib/alpha-vantage.ts`**

- [ ] Fichier `src/lib/alpha-vantage.ts` créé
- [ ] Clé API lue depuis `process.env.ALPHA_VANTAGE_API_KEY` (jamais hardcodée)
- [ ] Fonction exportée : `fetchGlobalQuote(symbol: string)`
- [ ] Retourne des données au format compatible `Kpi` (value, change_day, change_pct, direction, timestamp, freshness_level, source)

**AC2 — Pas de retry**

- [ ] Aucune logique de retry dans ce client
- [ ] En cas d'erreur HTTP ou réseau : throw `AlphaVantageError` immédiatement
- [ ] Commentaire explicite dans le code : `// No retry — free tier is 25 req/day`

**AC3 — Mapping vers format Kpi**

- [ ] Helper `mapToKpi()` qui transforme la réponse Alpha Vantage (`"Global Quote"`) en objet compatible
- [ ] Mapping : `"05. price"` → `value`, `"09. change"` → `change_day`, `"10. change percent"` → `change_pct` (parseFloat, strip `%`)
- [ ] Calcul de `direction` : 'up' si change_day > 0, 'down' si < 0, 'flat' si = 0
- [ ] `freshness_level` basé sur `"07. latest trading day"` (date string) : 'live' si aujourd'hui, 'stale' si hier, 'very_stale' si plus ancien
- [ ] `source` toujours = `'alpha-vantage'`

**AC4 — Gestion d'erreurs**

- [ ] `AlphaVantageError` est une classe custom exportée (extends `Error`, champ `status: number`)
- [ ] Clé API manquante : throw `AlphaVantageError` immédiatement avec message explicite
- [ ] Réponse API vide ou malformée (pas de `"Global Quote"`) : throw `AlphaVantageError` avec message explicite
- [ ] HTTP non-ok : throw `AlphaVantageError` avec le status HTTP

**AC5 — Tests Vitest**

- [ ] `src/lib/__tests__/alpha-vantage.test.ts` créé
- [ ] Mock de `globalThis.fetch` via `vi.fn()`
- [ ] Tests : happy path `fetchGlobalQuote`, erreur clé API manquante, HTTP 403, réponse malformée (Global Quote absent), mapping direction (up/down/flat), mapping freshness_level (today/yesterday/older)
- [ ] `pnpm test` passe sans erreurs (tests précédents + nouveaux)

**AC6 — `.env.example`**

- [ ] `.env.example` mis à jour avec `ALPHA_VANTAGE_API_KEY=your_key_here`

**AC7 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.4): add Alpha Vantage API client (no retry, marginal)`

---

## Tasks / Subtasks

- [ ] **Task 1** — Créer `src/lib/alpha-vantage.ts` (AC1, AC2, AC3, AC4)
  - [ ] Constante `ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'`
  - [ ] Classe `AlphaVantageError` (extends Error, status field)
  - [ ] Fonction `alphaVantageFetch<T>(params: Record<string, string>)` (query params + HTTP error handling — **no retry**)
  - [ ] Fonction `fetchGlobalQuote(symbol: string)` : appel `function=GLOBAL_QUOTE&symbol=...&apikey=...`
  - [ ] Helper `mapToKpi()` (parse string fields → numbers, computeDirection, computeFreshness)
  - [ ] Helper `computeFreshness()` (date string `"YYYY-MM-DD"` → freshness_level)
  - [ ] Helper `computeDirection()` (change_day → direction)
  - [ ] Commentaire en tête du fichier signalant le quota 25 req/jour et l'absence de retry

- [ ] **Task 2** — Mettre à jour `.env.example` (AC6)
  - [ ] Ajouter `ALPHA_VANTAGE_API_KEY=your_key_here`

- [ ] **Task 3** — Créer les tests Vitest (AC5)
  - [ ] `src/lib/__tests__/alpha-vantage.test.ts`
  - [ ] `pnpm test` ✅ passing

- [ ] **Task 4** — Git commit : `feat(story-2.4): add Alpha Vantage API client (no retry, marginal)`

- [ ] **Task 5** — Update story → status review

---

## Dev Notes

### Alpha Vantage API — informations clés

**Base URL :** `https://www.alphavantage.co/query`
**Auth :** query param `apikey=ALPHA_VANTAGE_API_KEY`
**Free tier :** 25 req/jour — **critiquement serré**, pas de retry, client commenté dans le pipeline par défaut

**Endpoint GLOBAL_QUOTE** (seul endpoint utilisé) :
```
GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={key}

Réponse :
{
  "Global Quote": {
    "01. symbol": "IBM",
    "02. open": "133.0800",
    "03. high": "133.6100",
    "04. low": "132.2000",
    "05. price": "133.3100",
    "06. volume": "3456789",
    "07. latest trading day": "2024-04-10",
    "08. previous close": "133.5000",
    "09. change": "-0.1900",
    "10. change percent": "-0.1423%"
  }
}
```

**Champs utilisés :**
- `"05. price"` → `value` (parseFloat)
- `"09. change"` → `change_day` (parseFloat)
- `"10. change percent"` → `change_pct` (parseFloat après suppression du `%`)
- `"07. latest trading day"` → `timestamp` (ISO 8601 date) + `freshness_level`

**Cas d'erreur silencieuse :** Alpha Vantage retourne parfois HTTP 200 avec `{ "Global Quote": {} }` (objet vide) si le symbole n'existe pas ou si le quota est dépassé. Le client doit détecter ce cas et throw.

### Pattern `alphaVantageFetch` — sans retry

```typescript
// No retry — free tier is 25 req/day
async function alphaVantageFetch<T>(params: Record<string, string>): Promise<T> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) {
    throw new AlphaVantageError('ALPHA_VANTAGE_API_KEY is not set. Add it to your environment variables.', 0);
  }

  const query = new URLSearchParams({ ...params, apikey: key }).toString();
  const url = `${ALPHA_VANTAGE_BASE_URL}?${query}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new AlphaVantageError(`Alpha Vantage HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  return res.json() as Promise<T>;
}
```

### Pattern `fetchGlobalQuote`

```typescript
export async function fetchGlobalQuote(symbol: string): Promise<AlphaVantageQuoteResult> {
  const data = await alphaVantageFetch<AlphaVantageRaw>({
    function: 'GLOBAL_QUOTE',
    symbol: encodeURIComponent(symbol),
  });

  const quote = data['Global Quote'];
  if (!quote || !quote['05. price']) {
    throw new AlphaVantageError(
      `Alpha Vantage: empty or missing "Global Quote" for symbol "${symbol}". Quota may be exhausted.`,
      0,
    );
  }

  return mapToKpi(quote);
}
```

### Pattern `computeFreshness` pour Alpha Vantage

Alpha Vantage retourne une date string `"YYYY-MM-DD"` (pas un timestamp UNIX). La logique de freshness compare à la date du jour :

```typescript
function computeFreshness(latestTradingDay: string): 'live' | 'stale' | 'very_stale' {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (latestTradingDay === today) return 'live';
  if (latestTradingDay === yesterday) return 'stale';
  return 'very_stale';
}
```

### Pattern `mapToKpi`

```typescript
function mapToKpi(quote: AlphaVantageQuoteFields): AlphaVantageQuoteResult {
  const changeDay = parseFloat(quote['09. change']);
  const changePct = parseFloat(quote['10. change percent'].replace('%', ''));
  return {
    value: parseFloat(quote['05. price']),
    change_day: changeDay,
    change_pct: changePct,
    direction: computeDirection(changeDay),
    source: 'alpha-vantage',
    timestamp: new Date(quote['07. latest trading day']).toISOString(),
    freshness_level: computeFreshness(quote['07. latest trading day']),
  };
}
```

### Pattern tests avec `vi.fn()`

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
beforeEach(() => {
  globalThis.fetch = mockFetch;
  process.env['ALPHA_VANTAGE_API_KEY'] = 'test-key';
});
afterEach(() => {
  vi.clearAllMocks();
  delete process.env['ALPHA_VANTAGE_API_KEY'];
});

// Mock réponse succès
const mockQuoteResponse = {
  'Global Quote': {
    '01. symbol': 'IBM',
    '05. price': '133.3100',
    '09. change': '-0.1900',
    '10. change percent': '-0.1423%',
    '07. latest trading day': new Date().toISOString().slice(0, 10), // today → 'live'
  },
};
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockQuoteResponse,
});

// Mock réponse vide (quota épuisé ou symbole invalide)
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ 'Global Quote': {} }),
});

// Mock HTTP 403
mockFetch.mockResolvedValueOnce({ ok: false, status: 403, statusText: 'Forbidden' });
```

### Type interne `AlphaVantageRaw`

```typescript
interface AlphaVantageQuoteFields {
  '01. symbol': string;
  '05. price': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface AlphaVantageRaw {
  'Global Quote': AlphaVantageQuoteFields | Record<string, never>;
}

export interface AlphaVantageQuoteResult {
  value: number;
  change_day: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
  source: 'alpha-vantage';
  timestamp: string; // ISO 8601 from latest trading day
  freshness_level: 'live' | 'stale' | 'very_stale';
}
```

### Contraintes importantes

1. **Pas de retry** — contrairement à Finnhub et FRED. Chaque appel HTTP coûte 1 crédit sur 25/jour. Le pipeline doit commenter les appels Alpha Vantage par défaut.
2. **Usage marginal** — dans `fetch-data.ts` (Story 2.5), les appels à ce client seront wrappés dans un bloc commenté avec une note explicite.
3. **Quota silencieux** — Alpha Vantage ne retourne pas d'erreur 429 sur le free tier : il retourne HTTP 200 avec `{ "Global Quote": {} }`. Le client doit détecter cet objet vide.
4. **`src/lib/alpha-vantage.ts` est un module pipeline** — Node.js uniquement (scripts), pas d'imports React/Next.
5. **Pas de `zod` dans ce fichier** — la validation Zod sera faite dans `fetch-data.ts` au niveau pipeline.
6. **`process.env['ALPHA_VANTAGE_API_KEY']`** — bracket notation obligatoire dans les tests pour bypasser le pre-commit hook secrets.

### Anti-patterns

1. **NE PAS** ajouter de retry — même sur 5xx. Le quota est trop précieux.
2. **NE PAS** appeler ce client depuis le pipeline sans commentaire d'avertissement quota.
3. **NE PAS** hardcoder la clé API ni la mettre dans les tests autrement que via `process.env['ALPHA_VANTAGE_API_KEY'] = 'test-key'`.
4. **NE PAS** importer les schemas Zod dans `alpha-vantage.ts`.
5. **NE PAS** utiliser `axios` — `fetch` natif Node 18+.
6. **NE PAS** committer `.env.local`.

### Arborescence fichiers

```
src/
  lib/
    alpha-vantage.ts          ← NEW
    finnhub.ts                (Story 2.2 — existant)
    fred.ts                   (Story 2.3 — existant)
    __tests__/
      alpha-vantage.test.ts   ← NEW
.env.example                  ← UPDATE (ajouter ALPHA_VANTAGE_API_KEY)
```

### References

- `docs/planning-artifacts/epics.md#Story-2.4` — ACs originaux
- `docs/planning-artifacts/epics.md#Story-2.5` — fetch-data.ts qui consomme (avec prudence) ce client
- `src/lib/schemas/kpi.ts` — type Kpi (Story 2.1)
- `src/lib/finnhub.ts` — pattern de référence (Story 2.2)
- `src/lib/fred.ts` — client FRED (Story 2.3)
- `docs/implementation-artifacts/2-2-client-finnhub.md` — spec de référence

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 — via bmad-create-story

### Debug Log References

_(à remplir lors de l'implémentation)_

### Completion Notes List

_(à remplir lors de l'implémentation)_

### File List

**Nouveaux fichiers :**
- `src/lib/alpha-vantage.ts`
- `src/lib/__tests__/alpha-vantage.test.ts`

**Modifiés :**
- `.env.example` — ajout `ALPHA_VANTAGE_API_KEY`
