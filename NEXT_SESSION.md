# NEXT_SESSION — YieldField Sprint 4 : Rive Avatar & Coulisses

**Derniere mise a jour :** 2026-04-12
**Phase BMAD :** Phase 4 Implementation — **Sprint 4 a demarrer**

---

## TL;DR (30 secondes)

- **Epic 1+2+3** DONE — 35/35 stories, 93 pts, 224 tests, pushed `main`
- **Sprint 3** review + security DONE (commit `c3ed47e`, Issue #7 Bryan)
- **Sprint 4** : Rive Avatar & Coulisses Page — **28 pts (23 P0 + 5 P1)**
- **Workflow habituel** : creer stories → dev batch → code review → security audit → commit + push + issue Bryan

---

## Etat du projet

| Epic | Stories | Points | Status |
|------|---------|--------|--------|
| Epic 1 — Foundation | 7/7 | 18 | DONE |
| Epic 2 — Data Pipeline | 14/14 | 39 | DONE |
| Epic 3 — Core UI Dashboard | 14/14 | 36 | DONE (reviewed + secured) |
| **Epic 4 ��� Rive Avatar & Coulisses** | **0/11** | **28** | **A FAIRE** |

**Tests** : 224 passing | **Build** : 166 kB | **Security** : 4/4 gates PASS

---

## Sprint 4 — Scope (28 pts)

### Stories P0 (23 pts — obligatoires)

| Story | Titre | Pts | Description |
|-------|-------|-----|-------------|
| 4.1 | Lottie icons library | 2 | `@dotlottie/react-player`, 5 animations, `LottieIcon` wrapper |
| 4.2 | Rive avatar fallback SVG + setup | 3 | `@rive-app/react-canvas`, 4 SVG variants (low/medium/high/crisis), `HeroAvatar` |
| 4.4 | Aceternity Tracing Beam | 3 | Scroll-following beam, reduced-motion respect |
| 4.5 | Magic UI Dot Pattern | 1 | Background Coulisses page |
| 4.6 | Aceternity Code Block Animated | 3 | Syntax highlighting, copy button + ShineBorder |
| 4.7 | Magic UI Shine Border | 1 | Boutons interactifs |
| 4.8 | TimelineStep + PromptCodeBlock | 3 | Timeline composant + wrapper prompt diffs |
| 4.9 | PipelineLogsTable | 3 | Table shadcn, fetch R2 `runs-last-7.json` |
| 4.10 | Content Coulisses MDX (5+ etapes) | 3 | Idee → BMAD → Pipeline → Prompts v01-v06 → Cloudflare |
| 4.11 | page.tsx Coulisses | 1 | `/[locale]/coulisses` server component, assemblage |

### Story P1 (5 pts — optionnelle, peut aller en V1.1)

| Story | Titre | Pts | Description |
|-------|-------|-----|-------------|
| 4.3 | Rive avatar.riv asset | 5 | Fichier .riv < 120 KB, state machine risk levels |

### Risques Sprint 4
- **R1** : Creation Rive asset longue → SVG fallback suffit pour MVP
- **R2** : Tracing Beam complexe avec scroll → fallback timeline statique

### Definition of Done
- [ ] Page Coulisses rendue avec 5+ etapes + Tracing Beam
- [ ] Prompts v01-v06 dans CodeBlocks avec bouton copy
- [ ] Pipeline logs table depuis R2
- [ ] LottieIcons sur fleches KPI
- [ ] Rive avatar OU fallback SVG actif

---

## Deferred de Sprint 3 (a integrer dans Sprint 4)

- **AA-02** : `Intl.NumberFormat` pour formatage locale des KPIs (FR: `7 535,23`)
- **BH-15** : Secondary KPIs depuis R2 au lieu de `STATIC_SECONDARY_KPIS`

---

## Fichiers de reference

- Sprint plan : `docs/planning-artifacts/sprint-plan.md` (lignes 182-216)
- Epics detail : `docs/planning-artifacts/epics.md` (section Epic 4, ligne 364+)
- Story specs : a creer dans `docs/implementation-artifacts/`

---

## Consignes pour la prochaine session

1. **Lire ce fichier** (`NEXT_SESSION.md`) pour reprendre le contexte
2. **Creer les 11 story specs** dans `docs/implementation-artifacts/` (format habituel : Story/AC/Dev Notes/Dev Agent Record)
3. **Dev batch** toutes les stories P0 d'abord (23 pts), puis P1 si le temps
4. **A la fin du sprint** : code review (`bmad-code-review`) → security audit (`yieldfield-security-audit`) → commit + push + issue GitHub Bryan
5. **Nouvelles deps a installer** : `@dotlottie/react-player`, `@rive-app/react-canvas`
6. **Nouvelle page** : `src/app/[locale]/coulisses/page.tsx`
7. **Ne pas oublier** les 2 deferred Sprint 3 (Intl.NumberFormat + secondary KPIs R2)

---

## Prompt de reprise ultra-court

```
Reprise YieldField. Epic 1+2+3 done (35 stories, 93 pts, 224 tests).
Sprint 4 a demarrer : Rive Avatar & Coulisses (28 pts, 11 stories).
On fait comme d'habitude : creer stories → dev batch → review + secu a la fin.
Lire NEXT_SESSION.md.
```

---

*Fichier mis a jour par Claude Opus 4.6 — 2026-04-12*
