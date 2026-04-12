# Story 2.14 : Script `log-run.ts` + GitHub Issue observabilite

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
**I want** un script `scripts/pipeline/log-run.ts` qui cree ou met a jour une GitHub Issue unique "Pipeline Run Log" avec un tableau markdown des runs,
**so that** l'equipe a une vue d'observabilite complete de chaque run du pipeline quotidien directement dans GitHub, sans outil externe.

**Business value :** Derniere etape du pipeline quotidien. Sans logs structures, les echecs silencieux passent inapercus. Le log dans une GitHub Issue pinnable est visible par Bryan et Emmanuel sans acces GitHub Actions, et alimente la page Coulisses (Story 4.9).

---

## Acceptance Criteria

**AC1 -- Fichier `scripts/pipeline/log-run.ts`**

- [ ] Fichier cree a `scripts/pipeline/log-run.ts`
- [ ] Compatible `pnpm tsx scripts/pipeline/log-run.ts` (pas de compilation prealable)
- [ ] Pas d'import Next.js -- script Node.js pur
- [ ] Export de `logPipelineRun(result: { status: 'success' | 'failure'; kpiCount: number; alertLevel: string | null; durationMs: number; error?: string }): Promise<void>` pour usage par `daily-pipeline.yml`
- [ ] Guard `main()` avec `process.argv[1] === fileURLToPath(import.meta.url)` (meme pattern que `fetch-data.ts`)

**AC2 -- Interaction GitHub Issue via `gh` CLI**

- [ ] Utilise la commande `gh` (GitHub CLI, pre-installe dans GitHub Actions runners)
- [ ] Cherche l'issue existante avec titre exact "Pipeline Run Log" via `gh issue list --search "Pipeline Run Log" --state open --json number,title`
- [ ] Si l'issue n'existe pas, la cree avec `gh issue create` : titre "Pipeline Run Log", body contenant le header du tableau markdown + premiere row
- [ ] Si l'issue existe, lit son body via `gh issue view <number> --json body`, append une nouvelle row au tableau markdown, puis met a jour via `gh issue edit <number> --body <new_body>`
- [ ] L'issue utilise le label `pipeline-log` (le creer si inexistant via `gh label create` avec `--force`)
- [ ] Pas de `GITHUB_TOKEN` a configurer manuellement -- `gh` utilise automatiquement le token fourni par GitHub Actions via `GH_TOKEN` env var

**AC3 -- Format du tableau markdown**

- [ ] Header du tableau :
  ```
  | Date | Status | KPIs | Alert | Duration | Error |
  |------|--------|------|-------|----------|-------|
  ```
- [ ] Chaque row : `| 2026-04-12 | success | 11 | warning | 12340ms | - |`
- [ ] Status : `success` ou `failure` (texte brut, pas d'emoji -- compatibilite `runs-last-7.json` futur)
- [ ] Alert : le `alertLevel` passe en parametre (ou `-` si `null`)
- [ ] Error : message d'erreur tronque a 80 caracteres (ou `-` si aucune erreur)
- [ ] Les rows les plus recentes sont en BAS du tableau (append chronologique)

**AC4 -- Rotation : garder les 30 derniers runs**

- [ ] Si le tableau depasse 30 rows de donnees (hors header), supprimer les plus anciennes
- [ ] Parser le body de l'issue, compter les lignes de donnees (lignes qui commencent par `|` et ne sont ni le header ni le separateur)
- [ ] Garder les 29 derniers + la nouvelle row = 30 au total

**AC5 -- `logPipelineRun()` signature et comportement**

- [ ] Signature exacte : `logPipelineRun(result: PipelineRunResult): Promise<void>`
- [ ] Type `PipelineRunResult` :
  ```typescript
  export interface PipelineRunResult {
    status: 'success' | 'failure';
    kpiCount: number;
    alertLevel: string | null;
    durationMs: number;
    error?: string;
  }
  ```
- [ ] La fonction ne throw PAS si l'ecriture GitHub echoue -- elle log l'erreur et return silencieusement (le pipeline ne doit pas echouer a cause du logging)
- [ ] Si `gh` n'est pas disponible (dev local), log un warning et return

**AC6 -- Execution `gh` via `child_process.execFile`**

- [ ] Utiliser `child_process.execFile` (pas `exec` -- plus securise, pas de shell injection)
- [ ] Wrapper `async function gh(...args: string[]): Promise<string>` qui encapsule l'appel
- [ ] Timeout de 15 secondes sur chaque commande `gh`
- [ ] Capture stdout + stderr pour debug

**AC7 -- Log structure JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr -- jamais stdout)
- [ ] Log de demarrage : `{ level: 'info', msg: 'log-run start', status, kpi_count }`
- [ ] Log apres ecriture issue : `{ level: 'info', msg: 'log-run complete', issue_number, rows_count }`
- [ ] En cas d'erreur `gh` : `{ level: 'error', msg: 'log-run gh error', error: string }` -- puis return (pas throw)
- [ ] En cas de `gh` non disponible : `{ level: 'warn', msg: 'gh CLI not found — skipping log-run' }`

