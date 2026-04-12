---
title: "Product Requirements Document: YieldField"
status: "final-draft"
workflowType: "prd"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by John, Product Manager, BMAD v6.3.0)"
methodology: "BMAD v6.3.0 — Phase 2 Planning — bmad-create-prd workflow"
inputDocuments:
  - "docs/planning-artifacts/product-brief-yieldfield.md"
  - "docs/PRD_BMAD_Site_Finance_Bryan_v1.0.docx (historique)"
  - "docs/PRD_BMAD_Site_Finance_Bryan_v1.1.docx (historique, recommandations Bryan)"
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-02b-vision"
  - "step-02c-executive-summary"
  - "step-03-success"
  - "step-04-journeys"
  - "step-05-domain"
  - "step-06-innovation"
  - "step-07-project-type"
  - "step-08-scoping"
  - "step-09-functional"
  - "step-10-nonfunctional"
  - "step-11-polish"
  - "step-12-complete"
---

# Product Requirements Document — YieldField

**Auteur :** Emmanuel — WEDOOALL Solutions
**Date :** 2026-04-11
**Version :** 2.0 (refaite en BMAD v6.3.0 après upgrade méthodologique)
**Méthodologie :** BMAD Method v6.3.0 — Phase 2 Planning
**Workflow :** `bmad-create-prd` — 11 steps synthétisés en passe cohérente
**Input principal :** `docs/planning-artifacts/product-brief-yieldfield.md`

---

## 1. Vision du produit

**YieldField est un magazine éditorial quotidien de marchés financiers propulsé par IA, conçu comme preuve de concept vivante pour le recrutement de son commanditaire junior.**

La vision tient en trois énoncés :

1. **Pour le lecteur** — "Un objet éditorial quotidien qui rend les marchés financiers beaux, lisibles et intelligibles en 2 minutes."
2. **Pour les recruteurs** — "La preuve vivante qu'un candidat junior maîtrise simultanément finance, IA et design premium, entretenue jour après jour pendant au moins 60 jours."
3. **Pour Emmanuel et WEDOOALL Solutions** — "Une vitrine publique de la méthodologie BMAD v6.3.0 appliquée avec Claude Code dans un contexte réel, contrainte budgétaire radicale (≤ 8 €/mois)."

La vision se distingue des projets portfolio juniors classiques par un **positionnement éditorial d'abord, technique ensuite** : YieldField est présenté comme "un magazine qui se trouve à utiliser l'IA" plutôt que comme "un pipeline IA qui se trouve à produire du contenu financier". Cette inversion sémantique est intentionnelle et répond à la saturation du marché du travail finance 2026 par des projets "j'ai branché Claude sur des données".

## 2. Executive Summary

YieldField est un site vitrine bilingue FR/EN qui publie chaque matin ouvré avant 8h30 CET un briefing macro signé par la persona **Le Chartiste Lettré** (voix narrative IA cultivée et ironique, ancrée dans 3-5 chiffres précis par paragraphe). Le site affiche 6-8 KPIs de marché animés, une page "Coulisses" transparente qui expose méthodologie, prompts versionnés et logs pipeline, et un avatar Rive interactif en hero qui réagit au niveau de risque du jour.

**Audience primaire :** recruteurs de hedge funds / banques / fintechs (Thomas) et développeurs fintech (Sophie) — les deux personas à fort pouvoir de conversion (recrutement et amplification virale). Audience secondaire : analystes sell-side juniors (Marc, statut hypothèse à valider) et étudiants école de commerce (Clément).

**Proposition technique :** Next.js 15 + React 19 + Motion 12 + Aceternity UI Pro + Magic UI + Rive + Lottie + Cloudflare Pages/R2/Workers + Claude API (Opus pour FR, Haiku pour traduction EN). Infrastructure intégralement sur free tiers, coût total < 8 €/mois hors domaine.

**Objectifs business à 3 mois :**
- **G1a** : 3 entretiens qualifiés obtenus (hedge fund, banque, fintech)
- **G1b** : Reconnaissance communautaire (≥ 100 étoiles GitHub, ≥ 5 partages LinkedIn organiques, ≥ 1 mention newsletter/thread tech)
- **Engagement qualitatif** : Temps > 2 min sur la page Coulisses, rétention hebdo > 15 %

**Timeline :** MVP livré en 6 semaines + 2 semaines de stabilisation = 8 semaines totales avant lancement public.

---

## 3. Critères de succès (Success Criteria)

### 3.1 Métriques d'exécution (Definition of Done technique)

| Critère | Mesure | Seuil | Source |
|---|---|---|---|
| Pipeline nocturne | Taux de succès GitHub Actions sur 7 jours glissants | ≥ 95 % | Workflow dashboard |
| Fraîcheur éditoriale | Briefing publié avant 8h30 CET | 100 % des jours ouvrés semaine 1 | Timestamp `latest.json` |
| Performance | Lighthouse (4 catégories) | Toutes ≥ 90 | CI/CD build |
| Bilinguisme | Pages disponibles en FR et EN | 100 % | Audit routes |
| Coût infrastructure | Total mensuel (hors domaine) | ≤ 8 € | Dashboards Cloudflare + Anthropic |
| Transparence Coulisses | Étapes + prompts + logs | ≥ 5 étapes, ≥ 3 versions prompts, 7 runs logués | Audit page |
| Sécurité | Clés API dans le code | 0 fuite | Pre-commit hook + GitHub secret scanning |
| Uptime | Disponibilité sur 30 jours glissants | ≥ 99 % | UptimeRobot |
| Newsletter | Envois quotidiens réussis | ≥ 95 % | Buttondown dashboard |

### 3.2 Signaux business (objectifs business réels)

**Niveau 1 — G1a Recrutement**
- ≥ 3 entretiens qualifiés dans les 3 mois suivant le lancement public
- Taux de clic des recruteurs sur le lien YieldField (depuis CV / LinkedIn) > 40 %
- ≥ 1 recruteur qui mentionne spontanément "Coulisses" en entretien

