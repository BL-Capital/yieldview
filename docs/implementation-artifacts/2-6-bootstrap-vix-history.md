# Story 2.6 : Script bootstrap-vix-history.ts

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un script one-shot `scripts/pipeline/bootstrap-vix-history.ts` qui récupère les 252 derniers jours ouvrés de VIX via Finnhub et persiste les données dans `data/vix-history.json`,
**so that** Story 2.7 (`compute-alert.ts`) dispose d'un historique local complet pour calculer le percentile glissant dès le premier run du pipeline.

**Business value :** Sans cet historique, Story 2.7 ne peut pas calculer le percentile VIX p90 sur 252 jours — l'AlertBanner du site serait toujours vide. Ce script est exécuté une seule fois avant le premier run quotidien. Il est aussi le point de re-seed si l'historique R2 est corrompu.

---

## Acceptance Criteria

**AC1 — `scripts/pipeline/bootstrap-vix-history.ts`**

- [ ] Fichier `scripts/pipeline/bootstrap-vix-history.ts` créé
- [ ] Compatible `pnpm tsx scripts/pipeline/bootstrap-vix-history.ts` (pas de compilation préalable)
- [ ] Exécutable via `pnpm run bootstrap:vix` (script ajouté dans `package.json`)
- [ ] Pas d'import Next.js — script Node.js pur

**AC2 — Fetch historique VIX via Finnhub candles**

- [ ] Endpoint Finnhub utilisé : `/stock/candle?symbol=^VIX&resolution=D&from=...&to=...`
- [ ] Paramètre `from` = timestamp Unix d'il y a 365 jours calendaires (marge pour obtenir ~252 jours ouvrés)
- [ ] Paramètre `to` = timestamp Unix du jour (minuit UTC)
- [ ] Retry identique au client Finnhub existant : 3 tentatives, backoff 1s/2s/4s
- [ ] Clé API lue depuis `process.env['FINNHUB_API_KEY']` (bracket notation obligatoire)
- [ ] Si `s !== 'ok'` dans la réponse Finnhub : throw `BootstrapError`

**AC3 — Traitement et format de sortie**

- [ ] Extraction des paires `{ date: string; value: number }` depuis les arrays `t[]` (timestamp Unix) et `c[]` (close price)
- [ ] `date` en format ISO `YYYY-MM-DD` (ex: `"2026-04-12"`)
- [ ] `value` = price close (champ `c`) arrondi à 2 décimales
- [ ] Tri chronologique ascendant (du plus ancien au plus récent)
- [ ] Déduplication : si plusieurs entrées pour la même date, conserver la dernière
- [ ] Count final loggé : nombre de points extraits

**AC4 — Persistance locale `data/vix-history.json`**

- [ ] Dossier `data/` créé s'il n'existe pas (`fs.mkdirSync(..., { recursive: true })`)
- [ ] `data/vix-history.json` écrit avec le tableau `VixPoint[]` sérialisé (JSON indenté 2 espaces)
- [ ] Le fichier est consommé par Story 2.7 (`compute-alert.ts`) pour le percentile local
- [ ] Si le fichier existe déjà : overwrite (mode one-shot, pas de merge)

**AC5 — Upload R2 `vix-history/vix-252d.json` (production)**

- [ ] Upload vers R2 avec la même structure `VixPoint[]` que `data/vix-history.json`
- [ ] Clé R2 : `vix-history/vix-252d.json`
- [ ] Variables R2 lues depuis : `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`
- [ ] Si les variables R2 sont absentes : log warn + skip upload (pas de throw — exécution locale possible sans R2)
- [ ] Utilise `@aws-sdk/client-s3` (même SDK que Story 2.11 utilisera — voir note d'harmonisation)

**AC6 — Log structuré JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr)
- [ ] Log de démarrage : `{ level: 'info', msg: 'bootstrap-vix start', from, to }`
- [ ] Log de progression : `{ level: 'info', msg: 'candles fetched', count }`
- [ ] Log de fin locale : `{ level: 'info', msg: 'data/vix-history.json written', count }`
- [ ] Log de fin R2 : `{ level: 'info', msg: 'R2 upload complete', key: 'vix-history/vix-252d.json' }` (si R2 disponible)
- [ ] En cas d'erreur : `{ level: 'error', msg, error: string, timestamp }`

**AC7 — Tests Vitest**

