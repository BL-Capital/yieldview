# Product Brief — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Client :** Bryan (23 ans, passionné finance de marché)
**Architecte :** Emmanuel — WEDOOALL Solutions S.L.
**Méthodologie :** BMAD v6 (Phase 1 - Discovery)
**Date :** 2026-04-11
**Version :** 1.0 (dérivé du PRD v1.0 + v1.1)
**Référence :** PB-YIELDFIELD-2026-001

---

## 1. Executive Summary

**YieldField** est un site vitrine éditorial haut de gamme qui publie chaque matin un briefing macro financier généré par IA à partir de données de marché réelles (taux, spreads, indices, volatilité). Destiné aux analystes, traders juniors et recruteurs du secteur finance, il démontre simultanément trois compétences de Bryan : **maîtrise de la finance de marché**, **maîtrise de l'IA comme outil de production**, et **sens esthétique premium**. Le site est sa preuve de concept vivante.

---

## 2. Problem Statement

**Problème principal :**
Bryan, 23 ans, passionné de finance de marché, cherche à se faire recruter dans un hedge fund ou une banque d'investissement, mais il n'a ni portfolio technique, ni audience, ni expérience professionnelle démontrable. Un CV classique ne suffit pas à démontrer une compétence réelle en analyse de marché ni sa maîtrise des outils IA modernes.

**Exemples concrets :**
- Un recruteur reçoit 200 CV pour un poste junior, il lui faut 30 secondes pour trier
- Un analyste senior ne regarde pas un LinkedIn, il regarde un travail réel
- Les sites "portfolio" classiques (Notion, Webflow) ne prouvent pas la compétence finance

**Solution actuelle des candidats :** CV + LinkedIn + lettre de motivation → indiscernable des autres candidats.

### Why Now?

- L'IA (Claude, Anthropic) permet maintenant à un non-développeur de produire du contenu financier quotidien de qualité
- Les APIs financières gratuites (FRED, BCE, Alpha Vantage, Finnhub) rendent possible un pipeline à coût quasi-nul
- Le marché du recrutement finance valorise de plus en plus les candidats qui maîtrisent l'IA comme outil

### Impact si non résolu

Bryan reste bloqué dans la masse des candidatures invisibles et ne démontre jamais ni sa passion finance, ni sa maîtrise IA — deux compétences qu'il possède pourtant réellement.

---

## 3. Target Audience

### Primary Users

**Marc — Analyste sell-side junior (26 ans)**
- Banque française, vérifie 6-8 chiffres clés avant sa réunion 8h30
- Cherche : sélection data pertinente, pas de l'infobésité
- Visite quotidienne, 2-3 minutes max

**Sophie — Développeuse fintech (29 ans)**
- Startup fintech, intéressée par les making-of techniques
- Cherche : architecture, prompts IA, pipeline, stack Cloudflare
- Visite hebdomadaire

### Secondary Users

**Thomas — Recruteur hedge fund (35 ans)**
- Talent acquisition, sourcing de profils quantitatifs juniors
- Cherche : preuve de compétences concrètes, pas du théorique
- Visite ponctuelle (1-2 fois) → décision rapide

**Clément — Étudiant école de commerce (22 ans)**
- Passionné IA, suit l'actu finance
- Cherche : inspiration, cas d'usage concret et beau
- Visite bi-mensuelle

### User Needs (Top 3)

1. **Information financière fraîche et pertinente** présentée en moins de 2 secondes de chargement
2. **Contexte macro intelligible** sans jargon académique, avec un ton trader expérimenté
3. **Transparence technique** sur comment le site est construit (prompts, pipeline, IA)

---

## 4. Solution Overview

### Proposed Solution

Un site éditorial bilingue (FR/EN), statique et serverless, qui :
- Collecte automatiquement chaque nuit les données de marché via APIs gratuites
- Génère via Claude API un briefing macro quotidien (tone trader senior) + tagline + 6-8 KPIs contextualisés
- Publie avant 8h30 CET sur un domaine `.io` hébergé Cloudflare Pages
- Expose une page "Coulisses" transparente : prompts versionnés, logs API, historique des courbes de taux

