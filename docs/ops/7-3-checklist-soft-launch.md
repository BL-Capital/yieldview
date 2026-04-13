# 7.3 — Checklist Soft Launch & Campagne de Briefings

> **Bryan** — Ce guide couvre : création du staging, robots.txt de protection, et les templates LinkedIn J-10/J-5/J-1 prêts à copier-coller.

---

## 1. Création du sous-domaine staging dans Cloudflare

### Prérequis
- Zone `yieldfield.io` active dans Cloudflare (voir 7-1-checklist-domaine.md)
- Projet Cloudflare Pages déployé avec `.pages.dev` URL active

### Commandes / étapes

```bash
# Vérifier que l'enregistrement staging existe déjà (si créé en step 7.1)
# Sinon, dans Cloudflare Dashboard :
# DNS > Add Record
# Type : CNAME
# Name : staging
# Target : yieldfield.pages.dev
# Proxy : Proxied (orange)
# TTL : Auto
```

### Dans Cloudflare Pages
- [ ] **Pages** → ton projet `yieldview` → **Custom domains**
- [ ] **Set up a custom domain** → `staging.yieldfield.io`
- [ ] Cloudflare configure automatiquement le DNS et le certificat SSL
- [ ] Optionnel : associer la branche `dev` dans **Settings** → **Builds & Deployments** → **Branch deployments**

### Test de validation
```bash
curl -I https://staging.yieldfield.io
# Attendu : HTTP/2 200
# Header "server: cloudflare" doit être présent

# Vérifier que staging n'est PAS indexé
curl https://staging.yieldfield.io/robots.txt
# Attendu : Disallow: /
```

---

## 2. Configuration robots.txt

### robots.txt pour staging (bloquer l'indexation)

Fichier à créer dans le projet Next.js pour l'environnement staging :
`public/robots.txt` (ou via `app/robots.ts` si déjà configuré)

**Contenu robots.txt — STAGING** (activer avant le soft launch) :
```
User-agent: *
Disallow: /

# YieldField staging — no indexing
```

**Contenu robots.txt — PRODUCTION** (activer au hard launch) :
```
User-agent: *
Allow: /

Sitemap: https://yieldfield.io/sitemap.xml

# YieldField — finance × IA
```

### Implémentation conditionnelle (app/robots.ts)

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'
  
  if (isStaging) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }
  
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yieldfield.io/sitemap.xml',
  }
}
```

> **Variable d'env à ajouter dans Cloudflare Pages :** `NEXT_PUBLIC_IS_STAGING=true` pour le domaine staging.

---

## 3. Templates LinkedIn — Compte à rebours J-10 / J-5 / J-1

### Post LinkedIn J-10 — "Annonce teaser"

```
Il se passe quelque chose dans la finance.

Dans 10 jours, je lance quelque chose que je construis depuis plusieurs mois.

YieldField — une nouvelle façon de lire les marchés financiers.

Pas de bruit. Pas de newsletter généraliste.
Juste l'essentiel, synthétisé par l'IA, chaque matin.

Pour les investisseurs particuliers qui veulent comprendre avant d'agir.

→ Notification activée ? Vous serez les premiers à avoir le lien.

#Finance #IntelligenceArtificielle #Investing #YieldField
```

---

### Post LinkedIn J-5 — "Behind the scenes"

```
5 jours avant le lancement de YieldField.

Voilà ce que j'ai appris en construisant un outil d'analyse financière IA :

1. Les données publiques sont sous-exploitées
   Les marchés génèrent des milliers de signaux par jour.
   Presque personne ne les synthétise correctement.

2. La vraie valeur n'est pas dans la donnée brute
   Elle est dans la contextualisation et la clarté.
   Un briefing de 200 mots peut valoir plus qu'un rapport de 50 pages.

3. La confiance se construit avant le premier clic
   Transparence sur la méthode, disclaimers clairs, sources citées.
   C'est le socle.

YieldField, c'est ces 3 principes appliqués.

Lancement dans 5 jours.
Le lien sera dans les commentaires.

#FinTech #Finance #IA #Marchés #YieldField
```

---

### Post LinkedIn J-1 — "Demain c'est le jour"

```
Demain matin, YieldField est en ligne.

Je vous dois une explication sur pourquoi j'ai construit ça.

Depuis 3 ans, je cherchais un outil qui :
✓ Résume les marchés en moins de 5 minutes
✓ Cite ses sources (pas de boîte noire)
✓ Parle le même langage que moi, pas celui des traders institutionnels
✓ Ne me vend rien

Je ne l'ai pas trouvé. Alors je l'ai construit.

YieldField — Finance × IA

Demain 9h, le lien est ici.
Si vous voulez être notifié, inscrivez-vous en commentaire.

À demain.

— Bryan

P.S. Ce n'est pas un conseil en investissement. C'est un outil d'information.
Les décisions restent les vôtres.

#Finance #IA #Lancement #YieldField #Investissement
```

---

## 4. Grille de suivi des 10 briefings consécutifs

> Objectif : publier 10 briefings IA consécutifs pendant la période de soft launch pour démontrer la valeur et la régularité du service.

| # | Date | Titre du briefing | Thème principal | Publié | Retours reçus | Note qualité /5 |
|---|---|---|---|---|---|---|
| 1 | J-10 | | | [ ] | | |
| 2 | J-9 | | | [ ] | | |
| 3 | J-8 | | | [ ] | | |
| 4 | J-7 | | | [ ] | | |
| 5 | J-6 | | | [ ] | | |
| 6 | J-5 | | | [ ] | | |
| 7 | J-4 | | | [ ] | | |
| 8 | J-3 | | | [ ] | | |
| 9 | J-2 | | | [ ] | | |
| 10 | J-1 | | | [ ] | | |

### Critères de qualité (colonne "Note qualité /5")

| Score | Critère |
|---|---|
| 5 | Briefing complet, sources citées, synthèse claire, ≤ 300 mots, pas d'erreur factuelle |
| 4 | Bon mais manque une source ou légèrement long |
| 3 | Correct, sujet peu différenciant ou formulation générique |
| 2 | Trop court, ou manque de contexte |
| 1 | Erreur factuelle ou formulation problématique |

### Objectif de qualité
- Moyenne > 4/5 sur les 10 briefings avant hard launch
- Zéro briefing à 1/5 (blocking)

---

*Sprint 7 — Story 7.3 | YieldField | BMAD v6.3.0*
