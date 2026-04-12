# Story 2.12 : Script `publish-r2.ts`

Status: ready-for-dev
Epic: 2 -- Data Pipeline Backend
Sprint: 2b (semaine 3)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un script `scripts/pipeline/publish-r2.ts` qui publie l'objet `Analysis` genere par `generate-ai.ts` (Story 2.10) vers Cloudflare R2 sur 3 cles distinctes (`latest.json`, `archive/YYYY-MM-DD.json`, `vix-history/vix-252d.json`),
**so that** le frontend puisse lire le briefing du jour via `NEXT_PUBLIC_R2_PUBLIC_URL/latest.json`, que l'historique soit archive quotidiennement, et que le VIX history reste synchronise sur R2 pour les scripts qui le necessitent.

**Business value :** Ce script est le dernier maillon de la chaine pipeline avant la newsletter. Sans lui, le contenu genere par l'IA reste en memoire et n'atteint jamais le frontend. C'est le pont entre le backend pipeline et l'experience utilisateur.

---

## Acceptance Criteria

**AC1 -- Fichier `scripts/pipeline/publish-r2.ts`**

- [ ] Fichier cree a `scripts/pipeline/publish-r2.ts`
- [ ] Compatible `pnpm tsx scripts/pipeline/publish-r2.ts` (pas de compilation prealable)
- [ ] Pas d'import Next.js -- script Node.js pur
- [ ] Export de `publishAnalysis(analysis: Analysis): Promise<void>` pour usage par le pipeline orchestrateur (Story 2.13)
- [ ] Guard `main()` avec `process.argv[1] === fileURLToPath(import.meta.url)` (meme pattern que `fetch-data.ts`, `generate-ai.ts`)

**AC2 -- Imports obligatoires**

- [ ] `uploadJSON` depuis `../../src/lib/r2.js` (Story 2.11 -- wrapper S3-compat R2)
- [ ] `type Analysis` depuis `../../src/lib/schemas/analysis.js`
- [ ] `fileURLToPath` depuis `url`

**AC3 -- Upload vers 3 cles R2**

- [ ] **Cle 1 : `latest.json`** -- l'analyse du jour, lue par le frontend via `NEXT_PUBLIC_R2_PUBLIC_URL/latest.json`
- [ ] **Cle 2 : `archive/YYYY-MM-DD.json`** -- archive quotidienne, date extraite de `analysis.date`
- [ ] **Cle 3 : `vix-history/vix-252d.json`** -- mise a jour du VIX history SI `analysis.alert` contient des donnees exploitables (`analysis.alert.vix_current > 0`)
- [ ] Les 3 uploads sont sequentiels (pas de Promise.all) -- fail-fast si un upload echoue

**AC4 -- Construction du VIX history update**

- [ ] Lire le VIX history existant depuis R2 (`vix-history/vix-252d.json`) via fetch public (`R2_PUBLIC_URL`)
- [ ] Ajouter le point du jour : `{ date: analysis.date, value: analysis.alert.vix_current }`
- [ ] Dedupliquer par date (garder la derniere valeur si doublon)
- [ ] Trier par date croissante
- [ ] Garder uniquement les 252 derniers points (fenetre glissante)
- [ ] Guard : si `analysis.alert.vix_current === 0`, NE PAS mettre a jour le VIX history (valeur invalide)

**AC5 -- Log structure JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr -- jamais stdout)
- [ ] Log de demarrage : `{ level: 'info', msg: 'publish-r2 start', date: analysis.date, pipeline_run_id }`
- [ ] Log apres chaque upload : `{ level: 'info', msg: 'r2 upload', key, duration_ms }`
- [ ] Log final : `{ level: 'info', msg: 'publish-r2 complete', keys_uploaded: number, duration_ms }`
- [ ] En cas d'erreur : `{ level: 'error', msg, error: string, key }`

**AC6 -- Gestion d'erreur**

