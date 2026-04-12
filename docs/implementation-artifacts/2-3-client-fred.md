# Story 2.3 : Client FRED API

Status: review
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un client FRED typé créé dans `src/lib/fred.ts`,
**so that** le script `fetch-data.ts` (Story 2.5) peut récupérer les taux souverains OAT 10Y, Bund 10Y et US 10Y depuis l'API FRED de la Fed de St. Louis.

**Business value :** Les taux souverains (OAT France, Bund Allemagne, US 10Y) sont les KPIs cœur du briefing YieldField — "la matière première éditoriale". Sans FRED, il est impossible de calculer les spreads OAT-Bund et Bund-US qui sont au centre du récit quotidien. FRED est free tier illimité et fiable (Fed de St. Louis).

---

## Acceptance Criteria

**AC1 — `src/lib/fred.ts`**

- [ ] Fichier `src/lib/fred.ts` créé
- [ ] Clé API lue depuis `process.env.FRED_API_KEY` (jamais hardcodée)
- [ ] Fonctions exportées : `fetchOAT()`, `fetchBund()`, `fetchUS10Y()`
- [ ] Chaque fonction retourne des données au format `FredSeriesResult` (value, change_day, direction, timestamp, freshness_level, source: 'fred')

**AC2 — Séries FRED correctes**

- [ ] OAT France 10Y : série `IRLTLT01FRM156N`
- [ ] Bund Allemagne 10Y : série `IRLTLT01DEM156N`
- [ ] US 10Y : série `DGS10`

**AC3 — Gestion FRED API**

- [ ] Endpoint : `GET /fred/series/observations?series_id={id}&limit=2&sort_order=desc&api_key={key}&file_type=json`
- [ ] Prendre la dernière observation non-nulle (FRED peut retourner "." pour les weekends/jours fériés)
- [ ] Calculer `change_day` = dernière valeur - avant-dernière valeur
- [ ] `freshness_level` basé sur la date de l'observation (FRED donne des dates journalières, pas des timestamps précis) : 'live' si date = aujourd'hui, 'stale' si hier, 'very_stale' si avant-hier ou plus

**AC4 — Gestion d'erreurs**

- [ ] Classe `FredError` exportée (extends Error) avec `status: number`
- [ ] Clé API manquante : throw immédiatement
- [ ] HTTP errors : throw `FredError` avec status
- [ ] Pas de retry (FRED est fiable, free tier illimité — retry ajouté dans fetch-data.ts si besoin)

**AC5 — Tests Vitest**

- [ ] `src/lib/__tests__/fred.test.ts` créé
- [ ] Mock de `globalThis.fetch` via `vi.fn()`
- [ ] Tests : happy path `fetchOAT`, happy path `fetchUS10Y`, FRED retourne "." (weekend), clé manquante, HTTP 400
- [ ] `pnpm test` passe — tous les tests précédents + nouveaux

**AC6 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.3): add FRED API client`

---

## Tasks / Subtasks

- [x] **Task 1** — Créer `src/lib/fred.ts` (AC1, AC2, AC3, AC4)
  - [x] Constante `FRED_BASE_URL = 'https://api.stlouisfed.org/fred'`
  - [x] Classe `FredError` (extends Error, status field)
  - [x] Type `FredSeriesResult` (value, change_day, direction, source, timestamp, freshness_level)
  - [x] Fonction `fredFetch(seriesId: string)` : limit=5 + gestion HTTP errors
  - [x] Fonction `parseObservations()` : filtre "." et valeurs NaN, prend les 2 premières valides
  - [x] Fonction `computeFredFreshness()` : date ISO → freshness_level
  - [x] Fonctions exportées `fetchOAT()`, `fetchBund()`, `fetchUS10Y()` (thin wrappers)

- [x] **Task 2** — Créer les tests Vitest (AC5)
  - [x] `src/lib/__tests__/fred.test.ts` — 16 tests
  - [x] `pnpm test` ✅ 70/70 passing

- [x] **Task 3** — Git commit : `feat(story-2.3): add FRED API client (OAT/Bund/US10Y)`

- [x] **Task 4** — Update story → status review

---

## Dev Notes

### FRED API — informations clés

**Base URL :** `https://api.stlouisfed.org/fred`
**Auth :** query param `api_key=FRED_API_KEY`
**Free tier :** illimité (pas de rate limit documenté en pratique)
**Format :** toujours `file_type=json`