- [ ] `scripts/pipeline/__tests__/bootstrap-vix-history.test.ts` créé
- [ ] Mock de `fetch` global pour simuler la réponse Finnhub candles
- [ ] Mock de `fs` ou test du traitement des données en isolation
- [ ] Test happy path : extraction + tri + déduplication corrects
- [ ] Test `s !== 'ok'` : throw `BootstrapError`
- [ ] Test variables R2 absentes : skip upload, pas de throw
- [ ] `pnpm test` passe sans erreurs

**AC8 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.6): add bootstrap-vix-history.ts one-shot seed script`

---

## Tasks / Subtasks

- [ ] **Task 1** — Créer `scripts/pipeline/bootstrap-vix-history.ts` (AC1, AC2, AC3, AC4, AC5, AC6)
  - [ ] Définir interface `VixPoint` : `{ date: string; value: number }`
  - [ ] Définir interface `FinnhubCandleRaw` : `{ s: string; t: number[]; c: number[]; h: number[]; l: number[]; o: number[]; v: number[] }`
  - [ ] Classe `BootstrapError` (extends Error)
  - [ ] Fonction `log()` — pattern identique à `fetch-data.ts`
  - [ ] Fonction `fetchVixCandles(from: number, to: number): Promise<VixPoint[]>` — fetch + retry + parse
  - [ ] Fonction `deduplicateAndSort(points: VixPoint[]): VixPoint[]` — tri + dédup par date
  - [ ] Fonction `writeLocal(points: VixPoint[]): void` — `fs.mkdirSync` + `fs.writeFileSync`
  - [ ] Fonction `uploadToR2(points: VixPoint[]): Promise<void>` — `@aws-sdk/client-s3` PutObjectCommand
  - [ ] Entry point `main()` : orchestration complète, log démarrage/fin

- [ ] **Task 2** — Ajouter le script `bootstrap:vix` dans `package.json`
  - [ ] `"bootstrap:vix": "tsx scripts/pipeline/bootstrap-vix-history.ts"`

- [ ] **Task 3** — Créer `data/.gitkeep` pour versionner le dossier (mais pas le JSON — ajout dans `.gitignore`)
  - [ ] Ajouter `data/vix-history.json` dans `.gitignore` (données sensibles + trop grosses)

- [ ] **Task 4** — Créer les tests Vitest (AC7)
  - [ ] `scripts/pipeline/__tests__/bootstrap-vix-history.test.ts`
  - [ ] Mock `globalThis.fetch` pour simuler réponse Finnhub candles
  - [ ] Tests extraction/déduplication/tri (fonctions pures testables)
  - [ ] Test `BootstrapError` si `s !== 'ok'`
  - [ ] Test skip R2 si env vars absentes
  - [ ] `pnpm test` ✅

- [ ] **Task 5** — Git commit : `feat(story-2.6): add bootstrap-vix-history.ts one-shot seed script`

- [ ] **Task 6** — Update story → status review

---

## Dev Notes

### Endpoint Finnhub Candles

L'endpoint `/quote` (utilisé dans `src/lib/finnhub.ts`) ne retourne que la valeur courante. Pour l'historique, utiliser l'endpoint `/stock/candle` :

```
GET https://finnhub.io/api/v1/stock/candle
  ?symbol=^VIX
  &resolution=D      ← daily
  &from=1712000000   ← Unix timestamp (365 jours en arrière)
  &to=1743536000     ← Unix timestamp (aujourd'hui minuit UTC)
  &token=<KEY>
```

**Réponse attendue :**

```json
{
  "s": "ok",
  "t": [1712000000, 1712086400, ...],  // timestamps Unix (1 par jour ouvré)
  "c": [16.5, 17.2, ...],              // close prices (VIX)
  "h": [...], "l": [...], "o": [...], "v": [...]
}
```

**Cas d'erreur :** si `s === 'no_data'` ou tout autre valeur != `'ok'`, throw `BootstrapError`.

**Note Finnhub free tier :** Le plan gratuit permet `/stock/candle` pour les indices. `^VIX` est disponible. Quotas : 60 req/min — une seule requête suffit pour 365 jours.

### Pattern `fetchVixCandles`

```typescript
async function fetchVixCandles(from: number, to: number): Promise<VixPoint[]> {
  const key = process.env['FINNHUB_API_KEY'];
  if (!key) throw new BootstrapError('FINNHUB_API_KEY is not set');

  const url =
    `https://finnhub.io/api/v1/stock/candle` +
    `?symbol=%5EVIX&resolution=D&from=${from}&to=${to}&token=${key}`;

  // Retry x3 avec backoff identique au client finnhub.ts
  let lastError: Error | undefined;
  const delays = [1000, 2000, 4000];
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new BootstrapError(`Finnhub HTTP ${res.status}`);
      const data = await res.json() as FinnhubCandleRaw;
      if (data.s !== 'ok') throw new BootstrapError(`Finnhub candle status: ${data.s}`);
      return parseCandles(data);
    } catch (err) {
      lastError = err as Error;
      if (attempt < 3) await new Promise(r => setTimeout(r, delays[attempt - 1]));
    }
  }
  throw lastError!;
}
```

### Pattern `parseCandles` (testable unitairement)

```typescript
function parseCandles(data: FinnhubCandleRaw): VixPoint[] {
  return data.t.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10), // YYYY-MM-DD
    value: Math.round((data.c[i] ?? 0) * 100) / 100,
  }));
}
```

### Pattern `deduplicateAndSort`

```typescript
function deduplicateAndSort(points: VixPoint[]): VixPoint[] {
  const map = new Map<string, number>();
  for (const { date, value } of points) {
    map.set(date, value); // dernière valeur pour une date donnée
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}
```

### Pattern `uploadToR2`

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function uploadToR2(points: VixPoint[]): Promise<void> {
  const accessKeyId     = process.env['R2_ACCESS_KEY_ID'];
  const secretAccessKey = process.env['R2_SECRET_ACCESS_KEY'];
  const bucket          = process.env['R2_BUCKET_NAME'];
  const endpoint        = process.env['R2_ENDPOINT'];

  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint) {
    log('warn', 'R2 env vars manquantes — skip upload R2', {});
    return;
  }

  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: 'vix-history/vix-252d.json',
    Body: JSON.stringify(points, null, 2),
    ContentType: 'application/json',
  }));

  log('info', 'R2 upload complete', { key: 'vix-history/vix-252d.json' });
}
```

### Pattern `writeLocal`

```typescript
import fs from 'fs';
import path from 'path';

function writeLocal(points: VixPoint[]): void {
  const dir = path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'vix-history.json');
  fs.writeFileSync(filePath, JSON.stringify(points, null, 2), 'utf-8');
  log('info', 'data/vix-history.json written', { count: points.length });
}
```

### Calcul des timestamps `from` / `to`

```typescript
const to = Math.floor(Date.now() / 1000);              // maintenant en Unix
const from = to - 365 * 24 * 60 * 60;                 // 365 jours en arrière (marge pour 252 jours ouvrés)
```

**Pourquoi 365 jours ?** Les 252 jours ouvrés annuels (hors week-ends et jours fériés) s'étalent sur ~365 jours calendaires. Demander 365 jours garantit d'obtenir au moins 252 points ouvrés.

### Pattern `main()`

```typescript
async function main(): Promise<void> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 365 * 24 * 60 * 60;

  log('info', 'bootstrap-vix start', {
    from: new Date(from * 1000).toISOString(),
    to: new Date(to * 1000).toISOString(),
  });

  const raw = await fetchVixCandles(from, to);
  log('info', 'candles fetched', { count: raw.length });

  const points = deduplicateAndSort(raw);

  writeLocal(points);
  await uploadToR2(points);

  log('info', 'bootstrap-vix complete', { total_points: points.length });
}

main().catch((err) => {
  console.error(JSON.stringify({
    level: 'error',
    msg: 'bootstrap-vix fatal',
    error: String(err),
    timestamp: new Date().toISOString(),
  }));
  process.exit(1);
});
```

### Pattern tests Vitest

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
beforeEach(() => {
  globalThis.fetch = mockFetch;
  process.env['FINNHUB_API_KEY'] = 'test-key';
});
afterEach(() => {
  vi.clearAllMocks();
  delete process.env['FINNHUB_API_KEY'];
  delete process.env['R2_ACCESS_KEY_ID'];
});

// Exemple de mock candle response
const mockCandleResponse = {
  s: 'ok',
  t: [1712000000, 1712086400],
  c: [16.52, 17.21],
  h: [17.0, 17.8], l: [15.9, 16.5], o: [16.1, 17.0], v: [0, 0],
};
```

### Contraintes importantes

1. **Bracket notation** : `process.env['FINNHUB_API_KEY']` (jamais `process.env.FINNHUB_API_KEY`) — pre-commit hook
2. **Pas d'import Next.js** — script Node.js pur, `pnpm tsx` uniquement
3. **stdout propre** : aucun log sur stdout. Uniquement `console.error(JSON.stringify(...))` (stderr)
4. **`@aws-sdk/client-s3` optionnel** : si non installé lors de ce sprint, l'import peut être dynamic (`import(...)`) ou conditionnel. L'upload R2 est skip si env vars absentes (story 2.11 installe le SDK proprement)
5. **`data/vix-history.json` dans `.gitignore`** : fichier de données volumineux (~252 lignes), ne doit pas être commité
6. **Script one-shot** : ne pas faire de merge avec un historique existant. Overwrite total.

### Anti-patterns

1. **NE PAS** réutiliser `fetchVIX()` de `src/lib/finnhub.ts` — ce client ne supporte que `/quote`, pas `/stock/candle`
2. **NE PAS** stocker plus de données que nécessaire — seuls `date` et `value` sont nécessaires pour Story 2.7
3. **NE PAS** throw si R2 est indisponible — c'est un script one-shot, l'exécution locale sans R2 doit fonctionner
4. **NE PAS** utiliser `process.env.VAR` (dot notation) — pré-commit hook intercepte les secrets
5. **NE PAS** importer depuis `src/lib/finnhub.ts` — ce client utilise `/quote`, pas `/stock/candle`
6. **NE PAS** oublier `%5EVIX` dans l'URL (`^` doit être URL-encodé en `%5E` pour les indices)

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              ← existant (Story 2.5)
    bootstrap-vix-history.ts   ← NEW
    __tests__/
      fetch-data.test.ts       ← existant (Story 2.5)
      bootstrap-vix-history.test.ts  ← NEW
data/
  .gitkeep                     ← NEW (versionner le dossier)
  vix-history.json             ← GÉNÉRÉ au runtime (dans .gitignore)
```

**Fichier consommé par Story 2.7 :**
- Local : `data/vix-history.json`
- R2 (production) : `vix-history/vix-252d.json`

### Relation avec Story 2.7

Story 2.7 (`compute-alert.ts`) lira `data/vix-history.json` pour :
1. Calculer le p90 sur les 252 derniers points
2. Déterminer l'`AlertState` : `{ active, level, vix_current, vix_p90_252d, triggered_at }`
3. Appender le VIX du jour et sauver le fichier mis à jour

Story 2.6 doit donc produire exactement `VixPoint[]` — rien de plus.

### `@aws-sdk/client-s3` — état d'installation

**Vérifier** si `@aws-sdk/client-s3` est déjà dans `package.json`. Si absent (Story 2.11 l'installera formellement), deux options :
- **Option A (recommandée)** : import conditionnel avec `try/catch` — si `import()` échoue, skip R2 silencieusement
- **Option B** : `pnpm add @aws-sdk/client-s3` dans cette story si pas encore présent

### Output `data/vix-history.json` — format attendu

```json
[
  { "date": "2025-04-14", "value": 15.23 },
  { "date": "2025-04-15", "value": 16.87 },
  ...
  { "date": "2026-04-11", "value": 17.45 }
]
```

### Références

- `src/lib/finnhub.ts` — pattern retry + bracket notation + log structuré (Story 2.2)
- `scripts/pipeline/fetch-data.ts` — pattern PipelineError + log + main() (Story 2.5)
- `scripts/pipeline/__tests__/fetch-data.test.ts` — pattern mock vitest existant
- `docs/planning-artifacts/architecture.md` — Section 3.2 R2 structure (`vix-history/vix-252d.json`)
- `docs/planning-artifacts/architecture.md` — Section 6.3 risque A3 (bootstrap VIX archive)
- `docs/implementation-artifacts/2-1-schemas-zod.md` — `AlertStateSchema` (vix_p90_252d utilisé par Story 2.7)

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
- `scripts/pipeline/bootstrap-vix-history.ts`
- `scripts/pipeline/__tests__/bootstrap-vix-history.test.ts`
- `data/.gitkeep`

**Fichiers modifiés :**
- `package.json` — ajout script `bootstrap:vix`
- `.gitignore` — ajout `data/vix-history.json`