### Key Features (MVP)

- **Dashboard KPIs enrichis** — 6-8 chiffres clés (OAT/Bund/US 10Y, spread OAT-Bund, CAC 40, S&P 500, VIX, DXY)
- **Briefing macro IA** — 4-5 phrases, tone trader, thème du jour, niveau de risque
- **Hero animé** — chiffres qui s'incrémentent depuis 0, variations jour en vert/rouge
- **Page Coulisses** — timeline avec prompts v03→v06, logs API, historique courbes animé
- **Bilingue FR/EN** — double génération IA en 1 appel, next-intl
- **Design premium** — fond #0A1628, accents or #C9A84C, transitions fluides
- **Disclaimer légal** — visible en footer, pas de conseil d'investissement

### Value Proposition

> "Ce site est à la fois **mon CV, ma démo technique, et mon laboratoire IA**. Chaque matin, il prouve que je maîtrise trois choses : les marchés, l'IA, et le design."

---

## 5. Business Objectives

### Business Goals (SMART)

- **G1a — Visibilité professionnelle :** Obtenir 3 entretiens qualifiés (hedge fund / banque / fintech) dans les 3 mois après lancement
- **G1b — Démonstration communautaire :** Être reconnu par la communauté tech/finance/IA comme preuve de concept BMAD + Claude Code (partage LinkedIn, Product Hunt, Twitter/X)
- **G2 — Preuve technique :** Avoir un site live, performant (Lighthouse ≥ 90), bilingue, mis à jour quotidiennement
- **G3 — Coût maîtrisé :** Maintenir l'infrastructure sous 8€/mois (Claude API + domaine .io)
- **G4 — Contenu frais :** Publier un briefing macro avant 8h30 CET sur ≥ 95% des jours ouvrés
- **G5 — Transparence :** Documenter ≥ 5 étapes de conception sur la page Coulisses

### Success Metrics