**AC8 -- Tests Vitest**

- [ ] `scripts/pipeline/__tests__/log-run.test.ts` cree
- [ ] Mock de `child_process.execFile` (pas d'appels reels a `gh`)
- [ ] Test happy path : issue n'existe pas -> creation avec header + 1 row
- [ ] Test append : issue existe avec 5 rows -> body mis a jour avec 6 rows
- [ ] Test rotation : issue existe avec 30 rows -> apres append, body contient 30 rows (la plus ancienne supprimee)
- [ ] Test erreur `gh` : execFile rejette -> la fonction ne throw pas, log un error
- [ ] Test `gh` absent : `execFile` rejette avec `ENOENT` -> log warn, return
- [ ] Test troncature erreur : message > 80 chars est tronque
- [ ] `pnpm test` passe sans erreurs

**AC9 -- Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.14): add log-run.ts GitHub Issue pipeline logger`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Creer `scripts/pipeline/log-run.ts` (AC1-AC7)
  - [ ] Type `PipelineRunResult` (export)
  - [ ] Classe `LogRunError` (extends Error) -- usage interne uniquement
  - [ ] Fonction `log()` -- pattern identique a `fetch-data.ts` et `compute-alert.ts`
  - [ ] Fonction `gh(...args: string[]): Promise<string>` -- wrapper `execFile` avec timeout 15s
  - [ ] Fonction `checkGhAvailable(): Promise<boolean>` -- verifie que `gh` est dans le PATH
  - [ ] Fonction `findLogIssue(): Promise<number | null>` -- cherche issue "Pipeline Run Log"
  - [ ] Fonction `formatRow(result: PipelineRunResult): string` -- formate une row markdown
  - [ ] Fonction `buildTableBody(existingBody: string, newRow: string): string` -- parse + append + rotation 30 rows
  - [ ] Fonction exportee `logPipelineRun(result: PipelineRunResult): Promise<void>` -- orchestration (AC5)
  - [ ] Fonction `main()` -- parse les args CLI ou stdin pour usage standalone
  - [ ] Guard ESM `if (process.argv[1] === fileURLToPath(import.meta.url))`

- [ ] **Task 2** -- Creer les tests Vitest (AC8)
  - [ ] `scripts/pipeline/__tests__/log-run.test.ts`
  - [ ] Mock `child_process` (`execFile`)
  - [ ] Tests unitaires : creation issue, append row, rotation, erreur gh, gh absent, troncature
  - [ ] `pnpm test` OK

- [ ] **Task 3** -- Git commit : `feat(story-2.14): add log-run.ts GitHub Issue pipeline logger`

- [ ] **Task 4** -- Update story status -> review

---

## Dev Notes

### Pattern `log()` (identique aux autres scripts pipeline)

```typescript
function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}
```

### Pattern `gh()` wrapper execFile

```typescript
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function gh(...args: string[]): Promise<string> {
  const { stdout } = await execFileAsync('gh', args, {
    timeout: 15_000,
    env: { ...process.env },
  });
  return stdout.trim();
}
```

**Important :** `execFile` (pas `exec`) -- plus securise car pas de shell interpolation. Le `GH_TOKEN` est automatiquement herite de `process.env` dans GitHub Actions.

### Pattern checkGhAvailable

```typescript
async function checkGhAvailable(): Promise<boolean> {
  try {
    await gh('version');
    return true;
  } catch {
    return false;
  }
}
```

### Pattern findLogIssue

```typescript
async function findLogIssue(): Promise<number | null> {
  const raw = await gh(
    'issue', 'list',
    '--search', 'Pipeline Run Log in:title',
    '--state', 'open',
    '--json', 'number,title',
    '--limit', '5',
  );
  const issues = JSON.parse(raw) as Array<{ number: number; title: string }>;
  const match = issues.find((i) => i.title === '\u{1F4CA} Pipeline Run Log');
  return match?.number ?? null;
}
```

**Note :** le `--search` GitHub utilise la syntax de recherche Issues. Filtrer cote client avec `find()` pour titre exact.

### Pattern formatRow

```typescript
function formatRow(result: PipelineRunResult): string {
  const date = new Date().toISOString().slice(0, 10);
  const alertStr = result.alertLevel ?? '-';
  const errorStr = result.error
    ? result.error.slice(0, 80).replace(/\|/g, '\\|')  // escape pipe pour markdown
    : '-';
  return `| ${date} | ${result.status} | ${result.kpiCount} | ${alertStr} | ${result.durationMs}ms | ${errorStr} |`;
}
```

### Pattern buildTableBody (parse + append + rotation)

```typescript
const TABLE_HEADER = `| Date | Status | KPIs | Alert | Duration | Error |
|------|--------|------|-------|----------|-------|`;

