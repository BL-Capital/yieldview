# Story 3.13 : `<HeroSection>` + `src/app/[locale]/page.tsx`

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir une page d'accueil complète avec le hero YieldField (Pulse Ring + Tagline + Briefing + KPIs + Marquee) rendu en SSR depuis les vraies données R2,
**so that** la promesse de YieldField est tenue dès la première visite : un magazine financier IA, beau et vivant.

**Business value :** C'est la story d'assemblage final du Sprint 3. Elle compose tous les composants créés (3.1-3.12) dans le layout page définitif. Sans cette story, le sprint n'a pas de livrable visible.

---

## Acceptance Criteria

**AC1 -- Composant `<RiskIndicator>` (Pulse Ring)**
- [ ] `src/components/dashboard/RiskIndicator.tsx` créé
- [ ] Implémente le **Concept A — Pulse Ring** (UX Amendment 001 validé par Bryan)
- [ ] Props : `alertLevel: 'low' | 'warning' | 'alert' | 'crisis' | null`
- [ ] Taille : 120px centré
- [ ] États visuels :
  - `low` / `null` : anneau or `#C9A84C`, 1 cercle, pulsation lente 3s, opacity 0.3→0.6
  - `warning` : anneau ambre `#F59E0B`, 2 cercles, pulsation 2s, opacity 0.5→0.8
  - `alert` : anneau rouge `#DC2626`, 3 cercles, pulsation 1.2s, opacity 0.6→1.0 + glow
  - `crisis` : anneau `#991B1B`, 3 cercles + glow + shimmer, pulsation 0.8s
- [ ] Animation CSS `@keyframes pulse-ring` (pas Motion 12 — performance SVG pur)
- [ ] Respect `prefers-reduced-motion` : pas de pulsation, anneau statique
- [ ] `aria-label` : `"Indicateur de risque marché : {level}"` / `"Market risk indicator: {level}"`

**AC2 -- Composant `<HeroSection>`**
- [ ] `src/components/dashboard/HeroSection.tsx` créé
- [ ] Props : `analysis: AnalysisResult`, `locale: string`
- [ ] Layout vertical centré :
  ```
  [RiskIndicator — 120px, centré, mb-8]
  [TaglineHeader — centré, mb-6]
  [MetadataChips — centré, mb-8]
  [BriefingPanel — centré, max-w-2xl, mb-10]
  [FreshnessIndicator — centré, mb-12]
  [KpiBentoGrid — pleine largeur, mb-8]
  [SecondaryKpisMarquee — pleine largeur]
  [CTA Coulisses — centré, mt-12]
  ```
- [ ] Background : `AuroraWithBeams` (Story 3.2) wrappant tout le hero
- [ ] Color Shift Aurora selon `alertLevel` (Concept C complémentaire) :
  - `low`/null : palette par défaut (bleu profond)
  - `warning` : tons ambre subtils ajoutés
  - `alert` / `crisis` : tons rouge foncé
- [ ] `"use server"` compatible (composant sans event handlers directs)

**AC3 -- CTA "Voir les Coulisses"**
- [ ] Bouton outlined gold `border-yield-gold text-yield-gold hover:bg-yield-gold/10`
- [ ] Texte FR : `"Voir les Coulisses"` / EN : `"Behind the Scenes"`
- [ ] Lien vers `/[locale]/coulisses` (route à créer en Sprint 4)
- [ ] Accessible : `aria-label` complet

**AC4 -- Page `src/app/[locale]/page.tsx`**
- [ ] Async Server Component
- [ ] Appelle `getLatestAnalysis()` (Story 3.12) au rendu SSR
- [ ] Passe `analysis` + `locale` à `<HeroSection>`
- [ ] Métadonnées dynamiques : `generateMetadata` avec titre du jour du briefing
- [ ] Revalidation ISR : 1h (configurée dans `getLatestAnalysis`)

**AC5 -- Smoke tests**
- [ ] Page `/fr` s'affiche complète avec données mockées (fallback si R2 down)
- [ ] Page `/en` affiche tout en anglais
- [ ] Console 0 erreur, 0 warning React

**AC6 -- Tests**
- [ ] Test RiskIndicator : `aria-label` correct pour chaque `alertLevel`
- [ ] Test HeroSection : rendu avec `MOCK_ANALYSIS` sans erreur
- [ ] Tests dans `tests/components/dashboard/`

**AC7 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Dépendances (toutes les stories précédentes)
- 3.1 : Motion 12 + hooks
- 3.2 : AuroraWithBeams
- 3.3 : NumberTicker (via KpiCard)
- 3.4 : AnimatedGradientText (via TaglineHeader)
- 3.5 : TextGenerateEffect (via BriefingPanel)
- 3.6 : BentoGrid (via KpiBentoGrid)
- 3.7 : GlareCard (via KpiCard)
- 3.8 : KpiCard (via KpiBentoGrid)
- 3.9 : KpiBentoGrid
- 3.10 : TaglineHeader + MetadataChips + BriefingPanel
- 3.11 : FreshnessIndicator
- 3.12 : getLatestAnalysis()
- 3.14 : SecondaryKpisMarquee

### Keyframes Pulse Ring (dans globals.css)
```css
@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: var(--pulse-opacity-min); }
  50% { transform: scale(1.08); opacity: var(--pulse-opacity-max); }
}
```

### Fichiers à créer
```
src/components/dashboard/RiskIndicator.tsx
src/components/dashboard/HeroSection.tsx
src/app/[locale]/page.tsx (mettre à jour)
tests/components/dashboard/RiskIndicator.test.tsx
tests/components/dashboard/HeroSection.test.tsx
```

### Note sur `src/data/mock-analysis.json`
Créer un `mock-analysis.json` complet avec toutes les données (KPIs, briefing FR/EN, alertLevel, freshness) pour les tests et le développement local quand R2 n'est pas accessible.

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
- `<RiskIndicator>` = renommage de `<HeroAvatar>` per UX Amendment 001 (validé Bryan Issue #4)
- Pas d'avatar Rive dans cette story (reporté Story 4.3 optionnel)