**Endpoint observations :**
```
GET /fred/series/observations
  ?series_id=DGS10
  &limit=2
  &sort_order=desc
  &api_key={key}
  &file_type=json
```

**Réponse exemple :**
```json
{
  "realtime_start": "2026-04-12",
  "realtime_end": "2026-04-12",
  "observation_start": "1600-01-01",
  "observation_end": "9999-12-31",
  "units": "lin",
  "output_type": 1,
  "file_type": "json",
  "order_by": "observation_date",
  "sort_order": "desc",
  "count": 2,
  "offset": 0,
  "limit": 2,
  "observations": [
    { "realtime_start": "2026-04-12", "realtime_end": "2026-04-12", "date": "2026-04-11", "value": "4.38" },
    { "realtime_start": "2026-04-12", "realtime_end": "2026-04-12", "date": "2026-04-10", "value": "4.42" }
  ]
}
```

**Point crucial :** FRED retourne `"."` pour les jours sans données (weekends, jours fériés US). Il faut filtrer ces valeurs et prendre les 2 premières observations valides (numériques).

**Séries à utiliser :**
- OAT France 10Y : `IRLTLT01FRM156N` (mensuelle, BIS via FRED — attention : mise à jour mensuelle !)
- Bund Allemagne 10Y : `IRLTLT01DEM156N` (mensuelle)
- US 10Y : `DGS10` (journalière)

**Note importante sur IRLTLT01FRM156N et IRLTLT01DEM156N :** Ces séries sont mensuelles (pas journalières). Il faut `limit=2` pour avoir la valeur du mois courant et du mois précédent. La `freshness_level` sera presque toujours 'very_stale' (date = début du mois courant) — c'est normal et attendu.

### Pattern `fredFetch` + `parseObservations`

```typescript
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

interface FredObservation {
  date: string;   // "2026-04-11"
  value: string;  // "4.38" ou "." (weekend/holiday)
}

interface FredResponse {
  observations: FredObservation[];
}

async function fredFetch(seriesId: string): Promise<FredSeriesResult> {
  const key = process.env.FRED_API_KEY;
  if (!key) throw new FredError('FRED_API_KEY is not set', 0);

  const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&limit=5&sort_order=desc&api_key=${key}&file_type=json`;
  const res = await fetch(url);
  if (!res.ok) throw new FredError(`FRED HTTP ${res.status}`, res.status);

  const data: FredResponse = await res.json();
  return parseObservations(data.observations);
}

function parseObservations(observations: FredObservation[]): FredSeriesResult {
  // Filter out "." values (weekends/holidays)
  const valid = observations.filter(o => o.value !== '.' && !isNaN(parseFloat(o.value)));

  if (valid.length === 0) throw new FredError('No valid observations in FRED response', 0);

  const latest = valid[0];
  const previous = valid[1];

  const currentValue = parseFloat(latest.value);
  const previousValue = previous ? parseFloat(previous.value) : currentValue;
  const changeDay = currentValue - previousValue;

  return {
    value: currentValue,
    change_day: parseFloat(changeDay.toFixed(4)),
    direction: changeDay > 0 ? 'up' : changeDay < 0 ? 'down' : 'flat',
    source: 'fred',
    timestamp: new Date(latest.date + 'T12:00:00.000Z').toISOString(),
    freshness_level: computeFredFreshness(latest.date),
  };
}
```

**Pourquoi `limit=5`** au lieu de `limit=2` : FRED peut avoir plusieurs "." consécutifs (long weekend), `limit=5` garantit d'avoir au moins 2 valeurs numériques valides.

### Pattern `computeFredFreshness`

```typescript
function computeFredFreshness(dateStr: string): 'live' | 'stale' | 'very_stale' {
  // FRED dates are "YYYY-MM-DD" — compare with today UTC
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return 'live';
  if (dateStr === yesterday) return 'stale';
  return 'very_stale';
}
```

### Type retourné

```typescript
export interface FredSeriesResult {
  value: number;
  change_day: number;
  direction: 'up' | 'down' | 'flat';
  source: 'fred';
  timestamp: string;  // ISO 8601
  freshness_level: 'live' | 'stale' | 'very_stale';
}
```

### Pattern tests

```typescript
const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const OLD_DATE = '2026-01-15';

