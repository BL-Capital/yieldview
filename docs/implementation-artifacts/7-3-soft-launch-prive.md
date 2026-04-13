# Story 7.3: Soft launch privé (2 semaines)

Status: ready-for-dev

<!-- Note: Story opérationnelle owner Bryan + Emmanuel. Validation = 10 briefings consécutifs sans couac. -->

## Story

As a PO Bryan,
I want un soft launch privé de 2 semaines avant le hard launch,
so that le pipeline IA soit validé en conditions réelles sans exposition publique.

## Acceptance Criteria

1. **AC1** — Sous-domaine `staging.[domaine]` créé (Cloudflare Pages) avec `robots.txt` disallow
2. **AC2** — 10 briefings consécutifs publiés sans couac technique (timeouts, erreurs pipeline, briefings vides)
3. **AC3** — 10 cartes OG archivées (captures dans `docs/soft-launch-og/`)
4. **AC4** — Logs GitHub Issues : 10 entrées pipeline `success` consécutives
5. **AC5** — 3 posts LinkedIn Bryan publiés (J-10, J-5, J-1) — templates dans `docs/ops/7-3-checklist-soft-launch.md`

## Tasks / Subtasks

- [ ] Task 1 — Configurer le sous-domaine staging (AC: 1)
  - [ ] Story 7.1 DONE (prérequis : domaine acheté + DNS Cloudflare)
  - [ ] `staging.[domaine]` ajouté comme custom domain dans Cloudflare Pages
  - [ ] `src/app/robots.ts` mis à jour : `Disallow: /` pour le host staging (détection via `process.env`)
  - [ ] Header `X-Robots-Tag: noindex, nofollow` configuré via Cloudflare Transform Rules

- [ ] Task 2 — Vérifier le pipeline GitHub Actions en conditions réelles (AC: 2, 4)
  - [ ] `.github/workflows/daily-pipeline.yml` cron actif (`0 6 * * 1-5`)
  - [ ] Premier run manuel déclenché via `workflow_dispatch`
  - [ ] 10 runs consécutifs success vérifiés dans les logs GitHub Actions
  - [ ] Aucune erreur : fetch APIs, génération Claude, upload R2, newsletter

- [ ] Task 3 — Archiver les cartes OG (AC: 3)
  - [ ] Dossier `docs/soft-launch-og/` créé
  - [ ] Pour chaque briefing : capturer l'image OG via `https://staging.[domaine]/api/og`
  - [ ] 10 captures sauvegardées : `briefing-01.png` … `briefing-10.png`

- [ ] Task 4 — Posts LinkedIn Bryan (AC: 5)
  - [ ] Post J-10 publié (template : `docs/ops/7-3-checklist-soft-launch.md`)
  - [ ] Post J-5 publié
  - [ ] Post J-1 publié

## Dev Notes

### Fichier robots.ts (Next.js 15)
```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'
  return {
    rules: isStaging
      ? { userAgent: '*', disallow: '/' }
      : { userAgent: '*', allow: '/' },
    sitemap: isStaging ? undefined : `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

### Variable d'environnement Cloudflare Pages
- Ajouter `NEXT_PUBLIC_IS_STAGING=true` dans les Settings du projet Cloudflare Pages pour la branche/domaine staging
- Production : ne pas définir cette variable (ou `=false`)

### Pipeline validation
- GitHub Actions logs : onglet Actions → workflow "Daily Pipeline"
- Script de log : `scripts/pipeline/log-run.ts` → `r2://yieldfield-content/logs/runs-last-7.json`
- `<PipelineLogsTable>` affiche les 7 derniers runs sur la page Coulisses

### Project Structure Notes
- Modification code : `src/app/robots.ts` (nouvelle logique staging)
- Variable env : `NEXT_PUBLIC_IS_STAGING` à ajouter dans `.env.example` (sans valeur sensible)
- Pas de modification de l'architecture pipeline

### References
- [Source: docs/planning-artifacts/architecture.md#Deployment] — Cloudflare Pages
- [Source: docs/implementation-artifacts/2-13-github-actions-daily-pipeline.md] — pipeline cron
- [Source: docs/ops/7-3-checklist-soft-launch.md] — guide opérationnel + templates posts

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-create-story

### Debug Log References

### Completion Notes List

### File List
