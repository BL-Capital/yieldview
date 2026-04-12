# Story 1.7 : GitHub Actions workflow structure

Status: review
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** les 3 workflows GitHub Actions créés (build-check, lighthouse-ci, daily-pipeline squelette),
**so that** chaque PR valide le build automatiquement et que le pipeline Sprint 2 ait déjà sa structure CI en place.

**Business value :** Sans build-check.yml, une PR cassée peut merger silencieusement. Le daily-pipeline.yml squelette évite de créer la structure CI sous pression en Sprint 2 quand les API keys seront en jeu.

---

## Acceptance Criteria

**AC1 — build-check.yml**

- [ ] `.github/workflows/build-check.yml` créé
- [ ] Déclenché sur `push` sur toutes branches + `pull_request` vers `main`
- [ ] Steps : `pnpm install --frozen-lockfile` → `pnpm run typecheck` → `pnpm run lint` → `pnpm run build`
- [ ] Node 20, pnpm via `pnpm/action-setup`

**AC2 — lighthouse-ci.yml**

- [ ] `.github/workflows/lighthouse-ci.yml` créé
- [ ] Déclenché sur `push` vers `main` uniquement
- [ ] Build Next.js + start serveur local → Lighthouse audit sur `http://localhost:3000/fr`
- [ ] Seuils : `performance >= 0.9`, `accessibility >= 0.9`, `best-practices >= 0.9`, `seo >= 0.9`
- [ ] Utilise `@lhci/cli` (lighthouse-ci) — pas de token Cloudflare requis pour audit local

**AC3 — daily-pipeline.yml (squelette)**

- [ ] `.github/workflows/daily-pipeline.yml` créé
- [ ] Trigger : `schedule: "0 6 * * *"` + `workflow_dispatch` (manuel)
- [ ] Steps commentés (TODO Sprint 2) : fetch-data, generate-ai, publish-r2, log-run
- [ ] Secrets référencés en commentaire : `ANTHROPIC_API_KEY`, `FINNHUB_API_KEY`, `FRED_API_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- [ ] Job désactivé (condition `if: false`) pour ne pas s'exécuter avant Sprint 2

**AC4 — Git workflow**

- [ ] Commit sur `emmanuel` avec message `feat(story-1.7): add GitHub Actions workflows (build-check, lighthouse-ci, daily-pipeline skeleton)`

---

## Tasks / Subtasks

- [x] **Task 1** — Créer build-check.yml (AC1)
  - [x] `.github/workflows/build-check.yml`
  - [x] Triggers : `push` (toutes branches) + `pull_request` (→ main)
  - [x] pnpm cache via `pnpm/action-setup@v4` + `actions/setup-node@v4` avec `cache: 'pnpm'`
  - [x] Steps : checkout → setup pnpm → setup node → pnpm install → typecheck → lint → build

- [x] **Task 2** — Créer lighthouse-ci.yml (AC2)
  - [x] `.github/workflows/lighthouse-ci.yml`
  - [x] Trigger : `push` → `main` seulement
  - [x] Build Next.js → `startServerCommand: pnpm run start` → `lhci autorun`
  - [x] `.lighthouserc.json` créé à la racine avec seuils performance ≥ 90
  - [x] Utilise `npx @lhci/cli@latest autorun` — pas de dépendance npm à ajouter

- [x] **Task 3** — Créer daily-pipeline.yml squelette (AC3)
  - [x] `.github/workflows/daily-pipeline.yml`
  - [x] Cron `0 6 * * *` + `workflow_dispatch`
  - [x] Job principal avec `if: false` (désactivé jusqu'à Sprint 2b)
  - [x] Structure commentée des 7 steps pipeline + tous les secrets référencés

- [x] **Task 4** — Git commit (AC4)

- [x] **Task 5** — Update story file → status review

---

## Dev Notes

### Architecture constraints

- **pnpm** : le projet utilise `pnpm-lock.yaml` — toujours utiliser `pnpm/action-setup@v4` + `cache: 'pnpm'` dans les workflows.
- **Node 20** : compatible Next.js 15 + React 19.
- **Lighthouse local** : on ne peut pas tester sur l'URL Cloudflare Pages en Sprint 1 (pas encore déployé). Pattern : build → `next start &` → wait → `lhci autorun` sur localhost. Cela nécessite `output: 'standalone'` dans `next.config.ts` OU `next start` standard (port 3000).
- **daily-pipeline.yml désactivé** : `if: false` au niveau du job pour éviter tout run accidentel. Sera activé en Story 2.13.
- **Secrets GH Actions** : référencés en commentaire dans daily-pipeline.yml — à configurer manuellement dans `Settings > Secrets` quand Sprint 2 démarre.

### Pattern build-check.yml

```yaml
name: Build Check
on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run typecheck
      - run: pnpm run lint
      - run: pnpm run build
```

### Pattern Lighthouse CI (local server)

```yaml
- name: Build
  run: pnpm run build
- name: Start server
  run: pnpm run start &
- name: Wait for server
  run: npx wait-on http://localhost:3000
- name: Run Lighthouse CI
  run: npx @lhci/cli@latest autorun
```

`.lighthouserc.json` :
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/fr"],
      "numberOfRuns": 1
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Anti-patterns

1. **NE PAS** utiliser `npm` ou `yarn` dans les workflows — le projet est pnpm.
2. **NE PAS** activer daily-pipeline.yml — `if: false` obligatoire jusqu'à Sprint 2b.
3. **NE PAS** committer de vraies API keys — les secrets vont dans GitHub Settings > Secrets.
4. **NE PAS** utiliser `lhci` avec token LHCI Server — utiliser `temporary-public-storage` pour l'upload en Sprint 1.

### References

- `docs/planning-artifacts/architecture.md` — Decision 13 (CI/CD : 3 workflows)
- `docs/planning-artifacts/architecture.md` — Decision 12 (Cloudflare Pages hosting)
- `docs/planning-artifacts/epics.md#Story-1.7`
- `docs/planning-artifacts/architecture.md` — Secrets : ANTHROPIC_API_KEY, FINNHUB_API_KEY, FRED_API_KEY, R2_*

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) — via bmad-create-story

### Debug Log References

- Lighthouse CI utilise `startServerCommand` dans `.lighthouserc.json` plutôt que `next start &` en shell — plus propre et portable

### Completion Notes List

- 3 workflows créés : build-check.yml, lighthouse-ci.yml, daily-pipeline.yml
- `.lighthouserc.json` à la racine — seuils ≥ 90 sur performance, accessibility, best-practices, seo
- daily-pipeline.yml : `if: false` au niveau job, cron 6h UTC + workflow_dispatch, 7 steps commentés avec tous les secrets Sprint 2
- build-check.yml : pnpm/action-setup@v4 + cache pnpm, Node 20, 4 steps (typecheck → lint → build)

### File List

**Nouveaux fichiers :**
- `.github/workflows/build-check.yml`
- `.github/workflows/lighthouse-ci.yml`
- `.github/workflows/daily-pipeline.yml`
- `.lighthouserc.json`
