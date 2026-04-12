---
title: "UX Amendment 001 — Retrait de l'avatar, indicateurs de risque abstraits"
status: "validated"
validated_by: "Bryan (SupraPirox) — 2026-04-12"
decision: "Variante A (Pulse Ring) retenue. Variante C non nécessaire."
type: "ux-amendment"
created: "2026-04-12"
author: "Sally (UX Designer, BMAD v6.3.0)"
triggered_by: "Issue #4 — Feedback Bryan (SupraPirox)"
impacts:
  - "docs/planning-artifacts/ux-design-specification.md"
  - "docs/planning-artifacts/component-catalog.md"
  - "Stitch project: projects/9668374120836169449 (Hero screen)"
  - "Stories: 4.2 (avatar fallback SVG), 4.3 (Rive avatar asset)"
---

# UX Amendment 001 — Retrait de l'avatar, indicateurs de risque abstraits

## Contexte & Justification

Bryan (PO) a validé 6 des 7 maquettes Stitch mais a rejeté le concept d'avatar "Le Chartiste Lettré" :

> "L'idee d'une mascotte/personnage illustre ne correspond pas a la direction editoriale que je veux — c'est trop 'product' et pas assez 'magazine'."

**Analyse UX :** Bryan a raison. La direction artistique retenue (FT x Arc x Stripe Press) repose sur la **typographie et la donnee** comme vecteurs emotionnels, pas sur un personnage. Un avatar creait une dissonance entre le registre editorial magazine et le registre product/app. Les magazines premium utilisent des **elements graphiques abstraits** pour signifier l'urgence ou l'importance — jamais des mascottes.

---

## Decision

| Element | Avant | Apres |
|---------|-------|-------|
| Hero section | Avatar Rive 300x300 a gauche + briefing a droite | Indicateur de risque abstrait + briefing centre |
| Risk states | 4 poses d'avatar (neutre/attention/tension/relief) | 4 etats visuels abstraits (couleur/forme/intensite) |
| Mouse tracking | Avatar qui suit le curseur | Supprime |
| Click interaction | Clin d'oeil/hochement | Supprime |
| Tooltip editorial | "Aujourd'hui j'observe..." au hover avatar | Integre directement dans le briefing |
| Stories 4.2/4.3 | Rive avatar + SVG fallback | Indicateur abstrait CSS/SVG + Rive optionnel |
| Composant `<HeroAvatar>` | Wrapper Rive avec state machine | Renomme `<RiskIndicator>` — CSS/SVG pur |

---

## 3 Concepts alternatifs pour le Hero

### Concept A — "Pulse Ring" (Recommande)

**Description :** Un anneau concentrique au centre-haut du hero, entre la tagline et le briefing. L'anneau pulse doucement. Sa couleur et son intensite refletent le niveau de risque du jour.

**Rendu visuel par etat :**
- **Low (aucune alerte)** : anneau or `#C9A84C`, pulsation lente (3s), opacity 0.3-0.6, 1 cercle
- **Warning (VIX p80)** : anneau ambre `#F59E0B`, pulsation moyenne (2s), opacity 0.5-0.8, 2 cercles concentriques
- **Alert (VIX p90)** : anneau rouge `#DC2626`, pulsation rapide (1.2s), opacity 0.6-1.0, 3 cercles + glow
- **Crisis (VIX p99)** : anneau rouge profond `#991B1B`, pulsation intense (0.8s), opacity 0.8-1.0, 3 cercles + glow + shimmer

**Pourquoi ca marche :** Sobre, finance, abstrait. Rappelle les indicateurs de risque des terminaux Bloomberg (cercle de statut). Ne vole pas l'attention au briefing. Porte les 4 etats sans personnifier. Fonctionne en SVG pur (pas de Rive necessaire, performance maximale).

**Layout Hero :**
```
[Nav bar — logo a gauche, langue toggle a droite]

             [Pulse Ring — 120px, centre]
     
   "Les marches, chaque jour, avec une voix."
          [tagline gradient or, Newsreader italic]

   [Briefing Text Generate Effect — 4-5 lignes, Inter]
   [centré, max-width 680px]

   [Metadata chips: date + risk level + freshness]

        [CTA "Voir les Coulisses" — gold outlined]
```

---

### Concept B — "Horizon Line"

**Description :** Une ligne horizontale fine qui traverse tout le hero, a mi-hauteur. Elle ondule doucement comme un ECG financier. Son amplitude, sa couleur et sa frequence refletent le risque.

**Rendu visuel par etat :**
- **Low** : ligne or `#C9A84C`, ondulation lente quasi-plate, amplitude 4px
- **Warning** : ligne ambre `#F59E0B`, ondulation plus marquee, amplitude 8px
- **Alert** : ligne rouge `#DC2626`, ondulation nerveuse, amplitude 16px
- **Crisis** : ligne rouge `#991B1B`, oscillation rapide haute amplitude 24px + glow

**Pourquoi ca marche :** Metaphore financiere immediate (ECG du marche). Tres "magazine data-viz". Mais risque de rappeler un dashboard trading — exactement ce que Bryan ne veut pas. A utiliser avec precaution.

**Layout Hero :** Tagline au-dessus de la ligne, briefing en dessous. La ligne separe et connecte.

---

### Concept C — "Color Shift" (Minimaliste)

**Description :** Pas d'element graphique dedie. L'indicateur de risque est porte par l'ambiance chromatique du hero lui-meme. L'Aurora Background change de palette selon le risque.

