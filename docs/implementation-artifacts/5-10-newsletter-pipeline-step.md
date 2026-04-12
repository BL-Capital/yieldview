# Story 5.10 : Newsletter step dans pipeline `newsletter.ts`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** abonné newsletter YieldField,
**I want** recevoir automatiquement le briefing par email après chaque pipeline run,
**so that** je n'ai pas besoin de visiter le site pour lire l'analyse quotidienne.

**Business value :** FR45 — Envoi automatique post-pipeline. Le script s'intègre dans la chaîne existante (fetch → compute → generate → publish → **newsletter**).

---

## Acceptance Criteria

**AC1 -- Script créé**
- [ ] `scripts/pipeline/newsletter.ts` créé
- [ ] Exécutable via `npx tsx scripts/pipeline/newsletter.ts`
- [ ] Même pattern que les scripts existants (bracket notation, stderr logs)

**AC2 -- Fetch latest.json**
- [ ] Lit `latest.json` depuis R2 (via le client existant)
- [ ] Parse et valide avec `AnalysisSchema`
- [ ] Extrait tagline + briefing

**AC3 -- Envoi via Buttondown API**
- [ ] `POST https://api.buttondown.email/v1/emails`
- [ ] Header `Authorization: Token ${BUTTONDOWN_API_KEY}`
- [ ] Body : `{ subject: tagline, body: briefing, status: "sent" }`
- [ ] Email envoyé en format texte (Buttondown gère le rendu)

**AC4 -- Retry**
- [ ] 3 tentatives si Buttondown retourne 5xx
- [ ] Délai entre retries : 2s, 4s, 8s (backoff exponentiel)
- [ ] Log chaque tentative sur stderr

**AC5 -- Logging structuré**
- [ ] `[newsletter]` prefix sur tous les logs
- [ ] Log succès : `[newsletter] Sent to X subscribers (date: YYYY-MM-DD)`
- [ ] Log erreur : `[newsletter] ERROR: {message} (attempt X/3)`
- [ ] Log skip : `[newsletter] SKIP: No subscribers` si aucun abonné

**AC6 -- Sécurité**
- [ ] `BUTTONDOWN_API_KEY` lue depuis `process.env`
- [ ] Erreur claire si variable manquante
- [ ] Pas de log de la clé API

**AC7 -- Tests**
- [ ] Test : envoi réussi → log succès
- [ ] Test : Buttondown 5xx → retry 3x puis erreur
- [ ] Test : latest.json invalide → erreur et exit
- [ ] Test : BUTTONDOWN_API_KEY manquante → erreur descriptive
- [ ] Tests dans `scripts/pipeline/__tests__/newsletter.test.ts`

**AC8 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
scripts/pipeline/
  newsletter.ts (new)
  __tests__/
    newsletter.test.ts (new)
```

### Pattern scripts pipeline existant
```ts
// Bracket notation pour les accès dynamiques
const value = data['key']

// Logs sur stderr
console.error('[newsletter] Starting...')

// Exit codes
process.exit(0) // succès
process.exit(1) // erreur
```

### Buttondown Email API
- Endpoint : `POST /v1/emails`
- Body : `{ subject: string, body: string, status: "sent" }`
- Envoie à tous les abonnés actifs automatiquement
- Headers : `Authorization: Token <API_KEY>`, `Content-Type: application/json`

### Retry helper
```ts
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 2000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) throw error
      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.error(`[newsletter] Retry ${attempt}/${maxRetries} in ${delay}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}
```

### Dépendances
- R2 client (src/lib/r2.ts)
- AnalysisSchema (src/lib/schemas/analysis.ts)
- Aucune nouvelle dépendance npm

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
