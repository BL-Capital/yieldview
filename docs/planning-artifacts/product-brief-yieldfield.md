---
title: "Product Brief: YieldField"
status: "final-draft"
created: "2026-04-11"
updated: "2026-04-11"
author: "Emmanuel — WEDOOALL Solutions (facilitation by Mary, Business Analyst, BMAD v6.3.0)"
methodology: "BMAD v6.3.0 — Phase 1 Analysis — bmad-product-brief workflow"
inputs:
  - "docs/PRD_BMAD_Site_Finance_Bryan_v1.0.docx"
  - "docs/PRD_BMAD_Site_Finance_Bryan_v1.1.docx"
  - "Web research synthesis (competitive landscape, design trends, API reality check, editorial AI voice)"
  - "User decisions — Stage 3 (chartist persona, hybrid positioning, Finnhub-first APIs)"
  - "User decisions — Stage 4 review arbitrage (Marc as hypothesis, GTM plan in scope, newsletter in MVP, B2B trajectory, AMF mitigation, override reframed, 6+2 weeks timeline)"
stepsCompleted:
  - "Stage 1: Understand Intent"
  - "Stage 2: Contextual Discovery (Artifact Analyzer + Web Researcher)"
  - "Stage 3: Guided Elicitation (hybrid mode, 3 critical decisions captured)"
  - "Stage 4: Draft & Review (3 parallel reviewers: Skeptic, Opportunity, GTM/Launch Risk)"
  - "Stage 4: Review arbitrage (7 decisions captured)"
  - "Stage 5: Finalize"
---

# Product Brief: YieldField

## Résumé exécutif

**YieldField est un magazine éditorial quotidien de marchés financiers**. Chaque matin ouvré avant 8h30 CET, un pipeline automatisé publie un briefing macro propulsé par IA — rédigé dans la voix singulière du *Chartiste Lettré*, accompagné de 6 à 8 indicateurs clés (taux, spreads, volatilité, indices) et d'un avatar interactif Rive qui reflète le climat de marché du jour. Le site est bilingue FR/EN, hébergé gratuitement sur Cloudflare, et présenté dans une direction artistique "Financial Times × Apple × Monocle" : typographie Instrument Serif, fond charbon #0A1628, accents or #C9A84C.

C'est un **projet de design éditorial** qui se trouve à utiliser l'IA comme mécanique de production — jamais l'inverse. Le moteur technique (Claude API, pipeline nocturne, prompts versionnés) est exposé sans pudeur dans une page "Coulisses" qui devient, pour les visiteurs techniques, **aussi importante que la homepage elle-même** — et accessible directement depuis le hero, pas enterrée dans le menu.

Pourquoi maintenant ? Parce qu'en 2026, les APIs finance gratuites sont matures, Claude Haiku rend la génération bilingue économiquement viable à environ 5 €/mois, et surtout parce que **le marché du travail finance est saturé de « j'ai branché Claude sur des données »**. L'opportunité est ouverte pour un projet qui mise sur la qualité éditoriale, la rigueur typographique et la transparence radicale plutôt que sur la prouesse technique seule.

Ce brief a été construit via BMAD v6.3.0 avec trois reviewers adversariaux (Skeptic, Opportunity, Go-to-Market) dont les objections structurelles sont intégrées dans les sections qui suivent.

---

## Le problème

Deux problèmes imbriqués que le même artefact tente de résoudre, avec des niveaux de validation différents.

### Problème n°1 — Le candidat finance invisible (**validé**)

Bryan, 23 ans, passionné de marchés, cherche à décrocher son premier poste dans un hedge fund, une fintech ou une salle de marché. Son CV ressemble à celui de tous les autres juniors : diplôme, stages, mots-clés. Les recruteurs reçoivent 200 candidatures pour chaque offre et trient en 30 secondes. Un profil LinkedIn ne prouve rien. Une lettre de motivation ne démontre rien. Et en 2026, ajouter « maîtrise de l'IA » dans ses compétences est devenu une banalité qui ne convainc plus personne.

Ce problème est **directement vécu par le commanditaire** et validé par la littérature sur le marché du travail finance 2026 (cf. QuantInsti, Paragon Alpha). Le taux de conversion candidat-junior par CV classique est effondré, les recruteurs hedge funds valorisent explicitement les portfolio projects sur données réelles.

### Problème n°2 — Le briefing macro européen, quotidien, éditorial (**hypothèse à valider**)

Marc, analyste sell-side junior dans une banque française, doit comprendre l'état du marché en 2 minutes avant sa réunion de 8h30. Les sources professionnelles (Bloomberg Terminal, FT Pro, research houses) sont soit payantes à 25 k€/an, soit trop longues à lire. Les sources gratuites (Morning Brew, Axios Markets) sont trop généralistes ou anglo-centrées.

