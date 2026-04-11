# PRD — YieldField

**Projet :** YieldField — Site Vitrine Finance de Marché × IA
**Version :** 2.0 (PRD formel BMAD, fusion PRD v1.0 + v1.1 + Product Brief)
**Date :** 2026-04-11
**Auteur :** Emmanuel — WEDOOALL Solutions (Product Manager)
**Méthodologie :** BMAD v6 — Phase 2 (Planning)
**Référence :** PRD-YIELDFIELD-2026-002
**Niveau projet :** Level 2 (Medium — 8-15 stories)

---

## 1. Foundation (depuis Product Brief)

### Executive Summary

YieldField est un site vitrine éditorial haut de gamme qui publie chaque matin un briefing macro financier généré par IA à partir de données de marché réelles (taux, spreads, indices, volatilité). Il démontre simultanément la maîtrise finance, l'usage avancé de l'IA, et un design premium — le tout en moins de 8€/mois d'infrastructure.

### Business Objectives

- **G1a — Recrutement :** 3 entretiens qualifiés (hedge fund / banque / fintech) dans les 3 mois post-lancement
- **G1b — Reconnaissance communautaire :** Être cité comme preuve de concept BMAD + Claude Code (LinkedIn, Product Hunt, Twitter/X)
- **G2 — Preuve technique :** Site live, Lighthouse ≥ 90, bilingue, mis à jour quotidiennement
- **G3 — Coût maîtrisé :** Infrastructure ≤ 8€/mois
- **G4 — Contenu frais :** Briefing macro avant 8h30 CET sur ≥ 95% des jours ouvrés
- **G5 — Transparence :** ≥ 5 étapes documentées sur la page Coulisses

### Success Metrics

- Lighthouse Performance ≥ 90
- LCP < 2s
- Pipeline nocturne success rate ≥ 95% (7 jours glissants)
- Taux de rebond < 60%
- Temps moyen page Coulisses > 2 min
- Nombre d'entretiens obtenus : ≥ 3 en 3 mois

### User Personas

- **Marc** — Analyste sell-side junior (26 ans) — Quotidien, 2-3 min
- **Sophie** — Dev fintech (29 ans) — Hebdo, intérêt making-of
- **Thomas** — Recruteur hedge fund (35 ans) — Ponctuel, décision rapide
- **Clément** — Étudiant business school (22 ans) — Bi-mensuel, inspiration

### Out of Scope (MVP)

- Authentification utilisateur / comptes
- Backoffice web d'administration
- Base de données SQL (JSON sur R2 uniquement)
- SSR dynamique (SSG only)
- Notifications push / email
- Forum / commentaires
- API publique
- Microservices
- Apps mobiles natives
- Conseil d'investissement / signaux

---

## 2. Functional Requirements (FRs)

### Module A — Dashboard & KPIs

#### FR-001: Affichage des KPIs financiers enrichis

**Priority:** Must Have

**Description:**
Le dashboard affiche 6-8 chiffres clés de marché segmentés par thème (taux, spreads, indices, volatilité, macro), mis à jour quotidiennement.

**Acceptance Criteria:**
- [ ] Affichage OAT 10Y, Bund 10Y, US 10Y (taux)
- [ ] Affichage spread OAT-Bund calculé
- [ ] Affichage CAC 40, S&P 500 (indices)
- [ ] Affichage VIX (volatilité US)
- [ ] Affichage Dollar Index DXY
- [ ] Chaque KPI montre la valeur + variation J/J + direction (▲/▼)
- [ ] Timestamp de dernière mise à jour visible

**Dependencies:** FR-010 (pipeline data collection)

---

#### FR-002: Animation des chiffres clés au chargement

**Priority:** Must Have

**Description:**
Les 3 chiffres principaux en hero s'animent en s'incrémentant depuis 0 vers leur valeur finale au chargement de la page.

**Acceptance Criteria:**
- [ ] Animation fluide (ease-out, < 2s)
- [ ] Déclenchement au viewport-enter
- [ ] Variation J/J en vert (+) ou rouge (-)
- [ ] Pas de saccade sur devices bas de gamme

**Dependencies:** FR-001

---

#### FR-003: Indicateur de fraîcheur des données

**Priority:** Must Have

**Description:**
Afficher visuellement si les données sont fraîches (< 24h) ou obsolètes (> 24h) avec timestamp lisible.

