# Story 2.11 : Client R2 reutilisable (`src/lib/r2.ts`)

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2b (semaine 3)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un module `src/lib/r2.ts` reutilisable qui encapsule les operations upload/download JSON vers Cloudflare R2 via le SDK S3,
**so that** tous les scripts pipeline (`pending-r2.ts`, `publish-r2.ts`, `bootstrap-vix-history.ts`) puissent interagir avec R2 via une API propre, testable et mockable au lieu de dupliquer du code S3Client.

**Business value :** Sans ce client, chaque script pipeline doit reinventer la connexion R2 (deja fait en brut dans `bootstrap-vix-history.ts`). Le client centralise les credentials, le singleton S3Client, la gestion d'erreurs et les logs structures. Il debloque Story 2.12 (`publish-r2.ts`) et Story 2.13 (pipeline GitHub Actions complet).

---

## Acceptance Criteria

**AC1 -- Installation `@aws-sdk/client-s3`**

- [ ] `pnpm add @aws-sdk/client-s3` execute
- [ ] Le package apparait dans `dependencies` de `package.json`
- [ ] `pnpm install` passe sans erreur
- [ ] `pnpm run typecheck` passe sans erreur

**AC2 -- Fichier `src/lib/r2.ts`**

- [ ] Fichier cree a `src/lib/r2.ts`
- [ ] Exports : `R2Error` (class), `uploadJSON(key: string, data: unknown): Promise<void>`, `downloadJSON<T>(key: string): Promise<T>`
- [ ] Pas d'import Next.js -- module Node.js pur utilisable dans les scripts pipeline
- [ ] Compatible ESM (pas de `require()`)

**AC3 -- Classe `R2Error`**

- [ ] `export class R2Error extends Error` avec `this.name = 'R2Error'`
- [ ] Pattern identique a `FinnhubError` (`src/lib/finnhub.ts`) et `FredError` (`src/lib/fred.ts`)
- [ ] Constructeur : `(message: string)`

**AC4 -- Env vars (bracket notation)**

- [ ] `process.env['R2_ACCESS_KEY_ID']`
- [ ] `process.env['R2_SECRET_ACCESS_KEY']`
- [ ] `process.env['R2_BUCKET_NAME']`
- [ ] `process.env['R2_ENDPOINT']`
- [ ] Si une var manque, throw `R2Error` avec message explicite listant la/les var(s) manquante(s)
- [ ] **JAMAIS** dot notation `process.env.VAR` -- pre-commit hook bloque

**AC5 -- S3Client singleton**

- [ ] Variable module-level `let client: S3Client | null = null`
- [ ] Fonction interne `getClient(): S3Client` qui cree le client une seule fois
- [ ] Config : `region: 'auto'`, `endpoint` depuis env, `credentials: { accessKeyId, secretAccessKey }`
- [ ] Le client est reutilise entre les appels `uploadJSON` et `downloadJSON`

**AC6 -- `uploadJSON(key, data)`**

- [ ] Utilise `PutObjectCommand` du SDK S3
- [ ] `Bucket` depuis `process.env['R2_BUCKET_NAME']`
- [ ] `Key` = parametre `key`
- [ ] `Body` = `JSON.stringify(data, null, 2)`
- [ ] `ContentType` = `'application/json'`
- [ ] Log structure stderr apres succes : `{ level: 'info', msg: 'r2 upload ok', key }`
- [ ] En cas d'erreur S3, throw `R2Error` avec message incluant le key et l'erreur originale

**AC7 -- `downloadJSON<T>(key)`**

- [ ] Utilise `GetObjectCommand` du SDK S3
- [ ] `Bucket` depuis `process.env['R2_BUCKET_NAME']`
- [ ] `Key` = parametre `key`
- [ ] Parse le Body stream en string puis `JSON.parse()` pour retourner `T`
- [ ] Utiliser `Body.transformToString()` (methode standard du SDK S3 v3)
- [ ] Si le fichier n'existe pas (NoSuchKey), throw `R2Error` avec message clair
- [ ] Log structure stderr apres succes : `{ level: 'info', msg: 'r2 download ok', key }`

**AC8 -- Log structure JSON (stderr)**

- [ ] Fonction interne `log(level, msg, extra?)` -- meme pattern que `bootstrap-vix-history.ts`, `fetch-data.ts`, `compute-alert.ts`
- [ ] `console.error(JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }))`
- [ ] Jamais `console.log` -- tout sur stderr