- [ ] Classe `PublishError extends Error` avec propriete `key: string` (quelle cle R2 a echoue)
- [ ] Si un upload echoue, logger l'erreur et throw `PublishError`
- [ ] Pas de retry dans ce script -- le retry est gere au niveau du pipeline orchestrateur (GitHub Actions)
- [ ] `main()` exit code 1 sur erreur

**AC7 -- Mode standalone `main()`**

- [ ] En mode standalone, lire l'`Analysis` depuis stdin (`process.stdin`) en JSON
- [ ] Parser et valider avec `AnalysisSchema.parse()` avant publication
- [ ] Usage attendu en pipeline : `pnpm tsx scripts/pipeline/generate-ai.ts | pnpm tsx scripts/pipeline/publish-r2.ts`
- [ ] Sortie : aucune sur stdout (logs uniquement sur stderr)

**AC8 -- Tests Vitest**

- [ ] `scripts/pipeline/__tests__/publish-r2.test.ts` cree
- [ ] Mock de `../../src/lib/r2.js` (`uploadJSON`)
- [ ] Mock de `global.fetch` pour le VIX history read (R2 public URL)
- [ ] Test happy path : Analysis valide -> 3 uploads appeles avec les bonnes cles
- [ ] Test VIX guard : si `alert.vix_current === 0`, seulement 2 uploads (pas de VIX history update)
- [ ] Test VIX dedup : si le VIX history existant contient deja la date du jour, le point est remplace (pas duplique)
- [ ] Test VIX window : si le VIX history a > 252 points, seuls les 252 derniers sont gardes
- [ ] Test erreur upload : si `uploadJSON` throw, `PublishError` est relance avec la bonne `key`
- [ ] `pnpm test` passe sans erreurs