**Acceptance Criteria:**
- [ ] Timestamp affiché format "Mis à jour il y a X heures"
- [ ] Pastille verte si < 24h, jaune si 24-48h, rouge si > 48h
- [ ] Bilingue FR/EN

**Dependencies:** FR-001

---

### Module B — Briefing Macro IA

#### FR-004: Génération du briefing macro quotidien

**Priority:** Must Have

**Description:**
Générer automatiquement chaque nuit un briefing macro de 4-5 phrases via Claude API, avec un ton trader expérimenté (pas pédagogique), en FR et EN simultanément.

**Acceptance Criteria:**
- [ ] Briefing de 4-5 phrases exactement
- [ ] Ton trader : court, affirmatif, contextuel
- [ ] Mention de ≥ 2 indicateurs (spreads, volatilité, taux)
- [ ] Double génération FR + EN dans 1 appel Claude API
- [ ] Persistance dans latest.json sur R2
- [ ] Timestamp de génération conservé

**Dependencies:** FR-010, FR-011

---

#### FR-005: Briefing enrichi de contexte macro

**Priority:** Should Have

**Description:**
Le briefing inclut explicitement : thème du jour, niveau de certitude des données, événement clé attendu, niveau de risque pour les positions.

**Acceptance Criteria:**
- [ ] Champ `theme_of_day` dans la réponse JSON
- [ ] Champ `certainty` (preliminary / definitive)
- [ ] Champ `upcoming_event` (ex: "Jobs Friday")
- [ ] Champ `risk_level` (low / medium / high)
- [ ] Ces métadonnées visibles à l'écran

**Dependencies:** FR-004

---

#### FR-006: Tagline dynamique quotidienne

**Priority:** Must Have

**Description:**
Générer une phrase d'accroche unique chaque jour via Claude API, visible en haut de page, bilingue.

**Acceptance Criteria:**
- [ ] 1 phrase de 8-15 mots
- [ ] Génération dans le même appel que le briefing
- [ ] Bilingue FR + EN
- [ ] Différente chaque jour ouvré

**Dependencies:** FR-004

---

### Module C — Page Coulisses

#### FR-007: Timeline des étapes de construction

**Priority:** Must Have

**Description:**
Page "Coulisses" présentant une timeline verticale d'au moins 5 étapes de conception avec captures d'écran et descriptions.

**Acceptance Criteria:**
- [ ] ≥ 5 étapes documentées
- [ ] Format timeline verticale avec dates
- [ ] Chaque étape : titre + description + screenshot
- [ ] Bilingue FR/EN
- [ ] Contenu MDX dans le repo

**Dependencies:** Aucune

---

#### FR-008: Historique des prompts IA versionnés

**Priority:** Should Have

**Description:**
Afficher l'évolution des prompts système utilisés (v01 → v06+), avec le diff entre versions et les raisons du changement.

**Acceptance Criteria:**
- [ ] Min 3 versions de prompts affichées
- [ ] Diff visuel entre versions
- [ ] Commentaire expliquant l'évolution
- [ ] Lien vers le commit Git correspondant

**Dependencies:** FR-007

---

#### FR-009: Logs d'appels API et métadonnées pipeline

**Priority:** Could Have

**Description:**
Afficher les logs du dernier run pipeline : timestamps, latence par API, statut de succès/échec.

**Acceptance Criteria:**
- [ ] Tableau des 7 derniers runs
- [ ] Latence moyenne par source API
- [ ] Statut succès/échec coloré
- [ ] Mis à jour depuis logs GitHub Actions

**Dependencies:** FR-010

---

### Module D — Pipeline de données

#### FR-010: Collecte automatique des données de marché

**Priority:** Must Have

**Description:**
Script automatisé collectant les données via APIs gratuites (FRED, BCE, Alpha Vantage, Finnhub), exécuté chaque nuit par GitHub Actions.

**Acceptance Criteria:**
- [ ] Cron GitHub Actions 6h UTC chaque jour ouvré
- [ ] Fetch FRED (taux US), BCE (taux EU), Alpha Vantage (indices), Finnhub (backup)
- [ ] Maximum 10 requêtes par run (quota Alpha Vantage 25/jour)
- [ ] Résultat persisté dans `raw_data.json`
- [ ] Logs structurés

**Dependencies:** Aucune

---

#### FR-011: Appel Claude API pour génération de contenu

**Priority:** Must Have