- **Lighthouse Performance** ≥ 90
- **Taux de succès du pipeline nocturne** ≥ 95% sur 7 jours
- **LCP (Largest Contentful Paint)** < 2 secondes
- **Taux de rebond** < 60%
- **Temps moyen sur page Coulisses** > 2 minutes (indicateur d'engagement tech)
- **Nombre d'entretiens obtenus** : 3 en 3 mois

### Business Value

- **Pour Bryan :** Transformation d'un candidat invisible en profil remarquable → accélération carrière
- **Pour WEDOOALL Solutions :** Vitrine publique de la méthodologie BMAD v6 appliquée avec Claude Code
- **Économique :** Coût projet < 100€ total (infra + domaine) vs valeur carrière potentielle estimée à > 10k€ de différentiel annuel

---

## 6. Scope

### In Scope (MVP — Sprint 1-2)

- Dashboard avec 6-8 KPIs financiers (taux, spreads, indices, volatilité, macro)
- Briefing macro quotidien généré par IA (FR + EN)
- Tagline dynamique quotidienne
- Page Coulisses (timeline, prompts, logs)
- Design sombre premium (#0A1628 + #C9A84C)
- Bilingue FR/EN via next-intl
- Pipeline GitHub Actions nocturne (cron 6h UTC)
- Stockage R2 (latest.json + archive)
- Fallback gracieux si API échoue
- Disclaimer légal en footer
- Domaine `.io` + HTTPS
- Pre-commit hook de sécurité (pas de clés API dans le code)

### Out of Scope (MVP)

- ❌ Authentification utilisateur
- ❌ Backoffice web d'administration
- ❌ Base de données SQL (utilisation JSON sur R2)
- ❌ SSR dynamique (SSG uniquement)
- ❌ Notifications push / email
- ❌ Forum / commentaires
- ❌ API publique
- ❌ Microservices
- ❌ Support mobile natif (iOS/Android)
- ❌ Conseil d'investissement / signaux d'achat

### Future Considerations (V2+)

- Yield curve OAT/Bund/Treasuries animée en fond de page (US-20)
- Lexique financier interactif (50-100 termes bilingues)
- Archive historique navigable des briefings passés
- Graphiques interactifs (Chart.js ou D3.js)
- Newsletter email quotidienne
- Migration JSON → D1 (SQLite Cloudflare) si besoin de requêtage
- Module "Alert" en cas de spike VIX / crise crédit

---

## 7. Stakeholders

- **Bryan (Client & Développeur)** — Influence : **HIGH**. Propriétaire du projet, exécutant principal assisté par Claude Code. Intérêt : démontrer ses compétences, décrocher un job finance.
- **Emmanuel (Architecte / PM)** — Influence : **HIGH**. Architecte enterprise (WEDOOALL Solutions), méthodologiste BMAD, guide technique. Intérêt : démontrer la méthodo BMAD v6 + vitrine cliente.
- **Recruteurs cibles (Hedge funds / Banques)** — Influence : **MEDIUM**. Destinataires finaux, décideurs de la valeur perçue. Intérêt : évaluer la compétence technique et finance de Bryan.

---

## 8. Constraints & Assumptions

### Constraints

- **Budget strict :** ≤ 8€/mois (Claude API + domaine .io uniquement)
- **Ressource humaine :** 1 développeur solo (Bryan) + assistance Claude Code
- **Timeline MVP :** 3-4 semaines maximum
- **APIs gratuites uniquement :** FRED, BCE, Alpha Vantage (25 req/jour), Finnhub
- **Pas de rédaction manuelle :** Tout le contenu est généré par IA
- **Bilingue obligatoire dès le MVP** (FR + EN)
- **Pas de conseil d'investissement** (contrainte légale — disclaimer obligatoire)
- **Performance :** LCP < 2s, Lighthouse ≥ 90
- **Stack imposée :** Cloudflare (Pages + Workers + R2) + Next.js + Claude API
- **Sécurité :** Aucune clé API dans le code source (pre-commit hook installé)

### Assumptions

- Les APIs gratuites (FRED, BCE, Alpha Vantage, Finnhub) resteront disponibles et stables pendant 12 mois
- GitHub Actions cron s'exécute avec un retard max de 60 minutes
- Claude API Haiku reste sous 10€/mois avec 1 appel/jour (FR+EN)
- Next.js + next-intl gère le bilingue sans doubler le bundle
- Bryan a ≥ 10h/semaine à dédier au projet pendant 4 semaines
- La qualité du briefing IA s'améliore par itération de prompt (v03 → v06)
- Le public cible accepte un site statique mis à jour 1x/jour (pas de temps réel)

---

## 9. Success Criteria

- ✅ **Site live sur domaine .io** avec HTTPS fonctionnel (DNS < 200ms)
- ✅ **Pipeline nocturne fiable** : taux de succès ≥ 95% sur 7 jours consécutifs
- ✅ **Briefing publié avant 8h30 CET** sur 100% des jours ouvrés (5/5)
- ✅ **Lighthouse Performance ≥ 90**
- ✅ **Courbe des taux visible** et mise à jour quotidienne
- ✅ **Spread OAT-Bund** calculé et affiché (preuve de maîtrise)
- ✅ **Briefing mentionne ≥ 2 spreads/indicateurs de volatilité**
- ✅ **Bilingue FR/EN** sur 100% des pages
- ✅ **Page Coulisses** avec ≥ 5 étapes documentées + évolutions de prompts
- ✅ **Fallback edge case** fonctionnel (données manquantes → dernière valeur + timestamp)
- ✅ **Disclaimer légal** visible en footer de chaque page
- ✅ **Aucune clé API** détectée dans le code source (scan pre-commit passant)
- ✅ **README GitHub** présentable (structure claire, revue par un tiers)

---

## 10. Timeline

### Target Launch

**MVP :** Objectif ambitieux **fin avril 2026** grâce à l'accompagnement IA (Claude Code + méthodologie BMAD) — Bryan sera surpris de notre capacité à accélérer le delivery.

### Key Milestones

- **S1 — Semaine 1 (11-17 avril 2026) :**
  - Setup repo + stack Next.js + Cloudflare Pages
  - Pipeline GitHub Actions squelette
  - Premier fetch FRED / BCE / Alpha Vantage fonctionnel
  - Design system (couleurs, typo, composants)

- **S2 — Semaine 2 (18-24 avril 2026) :**
  - Intégration Claude API + prompt v01
  - Génération briefing + tagline + hero_metrics
  - Frontend dashboard avec 6-8 KPIs
  - Bilingue FR/EN

- **S3 — Semaine 3 (25 avril - 1 mai 2026) :**
  - Page Coulisses (timeline + prompts + logs)
  - Fallback gracieux + edge cases
  - Domaine .io + DNS + HTTPS
  - Lighthouse ≥ 90

- **S4 — Semaine 4 (2-8 mai 2026) :**
  - Itération prompts v02 → v06
  - Tests DoD complets
  - Documentation + README
  - **Go-live public** 🚀

---

## 11. Risks

- **R1 — Alpha Vantage free tier insuffisant (25 req/jour)**
  - **Likelihood :** Medium
  - **Impact :** High
  - **Mitigation :** Tout récupérer en 1 batch (< 10 requêtes). Backup Finnhub (60 req/min gratuit). Cache agressif.

- **R2 — Retard GitHub Actions cron (jusqu'à 60 min)**
  - **Likelihood :** High
  - **Impact :** Low
  - **Mitigation :** Planifier à 6h UTC pour publier avant 8h30 CET. Le retard n'affecte pas l'expérience visiteur.

- **R3 — Qualité du briefing IA inconsistante**
  - **Likelihood :** Medium
  - **Impact :** High
  - **Mitigation :** Prompt système versionné et itéré (v01→v06). Validation manuelle 2 premières semaines. Guardrails dans le prompt (longueur, ton, structure).

- **R4 — Coût Claude API dépasse le budget**
  - **Likelihood :** Low
  - **Impact :** Medium
  - **Mitigation :** 1 appel/jour avec modèle Haiku (moins cher). Monitoring via dashboard Anthropic. Alertes si > 10€/mois.

- **R5 — Bilingue FR/EN double le travail**
  - **Likelihood :** High
  - **Impact :** Medium
  - **Mitigation :** Générer les deux langues dans un seul appel Claude API (prompt multi-output). Aucun contenu statique à traduire manuellement.

- **R6 — Clé API exposée publiquement**
  - **Likelihood :** Low
  - **Impact :** High
  - **Mitigation :** Pre-commit hook installé (scan secrets), GitHub push protection activé, secrets en variables d'environnement Cloudflare.

- **R7 — Design trop ambitieux vs timeline 4 semaines**
  - **Likelihood :** Medium
  - **Impact :** Medium
  - **Mitigation :** MVP minimaliste. Animations / yield curve animée reportées en V2. Focus sur lisibilité et performance avant le "wow".

- **R8 — Performance dégradée par bundle i18n**
  - **Likelihood :** Low
  - **Impact :** Medium
  - **Mitigation :** Lazy-loading des traductions, SSG par locale, monitoring Lighthouse à chaque build.

---

## Appendix — Links & References

- **Repo GitHub :** https://github.com/BL-Capital/yieldview
- **PRD v1.0 :** `docs/PRD_BMAD_Site_Finance_Bryan_v1.0.docx`
- **PRD v1.1 (avec reco Bryan) :** `docs/PRD_BMAD_Site_Finance_Bryan_v1.1.docx`
- **BMAD Workflow Status :** `docs/bmm-workflow-status.yaml`
- **Issue de revue PRD :** BL-Capital/yieldview#1

---

*Document généré dans le cadre du workflow BMAD v6 — Phase 1 Discovery*
*Business Analyst : Claude (Opus 4.6)*
