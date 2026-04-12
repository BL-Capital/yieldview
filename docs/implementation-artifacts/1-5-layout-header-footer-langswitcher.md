# Story 1.5 : Layout principal (Header + Footer + LanguageSwitcher)

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
**I want** un Header, Footer et LanguageSwitcher intégrés dans `[locale]/layout.tsx`,
**so that** toutes les pages suivantes (Epic 3-7) héritent de la navigation bilingue et du layout structurel sans duplication de code.

**Business value :** Le Header/Footer est la colonne vertébrale de l'expérience utilisateur. Le LanguageSwitcher permet à l'audience FR et EN de basculer entre les locales. Cette story "active" concrètement l'i18n installée en Story 1.4.

---

## Acceptance Criteria

**AC1 — Composant Header**

- [ ] `src/components/common/Header.tsx` créé :
  - Logo YieldField (texte stylisé ou SVG inline) + tagline courte
  - Navigation links (placeholder pour Epic 3-7, uniquement `href="/"` pour l'instant)
  - `<LanguageSwitcher>` intégré à droite
  - Client component (`"use client"`) car LanguageSwitcher utilise `useRouter`

**AC2 — Composant LanguageSwitcher**

- [ ] `src/components/common/LanguageSwitcher.tsx` créé :
  - Utilise shadcn `<DropdownMenu>` (déjà dans `src/components/ui/dropdown-menu.tsx`)
  - Affiche locale courante (FR / EN) comme trigger
  - On click → `useRouter` de `@/i18n/navigation` + `usePathname` → `router.replace(pathname, { locale: targetLocale })`
  - Client component (`"use client"`)

**AC3 — Composant Footer**

- [ ] `src/components/common/Footer.tsx` créé :
  - Disclaimer légal bilingue via `useTranslations("Common")` → clé `disclaimer`
  - Copyright `© {year} YieldField` avec `new Date().getFullYear()`
  - Base du `<NewsletterForm>` : input email + bouton (non-fonctionnel, pas de `action`) — structure HTML seulement
  - Client component (`"use client"`) pour `new Date()` côté client OU Server Component avec hardcoded year acceptable

**AC4 — Intégration dans `[locale]/layout.tsx`**

- [ ] `src/app/[locale]/layout.tsx` modifié pour inclure Header et Footer :
  ```tsx
  return (
    <NextIntlClientProvider locale={locale}>
      <Header />
      {children}
      <Footer />
      <Toaster />
    </NextIntlClientProvider>
  );
  ```
- [ ] Layout wrappé dans un `<div className="flex flex-col min-h-screen">` avec `<main className="flex-1">` autour de `{children}`

**AC5 — Messages JSON bilingues**

- [ ] `messages/fr.json` étendu avec clés Navigation + Footer :
  ```json
  {
    "Header": {
      "logoTagline": "Finance de marché éclairée par l'IA",
      "nav": {
        "home": "Accueil",
        "coulisses": "Les Coulisses"
      }
    },
    "Footer": {
      "newsletter": {
        "placeholder": "Votre e-mail",
        "cta": "S'abonner"
      },
      "copyright": "Tous droits réservés."
    },
    "LanguageSwitcher": {
      "fr": "Français",
      "en": "English"
    }
  }
  ```
- [ ] `messages/en.json` étendu avec les traductions anglaises équivalentes

**AC6 — Quality gates**

- [ ] `pnpm run lint` passe
- [ ] `pnpm run typecheck` passe
- [ ] `pnpm run build` passe
- [ ] Navigation `/fr` ↔ `/en` via LanguageSwitcher fonctionne sans breakage de route

**AC7 — Git workflow**

- [ ] Commit sur `emmanuel` avec message `feat(story-1.5): add Header + Footer + LanguageSwitcher layout`

---

## Tasks / Subtasks

- [x] **Task 1** — Créer LanguageSwitcher (AC2)
  - [x] `src/components/common/LanguageSwitcher.tsx` — `"use client"`, shadcn DropdownMenu, `useRouter` + `usePathname` de `@/i18n/navigation`
  - [x] Trigger : bouton avec locale courante (ex: "FR") + chevron icon (lucide-react `ChevronDown`)
  - [x] Items : FR et EN avec check icon sur locale active

- [x] **Task 2** — Créer Header (AC1)
  - [x] `src/components/common/Header.tsx` — `"use client"`, logo + nav + LanguageSwitcher
  - [x] Logo : `<Link className="font-serif text-yield-gold text-xl font-bold">YieldField</Link>`
  - [x] Nav : 2 links placeholder (Accueil, Les Coulisses) via `useTranslations("Header")`
  - [x] Sticky header avec `sticky top-0 z-50 backdrop-blur-sm bg-yield-dark/80 border-b border-border`

- [x] **Task 3** — Créer Footer (AC3)
  - [x] `src/components/common/Footer.tsx` — disclaimer + newsletter form stub + copyright
  - [x] Utilise `useTranslations("Common")` pour disclaimer et `useTranslations("Footer")` pour newsletter
  - [x] Newsletter : input email + button disabled (non-fonctionnel intentionnellement)

- [x] **Task 4** — Mettre à jour messages JSON (AC5)
  - [x] Ajouter Header, Footer, LanguageSwitcher namespaces dans `messages/fr.json` et `messages/en.json`

- [x] **Task 5** — Intégrer dans `[locale]/layout.tsx` (AC4)
  - [x] Importer Header + Footer
  - [x] Wrapper div flex-col min-h-screen + main flex-1
  - [x] Tester que le layout s'affiche correctement

- [x] **Task 6** — Quality gates (AC6)
  - [x] lint ✓ (no warnings/errors)
  - [x] typecheck ✓ (no errors)
  - [x] build ✓ — /fr + /en SSG, First Load JS 118 kB

- [x] **Task 7** — Git commit (AC7)

- [x] **Task 8** — Update story file → status review

---

## Dev Notes

### Architecture constraints

- **Dossier `common/`** : Header, Footer, LanguageSwitcher vont dans `src/components/common/` — c'est la convention architecture.md décision 10.
- **shadcn DropdownMenu** : déjà installé en Story 1.3 dans `src/components/ui/dropdown-menu.tsx`. Ne pas réinstaller.
- **next-intl navigation** : utiliser les exports de `@/i18n/navigation` (pas `next/navigation` directement) pour `useRouter`, `usePathname`, `Link`. C'est crucial pour que le routing locale fonctionne correctement.
- **Client components** : Header, Footer, LanguageSwitcher doivent être `"use client"` car ils utilisent hooks (`useTranslations`, `useRouter`, `usePathname`).
- **NE PAS** importer `useTranslations` dans les Server Components sans `setRequestLocale` — ici tous les composants communs sont client-side donc OK.

### Pattern LanguageSwitcher

```tsx
"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (nextLocale: "fr" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          {locale.toUpperCase()} <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(["fr", "en"] as const).map((l) => (
          <DropdownMenuItem key={l} onClick={() => switchLocale(l)}>
            {l === locale && <Check className="h-3 w-3 mr-2" />}
            {l === "fr" ? "Français" : "English"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Pattern Header

```tsx
"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("Header");
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-yield-dark/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-yield-gold text-xl font-bold tracking-tight">
          YieldField
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-yield-ink/70 hover:text-yield-ink transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/coulisses" className="text-yield-ink/70 hover:text-yield-ink transition-colors">
            {t("nav.coulisses")}
          </Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
```

### Anti-patterns

1. **NE PAS** utiliser `useRouter` de `next/navigation` → utiliser celui de `@/i18n/navigation`
2. **NE PAS** utiliser `Link` de `next/link` → utiliser celui de `@/i18n/navigation` (preserve locale prefix)
3. **NE PAS** hardcoder des textes dans les composants → tout via `useTranslations()`
4. **NE PAS** oublier `"use client"` sur ces composants (hooks client-only)
5. **NE PAS** créer un `index.ts` barrel — importer les composants directement

### Previous Story Intelligence (Story 1.4)

- next-intl installé, `@/i18n/navigation` exporte `Link`, `usePathname`, `useRouter`, `redirect`
- `src/app/[locale]/layout.tsx` : `NextIntlClientProvider` + `Toaster` déjà en place
- `messages/fr.json` et `messages/en.json` : namespaces `Home` et `Common` déjà définis
- shadcn `dropdown-menu`, `button`, `badge`, `card` installés dans `src/components/ui/`
- lucide-react disponible (installé avec shadcn)

### References

- `docs/planning-artifacts/architecture.md` — Décision 10 : couche `common/` pour Header, Footer, LanguageSwitcher
- `docs/planning-artifacts/epics.md#Story-1.5`
- `src/app/[locale]/layout.tsx` — fichier à modifier (Task 5)
- `src/i18n/navigation.ts` — exports Link, useRouter, usePathname
- https://next-intl.dev/docs/routing/navigation — API useRouter pour locale switch

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) — via bmad-create-story

### Debug Log References

- `asChild` prop absent de `DropdownMenuTrigger` en shadcn v4 (@base-ui/react) → retiré, styles appliqués directement sur le Trigger

### Completion Notes List

- Header, Footer, LanguageSwitcher créés dans `src/components/common/`
- shadcn v4 (@base-ui/react) : DropdownMenuTrigger ne supporte pas `asChild` — trigger stylé directement
- `[locale]/layout.tsx` : flex-col min-h-screen + Header/Footer intégrés
- Messages JSON : namespaces Header, Footer, LanguageSwitcher ajoutés en FR et EN
- Build SSG /fr + /en, First Load JS 118 kB (+ 12 kB vs Story 1.4)

### File List

**Nouveaux fichiers :**
- `src/components/common/LanguageSwitcher.tsx`
- `src/components/common/Header.tsx`
- `src/components/common/Footer.tsx`

**Fichiers modifiés :**
- `src/app/[locale]/layout.tsx` — ajout Header + Footer + flex layout
- `messages/fr.json` — namespaces Header, Footer, LanguageSwitcher
- `messages/en.json` — namespaces Header, Footer, LanguageSwitcher
