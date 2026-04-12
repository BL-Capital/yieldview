# Story 2.5 : Script fetch-data.ts + fallback

Status: draft
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un script `scripts/pipeline/fetch-data.ts` orchestrant Finnhub + FRED en parallèle avec fallback R2,
**so that** le pipeline peut collecter tous les KPIs du marché, calculer les spreads dérivés, et rester opérationnel même si une API source échoue.

**Business value :** Ce script est le cœur du pipeline data. Il assemble les données provenant de Finnhub (volatilité + indices) et FRED (taux souverains), calcule les spreads OAT-Bund et Bund-US, et garantit la continuité via le fallback R2. Sans ce script, aucune donnée ne peut être publiée dans `latest.json` — tout le dashboard front-end est bloqué.

---

## Acceptance Criteria

**AC1 — `scripts/pipeline/fetch-data.ts`**

- [ ] Fichier `scripts/pipeline/fetch-data.ts` créé
- [ ] Compatible `pnpm tsx scripts/pipeline/fetch-data.ts` (pas de compilation préalable requise)
- [ ] Fonctions exportées : `fetchAllMarketData()`, `computeSpreads()`, `buildKpis()`
- [ ] Output stdout : JSON valide `{ kpis: Kpi[], fetchedAt: string }` (ISO 8601)

**AC2 — Fetch parallèle Finnhub + FRED**

- [ ] `fetchAllMarketData()` lance Finnhub et FRED en parallèle via `Promise.allSettled`
- [ ] Finnhub : appels `fetchVIX()`, `fetchDXY()`, `fetchIndices()` depuis `src/lib/finnhub.ts`
- [ ] FRED : appels `fetchOAT()`, `fetchBund()`, `fetchUS10Y()` depuis `src/lib/fred.ts`
- [ ] Chaque source peut échouer indépendamment sans bloquer l'autre
- [ ] Log structuré JSON (stderr) pour chaque fetch : `{ level, msg, source, duration_ms }`

**AC3 — Calculs dérivés (spreads)**

- [ ] `computeSpreads(oat: number, bund: number, us: number)` exportée et testable
- [ ] `spread_oat_bund` = (OAT - Bund) × 100 → résultat en bps (ex: 3.45% - 2.91% = 54 bps)
- [ ] `spread_bund_us` = (Bund - US) × 100 → résultat en bps
- [ ] Arrondi à 2 décimales
- [ ] `direction` calculé sur le spread lui-même (positif → 'up', négatif → 'down', 0 → 'flat')
- [ ] `source: 'calculated'` pour les deux spreads
- [ ] `freshness_level` hérité de la valeur la plus récente entre OAT, Bund et US

**AC4 — Fallback R2**

- [ ] Si Finnhub échoue entièrement (toutes tentatives épuisées) : fetch `latest.json` depuis R2 pour récupérer les KPIs Finnhub
- [ ] Si FRED échoue entièrement : fetch `latest.json` depuis R2 pour récupérer les KPIs FRED
- [ ] URL R2 : `${process.env['R2_PUBLIC_URL']}/latest.json`
- [ ] Si R2 est aussi indisponible : throw `PipelineError` avec message structuré
- [ ] Log structuré `{ level: 'warn', msg: 'fallback R2 activé', source: 'finnhub'|'fred' }` sur stderr

**AC5 — Construction des KPIs complets**

- [ ] `buildKpis()` assemble tous les KPIs (primaires + spreads calculés) dans le format `Kpi` complet
- [ ] Labels bilingues hardcodés dans le script (voir section Dev Notes)
- [ ] Chaque KPI contient : `id`, `value`, `label`, `category`, `unit`, `change_day`, `change_pct`, `direction`, `source`, `timestamp`, `freshness_level`
- [ ] Alpha Vantage (`fetchQuote` de Story 2.4) volontairement exclu du pipeline (désactivé)

**AC6 — Validation Zod**