const MAX_ROWS = 30;

function buildTableBody(existingBody: string | null, newRow: string): string {
  if (!existingBody) {
    return `${TABLE_HEADER}\n${newRow}`;
  }

  const lines = existingBody.split('\n');
  // Trouver les data rows (commencent par | mais ne sont ni header ni separator)
  const headerEnd = lines.findIndex((l) => l.startsWith('|---'));
  if (headerEnd === -1) {
    // Body corrompu -- recreer
    return `${TABLE_HEADER}\n${newRow}`;
  }

  const dataRows = lines.slice(headerEnd + 1).filter((l) => l.startsWith('|'));
  dataRows.push(newRow);

  // Rotation : garder les MAX_ROWS derniers
  const kept = dataRows.slice(-MAX_ROWS);

  return `${TABLE_HEADER}\n${kept.join('\n')}`;
}
```

### Pattern logPipelineRun (orchestration)

```typescript
export async function logPipelineRun(result: PipelineRunResult): Promise<void> {
  log('info', 'log-run start', { status: result.status, kpi_count: result.kpiCount });

  // Check gh disponible
  if (!(await checkGhAvailable())) {
    log('warn', 'gh CLI not found \u2014 skipping log-run');
    return;
  }

  try {
    // Creer label si necessaire (--force = no-op si existe)
    await gh('label', 'create', 'pipeline-log', '--description', 'Pipeline run logs', '--color', '0075ca', '--force');

    const newRow = formatRow(result);
    const issueNumber = await findLogIssue();

    if (issueNumber === null) {
      // Creer l'issue
      const body = buildTableBody(null, newRow);
      const created = await gh(
        'issue', 'create',
        '--title', '\u{1F4CA} Pipeline Run Log',
        '--body', body,
        '--label', 'pipeline-log',
      );
      log('info', 'log-run complete', { action: 'created', issue_url: created, rows_count: 1 });
    } else {
      // Lire body existant
      const raw = await gh('issue', 'view', String(issueNumber), '--json', 'body');
      const { body: existingBody } = JSON.parse(raw) as { body: string };

      // Append + rotation
      const newBody = buildTableBody(existingBody, newRow);
      await gh('issue', 'edit', String(issueNumber), '--body', newBody);

      const rowCount = newBody.split('\n').filter((l) => l.startsWith('|') && !l.startsWith('|--') && !l.startsWith('| Date')).length;
      log('info', 'log-run complete', { action: 'appended', issue_number: issueNumber, rows_count: rowCount });
    }
  } catch (err) {
    log('error', 'log-run gh error', { error: String(err) });
    // NE PAS throw -- le pipeline ne doit pas echouer a cause du logging
  }
}
```

### Pattern `main()` standalone

```typescript
async function main(): Promise<void> {
  // En mode standalone, accepter les parametres via args ou stdin JSON
  // Usage: pnpm tsx scripts/pipeline/log-run.ts '{"status":"success","kpiCount":11,"alertLevel":null,"durationMs":12340}'
  const input = process.argv[2];
  if (!input) {
    log('error', 'main requires JSON argument', {});
    process.exit(1);
  }

  const result = JSON.parse(input) as PipelineRunResult;
  await logPipelineRun(result);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'log-run fatal', { error: String(err) });
    process.exit(1);
  });
}
```

### Pattern tests Vitest (mock child_process)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock child_process AVANT les imports
vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { execFile } from 'child_process';
import { logPipelineRun, type PipelineRunResult } from '../log-run';

const mockExecFile = vi.mocked(execFile);

// Helper pour simuler execFile async (callback-based -> promisified)
function mockGhResponse(stdout: string) {
  mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
    if (typeof _opts === 'function') {
      _opts(null, stdout, '');
    } else if (callback) {
      callback(null, stdout, '');
    }
    return {} as ReturnType<typeof execFile>;
  });
}

function mockGhSequence(responses: string[]) {
  let callIndex = 0;
  mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
    const stdout = responses[callIndex++] ?? '';
    if (typeof _opts === 'function') {
      _opts(null, stdout, '');
    } else if (callback) {
      callback(null, stdout, '');
    }
    return {} as ReturnType<typeof execFile>;
  });
}

describe('logPipelineRun', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const successResult: PipelineRunResult = {
    status: 'success',
    kpiCount: 11,
    alertLevel: null,
    durationMs: 12340,
  };

  it('creates issue when none exists', async () => {
    // gh version -> OK
    // gh label create -> OK
    // gh issue list -> [] (pas d'issue)
    // gh issue create -> 'https://github.com/...'
    mockGhSequence(['gh version 2.x', '', '[]', 'https://github.com/owner/repo/issues/1']);
    await logPipelineRun(successResult);
    // Assert gh issue create called with correct title and body
  });

  it('appends row to existing issue', async () => {
    // ... setup mock avec issue existante contenant 5 rows
  });

  it('rotates when exceeding 30 rows', async () => {
    // ... setup mock avec 30 rows existantes
  });

  it('does not throw on gh error', async () => {
    mockExecFile.mockImplementation(() => { throw new Error('gh failed'); });
    // Should not throw
    await expect(logPipelineRun(successResult)).resolves.toBeUndefined();
  });

  it('warns and returns if gh not found', async () => {
    mockExecFile.mockImplementation(() => { throw Object.assign(new Error(), { code: 'ENOENT' }); });
    await expect(logPipelineRun(successResult)).resolves.toBeUndefined();
  });
});
```

