# Story 5.5 : Newsletter endpoint `/api/newsletter/subscribe`

Status: draft
Epic: 5 -- Alert Banner, Newsletter, Distribution
Sprint: 5 (semaine 6)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** visiteur de YieldField,
**I want** pouvoir m'abonner à la newsletter quotidienne via un endpoint sécurisé,
**so that** je reçois le briefing par email chaque matin sans que ma donnée email soit exposée côté client.

**Business value :** Première API route du projet. Proxy sécurisé vers Buttondown — la clé API reste server-side. FR44 + FR46 couverts (inscription + unsubscribe via lien Buttondown natif).

---

## Acceptance Criteria

**AC1 -- Route API créée**
- [ ] `src/app/api/newsletter/subscribe/route.ts` créé
- [ ] Export `POST` handler uniquement
- [ ] Pas de GET/PUT/DELETE

**AC2 -- Validation input**
- [ ] Body JSON : `{ email: string }`
- [ ] Validation Zod : email format strict
- [ ] Retourne 400 avec message si email invalide

**AC3 -- Proxy Buttondown API**
- [ ] Appel `POST https://api.buttondown.email/v1/subscribers`
- [ ] Header `Authorization: Token ${BUTTONDOWN_API_KEY}`
- [ ] `BUTTONDOWN_API_KEY` lue depuis `process.env` (server-side only)
- [ ] Double opt-in : envoyer `type: "unactivated"` pour que Buttondown envoie l'email de confirmation
- [ ] Retourne 201 si succès, 409 si déjà inscrit, 502 si Buttondown échoue

**AC4 -- Rate limiting**
- [ ] IP-based, 3 requêtes par minute par IP
- [ ] Utilise Map<string, number[]> en mémoire (pas de Redis nécessaire)
- [ ] Retourne 429 avec `Retry-After` header si limite dépassée

**AC5 -- Sécurité**
- [ ] `BUTTONDOWN_API_KEY` jamais exposée dans la réponse
- [ ] Headers CORS restrictifs (même origine)
- [ ] Input sanitisé (trim, lowercase email)
- [ ] Pas de stack trace dans les réponses d'erreur

**AC6 -- Tests**
- [ ] Test : POST avec email valide → 201
- [ ] Test : POST avec email invalide → 400
- [ ] Test : POST sans body → 400
- [ ] Test : Rate limit dépassé → 429
- [ ] Test : Buttondown erreur → 502
- [ ] Test : Email déjà inscrit → 409
- [ ] Tests dans `src/app/api/newsletter/__tests__/`

**AC7 -- Quality gates**
- [ ] `pnpm run lint` : 0 erreur
- [ ] `pnpm run typecheck` : 0 erreur
- [ ] `pnpm run test` : tous les tests passent
- [ ] `pnpm run build` : 0 erreur

---

## Dev Notes

### Structure fichiers
```
src/app/api/newsletter/
  subscribe/
    route.ts (new)
  __tests__/
    subscribe.test.ts (new)
```

### Pattern route handler Next.js App Router
```tsx
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SubscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  // 1. Rate limit check
  // 2. Parse & validate body
  // 3. Proxy to Buttondown
  // 4. Return response
}
```

### Variable d'environnement
`BUTTONDOWN_API_KEY` doit être dans `.env.local` (gitignored) et dans les secrets GitHub.

### Buttondown API
- Docs : https://api.buttondown.email/v1/
- Endpoint subscribers : `POST /v1/subscribers`
- Body : `{ email, type: "unactivated" }` pour double opt-in
- 201 = créé, 400 = invalide, 409 = existant

### Dépendances
- Zod (déjà installé)
- Aucune nouvelle dépendance npm

---

## Dev Agent Record

### Agent
(pending)

### Status
draft
