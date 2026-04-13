# 7.5 — Guide Interviews Marc — Validation utilisateur

> **Bryan** — Ce guide te permet de recruter et conduire les 5 interviews "Marc" (persona analyste junior sell-side), analyser les retours et produire une synthèse actionnable.

---

## Contexte : Qui est "Marc" ?

Marc est le persona principal de YieldField (hypothèse à valider) :
- Analyste sell-side junior dans une banque française, ~2 ans d'expérience
- Doit comprendre l'état du marché en 2 minutes avant sa réunion de 8h30
- Sources professionnelles (Bloomberg, FT Pro) payantes à 25k€/an ou trop longues
- Sources gratuites (Morning Brew, Axios Markets) trop généralistes ou anglo-centrées
- Pain : perd ~45 min/jour à agréger manuellement les données macro
- Potentiellement intéressé par un outil qui lui économise du temps

---

## 1. Template message LinkedIn pour recruter les interviewés

### Version courte (InMail ou commentaire)

```
Bonjour [Prénom],

Je travaille sur YieldField, un outil de synthèse financière IA pour investisseurs
financières via IA, et je cherche 5 analystes juniors à interviewer pour valider la direction.

Profil que je cherche : analyste junior (sell-side, asset management, ou boutique M&A)
qui prépare son brief marché chaque matin.

20 min en visio, à votre convenance. Je partage les résultats avec vous.

Seriez-vous partant(e) ?

— Bryan
```

### Version longue (message direct LinkedIn)

```
Bonjour [Prénom],

Je me permets de vous contacter car votre profil correspond exactement à ce que je
cherche pour une série de 5 interviews utilisateurs.

Je développe YieldField (yieldfield.io) — un outil qui synthétise les données de
marché financières publiques via IA, en français, pour les investisseurs particuliers.
Le lancement est imminent et je veux m'assurer que le produit répond à de vrais besoins.

Ce que je vous demande :
- 20 minutes en visio (Google Meet ou Zoom, selon votre préférence)
- Pas de préparation requise — c'est une conversation, pas un test
- Je vous partage un accès anticipé au site en échange

Ce que vous gagnerez :
- Accès early adopter à YieldField avant le lancement public
- Un regard sur comment l'IA peut s'intégrer dans votre veille financière
- La satisfaction de contribuer à un outil que vous pourriez réellement utiliser

Seriez-vous disponible pour un échange de 30 min dans les 2 prochaines semaines ?
Je m'adapte à votre agenda.

Cordialement,
Bryan [NOM]
```

### Critères de sélection des interviewés

- [ ] Analyste junior sell-side, asset management ou boutique M&A (~1-4 ans exp)
- [ ] Prépare un brief/résumé marché chaque matin avant 8h30
- [ ] Basé en France (contexte marché européen)
- [ ] Mix banques/fonds si possible
- [ ] Pas de proches directs (éviter le biais de complaisance)

---

## 2. Script complet de l'interview (20 minutes)

### Introduction (5 min)

```
"Merci d'avoir accepté cet échange. Je développe YieldField, un outil d'analyse
financière IA pour les professionnels de la finance. Mon objectif aujourd'hui n'est pas
de vous vendre quoi que ce soit — je veux comprendre vos habitudes matinales et vos frustrations.

Quelques règles :
- Il n'y a pas de bonnes ou mauvaises réponses
- Je vais parfois rester silencieux — c'est intentionnel, prenez le temps
- Si une question vous semble hors sujet, dites-le
- J'enregistre uniquement pour mes notes (si ça ne vous dérange pas)

On commence ?"
```

---

### Question 1 — Routine et outils actuels (7 min)

**Question principale :**
> "Décrivez-moi votre routine typique quand vous suivez les marchés le matin. Qu'est-ce que vous faites, dans quel ordre, avec quels outils ?"

**Relances :**
- "Combien de temps ça vous prend en moyenne ?"
- "Quels sites ou applications ouvrez-vous en premier ?"
- "Est-ce que cette routine vous satisfait ? Pourquoi ?"
- "Qu'est-ce qui vous manque dans ces outils ?"
- "Est-ce que vous payez pour certains de ces services ?"

**Ce qu'on cherche :** Comprendre le workflow existant, identifier les frictions, valider (ou invalider) le besoin de synthèse.

---

### Question 2 — Rapport à l'information financière (6 min)

**Question principale :**
> "Quand vous lisez une analyse financière, qu'est-ce qui vous donne confiance ou au contraire vous fait douter de sa fiabilité ?"

**Relances :**
- "Est-ce que vous vérifiez les sources des informations que vous lisez ?"
- "Avez-vous déjà agi sur une information qui s'est avérée fausse ou biaisée ?"
- "Comment vous différenciez une analyse sérieuse d'une opinion déguisée ?"
- "L'IA dans l'analyse financière, ça vous inspire confiance ou méfiance ?"

**Ce qu'on cherche :** Valider l'importance de la transparence des sources dans YieldField.

---

### Question 3 — Découverte du produit (5 min — démo live)

**Avant la question :** Ouvrir `staging.yieldfield.io` et partager l'écran.

**Question principale :**
> "Je vais vous montrer YieldField. Ne me dites pas ce que vous en pensez, dites-moi ce que vous voyez. Pensez à voix haute."

**Relances après 2 min d'observation :**
- "Qu'est-ce que vous feriez en premier si vous arriviez ici seul ?"
- "Qu'est-ce que vous ne comprenez pas ?"
- "Est-ce que vous scrollez naturellement ?"
- "L'alerte VIX — vous la comprenez ? Elle vous serait utile ?"

