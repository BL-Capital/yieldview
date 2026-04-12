# Story 6.7 : Tests e2e Playwright

Status: draft
Epic: 6 -- Quality, Accessibility, Performance
Sprint: 6 (semaine 7)
Points: 3
Priority: P1
Created: 2026-04-13
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** développeur,
**I want** une suite de tests e2e Playwright couvrant les parcours critiques,
**so that** les régressions soient détectées automatiquement avant chaque déploiement.

**Business value :** Filet de sécurité automatisé — chaque PR est testée end-to-end, empêchant les régressions visuelles et fonctionnelles.

---

## Acceptance Criteria

**AC1 -- Installation et configuration Playwright**
- [ ] `@playwright/test` ajouté en devDependency
- [ ] `playwright.config.ts` créé à la racine
- [ ] Projets configurés : Chromium, Firefox, WebKit (mobile Safari)
- [ ] `baseURL` : `http://localhost:3000`
- [ ] `webServer` configuré pour lancer `pnpm dev` automatiquement
- [ ] Script `"test:e2e"` ajouté dans package.json
- [ ] Dossier `tests/e2e/` créé

**AC2 -- Homepage smoke test**
- [ ] `tests/e2e/homepage.spec.ts` créé
- [ ] Test : page `/fr` charge avec status 200
- [ ] Test : titre h1 contient le texte attendu
- [ ] Test : NumberTickers s'animent et affichent des valeurs
- [ ] Test : CTA "Coulisses" est cliquable et navigue vers `/fr/coulisses`
- [ ] Test : AlertBanner s'affiche si données crisis disponibles

**AC3 -- Coulisses page test**
- [ ] `tests/e2e/coulisses.spec.ts` créé
- [ ] Test : page `/fr/coulisses` charge avec status 200
- [ ] Test : scroll déclenche la Tracing Beam (visible)
- [ ] Test : Prompt Code Block est présent et copiable
- [ ] Test : Timeline steps sont tous visibles au scroll

**AC4 -- i18n switch test**
- [ ] `tests/e2e/i18n.spec.ts` créé
- [ ] Test : switch FR → EN via LanguageSwitcher
- [ ] Test : URL change de `/fr` à `/en`
- [ ] Test : contenu textuel change (vérifier un mot-clé)
- [ ] Test : switch EN → FR fonctionne aussi

**AC5 -- Accessibility e2e (Axe integration)**
- [ ] `tests/e2e/accessibility.spec.ts` créé
- [ ] `@axe-core/playwright` ajouté en devDependency
- [ ] Test : homepage passes Axe audit (0 serious/critical)
- [ ] Test : coulisses page passes Axe audit
- [ ] Test : 404 page passes Axe audit

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tests unitaires existants passent toujours
- [ ] `pnpm run test:e2e` : tous les tests e2e passent
- [ ] `pnpm run build` : 0 erreur

---

## Technical Notes

- Playwright nécessite des browsers installés : `npx playwright install`
- Le `webServer` dans playwright.config.ts lance automatiquement le serveur de dev
- Pour les tests d'accessibilité, `@axe-core/playwright` s'intègre nativement
- Les tests e2e sont plus lents — les séparer du `pnpm test` (vitest) standard
- En CI, utiliser `npx playwright install --with-deps` pour les dépendances système

---

## Dependencies

- Story 6.4 (404/500 pages) pour tester la 404
- Toutes les stories Sprint 1-5 en place pour les parcours testés