### Contraintes importantes

1. **Bracket notation** : `process.env['GH_TOKEN']` -- obligatoire partout, pre-commit hook bloque les dot notation `process.env.VAR`
2. **Jamais stdout** pour les logs -- uniquement `console.error(JSON.stringify(...))` (stderr)
3. **`execFile`** (pas `exec`) -- securite : pas de shell interpolation. `gh` est appele directement
4. **Extension `.js`** dans les imports relatifs -- obligatoire pour ESM avec `pnpm tsx` : `import from './fetch-data.js'`
5. **`import.meta.url`** pour le guard ESM (pas `require.main === module`)
6. **Pas de `GITHUB_TOKEN` explicite** -- `gh` CLI dans GitHub Actions utilise automatiquement `GH_TOKEN` ou `GITHUB_TOKEN` via env. Le workflow `daily-pipeline.yml` (Story 2.13) passe `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
7. **`logPipelineRun` ne throw JAMAIS** -- le logging ne doit pas faire echouer le pipeline. Try/catch global avec log error
8. **Timeout 15s** sur chaque commande `gh` -- evite blocage du pipeline
9. **`z.iso.datetime()`** -- Zod v4 syntax si besoin de validation dates
10. **`promisify(execFile)`** -- pour transformer le callback-based en async/await

### Anti-patterns

1. **NE PAS** utiliser `fetch()` vers l'API REST GitHub -- le `gh` CLI est plus simple et l'auth est geree automatiquement
2. **NE PAS** utiliser `exec()` (shell) -- `execFile()` est securise contre l'injection
3. **NE PAS** throw dans `logPipelineRun` -- toujours catch et log l'erreur
4. **NE PAS** hardcoder le repo owner/name -- `gh` le detecte automatiquement depuis le `.git` local
5. **NE PAS** utiliser `process.env.GH_TOKEN` (dot notation) -- pre-commit hook bloque
6. **NE PAS** creer le fichier `runs-last-7.json` sur R2 dans cette story -- c'est une future evolution. Pour l'instant, uniquement GitHub Issue
7. **NE PAS** utiliser `require()` -- projet ESM, imports uniquement
8. **NE PAS** utiliser `child_process.spawn` -- `execFile` suffit pour des commandes courtes avec stdout < 1 MB
9. **NE PAS** mettre d'emoji dans les cellules du tableau -- garder le format parseable pour usage futur par `<PipelineLogsTable>` (Story 4.9)
10. **NE PAS** essayer de "pinner" l'issue via l'API -- le pinning n'est pas supporte par `gh` CLI. L'equipe le fera manuellement

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              <- existant (Story 2.5)
    compute-alert.ts           <- existant (Story 2.7)
    generate-ai.ts             <- Story 2.10
    publish-r2.ts              <- Story 2.12
    log-run.ts                 <- NEW (cette story)
    __tests__/
      fetch-data.test.ts       <- existant (Story 2.5)
      compute-alert.test.ts    <- existant (Story 2.7)
      log-run.test.ts          <- NEW (cette story)
```