**AC9 -- Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.12): add publish-r2.ts R2 publisher`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Creer `scripts/pipeline/publish-r2.ts` (AC1-AC7)
  - [ ] Classe `PublishError` (extends Error, propriete `key: string`)
  - [ ] Fonction `log()` -- pattern identique aux autres scripts pipeline
  - [ ] Fonction `readVixHistory(publicUrl: string): Promise<VixPoint[]>` -- fetch public R2 + parse
  - [ ] Fonction `updateVixHistory(existing: VixPoint[], analysis: Analysis): VixPoint[]` -- dedup + sort + window 252
  - [ ] Fonction exportee `publishAnalysis(analysis: Analysis): Promise<void>` -- 3 uploads sequentiels
  - [ ] Fonction `readStdin(): Promise<string>` -- lit stdin pour mode standalone
  - [ ] Fonction `main()` -- lit stdin, parse, valide, publie
  - [ ] Guard ESM `if (process.argv[1] === fileURLToPath(import.meta.url))`

- [ ] **Task 2** -- Creer les tests Vitest (AC8)
  - [ ] `scripts/pipeline/__tests__/publish-r2.test.ts`
  - [ ] Mock `r2.js` et `global.fetch`
  - [ ] Tests unitaires : happy path, VIX guard, VIX dedup, VIX window, erreur upload
  - [ ] `pnpm test` OK

- [ ] **Task 3** -- Git commit : `feat(story-2.12): add publish-r2.ts R2 publisher`

- [ ] **Task 4** -- Update story status -> review

---

## Dev Notes

### Dependance critique sur Story 2.11

Ce script depend de `src/lib/r2.ts` (Story 2.11) qui exporte `uploadJSON`. Si Story 2.11 n'est pas encore implementee :

| Dependance | Story | Que faire si absente |
|---|---|---|
| `src/lib/r2.ts` — `uploadJSON` | 2.11 | Creer un stub minimal. La signature attendue est `uploadJSON(key: string, data: unknown): Promise<void>`. Le test mockera de toute facon |

**Strategie recommandee :** implementer Story 2.11 AVANT 2.12. Si le dev agent les implemente en batch, l'ordre est 2.11 -> 2.12.

### Signature attendue de `uploadJSON` (Story 2.11)

```typescript
// src/lib/r2.ts (Story 2.11)
export async function uploadJSON(key: string, data: unknown): Promise<void> {
  // Utilise @aws-sdk/client-s3 PutObjectCommand
  // Env vars : R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT
  // ContentType: 'application/json'
}
```

### Pattern `PublishError`

```typescript
export class PublishError extends Error {
  constructor(
    message: string,
    public readonly key: string,
  ) {
    super(message);
    this.name = 'PublishError';
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

### Pattern `readVixHistory`

```typescript
interface VixPoint {
  date: string;  // YYYY-MM-DD
  value: number;
}

async function readVixHistory(publicUrl: string): Promise<VixPoint[]> {
  try {
    const res = await fetch(`${publicUrl}/vix-history/vix-252d.json`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      log('warn', 'VIX history not found on R2 — starting fresh', { status: res.status });
      return [];
    }
    const data = await res.json() as VixPoint[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    log('warn', 'VIX history fetch failed — starting fresh', { error: String(err) });
    return [];
  }
}
```

### Pattern `updateVixHistory`

```typescript
const VIX_WINDOW = 252;

function updateVixHistory(existing: VixPoint[], analysis: Analysis): VixPoint[] {
  const map = new Map<string, number>();
  for (const point of existing) {
    map.set(point.date, point.value);
  }
  // Ajouter / remplacer le point du jour
  map.set(analysis.date, analysis.alert.vix_current);

  // Trier par date croissante, garder les 252 derniers
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))
    .slice(-VIX_WINDOW);
}
```

**Note :** Ce pattern est identique a celui de `bootstrap-vix-history.ts` (Story 2.6). Reutiliser la meme logique dedup + sort + slice.

### Pattern `publishAnalysis`

```typescript
import { uploadJSON } from '../../src/lib/r2.js';
import { type Analysis } from '../../src/lib/schemas/analysis.js';

export async function publishAnalysis(analysis: Analysis): Promise<void> {
  const start = Date.now();
  const publicUrl = process.env['R2_PUBLIC_URL'];

  log('info', 'publish-r2 start', {
    date: analysis.date,
    pipeline_run_id: analysis.pipeline_run_id,
  });

  let keysUploaded = 0;

  // 1. latest.json — version courante pour le frontend
  try {
    const t = Date.now();
    await uploadJSON('latest.json', analysis);
    log('info', 'r2 upload', { key: 'latest.json', duration_ms: Date.now() - t });
    keysUploaded++;
  } catch (err) {
    throw new PublishError(`Failed to upload latest.json: ${String(err)}`, 'latest.json');
  }

  // 2. archive/YYYY-MM-DD.json — archive quotidienne
  const archiveKey = `archive/${analysis.date}.json`;
  try {
    const t = Date.now();
    await uploadJSON(archiveKey, analysis);
    log('info', 'r2 upload', { key: archiveKey, duration_ms: Date.now() - t });
    keysUploaded++;
  } catch (err) {
    throw new PublishError(`Failed to upload ${archiveKey}: ${String(err)}`, archiveKey);
  }

  // 3. vix-history/vix-252d.json — MAJ seulement si VIX valide
  if (analysis.alert.vix_current > 0 && publicUrl) {
    const vixKey = 'vix-history/vix-252d.json';
    try {
      const t = Date.now();
      const existing = await readVixHistory(publicUrl);
      const updated = updateVixHistory(existing, analysis);
      await uploadJSON(vixKey, updated);
      log('info', 'r2 upload', { key: vixKey, points: updated.length, duration_ms: Date.now() - t });
      keysUploaded++;
    } catch (err) {
      throw new PublishError(`Failed to upload VIX history: ${String(err)}`, vixKey);
    }
  } else {
    log('info', 'vix history skip', { reason: analysis.alert.vix_current === 0 ? 'vix_current=0' : 'R2_PUBLIC_URL not set' });
  }

  log('info', 'publish-r2 complete', {
    keys_uploaded: keysUploaded,
    duration_ms: Date.now() - start,
  });
}
```

### Pattern `readStdin`

```typescript
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8');
}
```

### Pattern `main()` standalone

```typescript
import { AnalysisSchema } from '../../src/lib/schemas/analysis.js';

async function main(): Promise<void> {
  const raw = await readStdin();
  if (!raw.trim()) {
    throw new PublishError('No input on stdin — expected JSON Analysis', 'stdin');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new PublishError('Invalid JSON on stdin', 'stdin');
  }

  const analysis = AnalysisSchema.parse(parsed);
  await publishAnalysis(analysis);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'publish-r2 fatal', { error: String(err) });
    process.exit(1);
  });
}
```

### Pattern tests Vitest

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules AVANT les imports
vi.mock('../../../src/lib/r2', () => ({
  uploadJSON: vi.fn(),
}));

import { uploadJSON } from '../../../src/lib/r2';
import { publishAnalysis, PublishError } from '../publish-r2';

const mockUploadJSON = vi.mocked(uploadJSON);

// Fixture Analysis valide minimale
function makeAnalysis(overrides?: Partial<Analysis>): Analysis {
  return {
    date: '2026-04-12',
    generated_at: '2026-04-12T06:00:00Z',
    validated_at: null,
    pipeline_run_id: '550e8400-e29b-41d4-a716-446655440000',
    version: 'ai',
    briefing: { fr: 'Briefing FR...', en: 'Briefing EN...' },
    tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
    metadata: {
      theme_of_day: { fr: 'Theme FR', en: 'Theme EN' },
      certainty: 'definitive',
      upcoming_event: null,
      risk_level: 'low',
    },
    kpis: [],
    alert: {
      active: false,
      level: null,
      vix_current: 18.5,
      vix_p90_252d: 25.0,
      triggered_at: null,
    },
    ...overrides,
  } as Analysis;
}

describe('publishAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadJSON.mockResolvedValue(undefined);
    process.env['R2_PUBLIC_URL'] = 'https://r2.example.com';
    // Mock global.fetch for VIX history read
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ date: '2026-04-11', value: 17.5 }],
    });
  });

  it('uploads to 3 R2 keys on happy path', async () => {
    await publishAnalysis(makeAnalysis());
    expect(mockUploadJSON).toHaveBeenCalledTimes(3);
    expect(mockUploadJSON).toHaveBeenCalledWith('latest.json', expect.any(Object));
    expect(mockUploadJSON).toHaveBeenCalledWith('archive/2026-04-12.json', expect.any(Object));
    expect(mockUploadJSON).toHaveBeenCalledWith('vix-history/vix-252d.json', expect.any(Array));
  });

  it('skips VIX history when vix_current is 0', async () => {
    const a = makeAnalysis({ alert: { ...makeAnalysis().alert, vix_current: 0 } });
    await publishAnalysis(a);
    expect(mockUploadJSON).toHaveBeenCalledTimes(2);
  });

  it('throws PublishError with key on upload failure', async () => {
    mockUploadJSON.mockRejectedValueOnce(new Error('S3 timeout'));
    await expect(publishAnalysis(makeAnalysis())).rejects.toThrow(PublishError);
  });
});

