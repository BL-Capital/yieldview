# Story 7.5: Interviews Marc (validation hypothèse)

Status: ready-for-dev

<!-- Note: Story de recherche utilisateur, owner Bryan, P1. Validation = 5 interviews réalisées + synthèse documentée. -->

## Story

As a PO Bryan,
I want interviewer 5 analystes juniors pour valider l'hypothèse Marc,
so that la proposition de valeur de YieldField soit confirmée (ou pivotée) par de vraies données terrain avant la distribution massive.

## Acceptance Criteria

1. **AC1** — 5 analystes juniors recrutés et interviews confirmées via LinkedIn
2. **AC2** — 5 interviews de 20 min réalisées avec le guide `docs/ops/7-5-guide-interviews-marc.md`
3. **AC3** — Sondage Twitter/X diffusé avec minimum 50 votes collectés
4. **AC4** — Synthèse documentée dans `docs/research/interviews-marc.md`
5. **AC5** — Décision documentée : si ≥ 3/5 confirment pain > 30 min/jour → hypothèse validée → continuer. Sinon → update product brief + pivot persona

## Tasks / Subtasks

- [ ] Task 1 — Recruter les 5 interviewés (AC: 1)
  - [ ] Identifier 5 analystes juniors sur LinkedIn (fonds asset management, sell-side, boutiques M&A)
  - [ ] Envoyer le message de contact (template : `docs/ops/7-5-guide-interviews-marc.md`)
  - [ ] 5 créneaux de 20 min confirmés (Calendly ou email)

- [ ] Task 2 — Réaliser les 5 interviews (AC: 2)
  - [ ] Utiliser le script d'interview complet (`docs/ops/7-5-guide-interviews-marc.md`)
  - [ ] Interview 1 — notes prises
  - [ ] Interview 2 — notes prises
  - [ ] Interview 3 — notes prises
  - [ ] Interview 4 — notes prises
  - [ ] Interview 5 — notes prises

- [ ] Task 3 — Lancer le sondage Twitter/X (AC: 3)
  - [ ] Sondage créé : "Analystes financiers : combien de temps pour votre brief matinal ?"
  - [ ] Options : < 15 min / 15–30 min / 30–45 min / > 45 min
  - [ ] Sondage publié et diffusé
  - [ ] ≥ 50 votes collectés

- [ ] Task 4 — Documenter la synthèse (AC: 4, 5)
  - [ ] Créer le dossier `docs/research/` si inexistant
  - [ ] Créer `docs/research/interviews-marc.md` avec la grille de scoring
  - [ ] Comptabiliser : combien confirment pain > 30 min/jour ?
  - [ ] Documenter la décision (validé / pivot)

- [ ] Task 5 — Appliquer la décision si pivot (AC: 5)
  - [ ] Si hypothèse non validée (< 3/5) : mettre à jour `docs/planning-artifacts/product-brief-yieldfield.md` → section personas
  - [ ] Recentrer sur Thomas (gérant patrimoine) ou Sophie (étudiante M2 finance)
  - [ ] Documenter le pivot dans `docs/research/interviews-marc.md`

## Dev Notes

### Personas de référence (product-brief)
- **Marc** (cible principale) : Analyste junior, fonds asset management, 2 ans exp — pain = 45 min/jour d'agrégation manuelle
- **Thomas** : Gérant de patrimoine indépendant — pain secondaire
- **Sophie** : Étudiante M2 finance, stage — early adopter potentiel

### Critère de validation
- **Seuil** : ≥ 3/5 interviewés confirment pain > 30 min/jour de préparation matinale
- **Indicateurs secondaires** : intérêt pour YieldField après démo, volonté de partager à un collègue

### Si modification product-brief après pivot
- Fichier : `docs/planning-artifacts/product-brief-yieldfield.md` section Personas
- Ne pas recréer le PRD/Architecture — seulement le brief si persona change
- Impact V1 : minimal (le produit est générique finance, pas Marc-specific)

### Project Structure Notes
- Nouveau dossier : `docs/research/` (à créer)
- Nouveau fichier : `docs/research/interviews-marc.md`
- Éventuelle modification : `docs/planning-artifacts/product-brief-yieldfield.md` (si pivot)

### References
- [Source: docs/planning-artifacts/product-brief-yieldfield.md#Personas] — Marc, Thomas, Sophie
- [Source: docs/planning-artifacts/prd.md#UserResearch] — hypothèse Marc
- [Source: docs/ops/7-5-guide-interviews-marc.md] — guide complet interviews

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-create-story

### Debug Log References

### Completion Notes List

### File List
