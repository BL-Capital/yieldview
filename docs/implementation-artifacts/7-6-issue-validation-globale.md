# Story 7.6: Issue GitHub de validation globale pour Bryan

Status: done

<!-- Note: Story technique owner Emmanuel. Validation = issue créée sur BL-Capital/yieldview, assignée Bryan. -->

## Story

As a PO Bryan,
I want une issue GitHub récapitulative de la V1 complète avec tous les livrables BMAD,
so that je puisse faire ma recette globale du MVP et donner mon go officiel pour le launch.

## Acceptance Criteria

1. **AC1** — Issue créée dans `BL-Capital/yieldview` avec titre `[V1] Recette globale YieldField MVP — Go/No-Go Launch`
2. **AC2** — Issue assignée à `SupraPirox` (Bryan), labels `validation` + `sprint-7` appliqués
3. **AC3** — 6 livrables BMAD v6.3.0 listés avec liens relatifs vers les fichiers du repo
4. **AC4** — Métriques MVP incluses (62 stories, 165 pts, 351 tests, 54/54 FRs, 246 KB homepage)
5. **AC5** — Checklist de recette actionnable pour Bryan (fonctionnel, design, contenu, Sprint 7 actions)
6. **AC6** — Labels `validation` et `sprint-7` créés dans le repo (si inexistants)

## Tasks / Subtasks

- [x] Task 1 — Créer les labels GitHub si manquants (AC: 6)
  - [x] Vérifier l'existence du label `validation` : `gh label list --repo BL-Capital/yieldview`
  - [x] Labels `validation` et `sprint-7` déjà présents — aucune action requise

- [x] Task 2 — Vérifier le body de l'issue (AC: 3, 4, 5)
  - [x] `docs/ops/issue-validation-globale.md` vérifié : 6 livrables BMAD présents
  - [x] Métriques exactes (62 stories, 165 pts, 351 tests)
  - [x] Checklist de recette complète et actionnelle

- [x] Task 3 — Créer l'issue GitHub (AC: 1, 2)
  - [x] Issue #12 créée : https://github.com/BL-Capital/yieldview/issues/12
  - [x] Titre : "[V1] Recette globale YieldField MVP — Go/No-Go Launch"
  - [x] Assignée à SupraPirox, labels validation + sprint-7

- [x] Task 4 — Mettre à jour le README avec référence à l'issue (AC: 1)
  - [x] `README.md` mis à jour avec lien vers Issue #12

## Dev Notes

### Commandes gh CLI
```bash
# Vérifier les labels existants
gh label list --repo BL-Capital/yieldview

# Créer les labels manquants
gh label create "validation" --repo BL-Capital/yieldview --description "Validation & recette PO" --color "0052cc"
gh label create "sprint-7" --repo BL-Capital/yieldview --description "Sprint 7 - Launch & GTM" --color "e4e669"

# Créer l'issue
gh issue create \
  --repo BL-Capital/yieldview \
  --title "[V1] Recette globale YieldField MVP — Go/No-Go Launch" \
  --assignee SupraPirox \
  --label "validation,sprint-7" \
  --body-file "docs/ops/issue-validation-globale.md"

# Vérifier
gh issue view [numero] --repo BL-Capital/yieldview
```

### Métriques à valider avant création
- 62 stories DONE (Epic 1-6) — vérifier sprint-status.yaml
- 165 points livrés
- 351 tests passants — vérifier dernier run `pnpm test`
- 54/54 FRs, 23/23 NFRs
- Bundle homepage 246 KB, Coulisses 185 KB
- TypeCheck clean, build OK

### README update
```markdown
## Validation V1

Issue de recette Bryan → **#[N] [V1] Recette globale YieldField MVP — Go/No-Go Launch**
```

### Project Structure Notes
- Modifications : `README.md` (1 ligne ajoutée)
- Fichier body issue : `docs/ops/issue-validation-globale.md` (déjà créé)
- Pas de modification du code source Next.js

### References
- [Source: docs/planning-artifacts/epics.md#Story-7.6] — ACs originaux
- [Source: docs/ops/issue-validation-globale.md] — body complet de l'issue
- [Source: docs/implementation-artifacts/sprint-status.yaml] — métriques sprint

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-dev-story (2026-04-13)

### Debug Log References

Aucune erreur. Labels déjà présents, gh CLI authentifié, issue créée au premier essai.

### Completion Notes List

- ✅ Labels `validation` + `sprint-7` vérifiés présents dans BL-Capital/yieldview
- ✅ Issue #12 créée : https://github.com/BL-Capital/yieldview/issues/12
- ✅ Assignée SupraPirox, body complet avec 6 livrables BMAD + métriques + checklist recette
- ✅ README.md mis à jour avec référence à l'Issue #12
- Tous les ACs (AC1-AC6) satisfaits

### File List

- README.md (modifié — ajout référence issue #12)
- docs/ops/issue-validation-globale.md (lu — body de l'issue, non modifié)
- docs/implementation-artifacts/sprint-status.yaml (mis à jour — statut 7-6 in-progress)
