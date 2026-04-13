# Story 7.4: Hard launch coordonné (jour J)

Status: ready-for-dev

<!-- Note: Story opérationnelle owner Bryan. Validation = contenu publié sur tous les canaux jour J. -->

## Story

As a PO Bryan,
I want coordonner un hard launch multi-canal sur une journée,
so that YieldField atteigne une masse critique d'audience le jour J et génère un effet d'accumulation sociale.

## Acceptance Criteria

1. **AC1** — Post LinkedIn long-form de Bryan publié le jour J à 9h00 CET
2. **AC2** — Thread X de 6 tweets publié le jour J à 9h15 CET
3. **AC3** — Show HN soumis à 15h00 CET jour J
4. **AC4** — Posts Reddit (r/FinancialCareers + r/FrenchInvest) publiés à 10h00 CET
5. **AC5** — Fiche Product Hunt planifiée pour J+3
6. **AC6** — Bryan répond à tous les commentaires sous 1h pendant les 48h suivant le launch

## Tasks / Subtasks

- [ ] Task 1 — Prérequis (Story 7.1 + 7.2 + 7.3 DONE) (AC: tous)
  - [ ] Domaine public actif (Story 7.1 done)
  - [ ] Go légal AMF obtenu (Story 7.2 done)
  - [ ] 10 briefings consécutifs validés en staging (Story 7.3 done)
  - [ ] `robots.txt` disallow retiré sur le domaine principal (production = indexable)

- [ ] Task 2 — Préparer les contenus J-3 (AC: 1, 2, 3, 4, 5)
  - [ ] Post LinkedIn long-form rédigé (template : `docs/ops/7-4-playbook-hard-launch.md`)
  - [ ] Thread X 6 tweets rédigé
  - [ ] Show HN title + first comment rédigés
  - [ ] Posts Reddit r/FinancialCareers et r/FrenchInvest rédigés
  - [ ] GIF démo 30s enregistré (walkthrough homepage + coulisses)
  - [ ] Fiche Product Hunt créée (titre, tagline, description, screenshots, GIF)

- [ ] Task 3 — Jour J : exécution multi-canal (AC: 1, 2, 3, 4)
  - [ ] 9h00 CET — Post LinkedIn publié
  - [ ] 9h15 CET — Thread X publié
  - [ ] 10h00 CET — Posts Reddit publiés
  - [ ] 15h00 CET — Show HN soumis (`news.ycombinator.com/submit`)

- [ ] Task 4 — Product Hunt J+3 (AC: 5)
  - [ ] Fiche Product Hunt soumise pour lancement J+3
  - [ ] Early supporters notifiés pour upvote

- [ ] Task 5 — Engagement 48h (AC: 6)
  - [ ] Bryan monitore LinkedIn, X, HN, Reddit
  - [ ] Réponse à tous les commentaires sous 1h pendant 48h

## Dev Notes

### Retirer le disallow production (robots.txt)
```typescript
// src/app/robots.ts — pour le domaine principal (production)
// S'assurer que NEXT_PUBLIC_IS_STAGING n'est pas défini en production
// Le robots() retournera alors: { rules: { userAgent: '*', allow: '/' } }
```

### Vérifier avant le jour J
```bash
# Vérifier que le site est indexable
curl https://[domaine]/robots.txt
# Doit retourner Allow: / (pas de Disallow)

# Vérifier l'OG image pour les partages sociaux
curl -I "https://[domaine]/api/og?locale=fr" | grep content-type
# Doit retourner image/png

# Vérifier la carte Twitter
# https://cards-dev.twitter.com/validator → entrer l'URL
```

### Canaux par priorité
1. **LinkedIn** (audience principale Bryan — finance FR)
2. **Show HN** (audience tech internationale — ROI fort si > 10 points)
3. **Reddit** (niches ciblées — FinancialCareers + FrenchInvest)
4. **Product Hunt** (J+3 — laisse le buzz LinkedIn retomber)

### Project Structure Notes
- Modification code minimale : robots.ts (retirer disallow staging si même config)
- Sinon : variable env `NEXT_PUBLIC_IS_STAGING` simplement absente en production

### References
- [Source: docs/planning-artifacts/prd.md#Distribution] — stratégie distribution
- [Source: docs/ops/7-4-playbook-hard-launch.md] — playbook complet avec templates

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-create-story

### Debug Log References

### Completion Notes List

### File List
