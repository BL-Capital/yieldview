# Story 5.4 : Conditional rendering AlertBanner dans HeroSection

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur de YieldField,
**I want** que l'AlertBanner apparaisse automatiquement en haut de la HeroSection quand une alerte est active,
**so that** je vois immédiatement l'état de tension du marché sans action de ma part.

**Business value :** Intégration fluide du mode crisis dans le flow existant. Le contenu principal est poussé vers le bas sans CLS (Cumulative Layout Shift).

---

## Acceptance Criteria

**AC1 -- Conditional rendering**
- [ ] `src/components/dashboard/HeroSection.tsx` modifié
- [ ] Vérifie `analysis.alert.active === true` et `analysis.alert.level !== null`
- [ ] Si true : affiche `<AlertBanner>` en premier enfant de la section
- [ ] Si false : rien n'est rendu (pas de div vide)

**AC2 -- Pas de CLS**
- [ ] Le banner pousse les éléments vers le bas sans saut visuel
- [ ] `min-height` réservé ou transition fluide
- [ ] Pas de repositionnement brusque des éléments existants

**AC3 -- Props passés correctement**
- [ ] `level={analysis.alert.level}`
- [ ] `vix={analysis.alert.vix_current}`
- [ ] `percentile={analysis.alert.vix_p90_252d}`
- [ ] `triggeredAt={analysis.alert.triggered_at}`
- [ ] `locale={locale}`

**AC4 -- Tests**
- [ ] Test : HeroSection avec `alert.active = true` → AlertBanner visible
- [ ] Test : HeroSection avec `alert.active = false` → pas d'AlertBanner
- [ ] Tests dans `src/components/dashboard/__tests__/`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent (y compris tests existants HeroSection)
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Modification HeroSection
```tsx
// Ajouter en premier dans le JSX, avant HeroAvatar :
{analysis.alert.active && analysis.alert.level && (
  <AlertBanner
    level={analysis.alert.level}
    vix={analysis.alert.vix_current}
    percentile={analysis.alert.vix_p90_252d}
    triggeredAt={analysis.alert.triggered_at}
    locale={locale}
  />
)}
```

### Dépendances
- Story 5.2 : AlertBanner
- HeroSection existant (src/components/dashboard/HeroSection.tsx)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
