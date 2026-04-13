# 7.2 — Template juriste AMF & checklist légale

> **Bryan** — Ce doc te donne tout le nécessaire pour trouver un juriste AMF, lui soumettre le projet YieldField, et obtenir un avis légal structuré. Budget cible : ≤ 500€ pour une consultation initiale.

---

## 1. Template email de prise de contact

> **Objet** : Consultation juridique — site d'information financière IA / conformité AMF

```
Bonjour [Nom du juriste / cabinet],

Je développe YieldField (yieldfield.io), un site vitrine d'information financière
utilisant l'intelligence artificielle pour synthétiser des données de marché publiques
et les présenter à destination d'investisseurs particuliers français.

Je cherche une consultation juridique ciblée (~2h) pour valider la conformité du projet
avant son lancement public, notamment sur les points suivants :

1. Qualification juridique du service : CIF (Conseiller en Investissements Financiers),
   PSAN, ou simple éditeur de contenu informatif non-personnalisé ?
2. Conformité des disclaimers AMF actuellement intégrés au site
3. Obligations RGPD spécifiques au secteur financier (collecte emails newsletter)
4. Risques à surveiller lors du lancement (formulations à éviter, mentions obligatoires)

Le projet est en phase finale de développement (MVP Next.js, pas encore de domaine
public actif). Je peux fournir :
- Les maquettes fonctionnelles (lien staging)
- Le PRD (document de spécifications produit)
- Les textes actuels des disclaimers et mentions légales
- L'architecture technique (pas de conseil personnalisé, données publiques uniquement)

Mon budget pour cette consultation initiale est de 300–500€.
Seriez-vous disponible pour un échange dans les 2 prochaines semaines ?

Cordialement,
Bryan [NOM]
[Email] | [Téléphone]
```

---

## 2. Liste des pièces à fournir au juriste

### Documents de référence du repo

| Fichier | Contenu | Priorité |
|---|---|---|
| `docs/planning-artifacts/product-brief-yieldfield.md` | Vision produit, périmètre, positionnement | P0 |
| `docs/planning-artifacts/prd.md` | Spécifications complètes (fonctionnel, non-fonctionnel) | P0 |
| `docs/planning-artifacts/ux-design-specification.md` | Parcours utilisateur, wireframes textuels | P1 |
| URL staging `staging.yieldfield.io` | Site fonctionnel à auditer visuellement | P0 |

### Documents à préparer spécifiquement

- [ ] **Captures d'écran** de toutes les mentions légales / disclaimers présents sur le site
- [ ] **Liste exhaustive des données affichées** (source, fréquence de mise à jour, API utilisées)
- [ ] **Modèle de l'email newsletter** (ce que reçoivent les inscrits)
- [ ] **Description technique de l'IA** : algorithme de synthèse, pas de personnalisation, données publiques uniquement
- [ ] **Extrait RGPD** : politique de confidentialité actuelle, données collectées, durée de rétention

---

## 3. Questions à poser au juriste

### Qualification juridique
1. Le service YieldField (synthèse IA de données de marché publiques, sans conseil personnalisé) est-il soumis au statut CIF ? Au cadre PSAN ?
2. Y a-t-il un seuil de fréquentation ou de monétisation au-delà duquel une qualification change ?
3. Une mention "ceci ne constitue pas un conseil en investissement" suffit-elle, ou faut-il des formulations plus précises selon l'AMF ?

### Contenu et disclaimers
4. Les disclaimers actuels sont-ils suffisants pour exonérer l'éditeur de toute responsabilité en cas de perte financière d'un utilisateur ?
5. Quelles mentions légales sont obligatoires en page d'accueil vs en pied de page ?
6. Y a-t-il des termes ou formulations à proscrire absolument dans les titres et descriptions des briefings IA ?

### Newsletter et RGPD
7. La collecte d'email pour newsletter financière nécessite-t-elle un consentement spécifique au-delà du RGPD standard ?
8. Faut-il un DPO (Data Protection Officer) à ce stade du projet ?

### Évolutions futures
9. Si Bryan ajoute une fonctionnalité d'alertes personnalisées basées sur le profil de risque, quelle qualification s'applique ?
10. Quel est le coût/délai pour obtenir un agrément CIF si nécessaire à terme ?

---

## 4. Critères de sélection du juriste

### Non-négociables
- [ ] Spécialisation droit financier / droit des marchés financiers (pas avocat généraliste)
- [ ] Connaissance de la réglementation AMF et MIF II
- [ ] Expérience avec des startups fintech ou sites d'information financière
- [ ] Peut fournir un avis écrit formel (pas seulement oral)

### Préférables
- [ ] Connaissance des enjeux IA (LLM, données d'entraînement)
- [ ] Expérience RGPD secteur financier
- [ ] Tarif horaire ou forfait consultation < 300€/h
- [ ] Délai de réponse < 2 semaines

### Red flags
- Avocat sans mention explicite "droit financier" ou "fintech" sur son profil
- Cabinet qui demande > 1 000€ pour une première consultation sans livrable écrit
- Juriste qui ne connaît pas l'AMF ou parle uniquement de droit des affaires généraux

### Où chercher

| Source | Méthode |
|---|---|
| Barreau de Paris | [annuaire.avocatparis.org](https://annuaire.avocatparis.org) → filtre "droit financier" |
| LinkedIn | Recherche "avocat fintech AMF Paris" |
| France FinTech | [francefintech.org](https://francefintech.org) — annuaire membres, certains proposent du conseil |
| Réseau perso | Demander à Emmanuel (WEDOOALL) s'il a des contacts directs |
| Doctrine.fr | Trouver des avocats spécialisés via leurs publications |

---

## 5. Budget de référence

| Prestation | Fourchette marché | Objectif Bryan |
|---|---|---|
| Consultation initiale 1h | 250–400€ HT | ≤ 300€ |
| Consultation + avis écrit 2h | 400–700€ HT | ≤ 500€ |
| Rédaction mentions légales complètes | 500–1500€ HT | Hors scope initial |
| Agrément CIF complet | 3000–8000€ HT | Hors scope V1 |

---

*Sprint 7 — Story 7.2 | YieldField | BMAD v6.3.0*