**⚠️ Statut : hypothèse non validée.** Nous n'avons pas parlé à un Marc réel. Il est possible que (a) Marc ait déjà un agrégateur Bloomberg payé par sa banque qu'il préfère, (b) Marc lise Les Échos ou L'Agefi et n'ait pas besoin d'un nouveau site, (c) l'angle mort « élégant, quotidien, macro-européen, téléchargé en 2 secondes » n'existe pas comme pain point vécu.

**Plan de validation (à exécuter en semaine 1–2, en parallèle du développement) :**
- **5 entretiens utilisateur** avec des analystes juniors FR identifiés via LinkedIn (20 minutes chacun, questions ouvertes : « Comment te tiens-tu informé le matin ? »)
- **1 sondage Twitter/X** diffusé par Emmanuel et Bryan dans leurs réseaux finance
- **Analyse qualitative** : si 3/5 analystes déclarent une frustration compatible avec la proposition YieldField, l'hypothèse est validée. Sinon, **Marc devient un persona secondaire et le brief recentre sur Thomas + Sophie + Clément**.

### Ce qui a changé récemment

Ce qui rend l'idée praticable en 2026 : (1) Claude API permet de générer un briefing bilingue de qualité pour moins de 0,20 €/jour en combinaison Opus (génération FR) + Haiku (traduction EN) ; (2) Cloudflare Pages + R2 + Workers rendent l'hébergement gratuit jusqu'à 100 000 visiteurs/mois ; (3) GitHub Actions cron est devenu fiable à ~95 % ; (4) les bibliothèques de composants premium (Aceternity UI Pro, Magic UI) et les animations vectorielles temps réel (Rive) permettent à un développeur solo d'obtenir un niveau visuel digne d'une agence de design.

### Le coût du statu quo