- [ ] Chaque KPI validé par `KpiSchema.parse()` avant inclusion dans l'output final
- [ ] Si un KPI ne passe pas la validation : log `{ level: 'error', msg: 'KPI invalide', id, error }` et exclusion du KPI (pas de throw)
- [ ] L'output final ne contient que des KPIs Zod-valides
- [ ] Import depuis `src/lib/schemas/kpi.ts`

**AC7 — Log structuré JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr — ne pollue pas stdout)
- [ ] Chaque log contient au minimum : `level` ('info'|'warn'|'error'), `msg`, `timestamp` ISO 8601
- [ ] Log de démarrage : `{ level: 'info', msg: 'fetch-data start', fetchedAt }`
- [ ] Log de fin : `{ level: 'info', msg: 'fetch-data complete', kpi_count, duration_ms }`

**AC8 — Tests Vitest**

- [ ] `scripts/pipeline/__tests__/fetch-data.test.ts` créé
- [ ] Mocks de `src/lib/finnhub.ts` et `src/lib/fred.ts` via `vi.mock()`
- [ ] Tests `fetchAllMarketData()` : happy path, fallback Finnhub, fallback FRED, double fallback R2
- [ ] Tests `computeSpreads()` : calcul positif, négatif, zéro, arrondi 2 décimales
- [ ] Tests `buildKpis()` : labels bilingues présents, tous les 11 KPIs générés, validation Zod déclenche exclusion sur KPI invalide
- [ ] `pnpm test` passe sans erreurs