describe('updateVixHistory', () => {
  // Tester dedup, sort, window 252
});
```

### Contraintes importantes

1. **Bracket notation** : `process.env['R2_PUBLIC_URL']` -- obligatoire partout, pre-commit hook bloque `process.env.VAR`
2. **Jamais stdout** pour les logs -- uniquement `console.error(JSON.stringify(...))` (stderr)
3. **Extension `.js`** dans les imports relatifs -- obligatoire pour ESM avec `pnpm tsx` : `import from '../../src/lib/r2.js'`
4. **Uploads sequentiels** (pas `Promise.all`) -- fail-fast si un upload echoue, evite les uploads partiels difficiles a debugger
5. **`AnalysisSchema.parse()`** en mode standalone -- validation de conformite Zod avant publication
6. **`AbortSignal.timeout(10_000)`** pour le fetch VIX history (lecture publique R2, meme timeout que fetch-data.ts)
7. **Zod v4 syntax** : `z.iso.datetime()` au lieu de `z.string().datetime()` (le projet utilise `zod ^4.3.6`)
8. **`import.meta.url`** pour le guard ESM (pas `require.main === module`)
9. **`R2_PUBLIC_URL`** (lecture publique) est distinct de `R2_ENDPOINT` (ecriture S3 API) -- l'ecriture passe par `uploadJSON` qui gere ses propres env vars

### Anti-patterns

1. **NE PAS** utiliser `Promise.all` pour les uploads -- les 3 doivent etre sequentiels pour fail-fast propre
2. **NE PAS** lire `pending.json` depuis R2 -- contrairement aux AC originaux de l'epics qui mentionnent un pattern "copie pending -> latest", la specification utilisateur demande de prendre l'`Analysis` en input direct (pas de lecture R2). Le pipeline passe l'objet directement.
3. **NE PAS** implementer un mecanisme d'override/merge dans ce script -- la spec user simplifie le flow : `generate-ai` produit l'Analysis, `publish-r2` la publie telle quelle. L'override manuel est hors scope de cette story.
4. **NE PAS** implementer de retry -- c'est le pipeline orchestrateur (GitHub Actions, Story 2.13) qui gere les retries
5. **NE PAS** creer `src/lib/r2.ts` dans cette story -- c'est Story 2.11. Si pas encore fait, creer un stub minimal
6. **NE PAS** utiliser `process.env.VAR` (dot notation) -- pre-commit hook bloque
7. **NE PAS** utiliser `require()` -- projet ESM, imports uniquement
8. **NE PAS** ecrire sur stdout -- uniquement stderr pour les logs. Le script ne produit aucune sortie stdout.
9. **NE PAS** hardcoder l'URL R2 -- utiliser `process.env['R2_PUBLIC_URL']` pour la lecture publique
10. **NE PAS** oublier de valider l'input stdin avec `AnalysisSchema.parse()` en mode standalone -- protege contre les donnees corrompues

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              <- existant (Story 2.5)
    compute-alert.ts           <- existant (Story 2.7)
    generate-ai.ts             <- Story 2.10 (prerequis)
    publish-r2.ts              <- NEW (cette story)
    __tests__/
      fetch-data.test.ts       <- existant (Story 2.5)
      compute-alert.test.ts    <- existant (Story 2.7)
      generate-ai.test.ts      <- Story 2.10
      publish-r2.test.ts       <- NEW (cette story)
src/
  lib/
    r2.ts                      <- Story 2.11 (prerequis -- uploadJSON)
    schemas/
      analysis.ts              <- existant (Story 2.1) -- AnalysisSchema
      alert.ts                 <- existant (Story 2.1) -- AlertState type
```

