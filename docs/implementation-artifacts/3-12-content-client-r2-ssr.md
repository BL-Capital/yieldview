# Story 3.12 : Content client `r2.ts` (lecture SSR)

Status: ready-for-dev
Epic: 3 -- Core UI Components (Dashboard)
Sprint: 3 (semaine 4)
Points: 2
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un client SSR pour lire le JSON `latest.json` depuis Cloudflare R2 (ou le fallback local),
**so that** la page homepage Next.js peut récupérer les données du pipeline au moment du rendu serveur (ISR / SSR) sans exposer les credentials côté client.

**Business value :** Story pivot entre le backend (Epic 2) et le frontend (Epic 3). Sans content client, les composants UI reçoivent des données mockées ad vitam. C'est le branchement des deux épics.

---

## Acceptance Criteria

**AC1 -- Fonction `getLatestAnalysis()`**
- [ ] `src/lib/content.ts` créé
- [ ] Export `async function getLatestAnalysis(): Promise<AnalysisResult>`
- [ ] Type `AnalysisResult` importé depuis `src/lib/schemas.ts` (Story 2.1)
- [ ] Stratégie fetch : `fetch(R2_URL, { next: { revalidate: 3600 } })` (ISR 1h)

**AC2 -- URL R2 depuis variable d'environnement**
- [ ] Lit `process.env.NEXT_PUBLIC_R2_PUBLIC_URL` pour l'URL publique R2
- [ ] Format attendu : `https://pub-xxxx.r2.dev/yieldfield-content/latest.json`
- [ ] Si env var absente → log warning + fallback

**AC3 -- Fallback sur données locales**
- [ ] Si fetch R2 échoue (network, 404, timeout) → fallback sur `src/data/fallback-analysis.json`
- [ ] `fallback-analysis.json` contient des données statiques valides (données de démo, non sensibles)
- [ ] Le fallback log un warning côté serveur : `console.warn('[content] R2 fetch failed, using fallback')`
- [ ] Pas de throw en production — toujours retourner des données valides

**AC4 -- Validation Zod**
- [ ] Les données R2 sont parsées avec le schema Zod `AnalysisResultSchema` (Story 2.1)
- [ ] Si parse échoue → fallback (pas de crash)
- [ ] Timeout fetch : 5 secondes max

**AC5 -- Tests unitaires**
- [ ] Test : fetch réussi → retourne `AnalysisResult` valide
- [ ] Test : fetch échoue (mock `fetch` reject) → retourne fallback sans throw
- [ ] Test : réponse R2 invalide (parse Zod fail) → retourne fallback
- [ ] Tests dans `tests/lib/content.test.ts` avec `vi.stubGlobal('fetch', ...)`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Structure `src/lib/content.ts`
```typescript
import { AnalysisResultSchema } from './schemas'

const R2_URL = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/latest.json`

export async function getLatestAnalysis() {
  try {
    const res = await fetch(R2_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`R2 fetch ${res.status}`)
    const json = await res.json()
    return AnalysisResultSchema.parse(json)
  } catch (err) {
    console.warn('[content] R2 fetch failed, using fallback', err)
    const fallback = await import('../data/fallback-analysis.json')
    return AnalysisResultSchema.parse(fallback.default)
  }
}
```

### Fichier fallback-analysis.json
Données statiques réalistes (pas de données sensibles). Structure identique au JSON produit par Story 2.10 (generate-ai).

### Variables d'environnement requises
```
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxx.r2.dev/yieldfield-content
```
À documenter dans `.env.example`.

### Fichiers à créer
```
src/lib/content.ts
src/data/fallback-analysis.json
tests/lib/content.test.ts
```
(+ mise à jour `.env.example`)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