**Description:**
Appeler Claude API (modèle Haiku) avec les données brutes pour générer briefing + tagline + metadata, en FR et EN, dans un seul appel.

**Acceptance Criteria:**
- [ ] 1 appel par jour (pas plus)
- [ ] Modèle Haiku (cost-optimized)
- [ ] Prompt versionné (fichier `prompts/briefing-v{N}.md`)
- [ ] Output structuré JSON validé
- [ ] Monitoring coût mensuel

**Dependencies:** FR-010

---

#### FR-012: Fallback gracieux en cas d'erreur

**Priority:** Must Have

**Description:**
Si une API échoue ou si le pipeline plante, afficher les dernières données valides avec un indicateur de fraîcheur dégradée.

**Acceptance Criteria:**
- [ ] Si fetch API échoue : utiliser dernière valeur + timestamp "donnée > 12h"
- [ ] Si pipeline total échoue : afficher dernier `latest.json` valide
- [ ] Indicateur visuel UI (pastille jaune/rouge)
- [ ] Log d'alerte GitHub Issue automatique

**Dependencies:** FR-001, FR-010

---

#### FR-013: Gestion des edge cases finance

**Priority:** Should Have

**Description:**
Gérer les scénarios spécifiques : marché fermé, weekend, spike volatilité, absence de données.

**Acceptance Criteria:**
- [ ] Marché fermé → afficher veille + libellé "dernier jour ouvré"
- [ ] Weekend → pas de génération, affichage vendredi
- [ ] Spike VIX > 30 → tone change du briefing + alerte risque
- [ ] Absence données > 48h → fallback historique 7 jours

**Dependencies:** FR-012

---

#### FR-016: Override manuel du briefing IA

**Priority:** Must Have

**Description:**
Bryan doit pouvoir corriger/surcharger manuellement le briefing IA généré avant sa publication publique, via un workflow simple (édition du JSON dans le repo ou interface admin légère).

**Acceptance Criteria:**
- [ ] Champ `manual_override` dans `latest.json` (texte FR + EN)
- [ ] Si `manual_override` renseigné, le frontend affiche cette version
- [ ] Badge visuel discret "édité manuellement" (optionnel)
- [ ] Workflow documenté : édition → commit → déploiement auto
- [ ] Pas de perte de l'historique IA original (conservation `ai_original`)

**Dependencies:** FR-004

---

#### FR-017: Module Alert — Spike VIX & crise

**Priority:** Must Have

**Description:**
Module d'alerte automatique basé sur une approche **percentile** (statistique dynamique) plutôt qu'un seuil fixe. Déclenchement quand le VIX dépasse son 90ᵉ percentile glissant (fenêtre 252 jours ouvrés ≈ 1 an). Change le ton du briefing et affiche une bannière visuelle.

**Acceptance Criteria:**
- [ ] Calcul du 90ᵉ percentile VIX sur 252 derniers jours ouvrés (fenêtre glissante)
- [ ] Déclenchement alerte si `VIX_today > VIX_p90_252d`
- [ ] Alternative : seuil escalé (p90 = warning, p95 = alert, p99 = crisis)
- [ ] Bannière visuelle rouge/orange en haut de page
- [ ] Tone du briefing IA modifié (prompt conditionnel "crise mode")
- [ ] Libellé bilingue FR/EN ("Marché sous tension" / "Market under stress")
- [ ] Log de l'événement dans le pipeline
- [ ] Historique des alertes conservé (JSON sur R2)

**Rationale:**
Approche percentile plutôt que seuil fixe (30) car plus robuste dans le temps : en 2020 VIX a dépassé 80, en 2017 il était stable à 10. Un seuil dynamique s'adapte aux régimes de marché et évite les faux positifs/négatifs.

**Dependencies:** FR-004, FR-011

---

### Module E — Expérience utilisateur & i18n

#### FR-014: Switcher de langue FR/EN

**Priority:** Must Have

**Description:**
Toggle de langue visible dans le header, avec routage `/fr` et `/en`, persistance du choix utilisateur.

**Acceptance Criteria:**
- [ ] Toggle FR/EN visible sur toutes les pages
- [ ] URLs `/fr/...` et `/en/...`
- [ ] Persistance via cookie ou localStorage
- [ ] Pas de flash de contenu non traduit (FOUC)

**Dependencies:** Aucune

---

#### FR-015: Disclaimer légal obligatoire

**Priority:** Must Have

