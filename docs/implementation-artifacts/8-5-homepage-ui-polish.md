# Story 8.5: Homepage UI polish esthétique

Status: ready-for-dev

## Story

As a visiteur de YieldField,
I want une homepage visuellement cohérente et soignée sur tous les éléments,
so que chaque composant reflète le niveau de qualité éditorial premium de la marque.

## Acceptance Criteria

1. L'élément signalé par Bryan dans l'issue #8 (screenshot posté) est identifié dans le code
2. L'élément est refait visuellement en cohérence avec la charte : `#0A1628` fond, `#C9A84C` or, Instrument Serif, style "Monocle × Linear"
3. Aucune régression sur les autres sections de la homepage
4. `pnpm build` et `pnpm typecheck` clean
5. Lighthouse ≥ 0.9 sur les 4 catégories maintenu

## Tasks / Subtasks

- [ ] Identifier l'élément problématique depuis le screenshot issue #8 (AC: #1)
  - [ ] Lire le commentaire de Bryan dans l'issue #8 : screenshot d'un élément "pas très beau" sur la page d'accueil
  - [ ] Inspecter les candidats probables :
    - `<FreshnessIndicator>` — indicateur de fraîcheur des données
    - `<MetadataChips>` — chips de métadonnées (date, temps de lecture, alerte)
    - `<RiskIndicator>` — indicateur de niveau de risque VIX
    - `<BriefingPanel>` — panneau de briefing IA
    - Bas de page / footer si présent

- [ ] Auditer visuellement les composants candidats (AC: #1)
  - [ ] Lire `src/components/dashboard/FreshnessIndicator.tsx`
  - [ ] Lire `src/components/dashboard/MetadataChips.tsx`
  - [ ] Lire `src/components/dashboard/RiskIndicator.tsx`
  - [ ] Identifier le composant dont le rendu est le moins cohérent avec la charte premium

- [ ] Refondre le composant identifié (AC: #2)
  - [ ] Appliquer tokens corrects : `text-yield-gold`, `bg-yield-dark-elevated`, `border-yield-dark-border`
  - [ ] Typographie : `font-serif` pour les labels importants, `font-mono` pour les valeurs chiffrées
  - [ ] Espacements : cohérents avec le reste (`gap-2`, `px-4 py-2`, `rounded-lg`)
  - [ ] Supprimer tout style qui "fait cheap" : couleurs trop vives, borders épaisses, backgrounds trop clairs

- [ ] Valider aucune régression (AC: #3, #4, #5)
  - [ ] `pnpm build` → 0 erreur
  - [ ] `pnpm typecheck` → 0 erreur
  - [ ] Lighthouse Performance ≥ 0.9 maintenu

## Dev Notes

### Contexte issue #8
Bryan a posté un screenshot d'un élément de la homepage jugé "pas très beau". Sans voir le screenshot directement, les composants les plus susceptibles d'être visés (ordre de probabilité) :

**1. `FreshnessIndicator`** — souvent rendu générique avec des icônes et couleurs de statut qui peuvent paraître "cheap" vs. une interface premium
**2. `MetadataChips`** — badges de métadonnées (date, reading time, alert level) qui peuvent sembler trop "webdev" comparé au style éditorial
**3. `RiskIndicator`** — indicateur VIX qui peut avoir un rendu trop "dashboard outil" et pas assez "magazine"

### Charte visuelle de référence — "Monocle × Linear"
```css
/* Fond principal */
--color-yield-dark: #0a1628;
--color-yield-dark-elevated: #0f1e38;
--color-yield-dark-border: #1e3a5f;

/* Or signature */
--color-yield-gold: #c9a84c;
--color-yield-gold-dim: #9a7e3a;

/* Texte */
--color-yield-ink: #f4f4f5;
--color-yield-ink-muted: #94a3b8;

/* Typographie */
--font-serif: Instrument Serif  /* labels, titres */
--font-mono: JetBrains Mono    /* valeurs chiffrées, codes */
--font-sans: Inter              /* corps de texte */
```

### Principe de refonte "polish"
- **Moins c'est plus** : supprimer les éléments décoratifs superflus
- **Cohérence border-radius** : `rounded-lg` partout (pas de `rounded-full` sauf pour les points/badges)
- **Couleurs de statut** : utiliser les tokens sémantiques (`bull`, `bear`, `neutral`) et NON des couleurs hardcodées
- **Spacing** : `gap-2` pour les petits groupes, `gap-4` pour les sections
- **Hover states** : `hover:opacity-80 transition-opacity duration-200` — sobres

### Fichiers à auditer
```
src/components/dashboard/FreshnessIndicator.tsx
src/components/dashboard/MetadataChips.tsx
src/components/dashboard/RiskIndicator.tsx
src/components/dashboard/TaglineHeader.tsx
```

### Commande de diagnostic
```bash
# Voir tous les composants dashboard pour identifier le candidat
ls src/components/dashboard/
```

### Project Structure Notes
- Modifications limitées aux composants `src/components/dashboard/`
- **Ne pas modifier** le schéma, le pipeline, ni `HeroSection.tsx` (traité dans stories 8.3 et 8.4)
- Si une Aceternity/MagicUI existe pour remplacer un composant maison, l'utiliser en priorité (règle premium)

### References
- [Source: src/components/dashboard/] — tous les composants dashboard
- [Source: src/app/globals.css] — tokens de couleurs et typographie
- [Source: GitHub Issue #8] — screenshot Bryan + commentaire "pas très beau"
- [Source: docs/planning-artifacts/epics.md#Epic 8 Story 8.5]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (create-story)

### Debug Log References

### Completion Notes List

### File List