**AC9 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.5): add fetch-data.ts pipeline script with R2 fallback`

---

## Tasks / Subtasks

- [ ] **Task 1** — Créer `scripts/pipeline/fetch-data.ts` (AC1, AC2, AC3, AC4, AC5, AC6, AC7)
  - [ ] Classe `PipelineError` (extends Error, champ `source: 'finnhub' | 'fred' | 'r2'`)
  - [ ] Constante `KPI_LABELS` (labels bilingues pour les 11 KPIs)
  - [ ] Constante `KPI_META` (id, category, unit, source pour chaque KPI)
  - [ ] Fonction `fetchR2Fallback()` : fetch `latest.json` depuis R2, retour `Kpi[]`
  - [ ] Fonction `fetchFinnhubData()` : orchestration VIX + DXY + indices, avec fallback R2 si échec
  - [ ] Fonction `fetchFredData()` : orchestration OAT + Bund + US10Y, avec fallback R2 si échec
  - [ ] Fonction exportée `fetchAllMarketData()` : `Promise.allSettled([fetchFinnhubData(), fetchFredData()])` → merge résultats
  - [ ] Fonction exportée `computeSpreads(oat, bund, us)` : calcul bps, direction, freshness hérité
  - [ ] Fonction exportée `buildKpis()` : appelle fetchAllMarketData + computeSpreads, applique labels, valide Zod
  - [ ] Entry point (main) : appelle buildKpis(), log démarrage/fin, écrit JSON sur stdout
  - [ ] Log structuré sur stderr pour chaque étape clé

- [ ] **Task 2** — Vérifier que `scripts/pipeline/` existe (créer le dossier si nécessaire)

- [ ] **Task 3** — Créer les tests Vitest (AC8)
  - [ ] `scripts/pipeline/__tests__/fetch-data.test.ts`
  - [ ] vi.mock de finnhub.ts, fred.ts, et fetch global pour R2
  - [ ] Tests computeSpreads (pur, pas de mock nécessaire)
  - [ ] Tests fetchAllMarketData (happy path + fallbacks)
  - [ ] Tests buildKpis (labels, count, exclusion Zod)
  - [ ] `pnpm test` ✅

- [ ] **Task 4** — Git commit : `feat(story-2.5): add fetch-data.ts pipeline script with R2 fallback`

- [ ] **Task 5** — Update story → status review

---

## Dev Notes

### KPIs complets — meta + labels

```typescript
const KPI_LABELS: Record<string, { fr: string; en: string }> = {
  vix:            { fr: 'VIX (Volatilité)',          en: 'VIX (Volatility)' },
  dxy:            { fr: 'Dollar Index (DXY)',         en: 'Dollar Index (DXY)' },
  cac40:          { fr: 'CAC 40',                    en: 'CAC 40' },
  sp500:          { fr: 'S&P 500',                   en: 'S&P 500' },
  nasdaq:         { fr: 'Nasdaq',                    en: 'Nasdaq' },
  dax:            { fr: 'DAX',                       en: 'DAX' },
  oat_10y:        { fr: 'OAT 10 ans (France)',       en: 'OAT 10Y (France)' },
  bund_10y:       { fr: 'Bund 10 ans (Allemagne)',   en: 'Bund 10Y (Germany)' },
  us_10y:         { fr: 'T-Note 10 ans (US)',        en: 'T-Note 10Y (US)' },
  spread_oat_bund:{ fr: 'Spread OAT-Bund',           en: 'OAT-Bund Spread' },
  spread_bund_us: { fr: 'Spread Bund-US',            en: 'Bund-US Spread' },
};
```

### KPI sources + catégories

| id               | source       | category    | unit  | API source          |
|------------------|--------------|-------------|-------|---------------------|
| vix              | finnhub      | volatility  | ""    | `^VIX`              |
| dxy              | finnhub      | macro       | ""    | `DX-Y.NYB`          |
| cac40            | finnhub      | indices     | ""    | `^FCHI`             |
| sp500            | finnhub      | indices     | ""    | `^GSPC`             |
| nasdaq           | finnhub      | indices     | ""    | `^IXIC`             |
| dax              | finnhub      | indices     | ""    | `^GDAXI`            |
| oat_10y          | fred         | rates       | "%"   | `IRLTLT01FRM156N`   |
| bund_10y         | fred         | rates       | "%"   | `IRLTLT01DEM156N`   |
| us_10y           | fred         | rates       | "%"   | `DGS10`             |
| spread_oat_bund  | calculated   | spreads     | "bps" | OAT - Bund × 100   |
| spread_bund_us   | calculated   | spreads     | "bps" | Bund - US × 100    |

### Pattern `fetchAllMarketData` avec `Promise.allSettled`

```typescript
export async function fetchAllMarketData(): Promise<{
  finnhub: FinnhubResults;
  fred: FredResults;
}> {
  const [finnhubResult, fredResult] = await Promise.allSettled([
    fetchFinnhubData(),
    fetchFredData(),
  ]);

  const finnhub = finnhubResult.status === 'fulfilled'
    ? finnhubResult.value
    : await fetchR2Fallback('finnhub');  // throws PipelineError si R2 aussi KO

  const fred = fredResult.status === 'fulfilled'
    ? fredResult.value
    : await fetchR2Fallback('fred');

  return { finnhub, fred };
}
```

### Pattern `computeSpreads`

```typescript
export function computeSpreads(
  oat: number,
  bund: number,
  us: number,
  freshnessLevel: 'live' | 'stale' | 'very_stale',
  timestamp: string
): { spread_oat_bund: SpreadResult; spread_bund_us: SpreadResult } {
  const calcSpread = (a: number, b: number): number =>
    Math.round((a - b) * 100 * 100) / 100; // bps, arrondi 2 décimales

  const oatBund = calcSpread(oat, bund);
  const bundUs = calcSpread(bund, us);

  return {
    spread_oat_bund: {
      value: oatBund,
      direction: oatBund > 0 ? 'up' : oatBund < 0 ? 'down' : 'flat',
      source: 'calculated' as const,
      freshness_level: freshnessLevel,
      timestamp,
    },
    spread_bund_us: {
      value: bundUs,
      direction: bundUs > 0 ? 'up' : bundUs < 0 ? 'down' : 'flat',
      source: 'calculated' as const,
      freshness_level: freshnessLevel,
      timestamp,
    },
  };
}
```

### Pattern `buildKpis` avec validation Zod

```typescript
export async function buildKpis(): Promise<{ kpis: Kpi[]; fetchedAt: string }> {
  const fetchedAt = new Date().toISOString();
  const start = Date.now();

  log('info', 'fetch-data start', { fetchedAt });

  const { finnhub, fred } = await fetchAllMarketData();
  const spreads = computeSpreads(
    fred.oat_10y.value,
    fred.bund_10y.value,
    fred.us_10y.value,
    fred.oat_10y.freshness_level,
    fred.oat_10y.timestamp
  );

  const rawKpis = assembleRawKpis(finnhub, fred, spreads); // applique KPI_LABELS + KPI_META

  const kpis: Kpi[] = [];
  for (const raw of rawKpis) {
    try {
      kpis.push(KpiSchema.parse(raw));
    } catch (err) {
      log('error', 'KPI invalide — exclu de l\'output', { id: raw.id, error: String(err) });
    }
  }

  log('info', 'fetch-data complete', { kpi_count: kpis.length, duration_ms: Date.now() - start });

  return { kpis, fetchedAt };
}
```

### Pattern log structuré

```typescript
function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(JSON.stringify({
    level,
    msg,
    timestamp: new Date().toISOString(),
    ...extra,
  }));
}
```

### Pattern fallback R2

```typescript
async function fetchR2Fallback(failedSource: 'finnhub' | 'fred'): Promise<Kpi[]> {
  const baseUrl = process.env['R2_PUBLIC_URL'];
  if (!baseUrl) throw new PipelineError('R2_PUBLIC_URL is not set', 'r2');

  log('warn', 'fallback R2 activé', { source: failedSource });

  const res = await fetch(`${baseUrl}/latest.json`);
  if (!res.ok) {
    throw new PipelineError(`R2 fallback HTTP ${res.status}`, 'r2');
  }

  const data = await res.json() as { kpis: Kpi[] };
  const sourceFilter = failedSource === 'finnhub'
    ? ['finnhub']
    : ['fred'];

  return data.kpis.filter(kpi => sourceFilter.includes(kpi.source));
}
```

### Pattern `PipelineError`

```typescript
export class PipelineError extends Error {
  constructor(
    message: string,
    public readonly source: 'finnhub' | 'fred' | 'r2'
  ) {
    super(message);
    this.name = 'PipelineError';
  }
}
```

### Pattern tests Vitest

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock des clients API
vi.mock('../../../src/lib/finnhub', () => ({
  fetchVIX: vi.fn(),
  fetchDXY: vi.fn(),
  fetchIndices: vi.fn(),
}));
vi.mock('../../../src/lib/fred', () => ({
  fetchOAT: vi.fn(),
  fetchBund: vi.fn(),
  fetchUS10Y: vi.fn(),
}));

// Mock fetch global pour R2
const mockFetch = vi.fn();
beforeEach(() => {
  globalThis.fetch = mockFetch;
  process.env['R2_PUBLIC_URL'] = 'https://cdn.example.com';
});
afterEach(() => {
  vi.clearAllMocks();
  delete process.env['R2_PUBLIC_URL'];
});
```

