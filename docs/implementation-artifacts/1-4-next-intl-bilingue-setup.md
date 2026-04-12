# Story 1.4 : next-intl bilingue FR/EN setup

Status: review
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** next-intl configuré avec routing `/fr/*` et `/en/*`, messages JSON bilingues, et middleware de détection de locale,
**so that** toutes les stories UI suivantes (1.5 Layout, Epic 3-7) puissent utiliser `useTranslations()` et que le site soit bilingue dès la fondation.

**Business value :** YieldField cible une audience FR (primaire) et EN (secondaire). L'i18n doit être intégrée dès la fondation pour éviter un refactoring coûteux plus tard. Le briefing IA est généré en FR et EN par le pipeline (Epic 2).

---

## Acceptance Criteria

**AC1 — next-intl installé et configuré**

- [ ] `pnpm add next-intl` installé
- [ ] `src/i18n/routing.ts` créé : `defineRouting({ locales: ['fr', 'en'], defaultLocale: 'fr' })`
- [ ] `src/i18n/request.ts` créé : `getRequestConfig` qui charge les messages de la locale courante
- [ ] `src/i18n/navigation.ts` créé : `createNavigation(routing)` exportant `Link`, `redirect`, `usePathname`, `useRouter`

**AC2 — Middleware routing**

- [ ] `src/middleware.ts` créé avec `createMiddleware(routing)`
- [ ] Config `matcher` qui route `/`, `/(fr|en)/:path*` vers les bons layouts
- [ ] Première visite sur `/` redirige vers `/fr/` (defaultLocale = fr)

**AC3 — Structure App Router [locale]**

- [ ] `src/app/[locale]/layout.tsx` créé :
  - `NextIntlClientProvider` wrapping children
  - `setRequestLocale(locale)` pour static rendering
  - `generateStaticParams` retournant `[{locale: 'fr'}, {locale: 'en'}]`
  - Conserve les 3 localFont variables + antialiased + bg-yield-dark + text-yield-ink + className="dark"
- [ ] `src/app/[locale]/page.tsx` créé avec `useTranslations()` smoke test
- [ ] Ancien `src/app/layout.tsx` transformé en layout racine minimal (juste html + body font variables)
- [ ] Ancien `src/app/page.tsx` supprimé ou redirigé

**AC4 — Messages JSON bilingues**

- [ ] `messages/fr.json` créé avec messages initiaux :
  ```json
  {
    "Home": {
      "title": "YieldField",
      "subtitle": "Finance de marché éclairée par l'IA",
      "cta": "Voir les Coulisses"
    },
    "Common": {
      "disclaimer": "Ceci n'est pas un conseil en investissement."
    }
  }
  ```
- [ ] `messages/en.json` créé avec traductions anglaises

**AC5 — Quality gates**

- [ ] `pnpm run lint` passe
- [ ] `pnpm run typecheck` passe
- [ ] `pnpm run build` passe
- [ ] Navigation `/fr/` et `/en/` fonctionne (build static avec les 2 locales)

**AC6 — Git workflow**

- [ ] Commit sur `emmanuel` avec message `feat(story-1.4): add next-intl bilingue setup (fr/en routing + messages)`

---

## Tasks / Subtasks

- [x] **Task 1** — Installer next-intl (AC1)
  - [x] `pnpm add next-intl` + `next.config.ts` wrappé avec `createNextIntlPlugin`
  - [x] `src/i18n/routing.ts` — locales ['fr', 'en'], defaultLocale 'fr'
  - [x] `src/i18n/request.ts` — getRequestConfig avec import dynamique messages
  - [x] `src/i18n/navigation.ts` — Link, redirect, usePathname, useRouter exports

- [x] **Task 2** — Créer middleware (AC2)
  - [x] `src/middleware.ts` avec createMiddleware(routing)
  - [x] matcher: ['/', '/(fr|en)/:path*']

- [x] **Task 3** — Restructurer App Router pour [locale] (AC3)
  - [x] `src/app/[locale]/layout.tsx` — NextIntlClientProvider + Toaster + generateStaticParams
  - [x] `src/app/[locale]/page.tsx` — useTranslations smoke test (Button, Badge, Card traduits)
  - [x] `src/app/layout.tsx` — root layout avec getLocale() pour lang dynamique
  - [x] Ancien `src/app/page.tsx` supprimé

