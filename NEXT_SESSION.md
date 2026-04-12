# NEXT_SESSION — YieldField Sprint 3 (Core UI Dashboard)

**Dernière mise à jour :** 2026-04-12
**Phase BMAD :** Phase 4 Implementation — **Sprint 3 en cours**

---

## ⚡ TL;DR (30 secondes)

- **Epic 1** DONE — 7/7 stories, 18 pts
- **Epic 2** DONE — 14/14 stories, 39 pts (Sprint 2a + 2b)
- **180 tests passing, typecheck clean, 0 CVE**
- **Sprint 3** = Core UI Dashboard — 14 stories, 36 pts
- **Workflow** : dev batch toutes stories → review groupée (Blind/Edge/Auditor) → security audit → merge
- **Pulse Ring** validé (avatar supprimé per Issue #4, UX Amendment 001)

---

## 📋 État Epic 1 + 2 (done)

### Epic 1 — Foundation & Tooling (7/7 done)
- 1.1 Setup Next.js 15 + React 19 + TS strict
- 1.2 Design tokens Tailwind 4 @theme + self-hosted fonts
- 1.3 shadcn/ui base components
- 1.4 next-intl bilingue FR/EN
- 1.5 Layout Header + Footer + LanguageSwitcher
- 1.6 Pre-commit hook secrets
- 1.7 GitHub Actions workflow structure

### Epic 2 — Data Pipeline (14/14 done)
**Sprint 2a :** schemas Zod, client Finnhub, client FRED, client Alpha Vantage, fetch-data + fallback, bootstrap-vix (FRED VIXCLS), compute-alert percentile p90/252j
**Sprint 2b :** client Claude API (Anthropic SDK), prompt Chartiste Lettré v01, generate-ai, R2 client, publish-r2, daily-pipeline.yml, log-run

---

## 🎯 Sprint 3 — Core UI Dashboard (36 pts)

**Goal :** Hero homepage fonctionnel avec Aurora + Pulse Ring + Tagline + Briefing + Bento KPIs + Marquee secondaire.

### Stories (à dev en batch) :

| Story | Description | Pts | Status |
|---|---|---|---|
| 3.1 | Motion 12 install + reduced-motion hook | 2 | pending |
| 3.2 | Aceternity Aurora Background + Beams | 3 | pending |
| 3.3 | Magic UI Number Ticker | 2 | pending |
| 3.4 | Magic UI Animated Gradient Text | 1 | pending |
| 3.5 | Aceternity Text Generate Effect | 2 | pending |
| 3.6 | Aceternity Bento Grid | 3 | pending |
| 3.7 | Aceternity Glare Card | 2 | pending |
| 3.8 | Business `<KpiCard>` | 5 | pending |
| 3.9 | Business `<KpiBentoGrid>` | 3 | pending |
| 3.10 | Business BriefingPanel + TaglineHeader + MetadataChips | 5 | pending |
| 3.11 | Magic UI Ripple / FreshnessIndicator | 1 | pending |
| 3.12 | Content client `r2.ts` SSR | 2 | pending |
| 3.13 | `<HeroSection>` + `page.tsx` | 3 | pending |
| 3.14 | Business `<SecondaryKpisMarquee>` | 2 | pending |

**Total : 36 pts**

### Scope de repli (si débordement) :
- Reporter Story 3.7 Glare Card (2 pts) + Story 3.11 Ripple (1 pt) en Sprint 4 ou polish Sprint 6

---

## 🔑 Décisions clés Sprint 3

1. **Pulse Ring** remplace l'avatar — UX Amendment 001 validé (Issue #4 Bryan). HeroSection = abstract risk indicator, pas d'avatar humain.
2. **Données mockées** pour stories UI (3.1-3.11) — pipeline R2 branché en stories 3.12-3.13
3. **AuroraBackground** = fond principal, **BackgroundBeams** = overlay 40% opacity
4. **KpiCard** = composant business P0 le plus complexe (5 pts) — consomme Glare Card + NumberTicker + Lottie arrow

---

## 🛠️ Environnement technique

Stack figée :
- Next 15.5.15, React 19.1.0, TS 5.9.3 strict (pas de baseUrl)
- Tailwind 4.2.2 (@theme CSS inline)
- pnpm 10.33.0
- Motion 12 (à installer Story 3.1)
- shadcn/ui installé (Epic 1)

**PATH bash :** `export PATH="/c/Users/emmanuel.luiz_wedooa/AppData/Roaming/npm:$PATH"` avant pnpm

**Design tokens disponibles :** `--color-yield-dark`, `--color-yield-gold`, `--color-yield-bull`, `--color-yield-bear`, fonts Instrument Serif + Inter Variable + JetBrains Mono

---

## 📁 Fichiers clés

- `docs/planning-artifacts/sprint-plan.md` — Sprint 3 scope complet
- `docs/planning-artifacts/ux-design-specification.md` — specs visuelles
- `docs/planning-artifacts/ux-amendment-001-avatar-removal.md` — Pulse Ring décision
- `docs/implementation-artifacts/3-*.md` — stories Sprint 3 (à créer)
- `src/components/aceternity/` — composants à créer
- `src/components/magic-ui/` — composants à créer
- `src/components/dashboard/` — composants business à créer
- `src/lib/content.ts` — à créer (Story 3.12)

---

## 🔁 Prompt de reprise ultra-court

```
Reprise YieldField Sprint 3 Core UI. Epic 1+2 done (21 stories, 57 pts, 180 tests).
Sprint 3 = 14 stories 36 pts. Workflow : dev batch → review groupée → security → merge.
Pulse Ring validé (pas d'avatar). Lire NEXT_SESSION.md pour le détail.
```

---

*Fichier mis à jour par Claude Sonnet 4.6 — 2026-04-12*
