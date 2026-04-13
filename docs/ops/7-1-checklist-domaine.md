# 7.1 — Checklist opérationnelle : Domaine & DNS

> **Bryan** — Ce guide te permet de passer de 0 à un domaine `yieldfield.io` actif pointant sur Cloudflare Pages, en ~45 minutes.

---

## 1. Choix du registrar : Namecheap vs Gandi

| Critère | Namecheap | Gandi |
|---|---|---|
| Prix `.io` (annuel) | ~$32–35 | ~$40–45 |
| Interface | Simple, bien documentée | Plus technique mais claire |
| WHOIS privacy | Inclus gratuit | Inclus gratuit |
| Support | Chat 24/7 | Email/ticket (délai 24h) |
| 2FA | Oui | Oui |
| Réputation | Très bonne | Excellente (EU-based) |
| **Recommandation** | **Meilleur rapport qualité/prix** | Si tu veux un hébergeur EU RGPD-strict |

**Recommandation : Namecheap** pour `yieldfield.io`.

---

## 2. Achat du domaine

### Étapes Namecheap

- [ ] Aller sur [namecheap.com](https://namecheap.com)
- [ ] Rechercher `yieldfield.io`
- [ ] Vérifier disponibilité — si pris, tenter `yieldfield.finance` ou `yieldfield.ai`
- [ ] Ajouter au panier → Checkout
- [ ] **Désactiver** les options "Auto-Renew Email" payantes (garder juste le domaine)
- [ ] Activer **WhoisGuard** (gratuit, protège tes coordonnées)
- [ ] Payer (CB ou PayPal)
- [ ] Confirmer l'email de vérification ICANN (arrivera dans 15 min)

> **Durée recommandée :** 2 ans (évite l'oubli de renouvellement)

---

## 3. Création du compte Cloudflare et ajout de la zone

- [ ] Aller sur [cloudflare.com](https://cloudflare.com) → **Sign up** (gratuit)
- [ ] Dashboard → **Add a Site** → entrer `yieldfield.io`
- [ ] Choisir le plan **Free**
- [ ] Cloudflare scanne les DNS existants → **Continue**
- [ ] Cloudflare affiche 2 nameservers, exemple :
  ```
  aria.ns.cloudflare.com
  bob.ns.cloudflare.com
  ```
  (tes nameservers réels seront différents — noter les tiens)

---

## 4. Configuration des nameservers Namecheap → Cloudflare

- [ ] Dans Namecheap → **Domain List** → `yieldfield.io` → **Manage**
- [ ] Section **Nameservers** → choisir **Custom DNS**
- [ ] Entrer les 2 nameservers Cloudflare (copiés depuis Cloudflare)
- [ ] Sauvegarder
- [ ] Propagation : **5 min à 48h** (généralement < 30 min pour `.io`)
- [ ] Dans Cloudflare, cliquer **Done, check nameservers** — attendre email de confirmation

---

## 5. Enregistrements DNS dans Cloudflare pour Cloudflare Pages

Une fois la zone active dans Cloudflare :

- [ ] Dashboard Cloudflare → `yieldfield.io` → **DNS** → **Records**

### Enregistrements à créer

| Type | Nom | Valeur | Proxy | TTL |
|---|---|---|---|---|
| CNAME | `www` | `yieldfield.pages.dev` | **Proxied (orange)** | Auto |
| CNAME | `@` (root) | `yieldfield.pages.dev` | **Proxied (orange)** | Auto |
| CNAME | `staging` | `yieldfield.pages.dev` | **Proxied (orange)** | Auto |

> **Note :** Pour le root `@`, Cloudflare utilise son système CNAME Flattening automatiquement. Les CNAME pointent vers le sous-domaine `.pages.dev` de ton projet Cloudflare Pages.

### SSL/TLS dans Cloudflare
- [ ] **SSL/TLS** → Mode : **Full (strict)**
- [ ] **Edge Certificates** → activer **Always Use HTTPS**
- [ ] Activer **Automatic HTTPS Rewrites**

---

## 6. Configuration du custom domain dans Cloudflare Pages

- [ ] Dans Cloudflare Dashboard → **Pages** → ton projet `yieldview`
- [ ] Onglet **Custom domains** → **Set up a custom domain**
- [ ] Entrer `yieldfield.io` → Cloudflare configure automatiquement le DNS
- [ ] Ajouter aussi `www.yieldfield.io`
- [ ] Cloudflare Pages indique **Active** quand le domaine est vérifié ✅
- [ ] Le certificat SSL est provisionné automatiquement par Cloudflare (pas besoin de Let's Encrypt)

---

## 7. Tests de validation

### Test curl (depuis ton terminal)
```bash
# Test résolution DNS
curl -I https://yieldfield.io
# Attendu : HTTP/2 200, header "server: cloudflare"

# Test www redirect
curl -I https://www.yieldfield.io
# Attendu : 301 → https://yieldfield.io ou 200

# Test staging
curl -I https://staging.yieldfield.io
# Attendu : HTTP/2 200
```

### Test ping
```bash
ping yieldfield.io
# Attendu : réponse de l'IP Cloudflare (ex: 104.x.x.x)
```

### Test depuis 3 régions (outils en ligne)
- [ ] [dnschecker.org](https://dnschecker.org) → `yieldfield.io` → type A → vérifier que toutes les régions répondent
- [ ] [whatsmydns.net](https://whatsmydns.net) → même vérification
- [ ] [check-host.net](https://check-host.net) → HTTP check depuis US / EU / Asia

### Test SSL
- [ ] [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) → noter le grade (objectif : A ou A+)

---

## 8. Template credentials à sauvegarder

> **IMPORTANT — Ne jamais mettre les vraies valeurs dans ce fichier. Utiliser un gestionnaire de mots de passe (Bitwarden, 1Password).**

```
=== YIELDFIELD.IO — ACCÈS DOMAINE & DNS ===
Date de configuration : [DATE]

--- NAMECHEAP ---
URL          : https://namecheap.com
Login        : [TON_EMAIL]
Password     : [dans ton gestionnaire de mots de passe]
2FA activé   : [OUI/NON]
Domaine      : yieldfield.io
Expiration   : [DATE_EXPIRATION]
Auto-renew   : [OUI/NON]

--- CLOUDFLARE ---
URL          : https://dash.cloudflare.com
Login        : [TON_EMAIL]
Password     : [dans ton gestionnaire de mots de passe]
2FA activé   : [OUI/NON]
Zone ID      : [CF_ZONE_ID — visible dans Overview > right panel]
Account ID   : [CF_ACCOUNT_ID — visible dans Overview > right panel]
Nameservers  : [NS1.cloudflare.com]
               [NS2.cloudflare.com]

--- CLOUDFLARE PAGES ---
URL          : https://dash.cloudflare.com → Pages → yieldview
Project      : yieldview
Pages URL    : https://yieldfield.pages.dev

--- DATES IMPORTANTES ---
Domaine acheté le    : [DATE]
DNS actif le         : [DATE]
SSL provisionné le   : [DATE]
Prochain renouvellement : [DATE]
```

---

## Checklist finale récap

- [ ] Domaine `yieldfield.io` acheté (Namecheap)
- [ ] WhoisGuard activé
- [ ] Compte Cloudflare créé, zone `yieldfield.io` active
- [ ] Nameservers Namecheap mis à jour vers Cloudflare
- [ ] Enregistrements DNS créés (www, @, staging)
- [ ] SSL Cloudflare en mode Full (strict) + Always HTTPS
- [ ] Custom domain configuré dans Cloudflare Pages (yieldfield.io + www)
- [ ] Tests curl / ping / 3 régions / SSL passants
- [ ] Credentials sauvegardés dans gestionnaire de mots de passe
- [ ] Fermer Issue GitHub #2

---

*Sprint 7 — Story 7.1 | YieldField | BMAD v6.3.0*
