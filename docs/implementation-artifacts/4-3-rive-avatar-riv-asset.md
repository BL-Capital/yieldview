# Story 4.3 : Rive Avatar — Fichier .riv Asset

Status: ready-for-dev
Epic: 4 -- Rive Avatar & Coulisses Page
Sprint: 4 (semaine 5) — **P1 : peut être reportée V1.1**
Points: 5
Priority: P1
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** visiteur du site,
**I want** voir un avatar Rive interactif qui réagit au niveau de risque ET à ma souris,
**so that** l'expérience YieldField est véritablement unique et mémorable.

**Business value :** Différentiateur visuel majeur. L'avatar Rive animé est l'élément qui fait dire "jamais vu". Cependant, le fallback SVG (Story 4.2) assure le MVP. Cette story est optionnelle pour la V1.0.

**Note P1 :** Si délai ou complexité, reporter en V1.1. Le SVG fallback de Story 4.2 est suffisant pour le lancement.

---

## Acceptance Criteria

**AC1 -- Asset .riv**
- [ ] Fichier `public/rive/avatar.riv` créé via Rive Editor (rive.app)
- [ ] Taille < 120 KB
- [ ] State machine nommée `"RiskStateMachine"`

**AC2 -- State Machine**
- [ ] Input `riskLevel: number` (0=low, 1=medium, 2=high, 3=crisis)
- [ ] Input `mouseX: number` (0-1, position relative)
- [ ] Input `mouseY: number` (0-1, position relative)
- [ ] Input `clicked: trigger`
- [ ] 4 états idle : `idle_low`, `idle_medium`, `idle_high`, `idle_crisis`
- [ ] État `wake_up` : animation au chargement de la page
- [ ] État `wink` : déclenché par `clicked` trigger

**AC3 -- Intégration `<HeroAvatar>`**
- [ ] `src/components/rive/HeroAvatar.tsx` mis à jour (prop `useRive: true`)
- [ ] Utilise `useRive` hook de `@rive-app/react-canvas`
- [ ] Mouse tracking via `onMouseMove` sur le container
- [ ] Fallback transparent : si `.riv` échoue à charger → bascule sur SVG (Story 4.2)
- [ ] Respect `prefers-reduced-motion` : pose statique `idle_{riskLevel}` sans transitions

**AC4 -- Performance**
- [ ] Chargement `.riv` lazy (dynamique, pas dans le bundle initial)
- [ ] Canvas WebGL avec fallback 2D Canvas
- [ ] Pas de jank lors de la transition entre états

**AC5 -- Tests**
- [ ] Test : fallback SVG activé si `useRive: false`
- [ ] Test : fallback SVG activé si `prefers-reduced-motion: reduce`
- [ ] Tests dans `tests/components/rive/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur (asset .riv dans `public/`)

---

## Dev Notes

### Création du .riv
Utiliser Rive Editor (rive.app) — compte gratuit suffisant.
Référence : tutoriel "State Machine with triggers" dans la doc Rive.

### Pattern useRive
```tsx
const { RiveComponent, rive } = useRive({
  src: '/rive/avatar.riv',
  stateMachines: 'RiskStateMachine',
  autoplay: true,
})

// Update risk level
useEffect(() => {
  const input = rive?.stateMachineInputs('RiskStateMachine')
    ?.find(i => i.name === 'riskLevel')
  if (input) input.value = riskLevelToNumber(riskLevel)
}, [rive, riskLevel])
```

### Dépendances
- Story 4.2 : HeroAvatar SVG fallback (prérequis — doit être done en premier)

---

## Dev Agent Record

### Agent
Claude Sonnet 4.6

### Status
ready-for-dev

### Deviations
_P1 : peut être skipée si délai — SVG fallback Story 4.2 suffit pour MVP_
