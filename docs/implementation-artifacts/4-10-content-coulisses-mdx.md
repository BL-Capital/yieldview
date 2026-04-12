# Story 4.10 : Content Coulisses — 5+ Étapes (messages i18n)

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur de la page Coulisses (FR et EN),
**I want** lire l'histoire complète de la création de YieldField en 5+ étapes claires,
**so that** je comprends la démarche BMAD + pipeline IA et Bryan démontre son expertise concrètement.

**Business value :** Le contenu est le cœur de la page Coulisses. Sans contenu réel et convaincant, les composants visuels ne servent à rien. Cette story fournit le texte FR/EN pour les 5 étapes.

---

## Acceptance Criteria

**AC1 -- Structure messages i18n**
- [ ] `messages/fr/coulisses.json` créé avec toutes les étapes en français
- [ ] `messages/en/coulisses.json` créé avec toutes les étapes en anglais
- [ ] Structure cohérente avec les messages existants (next-intl)
- [ ] Intégré dans `messages/fr.json` et `messages/en.json` sous clé `"coulisses"`

**AC2 -- Étape 1 : L'idée originelle**
- [ ] Titre : "L'idée originelle" / "The Original Idea"
- [ ] Date : Janvier 2026
- [ ] Description : Bryan, PO niveau 2, veut un magazine financier automatisé accessible au grand public
- [ ] Élément visuel : citation marquante de Bryan (blockquote stylisé)

**AC3 -- Étape 2 : La méthode BMAD**
- [ ] Titre : "Méthode BMAD" / "The BMAD Method"
- [ ] Date : Février 2026
- [ ] Description : Méthodologie agile IA BMAD v6.3.0 — du PRD aux épics aux stories
- [ ] Élément visuel : Diagram SVG simple du workflow BMAD (Analyst → PM → Architect → Dev)
- [ ] SVG inline ou fichier `public/images/bmad-workflow.svg`

**AC4 -- Étape 3 : Le pipeline nocturne**
- [ ] Titre : "Le pipeline nocturne" / "The Nightly Pipeline"
- [ ] Date : Mars 2026
- [ ] Description : GitHub Actions 2h UTC, APIs (Finnhub + FRED + Alpha Vantage), Claude Sonnet, R2
- [ ] Élément visuel : Diagram SVG pipeline (Actions → APIs → Claude → R2 → Site)
- [ ] SVG inline ou fichier `public/images/pipeline-flow.svg`

**AC5 -- Étape 4 : L'évolution des prompts**
- [ ] Titre : "Prompts : de v01 à v06" / "Prompts: from v01 to v06"
- [ ] Date : Mars–Avril 2026
- [ ] Description : 6 itérations du prompt principal, de générique à expert sectoriel
- [ ] Contenu : textes des 6 versions de prompts (extraits réels ou représentatifs)
- [ ] Destiné au composant `<PromptCodeBlock>` (Story 4.8)

**AC6 -- Étape 5 : Déploiement Cloudflare**
- [ ] Titre : "Déploiement Cloudflare" / "Cloudflare Deployment"
- [ ] Date : Avril 2026
- [ ] Description : Next.js sur Cloudflare Pages, R2 pour les données, 8€/mois tout compris
- [ ] Metrics : 166 kB bundle, 224 tests, 4/4 security gates

**AC7 -- Étape 6 (optionnelle) : L'avatar Rive**
- [ ] Titre : "L'avatar Rive" / "The Rive Avatar"
- [ ] Meta-narrative : comment l'avatar lui-même a été conçu avec l'IA

**AC8 -- Qualité du contenu**
- [ ] Tonalité : professionnelle mais accessible, première personne (Bryan raconte)
- [ ] FR et EN : traductions fidèles, pas de traduction automatique déguisée
- [ ] Prompts v01-v06 : plausibles, progressifs (générique → spécialisé)

**AC9 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur (fichiers JSON valides)
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
messages/fr/coulisses.json  (ou section dans messages/fr.json)
messages/en/coulisses.json  (ou section dans messages/en.json)
public/images/bmad-workflow.svg
public/images/pipeline-flow.svg
```

### Pattern next-intl existant
Vérifier la structure actuelle de `messages/fr.json` et `messages/en.json` avant de créer.
Si les messages sont en fichier unique, ajouter la clé `"coulisses"` directement dedans.

### Contenu prompts v01-v06 (évolution attendue)
- v01 : "Analyse la bourse et donne un résumé"
- v02 : "En tant qu'analyste financier, résume les marchés..."
- v03 : Ajout VIX, S&P 500, données structurées
- v04 : Ajout format JSON strict + alerte niveau risque
- v05 : Personnalité Bryan, ton magazine premium
- v06 : Version finale avec chain-of-thought + output bilingue

### Dépendances
- Story 1.4 : next-intl setup (pattern i18n existant)
- Story 4.8 : PromptCodeBlock (consommera les prompts)
- Story 4.11 : page Coulisses (consommera tout le contenu)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
