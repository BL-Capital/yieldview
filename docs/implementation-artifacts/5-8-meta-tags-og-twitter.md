# Story 5.8 : Meta tags OG + Twitter Card dynamiques

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur partageant YieldField sur LinkedIn, Twitter/X ou Facebook,
**I want** que les meta tags Open Graph et Twitter Card soient dynamiques avec le briefing du jour,
**so that** chaque partage affiche un titre, une description et une image à jour.

**Business value :** FR47 + FR48 — Les meta tags dynamiques maximisent l'impact de chaque partage social. Titre = tagline du jour, description = première phrase du briefing, image = OG dynamique.

---

## Acceptance Criteria

**AC1 -- Metadata Next.js dynamique**
- [ ] `src/app/[locale]/layout.tsx` modifié
- [ ] Utilise `generateMetadata()` (Next.js App Router pattern)
- [ ] Fetch latest analysis pour construire les meta tags

**AC2 -- Open Graph tags**
- [ ] `og:title` = tagline du jour (locale-aware)
- [ ] `og:description` = première phrase du briefing (locale-aware)
- [ ] `og:image` = `/api/og?locale={locale}&date={date}`
- [ ] `og:type` = `website`
- [ ] `og:site_name` = `YieldField`
- [ ] `og:locale` = `fr_FR` ou `en_US` selon locale

**AC3 -- Twitter Card tags**
- [ ] `twitter:card` = `summary_large_image`
- [ ] `twitter:title` = tagline du jour
- [ ] `twitter:description` = première phrase du briefing
- [ ] `twitter:image` = `/api/og?locale={locale}&date={date}`

**AC4 -- Fallback**
- [ ] Si fetch analysis échoue → meta tags statiques par défaut
- [ ] Titre fallback : "YieldField — Finance × IA"
- [ ] Description fallback : "Briefing quotidien des marchés financiers, généré par IA"
- [ ] Image fallback : `/og-fallback.png`

**AC5 -- Tests**
- [ ] Test : generateMetadata retourne les tags OG corrects
- [ ] Test : fallback quand analysis indisponible
- [ ] Test : locale FR vs EN → tags différents
- [ ] Tests dans `src/app/[locale]/__tests__/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Pattern generateMetadata
```tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const analysis = await fetchLatestAnalysis()
  const locale = params.locale

  return {
    title: analysis?.tagline[locale] ?? 'YieldField — Finance × IA',
    description: analysis?.briefing[locale]?.split('.')[0] ?? '...',
    openGraph: {
      title: analysis?.tagline[locale],
      description: analysis?.briefing[locale]?.split('.')[0],
      images: [`/api/og?locale=${locale}&date=${analysis?.date}`],
      type: 'website',
      siteName: 'YieldField',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: analysis?.tagline[locale],
      description: analysis?.briefing[locale]?.split('.')[0],
      images: [`/api/og?locale=${locale}&date=${analysis?.date}`],
    },
  }
}
```

### Dépendances
- Story 5.7 : `/api/og` route (pour l'image)
- Content client R2 existant (src/lib/content.ts ou r2.ts)

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
