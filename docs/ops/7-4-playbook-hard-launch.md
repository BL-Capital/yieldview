# 7.4 — Playbook Hard Launch — Jour J

> **Bryan** — Ce playbook est ton script minute par minute pour le jour du lancement de `yieldfield.io`. Prépare tout la veille. Exécute en ordre strict.

---

## Timing Jour J — Vue d'ensemble

| Heure | Action | Plateforme | Statut |
|---|---|---|---|
| 08h30 | Vérification finale staging → production | Cloudflare Pages | [ ] |
| 08h45 | Dernier briefing IA publié sur le site | YieldField | [ ] |
| 09h00 | Post LinkedIn long-form | LinkedIn | [ ] |
| 09h15 | Thread X / Twitter | X | [ ] |
| 09h30 | Répondre aux premiers commentaires LinkedIn | LinkedIn | [ ] |
| 10h00 | Post Reddit (r/FinancialCareers + r/FrenchInvest) | Reddit | [ ] |
| 10h30 | Monitoring inscriptions newsletter | Cloudflare Analytics | [ ] |
| 15h00 | Post Show HN (= 9h ET — audience US matinale) | Hacker News | [ ] |
| 15h30 | Répondre aux commentaires HN (fenêtre critique) | HN | [ ] |
| 18h00 | Bilan J+0 — métriques, captures, note | — | [ ] |
| 20h00 | Post LinkedIn "bilan jour 1" (optionnel si bon traffic) | LinkedIn | [ ] |
| **J+3** | **Post Product Hunt** (après retombée du buzz LinkedIn) | Product Hunt | [ ] |

---

## Veille du Jour J — Checklist

- [ ] `yieldfield.io` en prod (DNS validé, SSL actif)
- [ ] robots.txt production actif (Allow: /)
- [ ] Analytics configuré (Vercel Analytics ou Plausible)
- [ ] Newsletter fonctionnelle (email test reçu)
- [ ] 10 briefings publiés sur staging (voir 7-3)
- [ ] Tous les templates de posts prêts (ci-dessous) et copiés dans un doc Notes
- [ ] Compte Product Hunt créé et profil rempli (maker profile)
- [ ] Compte Reddit actif (> 30 jours, quelques commentaires) — sinon risque shadowban
- [ ] Compte X vérifié ou au moins actif

---

## Template — Post LinkedIn Long-Form (Storytelling YieldField)

```
J'ai lancé YieldField aujourd'hui.

Voilà l'histoire derrière le projet — et pourquoi ça m'a pris autant de temps.

──────────────────

Il y a 3 ans, j'ai commencé à investir sérieusement.

Premier réflexe : chercher de l'information.
Résultat : submergé.

Newsletters payantes à 200€/an qui recyclent les mêmes analyses.
Médias financiers qui confondent vitesse et profondeur.
Réseaux sociaux où tout le monde a un avis, personne une méthode.

J'ai passé plus de temps à filtrer qu'à comprendre.

──────────────────

La question que je me suis posée :

Et si l'IA pouvait faire ce travail de synthèse à ma place ?
Pas un chatbot. Pas un robot trader.
Juste un outil qui lit les marchés et me dit l'essentiel.

C'est YieldField.

──────────────────

Ce que YieldField fait :

→ Agrège les données de marché publiques chaque matin
→ Les synthétise en briefings de 200–300 mots
→ Cite les sources (transparence totale)
→ Signale les régimes de volatilité (VIX élevé = alerte visible)
→ Parle français, pour des investisseurs particuliers français

Ce que YieldField ne fait PAS :
→ Pas de conseil en investissement (disclaimer AMF intégré)
→ Pas d'algorithme opaque
→ Pas d'abonnement payant pour l'instant

──────────────────

Le lien : yieldfield.io

Newsletter gratuite → un briefing par jour ouvré dans ta boîte mail.

Si c'est utile pour toi, partage à quelqu'un qui investit.
Si tu as des retours, je les lis tous.

— Bryan

P.S. Ce n'est pas un conseil en investissement.
Les décisions restent les vôtres. Les données sont publiques.

#YieldField #Finance #IA #Investing #Lancement #Fintech
```

---

## Template — Thread X (6 tweets)

```
TWEET 1 (accroche) :
J'ai lancé YieldField aujourd'hui.

Un outil d'analyse financière IA pour les investisseurs particuliers français.

Voilà ce que c'est — et ce que ce n'est pas. 🧵

---

TWEET 2 (problème) :
Le problème que je résous :

Les marchés génèrent trop d'information.
Les investisseurs particuliers n'ont pas d'outil adapté pour filtrer.

Les pros ont Bloomberg à 2000$/mois.
Les particuliers ont... Twitter et des newsletters recyclées.

---

TWEET 3 (solution) :
YieldField, c'est :

→ Briefings IA synthétiques chaque matin
→ Sources citées (pas de boîte noire)
→ Alerte VIX intégrée (quand la volatilité monte, tu le sais)
→ Gratuit, en français, pour toi

---

TWEET 4 (ce que c'est pas) :
Ce que YieldField n'est PAS :

✗ Un conseil en investissement
✗ Un signal de trading automatisé
✗ Une newsletter qui te vend quelque chose
✗ Un outil réservé aux experts

Disclaimer AMF intégré. Transparence totale.

---

TWEET 5 (CTA) :
→ yieldfield.io

Newsletter gratuite = un briefing/jour ouvré dans ta boîte.

Si tu connais quelqu'un qui suit les marchés, envoie-lui ce thread.

---

TWEET 6 (clôture) :
Je réponds à toutes les questions ce soir.

Retours bienvenus — même (surtout) les critiques.

C'est comme ça qu'on améliore un outil.

#YieldField #Finance #IA #Fintech
```