**Ce qu'on cherche :** Tests d'utilisabilité implicites, identification des frictions UX.

---

### Question 4 — Valeur perçue et willingness to pay (5 min)

**Question principale :**
> "Si YieldField fonctionnait exactement comme vous l'espérez, quelle place ça prendrait dans votre routine ?"

**Relances :**
- "Est-ce que ça remplacerait un outil existant ou s'ajouterait à votre routine ?"
- "À quelle fréquence pensez-vous que vous l'utiliseriez ?"
- "Seriez-vous prêt à payer pour ça ? Si oui, quel serait un prix acceptable ?"
- "À qui en parleriez-vous en premier ?"

**Ce qu'on cherche :** Signal de rétention, validation du modèle freemium, NPS implicite.

---

### Question 5 — Question ouverte de clôture (2 min)

**Question principale :**
> "Si vous pouviez changer une seule chose à YieldField — ajouter, supprimer ou transformer quelque chose — ce serait quoi ?"

**Relances :**
- "Pourquoi cette chose en particulier ?"
- "Est-ce qu'il y a quelque chose que j'aurais dû vous demander et que je n'ai pas demandé ?"

**Clôture :**
```
"Merci beaucoup. Vos retours sont extrêmement précieux.
Je vous envoie un accès anticipé à YieldField dès le lancement.
Si d'autres questions vous viennent après, n'hésitez pas à me recontacter."
```

---

## 3. Template sondage X (post-launch)

```
📊 Sondage pour analystes financiers :

Combien de temps pour votre brief marché matinal ?

A) < 15 min
B) 15–30 min
C) 30–45 min
D) > 45 min

(Pour YieldField — résultats partagés 🙏)

#Finance #Analyste #Sondage
```

---

## 4. Grille de scoring — 5 interviews

| Critère | Interviewé 1 | Interviewé 2 | Interviewé 3 | Interviewé 4 | Interviewé 5 |
|---|---|---|---|---|---|
| **Nom / pseudo** | | | | | |
| **Date** | | | | | |
| **Profil** (âge, situation) | | | | | |
| **Outils actuels** | | | | | |
| **Temps veille/jour** | | | | | |
| **Confiance IA financière** (1–5) | | | | | |
| **Compréhension homepage** (1–5) | | | | | |
| **Utilité perçue** (1–5) | | | | | |
| **Willingness to pay** (O/N + montant) | | | | | |
| **Fréquence d'usage estimée** | | | | | |
| **Frictions UX citées** | | | | | |
| **Feature souhaitée #1** | | | | | |
| **Feature souhaitée #2** | | | | | |
| **NPS implicite** (recommanderait ? O/N) | | | | | |
| **Citation notable** | | | | | |

### Calcul du score global

**Score de validation = (Utilité perçue moyenne + Confiance IA moyenne) / 2**

| Score | Interprétation | Action |
|---|---|---|
| 4.5–5.0 | Forte validation — launch sans modification | Proceed |
| 3.5–4.4 | Validation partielle — ajustements mineurs | Patch + launch |
| 2.5–3.4 | Signal mitigé — revoir le messaging | Messaging sprint |
| < 2.5 | Problème fondamental — pivot ou pivot messaging | Stopper, analyser |

---

## 5. Template doc synthèse — docs/research/interviews-marc.md

> Ce fichier sera créé par Bryan après les 5 interviews. Voici le template.

```markdown
# Synthèse Interviews Marc — Validation utilisateur YieldField

**Période :** [DATE_DEBUT] — [DATE_FIN]
**Méthode :** 5 interviews semi-directifs, 30 min, visio
**Intervieweur :** Bryan [NOM]

---

## Résumé exécutif

[2–3 phrases sur le verdict global : le produit est-il validé ?]

**Score de validation global :** [X.X/5]
**Recommandation :** [Proceed / Patch + launch / Messaging sprint / Stopper]

---

## Profils des interviewés

| # | Prénom | Âge | Situation | Expérience investissement |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

## Findings par thème

### Thème 1 — Routine et outils actuels
[Synthèse des patterns observés]

**Citations représentatives :**
> "[citation interviewé X]"
> "[citation interviewé Y]"

### Thème 2 — Rapport à l'information et à l'IA
[Synthèse]

**Citations représentatives :**
> "[citation]"

### Thème 3 — Réaction à la démo YieldField
[Synthèse — frictions UX identifiées]

**Frictions les plus citées :**
1. [friction 1] — citée par X/5 interviewés
2. [friction 2] — citée par X/5 interviewés

### Thème 4 — Valeur perçue et usage envisagé
[Synthèse]

**Willingness to pay :**
- X/5 interviewés seraient prêts à payer
- Fourchette citée : [X]€ — [Y]€/mois

### Thème 5 — Features souhaitées
[Synthèse des demandes]

**Top 3 features demandées :**
1. [feature] — citée par X/5
2. [feature] — citée par X/5
3. [feature] — citée par X/5

---

## Recommandations actionnables

| Priorité | Action | Impact estimé |
|---|---|---|
| P0 | | |
| P1 | | |
| P2 | | |

---

## Grille de scoring complète

[Insérer le tableau de scoring depuis 7-5-guide-interviews-marc.md]

---

*Synthèse réalisée par Bryan [NOM] | Sprint 7 | YieldField | BMAD v6.3.0*
```

---

*Sprint 7 — Story 7.5 | YieldField | BMAD v6.3.0*
