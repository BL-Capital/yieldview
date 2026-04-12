# Story 6.1 : Lighthouse CI config + gates

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 3
Priority: P0
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** développeur responsable de la qualité,
**I want** un pipeline Lighthouse CI qui bloque les merges si les scores tombent sous 90,
**so that** le site maintient un niveau de performance, accessibilité, SEO et bonnes pratiques garanti.

**Business value :** Gate automatique qui empêche les régressions de performance — un site finance lent perd la crédibilité instantanément.

---

## Acceptance Criteria

**AC1 -- Installation @lhci/cli**
- [ ] `@lhci/cli` ajouté en devDependency
- [ ] Script `"lighthouse"` ajouté dans package.json : `lhci autorun`
- [ ] Fonctionne en local avec `pnpm run lighthouse`

**AC2 -- Configuration .lighthouserc.json**
- [ ] Fichier `.lighthouserc.json` à la racine du projet
- [ ] `ci.collect` : URLs à tester = `/fr`, `/fr/coulisses`, `/fr/not-found`
- [ ] `ci.collect.settings` : `--chrome-flags="--headless --no-sandbox"`
- [ ] `ci.collect.numberOfRuns` : 3 (median)
- [ ] `ci.assert` : thresholds ≥ 0.90 sur `performance`, `accessibility`, `best-practices`, `seo`
- [ ] `ci.upload` : target `filesystem`, outputDir `.lighthouseci/`

**AC3 -- GitHub Actions lighthouse-ci.yml**
- [ ] `.github/workflows/lighthouse-ci.yml` mis à jour (existant en squelette)
- [ ] Trigger : push to main + PR to main
- [ ] Steps : checkout → setup Node 20 → pnpm install → pnpm build → lhci autorun
- [ ] Bloc si assert échoue (exit code ≠ 0)
- [ ] Artefacts `.lighthouseci/` uploadés

**AC4 -- Premier audit passe**
- [ ] Lancer `pnpm run lighthouse` localement
- [ ] Les 4 scores ≥ 90 sur `/fr`
- [ ] Si score < 90 : identifier et corriger les problèmes bloquants dans cette story

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run build` : 0 erreur

---

## Technical Notes

- Lighthouse CI doit fonctionner avec un build statique Next.js (output: export via Cloudflare Pages)
- Le workflow GH Actions existant `.github/workflows/lighthouse-ci.yml` a un squelette depuis Story 1.7 — le compléter
- Utiliser `lhci collect --static-dist-dir=out` si applicable sur Cloudflare Pages build
- Alternative si pas de static server : `startServerCommand: "pnpm start"` + `url` dans collect

---

## Dependencies

- Aucune dependency de story
- Requires : build fonctionnel (`pnpm build` sans erreur)
