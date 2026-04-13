# Story 7.2: Revue juridique AMF ponctuelle

Status: ready-for-dev

<!-- Note: Story opérationnelle owner Bryan. Validation = document juriste reçu, go légal explicite. -->

## Story

As a PO Bryan,
I want une validation juridique AMF sur les formulations du site,
so that YieldField soit publiable sans risque légal en France.

## Acceptance Criteria

1. **AC1** — Juriste spécialisé finance/AMF identifié et contacté (budget ≤ 500€)
2. **AC2** — Disclaimer principal homepage validé (formulations "pas de conseil en investissement")
3. **AC3** — Prompt système `prompts/briefing-v01.md` validé (proscription list + formulations génératives)
4. **AC4** — Cas limites validés : mode `crisis`, niveaux LOW/MEDIUM/HIGH/CRISIS
5. **AC5** — Document écrit du juriste reçu (email ou PDF) → go légal explicite pour publication publique
6. **AC6** — Éventuelles corrections mineures appliquées dans le code (si juriste le demande)

## Tasks / Subtasks

- [ ] Task 1 — Identifier et contacter un juriste AMF (AC: 1)
  - [ ] Utiliser le template `docs/ops/7-2-template-juriste.md` pour le message de prise de contact
  - [ ] Juriste trouvé via réseau LinkedIn ou plateforme spécialisée (LegalPlace, Doctrine, Avocats.fr)
  - [ ] Devis reçu ≤ 500€
  - [ ] Mission confirmée et planifiée

- [ ] Task 2 — Soumettre le disclaimer principal (AC: 2)
  - [ ] Extraire le texte du disclaimer depuis `messages/fr.json` (section footer) + `src/components/layout/Footer.tsx`
  - [ ] Soumettre au juriste avec contexte (site info financière, pas de conseil)
  - [ ] Appliquer les corrections si demandées dans `messages/fr.json` et `messages/en.json`

- [ ] Task 3 — Soumettre le prompt système IA (AC: 3)
  - [ ] Extraire le contenu de `src/content/prompts/` (prompt v01 Chartiste Lettré)
  - [ ] Soumettre proscription list + formulations génératives
  - [ ] Appliquer corrections si nécessaire

- [ ] Task 4 — Valider les cas limites (AC: 4)
  - [ ] Soumettre les types `riskLevel` de `src/types/schemas.ts` (LOW/MEDIUM/HIGH/CRISIS)
  - [ ] Soumettre le wording `<CrisisIndicator>` et `<AlertBanner>`
  - [ ] Appliquer corrections si nécessaire

- [ ] Task 5 — Obtenir le go légal (AC: 5)
  - [ ] Document juriste reçu
  - [ ] Go légal explicite pour publication publique documenté
  - [ ] Archiver le document dans un dossier sécurisé (NE PAS committer dans le repo)

- [ ] Task 6 — Appliquer les corrections code si demandées (AC: 6)
  - [ ] Si corrections dans `messages/fr.json` ou `messages/en.json` → appliquer
  - [ ] Si corrections dans les prompts → appliquer dans `src/content/prompts/`
  - [ ] Si corrections dans les composants UI → appliquer dans le code concerné
  - [ ] Rebuild + tests si modifications code

## Dev Notes

### Fichiers concernés par la revue juridique
- `messages/fr.json` — disclaimer, labels de risque, wording alert
- `messages/en.json` — même contenus en anglais
- `src/content/prompts/briefing-v01.md` — prompt système Chartiste Lettré
- `src/components/alerts/AlertBanner.tsx` — wording mode crisis
- `src/components/alerts/CrisisIndicator.tsx` — wording indicateurs de risque
- `src/types/schemas.ts` — types `riskLevel` (LOW/MEDIUM/HIGH/CRISIS)
- `src/components/layout/Footer.tsx` — disclaimer principal

### Contexte réglementaire
- Site information financière uniquement — pas de conseil en investissement
- Proscription list en place dans le prompt : pas de "acheter", "vendre", "je conseille"
- Format éditorial "analyse factuelle" — à valider par juriste AMF

### Project Structure Notes
- Modifications potentielles : fichiers de messages i18n et prompts uniquement
- Pas de modification d'architecture
- Si corrections code → rebuild + `pnpm run typecheck` + `pnpm test`

### References
- [Source: docs/planning-artifacts/prd.md#Legal] — contexte réglementaire
- [Source: docs/planning-artifacts/architecture.md#Security] — disclaimers
- [Source: docs/ops/7-2-template-juriste.md] — template email juriste

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-create-story

### Debug Log References

### Completion Notes List

### File List