**AC9 -- Tests Vitest**

- [ ] `src/lib/__tests__/r2.test.ts` cree
- [ ] Mock de `@aws-sdk/client-s3` : `S3Client`, `PutObjectCommand`, `GetObjectCommand`
- [ ] Test `uploadJSON` happy path : verifie `PutObjectCommand` appele avec bons params
- [ ] Test `downloadJSON` happy path : verifie `GetObjectCommand` + parse JSON retourne
- [ ] Test env vars manquantes : throw `R2Error`
- [ ] Test erreur S3 sur upload : throw `R2Error`
- [ ] Test NoSuchKey sur download : throw `R2Error`
- [ ] Test singleton : 2 appels successifs reutilisent le meme client
- [ ] `pnpm test` passe sans erreur

**AC10 -- Nettoyage `bootstrap-vix-history.ts`**

- [ ] Supprimer le commentaire `// @ts-expect-error — optional dependency, not yet in package.json` (ligne 119)
- [ ] Le dynamic import `await import('@aws-sdk/client-s3')` fonctionne maintenant sans erreur TS car le package est installe
- [ ] `pnpm run typecheck` passe toujours

**AC11 -- Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.11): add R2 client with uploadJSON/downloadJSON + install @aws-sdk/client-s3`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Installer `@aws-sdk/client-s3` (AC1)
  - [ ] `pnpm add @aws-sdk/client-s3`
  - [ ] Verifier `pnpm run typecheck`

- [ ] **Task 2** -- Creer `src/lib/r2.ts` (AC2-AC8)
  - [ ] Classe `R2Error`
  - [ ] Fonction `log(level, msg, extra?)`
  - [ ] Fonction `getClient(): S3Client` avec singleton
  - [ ] Fonction `uploadJSON(key, data): Promise<void>`
  - [ ] Fonction `downloadJSON<T>(key): Promise<T>`
  - [ ] Verifier `pnpm run typecheck`

- [ ] **Task 3** -- Creer les tests `src/lib/__tests__/r2.test.ts` (AC9)
  - [ ] Mock `@aws-sdk/client-s3`
  - [ ] Tests unitaires : happy paths, erreurs, singleton
  - [ ] `pnpm test` OK

- [ ] **Task 4** -- Nettoyer `bootstrap-vix-history.ts` (AC10)
  - [ ] Supprimer `@ts-expect-error` ligne 119
  - [ ] Verifier `pnpm run typecheck`

- [ ] **Task 5** -- Git commit (AC11)

- [ ] **Task 6** -- Update story status -> review

---

## Dev Notes

### Pattern `R2Error`

```typescript
export class R2Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'R2Error';
  }
}
```

Meme pattern simplifie que `BootstrapError` dans `bootstrap-vix-history.ts`. Pas de champ `status` (contrairement a `FinnhubError` / `FredError`) car les erreurs R2 ne sont pas des erreurs HTTP directes -- le SDK S3 les encapsule deja.

### Pattern `log()` (identique aux autres modules)

```typescript
function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}
```

### Pattern S3Client singleton

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;

  const accessKeyId     = process.env['R2_ACCESS_KEY_ID'];
  const secretAccessKey = process.env['R2_SECRET_ACCESS_KEY'];
  const endpoint        = process.env['R2_ENDPOINT'];

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new R2Error(
      'R2 env vars missing: ' +
      [
        !accessKeyId     && 'R2_ACCESS_KEY_ID',
        !secretAccessKey && 'R2_SECRET_ACCESS_KEY',
        !endpoint        && 'R2_ENDPOINT',
      ].filter(Boolean).join(', '),
    );
  }

  client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}
```

**Important :** `R2_BUCKET_NAME` est verifie dans `uploadJSON` et `downloadJSON` (pas dans `getClient`) car c'est un parametre par commande, pas par client.

### Pattern `uploadJSON`

```typescript
export async function uploadJSON(key: string, data: unknown): Promise<void> {
  const bucket = process.env['R2_BUCKET_NAME'];
  if (!bucket) throw new R2Error('R2_BUCKET_NAME is not set');

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
      }),
    );
    log('info', 'r2 upload ok', { key });
  } catch (err) {
    if (err instanceof R2Error) throw err;
    throw new R2Error(`R2 upload failed for key "${key}": ${String(err)}`);
  }
}
```

### Pattern `downloadJSON`