### Test coverage ciblé

| Test                                         | Fonction testée         |
|----------------------------------------------|-------------------------|
| happy path — 11 KPIs générés                | `buildKpis()`           |
| calcul spread positif (54 bps)               | `computeSpreads()`      |
| calcul spread négatif (-23 bps)              | `computeSpreads()`      |
| calcul spread zéro → direction 'flat'        | `computeSpreads()`      |
| arrondi 2 décimales (0.5467% → 54.67 bps)   | `computeSpreads()`      |
| Finnhub fail → fallback R2 activé           | `fetchAllMarketData()`  |
| FRED fail → fallback R2 activé              | `fetchAllMarketData()`  |
| R2 fail aussi → throw PipelineError         | `fetchAllMarketData()`  |
| KPI invalide Zod → exclu sans throw         | `buildKpis()`           |
| labels fr/en présents pour tous les KPIs    | `buildKpis()`           |
| R2_PUBLIC_URL manquante → throw immédiat    | `fetchR2Fallback()`     |

### Output attendu (format stdout)

```json
{
  "kpis": [
    {
      "id": "vix",
      "value": 18.5,
      "label": { "fr": "VIX (Volatilité)", "en": "VIX (Volatility)" },
      "category": "volatility",
      "unit": "",
      "change_day": -1.2,
      "change_pct": -6.1,
      "direction": "down",
      "source": "finnhub",
      "timestamp": "2026-04-12T10:00:00.000Z",
      "freshness_level": "live"
    }
  ],
  "fetchedAt": "2026-04-12T10:00:01.234Z"
}
```

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              ← NEW
    __tests__/
      fetch-data.test.ts       ← NEW
