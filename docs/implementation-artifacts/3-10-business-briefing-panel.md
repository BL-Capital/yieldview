# Story 3.10 : Business `<BriefingPanel>` + `<TaglineHeader>` + `<MetadataChips>`

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir le briefing éditorial quotidien du Chartiste Lettré avec son tagline animé, ses métadonnées (date, durée de lecture, niveau d'alerte) et le texte du briefing qui s'affiche mot par mot,
**so that** je sois immédiatement capturé par le contenu éditorial et comprenne le contexte (quand, alerte, combien de temps à lire).

**Business value :** C'est le cœur éditorial du site. Sans BriefingPanel, il n'y a pas de contenu. FR22 (TaglineHeader), FR23 (BriefingPanel), FR24 (MetadataChips), FR29 (Disclaimer).

---

## Acceptance Criteria

**AC1 -- TaglineHeader**
- [ ] `src/components/dashboard/TaglineHeader.tsx` créé
- [ ] Utilise `AnimatedGradientText` (Story 3.4) pour le tagline
- [ ] Tagline FR : `"Le marché vous parle. Le Chartiste l'interprète."`
- [ ] Tagline EN : `"The market speaks. The Chartiste interprets."`
- [ ] Bilingue via `useTranslations('hero')` (next-intl)
- [ ] Font Instrument Serif `text-display-1` (responsive via @theme)
- [ ] Motion 12 : apparition `fadeInUp` au mount

**AC2 -- MetadataChips**
- [ ] `src/components/dashboard/MetadataChips.tsx` créé
- [ ] Props :
  ```typescript
  interface MetadataChipsProps {
    publishedAt: string      // ISO date string
    readingTimeMin: number   // durée de lecture en minutes
    alertLevel: 'calm' | 'warning' | 'crisis' | null
    locale: string
  }
  ```
- [ ] Chip date : `"Mis à jour le 12 avril 2026"` (format `fr-FR`) ou `"Updated April 12, 2026"` (EN)
- [ ] Chip lecture : `"3 min de lecture"` / `"3 min read"`
- [ ] Chip alerte (si non null) :
  - `calm` : `🟢 Calm` (vert)
  - `warning` : `🟡 Warning` (orange yield-gold)
  - `crisis` : `🔴 Crisis` (rouge yield-bear)
- [ ] Style chips : `rounded-full border text-xs font-mono px-3 py-1`

**AC3 -- BriefingPanel**
- [ ] `src/components/dashboard/BriefingPanel.tsx` créé
- [ ] Props :
  ```typescript
  interface BriefingPanelProps {
    briefingFr: string    // texte FR complet
    briefingEn: string    // texte EN complet
    locale: string
    className?: string
  }
  ```
- [ ] Affiche le texte selon `locale` (fr → `briefingFr`, en → `briefingEn`)
- [ ] Premier paragraphe : `TextGenerateEffect` (Story 3.5) — effet mot par mot
- [ ] Paragraphes suivants : apparition par `fadeInUp` Motion 12 avec délai progressif
- [ ] Max 4 paragraphes affichés (le briefing complet est dans la page dédiée)
- [ ] Font : `font-serif text-body-lg text-yield-ivory`
- [ ] **Disclaimer légal** (FR29) : dernier élément, texte `"Les informations présentées sont à titre informatif uniquement et ne constituent pas un conseil en investissement."` — style `text-xs text-yield-ivory/40 italic`

**AC4 -- Cascade d'apparition (composition)**
- [ ] Ordre d'apparition : TaglineHeader (0ms) → MetadataChips (200ms) → BriefingPanel (400ms)
- [ ] Motion 12 `delay` sur chaque bloc
- [ ] Respect `prefers-reduced-motion` : tout apparaît directement

**AC5 -- Tests**
- [ ] Test TaglineHeader : texte FR et EN rendus selon locale
- [ ] Test MetadataChips : chip `crisis` visible quand `alertLevel='crisis'`
- [ ] Test BriefingPanel : disclaimer présent dans le DOM
- [ ] Test BriefingPanel : texte FR affiché quand `locale='fr'`
- [ ] Tests dans `tests/components/dashboard/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Dépendances
- Story 3.1 : Motion 12 + variants
- Story 3.4 : AnimatedGradientText
- Story 3.5 : TextGenerateEffect
- next-intl (Epic 1, Story 1.4) pour les traductions

### Clés i18n à ajouter dans `messages/fr.json` et `messages/en.json`
```json
// fr.json
{
  "hero": {
    "tagline": "Le marché vous parle. Le Chartiste l'interprète.",
    "updated_at": "Mis à jour le {date}",
    "reading_time": "{min} min de lecture",
    "disclaimer": "Les informations présentées sont à titre informatif uniquement et ne constituent pas un conseil en investissement."
  }
}

// en.json
{
  "hero": {
    "tagline": "The market speaks. The Chartiste interprets.",
    "updated_at": "Updated {date}",
    "reading_time": "{min} min read",
    "disclaimer": "The information presented is for informational purposes only and does not constitute investment advice."
  }
}
```

### Fichiers à créer
```
src/components/dashboard/TaglineHeader.tsx
src/components/dashboard/MetadataChips.tsx
src/components/dashboard/BriefingPanel.tsx
tests/components/dashboard/TaglineHeader.test.tsx
tests/components/dashboard/MetadataChips.test.tsx
tests/components/dashboard/BriefingPanel.test.tsx
```
(+ mise à jour `messages/fr.json` et `messages/en.json`)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