**Description:**
Disclaimer légal explicite "Ceci n'est pas un conseil en investissement", visible en footer de chaque page, bilingue.

**Acceptance Criteria:**
- [ ] Présent en footer de 100% des pages
- [ ] Texte bilingue FR/EN
- [ ] Lisible (taille > 12px, contraste WCAG AA)
- [ ] Validé juridiquement (formulation prudente)

**Dependencies:** Aucune

---

### Module F — Analytics & SEO

#### FR-018: Analytics privacy-first

**Priority:** Must Have

**Description:**
Intégrer une solution d'analytics privacy-first (Plausible ou Umami) dès le MVP pour mesurer les visites, les pays, les pages consultées, sans cookie ni RGPD.

**Acceptance Criteria:**
- [ ] Solution choisie : Plausible self-hosted OU Umami OU Cloudflare Web Analytics (gratuit)
- [ ] Tracking visites, pages vues, durée, bounce rate
- [ ] Pas de cookie, pas de consent banner nécessaire
- [ ] Dashboard accessible à Bryan et Emmanuel
- [ ] Tracking installé sur 100% des pages

**Dependencies:** Aucune

**Rationale:**
Permet de mesurer les Success Metrics (taux de rebond < 60%, temps sur page Coulisses > 2 min) et d'objectiver la traction pour les recruteurs.

---

#### FR-019: Open Graph / Twitter Card dynamique avec briefing du jour

**Priority:** Must Have

**Description:**
Générer dynamiquement les metadonnées Open Graph et Twitter Card avec le briefing macro + tagline du jour pour que chaque partage réseau social soit attractif et unique.

**Acceptance Criteria:**
- [ ] Balises OG (og:title, og:description, og:image)
- [ ] Twitter Card (twitter:card=summary_large_image)
- [ ] og:title = tagline du jour
- [ ] og:description = première phrase du briefing
- [ ] og:image générée dynamiquement (Satori / @vercel/og) avec chiffres du jour
- [ ] Image bilingue selon la locale de l'URL (/fr ou /en)
- [ ] Mise à jour quotidienne (après pipeline)

**Dependencies:** FR-004, FR-006

**Rationale:**
Chaque partage LinkedIn, Twitter ou Slack devient une mini-publicité pour YieldField avec du contenu frais. Levier viral critique pour G1b (reconnaissance communautaire).

---

## 3. Non-Functional Requirements (NFRs)

### NFR-001: Performance — LCP < 2s

**Priority:** Must Have

**Description:**
Le Largest Contentful Paint doit être inférieur à 2 secondes sur connexion 4G simulée.

**Acceptance Criteria:**
- [ ] LCP < 2s (mesure Lighthouse, throttling 4G)
- [ ] LCP < 1.5s sur desktop fibre
- [ ] Validé à chaque build via CI

**Rationale:**
L'audience cible (analystes, traders) ne tolère pas les sites lents. La performance est un signal de qualité.

---

### NFR-002: Lighthouse Score ≥ 90

**Priority:** Must Have

**Description:**
Score Lighthouse ≥ 90 sur les 4 catégories : Performance, Accessibility, Best Practices, SEO.

**Acceptance Criteria:**
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90
- [ ] Validé à chaque PR via GitHub Action

**Rationale:**
Preuve mesurable de qualité technique pour recruteurs tech.

---

### NFR-003: Disponibilité 99%

**Priority:** Must Have

**Description:**
Le site doit être accessible 99% du temps (hors maintenance planifiée).

**Acceptance Criteria:**
- [ ] Uptime monitoring via UptimeRobot (gratuit)
- [ ] 99% uptime sur 30 jours glissants
- [ ] Dashboard de monitoring public ou interne
- [ ] Alerte email si downtime > 5 min

**Rationale:**
Cloudflare Pages offre naturellement > 99.9%. L'objectif est atteignable sans surcoût mais doit être mesuré et garanti — un site vitrine inaccessible = candidature ratée pour Bryan.

---

### NFR-004: Coût infrastructure ≤ 8€/mois

**Priority:** Must Have

**Description:**
Le coût total d'exploitation mensuel doit rester sous 8€ (domaine + Claude API + hosting).

**Acceptance Criteria:**
- [ ] Cloudflare Pages (free tier)
- [ ] Cloudflare R2 (free tier < 10 GB)
- [ ] GitHub Actions (free tier repo public)
- [ ] Claude API < 5€/mois (monitoring)
- [ ] Domaine .io ≈ 3€/mois