src/
  lib/
    finnhub.ts                 ← existant (Story 2.2)
    fred.ts                    ← existant (Story 2.3)
    alpha-vantage.ts           ← existant (Story 2.4) — NON utilisé dans ce pipeline
    schemas/
      kpi.ts                   ← existant (Story 2.1)
```

### Contraintes importantes

1. **Pas d'import Next.js** — script Node.js pur, compatible `tsx` uniquement
2. **Alpha Vantage désactivé** — `src/lib/alpha-vantage.ts` existe mais n'est PAS importé dans `fetch-data.ts`
3. **stdout vs stderr** — JSON output (kpis) sur `process.stdout.write(...)` ou `console.log`, logs sur `console.error`
4. **Bracket notation** — toujours `process.env['VAR_NAME']` (jamais `process.env.VAR_NAME`) pour éviter le pre-commit hook
5. **Spread en bps** — multiplier la différence de pourcentages par 100 : `(3.45 - 2.91) * 100 = 54 bps`
6. **`Promise.allSettled` obligatoire** — `Promise.all` provoquerait un fail total si une seule source échoue

### Anti-patterns

1. **NE PAS** utiliser `Promise.all` pour les sources primaires — utiliser `Promise.allSettled`
2. **NE PAS** throw si un KPI ne passe pas Zod — log + exclusion silencieuse
3. **NE PAS** importer depuis `alpha-vantage.ts` dans ce script
4. **NE PAS** polluer stdout avec des logs — stdout réservé au JSON final
5. **NE PAS** hardcoder les URLs R2 ou les clés API
6. **NE PAS** calculer les spreads depuis les KPIs R2 fallback — si les deux sources primaires tombent et qu'on utilise R2, les spreads fallback sont ceux de `latest.json`, pas recalculés

### Références

- `docs/planning-artifacts/architecture.md` — Section 3.2 (KpiSchema + sources)
- `docs/planning-artifacts/architecture.md` — Section 4.2 (pipeline fetch-data.ts)
- `docs/planning-artifacts/epics.md#Story-2.5` — ACs originaux
- `src/lib/schemas/kpi.ts` — KpiSchema + type Kpi (Story 2.1)
- `src/lib/finnhub.ts` — fetchVIX, fetchDXY, fetchIndices (Story 2.2)
- `src/lib/fred.ts` — fetchOAT, fetchBund, fetchUS10Y (Story 2.3)
- `docs/implementation-artifacts/2-2-client-finnhub.md` — pattern de référence
- `docs/implementation-artifacts/2-3-client-fred.md` — pattern FRED

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 — via bmad-create-story

### Debug Log References

_À compléter lors de l'implémentation_

### Completion Notes List

_À compléter lors de l'implémentation_

### File List

**Nouveaux fichiers :**
- `scripts/pipeline/fetch-data.ts`
- `scripts/pipeline/__tests__/fetch-data.test.ts`
