# Story 8.2: KPIs dynamiques — highlight valeurs significatives du jour

Status: ready-for-dev

## Story

As a visiteur de YieldField,
I want voir mis en évidence les KPIs qui ont le plus bougé aujourd'hui,
so that je comprends immédiatement où est l'information la plus importante sans tout lire.

## Acceptance Criteria

1. Les 2 KPIs avec la variation absolue `|change_pct|` la plus élevée reçoivent un traitement visuel distinctif ("featured")
2. La logique de sélection est côté rendu (client) dans `KpiBentoGrid.tsx` — pas de modification du pipeline/schéma
3. Le `KpiCard` featured a un border gold plus lumineux + badge "📈 Top mouvement" (FR) / "📈 Top move" (EN)
4. En cas d'égalité ou de données `change_pct = 0` sur tous les KPIs, aucun featured (fallback gracieux)
5. Le highlight ne modifie pas la grille bento (positions, `colSpan`) — uniquement visuel
6. `pnpm build` et `pnpm typecheck` clean
7. Tests unitaires : logique `getTopMovers(kpis, n)` couverte à 100%

## Tasks / Subtasks

- [ ] Créer la fonction `getTopMovers` dans `src/lib/kpi-utils.ts` (AC: #1, #4, #7)
  - [ ] Signature : `getTopMovers(kpis: Kpi[], n: number): Set<string>` — retourne les IDs des n KPIs avec `|change_pct|` le plus élevé
  - [ ] Edge case : si tous `change_pct === 0` → retourner `Set` vide
  - [ ] Edge case : moins de `n` KPIs → retourner tous les IDs
  - [ ] Créer `src/lib/__tests__/kpi-utils.test.ts` avec tests exhaustifs

- [ ] Ajouter prop `isFeatured?: boolean` à `KpiCard` (AC: #3, #5)
  - [ ] Fichier : `src/components/dashboard/KpiCard.tsx`
  - [ ] Si `isFeatured` : border `border-yield-gold` (au lieu de `border-border`), glow subtil `shadow-[0_0_12px_rgba(201,168,76,0.3)]`
  - [ ] Badge "📈 Top mouvement" / "📈 Top move" en `text-xs font-mono text-yield-gold` en haut à droite du card
  - [ ] Interface `KpiCardProps` mise à jour avec `isFeatured?: boolean` et `locale: string`

- [ ] Intégrer dans `KpiBentoGrid.tsx` (AC: #2, #5)
  - [ ] Importer `getTopMovers` depuis `@/lib/kpi-utils`
  - [ ] `const topMovers = getTopMovers(kpis, 2)` avant le render
  - [ ] Passer `isFeatured={topMovers.has(kpi.id)}` à chaque `<KpiCard />`

- [ ] Valider build + typecheck (AC: #6)
  - [ ] `pnpm build` → 0 erreur
  - [ ] `pnpm typecheck` → 0 erreur TypeScript

## Dev Notes

### Schéma Kpi disponible
```typescript
// src/lib/schemas/kpi.ts
export const KpiSchema = z.object({
  id: z.string(),
  change_pct: z.number(),   // ← BASE du calcul highlight
  change_day: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
  // ...
});
```

### Fonction à créer — `src/lib/kpi-utils.ts`
```typescript
import type { Kpi } from '@/lib/schemas/kpi'

/**
 * Returns the IDs of the top N KPIs by absolute change percentage.
 * Returns empty Set if all change_pct === 0.
 */
export function getTopMovers(kpis: Kpi[], n: number): Set<string> {
  const allZero = kpis.every(k => k.change_pct === 0)
  if (allZero) return new Set()

  return new Set(
    [...kpis]
      .sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct))
      .slice(0, n)
      .map(k => k.id)
  )
}
```

### Modification KpiCard — prop isFeatured
```tsx
// src/components/dashboard/KpiCard.tsx
interface KpiCardProps {
  kpi: Kpi
  locale: string
  isAlert?: boolean
  colSpan?: 1 | 2 | 3
  isFeatured?: boolean  // ← nouveau
}

// Dans le JSX du card container :
className={cn(
  'relative rounded-xl border p-4 ...',
  isFeatured
    ? 'border-yield-gold shadow-[0_0_12px_rgba(201,168,76,0.3)]'
    : 'border-border'
)}

// Badge dans le coin haut-droit (si isFeatured) :
{isFeatured && (
  <span className="absolute top-2 right-2 text-[10px] font-mono text-yield-gold">
    {locale === 'fr' ? '📈 Top mouvement' : '📈 Top move'}
  </span>
)}
```

### Modification KpiBentoGrid
```tsx
// src/components/dashboard/KpiBentoGrid.tsx
import { getTopMovers } from '@/lib/kpi-utils'  // ← ajouter import

export function KpiBentoGrid({ kpis, locale = 'fr', className }: KpiBentoGridProps) {
  const topMovers = getTopMovers(kpis, 2)  // ← ajouter avant return
  // ...
  <KpiCard
    kpi={kpi}
    locale={locale}
    isAlert={ALERT_IDS.includes(kpi.id)}
    colSpan={COL_SPANS[kpi.id] ?? 1}
    isFeatured={topMovers.has(kpi.id)}  // ← ajouter
  />
}
```

### Fichier de test à créer
```
src/lib/__tests__/kpi-utils.test.ts
```
Cas à couvrir :
- Top 2 avec données normales
- Edge case : tous `change_pct = 0` → Set vide
- Edge case : moins de 2 KPIs
- Tri correct (valeur absolue, pas signée)

### Project Structure Notes
- Nouveau fichier : `src/lib/kpi-utils.ts`
- Nouveau fichier : `src/lib/__tests__/kpi-utils.test.ts`
- Modifications : `KpiCard.tsx`, `KpiBentoGrid.tsx`
- **Ne pas modifier** : `src/lib/schemas/kpi.ts`, `scripts/pipeline/`, `src/lib/content.ts`

### References
- [Source: src/lib/schemas/kpi.ts] — champ `change_pct`, `id`
- [Source: src/components/dashboard/KpiBentoGrid.tsx] — intégration KpiCard
- [Source: src/components/dashboard/KpiCard.tsx] — props actuelles, badge change existant
- [Source: docs/planning-artifacts/epics.md#Epic 8 Story 8.2]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (create-story)

### Debug Log References

### Completion Notes List

### File List
