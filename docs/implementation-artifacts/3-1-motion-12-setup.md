# Story 3.1 : Motion 12 install + setup reduced-motion

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
**I want** installer Motion 12 et créer un hook `usePrefersReducedMotion` avec des variants d'animation réutilisables,
**so that** toutes les animations du Sprint 3 respectent la préférence système `prefers-reduced-motion` et partagent un vocabulaire d'animation cohérent.

**Business value :** Motion 12 est le moteur d'animation de tout le sprint. Sans ce setup, aucune des stories 3.2-3.14 ne peut animer proprement. Le hook reduced-motion est une exigence WCAG 2.1 AA non négociable.

---

## Acceptance Criteria

**AC1 -- Installation Motion 12**
- [ ] `pnpm add motion` exécuté, package dans `package.json` dependencies
- [ ] Pas de conflit avec React 19 / Next 15

**AC2 -- Hook `usePrefersReducedMotion`**
- [ ] Fichier `src/hooks/usePrefersReducedMotion.ts` créé
- [ ] Utilise `window.matchMedia('(prefers-reduced-motion: reduce)')` avec listener
- [ ] SSR-safe (retourne `false` côté serveur, pas d'accès direct à `window` au render)
- [ ] TypeScript strict, pas de `any`

**AC3 -- Variants d'animation réutilisables**
- [ ] Fichier `src/lib/motion-variants.ts` créé
- [ ] Export `fadeInUp` : `{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }`
- [ ] Export `staggerContainer` : `{ visible: { transition: { staggerChildren: 0.1 } } }`
- [ ] Export `scaleIn` : `{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }`
- [ ] Chaque variant a une durée `duration: 0.4` et easing `easeOut`

**AC4 -- Tests unitaires**
- [ ] Test du hook : mock `matchMedia`, vérifier retour `true` quand `prefers-reduced-motion: reduce`
- [ ] Test du hook : vérifier retour `false` par défaut (no preference)
- [ ] Tests dans `tests/hooks/usePrefersReducedMotion.test.ts`

**AC5 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent

---

## Dev Notes

### Fichiers à créer
```
src/hooks/usePrefersReducedMotion.ts
src/lib/motion-variants.ts
tests/hooks/usePrefersReducedMotion.test.ts
```

### Pattern SSR-safe pour le hook
```typescript
import { useState, useEffect } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
```

### Usage dans les composants enfants
```typescript
const prefersReducedMotion = usePrefersReducedMotion()
const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }
```

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_aucune_
