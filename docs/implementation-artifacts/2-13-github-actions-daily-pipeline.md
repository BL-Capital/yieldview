# Story 2.13 : GitHub Actions `daily-pipeline.yml`

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
**I want** activer le workflow `.github/workflows/daily-pipeline.yml` qui execute la sequence complete du pipeline data chaque jour ouvre a 7h UTC,
**so that** le pipeline tourne automatiquement sans intervention manuelle, avec possibilite de declenchement manuel pour les tests.

**Business value :** Ce workflow est le chef d'orchestre de tout le pipeline data. Sans lui, il faut lancer chaque script a la main. Son activation automatise la production quotidienne du briefing editorial pour les utilisateurs de YieldField.

---

## Acceptance Criteria

**AC1 -- Activation du workflow**

- [ ] Supprimer `if: false` du job `pipeline` (ligne qui desactive le workflow)
- [ ] Le workflow est actif et peut etre declenche

**AC2 -- Schedule cron**

- [ ] Cron change de `0 6 * * *` a `0 7 * * 1-5` (7h UTC = 8h/9h Paris, jours ouvres uniquement)
- [ ] `workflow_dispatch` conserve pour declenchement manuel (deja present)

**AC3 -- Steps du pipeline (4 etapes sequentielles)**

- [ ] Step 1 : `pnpm tsx scripts/pipeline/fetch-data.ts` avec env FINNHUB_API_KEY, FRED_API_KEY, ALPHA_VANTAGE_API_KEY
- [ ] Step 2 : `pnpm tsx scripts/pipeline/compute-alert.ts` avec env R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT
- [ ] Step 3 : `pnpm tsx scripts/pipeline/generate-ai.ts` avec env ANTHROPIC_API_KEY, FINNHUB_API_KEY, FRED_API_KEY, ALPHA_VANTAGE_API_KEY, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT
- [ ] Step 4 : `pnpm tsx scripts/pipeline/publish-r2.ts` avec env R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT

**AC4 -- Setup pnpm/node/install**

- [ ] `pnpm/action-setup@v4` SANS champ `version:` (utilise `packageManager` du `package.json` = `pnpm@10.33.0`)
- [ ] `actions/setup-node@v4` avec `node-version: '20'` et `cache: 'pnpm'`
- [ ] `pnpm install --frozen-lockfile`

**AC5 -- Environment variables (GitHub Secrets)**

- [ ] Secrets requis documentes dans le workflow (commentaires):
  - `FINNHUB_API_KEY`
  - `FRED_API_KEY`
  - `ALPHA_VANTAGE_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
  - `R2_ENDPOINT`
- [ ] Chaque step ne recoit QUE les secrets dont il a besoin (principe du moindre privilege)

**AC6 -- Notification d'echec**

- [ ] Si un step echoue, un step conditionnel `if: failure()` cree une GitHub Issue via `gh issue create`
- [ ] L'issue contient : titre avec date, label `pipeline-failure`, body avec le nom du step qui a echoue et lien vers le run
- [ ] Alternative acceptable : deleguer au script `log-run.ts` (Story 2.14) si celui-ci est deja implemente

**AC7 -- Suppression du code commente**

- [ ] Les blocs TODO commentes sont remplaces par les vrais steps actifs
- [ ] Le commentaire de secrets en haut du fichier est mis a jour avec la liste complete des 8 secrets

**AC8 -- Git**

- [ ] Commit sur branche `emmanuel` : `feat(story-2.13): activate daily-pipeline.yml workflow`

---

## Tasks / Subtasks

- [ ] **Task 1** -- Modifier `.github/workflows/daily-pipeline.yml` (AC1-AC7)
  - [ ] Retirer `if: false` du job `pipeline`
  - [ ] Changer le cron de `'0 6 * * *'` a `'0 7 * * 1-5'`
  - [ ] Mettre a jour le commentaire descriptif du cron
  - [ ] Mettre a jour le bloc commentaire des secrets requis (ajouter R2_BUCKET_NAME, R2_ENDPOINT)
  - [ ] Remplacer le bloc TODO Story 2.5 par le vrai step `Fetch data`
  - [ ] Ajouter step `Compute alert` (absent du fichier actuel)
  - [ ] Remplacer le bloc TODO Story 2.10 par le vrai step `Generate AI briefing`
  - [ ] Remplacer le bloc TODO Story 2.12 par le vrai step `Publish to R2`
  - [ ] Ajouter step conditionnel `Notify failure` avec `if: failure()`
  - [ ] Supprimer le bloc TODO Story 2.14 (log-run) -- sera ajoute dans Story 2.14

- [ ] **Task 2** -- Valider le YAML localement
  - [ ] Verifier la syntaxe YAML (indentation, pas de tabs)
  - [ ] `pnpm run typecheck` passe toujours
  - [ ] `pnpm run lint` passe toujours

- [ ] **Task 3** -- Git commit : `feat(story-2.13): activate daily-pipeline.yml workflow`

- [ ] **Task 4** -- Update story status -> review

---

## Dev Notes

### Fichier cible unique

Ce story ne modifie qu'UN SEUL fichier : `.github/workflows/daily-pipeline.yml`. Aucun script TypeScript a creer ou modifier.

### Workflow YAML final attendu

Le fichier doit ressembler a ceci apres modification :

```yaml
name: Daily Pipeline

on:
  schedule:
    - cron: '0 7 * * 1-5'   # 7h UTC (8h/9h Paris), jours ouvres
  workflow_dispatch:          # Manual trigger for testing