- [x] **Task 4** — Messages JSON (AC4)
  - [x] `messages/fr.json` (Home + Common)
  - [x] `messages/en.json` (traductions anglaises)

- [x] **Task 5** — Quality gates (AC5)
  - [x] lint clean, typecheck clean, build ✓ — routes /fr et /en en SSG, First Load JS 106 kB

- [x] **Task 6** — Git commit (AC6)

- [x] **Task 7** — Update story file → status review

---

## Dev Notes

### Architecture constraints

- **next-intl** est la lib i18n choisie (architecture.md section 5.2). Pas d'alternative.
- **Routing pattern** : `/fr/*` et `/en/*` via le `[locale]` dynamic segment dans App Router.
- **Default locale** : `fr` (audience primaire française — PRD + UX spec).
- **Static rendering** : `setRequestLocale(locale)` + `generateStaticParams` pour que les pages soient pré-rendues à build time (performance LCP).

### Intégration avec Story 1.3 (shadcn/ui)

- Les composants shadcn dans `src/components/ui/` ne changent pas.
- Le `TooltipProvider` mentionné par shadcn peut être ajouté dans `[locale]/layout.tsx`.
- Le `Toaster` de sonner peut être ajouté dans `[locale]/layout.tsx`.

### Anti-patterns

1. **NE PAS mettre les messages dans `src/`** — convention next-intl : `messages/` à la racine du projet.
2. **NE PAS utiliser `useLocale()` dans les Server Components** — utiliser `getLocale()` côté serveur.
3. **NE PAS oublier `setRequestLocale(locale)`** dans chaque page/layout serveur — requis pour le static rendering.
4. **NE PAS hardcoder les textes** dans page.tsx — tout passe par `useTranslations()`.

### Previous Story Intelligence (Story 1.3)

- shadcn v4.2 installé, 12 composants dans `src/components/ui/`
- `src/lib/utils.ts` avec `cn()` — disponible
- globals.css : @theme YieldField + @theme inline shadcn + :root dark-first
- layout.tsx : 3 localFont + `<html lang="fr" className="dark">`
- **Le `lang="fr"` hardcodé dans layout.tsx sera remplacé par `lang={locale}` dynamique dans cette story**

### References

- `docs/planning-artifacts/epics.md#Story-1.4` (lignes 67-74)
- `docs/planning-artifacts/architecture.md#5.2` — `next-intl: ^3.x`
- https://next-intl.dev/docs/getting-started/app-router — setup officiel

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) — via bmad-dev-story

### Debug Log References

- `.next/` cache contenait des types pour l'ancien `page.tsx` → nettoyé avec `rm -rf .next` avant rebuild
- `useMessages` import inutilisé dans `[locale]/layout.tsx` → retiré (warning ESLint)
- Build génère les 2 locales en SSG via `generateStaticParams`

### Completion Notes List

- next-intl installé, routing FR/EN opérationnel
- Structure App Router restructurée : root layout → [locale] layout → page
- Root layout utilise `getLocale()` pour `<html lang>` dynamique
- Messages JSON bilingues créés (Home + Common)
- Toaster (sonner) ajouté dans [locale]/layout pour les futures notifications
- `next.config.ts` wrappé avec `createNextIntlPlugin`
- First Load JS = 106 kB, routes /fr et /en en SSG

### File List

**Nouveaux fichiers :**
- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/i18n/navigation.ts`
- `src/middleware.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `messages/fr.json`
- `messages/en.json`

**Fichiers modifiés :**
- `package.json` — ajout next-intl
- `pnpm-lock.yaml`
- `next.config.ts` — wrappé avec createNextIntlPlugin
- `src/app/layout.tsx` — root layout avec getLocale() pour lang dynamique

**Fichiers supprimés :**
- `src/app/page.tsx` — remplacé par `src/app/[locale]/page.tsx`

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-12 | 0.1.0 | Story 1.4 créée. | claude-opus-4-6[1m] via bmad-create-story |
| 2026-04-12 | 0.2.0 | Story 1.4 implémentée. next-intl routing FR/EN, middleware, [locale] structure, messages JSON bilingues. Build SSG /fr + /en. First Load JS 106 kB. | claude-opus-4-6[1m] via bmad-dev-story |
