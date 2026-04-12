# Story 5.9 : RSS feed `/[locale]/feed.xml`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 2
Priority: P1
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** power-user utilisant un lecteur RSS (Feedly, Inoreader),
**I want** un flux RSS 2.0 avec le dernier briefing YieldField,
**so that** je peux suivre les publications sans visiter le site ni m'abonner à la newsletter.

**Business value :** FR49 — Canal de distribution supplémentaire pour les utilisateurs techniques et les agrégateurs de contenu finance.

---

## Acceptance Criteria

**AC1 -- Route RSS créée**
- [ ] `src/app/[locale]/feed.xml/route.ts` créé
- [ ] Export `GET` handler
- [ ] Content-Type : `application/rss+xml; charset=utf-8`

**AC2 -- Format RSS 2.0 valide**
- [ ] `<channel>` avec title, link, description, language
- [ ] `<item>` avec le dernier briefing : title (tagline), description (briefing), pubDate, link, guid
- [ ] Bilingue : `/fr/feed.xml` → contenu FR, `/en/feed.xml` → contenu EN

**AC3 -- Cache**
- [ ] Headers `Cache-Control: public, max-age=3600` (1h)
- [ ] Revalidation après chaque pipeline run via ISR

**AC4 -- Fallback**
- [ ] Si fetch latest.json échoue → RSS vide avec message "No briefing available"
- [ ] Retourne 200 même en fallback

**AC5 -- Tests**
- [ ] Test : GET `/fr/feed.xml` → 200 avec content-type RSS
- [ ] Test : contenu XML valide (parse sans erreur)
- [ ] Test : item contient tagline + briefing
- [ ] Tests dans `src/app/[locale]/feed.xml/__tests__/`

**AC6 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/app/[locale]/feed.xml/
  route.ts (new)
  __tests__/feed.test.ts (new)
```

### Pattern RSS route handler
```tsx
export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale
  const analysis = await fetchLatestAnalysis()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>YieldField — ${locale === 'fr' ? 'Briefing Quotidien' : 'Daily Briefing'}</title>
    <link>https://yieldfield.io/${locale}</link>
    <description>...</description>
    <language>${locale}</language>
    <item>
      <title>${escapeXml(analysis.tagline[locale])}</title>
      <description>${escapeXml(analysis.briefing[locale])}</description>
      <pubDate>${new Date(analysis.generated_at).toUTCString()}</pubDate>
      <guid>https://yieldfield.io/${locale}#${analysis.date}</guid>
    </item>
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

### XML escaping
Créer un helper `escapeXml()` pour échapper `<>&"'` dans les contenus dynamiques.

### Dépendances
- Content client R2 existant (src/lib/content.ts)
- Aucune nouvelle dépendance npm

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