- Pour **Bryan** : rester dans la masse, attendre d'être chanceux, perdre plusieurs mois de fenêtre de recrutement.
- Pour **Thomas** (recruteur hedge fund) : continuer à trier 200 CV interchangeables et rater le bon candidat faute de signal fort.
- Pour **Sophie** (dev fintech) : continuer à chercher des exemples concrets de pipelines IA publiés dans le domaine finance — rares et souvent opaques.
- Pour **Marc** (si l'hypothèse est validée) : payer Bloomberg ou lire 40 minutes chaque matin.

---

## La solution

YieldField propose **une expérience en trois couches** qui se renforcent mutuellement.

### Couche 1 — Le briefing éditorial du matin (signé Le Chartiste Lettré)

Chaque jour ouvré, un bloc de 4 à 5 phrases signées par « Le Chartiste Lettré » — une voix narrative IA construite à partir de few-shot d'écriture de marché haut de gamme (Matt Levine, research sell-side, chroniqueurs FT) — raconte la journée à venir. Ton cultivé et ironique, mais ancré dans 3 à 5 chiffres précis par paragraphe. Le Chartiste Lettré est un analyste qui lit les courbes comme des vers, convoque l'histoire des taux quand c'est pertinent (« On avait déjà vu ce spread OAT-Bund en 1994 »), cite une référence culturelle oblique par semaine. Plus une persona est spécifique, plus elle paraît humaine — c'est la leçon de Levine appliquée à l'IA.

Métadonnées visibles en chips : thème du jour, niveau de certitude des données, événement clé attendu, niveau de risque pour les positions. Le ton bascule automatiquement en mode « marché sous tension » quand le VIX dépasse son 90ᵉ percentile sur 252 jours glissants.

**Pipeline de génération :** Claude Opus génère le briefing en français (finesse éditoriale), Claude Haiku le traduit en anglais (10× moins cher). Un human-in-the-loop léger permet à Bryan de valider optionnellement le briefing avant publication : si aucune validation en 15 minutes, publication automatique. L'override manuel reste exceptionnel et la version IA originale est archivée.

### Couche 2 — Le dashboard de marché

6 à 8 KPIs segmentés par thème (taux, spreads, indices, volatilité, macro), s'animant à l'arrivée sur la page via NumberTicker (Magic UI), chacun avec sa variation J/J et une icône Lottie directionnelle. Au centre du hero, **un avatar interactif Rive** qui change de posture selon le niveau de risque du jour : détendu à *low*, concentré à *medium*, tendu à *high*, en alerte en *crisis*. C'est la signature visuelle qui humanise la donnée brute et ancre la mémoire du visiteur.

**Sources de données principales (post API reality check 2026) :**
- **Finnhub** (primary, 60 req/min gratuit) : indices, VIX, temps réel
- **FRED** (Federal Reserve Economic Data, gratuit sans quota raisonnable) : macro EU/US, taux, séries historiques
- **Alpha Vantage** (marginal, 25 req/jour) : données spécifiques de complément uniquement
- **Fallback automatique** : si une API échoue, dernière valeur valide + timestamp « donnée > 12h »

### Couche 3 — Les Coulisses, seconde homepage

Une timeline verticale (Aceternity Tracing Beam) raconte la construction du site comme un making-of : méthodologie BMAD appliquée, diffs des prompts v01→v06, logs des 7 derniers runs du pipeline, architecture Cloudflare expliquée en schémas, preview interactive de l'avatar Rive avec ses états.

**Visibilité stratégique :** Pour Thomas (recruteur) et Sophie (dev fintech), cette page est la vraie preuve de sérieux. Elle doit être **accessible dès le hero** (CTA secondaire visible), pas enterrée dans le menu. Les Coulisses sont seconde en narration mais premières en valeur pour les deux personas à fort pouvoir de conversion (recrutement et amplification virale).

### Couche 4 — Newsletter email (NOUVEAU dans le MVP)

À partir du jour de lancement public, un formulaire discret en bas de page capture les emails des visiteurs intéressés. Chaque matin, le briefing est envoyé automatiquement aux abonnés via Buttondown (gratuit < 100 abonnés) ou équivalent. **Sans newsletter, la traction s'évapore à chaque visite.** Avec, chaque visiteur devient un asset durable. C'est le changement structurel le plus important apporté par le review Opportunity.

### Cadre légal & mitigation AMF

YieldField **ne délivre aucun conseil en investissement** et n'est pas une analyse financière au sens réglementaire AMF. Toutes les formulations du briefing sont **descriptives, pas prescriptives** : jamais « achetez/vendez », jamais « nous recommandons », jamais « il faut ». Les niveaux de risque affichés (low/medium/high/crisis) sont des descripteurs de volatilité de marché, pas des suggestions d'action.

**Mitigation en quatre niveaux :**
1. **Disclaimer renforcé** : visible en en-tête de chaque briefing (pas seulement en footer) et sur les OG images partagées
2. **Proscription de prompt** : liste explicite de formulations interdites dans le prompt système Claude (« recommandation », « conseil », « achetez », « vendez », etc.)
3. **Ton observationnel** : le Chartiste Lettré décrit ce qui est, pas ce qu'il faut faire
4. **Revue légale ciblée** : consultation juridique ponctuelle (~500 €) avant le go-live public pour valider la formulation du disclaimer et les cas-limites (mode crisis, niveaux de risque)

Le mode « crisis » affiche un signal de tension observée, jamais un appel à l'action. Exemple canonique : « VIX au-dessus de son 90ᵉ percentile 252 j. Positions à risque sous pression » — descriptif, pas directif.

---

## Ce qui rend YieldField différent

**Le positionnement éditorial d'abord, technique ensuite.** La plupart des projets IA junior de 2026 commencent leur pitch par « j'ai construit un pipeline Claude ». YieldField commence par « j'ai fait un magazine quotidien de marchés, venez lire ». L'IA est la mécanique ; le sujet est le marché ; le produit est l'expérience éditoriale. Cette inversion sémantique est le différenciateur principal sur le marché du travail finance post-AI-fatigue.

**Une voix narrative singulière.** Le Chartiste Lettré n'est pas un trader senior générique — c'est une persona précise, reproductible, défendable. Voix d'un analyste qui lit les courbes comme des vers, cite 3 chiffres et une référence culturelle par paragraphe, proscrit les tics de l'écriture IA générique. C'est la leçon de Matt Levine : une persona ultra-spécifique paraît toujours plus humaine qu'une persona générique.

**Transparence radicale.** La page Coulisses montre tout : prompts, diffs, logs API, architecture, pipeline. Dans un marché en 2026 fatigué des « boîtes noires IA », cette transparence devient une preuve de sérieux — et paradoxalement, une preuve que le créateur n'a rien à cacher parce que la valeur n'est pas dans l'algorithme, elle est dans l'exécution éditoriale.

**Une exécution visuelle irréprochable.** Le stack UI (Next.js 15 + React 19 + Motion 12 + Aceternity Pro + Magic UI + Rive + Lottie + Instrument Serif) permet à un développeur solo d'obtenir un rendu niveau agence. Les tendances design 2026 sont respectées sans effort.

**Économie radicale.** L'infrastructure totale coûte moins de 8 €/mois grâce à l'empilement de free tiers Cloudflare. Cette contrainte budgétaire est un ADN revendiqué, pas une concession.

### Le moat est fragile — et c'est assumé

Le Skeptic a raison : tout YieldField peut être cloné en un weekend. Le moat revendiqué — « la discipline éditoriale sur 60 jours » — dépend de la motivation personnelle des porteurs du projet et s'effondre au premier succès de recrutement de Bryan.

**Ce que nous faisons pour compenser :**
- **Dualité porteurs** : Emmanuel (WEDOOALL) est incentivé à tenir le projet même si Bryan signe ailleurs, parce que YieldField devient une vitrine BMAD/Claude Code pour son cabinet
- **Actifs invisibles** qui survivent au site : la liste email, le corpus de 180 briefings bilingues, la persona Chartiste Lettré (recombinables en Substack, podcast, white-label B2B — voir Vision à 12 mois)
- **Production automatisable à 90 %** : le pipeline étant automatisé, le coût marginal d'une publication supplémentaire est quasi nul, ce qui réduit le coût de la discipline

Le vrai moat n'est donc pas dans le code. Il est dans **la cohérence tenue dans la durée + les trois actifs cumulatifs (email + corpus + persona)**.

---

## Qui YieldField sert

### Personas primaires (pilotage G1a recrutement + G1b reconnaissance)

**Thomas — Talent acquisition hedge fund (35 ans).** Visite unique, 5 minutes max, décision rapide. Arrive via un lien dans le CV de Bryan ou via une candidature LinkedIn. Survole la home (10 secondes), clique sur Coulisses (CTA hero), lit un prompt, scrolle les logs, regarde le repo GitHub. **C'est le visiteur dont dépend le succès primaire G1a.** Il a vu 200 portfolios cette année et cherche un signal de sérieux. **La Coulisses doit convertir Thomas — sinon le projet n'atteint pas son objectif principal.**

**Sophie — Développeuse fintech (29 ans), startup.** Usage hebdomadaire, 15–20 minutes sur la page Coulisses. Vient chercher de l'inspiration technique : comment Bryan a structuré son pipeline, bilinguisation, convention de prompts, archi à 8 €/mois. **C'est l'utilisatrice qui valide la crédibilité technique et partage le site sur Twitter/X et LinkedIn — levier viral critique pour G1b.**

### Personas secondaires (amplification, cohérence narrative)

**Marc — Analyste sell-side (26 ans), banque française.** Usage quotidien hypothétique, 2–3 minutes. *Persona à valider en semaine 1–2 par interviews.* Si validé, c'est l'utilisateur qui confirme la fraîcheur et la qualité factuelle quotidienne. S'il n'est pas validé, Marc devient un « bonus » sans être l'objectif de rétention quotidienne du site.

**Clément — Étudiant école de commerce (22 ans).** Visite bi-mensuelle, curieuse. Arrive via un partage réseau social. Lit le briefing en FR, trouve le design beau, partage sur WhatsApp ou LinkedIn. Vecteur d'amplification communautaire pour G1b. Cible aussi potentiellement ses professeurs.

### Le non-utilisateur conscient

**L'investisseur individuel cherchant des conseils d'achat.** YieldField ne lui parle pas et ne lui parlera jamais. Le cadre légal est clair. Ce choix protège juridiquement le projet et clarifie le positionnement.

---

## Critères de succès

### Métriques d'exécution (Definition of Done technique)

- **Pipeline nocturne** : taux de succès ≥ 95 % sur 7 jours glissants
- **Fraîcheur éditoriale** : briefing publié avant 8h30 CET sur 100 % des jours ouvrés de la première semaine de production
- **Performance** : Lighthouse Performance, Accessibility, Best Practices, SEO tous ≥ 90
- **Bilinguisme** : 100 % des pages disponibles en FR et EN
- **Coût infrastructure** : ≤ 8 €/mois stabilisé (hors domaine)
- **Transparence Coulisses** : ≥ 5 étapes documentées + ≥ 3 versions de prompts diffées + 7 derniers runs de pipeline logués
- **Sécurité** : 0 clé API détectée dans le code source
- **Uptime** : 99 % sur 30 jours glissants (UptimeRobot + Cloudflare)
- **Newsletter** : formulaire opérationnel, envoi quotidien automatique ≥ 95 % success rate

### Signaux business (objectifs réels)

**Niveau 1 — G1a recrutement :**
- 3 entretiens qualifiés obtenus dans les 3 mois suivant le lancement public (hedge fund, banque, fintech)
- Taux de clic des recruteurs sur le lien YieldField depuis CV/LinkedIn : > 40 %
- Au moins 1 recruteur qui mentionne Coulisses spontanément en entretien

**Niveau 2 — G1b reconnaissance communautaire :**
- ≥ 100 étoiles GitHub dans les 30 jours post-lancement (ajusté de 200 → 100 : plus réaliste pour un repo d'un junior francophone sans réseau préexistant)
- ≥ 5 partages LinkedIn organiques par des personnes externes au cercle direct
- ≥ 1 mention dans une newsletter ou un thread tech/finance (Hacker News Show HN, Indie Hackers, dev.to)
- ≥ 50 abonnés newsletter dans les 30 premiers jours

**Niveau 3 — Engagement qualitatif :**
- Temps moyen sur la page Coulisses > 2 minutes
- Taux de retour hebdomadaire (proxy rétention) > 15 % après 14 jours — objectif volontairement modeste, ajusté par le Skeptic review
- Taux d'ouverture newsletter > 40 % (benchmark secteur niche pro)

### Validation de l'hypothèse Marc

Si après 2 semaines de fonctionnement, **aucun signal Marc** (retours quotidiens, commentaires analystes, sondages), l'hypothèse est abandonnée et Marc est déclassé en persona secondaire. Le brief est alors mis à jour et les efforts de rétention quotidienne sont refocalisés.

---

## Plan de distribution & Go-to-Market

Cette section répond au risque principal identifié par le GTM reviewer : **80 % des projets portfolio junior de qualité équivalente meurent en distribution, pas en exécution**. Owner de cette section : **Bryan** (c'est sa peau dans le jeu).

### Semaines −2 à 0 — Soft launch privé

- Publication quotidienne en « rehearsal » sur un sous-domaine non indexé (`staging.yieldfield.io`, `robots.txt disallow`)
- Objectif : **valider 10 briefings consécutifs** sans couac technique + archiver 10 cartes OG + constituer un corpus visible en live demo
- Bryan crée compte X `@yieldfield` + page LinkedIn dédiée
- Bryan publie 3 posts LinkedIn « building in public » (jours −10, −5, −1) : captures pipeline, diff de prompts, teasing de la date de lancement
- Consultation juridique AMF (≤ 500 €) pour validation des formulations

### Semaine 1 — Hard launch (lancement public)

**Jour J = mardi ou mercredi, 9h CET.** Lancement coordonné sur 5 surfaces simultanées :

1. **LinkedIn long-form** de Bryan : story personnelle + capture Coulisses + lien
2. **Thread X de 6 tweets** sur le stack et un diff de prompt, tagué @AnthropicAI @cloudflare @aceternitylabs @riveapp
3. **Show HN** titre neutre : « YieldField – editorial macro briefing generated nightly, 8€/month infra »
4. **Post Reddit** : r/FinancialCareers + r/FrenchInvest + r/nextjs (Showoff Saturday)
5. **Soumission Product Hunt** planifiée J+3 (mercredi-jeudi optimal)

Bryan répond à **chaque commentaire sous 1h pendant 48h**.

### Semaines 2 à 4 — Traction & outreach

- **Publication quotidienne sans faute** (discipline éditoriale démarre ici)
- **2 posts LinkedIn/semaine** : mardi « behind-the-scenes technique », vendredi « market takeaway de la semaine »
- **Cold outreach ciblé** : 15 DMs LinkedIn/semaine à des talent acquisition hedge fund FR/UK + 5 DMs à des newsletters finance FR (Snowball, Investir Tranquille, Café de la Bourse, La Martingale) proposant un swap de mention
- **Interviews utilisateurs Marc** en parallèle (5 analystes juniors, 20 min chacun) — validation de l'hypothèse Marc
- **Quick win** : sponsoring d'une newsletter finance FR micro (30–50 € one-shot) pour audience pré-qualifiée

### Semaines 4 à 12 — Consolidation & autorité

- **1 article long-form/mois** sur le blog Coulisses (SEO long-tail : « spread OAT-Bund matin », « VIX percentile quotidien », « pipeline Claude Cloudflare finance »)
- **1 intervention podcast** obtenue par outreach (Indie Hackers, La Martingale, podcasts tech FR)
- **Candidatures actives** de Bryan avec lien YieldField en signature et header de CV
- **A/B test du pitch-CV** avec et sans lien YieldField (mesurer le lift)
- **Mesure hebdomadaire** : visiteurs uniques, temps sur Coulisses, entretiens obtenus, abonnés newsletter

### Canaux d'acquisition par persona

| Persona | Canal principal | Canal secondaire | Approche |
|---|---|---|---|
| **Thomas** (recruteur) | Lien header CV + DM LinkedIn personnalisé | Cold outreach direct à 30 talent acquisitions | Push direct, pas d'espoir organique |
| **Sophie** (dev) | Show HN + Thread X #buildinpublic | dev.to, r/nextjs, r/webdev | Communautés tech, tags sur vendors (Aceternity, Rive, Cloudflare) |
| **Marc** (analyste) | Newsletter swap + SEO long-tail | LinkedIn posts seniors finance | Soft, à valider en priorité |
| **Clément** (étudiant) | TikTok/Instagram Reels 30s | Partenariat Junior-Entreprises écoles | Contenu format court, amplification virale |

### Traps à éviter (extraits du GTM review)

1. **« Je publie et ça se partagera »** — faux en 2026, reach organique d'un compte neuf < 2 %
2. **Show HN raté = brûler la cartouche** — à préparer 48h à l'avance, titre neutre, mardi 9h ET
3. **LinkedIn trop corporate** — Bryan doit écrire à la première personne, raconter des échecs de prompt, pas faire un communiqué
4. **Silence radio après J+7** — la courbe de traction d'un Show HN meurt en 72h sans rythme hebdo de contenu
5. **Attendre la perfection pour lancer** — un bon-assez publié bat un parfait non-publié

---

## Périmètre MVP

### Inclus dans le MVP (livraison en 6 semaines + 2 semaines de stabilisation)

**Homepage (Semaines 1–3) :**
- Hero avec Aurora background (Aceternity) + avatar Rive réactif
- Tagline gradient animé (Magic UI)
- Briefing IA avec Text Generate Effect + metadata chips
- Bento grid 6–8 KPIs avec NumberTicker, Lottie icons, Shimmer Glare cards
- Indicateur de fraîcheur (Pulsating Dot)
- Marquee scroll des KPIs secondaires
- Alert banner conditionnel (VIX percentile) avec 3 niveaux
- Footer avec disclaimer légal renforcé

**Page Coulisses (Semaines 3–4) :**
- Tracing Beam vertical (Aceternity)
- ≥ 5 étapes MDX documentées
- ≥ 3 prompts versionnés avec diff visuel
- Pipeline Logs Table (7 derniers runs)
- Preview interactive avatar Rive
- **CTA depuis le hero homepage** (visibilité directe, pas enterrée dans le nav)

**Pipeline & backend (Semaines 1–4 en parallèle) :**
- Pipeline nocturne complet : cron GitHub Actions 6h UTC, Finnhub primary + FRED + Alpha Vantage marginal
- Génération bilingue : Claude Opus (FR) → Claude Haiku (EN traduction)
- Human-in-the-loop léger : validation optionnelle par Bryan (15 min window), publication auto sinon
- Module Alert VIX percentile p90/252j avec 3 niveaux (warning/alert/crisis)
- Fallback gracieux toutes API + dernière valeur valide + timestamp
- Storage R2 (latest.json + archive/)
- Bootstrap script historique VIX 252 jours

**Internationalisation & légal (Semaines 2–4 en parallèle) :**
- Bilingue FR/EN complet (next-intl, /fr et /en, switcher)
- Disclaimer renforcé en header de chaque briefing
- Pages 404 + 500 éditoriales
- Revue légale ponctuelle (semaine 4–5)

**Distribution & capture (Semaine 4–5) :**
- **Newsletter email (NOUVEAU)** : formulaire Cloudflare Workers + Buttondown gratuit + envoi automatique post-publication
- Open Graph images dynamiques avec briefing du jour (@vercel/og)
- Twitter Cards `summary_large_image`
- Flux RSS (bonus, 1h de dev)
- Analytics privacy-first (Cloudflare Web Analytics, gratuit, sans cookie)

**Qualité & launch (Semaines 5–6 + stabilisation 7–8) :**
- Accessibilité WCAG 2.1 AA vérifiée (audits Axe + NVDA + zoom 200 %)
- Lighthouse ≥ 90 sur 4 catégories
- Tests end-to-end sur Playwright (happy path + edge cases)
- Hooks pre-commit de détection de secrets (déjà en place)
- Bootstrap domaine .io (après Issue GitHub #2 résolue)

### Explicitement exclus du MVP

- Authentification, comptes, backoffice web
- Yield curve 3D en fond (React Three Fiber reporté V2)
- Lexique financier interactif
- Archive historique publique navigable (stockée mais pas browsable)
- API publique (sauf `/today.json` read-only en bonus léger)
- Forum / commentaires
- Application mobile native
- Conseils d'investissement ou signaux de trading (interdit légalement)

### À envisager en V2 (après premiers retours recruteurs)

- Yield curve interactive animée 3D (React Three Fiber + Drei)
- Lexique bilingue 50–100 termes finance
- Archive navigable avec moteur de recherche + SEO indexation
- Podcast quotidien ElevenLabs 90 s (opportunité forte identifiée par le reviewer)
- White-label B2B (voir Vision 12 mois)

### Timeline révisée (6 + 2 semaines)

Le timeline initial de 4 semaines était optimiste. Sur recommandation du Skeptic reviewer, le MVP est scindé en deux phases :

- **Semaines 1–6 : Core MVP** — tout ce qui est listé dans « Inclus », scope tenable pour un solo-dev avec Claude Code
- **Semaines 7–8 : Stabilisation & polish** — Lighthouse, WCAG, tests, bugs, préparation lancement public
- **Semaines 9–10 : Soft launch** (cf. Plan de distribution)
- **Semaine 11 : Hard launch public**

**Scope de repli si S5 dérape :** couper le module Alert VIX (le plus complexe), couper le flux RSS, simplifier les metadata chips. Le core absolu tenable : Homepage + briefing IA + 4 KPIs + Coulisses light + bilingue + disclaimer + newsletter.

---

## Contraintes non négociables

- **Budget total ≤ 8 €/mois** hors domaine. C'est la contrainte mère qui impose toute l'architecture serverless.
- **Un seul développeur principal (Emmanuel assisté de Claude Code) + un Product Owner (Bryan)**. Pas de co-dev, pas de freelance, pas de designer.
- **APIs financières gratuites uniquement**. Jamais de Bloomberg, Refinitiv ou payant.
- **IA-first avec override exceptionnel** (contrainte reformulée) : pipeline automatique, human-in-the-loop optionnel de 15 minutes avant publication, fallback auto-publish. Bryan peut override en cas d'hallucination critique, mais ce n'est pas la routine.
- **Bilingue FR/EN dès le jour 1**. Contrainte d'audience, pas une option.
- **Aucun conseil d'investissement**. Contrainte légale absolue, disclaimer renforcé en header et footer, formulations descriptives, revue juridique au launch.
- **Performance LCP < 2 s / Lighthouse ≥ 90**. Non négociable pour un site qui se prétend premium.
- **Aucune clé API dans le dépôt Git**. Pre-commit hook + GitHub secret scanning obligatoires.
- **Newsletter email opérationnelle au lancement public** (nouveau — contrainte de distribution)
- **Timeline 6+2 semaines MVP**. 4 semaines était fiction optimiste.

---

## Vision à 12 mois

Si YieldField remplit sa mission dans les 3 premiers mois — 3 entretiens qualifiés et une petite notoriété technique — **trois trajectoires alternatives s'ouvrent**, non exclusives.

### Trajectoire A — Bryan embauché

Le site devient une preuve permanente sur son CV. Il est maintenu en fond, publie toujours chaque jour, sert de portfolio vivant pour sa carrière. Évolutions possibles : V2 yield curve 3D, lexique, podcast ElevenLabs. YieldField est un asset passif qui rapporte en visibilité. Emmanuel continue le projet en fond comme vitrine BMAD/Claude Code pour WEDOOALL Solutions.

### Trajectoire B — YieldField devient un produit grand public autonome

Si Bryan ne trouve pas d'embauche dans les 6 mois OU si le site prend une traction inattendue (> 10 k visiteurs/mois), il peut évoluer en newsletter premium (Substack ou Ghost), proposer une version pro avec sources payantes enrichies, ou bâtir une communauté Discord. Le Chartiste Lettré peut migrer vers une Substack weekly long-form en parallèle du briefing daily gratuit.

### Trajectoire C — White-label B2B « Morning Brief as a Service » (NOUVEAU)

Le pipeline entier (cron + Claude + APIs + template) est un **produit réutilisable revendable** à :
- **Conseillers en gestion de patrimoine** (CGPs) qui veulent un briefing marqué à leur logo pour leurs clients
- **Family offices** cherchant à enrichir leur offre de service
- **Fintechs early-stage** voulant un content marketing quotidien
- **Écoles de commerce** (outil pédagogique pour les cours de finance de marché)
- **Petits cabinets de conseil finance** sans les moyens d'un rédacteur permanent

**Modèle économique potentiel :** 200–500 €/mois par instance personnalisée (logo, couleurs, univers éditorial, sources spécifiques). Avec 10 clients, on atteint **~30 k€ ARR** avec un coût d'infrastructure marginal quasi-nul.

Le moat « discipline éditoriale » devient un moat « pipeline reproductible et fiable ». Les actifs invisibles du MVP (liste email, corpus 180 briefings, persona Chartiste Lettré, template bilingue) sont les fondations directes de cette trajectoire.

Cette trajectoire n'est **pas un objectif du MVP** mais une option à évaluer après 3 mois de fonctionnement. Si G1a (recrutement) aboutit rapidement, la trajectoire C peut devenir un projet parallèle d'Emmanuel / WEDOOALL. Si G1a tarde, elle devient une alternative de monétisation pour Bryan.

### Dans tous les cas

YieldField est un **projet à optionalité positive** : il coûte 8 €/mois, prend 6–8 semaines à construire, et ouvre au moins **trois chemins de valeur distincts** dont un contient un potentiel 30 k€ ARR. C'est l'antithèse d'un portfolio classique qui ne sert qu'une fois.

La question n'est pas « est-ce que ça vaut le coup ? ». La question est « pourquoi Bryan ne l'a pas fait il y a 6 mois ? ». La réponse est : parce qu'en 2026, tous les prérequis techniques sont devenus assez matures et assez bon marché pour rendre l'idée praticable par une seule personne en un mois et demi. C'est **un projet de son temps**, pas en avance ni en retard, et cette fenêtre n'est pas éternelle — un autre junior aura la même idée dans 6 mois, et le premier à tenir 60 jours de publication consécutive gagnera la catégorie.

---

## Annexe — Inputs & méthodologie de construction

**Sources principales :**
- **PRD v1.0** (WEDOOALL) — vision éditoriale, personas initiaux, 10 DoD
- **PRD v1.1** (recommandations Bryan) — 6–8 KPIs enrichis, tone trader, data sources élargies, edge cases, page Coulisses, DoD élargis
- **Web research 2026** via subagent Web Researcher — competitive landscape, design trends (Instrument Serif dans la fenêtre), API reality check (Alpha Vantage dégradé à 25 req/jour), editorial AI voice (role prompting + few-shot)

**Décisions utilisateur (Stage 3 — Guided Elicitation) :**
- Persona narrative = **Le Chartiste Lettré** (au lieu de « trader senior générique »)
- Positionnement = **hybride éditorial + tech** (home éditoriale, Coulisses technique)
- APIs = **Finnhub primary + FRED + Alpha Vantage marginal**

**Décisions utilisateur (Stage 4 — Review Arbitrage) :**
- Marc = hypothèse à valider en semaine 1–2 (plan de validation ajouté)
- Plan de distribution = section 8 du brief (owner Bryan)
- Newsletter = dans le MVP (nouvelle contrainte)
- Trajectoire C white-label B2B = ajoutée à la vision 12 mois
- Cadre légal AMF = paragraphe dédié avec mitigation 4 niveaux + revue juridique ≤ 500 €
- Contrainte IA reformulée = « IA-first avec override exceptionnel »
- Timeline = 6 semaines MVP + 2 semaines stabilisation (8 semaines au lieu de 4)

**Reviewers adversariaux (Stage 4 — subagents parallèles) :**
- **Skeptic Reviewer** : 3 findings CRITIQUE (pain Marc, conversion Thomas, moat discipline), 4 findings MAJEUR (timeline, légal, qualité IA, contradiction override)
- **Opportunity Reviewer** : 7 opportunités HIGH impact (newsletter, OG cards, permalinks, copy-to-Slack, /today.json, RSS, Hire Bryan CTA) + 4 HIGH effort (B2B white-label, podcast ElevenLabs, dataset HuggingFace, Chartiste Substack)
- **GTM Reviewer** : plan semaine -2 → semaine 12 complet + canaux par persona + quick wins < 50 € + 7 traps à éviter

**Stack technique validé (repris de l'Architecture v1.2 et maintenu) :**
- Next.js 15 + React 19 + TypeScript + Tailwind
- Motion 12 + Motion+ (animations)
- Aceternity UI Pro + Magic UI (composants premium)
- Rive (avatar hero réactif)
- Lottie / dotLottie (micro-animations, icons)
- Cloudflare Pages + R2 + Workers (hosting + storage + edge functions)
- Claude API (Opus pour génération FR, Haiku pour traduction EN)
- GitHub Actions (cron pipeline)
- React Three Fiber + Drei (reporté V2)

**Issue GitHub #2** en attente : choix du domaine — yieldview.io, curvelab.io, ratepulse.io, yieldfield.io à arbitrer par Bryan.

---

**Status final :** ce Product Brief est le livrable finalisé du workflow BMAD v6.3.0 `bmad-product-brief`, avec les 5 stages complétés (Intent → Discovery → Elicitation → Draft & Review → Finalize). Il est prêt à servir d'input aux workflows suivants : **bmad-create-prd** (Phase 2) puis **bmad-create-architecture** et **bmad-create-ux-design** (Phase 3).