jobs:
  pipeline:
    name: Fetch -> Generate -> Publish
    runs-on: ubuntu-latest

    # Secrets to configure in GitHub Settings > Secrets and variables > Actions:
    # - FINNHUB_API_KEY
    # - FRED_API_KEY
    # - ALPHA_VANTAGE_API_KEY
    # - ANTHROPIC_API_KEY
    # - R2_ACCESS_KEY_ID
    # - R2_SECRET_ACCESS_KEY
    # - R2_BUCKET_NAME
    # - R2_ENDPOINT

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        # No version: field — uses packageManager from package.json

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Fetch data
        run: pnpm tsx scripts/pipeline/fetch-data.ts
        env:
          FINNHUB_API_KEY: ${{ secrets.FINNHUB_API_KEY }}
          FRED_API_KEY: ${{ secrets.FRED_API_KEY }}
          ALPHA_VANTAGE_API_KEY: ${{ secrets.ALPHA_VANTAGE_API_KEY }}

      - name: Compute alert
        run: pnpm tsx scripts/pipeline/compute-alert.ts
        env:
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}

      - name: Generate AI briefing
        run: pnpm tsx scripts/pipeline/generate-ai.ts
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          FINNHUB_API_KEY: ${{ secrets.FINNHUB_API_KEY }}
          FRED_API_KEY: ${{ secrets.FRED_API_KEY }}
          ALPHA_VANTAGE_API_KEY: ${{ secrets.ALPHA_VANTAGE_API_KEY }}
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}

      - name: Publish to R2
        run: pnpm tsx scripts/pipeline/publish-r2.ts
        env:
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}

      - name: Notify failure
        if: failure()
        run: |
          gh issue create \
            --title "Pipeline failure $(date -u +%Y-%m-%d)" \
            --label "pipeline-failure" \
            --body "Pipeline run failed on $(date -u +%Y-%m-%dT%H:%M:%SZ).

          **Failed run:** ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}

          Please investigate and re-run manually via workflow_dispatch if needed."
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Points d'attention critiques

1. **PAS de `version:` dans `pnpm/action-setup@v4`** -- Lecon du Sprint 2a CI fix. Le champ `packageManager: "pnpm@10.33.0"` dans `package.json` est la source de verite. Ajouter `version:` dans l'action causerait un conflit.

2. **`generate-ai.ts` a besoin de TOUTES les env vars** -- Ce script appelle en interne `buildKpis()` (qui fetch Finnhub/FRED) et `buildAlert()` (qui lit R2). Donc il necessite les secrets des 3 APIs + R2. Ne pas oublier de les passer.

3. **`compute-alert.ts` a besoin de R2** -- Ce script lit `vix-history/vix-252d.json` depuis R2 et met a jour l'historique. Il a besoin des credentials R2.

4. **`gh issue create` necessite `GITHUB_TOKEN`** -- Ce secret est fourni automatiquement par GitHub Actions, pas besoin de le configurer dans les secrets du repo. Mais il DOIT etre passe en env au step `Notify failure`.

5. **Label `pipeline-failure`** -- Ce label doit exister dans le repo GitHub. Le step `gh issue create` echouera silencieusement si le label n'existe pas. Le dev agent doit soit creer le label manuellement, soit utiliser `--label ""` sans label, soit ajouter un step qui cree le label via `gh label create pipeline-failure --color d73a4a --force`.

6. **Pas de step `log-run.ts`** -- Ce step sera ajoute dans Story 2.14. Ne pas l'inclure dans cette story.

7. **Pas de step `pending-r2.ts` ni `newsletter.ts`** -- La sequence simplifiee par Emmanuel est : fetch-data -> compute-alert -> generate-ai -> publish-r2. Les steps `pending-r2` et `newsletter` ne sont pas dans le scope de cette story.

8. **Cron GitHub Actions peut avoir un retard jusqu'a 60 min** (Architecture risk A4). Le cron 7h UTC donne une marge de 1h30-2h30 avant 9h30 CET (heure de publication cible).

### Pattern de reference : build-check.yml

Le setup pnpm/node/install est identique a `build-check.yml` :
- `actions/checkout@v4`
- `pnpm/action-setup@v4` (sans `version:`)
- `actions/setup-node@v4` avec `node-version: '20'` et `cache: 'pnpm'`
- `pnpm install --frozen-lockfile`

Copier exactement ce pattern. Ne pas inventer de variante.

### Scripts existants dans le repo

- `scripts/pipeline/fetch-data.ts` -- existe (Story 2.5, commit `2f4c607`)
- `scripts/pipeline/compute-alert.ts` -- existe (Story 2.7, commit `47f1979`)
- `scripts/pipeline/bootstrap-vix-history.ts` -- existe (Story 2.6, one-shot, pas dans le pipeline)
- `scripts/pipeline/generate-ai.ts` -- Story 2.10, a implementer dans ce sprint (2b)
- `scripts/pipeline/publish-r2.ts` -- Story 2.12, a implementer dans ce sprint (2b)

Les scripts 2.10 et 2.12 n'existent pas encore au moment de cette story. Le workflow les referencera, mais le premier run manuel ne fonctionnera qu'une fois ces stories completees.

### Project Structure Notes

- Fichier unique modifie : `.github/workflows/daily-pipeline.yml`
- Aucun nouveau fichier cree
- Coherent avec la structure definie dans Architecture section 3.6 (Source Tree)

### References

- [Source: docs/planning-artifacts/epics.md#Story 2.13]
- [Source: docs/planning-artifacts/architecture.md#Decision 7 — Pattern de communication pipeline]
- [Source: docs/planning-artifacts/architecture.md#Decision 13 — CI/CD]
- [Source: docs/planning-artifacts/architecture.md#Decision 5 — Secrets management]
- [Source: docs/planning-artifacts/architecture.md#Risk A4 — GitHub Actions cron retard]
- [Source: .github/workflows/build-check.yml — pnpm setup pattern]
- [Source: .github/workflows/daily-pipeline.yml — current disabled workflow]

---

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