**Rationale:**
Contrainte budgétaire stricte imposée par Bryan, et démonstration que BMAD peut produire du qualité avec peu de ressources.

---

### NFR-005: Sécurité — Aucune clé API dans le code

**Priority:** Must Have

**Description:**
Aucune clé API, token, ou secret ne doit apparaître dans le code source ou l'historique Git.

**Acceptance Criteria:**
- [ ] Pre-commit hook actif (scan secrets)
- [ ] GitHub secret scanning + push protection activés
- [ ] Secrets dans variables d'environnement Cloudflare / GitHub Actions
- [ ] Audit manuel à chaque release

**Rationale:**
Une fuite de clé Claude API peut coûter des centaines d'euros et ruiner le projet.

---

### NFR-006: Accessibility WCAG AA

**Priority:** Should Have

**Description:**
Respect des standards WCAG 2.1 niveau AA sur toutes les pages.

**Acceptance Criteria:**
- [ ] Contraste texte > 4.5:1
- [ ] Navigation clavier complète
- [ ] Alt text sur toutes les images
- [ ] Labels ARIA sur composants interactifs
- [ ] Validé via Lighthouse Accessibility ≥ 90

**Rationale:**
Inclusivité + signal de qualité technique.

---

### NFR-007: Bilingue FR/EN dès le MVP

**Priority:** Must Have

**Description:**
100% du contenu disponible en FR et EN, sans rédaction manuelle.

**Acceptance Criteria:**
- [ ] next-intl intégré
- [ ] Routes `/fr` et `/en`
- [ ] Toutes les pages traduites
- [ ] Briefing IA généré dans les 2 langues
- [ ] Pas de texte hardcodé

**Rationale:**
Audience cible internationale + différenciation.

---

### NFR-008: Compatibilité navigateurs modernes

**Priority:** Should Have

**Description:**
Support des 2 dernières versions majeures de Chrome, Firefox, Safari, Edge.

**Acceptance Criteria:**
- [ ] Chrome N-1, Firefox N-1, Safari N-1, Edge N-1
- [ ] Pas de dépendance à des polyfills lourds
- [ ] Dégradation gracieuse sur navigateurs anciens

**Rationale:**
Audience pro utilise navigateurs récents, pas besoin de supporter IE.

---

### NFR-009: Pipeline reliability ≥ 95%

**Priority:** Must Have

**Description:**
Le pipeline nocturne doit réussir ≥ 95% du temps sur 7 jours glissants.

**Acceptance Criteria:**
- [ ] Monitoring GitHub Actions
- [ ] Alerte Issue auto si 2 échecs consécutifs
- [ ] Retry automatique en cas d'échec API (max 3)
- [ ] Dashboard de santé pipeline

**Rationale:**
Un site vitrine avec des données obsolètes perd toute crédibilité.

---

### NFR-010: Observabilité & logs structurés

**Priority:** Could Have

**Description:**
Tous les runs pipeline et appels API doivent être loggés de façon structurée.

**Acceptance Criteria:**
- [ ] Logs JSON structurés
- [ ] Timestamps ISO 8601
- [ ] Niveaux (info / warn / error)
- [ ] Consultables dans GitHub Actions UI

**Rationale:**
Debug facile + matière pour page Coulisses.

---

## 4. Epics

### EPIC-001: Core Dashboard & Data Pipeline

**Description:**
Construire le dashboard de KPIs financiers et le pipeline automatisé de collecte + génération IA. Cœur de la valeur produit.

**Functional Requirements:**
- FR-001, FR-002, FR-003, FR-010, FR-011, FR-012, FR-013, FR-017

**Story Count Estimate:** 7-9 stories

**Priority:** Must Have

**Business Value:**
Sans ce module, il n'y a pas de produit. C'est la preuve technique principale (finance + IA + pipeline). Intègre aussi le module Alert VIX pour gérer les crises.

---

### EPIC-002: AI Briefing & Content Generation

**Description:**
Génération quotidienne du briefing macro, tagline, et metadata contextuelles via Claude API en FR et EN, avec possibilité d'override manuel par Bryan.

**Functional Requirements:**
- FR-004, FR-005, FR-006, FR-016

**Story Count Estimate:** 4-5 stories

**Priority:** Must Have

**Business Value:**
Différenciateur principal : le contenu éditorial généré par IA avec un tone trader. L'override manuel donne à Bryan le contrôle final sur la qualité éditoriale.