function makeFredResponse(observations: Array<{ date: string; value: string }>) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ observations }),
  };
}

// Happy path (journalier)
mockFetch.mockResolvedValueOnce(makeFredResponse([
  { date: TODAY, value: '4.38' },
  { date: YESTERDAY, value: '4.42' },
]));

// FRED avec "." (weekend)
mockFetch.mockResolvedValueOnce(makeFredResponse([
  { date: TODAY, value: '.' },
  { date: YESTERDAY, value: '4.38' },
  { date: OLD_DATE, value: '4.42' },
]));
```

### Contraintes importantes

1. **Pas de retry dans `fred.ts`** — FRED est fiable, le retry sera géré au niveau `fetch-data.ts` (Story 2.5) si besoin.
2. **Les séries OAT/Bund sont mensuelles** — `freshness_level` sera `'very_stale'` la plupart du temps. C'est correct et attendu pour ces indicateurs de taux longs.
3. **Pas de Zod dans ce fichier** — même pattern que `finnhub.ts`. La validation Zod est dans `fetch-data.ts`.
4. **`change_day` pour les séries mensuelles** = différence mois courant - mois précédent. Sémantiquement c'est "change mensuel" mais on garde le champ `change_day` pour la cohérence du schema `Kpi`.
5. **`timestamp` pour FRED** : la date FRED est au format `"YYYY-MM-DD"`, pas un timestamp UNIX. On construit un ISO 8601 avec `T12:00:00.000Z` pour éviter les décalages de fuseau horaire.

### Anti-patterns

1. **NE PAS** utiliser `limit=2` — risque de n'avoir que des "." si long weekend.
2. **NE PAS** parser `value` sans vérifier `=== '.'` d'abord — `parseFloat('.')` retourne `NaN`.
3. **NE PAS** hardcoder les clés API dans les tests.

### Arborescence fichiers

```
src/
  lib/
    fred.ts                ← NEW
    __tests__/
      fred.test.ts         ← NEW
```

### References

- `docs/planning-artifacts/architecture.md` — Section 3.2 (source: 'fred' dans KpiSchema)
- `docs/planning-artifacts/architecture.md` — Section 3.3 (FRED_API_KEY secret)
- `docs/planning-artifacts/epics.md#Story-2.3` — séries FRED exactes
- `src/lib/schemas/kpi.ts` — type Kpi (Story 2.1)
- `src/lib/finnhub.ts` — même pattern de structure (Story 2.2)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 — via bmad-create-story

### Debug Log References

- Test "throws when all values are '.'" : appelait `fetchUS10Y()` deux fois avec `mockResolvedValueOnce` → 2e appel sans mock → TypeError. Fix : `mockResolvedValue` (sans Once) pour les tests qui font plusieurs appels.
- Test "HTTP 400 status" : idem, deux appels avec `Once`. Fix : `mockResolvedValue` + catch direct plutôt que double await.

### Completion Notes List

- `src/lib/fred.ts` : fetchOAT/fetchBund/fetchUS10Y, filtrage "." via `isValidValue()`, `limit=5` pour couvrir les longs weekends, `FredError` custom
- `timestamp` construit avec `T12:00:00.000Z` pour éviter les décalages fuseau horaire sur dates FRED journalières
- 16 tests, 70 total passent

### File List

**Nouveaux fichiers :**
- `src/lib/fred.ts`
- `src/lib/__tests__/fred.test.ts`

**Modifiés :**
- `docs/planning-artifacts/sprint-status.yaml`
