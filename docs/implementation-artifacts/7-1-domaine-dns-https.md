# Story 7.1: Domaine .io + DNS + HTTPS

Status: ready-for-dev

<!-- Note: Story opérationnelle owner Bryan. Validation = résolution DNS confirmée depuis 3 régions. -->

## Story

As a visiteur de YieldField,
I want accéder au site via un domaine `.io` propre avec HTTPS,
so that l'expérience soit professionnelle et le lien partageable le jour du launch.

## Acceptance Criteria

1. **AC1** — Issue GitHub #2 résolue par Bryan (nom de domaine `.io` choisi et confirmé)
2. **AC2** — Domaine acheté chez Namecheap ou Gandi (coût ≤ 5 €/mois, budget infra ≤ 8 €/mois hors domaine)
3. **AC3** — DNS délégué à Cloudflare (nameservers mis à jour chez le registrar, propagation confirmée)
4. **AC4** — Domaine custom configuré dans Cloudflare Pages (CNAME ou route custom domain)
5. **AC5** — HTTPS automatique via Cloudflare Pages (SSL/TLS mode "Full (strict)", HSTS activé)
6. **AC6** — Résolution < 200 ms depuis FR, EU (hors FR), US — vérifiée via `curl -o /dev/null -s -w "%{time_total}" https://[domaine]`
7. **AC7** — Sous-domaine `staging.` créé pour Story 7.3 (soft launch privé)

## Tasks / Subtasks

- [ ] Task 1 — Résoudre Issue GitHub #2 : choix du nom de domaine (AC: 1)
  - [ ] Bryan lit Issue #2 et propose le nom final (`yieldfield.io` ou alternative)
  - [ ] Emmanuel confirme la disponibilité via registrar
  - [ ] Issue #2 fermée avec le nom retenu

- [ ] Task 2 — Acheter le domaine .io (AC: 2)
  - [ ] Bryan crée un compte Namecheap ou Gandi (préférence Namecheap pour prix .io)
  - [ ] Domaine acheté avec renouvellement auto activé
  - [ ] Confirmation email reçue et archivée

- [ ] Task 3 — Déléguer le DNS à Cloudflare (AC: 3)
  - [ ] Compte Cloudflare créé (si pas déjà le cas — Web Analytics déjà configuré)
  - [ ] Zone DNS créée dans Cloudflare pour le domaine
  - [ ] Nameservers Cloudflare copiés dans le panneau DNS du registrar
  - [ ] Propagation vérifiée : `dig NS [domaine]` retourne les NS Cloudflare

- [ ] Task 4 — Configurer le custom domain dans Cloudflare Pages (AC: 4, 5)
  - [ ] Dans Cloudflare Pages → Project → Custom Domains → Add domain
  - [ ] CNAME `[domaine] → yieldfield.pages.dev` créé automatiquement par Cloudflare
  - [ ] SSL/TLS mode configuré en "Full (strict)"
  - [ ] HTTPS Redirect activé (Always Use HTTPS)
  - [ ] HSTS activé (Strict Transport Security header)

- [ ] Task 5 — Créer le sous-domaine staging (AC: 7)
  - [ ] `staging.[domaine]` ajouté en custom domain Cloudflare Pages (sur la même Pages app ou branche preview)
  - [ ] `robots.txt` disallow configuré pour staging (cf. Story 7.3)

- [ ] Task 6 — Tests de validation depuis 3 régions (AC: 6)
  - [ ] Test FR : `curl -o /dev/null -s -w "%{time_total}\n" https://[domaine]` < 0.200s
  - [ ] Test EU : idem depuis VPN Germany/Netherlands
  - [ ] Test US : idem depuis VPN US-East
  - [ ] `curl -I https://[domaine]` retourne `HTTP/2 200` + header `strict-transport-security`

## Dev Notes

### Contexte architectural
- **Hébergement : Cloudflare Pages** (free tier) — PAS Vercel. [Source: docs/planning-artifacts/architecture.md#Hosting]
- Cloudflare Pages fournit HTTPS automatique sur les custom domains
- Le projet utilise déjà Cloudflare : R2 (storage JSON), Web Analytics (layout.tsx), Workers (OG images)
- Compte Cloudflare probablement déjà créé (Web Analytics actif depuis Story 6.5)

### Budget
- Budget infra total : ≤ 8 €/mois hors domaine [Source: docs/planning-artifacts/architecture.md#Budget]
- Domaine .io : ~35-45€/an chez Namecheap (~3-4€/mois)
- Cloudflare Pages + R2 + Workers : free tier (0€)

### Commandes de vérification
```bash
# Vérifier nameservers
dig NS [domaine] +short

# Vérifier résolution + HTTPS
curl -I https://[domaine] | head -5

# Mesurer latence
curl -o /dev/null -s -w "DNS: %{time_namelookup}s | Connect: %{time_connect}s | Total: %{time_total}s\n" https://[domaine]

# Vérifier HSTS
curl -I https://[domaine] | grep -i strict
```

### Credentials à sauvegarder (NE PAS committer)
- Registrar : login + password → 1Password Bryan
- Cloudflare : email + API token → 1Password Bryan
- Date d'expiration du domaine à noter pour renouvellement

### Project Structure Notes
- Pas de modification de code source pour cette story
- Le `robots.txt` staging sera configuré dans Story 7.3 via `src/app/robots.ts` (Next.js 15 API)

### References
- [Source: docs/planning-artifacts/architecture.md#Hosting] — Cloudflare Pages choix
- [Source: docs/planning-artifacts/architecture.md#Budget] — ≤ 8€/mois constraint
- [Source: docs/planning-artifacts/epics.md#Story-7.1] — ACs originaux
- [Source: docs/ops/7-1-checklist-domaine.md] — Guide opérationnel détaillé Bryan

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 via bmad-create-story

### Debug Log References

### Completion Notes List

### File List