**Rendu visuel par etat :**
- **Low** : Aurora charcoal-bleu profond `#0A1628` + reflets or doux (palette par defaut)
- **Warning** : Aurora s'enrichit de tons ambre chauds (gradient `#0A1628` → `#2D1F0A`)
- **Alert** : Aurora vire vers des tons rouges contenus (gradient `#0A1628` → `#1A0A0A` + lueur `#DC2626`)
- **Crisis** : Aurora rouge sombre dominant (gradient `#1A0505` → `#0A1628`), le gold accent devient blanc cassé pour le contraste

**Pourquoi ca marche :** Ultra-minimal. L'ambiance du site EST l'indicateur. Le visiteur sent le niveau de risque avant de le lire. C'est visceral, pas informatif. Tres coherent avec la philosophie "magazine editorial".

**Layout Hero :** Identique au concept A mais sans le Pulse Ring. La tagline + briefing + CTA sont le hero a eux seuls.

---

## Recommandation Sally

**Concept A (Pulse Ring) en primaire + Concept C (Color Shift) en complement.**

Le Pulse Ring donne un point focal visuel sans etre un personnage. Le Color Shift Aurora ajoute l'ambiance emotionnelle sans bruit visuel supplementaire. Les deux combinés creent un hero qui communique le risque à deux niveaux : **conscient** (anneau) et **inconscient** (couleur du fond).

Le Concept B (Horizon Line) est trop proche d'un dashboard — je le deconseille pour YieldField.

---

## Impact sur les stories existantes

| Story | Impact | Action |
|-------|--------|--------|
| **3.13** Hero section | MAJEUR — layout revu, avatar remplace par `<RiskIndicator>` | Mettre a jour la spec story |
| **4.2** Avatar fallback SVG | REMPLACE — devient `<RiskIndicator>` en SVG/CSS pur | Renommer/redefenir |
| **4.3** Rive avatar asset | OPTIONNEL — Rive peut animer le Pulse Ring mais n'est plus requis pour le MVP | Deprioriser ou adapter |
| **3.6** Alert banner | INCHANGEE — la banniere alerte reste independante du hero | Aucun |
| **2.1-2.7** Pipeline | AUCUN IMPACT — les schemas AlertState restent identiques | Aucun |

---

## Impact sur le code Sprint 2a

**Zero impact.** Le pipeline (fetch-data, compute-alert, bootstrap-vix) produit des AlertState avec `{ active, level, vix_current, vix_p90_252d, triggered_at }`. Ces donnees sont consommees par le frontend pour piloter l'indicateur visuel — qu'il soit avatar ou Pulse Ring. Le contrat de donnees est identique.

---

## Prompts Stitch a executer

### Prompt 1 — Hero Variante A (Pulse Ring)

```
Redesign the YieldField Hero Section. Remove the character/avatar completely.

Replace it with an abstract "Pulse Ring" risk indicator: a single concentric circle (120px) centered above the tagline. The ring is gold #C9A84C with a subtle glow, representing a "low risk" calm state.

Layout (top to bottom, all centered):
1. Navigation bar: "YieldField" logo left, "FR | EN" toggle right
2. Pulse Ring: 120px gold circle with soft glow, centered
3. Tagline: "Les marches, chaque jour, avec une voix." in Newsreader italic, gold gradient text
4. Briefing text: 4-5 lines of financial commentary in Inter, light gray #F4F4F5, max-width 680px
5. Metadata row: date chip + "Marche calme" status chip in gold
6. CTA button: "Voir les Coulisses" — outlined gold border, Inter semibold

Background: deep dark #0A1628 with subtle Aurora gradient (charcoal blue tones).
No illustrations, no characters, no icons beyond the pulse ring.
Typography-driven, magazine editorial feel. Think Financial Times meets Stripe Press.
```

### Prompt 2 — Hero Variante A-Crisis (Pulse Ring en mode crise)

```
Same layout as the Pulse Ring hero, but in CRISIS MODE (VIX p99).

Changes from the calm version:
- Pulse Ring: now 3 concentric circles in deep red #991B1B with intense red glow
- Background Aurora shifts to dark red tones (gradient from #1A0505 to #0A1628)
- Tagline stays gold but the surrounding atmosphere is ominous
- Briefing text references market stress (use placeholder financial text)
- Metadata row: "ALERTE CRITIQUE" chip in red #991B1B with white text
- Overall feeling: dramatic but contained — Financial Times during a crisis, not a panic screen

Keep the same clean typography-driven layout. The drama comes from color and glow, not from added elements.
```

### Prompt 3 — Hero Variante C (Color Shift minimaliste, sans Pulse Ring)

```
Redesign the YieldField Hero Section with absolute minimalism. No avatar, no ring, no graphic element.

The hero is PURE TYPOGRAPHY + AURORA BACKGROUND.

Layout (centered, generous vertical spacing):
1. Navigation bar: "YieldField" logo left, "FR | EN" toggle right
2. Large tagline: "Les marches, chaque jour, avec une voix." in Newsreader italic, large display size, gold gradient #C9A84C
3. Generous whitespace (48px)
4. Briefing text: 4-5 lines in Inter 1.25rem, #F4F4F5, max-width 640px, centered
5. Metadata row: small date + risk level in muted gray #94A3B8
6. CTA: "Voir les Coulisses" — understated gold text link with arrow, not a button

Background: Aurora gradient in deep charcoal-blue tones (#0A1628 base).
The risk level is conveyed ONLY by the Aurora color warmth — this is the calm/low state with cool blue tones.

No icons, no badges, no decorative elements. Let the words breathe.
This should feel like opening a premium print magazine to its editorial page.
```

---

## Prochaines etapes

1. Generer les 3 variantes Stitch (quand MCP disponible)
2. Poster les screenshots sur l'issue #4 pour validation Bryan
3. Si Bryan valide un concept : mettre a jour la spec UX principale + les stories impactees
4. Si Bryan demande un mix : iterer selon son feedback
