# Story 6.5 : Cloudflare Web Analytics integration

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
**I want** un analytics privacy-first intégré au site sans cookies ni consent banner,
**so that** je puisse suivre le trafic et les tendances sans complexité RGPD.

**Business value :** Observabilité du trafic dès le lancement — Cloudflare Web Analytics est gratuit, cookieless, RGPD-compliant nativement.

---

## Acceptance Criteria

**AC1 -- Script Cloudflare Web Analytics**
- [ ] Balise `<script>` Cloudflare Web Analytics ajoutée dans `src/app/[locale]/layout.tsx`
- [ ] Beacon token stocké dans variable d'environnement `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
- [ ] Script chargé avec `defer` + `data-cf-beacon`
- [ ] Script conditionnel : uniquement en production (`process.env.NODE_ENV === 'production'`)

**AC2 -- Pas de cookie, pas de consent**
- [ ] Vérifier : aucun cookie set par le script CF Analytics
- [ ] Pas de consent banner nécessaire (cookieless by design)
- [ ] Mention dans la page "Mentions légales" que Cloudflare Web Analytics est utilisé (transparence)

**AC3 -- Variable d'environnement**
- [ ] `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` documenté dans `.env.example`
- [ ] Valeur réelle dans les secrets GitHub Actions (pour le build Cloudflare Pages)
- [ ] En dev local : script non chargé (NODE_ENV = development)

**AC4 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run build` : 0 erreur
- [ ] Script présent dans le HTML rendu en prod

---

## Technical Notes

- Le script CF Analytics est un simple `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "..."}'>< /script>`
- Il ne nécessite aucun package npm
- Le token est public (pas un secret sensible) mais on le met en env var pour la flexibilité
- En attendant le vrai token CF, utiliser un placeholder dans `.env.example`

---

## Dependencies

- Aucune dependency technique
- Bryan devra activer Cloudflare Web Analytics sur le dashboard CF pour obtenir le token