```typescript
export async function downloadJSON<T>(key: string): Promise<T> {
  const bucket = process.env['R2_BUCKET_NAME'];
  if (!bucket) throw new R2Error('R2_BUCKET_NAME is not set');

  try {
    const response = await getClient().send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const bodyStr = await response.Body!.transformToString();
    log('info', 'r2 download ok', { key });
    return JSON.parse(bodyStr) as T;
  } catch (err) {
    if (err instanceof R2Error) throw err;
    // AWS SDK throws an error with name 'NoSuchKey' when the object doesn't exist
    if ((err as { name?: string }).name === 'NoSuchKey') {
      throw new R2Error(`R2 object not found: "${key}"`);
    }
    throw new R2Error(`R2 download failed for key "${key}": ${String(err)}`);
  }
}
```

### Pattern test Vitest (mock S3Client)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @aws-sdk/client-s3 AVANT les imports
const mockSend = vi.fn();

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: vi.fn().mockImplementation((params) => ({ ...params, _type: 'PutObject' })),
  GetObjectCommand: vi.fn().mockImplementation((params) => ({ ...params, _type: 'GetObject' })),
}));

import { uploadJSON, downloadJSON, R2Error } from '../r2';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

beforeEach(() => {
  vi.clearAllMocks();
  process.env['R2_ACCESS_KEY_ID'] = 'test-key';
  process.env['R2_SECRET_ACCESS_KEY'] = 'test-secret';
  process.env['R2_BUCKET_NAME'] = 'test-bucket';
  process.env['R2_ENDPOINT'] = 'https://test.r2.cloudflarestorage.com';
});

afterEach(() => {
  delete process.env['R2_ACCESS_KEY_ID'];
  delete process.env['R2_SECRET_ACCESS_KEY'];
  delete process.env['R2_BUCKET_NAME'];
  delete process.env['R2_ENDPOINT'];
});

describe('uploadJSON', () => {
  it('sends PutObjectCommand with correct params', async () => {
    mockSend.mockResolvedValueOnce({});
    await uploadJSON('test/key.json', { foo: 'bar' });
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'test/key.json',
      Body: JSON.stringify({ foo: 'bar' }, null, 2),
      ContentType: 'application/json',
    });
  });
});

describe('downloadJSON', () => {
  it('returns parsed JSON from GetObjectCommand response', async () => {
    mockSend.mockResolvedValueOnce({
      Body: { transformToString: async () => JSON.stringify({ hello: 'world' }) },
    });
    const result = await downloadJSON('test/key.json');
    expect(result).toEqual({ hello: 'world' });
  });
});
```

**Note critique sur le singleton dans les tests :** le `S3Client` est un singleton module-level. Les tests doivent gerer le fait que le mock est partage entre tests. Le `vi.clearAllMocks()` dans `beforeEach` reset les compteurs d'appels mais le singleton persiste. Pour tester l'erreur env vars manquantes, il faut que le test soit execute AVANT que le singleton soit cree -- ou utiliser `vi.resetModules()` et re-importer. Strategie recommandee : tester le cas env vars manquantes dans un `describe` separe avec `vi.resetModules()`.

### Nettoyage `bootstrap-vix-history.ts`

Ligne 119 actuelle :
```typescript
    // @ts-expect-error — optional dependency, not yet in package.json
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
```

Apres nettoyage (supprimer uniquement le commentaire) :
```typescript
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
```

**Note :** NE PAS refactorer `bootstrap-vix-history.ts` pour utiliser `r2.ts` dans cette story. Ce script fait un import dynamique exprès (il reste autonome et peut fonctionner meme si le module R2 n'est pas charge). Le refactoring eventuel est hors scope.

### Contraintes importantes

1. **Bracket notation** : `process.env['R2_ACCESS_KEY_ID']` -- obligatoire, pre-commit hook bloque `process.env.VAR`
2. **Jamais stdout pour les logs** : uniquement `console.error(JSON.stringify(...))` (stderr)
3. **Extension `.js`** dans les imports relatifs si importe depuis un script pipeline -- mais `r2.ts` est dans `src/lib/`, les imports depuis scripts feront `../../src/lib/r2.js`
4. **ESM uniquement** : pas de `require()`, pas de `module.exports`
5. **`@aws-sdk/client-s3` en dependencies** (pas devDependencies) : utilise a runtime dans les scripts pipeline
6. **Pas de retry dans r2.ts** : contrairement a `finnhub.ts`, le R2 est un stockage interne, les erreurs sont fatales (pas de retry transient comme une API publique)
7. **`Body.transformToString()`** : methode native du SDK v3, pas besoin de `stream-consumers` ou autre polyfill

### Anti-patterns

1. **NE PAS** creer `scripts/pipeline/pending-r2.ts` dans cette story -- c'est Story 2.12
2. **NE PAS** refactorer `bootstrap-vix-history.ts` pour utiliser `r2.ts` -- hors scope, le dynamic import reste tel quel
3. **NE PAS** ajouter de retry logic dans `r2.ts` -- les erreurs R2 sont fatales (stockage interne, pas une API publique)
4. **NE PAS** utiliser `process.env.VAR` dot notation -- pre-commit hook bloque
5. **NE PAS** utiliser `require()` -- projet ESM
6. **NE PAS** ajouter `@aws-sdk/client-s3` en devDependencies -- c'est une dep runtime
7. **NE PAS** creer un wrapper S3Client trop abstrait -- 2 fonctions (`uploadJSON`, `downloadJSON`) suffisent pour le MVP
8. **NE PAS** exporter `getClient()` -- API interne, seuls `uploadJSON`, `downloadJSON` et `R2Error` sont publics
9. **NE PAS** logger les donnees uploadees/downloadees dans les logs -- potentiellement volumineux (vix-history = 252 points)

### Arborescence fichiers

```
src/
  lib/
    r2.ts                    <- NEW (cette story)
    finnhub.ts               <- existant (pattern Error class reference)
    fred.ts                  <- existant (pattern Error class reference)
    __tests__/
      r2.test.ts             <- NEW (cette story)
      finnhub.test.ts        <- existant (pattern test reference)
      fred.test.ts           <- existant (pattern test reference)
