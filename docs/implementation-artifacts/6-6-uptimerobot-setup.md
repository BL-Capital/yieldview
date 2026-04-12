# Story 6.6 : UptimeRobot setup

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 1
Priority: P0
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Bryan (PO),
**I want** une alerte automatique si le site tombe (downtime > 5 min),
**so that** je puisse réagir rapidement en cas de panne.

**Business value :** Un site finance indisponible = perte de crédibilité immédiate. UptimeRobot (gratuit) garantit la détection en < 5 min.

---

## Acceptance Criteria

**AC1 -- Documentation setup UptimeRobot**
- [ ] Guide créé dans `docs/ops/uptimerobot-setup.md`
- [ ] Instructions pas-à-pas pour Bryan : création compte, ajout monitor
- [ ] URL à monitorer : URL de production (ou staging en attendant)
- [ ] Type : HTTP(s) keyword monitor
- [ ] Intervalle : 5 minutes
- [ ] Keyword : vérifier présence de "YieldField" dans le body HTML
- [ ] Alert contact : email Bryan

**AC2 -- Health check endpoint**
- [ ] `src/app/api/health/route.ts` créé
- [ ] Retourne `{ status: "ok", timestamp: ISO }` avec HTTP 200
- [ ] Vérifie qu'un fichier de contenu existe (basic sanity check)
- [ ] Pas d'auth requise

**AC3 -- Status badge (optionnel)**
- [ ] Si Bryan veut une status page publique : documenter la config
- [ ] Badge UptimeRobot linkable dans le README du repo

**AC4 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : test unitaire du health endpoint
- [ ] `pnpm run build` : 0 erreur

---

## Technical Notes

- UptimeRobot est un service externe — pas de code à déployer côté serveur
- Le health endpoint est un simple Route Handler Next.js App Router
- Le setup du compte UptimeRobot sera fait par Bryan (owner du domaine)
- Cette story est principalement de la documentation + un petit endpoint

---

## Dependencies

- Aucune dependency technique
- Bryan doit créer le compte UptimeRobot (gratuit)
