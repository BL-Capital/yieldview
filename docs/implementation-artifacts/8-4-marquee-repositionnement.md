# Story 8.4: Marquee — repositionnement plus haut dans la page

Status: ready-for-dev

## Story

As a visiteur de YieldField,
I want voir le bandeau de données défilantes dès le haut de la page,
so that les chiffres clés du marché sont immédiatement visibles sans scroller.

## Acceptance Criteria

1. Le `<SecondaryKpisMarquee>` est remonté dans la hiérarchie visuelle de `HeroSection`
2. Position cible : **juste après `<TaglineHeader />`** (section 2) et avant `<MetadataChips />` (section 3)
3. Aucune régression CLS (Cumulative Layout Shift) — le marquee a une hauteur fixe définie
4. Rendu correct sur mobile (< 640px), tablette (640-1024px) et desktop (> 1024px)
5. Lighthouse Performance ≥ 0.9 maintenu
6. `pnpm build` et `pnpm typecheck` clean
7. L'ordre des autres sections reste intact (MetadataChips → Briefing → Freshness → KpiBentoGrid → CTA)

## Tasks / Subtasks

- [ ] Modifier l'ordre des sections dans `HeroSection.tsx` (AC: #1, #2, #7)
  - [ ] Déplacer le bloc `{/* 6. Secondary KPIs Marquee */}` de sa position actuelle (entre Freshness et KpiBentoGrid) vers **après TaglineHeader** (entre sections 2 et 3)
  - [ ] Re-numéroter les commentaires de sections (/* 3. Secondary KPIs Marquee */, /* 4. Metadata chips */, etc.)
  - [ ] Vérifier que `secondaryKpis` prop est toujours accessible (elle l'est — passée depuis `page.tsx`)

- [ ] Vérifier hauteur fixe du marquee pour éviter CLS (AC: #3)
  - [ ] Lire `SecondaryKpisMarquee.tsx` — vérifier si `height` ou `min-height` est définie
  - [ ] Si non définie, ajouter `className="h-10"` ou `min-h-[40px]` sur le container du marquee

- [ ] Tester responsive (AC: #4)
  - [ ] Mobile : marquee visible et scrollable horizontalement
  - [ ] Desktop : marquee pleine largeur, pas de débordement

- [ ] Valider build + Lighthouse (AC: #5, #6)
  - [ ] `pnpm build` → 0 erreur
  - [ ] `pnpm typecheck` → 0 erreur

## Dev Notes

### Structure actuelle de HeroSection.tsx (ordre des sections)
```
/* 0. Alert Banner (conditional) */
/* 1. Hero Avatar */
/* 2. Risk Indicator */
/* 2. Tagline */           ← TaglineHeader
/* 3. Metadata chips */    ← MetadataChips
/* 4. Briefing */          ← BriefingPanel
/* 5. Freshness */         ← FreshnessIndicator
/* 6. Secondary KPIs Marquee */  ← ⬆️ À REMONTER ICI (après Tagline)
/* 7. KPI Bento Grid */
/* 8. CTA Coulisses */
```

### Structure cible
```
/* 0. Alert Banner (conditional) */
/* 1. Hero Avatar */
/* 2. Risk Indicator */
/* 3. Tagline */           ← TaglineHeader
/* 4. Secondary KPIs Marquee */  ← ✅ NOUVELLE POSITION (après Tagline)
/* 5. Metadata chips */    ← MetadataChips
/* 6. Briefing */          ← BriefingPanel
/* 7. Freshness */         ← FreshnessIndicator
/* 8. KPI Bento Grid */
/* 9. CTA Coulisses */
```

### Modification à faire dans HeroSection.tsx
Déplacer ce bloc :
```tsx
{/* 6. Secondary KPIs Marquee — bandeau défilant avant les gros KPIs */}
<SecondaryKpisMarquee kpis={secondaryKpis} />
```
→ Le placer **après** le bloc `<TaglineHeader />` et **avant** le bloc `<MetadataChips .../>`.

### Vérification CLS — SecondaryKpisMarquee.tsx
```bash
cat src/components/dashboard/SecondaryKpisMarquee.tsx
```
- Si le composant n'a pas de hauteur fixe → ajouter `className="w-full"` + `min-h-[40px]` sur le wrapper
- La hauteur fixe empêche le CLS car le navigateur réserve l'espace avant hydratation

### Fichier unique à modifier
```
src/components/dashboard/HeroSection.tsx
src/components/dashboard/SecondaryKpisMarquee.tsx  (si ajout min-height)
```

### Project Structure Notes
- Pas de nouveau fichier à créer
- Pas de modification du schéma, du pipeline, ni des données
- `secondaryKpis` est déjà disponible dans les props de `HeroSection` — pas de changement d'API

### References
- [Source: src/components/dashboard/HeroSection.tsx] — structure complète des sections
- [Source: src/components/dashboard/SecondaryKpisMarquee.tsx] — composant marquee
- [Source: src/app/[locale]/page.tsx] — injection des props `secondaryKpis`
- [Source: docs/planning-artifacts/epics.md#Epic 8 Story 8.4]
- [Source: GitHub Issue #12 feedback #4] — Bryan : "bandeau qui défile avec des valeurs soit à ce niveau là quand on est sur le site"

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (create-story)

### Debug Log References

### Completion Notes List

### File List