### R2 keys reference

| Cle R2 | Contenu | Lecteur | Pattern ecriture |
|---|---|---|---|
| `latest.json` | `Analysis` complete du jour | Frontend SSR via `NEXT_PUBLIC_R2_PUBLIC_URL` | `uploadJSON('latest.json', analysis)` |
| `archive/YYYY-MM-DD.json` | Archive quotidienne identique a latest | Page Coulisses (historique) | `uploadJSON('archive/${analysis.date}.json', analysis)` |
| `vix-history/vix-252d.json` | Array de `{ date, value }[]` (252 max) | `compute-alert.ts` + bootstrap | `uploadJSON('vix-history/vix-252d.json', updatedPoints)` |

### Env vars requises

| Variable | Usage | Ou definie |
|---|---|---|
| `R2_PUBLIC_URL` | Lecture publique VIX history (fetch HTTP) | GitHub Actions secrets + `.env.local` |
| `R2_ACCESS_KEY_ID` | Ecriture S3 API (via `r2.ts`) | GitHub Actions secrets |
| `R2_SECRET_ACCESS_KEY` | Ecriture S3 API (via `r2.ts`) | GitHub Actions secrets |
| `R2_BUCKET_NAME` | Nom du bucket R2 (via `r2.ts`) | GitHub Actions secrets |
| `R2_ENDPOINT` | Endpoint S3-compat (via `r2.ts`) | GitHub Actions secrets |