### Integration avec `daily-pipeline.yml` (Story 2.13)

Le workflow appellera `log-run.ts` dans un step `if: always()` pour logger meme en cas d'echec :

```yaml
# Story 2.13 uncommentera ce step :
- name: Log pipeline run
  if: always()
  run: |
    if [ "${{ job.status }}" = "success" ]; then
      pnpm tsx scripts/pipeline/log-run.ts '{"status":"success","kpiCount":11,"alertLevel":null,"durationMs":${{ steps.pipeline.outputs.duration }}}'
    else
      pnpm tsx scripts/pipeline/log-run.ts '{"status":"failure","kpiCount":0,"alertLevel":null,"durationMs":0,"error":"Pipeline failed at step: ${{ steps.pipeline.outcome }}"}'
    fi
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note :** `GH_TOKEN` (pas `GITHUB_TOKEN`) est la variable que `gh` CLI lit en priorite. `secrets.GITHUB_TOKEN` est automatiquement disponible dans GitHub Actions sans configuration.

### Relation avec les epics originaux

L'epic original (Story 2.14) specifie aussi l'ecriture vers `r2://yieldfield-content/logs/runs-last-7.json`. Cette story se concentre sur le GitHub Issue comme mecanisme principal de logging. L'ecriture R2 sera ajoutee dans une future iteration si necessaire pour la page Coulisses (Story 4.9). L'architecture Decision 14 valide que les logs pipeline sont dans "GitHub Actions UI + `runs-last-7.json` sur R2" -- le GitHub Issue complement les deux.

### Lien avec Story 4.9 (`<PipelineLogsTable>`)

Story 4.9 consomme `runs-last-7.json` pour la page Coulisses. Pour l'instant, la page Coulisses pourra soit :
- Parser le GitHub Issue via l'API GitHub (gratuit, public repo)
- Ou attendre qu'on ajoute l'ecriture R2 dans une future story

Le format du tableau markdown est intentionnellement parseable pour faciliter l'extraction.

### References existantes

- `scripts/pipeline/fetch-data.ts` -- `PipelineError`, `log()` pattern, guard ESM (Story 2.5) [Source: scripts/pipeline/fetch-data.ts]
- `scripts/pipeline/compute-alert.ts` -- `AlertComputeError`, `log()` pattern (Story 2.7) [Source: scripts/pipeline/compute-alert.ts]
- `scripts/pipeline/__tests__/compute-alert.test.ts` -- pattern mock vitest avec `vi.mock()`, `vi.mocked()` (Story 2.7) [Source: scripts/pipeline/__tests__/compute-alert.test.ts]
- `.github/workflows/daily-pipeline.yml` -- step TODO pour log-run (Story 2.13 le debloquera) [Source: .github/workflows/daily-pipeline.yml#L61-65]
- `docs/planning-artifacts/architecture.md` -- Decision 7 pipeline sequentiel, Decision 14 monitoring, structure R2 `logs/runs-last-7.json` [Source: docs/planning-artifacts/architecture.md#3.4, #3.6]
- `docs/planning-artifacts/epics.md` -- Story 2.14 AC originaux [Source: docs/planning-artifacts/epics.md#Story-2.14]
- `docs/planning-artifacts/prd.md` -- FR51 logs pipeline, FR53 alerte GitHub Issue auto [Source: docs/planning-artifacts/prd.md#FR51, #FR53]

### Note sur Zod v4 syntax

Le projet utilise `zod ^4.3.6`. Si besoin de valider le `PipelineRunResult` :
- `z.iso.datetime()` au lieu de `z.string().datetime()` (Zod v3 syntax)
- `z.enum([...])` fonctionne pareil

### Informations du sprint en cours

Stories 2.8 et 2.10 sont `ready-for-dev`. Stories 2.9, 2.11, 2.12, 2.13 sont `backlog`. Cette story (2.14) est la derniere du Sprint 2b. Elle ne depend d'aucune autre story pour son implementation (elle ne lit aucun fichier produit par les autres), mais sera executee en dernier dans le pipeline.

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
- `scripts/pipeline/log-run.ts`
- `scripts/pipeline/__tests__/log-run.test.ts`

**Fichiers existants references (NE PAS modifier) :**
- `.github/workflows/daily-pipeline.yml` (sera modifie par Story 2.13, pas cette story)
- `scripts/pipeline/fetch-data.ts` (reference pattern uniquement)
- `scripts/pipeline/compute-alert.ts` (reference pattern uniquement)
