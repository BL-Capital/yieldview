# Story 8.1: Logo — Refonte wordmark ou suppression

Status: ready-for-dev

## Story

As a visiteur du site YieldField,
I want voir un logo/wordmark propre et cohérent avec l'identité éditoriale premium,
so that la marque inspire confiance et professionnalisme dès le premier regard.

## Acceptance Criteria

1. Le logo actuel (`Header.tsx` — texte "YieldField" en `font-serif text-yield-gold text-xl font-bold`) est évalué et remplacé par une version plus soignée
2. Option retenue : **wordmark typographique amélioré** — "YieldField" en Instrument Serif avec traitement letterspacing raffiné + éventuel micro-symbole SVG (courbe de yield) inline en gold
3. Le wordmark reste un `<Link href="/">` accessible avec hover subtil (`text-yield-gold/80`)
4. Aucune image externe, aucun fichier PNG/JPG — SVG inline ou pur texte uniquement
5. Rendu identique en FR et EN (pas de traduction du nom de marque)
6. Lighthouse ≥ 0.9 maintenu sur les 4 catégories — aucune régression
7. Build et typecheck (`pnpm build`, `pnpm typecheck`) clean
8. Test unitaire sur `<Header />` mis à jour si existant

## Tasks / Subtasks

- [ ] Analyser le rendu actuel du logo dans Header.tsx (AC: #1)
  - [ ] Identifier pourquoi Bryan le juge "peu beau" (trop simple ? taille ? style ?)
  - [ ] Décider : wordmark amélioré seul, ou wordmark + micro-SVG

- [ ] Implémenter le nouveau wordmark dans `src/components/common/Header.tsx` (AC: #2, #3, #4)
  - [ ] Option A — Wordmark pur raffiné : augmenter `tracking-widest`, ajuster taille, ajouter séparateur visuel (ex. point doré `·` entre "Yield" et "Field")
  - [ ] Option B — Wordmark + micro-SVG : créer `<YieldMarkIcon />` SVG inline (courbe de rendement stylisée, 20×20px, stroke `#C9A84C`) + "YieldField" à côté
  - [ ] Appliquer `gap-2 items-center flex` si SVG ajouté
  - [ ] Hover : `hover:opacity-80 transition-opacity duration-200` — PAS d'animation continue

- [ ] Vérifier rendu FR/EN — aucune traduction du nom de marque (AC: #5)

- [ ] Valider build et typecheck (AC: #6, #7)
  - [ ] `pnpm build` → 0 erreur
  - [ ] `pnpm typecheck` → 0 erreur TypeScript

- [ ] Mettre à jour test Header si existant (AC: #8)
  - [ ] Chercher `__tests__/Header.test.tsx` ou `Header.spec.tsx`
  - [ ] Adapter les assertions si le texte du wordmark change

## Dev Notes

### Fichier cible unique
```
src/components/common/Header.tsx
```

### Implémentation actuelle (à remplacer)
```tsx
<Link
  href="/"
  className="font-serif text-yield-gold text-xl font-bold tracking-tight hover:text-yield-gold/80 transition-colors"
>
  YieldField
</Link>
```

### Option recommandée — Wordmark + micro-symbole SVG
```tsx
<Link
  href="/"
  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
  aria-label="YieldField — Accueil"
>
  {/* Micro-symbole : courbe de yield stylisée */}
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M2 14 C5 14, 7 6, 10 6 C13 6, 15 10, 18 8"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="8" r="1.5" fill="#C9A84C" />
  </svg>
  {/* Wordmark */}
  <span className="font-serif text-yield-gold text-xl font-bold tracking-wide">
    YieldField
  </span>
</Link>
```

### Tokens design disponibles (globals.css)
```css
--color-yield-gold: #c9a84c;
--color-yield-gold-light: #e5c67f;
--color-yield-gold-dim: #9a7e3a;
--font-serif: var(--font-instrument-serif), Georgia, serif;
```

### Classes Tailwind disponibles
- `font-serif` → Instrument Serif
- `text-yield-gold`, `text-yield-gold/80`
- `tracking-wide`, `tracking-wider`, `tracking-widest`
- `hover:opacity-80 transition-opacity duration-200`

### Contraintes
- **PAS** d'import d'image externe (pas de `next/image` pour le logo)
- **PAS** d'animation continue au repos (pas de pulse/shimmer)
- SVG doit être inline (pas de fichier `.svg` séparé importé via `next/image`)
- Le `<Link>` doit conserver `href="/"` et son rôle de navigation principale
- Accessibilité : `aria-label` sur le `<Link>` si le SVG est décoratif (`aria-hidden="true"` sur le SVG)

### Fichier de test à vérifier
```
src/components/common/__tests__/Header.test.tsx  (si existant)
```

### Project Structure Notes
- Composant unique à modifier : `src/components/common/Header.tsx`
- Pas de nouveau fichier à créer sauf si `<YieldMarkIcon />` extrait en composant séparé dans `src/components/ui/icons/`
- Cohérence avec palette définie dans `src/app/globals.css` (tokens CSS custom)

### References
- [Source: src/components/common/Header.tsx] — implémentation actuelle
- [Source: src/app/globals.css] — tokens `--color-yield-gold`, `--font-serif`
- [Source: docs/planning-artifacts/epics.md#Epic 8 Story 8.1] — AC et contexte retour Bryan
- [Source: GitHub Issue #12] — screenshot et demande Bryan

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (create-story)

### Debug Log References

### Completion Notes List

### File List