**Note :** seule `R2_PUBLIC_URL` est lue directement par `publish-r2.ts`. Les autres sont gerees par `uploadJSON` dans `src/lib/r2.ts` (Story 2.11).

### References existantes

- `src/lib/schemas/analysis.ts` -- `AnalysisSchema`, `Analysis` type (Story 2.1) [Source: src/lib/schemas/analysis.ts]
- `src/lib/schemas/alert.ts` -- `AlertStateSchema`, `AlertState` type (Story 2.1) [Source: src/lib/schemas/alert.ts]
- `scripts/pipeline/fetch-data.ts` -- `PipelineError`, `log()` pattern, guard ESM, `fetchR2Fallback` (Story 2.5) [Source: scripts/pipeline/fetch-data.ts]
- `scripts/pipeline/compute-alert.ts` -- `AlertComputeError`, VIX history local read (Story 2.7) [Source: scripts/pipeline/compute-alert.ts]
- `docs/implementation-artifacts/2-10-script-generate-ai.md` -- `generateAnalysis()` export, Story 2.12 references (Story 2.10) [Source: docs/implementation-artifacts/2-10-script-generate-ai.md]
- `docs/implementation-artifacts/2-6-bootstrap-vix-history.md` -- Pattern `uploadToR2`, VIX dedup/sort/slice (Story 2.6) [Source: docs/implementation-artifacts/2-6-bootstrap-vix-history.md]
- `docs/planning-artifacts/architecture.md` -- Section R2 structure, Decision 7 pipeline sequentiel, Decision 2 R2 storage [Source: docs/planning-artifacts/architecture.md#3.2, #3.4]
- `docs/planning-artifacts/epics.md` -- Story 2.12 AC originaux (override/pending pattern) [Source: docs/planning-artifacts/epics.md#Story-2.12]

### Note sur la divergence avec les epics

Les AC originaux dans `epics.md` mentionnent un pattern "copie `pending.json` -> `latest.json`" avec delai de 15 min et detection d'override manuel. La specification utilisateur pour cette story **simplifie** le flow :

- **Pas de lecture `pending.json`** -- l'Analysis est passee en input direct (stdin ou parametre fonction)
- **Pas de delai 15 min** -- c'est le pipeline orchestrateur (Story 2.13) qui gere le timing
- **Pas de detection d'override** -- hors scope, pourra etre ajoute dans une story ulterieure si necessaire
- **Pas de trigger Cloudflare Pages revalidation** -- sera gere par Story 2.13 ou une story dediee

Cette simplification est coherente avec le pattern existant ou chaque script pipeline fait une chose bien. L'orchestration complexe (timing, override, revalidation) sera dans `daily-pipeline.yml` (Story 2.13).

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
- `scripts/pipeline/publish-r2.ts`
- `scripts/pipeline/__tests__/publish-r2.test.ts`

**Fichiers existants requis (dependencies, NE PAS creer) :**
- `src/lib/r2.ts` (Story 2.11 -- `uploadJSON`)
- `src/lib/schemas/analysis.ts` (Story 2.1 -- `AnalysisSchema`, `Analysis`)
- `src/lib/schemas/alert.ts` (Story 2.1 -- `AlertState`)
