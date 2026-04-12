# Story 4.11 : `src/app/[locale]/coulisses/page.tsx`

Status: review
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5)
Points: 1
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** accéder à la page `/coulisses` (FR) ou `/en/coulisses` (EN) depuis le hero,
**so that** je peux explorer les coulisses du projet YieldField avec tous les composants assemblés.

**Business value :** Story d'assemblage final du Sprint 4. Sans cette story, tous les composants (4.1-4.10) n'ont pas de point d'entrée visible.

---

## Acceptance Criteria

**AC1 -- Route et Server Component**
- [ ] `src/app/[locale]/coulisses/page.tsx` créé
- [ ] Async Server Component (pas de `'use client'`)
- [ ] Paramètre `{ params: { locale: string } }` récupéré correctement
- [ ] Génère les métadonnées : `generateMetadata` avec titre et description i18n

**AC2 -- Assemblage des composants**
- [ ] Layout global : `<main>` avec padding top/bottom, `relative`
- [ ] `<DotPattern>` en fond (Story 4.5), `absolute inset-0 -z-10`
- [ ] `<TracingBeam>` wrappant toutes les `<TimelineStep>` (Story 4.4)
- [ ] 5+ `<TimelineStep>` avec contenu issu de Story 4.10 :
  - Step 1 : L'idée originelle
  - Step 2 : Méthode BMAD
  - Step 3 : Pipeline nocturne + diagram SVG
  - Step 4 : Prompts v01-v06 + `<PromptCodeBlock>` (Story 4.8)
  - Step 5 : Déploiement Cloudflare
- [ ] `<PipelineLogsTable>` dans Step 3 ou en section dédiée (Story 4.9)

**AC3 -- `<HeroAvatar>` sur la page Coulisses**
- [ ] Avatar (Story 4.2) affiché en haut de page avec `riskLevel` courant
- [ ] Données `riskLevel` issues du même `getLatestAnalysis()` que la homepage

**AC4 -- Navigation**
- [ ] Lien retour vers homepage : `"← Retour au dashboard"` / `"← Back to dashboard"`
- [ ] Link `href="/[locale]"` (locale-aware via next-intl)

**AC5 -- Responsive**
- [ ] Mobile (< 640px) : layout colonne, TracingBeam masqué ou simplifié
- [ ] Tablet (640-1024px) : layout normal
- [ ] Desktop (> 1024px) : layout normal avec max-w-4xl centré

**AC6 -- SEO**
- [ ] `generateMetadata` retourne :
  - `title` : `"Les Coulisses de YieldField"` / `"Behind YieldField"`
  - `description` : texte court explicatif
  - `openGraph` : image par défaut (peut être statique pour ce sprint)

**AC7 -- Tests**
- [ ] Smoke test : page rendue sans erreur avec mocks
- [ ] Test : lien retour homepage présent dans le DOM
- [ ] Tests dans `tests/app/coulisses/`

**AC8 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/app/[locale]/coulisses/
  page.tsx
tests/app/coulisses/
  page.test.tsx
```

### Template page
```tsx
import { getTranslations } from 'next-intl/server'
import { TracingBeam } from '@/components/aceternity/tracing-beam'
import { DotPattern } from '@/components/magic-ui/dot-pattern'
import { TimelineStep } from '@/components/coulisses/TimelineStep'
import { PromptCodeBlock } from '@/components/coulisses/PromptCodeBlock'
import { PipelineLogsTable } from '@/components/coulisses/PipelineLogsTable'
import { HeroAvatar } from '@/components/rive/HeroAvatar'
import { getLatestAnalysis } from '@/lib/r2/content-client'

export default async function CoulissesPage({ params: { locale } }) {
  const t = await getTranslations('coulisses')
  const analysis = await getLatestAnalysis()
  // ...
}
```

### Dépendances (toutes les stories Sprint 4)
- Story 4.2 : HeroAvatar
- Story 4.4 : TracingBeam
- Story 4.5 : DotPattern
- Story 4.8 : TimelineStep + PromptCodeBlock
- Story 4.9 : PipelineLogsTable
- Story 4.10 : Contenu i18n (messages/fr.json + messages/en.json)
- Story 3.12 : getLatestAnalysis() (déjà implémenté)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