**Niveau 2 — G1b Reconnaissance communautaire**
- ≥ 100 étoiles GitHub (30 jours post-lancement) — ajusté par le Skeptic review
- ≥ 5 partages LinkedIn organiques externes au cercle direct
- ≥ 1 mention newsletter ou thread tech/finance (HN Show, Indie Hackers, dev.to)
- ≥ 50 abonnés newsletter (30 premiers jours)

**Niveau 3 — Engagement qualitatif**
- Temps moyen sur la page Coulisses > 2 minutes
- Taux de retour hebdomadaire > 15 % après 14 jours
- Taux d'ouverture newsletter > 40 % (benchmark niche pro)

### 3.3 Validation de l'hypothèse Marc

L'hypothèse du pain point "briefing macro européen quotidien pour analyste" n'est pas validée. Elle sera testée via **5 entretiens utilisateurs (20 min chacun)** + **1 sondage Twitter/X** en semaine 1-2. Seuil : si ≥ 3/5 analystes confirment une frustration compatible, l'hypothèse est validée. Sinon, Marc est déclassé en persona secondaire et le brief est mis à jour.

---

## 4. User Journeys (parcours utilisateurs)

### 4.1 Parcours primaire — Thomas (recruteur hedge fund)

**Déclencheur :** Bryan lui envoie une candidature avec lien YieldField en header. Il a 5 minutes entre deux réunions.

**Étapes :**
1. **T+0s** — Clique le lien, arrive sur `https://yieldfield.io/fr` (ou `/en` selon préférence)
2. **T+2s** — LCP terminé, voit le hero : Aurora background, avatar Rive animé, tagline gradient, briefing du jour en Text Generate Effect
3. **T+10s** — Scan visuel : "C'est différent des autres portfolios. Il y a un vrai design."
4. **T+20s** — Lit le briefing (4-5 phrases, tone Chartiste Lettré). Reconnaît que la qualité éditoriale dépasse un "j'ai branché Claude"
5. **T+45s** — CTA hero "Voir les Coulisses" visible → clic. Arrive sur la page Coulisses
6. **T+60s** — Tracing Beam vertical commence à tracer. Étapes : "Idée originelle", "Méthode BMAD", "Pipeline nocturne", "Prompts v01→v06", "Déploiement Cloudflare"
7. **T+90s** — Clique sur l'étape "Prompts v01→v06" — voit un Code Block Aceternity avec les diffs versionnés
8. **T+2min** — Scroll la Pipeline Logs Table : voit 7 runs réussis dans les 7 derniers jours
9. **T+3min** — Descend jusqu'au lien GitHub repo → clique → voit le README propre et la structure de projet
10. **T+5min** — Décision : "Ce candidat est différent. J'appelle."

**Point critique :** L'ensemble de la persuasion passe par la **page Coulisses**, pas par la homepage. La homepage est le hook visuel (10 secondes pour ne pas rebondir), la Coulisses est la preuve (3-5 minutes pour convaincre). Le CTA depuis le hero doit être visible sans effort, pas enterré dans le menu.

**Success metric :** Thomas appelle ou envoie un message dans les 24h.

### 4.2 Parcours secondaire — Sophie (développeuse fintech)

**Déclencheur :** Voit un post LinkedIn de Bryan ("building in public") ou un thread Twitter tagué @cloudflare @aceternitylabs. Partage sur Slack à un collègue, clique.

**Étapes :**
1. Switche directement vers `/en` (elle travaille en anglais avec son équipe)
2. Note l'avatar Rive — reconnaît la techno et apprécie la signature
3. Lit le briefing en diagonale ("propre, pas d'emoji générique, bon tone")
4. Clique directement sur "Coulisses" (2 minutes sur le hero max)
5. **Passe 15-20 minutes sur la page Coulisses** :
   - Lit les diffs de prompts v01→v06 en détail
   - Examine l'architecture Cloudflare schématisée
   - Regarde les logs de pipeline
   - Clique sur le lien GitHub repo, star le repo
6. Revient sur le site, scroll le footer, voit le lien newsletter → s'abonne
7. Partage sur Twitter/X avec un quote tweet ("Ceci est exactement comment il faut builder un pipeline IA éditorial en 2026")

**Success metric :** Star GitHub + abonnement newsletter + partage social.

### 4.3 Parcours hypothétique (à valider) — Marc (analyste sell-side)

**⚠️ Ce parcours suppose que l'hypothèse Marc est validée en semaine 1-2.**

**Déclencheur :** A découvert YieldField via un swap de newsletter finance FR (Snowball, Investir Tranquille) en semaine 3 post-lancement. Il ajoute à ses bookmarks quotidiens.

**Étapes (routine matinale, 2-3 minutes maximum) :**
1. 08h23 : ouvre le bookmark → `/fr/` directement
2. Scan les 6-8 KPIs animés (NumberTicker) en 15 secondes
3. Regarde le spread OAT-Bund du jour (sa métrique de référence)
4. Lit le briefing du Chartiste Lettré (4-5 phrases) en 30 secondes
5. Note mentalement le thème du jour et l'événement clé attendu
6. Ferme l'onglet, file à sa réunion 8h30

**Success metric :** Retour quotidien (> 15 % de rétention hebdomadaire), temps moyen ~2 min.

### 4.4 Parcours vectoriel — Clément (étudiant école de commerce)

**Déclencheur :** Voit un Reels Instagram / TikTok micro-format "le chiffre du jour" (Bryan publie 1-2 fois par semaine).