---

### EPIC-003: Coulisses & Transparency

**Description:**
Page transparente montrant la mécanique du site : timeline de construction, prompts versionnés, logs API.

**Functional Requirements:**
- FR-007, FR-008, FR-009

**Story Count Estimate:** 3 stories

**Priority:** Must Have

**Business Value:**
C'est ce qui démontre la maîtrise IA de Bryan au-delà de la simple utilisation. Forte attractivité pour Sophie (dev fintech) et recruteurs tech. **L'intégralité de l'épic est critique** pour différencier YieldField des autres sites vitrines.

---

### EPIC-004: Internationalization & Legal

**Description:**
Bilingue FR/EN, disclaimer légal, switcher de langue, conformité.

**Functional Requirements:**
- FR-014, FR-015

**Story Count Estimate:** 2-3 stories

**Priority:** Must Have

**Business Value:**
Ouverture audience internationale + conformité légale (pas de risque juridique).

---

### EPIC-005: Analytics & Social Distribution

**Description:**
Analytics privacy-first pour mesurer la traction + Open Graph/Twitter Card dynamiques pour maximiser la viralité des partages.

**Functional Requirements:**
- FR-018, FR-019

**Story Count Estimate:** 2-3 stories

**Priority:** Must Have

**Business Value:**
Levier direct pour G1b (reconnaissance communautaire) : chaque partage LinkedIn/Twitter affiche un preview attractif avec le briefing du jour. Analytics indispensable pour objectiver la traction devant recruteurs.

---

## 5. Traceability Matrix

| Epic ID | Epic Name | FRs | Story Estimate | Priority |
|---------|-----------|-----|----------------|----------|
| EPIC-001 | Core Dashboard & Data Pipeline | FR-001, FR-002, FR-003, FR-010, FR-011, FR-012, FR-013, FR-017 | 7-9 | Must |
| EPIC-002 | AI Briefing & Content Generation | FR-004, FR-005, FR-006, FR-016 | 4-5 | Must |
| EPIC-003 | Coulisses & Transparency | FR-007, FR-008, FR-009 | 3 | Must |
| EPIC-004 | Internationalization & Legal | FR-014, FR-015 | 2-3 | Must |
| EPIC-005 | Analytics & Social Distribution | FR-018, FR-019 | 2-3 | Must |
| **Total** | **5 epics** | **19 FRs** | **18-23 stories** | |

---

## 6. Prioritization Summary

| Priority | FRs | NFRs | Total |
|----------|-----|------|-------|
| Must Have | 17 | 7 | 24 |
| Should Have | 1 | 2 | 3 |
| Could Have | 1 | 1 | 2 |
| **Total** | **19** | **10** | **29** |

**Observation :** Après consolidation avec Bryan, 17 FRs sur 19 sont en Must Have. Le projet est clairement un MVP solide avec peu de nice-to-have. Le volume total (18-23 stories) dépasse légèrement la fourchette Level 2 (5-15), ce qui positionne **YieldField à la frontière Level 2 / Level 3**. Timeline 4 semaines reste tenable grâce à Claude Code + BMAD.

---

## 7. Key User Flows

### Flow 1 — Analyste quotidien (Marc)
1. Marc arrive sur yieldview.io (homepage)
2. Voit les 6-8 KPIs animés + spread OAT-Bund
3. Lit le briefing macro 4-5 phrases (en FR)
4. Ferme l'onglet → total : 2 min

### Flow 2 — Recruteur (Thomas)
1. Thomas clique sur le lien du CV de Bryan → yieldview.io
2. Voit le site, comprend en 10s que c'est unique
3. Clique sur "Coulisses"
4. Explore la timeline, les prompts, l'architecture
5. Décision : contacter Bryan

### Flow 3 — Dev fintech (Sophie)
1. Sophie voit un post LinkedIn sur YieldField
2. Arrive sur le site → switch EN
3. Lit le briefing, trouve ça propre
4. Va direct en page Coulisses
5. Lit les prompts, regarde le repo GitHub
6. Star le repo, partage

---

## 8. Dependencies

### Internal Dependencies
- Aucune (projet green-field)

