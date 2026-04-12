# Story 1.6 : Pre-commit hook de détection de secrets

Status: review
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story + bmad-dev-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un hook pre-commit qui bloque les commits contenant des secrets/API keys,
**so that** aucune clé API (Anthropic, Finnhub, FRED, GitHub) ne soit accidentellement commitée dans le repo public/privé.

**Business value :** Sprint 2 introduit les clés API (Anthropic, Finnhub, FRED, R2). Une fuite accidentelle coûterait cher (rotation manuelle, exposition public). Ce hook est la dernière ligne de défense locale avant GitHub secret scanning.

---

## Acceptance Criteria

**AC1 — Scripts existants et vérifiés**

- [x] `scripts/pre-commit` existe et contient les patterns de détection
- [x] `scripts/setup-hooks.sh` existe et copie le hook dans `.git/hooks/`

**AC2 — Hook installé et actif**

- [x] `.git/hooks/pre-commit` installé (contenu identique à `scripts/pre-commit`)
- [x] Hook exécutable

**AC3 — Test fonctionnel**

- [x] Commit d'un fichier avec pattern `sk-ant-*` → bloqué (exit 1)
- [x] Commit d'un fichier avec pattern `API_KEY="..."` → bloqué (exit 1)
- [x] Commit normal sans secret → passe (exit 0)

**AC4 — Git workflow**

- [x] Commit sur `emmanuel` avec message `chore(story-1.6): verify pre-commit hook secrets detection`

---

## Tasks / Subtasks

- [x] **Task 1** — Vérifier scripts existants (AC1)
  - [x] `scripts/pre-commit` : 14 patterns (AWS, OpenAI, GitHub PAT, Anthropic, Slack, Google, generic secrets, private keys, connection strings, .env)
  - [x] `scripts/setup-hooks.sh` : copie `scripts/pre-commit` → `.git/hooks/pre-commit` + chmod +x

- [x] **Task 2** — Vérifier installation hook (AC2)
  - [x] `.git/hooks/pre-commit` présent et contenu identique à `scripts/pre-commit` (diff = line endings CRLF/LF Windows uniquement)
  - [x] Hook déjà actif depuis Story 1.1

- [x] **Task 3** — Test fonctionnel (AC3)
  - [x] Fichier `test_secret_tmp.txt` avec `sk-ant-api03-FakeTestKey...` → BLOCKED, exit 1 ✓
  - [x] Pattern `API_KEY="..."` → BLOCKED ✓
  - [x] Cleanup fichier test après vérification

- [x] **Task 4** — Git commit (AC4)

- [x] **Task 5** — Update story file → status review

---

## Dev Notes

### Patterns détectés par le hook

Le script `scripts/pre-commit` détecte :
1. `AKIA[0-9A-Z]{16}` — AWS Access Key
2. `sk-[a-zA-Z0-9]{20,}` — OpenAI / Stripe
3. `ghp_[a-zA-Z0-9]{36}` — GitHub PAT
4. `gho_[a-zA-Z0-9]{36}` — GitHub OAuth
5. `github_pat_[a-zA-Z0-9_]{22,}` — GitHub fine-grained PAT
6. `xox[bporas]-*` — Slack token
7. `sk-ant-[a-zA-Z0-9-]{20,}` — **Anthropic API key** (critique Sprint 2)
8. `AIza[0-9A-Za-z_-]{35}` — Google API key
9. Generic `password=`, `secret=`, `token=`, `api_key=`
10. `-----BEGIN PRIVATE KEY-----`
11. Connection strings MongoDB, PostgreSQL, MySQL, Redis
12. `.env` files bloqués directement
13. `DB_PASSWORD`, `DATABASE_URL`, `SMTP_PASSWORD` (env var names)

### Clés prévues Sprint 2 — couvertes

- `ANTHROPIC_API_KEY` → pattern #7 (`sk-ant-*`)
- `FINNHUB_API_KEY` → pattern #9 (generic `api_key=`)
- `FRED_API_KEY` → pattern #9
- `R2_SECRET_ACCESS_KEY` → pattern #9 + AWS-like

### Setup pour nouveau développeur

```bash
bash scripts/setup-hooks.sh
```

### Fichiers ignorés par le hook

- `.git/`, `node_modules/`, `*.lock`, `package-lock.json`, `*.sample`, `scripts/pre-commit`

### GitHub secret scanning

GitHub secret scanning + push protection déjà activés sur BL-Capital/yieldview (git_workflow.md) — double protection.

### References

- `scripts/pre-commit` — hook source (versionné dans le repo)
- `scripts/setup-hooks.sh` — script d'installation
- `docs/planning-artifacts/epics.md#Story-1.6`

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) — via bmad-create-story + bmad-dev-story

### Debug Log References

- Hook déjà installé depuis Story 1.1. Diff `scripts/pre-commit` vs `.git/hooks/pre-commit` = line endings CRLF/LF (Windows) seulement — contenu identique.
- Test avec `sk-ant-api03-FakeTestKey...` → BLOCKED ✓, exit 1 ✓

### Completion Notes List

- Scripts pre-commit existants et vérifiés (14 patterns)
- Hook `.git/hooks/pre-commit` déjà actif
- Test fonctionnel : faux secret Anthropic bloqué correctement
- Aucune modification de code requise — story = vérification + documentation

### File List

**Fichiers vérifiés (non modifiés) :**
- `scripts/pre-commit`
- `scripts/setup-hooks.sh`
- `.git/hooks/pre-commit` (non versionné)

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-12 | 0.1.0 | Story 1.6 créée et implémentée. Scripts pre-commit vérifiés, hook actif, test fonctionnel. | claude-opus-4-6[1m] via bmad-dev-story |
