# Story 5.7 : OG image dynamique `/api/og/route.tsx`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 5
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur partageant YieldField sur les réseaux sociaux,
**I want** que le lien génère une image Open Graph dynamique avec le briefing du jour,
**so that** chaque partage affiche un aperçu unique et professionnel avec les données à jour.

**Business value :** FR47 — Les OG images dynamiques transforment chaque partage en mini-publicité avec les données du jour. Effet viral potentiel sur LinkedIn et Twitter/X.

---

## Acceptance Criteria

**AC1 -- Dépendance installée**
- [ ] `pnpm add @vercel/og` ajouté au projet
- [ ] Compatible avec le runtime Edge / Cloudflare Workers

**AC2 -- Route API créée**
- [ ] `src/app/api/og/route.tsx` créé
- [ ] Export `GET` handler
- [ ] `export const runtime = 'edge'` pour Edge Runtime

**AC3 -- Génération image dynamique**
- [ ] Fond yield-dark (#0F0F0F)
- [ ] Logo YieldField (texte ou SVG inline)
- [ ] Tagline du jour (extraite de `latest.json` via R2)
- [ ] 1 chiffre clé (ex: S&P 500 variation)
- [ ] Snippet briefing (première phrase)
- [ ] Date du briefing
- [ ] Signature "YieldField — Finance × IA"

**AC4 -- Query params bilingue**
- [ ] `?locale=fr` → textes en français
- [ ] `?locale=en` → textes en anglais
- [ ] Défaut : `fr`

**AC5 -- Cache**
- [ ] Headers `Cache-Control: public, max-age=3600` (1h)
- [ ] ETag basé sur la date du briefing

**AC6 -- Fallback**
- [ ] Si fetch `latest.json` échoue → image statique générique
- [ ] Image statique dans `public/og-fallback.png` (1200x630)
- [ ] Retourne 200 même en fallback (pas de 500)

**AC7 -- Dimensions**
- [ ] 1200 x 630 pixels (standard OG)
- [ ] Format PNG

**AC8 -- Tests**
- [ ] Test : GET `/api/og` → 200 avec content-type image/png
- [ ] Test : GET `/api/og?locale=en` → contenu EN
- [ ] Test : fallback quand latest.json indisponible → 200
- [ ] Tests dans `src/app/api/og/__tests__/`

**AC9 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/app/api/og/
  route.tsx (new)
  __tests__/og.test.ts (new)
public/
  og-fallback.png (new, 1200x630)
```

### Pattern @vercel/og
```tsx
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') ?? 'fr'

  // Fetch latest.json from R2
  // Build JSX layout
  return new ImageResponse(
    <div style={{ /* ... */ }}>
      {/* Layout */}
    </div>,
    { width: 1200, height: 630 }
  )
}
```

### Compatibilité Cloudflare Pages
- `@vercel/og` utilise Satori + Resvg-wasm — vérifier que le WASM module fonctionne sur Cloudflare Workers
- Alternative si incompatible : `satori` directement + `@resvg/resvg-wasm`
- Point d'attention noté dans NEXT_SESSION.md

### Fonts
- Charger les fonts depuis `public/fonts/` ou inline (pas de réseau au runtime Edge)
- `Inter` pour body, `Instrument Serif` pour tagline

### Dépendances
- `@vercel/og` (nouvelle dépendance)
- R2 client existant (`src/lib/r2.ts`) pour fetch latest.json
- Schemas existants pour parser l'analysis

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