---

## Template — Show HN

### Titre
```
Show HN: YieldField – AI-powered financial briefings for retail investors (French market)
```

### Premier commentaire (à poster dans les 2 minutes suivant le post)
```
Hi HN,

I built YieldField (yieldfield.io), a daily AI financial briefing tool targeting
French retail investors.

The problem: retail investors in France are underserved by financial media.
Institutional-grade tools are either too expensive (Bloomberg ~$2k/mo) or too noisy
(generic financial news).

What YieldField does:
- Aggregates public market data daily
- Synthesizes it into 200–300 word briefings using LLM pipelines
- Cites all sources (no black box)
- Displays volatility regime alerts (VIX-based)
- Full AMF disclaimer compliance (French financial regulator)

Tech stack: Next.js 15, React 19, TypeScript, deployed on Vercel + Cloudflare.

What I'm NOT doing: personalized investment advice, trading signals, or paid subscriptions (for now).

Would love feedback on:
1. Is the briefing format useful for non-French investors too?
2. What data sources would you want to see added?
3. Any red flags in the disclaimer approach?

Free newsletter: one briefing per trading day. No spam.

Thanks for looking.
```

---

## Templates — Reddit

### r/FinancialCareers

```
Title: I built a free AI financial briefing tool for retail investors – would love feedback

I'm launching YieldField (yieldfield.io) today – a daily briefing tool that
synthesizes public market data using AI, targeting retail investors.

Background: I've been investing for a few years and couldn't find a tool that
was transparent about its sources, didn't try to sell me something, and was
actually readable by a non-institutional audience.

So I built one.

What it does:
- Daily market briefings (~250 words) from public data sources
- VIX-based volatility alerts
- All sources cited
- Free newsletter

What it doesn't do:
- No personalized investment advice
- No trading signals
- No black box AI

Looking for genuine feedback, especially from people who work in finance and
know what good market analysis actually looks like. Happy to hear hard truths.

Link: yieldfield.io

(Disclaimer: not financial advice, obviously.)
```

---

### r/FrenchInvest (ou r/france selon disponibilité)

```
Title: J'ai lancé YieldField – briefings financiers IA quotidiens pour investisseurs particuliers français

Bonjour r/FrenchInvest,

Je lance aujourd'hui yieldfield.io — un outil de synthèse de données financières
publiques par IA, en français, pour les investisseurs particuliers.

Contexte : j'investis depuis quelques années et je n'ai jamais trouvé d'outil qui
soit à la fois transparent sur ses sources, gratuit, et lisible par quelqu'un qui
n'a pas Bloomberg dans sa boîte mail pro.

Ce que ça fait :
- Briefings quotidiens (~250 mots) sur les marchés
- Alerte régime de volatilité (VIX)
- Sources citées
- Newsletter gratuite

Ce que ça ne fait pas :
- Pas de conseil en investissement (disclaimer AMF intégré)
- Pas de signaux de trading
- Pas d'abonnement payant pour l'instant

Retours bienvenus, surtout les critiques constructives.

Lien : yieldfield.io
```

---

## Fiche Product Hunt

### Titre
```
YieldField
```

### Tagline (≤ 60 caractères)
```
AI-powered daily market briefings for retail investors
```

### Description (≤ 260 caractères)
```
YieldField synthesizes public market data into clear, sourced daily briefings.
Built for retail investors who want signal without noise.
Free newsletter, VIX alerts, full source transparency. No black box, no advice.
```

### Galerie (assets à préparer)
- [ ] Screenshot homepage (1270×760)
- [ ] Screenshot briefing exemple (1270×760)
- [ ] Screenshot mobile (430×932)
- [ ] Logo 240×240

### Premier commentaire Product Hunt (poster dès approbation)
```
Hi Product Hunt 👋

I'm Bryan, the maker of YieldField.

Quick story: I've been a retail investor for a few years. Every morning I'd spend
30+ minutes piecing together market context from a dozen sources. It was exhausting.

So I built YieldField: an AI that does this synthesis for me (and now for you).

What makes it different:
→ Every claim is sourced — no black box
→ Volatility regime detection (VIX-based alerts)
→ Designed for retail investors, not quants
→ Free. No paywall.

I'd love to hear from other retail investors: what's missing from your morning
market routine? What would make a tool like this indispensable for you?

Thanks for the support — every upvote helps reach more people who might find this useful.

— Bryan
```

### Liens à renseigner dans PH
- Website : `https://yieldfield.io`
- Twitter/X : `@[handle]`
- Makers : `@[ton_handle_PH]`

---

## Métriques cibles Jour J

| Métrique | Objectif J+1 | Objectif J+7 |
|---|---|---|
| Visiteurs uniques | > 200 | > 500 |
| Inscriptions newsletter | > 30 | > 100 |
| LinkedIn impressions | > 1 000 | > 2 500 |
| X impressions | > 500 | > 1 500 |
| HN points | > 10 | — |
| PH upvotes | > 50 | — |

---

*Sprint 7 — Story 7.4 | YieldField | BMAD v6.3.0*