scripts/
  pipeline/
    bootstrap-vix-history.ts <- MODIFIE (supprimer @ts-expect-error)
```

### SDK `@aws-sdk/client-s3` v3 -- imports utilises

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
```

- `S3Client` : le client principal, accepte `{ region, endpoint, credentials }`
- `PutObjectCommand` : upload, accepte `{ Bucket, Key, Body, ContentType }`
- `GetObjectCommand` : download, accepte `{ Bucket, Key }`
- `response.Body.transformToString()` : methode native pour lire le stream en string (SDK v3)

La version actuelle (avril 2026) est `^3.x`. Le SDK v3 est modularise -- seul `@aws-sdk/client-s3` est necessaire (pas tout `aws-sdk`).

### Compatibilite Cloudflare R2

Cloudflare R2 est compatible S3 avec les restrictions :
- `region` doit etre `'auto'`
- `endpoint` = l'URL du bucket R2 (format `https://<account-id>.r2.cloudflarestorage.com`)
- Pas de support ACL (ignorer)
- Les operations basiques (PutObject, GetObject, DeleteObject, ListObjects) fonctionnent

### References existantes

- `src/lib/finnhub.ts` -- `FinnhubError` class pattern, bracket notation env vars [Source: src/lib/finnhub.ts]
- `src/lib/fred.ts` -- `FredError` class pattern [Source: src/lib/fred.ts]
- `scripts/pipeline/bootstrap-vix-history.ts` -- code R2 existant a reference (lignes 106-147), `@ts-expect-error` a supprimer (ligne 119) [Source: scripts/pipeline/bootstrap-vix-history.ts]
- `src/lib/__tests__/finnhub.test.ts` -- pattern test Vitest avec mock fetch, env vars setup/teardown [Source: src/lib/__tests__/finnhub.test.ts]
- `docs/planning-artifacts/architecture.md` -- Section Decision 2 (R2 structure), Section 4.2 env vars, Section 5 structure [Source: docs/planning-artifacts/architecture.md#Decision-2]
- `docs/planning-artifacts/epics.md` -- Story 2.11 AC [Source: docs/planning-artifacts/epics.md#Story-2.11]
- `vitest.config.ts` -- config test (environment: 'node', alias '@' -> './src') [Source: vitest.config.ts]

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
- `src/lib/r2.ts`
- `src/lib/__tests__/r2.test.ts`

**Fichiers modifies :**
- `package.json` (ajout `@aws-sdk/client-s3`)
- `pnpm-lock.yaml` (auto)
- `scripts/pipeline/bootstrap-vix-history.ts` (supprimer `@ts-expect-error` ligne 119)