**Étapes :**
1. Clique le swipe-up → arrive sur `/fr/`
2. Trouve le design beau (Instrument Serif + Aurora + or)
3. Lit le briefing (s'amuse du ton ironique du Chartiste Lettré)
4. Screenshot la tagline gradient → partage sur WhatsApp à ses amis
5. Retourne sur Instagram

**Success metric :** Screenshot partagé = amplification vectorielle.

---

## 5. Domaine & contraintes sectorielles

### 5.1 Domaine fonctionnel

YieldField opère dans l'intersection de **3 domaines** :

1. **Finance de marché (contenus)** — taux souverains (OAT, Bund, US 10Y), spreads, indices boursiers mondiaux (CAC 40, S&P 500, Nikkei), volatilité (VIX, VSTOXX), commodités (WTI, Or), devises (DXY)
2. **Publication éditoriale (médias)** — rythme quotidien, ton éditorial, bilinguisme, transparence des sources
3. **Production IA automatisée (tech)** — pipeline Claude API, prompts versionnés, traduction optimisée coût, validation human-in-the-loop

### 5.2 Contraintes réglementaires

**Cadre légal AMF :** YieldField ne délivre **aucun conseil en investissement** et n'est pas une analyse financière au sens réglementaire. Cette contrainte impose :

- **Formulations descriptives, pas prescriptives** : jamais "achetez/vendez", jamais "nous recommandons", jamais "il faut"
- **Disclaimer renforcé** visible en en-tête de chaque briefing (pas seulement footer) + sur les OG images partagées
- **Proscription de prompt** : liste explicite de formulations interdites dans le prompt système Claude
- **Ton observationnel** : le Chartiste Lettré décrit ce qui est, pas ce qu'il faut faire
- **Revue légale ponctuelle** (≤ 500 €) avant le go-live public pour valider formulations et cas-limites (mode crisis, niveaux de risque)

**Cadre RGPD :** Site bilingue FR/EN accessible en Europe, collecte d'emails (newsletter) et d'analytics. Impose :

- **Analytics privacy-first** : Cloudflare Web Analytics (gratuit, sans cookie, sans consent banner)
- **Newsletter double opt-in** : confirmation email avant inscription définitive
- **Mentions légales** : page dédiée avec éditeur, hébergeur, contact DPO
- **Droit à l'oubli** : désinscription newsletter en 1 clic

### 5.3 Contraintes économiques

**Budget mère** : ≤ 8 €/mois hors domaine .io. Impose toutes les décisions techniques :

- Infrastructure 100 % serverless (Cloudflare Pages + R2 + Workers, all free tiers)
- Pas de base de données SQL managée (stockage JSON sur R2)
- Pas de service monitoring payant (UptimeRobot free tier + Cloudflare Analytics)
- Newsletter free tier (Buttondown < 100 abonnés)
- Génération IA économisée : Claude Opus pour FR + Haiku pour traduction EN (facteur 10× sur coût EN)

### 5.4 Contraintes de sources

**APIs financières gratuites uniquement.** Jamais Bloomberg, Refinitiv, FactSet.

- **Finnhub** (primary) — 60 req/min free tier, suffisant pour 1 build/jour
- **FRED** (Federal Reserve Economic Data) — gratuit sans quota raisonnable, macro EU/US
- **Alpha Vantage** (marginal) — dégradé à 25 req/jour en 2026, usage limité à des données spécifiques de complément
- **Fallback automatique** : dernière valeur valide + timestamp "donnée > 12h" si une API échoue

---

## 6. Innovation & différenciation

### 6.1 Ce qui est innovant dans YieldField

**1. La persona narrative IA ultra-spécifique — "Le Chartiste Lettré"**

Contrairement à 99 % des projets IA qui adoptent un ton "neutre informatif", YieldField construit une voix narrative reproductible via :
- **Role prompting persistant** ("You are a financial chartist with literary sensibility, 15 years of rate desk experience...")
- **Few-shot avec exemples canoniques** (2-3 paragraphes de Matt Levine + 1 research piece Goldman/JPM)
- **Liste de proscription explicite** ("Never use: 'in conclusion', 'it's worth noting', 'navigating', 'leverage', 'unlock', em-dashes en série")
- **Anchoring numérique forcé** (citer ≥ 3 chiffres précis par paragraphe)
- **Variabilité contrôlée** (varier structure d'ouverture jour après jour)

Cette combinaison est rare et défendable : un clone en un weekend perdra la finesse sans les exemples canoniques et la liste de proscription.

**2. Transparence radicale via la page Coulisses**

La page Coulisses n'est pas un satellite technique — c'est la **seconde homepage**, accessible directement depuis un CTA visible du hero. Elle expose :
- Méthodologie BMAD appliquée
- Diffs des prompts système v01→v06+
- Logs des 7 derniers runs de pipeline (timestamps, latence, statut)
- Architecture Cloudflare expliquée en schémas
- Preview interactive de l'avatar Rive avec ses états

Dans un marché 2026 fatigué des "boîtes noires IA", cette transparence devient un signal de sérieux technique. Elle est le levier de conversion principal pour Thomas et Sophie.

**3. Avatar Rive réactif au niveau de risque**

L'avatar en hero n'est pas une illustration statique. C'est un personnage Rive interactif piloté par une state machine qui réagit au **niveau de risque du jour** (low/medium/high/crisis) — détendu, concentré, tendu, en alerte. Cette innovation rend la donnée brute **humaine et mémorable**, et démontre la maîtrise d'un outil de design avancé rarement vu dans les projets portfolio juniors.

**4. Alert VIX percentile glissant (pas de seuil fixe)**

Le mode "marché sous tension" ne se déclenche pas sur un seuil fixe (VIX > 30) — il se déclenche sur le **90ᵉ percentile du VIX sur 252 jours glissants** (≈ 1 an de trading). Cette approche statistique s'adapte aux régimes de marché (en 2020 le VIX a dépassé 80 ; en 2017 il était stable à 10). Un seuil fixe aurait saturé en 2020 et jamais déclenché en 2017.

**5. Pipeline bilingue optimisé Opus → Haiku**

Le briefing est généré en français par Claude Opus (finesse éditoriale) puis traduit en anglais par Claude Haiku (10× moins cher). Cette combinaison permet de maintenir la qualité éditoriale française tout en restant dans le budget 8 €/mois malgré le bilinguisme.

### 6.2 Ce qui n'est pas innovant (et c'est assumé)

- **La stack technique** : Next.js 15 + React 19 + Cloudflare est un empilement standard 2026
- **Les librairies UI** : Aceternity Pro + Magic UI + Motion 12 sont utilisées par de nombreux sites premium
- **Le positionnement "daily briefing"** : existait déjà (Morning Brew, Axios, Stratechery) — YieldField se distingue par la verticalisation finance EU + qualité éditoriale + transparence IA

L'innovation n'est pas dans les briques individuelles, elle est dans la **combinaison cohérente** au service d'un positionnement précis.

---

## 7. Type de projet & profil

### 7.1 Classification

- **Type :** Site vitrine dynamique + pipeline IA quotidien
- **Niveau BMAD :** **Level 3** (Complex — 12-40 stories)
- **Nature :** Application web serverless, greenfield
- **Profil équipe :** Solo developer + Product Owner level 2 + IA coding assistant (Claude Code)

**Justification du Level 3 :** Le projet combine pipeline backend + frontend complexe + multi-persona + bilinguisme + intégrations multiples (Finnhub, FRED, Claude API, Rive, Lottie, Motion, Cloudflare services). Le brief v1 positionnait le projet en Level 2 (Medium, 5-15 stories), mais après analyse fine des FRs + NFRs, l'inventaire dépasse clairement 15 stories. Reclassement assumé en Level 3.

### 7.2 Stack technique validée (reprise de l'Architecture v1.2)

**Frontend :**
- Next.js 15 (App Router, Partial Prerendering)
- React 19 (Server Components, Actions, use())
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui + Radix Primitives (base accessible)
- Aceternity UI Pro (composants premium animés)
- Magic UI (composants signature open-source)
- Motion 12 + Motion+ (animation engine)
- Rive (@rive-app/react-canvas) — avatar hero
- Lottie / dotLottie (@dotlottie/react-player) — micro-animations
- Instrument Serif (titres) + Inter (body) + JetBrains Mono (chiffres) — self-hosted
- next-intl (FR/EN routing)

**Backend & Infrastructure :**
- Cloudflare Pages (hosting SSG + SSR edge)
- Cloudflare R2 (stockage JSON — latest.json + archive/)
- Cloudflare Workers (Edge Functions ponctuelles : OG images, revalidate)
- Cloudflare Web Analytics (privacy-first, gratuit, sans cookie)
- GitHub Actions (cron pipeline nocturne)

**AI & Data :**
- Anthropic Claude API (SDK @anthropic-ai/sdk)
  - Claude Opus pour génération FR (finesse éditoriale)
  - Claude Haiku pour traduction EN + fallbacks économiques
- Finnhub API (primary data — indices, VIX, temps réel)
- FRED API (macro EU/US, taux historiques)
- Alpha Vantage (marginal, 25 req/jour)

**Distribution :**
- Buttondown (newsletter gratuit < 100 abonnés)
- @vercel/og (OG images dynamiques)
- RSS feed statique

**Reporté V2 :**
- React Three Fiber + Drei (yield curve 3D, globe marché mondial)
- ElevenLabs (podcast audio quotidien)
- HuggingFace dataset (corpus 180 briefings)

---

## 8. Périmètre & phases (MVP + Growth + Vision)

### 8.1 MVP Strategy & Philosophy

**MVP Approach : Problem-Solving MVP + Experience MVP hybride**

Le MVP ne cherche pas seulement à résoudre un problème (briefing macro quotidien) — il vise à créer une **expérience mémorable** qui distingue YieldField de tout autre projet portfolio junior. L'expérience est la preuve, pas juste la fonctionnalité.

**Questions stratégiques (réponses documentées) :**

- **Minimum pour dire "c'est utile" ?** Un briefing quotidien lisible + 6 KPIs à jour + bilingue. Sans les 3, c'est mort.
- **Minimum pour dire "c'est différent" ?** Le Chartiste Lettré (ton reconnaissable) + la page Coulisses visible dès le hero + l'avatar Rive. Sans ces 3, c'est un portfolio générique.
- **Plus rapide path to validated learning ?** Soft launch privé 2 semaines avec 10 briefings consécutifs → hard launch public → mesurer retours recruteurs en 30 jours.

**Ressources MVP :**
- 1 lead dev (Emmanuel) + Claude Code
- 1 Product Owner niveau 2 (Bryan) — validation éditoriale, orientation produit, GTM owner
- Budget : 8 €/mois infra + 500 € one-shot (revue juridique + newsletter sponsoring + misc)
- Timeline : 6 semaines dev + 2 semaines stabilisation = **8 semaines avant hard launch**

### 8.2 MVP Feature Set (Phase 1 — Semaines 1 à 6 + stabilisation 7 à 8)

**Core User Journeys Supportés (100 %) :**
- Thomas : homepage → Coulisses → conversion
- Sophie : homepage → Coulisses longue durée → partage + newsletter
- Clément : homepage → lecture briefing → partage social
- Marc : homepage quotidienne (si hypothèse validée en S1-2)

**Must-Have Capabilities (MVP) :**

1. **Dashboard éditorial homepage** (Aurora BG + Rive avatar + tagline + briefing + bento KPIs + freshness)
2. **Page Coulisses** visible depuis hero (Tracing Beam + 5+ étapes + prompts diffés + logs pipeline + preview Rive)
3. **Pipeline nocturne complet** (cron GitHub Actions 6h UTC, Finnhub + FRED + Alpha Vantage, Claude Opus FR + Haiku EN, R2 storage, fallback)
4. **Alert VIX percentile** avec 3 niveaux (warning/alert/crisis) + bannière conditionnelle
5. **Human-in-the-loop override** (validation optionnelle 15 min + publication auto)
6. **Bilingue FR/EN** (next-intl, routes /fr et /en, switcher, traduction Claude Haiku)
7. **Newsletter email** (formulaire Cloudflare Workers + Buttondown + envoi automatique post-pipeline)
8. **Open Graph dynamique** (@vercel/og, briefing du jour, bilingue selon locale)
9. **RSS feed** (bonus, 1h dev — power-users Feedly/Inoreader)
10. **Analytics privacy-first** (Cloudflare Web Analytics)
11. **Disclaimer légal renforcé** (en-tête briefing + footer + OG images)
12. **Accessibilité WCAG 2.1 AA** (audits Axe + NVDA + zoom 200 %)
13. **Pages 404 + 500 éditoriales**
14. **Pre-commit hook de détection de secrets**
15. **Domaine .io + HTTPS** (après Issue GitHub #2 résolue)

### 8.3 Post-MVP (Phase 2 Growth, Semaines 9+)

**Fonctionnalités enrichissant le MVP :**
- Yield curve 2D interactive animée (Recharts + Motion)
- Lexique financier FR/EN (50-100 termes)
- Archive navigable des briefings passés (R2 listing + moteur de recherche léger)
- Page "About Bryan" complète avec CTA "Hire me" permanent
- Copy-to-Slack button sur le briefing (transforme Marc en ambassadeur passif)
- Permalinks avec tracking UTM pour mesurer les partages
- `/today.json` API read-only publique (gratuit, enables third-party integrations)

**Fonctionnalités de distribution avancée :**
- Twitter/X thread automation (Bryan publie manuellement, on peut automatiser plus tard)
- Podcast quotidien ElevenLabs 90s (voix Chartiste Lettré)
- Partenariats newsletter finance FR (cross-promo)

### 8.4 Phase 3 — Expansion & Vision (3-12 mois)

**Trajectoire A — Bryan embauché** : maintenance en fond, asset passif permanent

**Trajectoire B — Produit public autonome** : migration vers Substack / Ghost premium, newsletter paid (~10€/mois × 500 abonnés = ~60k€/an), communauté Discord

**Trajectoire C — White-label B2B "Morning Brief as a Service"** : pipeline revendable à CGPs, family offices, fintechs, écoles (200-500€/mois × 10 clients = ~30k€ ARR)

- Yield curve 3D React Three Fiber + Drei
- Multiple templates de persona éditoriale (hébergeant plusieurs voix)
- Dataset corpus 180 briefings bilingues sur HuggingFace (CC-BY)
- Widget Raycast / bot Discord officiel

### 8.5 Risk Mitigation Strategy

| Risque | Catégorie | Mitigation |
|---|---|---|
| Timeline 4 semaines infeasible | Resource | Révisé à 6+2 semaines. Scope de repli explicite si S5 dérape : couper Alert VIX → couper RSS → simplifier metadata chips |
| Qualité IA inconsistante, hallucinations | Technical | Prompt versionné v01→v06, validation manuelle 2 premières semaines, human-in-the-loop 15 min, guardrails dans le prompt (longueur, ton, structure, proscription) |
| Alpha Vantage insuffisant | Technical | Finnhub primary, FRED backup, Alpha Vantage marginal. Pipeline test toutes les 48h |
| Risque légal AMF | Market/Legal | Disclaimer renforcé, formulations descriptives, revue juridique ponctuelle, proscription explicite dans le prompt |
| Pain point Marc non validé | Market | Validation explicite S1-2 via 5 interviews + sondage. Plan B : Marc déclassé en secondaire |
| Distribution invisible post-launch | Market | Plan GTM détaillé (section 8 du Product Brief) — Bryan owner, semaines -2 à +12 |
| Discipline éditoriale non tenue 60j | Resource | Dualité porteurs (Emmanuel continue pour WEDOOALL vitrine même si Bryan signe), production automatisée à 90 % |
| Incompatibilité React 19 avec libs tierces | Technical | Smoke tests au setup initial. Fallback Next.js 14 + React 18 si blocage critique |

---

## 9. Functional Requirements (FRs)

**⚠️ CAPABILITY CONTRACT :** Cette section définit **ce que le produit doit savoir faire**. Les workflows Architecture, UX Design et Sprint Planning ne couvriront QUE ce qui est listé ici. Si une capacité est absente de cette liste, elle n'existera pas dans le produit final.

**Format :** `FR#: [Actor] can [capability]`
**Altitude :** WHAT, not HOW. Implementation-agnostic.

### 9.1 Capability Area 1 — Daily Editorial Content

- **FR1** : Le pipeline peut générer chaque jour ouvré un briefing macro en français via Claude Opus
- **FR2** : Le pipeline peut traduire le briefing français vers l'anglais via Claude Haiku
- **FR3** : Le pipeline peut générer une tagline quotidienne unique bilingue FR/EN
- **FR4** : Le pipeline peut générer des métadonnées de briefing (thème du jour, niveau de certitude, événement clé attendu, niveau de risque)
- **FR5** : Bryan peut réviser et override manuellement un briefing généré avant sa publication publique (fenêtre 15 min)
- **FR6** : Le pipeline peut publier automatiquement si aucune validation humaine n'intervient dans la fenêtre
- **FR7** : Le pipeline peut conserver la version IA originale même en cas d'override manuel (archive immuable)
- **FR8** : Le briefing peut adopter un ton "marché sous tension" conditionnel quand le VIX dépasse son 90ᵉ percentile 252j

### 9.2 Capability Area 2 — Market Data & KPIs

- **FR9** : Le pipeline peut collecter les taux souverains (OAT, Bund, US 10Y) depuis FRED ou Finnhub
- **FR10** : Le pipeline peut collecter les indices boursiers (CAC 40, Euro Stoxx 50, S&P 500, Nikkei) depuis Finnhub
- **FR11** : Le pipeline peut collecter les indicateurs de volatilité (VIX, VSTOXX) depuis Finnhub
- **FR12** : Le pipeline peut collecter les indicateurs macro (Dollar Index DXY, commodités WTI/Or) depuis Finnhub
- **FR13** : Le pipeline peut calculer les spreads dérivés (OAT-Bund, Bund-US) depuis les données taux
- **FR14** : Le pipeline peut calculer le percentile 90 glissant du VIX sur 252 jours ouvrés
- **FR15** : Le visiteur peut voir 6 à 8 KPIs affichés dans une grille bento segmentée par thème (taux, spreads, indices, volatilité, macro)
- **FR16** : Le visiteur peut voir chaque KPI avec sa valeur, sa variation J/J, et sa direction (hausse/baisse/neutre)
- **FR17** : Le visiteur peut voir un indicateur de fraîcheur des données (pastille verte/jaune/rouge + timestamp)
- **FR18** : Le pipeline peut gérer les défaillances d'API via un fallback gracieux (dernière valeur valide + timestamp "donnée > 12h")
- **FR19** : Le pipeline peut gérer les cas de marché fermé (weekend, fériés) en affichant les données du dernier jour ouvré
- **FR20** : Le pipeline peut archiver chaque run quotidien avec ses données brutes et son output (R2 `archive/YYYY-MM-DD.json`)

### 9.3 Capability Area 3 — Editorial Experience (Homepage)

- **FR21** : Le visiteur peut voir un avatar Rive interactif en hero qui réagit au niveau de risque du jour (low/medium/high/crisis)
- **FR22** : Le visiteur peut voir la tagline du jour avec un effet de texte en dégradé animé (gradient or)
- **FR23** : Le visiteur peut voir le briefing macro apparaître progressivement avec un effet "text generate"
- **FR24** : Le visiteur peut voir les métadonnées du briefing affichées en chips (thème, niveau de risque, événement clé)
- **FR25** : Le visiteur peut voir les 6-8 KPIs animés avec un effet Number Ticker au chargement
- **FR26** : Le visiteur peut voir un indicateur "Live" pulsant avec le timestamp de la dernière mise à jour
- **FR27** : Le visiteur peut voir un marquee scroll des KPIs secondaires en bas de page
- **FR28** : Le visiteur peut voir une bannière d'alerte VIX conditionnelle en haut de page (mode warning/alert/crisis)
- **FR29** : Le visiteur peut voir un disclaimer légal renforcé en en-tête de chaque briefing (pas seulement footer)

### 9.4 Capability Area 4 — Coulisses Page (Transparency)

- **FR30** : Le visiteur peut accéder à la page Coulisses directement depuis un CTA visible dans le hero de la homepage
- **FR31** : Le visiteur peut voir une timeline verticale animée (Tracing Beam) qui se trace au scroll
- **FR32** : Le visiteur peut voir au moins 5 étapes de construction documentées avec description, date, et média (screenshot ou diagramme)
- **FR33** : Le visiteur peut voir au moins 3 versions successives du prompt système avec diffs visuels
- **FR34** : Le visiteur peut copier chaque prompt via un bouton "Copy" avec effet visuel de confirmation
- **FR35** : Le visiteur peut voir les logs des 7 derniers runs de pipeline (timestamp, statut, latence, output)
- **FR36** : Le visiteur peut voir une preview interactive de l'avatar Rive avec ses différents états de risque
- **FR37** : Le visiteur peut voir un diagramme d'architecture Cloudflare expliqué

### 9.5 Capability Area 5 — Internationalization & Navigation

- **FR38** : Le visiteur peut basculer entre FR et EN via un switcher visible dans le header
- **FR39** : Le système peut persister le choix de langue du visiteur (localStorage + cookie fallback)
- **FR40** : Le visiteur peut accéder aux pages via des routes `/fr/*` et `/en/*`
- **FR41** : Le visiteur peut voir 100 % du contenu (briefing, tagline, metadata, KPIs labels, UI) traduit dans les deux langues
- **FR42** : Le visiteur peut voir une transition fluide lors du changement de langue (sans flash blanc)
- **FR43** : Le visiteur peut naviguer vers la page Coulisses depuis n'importe quelle page du site

### 9.6 Capability Area 6 — Distribution & Engagement

- **FR44** : Le visiteur peut s'abonner à la newsletter quotidienne via un formulaire email (double opt-in)
- **FR45** : L'abonné newsletter peut recevoir automatiquement chaque briefing par email (envoi post-pipeline)
- **FR46** : L'abonné newsletter peut se désabonner en 1 clic depuis un lien dans chaque email
- **FR47** : Le visiteur peut partager le site sur les réseaux sociaux avec des Open Graph images dynamiques (briefing du jour bilingue)
- **FR48** : Le visiteur peut partager sur Twitter/X avec une Twitter Card `summary_large_image`
- **FR49** : Le visiteur peut s'abonner via un flux RSS statique (power-users Feedly/Inoreader)

### 9.7 Capability Area 7 — Observability & Operations

- **FR50** : L'équipe peut voir un dashboard uptime (UptimeRobot gratuit) avec alertes email si downtime > 5 min
- **FR51** : L'équipe peut voir les logs structurés de chaque run de pipeline (succès, latence, erreurs) dans GitHub Actions
- **FR52** : L'équipe peut voir les analytics de fréquentation via Cloudflare Web Analytics (pageviews, pays, top pages, durée)
- **FR53** : Le système peut déclencher une alerte (GitHub Issue auto-créée) si 2 runs consécutifs échouent
- **FR54** : Le système peut retry automatiquement les appels API en échec (max 3 tentatives)

### Self-validation

- ✅ Coverage complète des user journeys (Thomas, Sophie, Marc hypothèse, Clément)
- ✅ Coverage complète des exigences domaine (finance, publication, IA)
- ✅ Coverage des contraintes légales (disclaimer, RGPD analytics, double opt-in)
- ✅ 54 FRs au total (dans la fourchette 20-50 typique pour Level 3)
- ✅ Groupés en 7 capability areas (dans la fourchette 5-8 recommandée)
- ✅ Altitude check : toutes implementation-agnostic
- ✅ Testabilité : chaque FR est une capacité vérifiable
- ✅ Traçabilité : chaque FR peut être relié à un user journey + une section du Product Brief

---

## 10. Non-Functional Requirements (NFRs)

### 10.1 Performance

- **NFR1 — LCP < 2s** : Le Largest Contentful Paint de la homepage doit être inférieur à 2 secondes sur connexion 4G simulée (mesure Lighthouse throttling). Priorité : Must Have.
- **NFR2 — Lighthouse ≥ 90** : Les 4 catégories Lighthouse (Performance, Accessibility, Best Practices, SEO) doivent toutes atteindre ≥ 90. Validé à chaque PR via GitHub Action. Priorité : Must Have.
- **NFR3 — Initial JS bundle < 250 KB gzipped** : Le bundle JavaScript initial doit rester sous 250 KB gzipped malgré Motion 12, Rive, et les composants Aceternity/Magic UI. Stratégie : tree-shaking agressif, lazy-loading des composants non-critiques. Priorité : Must Have.
- **NFR4 — CLS < 0.1** : Cumulative Layout Shift inférieur à 0.1 malgré l'avatar Rive et les animations. Stratégie : dimensions fixes pour tous les composants animés. Priorité : Must Have.
- **NFR5 — Rive asset < 100 KB** : L'avatar Rive exporté en `.riv` doit peser moins de 100 KB. Priorité : Must Have.
- **NFR6 — TBT < 200 ms** : Total Blocking Time < 200 ms. Animations après hydration. Priorité : Should Have.

### 10.2 Reliability & Availability

- **NFR7 — Uptime 99 %** : Le site doit être accessible 99 % du temps sur 30 jours glissants. Monitoring UptimeRobot gratuit. Priorité : Must Have. (upgrade depuis Should Have en v1 suite à arbitrage utilisateur : "un site vitrine inaccessible = candidature ratée")
- **NFR8 — Pipeline reliability ≥ 95 %** : Le pipeline nocturne doit réussir ≥ 95 % du temps sur 7 jours glissants. Retry automatique max 3 tentatives. Alerte auto Issue GitHub si 2 échecs consécutifs. Priorité : Must Have.
- **NFR9 — Recovery time < 5 min** : En cas de défaillance pipeline, le fallback gracieux doit basculer en < 5 minutes sur la dernière version valide. Priorité : Must Have.

### 10.3 Security

- **NFR10 — Zero secret leak** : Aucune clé API, token ou secret ne doit apparaître dans le code source ou l'historique Git. Pre-commit hook actif + GitHub secret scanning + push protection. Audit manuel à chaque release. Priorité : Must Have.
- **NFR11 — HTTPS everywhere** : Toutes les pages servies en HTTPS via Cloudflare. Redirect automatique HTTP → HTTPS. Priorité : Must Have.
- **NFR12 — Secrets isolation** : Les clés API Claude + Finnhub + FRED stockées uniquement dans GitHub Actions secrets + Cloudflare env vars. Priorité : Must Have.

### 10.4 Scalability & Cost

- **NFR13 — Cost ≤ 8€/month** : Le coût total d'exploitation mensuel doit rester sous 8 €. Composition : Cloudflare free tier (0 €), GitHub Actions free tier (0 €), Buttondown < 100 abonnés (0 €), Claude API (~5 €), domaine .io (~3 €). Priorité : Must Have.
- **NFR14 — Scale ≤ 100k MAU** : L'infrastructure doit supporter jusqu'à 100 000 visiteurs uniques/mois sans coût additionnel (limite free tier Cloudflare). Priorité : Should Have.

### 10.5 Accessibility

- **NFR15 — WCAG 2.1 AA** : Conformité WCAG 2.1 niveau AA sur toutes les pages. Contrastes ≥ 4.5:1 (texte) et ≥ 3:1 (composants UI). Navigation clavier complète. Alt text sur toutes les images. Labels ARIA sur composants interactifs. Respect de `prefers-reduced-motion`. Validé via Axe DevTools + test NVDA + zoom 200 %. Priorité : Must Have.
- **NFR16 — Keyboard navigation** : Toutes les fonctionnalités accessibles au clavier. Focus indicators visibles (2px outline). Priorité : Must Have.
- **NFR17 — Screen reader compatibility** : Compatible avec NVDA (Windows) et VoiceOver (Mac). Priorité : Should Have.

### 10.6 Compatibility

- **NFR18 — Modern browsers** : Support Chrome, Firefox, Safari, Edge versions N et N-1 (2 dernières majeures). Dégradation gracieuse sur anciens. Priorité : Should Have.
- **NFR19 — Responsive 3 breakpoints** : Design responsive sur mobile (375px+), tablet (768px+), desktop (1280px+). Pas de scroll horizontal. Touch targets ≥ 44×44 px. Priorité : Must Have.

### 10.7 Internationalization

- **NFR20 — 100 % bilingual** : 100 % du contenu éditorial et UI disponible en FR et EN. Génération IA en 1 appel par langue. Pas de texte hardcodé. Priorité : Must Have.
- **NFR21 — No FOUC on lang switch** : Transition de langue sans flash de contenu non traduit. Priorité : Should Have.

### 10.8 Observability

- **NFR22 — Structured logs** : Tous les runs pipeline et appels API loggés en format JSON structuré (timestamps ISO 8601, niveaux info/warn/error). Consultables dans GitHub Actions UI. Priorité : Could Have.
- **NFR23 — Analytics dashboard** : Cloudflare Web Analytics actif sur 100 % des pages, dashboard accessible à Emmanuel et Bryan. Priorité : Must Have.

### 10.9 Priority Summary

| Priority | FRs count | NFRs count | Total |
|---|---|---|---|
| **Must Have** | 54 | 16 | 70 |
| **Should Have** | 0 | 5 | 5 |
| **Could Have** | 0 | 2 | 2 |
| **TOTAL** | **54** | **23** | **77** |

*Note : La quasi-totalité des FRs est en Must Have car le MVP est déjà cadré sans features superflues. Les Should/Could Have concernent uniquement des NFRs de polish (TBT, compat anciens navigateurs, observabilité avancée).*

---

## 11. Polish & Review

### 11.1 Capability Contract Summary

YieldField doit livrer **77 capacités totales** (54 FRs + 23 NFRs) organisées en **7 capability areas fonctionnelles** et **9 catégories non-fonctionnelles**. Chaque capacité est testable, implementation-agnostic, et traçable au Product Brief v2.

### 11.2 Dépendances externes

| Service | Criticité | Fallback |
|---|---|---|
| Claude API (Anthropic) | HIGH | Fallback cache dernière version + alerte |
| Finnhub API | HIGH | Fallback FRED + cache 12h |
| FRED API | MEDIUM | Fallback Finnhub pour données communes |
| Alpha Vantage | LOW (marginal) | Simplement ignoré en cas d'échec |
| Cloudflare Pages/R2/Workers | CRITICAL | Aucun (dépendance unique) |
| GitHub Actions | HIGH | Manuel (workflow_dispatch si cron KO) |
| Buttondown | MEDIUM | Newsletter pausée temporairement |
| UptimeRobot | LOW | Aucun besoin de fallback |

### 11.3 Glossaire

- **Briefing macro** : article éditorial quotidien de 4-5 phrases commentant l'état du marché
- **Chartiste Lettré** : persona narrative IA adoptée par le briefing (voix cultivée, ironique, ancrée dans les chiffres)
- **Coulisses** : page transparente du site exposant méthodologie, prompts, logs
- **DoD** (Definition of Done) : critères explicites pour considérer une livraison comme complète
- **FR** (Functional Requirement) : capacité que le produit doit savoir faire
- **NFR** (Non-Functional Requirement) : qualité que le produit doit atteindre
- **LCP** (Largest Contentful Paint) : métrique Web Vital mesurant le temps d'affichage de l'élément principal
- **OAT** : Obligations Assimilables du Trésor (dette souveraine française)
- **Bund** : Bundesanleihe (dette souveraine allemande)
- **VIX** : volatility index du S&P 500 (baromètre de la peur des marchés US)
- **VSTOXX** : équivalent européen du VIX sur l'Euro Stoxx 50
- **DXY** : Dollar Index, panier pondéré du dollar américain vs 6 devises majeures
- **Percentile 90 / 252j** : valeur dépassée 10 % du temps sur les 252 derniers jours ouvrés (≈ 1 an)
- **Rive** : format d'animation vectorielle interactive temps réel avec state machine
- **Lottie** : format d'animation vectorielle léger basé sur After Effects
- **Motion 12** : moteur d'animation React (anciennement Framer Motion)
- **next-intl** : librairie d'internationalisation pour Next.js App Router
- **SSG** (Static Site Generation) : génération de pages HTML au build, pas à la requête
- **R2** : service de stockage objet de Cloudflare (compatible S3)
- **BMAD** : Brief → Model → Architecture → Development (méthodologie WEDOOALL Solutions)

### 11.4 Changements vs PRD v1.0/v1.1

| # | Changement | Motivation |
|---|---|---|
| 1 | Classification Level 2 → Level 3 | Inventaire FRs + NFRs dépasse 15 stories |
| 2 | Nouvelle persona narrative "Chartiste Lettré" | Web research : "trader senior" saturé, persona spécifique nécessaire |
| 3 | Positionnement éditorial-first (pas tech-first) | Skeptic + GTM : éviter AI-fatigue recruteurs |
| 4 | Marc = hypothèse à valider (pas persona primaire) | Skeptic : pain non testé |
| 5 | Page Coulisses accessible dès hero (pas enterrée) | GTM : Thomas et Sophie convergent sur Coulisses |
| 6 | APIs Finnhub primary + FRED (Alpha Vantage marginal) | Web research : Alpha Vantage dégradé à 25 req/jour |
| 7 | Newsletter email ajoutée au MVP | Opportunity : levier de rétention critique |
| 8 | Plan de distribution dans le brief (GTM owner Bryan) | GTM : 80 % des projets meurent en distribution |
| 9 | Alert VIX percentile glissant (pas seuil fixe) | Robustesse sur régimes de marché variés |
| 10 | Génération bilingue Opus → Haiku (pas double Opus) | Budget : 10× moins cher sur traduction EN |
| 11 | Cadre légal AMF explicite avec mitigation 4 niveaux | Skeptic : disclaimer footer insuffisant |
| 12 | Contrainte "IA jamais manuelle" → "IA-first avec override exceptionnel" | Résout la contradiction v1 |
| 13 | Timeline 4 semaines → 6 + 2 semaines | Skeptic : 4 semaines infeasible pour scope réel |
| 14 | Trajectoire C white-label B2B ajoutée à la vision 12 mois | Opportunity : 30 k€ ARR potentiel identifié |
| 15 | Classification ramenée au niveau BMAD 3 (pas 2) | Level 2 = 5-15 stories, on est clairement plus |

### 11.5 Open questions restantes

- **Q1** : Choix du nom de domaine final (Issue GitHub #2 en attente de Bryan) — yieldview.io, curvelab.io, ratepulse.io, yieldfield.io ou autre
- **Q2** : Budget précis de la revue juridique (500 € estimé, à confirmer avec le juriste)
- **Q3** : Modalité exacte de l'override humain (Bryan reçoit un email à 6h UTC ? Notification Slack ? Dashboard Cloudflare ?)
- **Q4** : Cadence exacte de rotation des prompts v01 → v02 → v03 (hebdo ? conditionnel à un bug ?)

Ces questions ne sont pas bloquantes pour le passage en Phase 3 (Architecture + UX Design) mais doivent être tranchées avant le sprint planning.

---

## 12. Completion

**Status :** FINAL-DRAFT — Prêt pour phase 3 (Architecture + UX Design)

**Prochaines étapes BMAD v6.3.0 :**
1. **Winston (System Architect)** exécute `bmad-create-architecture` avec ce PRD en input
2. **Sally (UX Designer)** exécute `bmad-create-ux-design` avec ce PRD en input (en parallèle)
3. **Gate Check** avec `bmad-check-implementation-readiness` avant sprint planning
4. **John + Scrum Master** exécutent `bmad-create-epics-and-stories` puis `bmad-sprint-planning`
5. **Amelia (Developer)** commence `bmad-dev-story` pour la première story

**Validation requise auprès du Product Owner (Bryan)** :
- Issue GitHub séparée pour valider le PRD v2 (sera créée en Phase E du plan d'upgrade BMAD)
- Bryan doit confirmer : classification Level 3, persona Chartiste Lettré, newsletter dans MVP, trajectoire C B2B acceptable, timeline 8 semaines

---

*Document généré via BMAD v6.3.0 workflow `bmad-create-prd` — 11 steps synthétisés en une passe cohérente (mode hybride A/P/C avec arbitrage utilisateur aux moments critiques).*
*Product Manager facilitateur : Claude (Opus 4.6 avec contexte 1M) jouant le rôle de John, PM BMAD.*