### External Dependencies
- **Claude API (Anthropic)** — Génération du contenu (criticité haute)
- **FRED API** — Données taux US (gratuit, stable)
- **BCE API** — Données taux EU (gratuit, stable)
- **Alpha Vantage API** — Indices actions (free tier 25 req/jour — contrainte forte)
- **Finnhub API** — Backup indices (free tier 60 req/min)
- **Cloudflare Pages** — Hébergement statique
- **Cloudflare R2** — Stockage JSON (remplace S3)
- **GitHub Actions** — Orchestration cron pipeline
- **Domaine .io** — Nom de domaine premium

---

## 9. Assumptions

- Les APIs gratuites FRED / BCE / Alpha Vantage / Finnhub restent disponibles pendant 12 mois
- GitHub Actions cron a un retard max de 60 minutes (acceptable si lancé à 6h UTC pour 8h30 CET)
- Claude API Haiku reste < 5€/mois pour 1 appel/jour (FR+EN)
- Bryan a ≥ 10h/semaine à dédier pendant 3-4 semaines
- La qualité du briefing IA s'améliore par itération de prompt (v01 → v06)
- next-intl gère bien le bilingue sans exploser le bundle
- Cloudflare free tier reste généreux (bandwidth illimité)

---

## 10. Open Questions — Résolutions

- **Q1 :** ~~Quel nom de domaine final ?~~ → **Issue GitHub #2 créée, assignée à Bryan** (yieldview.io / curvelab.io / ratepulse.io / yieldfield.io à arbitrer avant fin S1)
- **Q2 :** ~~Override manuel du briefing IA ?~~ → ✅ **Résolu** : intégré en FR-016 (Must Have)
- **Q3 :** ~~Module Alert V2 ?~~ → ✅ **Résolu** : intégré en MVP (FR-017 Must Have)
- **Q4 :** ~~Analytics MVP ou V2 ?~~ → ✅ **Résolu** : intégré en MVP (FR-018 Must Have)
- **Q5 :** ~~Open Graph dynamique ?~~ → ✅ **Résolu** : intégré en MVP (FR-019 Must Have)

**Questions Q6/Q7 — Résolues :**

- **Q6 :** ~~Seuil alert VIX ?~~ → ✅ **Résolu** : approche **percentile glissant 90/252j** (FR-017 mis à jour)
- **Q7 :** ~~NFR-003 uptime 99% Must/Should ?~~ → ✅ **Résolu** : passé en **Must Have**

**Aucune question ouverte restante** (hormis le nom de domaine en attente via Issue #2).

---

## 11. Stakeholders

- **Bryan** — Client / Développeur / Propriétaire — Influence **HIGH**
- **Emmanuel** — Architecte / PM / WEDOOALL Solutions — Influence **HIGH**
- **Recruteurs cibles (hedge funds, banques, fintechs)** — Audience primaire — Influence **MEDIUM**

---

## 12. Success Criteria (Definition of Done)

- ✅ Site live sur domaine .io avec HTTPS
- ✅ Pipeline nocturne success rate ≥ 95% sur 7 jours
- ✅ Briefing publié avant 8h30 CET (100% des jours ouvrés sur 1 semaine)
- ✅ Lighthouse Performance, Accessibility, Best Practices, SEO ≥ 90
- ✅ 6-8 KPIs affichés avec spread OAT-Bund
- ✅ Briefing mentionne ≥ 2 spreads ou indicateurs de volatilité
- ✅ Bilingue FR/EN sur 100% des pages
- ✅ Page Coulisses avec ≥ 5 étapes + évolution des prompts
- ✅ Fallback edge case testé et fonctionnel
- ✅ Disclaimer légal en footer
- ✅ 0 clé API détectée dans le code source
- ✅ README GitHub présentable
- ✅ Revue par un tiers (Emmanuel ou pair)

---

## Appendix — Links & References

- **Product Brief :** `docs/product-brief-yieldfield-2026-04-11.md`
- **PRD v1.0 (historique) :** `docs/PRD_BMAD_Site_Finance_Bryan_v1.0.docx`
- **PRD v1.1 (reco Bryan) :** `docs/PRD_BMAD_Site_Finance_Bryan_v1.1.docx`
- **Workflow Status :** `docs/bmm-workflow-status.yaml`
- **Repo GitHub :** https://github.com/BL-Capital/yieldview
- **Issue revue PRD :** BL-Capital/yieldview#1

---

*Document généré dans le cadre du workflow BMAD v6 — Phase 2 Planning*
*Product Manager : Claude (Opus 4.6) — Emmanuel (WEDOOALL Solutions)*
