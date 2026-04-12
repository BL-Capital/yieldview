# Story 2.9 : Prompt systeme v01 (Le Chartiste Lettre)

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2b (semaine 3)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Opus 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un prompt systeme et un builder de prompt utilisateur dans `scripts/pipeline/prompts/` qui definissent la persona "Le Chartiste Lettre", injectent les KPIs du jour et l'etat d'alerte, et instruisent Claude a produire un JSON conforme a `AnalysisSchema`,
**so that** le script `generate-ai.ts` (Story 2.10) peut appeler Claude Opus avec un prompt complet et obtenir un briefing editorial FR de qualite magazine, puis le faire traduire en EN par Claude Haiku.

**Business value :** Ce prompt est le coeur editorial de YieldField. C'est lui qui determine si le visiteur (Thomas, Marc) percoit "une voix, pas un generateur". Sans prompt calibre, le pipeline produit du contenu IA generique — ce qui tue la proposition de valeur unique du projet. La persona du Chartiste Lettre, la liste de proscription, le cadre AMF et les few-shot sont les barrieres defensives du produit.

---

## Acceptance Criteria

**AC1 — Fichier `scripts/pipeline/prompts/system-chartiste-lettre.md`**

- [ ] Fichier markdown cree dans `scripts/pipeline/prompts/`
- [ ] Contient le system prompt complet pour Claude Opus
- [ ] Role prompting : "Tu es Le Chartiste Lettre, un analyste de marches avec une sensibilite litteraire, 15 ans d'experience sur un desk taux..."
- [ ] Ton defini : magazine editorial, voix personnelle, references culturelles autorisees, jamais de conseil d'achat/vente
- [ ] Anchoring numerique : obligation de citer >= 3 chiffres precis par paragraphe du briefing
- [ ] Variabilite controlee : instruction de varier la structure d'ouverture jour apres jour
- [ ] Liste de proscription explicite (mots/expressions interdits) :
  - "in conclusion", "it's worth noting", "navigating", "leverage" (sens non financier), "unlock", em-dashes en serie, emojis, "il faut", "nous recommandons", "achetez", "vendez"
- [ ] 2-3 exemples few-shot de style (paragraphes illustrant le ton Matt Levine-esque adapte au FR)
- [ ] Instructions de format JSON : le modele doit produire un objet JSON avec les champs `briefing.fr`, `tagline.fr`, `metadata` (theme_of_day.fr, certainty, upcoming_event.fr, risk_level)
- [ ] Disclaimer AMF integre dans les instructions : "Ce contenu est editorial et informatif. Il ne constitue pas un conseil en investissement."
- [ ] Instruction explicite : formulations descriptives uniquement, jamais prescriptives
- [ ] Calibration du ton selon `alert.level` :
  - `null` (pas d'alerte) : ton detendu, ironique, references culturelles possibles
  - `warning` : ton attentif, precision accrue, mention du VIX
  - `alert` : ton serieux, factuel, pas de jokes
  - `crisis` : ton grave mais calme, jamais alarmiste, rappel du disclaimer

**AC2 — Fichier `scripts/pipeline/prompts/user-briefing.ts`**

- [ ] Fichier TypeScript cree dans `scripts/pipeline/prompts/`
- [ ] Exporte la fonction `buildUserPrompt(kpis: Kpi[], alert: AlertState): string`
- [ ] Importe les types depuis `../../../src/lib/schemas/kpi.js` et `../../../src/lib/schemas/alert.js`
- [ ] Le prompt utilisateur injecte :
  - Date du jour (format `YYYY-MM-DD` + jour de la semaine en francais)
  - Les 11 KPIs avec pour chacun : `id`, `label.fr`, `value`, `unit`, `change_day`, `change_pct`, `direction`
  - L'etat d'alerte complet : `active`, `level`, `vix_current`, `vix_p90_252d`
  - L'analyse du spread OAT-Bund et Bund-US (identifies par `id` dans les KPIs)
- [ ] Le prompt rappelle le format de sortie JSON attendu (champs `briefing.fr`, `tagline.fr`, `metadata`)
- [ ] Le prompt est en francais (Claude Opus recoit le prompt FR et produit le briefing FR)
- [ ] Pas d'appel API dans ce fichier — construction de string uniquement

**AC3 — Conformite avec `AnalysisSchema`**

- [ ] Les instructions JSON dans le system prompt et le user prompt referencent exactement les champs de `AnalysisSchema` :
  - `briefing: { fr: string }` (4-5 phrases)
  - `tagline: { fr: string }` (1 phrase, max 80 caracteres)
  - `metadata.theme_of_day: { fr: string }` (1-3 mots, le theme dominant)
  - `metadata.certainty: 'preliminary' | 'definitive'`
  - `metadata.upcoming_event: { fr: string } | null` (evenement cle attendu)
  - `metadata.risk_level: 'low' | 'medium' | 'high' | 'crisis'`
- [ ] Le prompt precise que Claude ne doit PAS remplir les champs techniques (`date`, `generated_at`, `kpis`, `alert`, `pipeline_run_id`, `version`) — le pipeline s'en charge
- [ ] Le prompt demande un JSON valide, sans commentaires, sans markdown fences

**AC4 — Tests Vitest**

- [ ] `scripts/pipeline/prompts/__tests__/user-briefing.test.ts` cree
- [ ] Test : `buildUserPrompt()` retourne une string non vide
- [ ] Test : le prompt contient la date du jour
- [ ] Test : le prompt contient les 11 KPIs avec leurs valeurs
- [ ] Test : le prompt contient le niveau d'alerte quand `alert.active === true`
- [ ] Test : le prompt contient "aucune alerte" ou equivalent quand `alert.active === false`
- [ ] Test : le prompt contient les spreads (OAT-Bund, Bund-US)
- [ ] Test : le prompt NE contient PAS de mots de la liste de proscription
- [ ] Aucun appel API mocke necessaire — tests de construction de string uniquement
- [ ] `pnpm test` passe sans erreurs

**AC5 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.9): add system prompt v01 + user prompt builder for Le Chartiste Lettre`

---

## Tasks / Subtasks

- [ ] **Task 1** — Creer `scripts/pipeline/prompts/system-chartiste-lettre.md` (AC1)
  - [ ] Section role prompting (persona Le Chartiste Lettre)
  - [ ] Section ton et style (magazine editorial, Matt Levine-esque FR)
  - [ ] Section proscription (liste exhaustive de mots/expressions interdits)
  - [ ] Section few-shot (2-3 exemples de paragraphes dans le ton)
  - [ ] Section format JSON (champs exacts attendus en sortie)
  - [ ] Section calibration ton/alerte (4 niveaux : null, warning, alert, crisis)
  - [ ] Section cadre legal AMF (disclaimer + interdiction prescriptive)

- [ ] **Task 2** — Creer `scripts/pipeline/prompts/user-briefing.ts` (AC2)
  - [ ] Import types `Kpi` et `AlertState`
  - [ ] Fonction helper `frenchDayOfWeek(date: Date): string`
  - [ ] Fonction helper `formatKpiForPrompt(kpi: Kpi): string`
  - [ ] Fonction helper `formatSpreadAnalysis(kpis: Kpi[]): string`
  - [ ] Fonction principale exportee `buildUserPrompt(kpis: Kpi[], alert: AlertState): string`
  - [ ] Template literal structurant la date, les KPIs, l'alerte, les spreads, et le format attendu

- [ ] **Task 3** — Creer les tests Vitest (AC4)
  - [ ] `scripts/pipeline/prompts/__tests__/user-briefing.test.ts`
  - [ ] Fixtures : tableau de 11 KPIs mock + AlertState mock (active et inactive)
  - [ ] Tests unitaires : presence des champs, absence de mots proscrits
  - [ ] `pnpm test` OK

- [ ] **Task 4** — Git commit

- [ ] **Task 5** — Update story -> status review

---

## Dev Notes

### Architecture de fichiers

```
scripts/
  pipeline/
    prompts/                           <-- NEW (ce repertoire)
      system-chartiste-lettre.md       <-- NEW (Task 1)
      user-briefing.ts                 <-- NEW (Task 2)
      __tests__/
        user-briefing.test.ts          <-- NEW (Task 3)
    fetch-data.ts                      <-- existant (Story 2.5)
    compute-alert.ts                   <-- existant (Story 2.7)
    generate-ai.ts                     <-- Story 2.10 (consommateur)
src/
  lib/
    schemas/
      analysis.ts                      <-- existant (Story 2.1) - AnalysisSchema
      kpi.ts                           <-- existant (Story 2.1) - KpiSchema, type Kpi
      alert.ts                         <-- existant (Story 2.1) - AlertStateSchema, type AlertState
    claude.ts                          <-- Story 2.8 (Claude API client, consommateur)
```

**Note :** L'architecture document (Section 4.5) place les prompts dans `prompts/` a la racine du projet. Cette story les place dans `scripts/pipeline/prompts/` conformement a la directive utilisateur. Le repertoire `prompts/` racine reste reserve pour des versions futures ou la page Coulisses.

### Relation avec les consumers

Ce prompt sera consomme par :
1. **Story 2.8** (`src/lib/claude.ts`) — `generateBriefingFR()` envoie le system prompt + user prompt a Claude Opus
2. **Story 2.10** (`scripts/pipeline/generate-ai.ts`) — orchestre la sequence : build prompt -> Claude Opus FR -> validation Zod -> Claude Haiku EN

Le system prompt est lu comme fichier markdown a runtime par `generate-ai.ts`. Le user prompt est construit dynamiquement par `buildUserPrompt()`.

### Les 11 KPIs disponibles (source: `fetch-data.ts`)

Le builder `buildUserPrompt()` recoit un tableau de `Kpi[]` avec ces 11 items :

| id | label.fr | category | unit | source |
|----|----------|----------|------|--------|
| `vix` | VIX (Volatilite) | volatility | points | finnhub |
| `dxy` | Dollar Index (DXY) | macro | points | finnhub |
| `cac40` | CAC 40 | indices | points | finnhub |
| `sp500` | S&P 500 | indices | points | finnhub |
| `nasdaq` | Nasdaq | indices | points | finnhub |
| `dax` | DAX | indices | points | finnhub |
| `oat_10y` | OAT 10 ans (France) | rates | % | fred |
| `bund_10y` | Bund 10 ans (Allemagne) | rates | % | fred |
| `us_10y` | US 10Y Treasury | rates | % | fred |
| `spread_oat_bund` | Spread OAT-Bund | spreads | bps | calculated |
| `spread_bund_us` | Spread Bund-US | spreads | bps | calculated |

### Schema de sortie JSON attendu de Claude

Le system prompt doit instruire Claude de produire exactement ce JSON (sous-ensemble editorial de `AnalysisSchema`) :

```json
{
  "briefing": {
    "fr": "4-5 phrases. Ton Chartiste Lettre. >= 3 chiffres par paragraphe."
  },
  "tagline": {
    "fr": "Max 80 caracteres. Accroche magazine."
  },
  "metadata": {
    "theme_of_day": { "fr": "1-3 mots" },
    "certainty": "preliminary | definitive",
    "upcoming_event": { "fr": "..." } | null,
    "risk_level": "low | medium | high | crisis"
  }
}
```

Les champs `briefing.en`, `tagline.en`, `metadata.theme_of_day.en`, `metadata.upcoming_event.en` seront remplis par Claude Haiku (traduction EN) dans Story 2.10.

### Pattern `buildUserPrompt` (guide d'implementation)

```typescript
import type { Kpi } from '../../../src/lib/schemas/kpi.js';
import type { AlertState } from '../../../src/lib/schemas/alert.js';

const FRENCH_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const;

function frenchDayOfWeek(date: Date): string {
  return FRENCH_DAYS[date.getDay()]!;
}

function formatKpiForPrompt(kpi: Kpi): string {
  const arrow = kpi.direction === 'up' ? '+' : kpi.direction === 'down' ? '-' : '=';
  return `- ${kpi.label.fr} : ${kpi.value} ${kpi.unit} (${arrow}${Math.abs(kpi.change_day).toFixed(2)} ${kpi.unit}, ${kpi.change_pct > 0 ? '+' : ''}${kpi.change_pct.toFixed(2)}%)`;
}

function formatSpreadAnalysis(kpis: Kpi[]): string {
  const oatBund = kpis.find((k) => k.id === 'spread_oat_bund');
  const bundUs = kpis.find((k) => k.id === 'spread_bund_us');
  const lines: string[] = [];
  if (oatBund) {
    lines.push(`Spread OAT-Bund : ${oatBund.value} bps (${oatBund.direction}, variation jour : ${oatBund.change_day > 0 ? '+' : ''}${oatBund.change_day.toFixed(1)} bps)`);
  }
  if (bundUs) {
    lines.push(`Spread Bund-US : ${bundUs.value} bps (${bundUs.direction}, variation jour : ${bundUs.change_day > 0 ? '+' : ''}${bundUs.change_day.toFixed(1)} bps)`);
  }
  return lines.join('\n');
}

export function buildUserPrompt(kpis: Kpi[], alert: AlertState): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const dayName = frenchDayOfWeek(now);

  const kpiBlock = kpis.map(formatKpiForPrompt).join('\n');
  const spreadBlock = formatSpreadAnalysis(kpis);

  const alertBlock = alert.active
    ? `ALERTE ACTIVE — Niveau : ${alert.level!.toUpperCase()}
VIX actuel : ${alert.vix_current} | Seuil P90 (252j) : ${alert.vix_p90_252d}
Declenchee a : ${alert.triggered_at}`
    : `Aucune alerte active. VIX actuel : ${alert.vix_current} (sous le seuil P90 de ${alert.vix_p90_252d}).`;

  return `## Briefing du ${dayName} ${dateStr}

### Donnees de marche du jour

${kpiBlock}

### Analyse des spreads

${spreadBlock}

### Etat d'alerte VIX

${alertBlock}

### Instructions de sortie

Produis un JSON valide (sans commentaires, sans markdown fences) avec cette structure exacte :

{
  "briefing": { "fr": "4-5 phrases, ton Chartiste Lettre, >= 3 chiffres precis par paragraphe" },
  "tagline": { "fr": "Max 80 caracteres, accroche magazine du jour" },
  "metadata": {
    "theme_of_day": { "fr": "1-3 mots, le theme dominant" },
    "certainty": "preliminary ou definitive",
    "upcoming_event": { "fr": "evenement cle attendu" } ou null,
    "risk_level": "low | medium | high | crisis"
  }
}

Rappel : formulations descriptives uniquement. Ce contenu est editorial et informatif. Il ne constitue pas un conseil en investissement.`;
}
```

### Pattern tests Vitest

```typescript
import { describe, it, expect } from 'vitest';
import { buildUserPrompt } from '../user-briefing';
import type { Kpi } from '../../../../src/lib/schemas/kpi';
import type { AlertState } from '../../../../src/lib/schemas/alert';

// Fixtures — 11 KPIs mock
const MOCK_KPIS: Kpi[] = [
  { id: 'vix', category: 'volatility', label: { fr: 'VIX (Volatilite)', en: 'VIX (Volatility)' }, value: 18.5, unit: 'points', change_day: -0.3, change_pct: -1.6, direction: 'down', source: 'finnhub', timestamp: '2026-04-12T06:00:00Z', freshness_level: 'live' },
  { id: 'dxy', category: 'macro', label: { fr: 'Dollar Index (DXY)', en: 'Dollar Index (DXY)' }, value: 104.2, unit: 'points', change_day: 0.15, change_pct: 0.14, direction: 'up', source: 'finnhub', timestamp: '2026-04-12T06:00:00Z', freshness_level: 'live' },
  // ... 9 autres KPIs (cac40, sp500, nasdaq, dax, oat_10y, bund_10y, us_10y, spread_oat_bund, spread_bund_us)
  { id: 'spread_oat_bund', category: 'spreads', label: { fr: 'Spread OAT-Bund', en: 'Spread OAT-Bund' }, value: 52.3, unit: 'bps', change_day: 1.2, change_pct: 2.35, direction: 'up', source: 'calculated', timestamp: '2026-04-12T06:00:00Z', freshness_level: 'live' },
  { id: 'spread_bund_us', category: 'spreads', label: { fr: 'Spread Bund-US', en: 'Spread Bund-US' }, value: -185.0, unit: 'bps', change_day: -3.1, change_pct: -1.7, direction: 'down', source: 'calculated', timestamp: '2026-04-12T06:00:00Z', freshness_level: 'live' },
];

const MOCK_ALERT_ACTIVE: AlertState = {
  active: true, level: 'warning', vix_current: 28.5, vix_p90_252d: 25.0, triggered_at: '2026-04-12T06:00:00Z',
};

const MOCK_ALERT_INACTIVE: AlertState = {
  active: false, level: null, vix_current: 18.5, vix_p90_252d: 25.0, triggered_at: null,
};

// Mots proscrits du system prompt
const PROSCRIBED = ['in conclusion', "it's worth noting", 'navigating', 'unlock', 'il faut', 'nous recommandons', 'achetez', 'vendez'];

describe('buildUserPrompt', () => {
  it('returns a non-empty string', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('contains the current date', () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain(today);
  });

  it('contains all KPI labels', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    for (const kpi of MOCK_KPIS) {
      expect(result).toContain(kpi.label.fr);
    }
  });

  it('contains alert level when active', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_ACTIVE);
    expect(result).toContain('ALERTE ACTIVE');
    expect(result).toContain('WARNING');
  });

  it('contains "aucune alerte" when inactive', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result.toLowerCase()).toContain('aucune alerte');
  });

  it('contains spread analysis', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    expect(result).toContain('Spread OAT-Bund');
    expect(result).toContain('Spread Bund-US');
  });

  it('does not contain proscribed words', () => {
    const result = buildUserPrompt(MOCK_KPIS, MOCK_ALERT_INACTIVE);
    const lower = result.toLowerCase();
    for (const word of PROSCRIBED) {
      expect(lower).not.toContain(word.toLowerCase());
    }
  });
});
```

### Contenu du system prompt (guide exhaustif pour Task 1)

Le fichier `system-chartiste-lettre.md` doit contenir ces sections dans cet ordre :

1. **Identite** — "Tu es Le Chartiste Lettre. Analyste de marches, 15 ans d'experience desk taux. Sensibilite litteraire : tu ecris comme un chroniqueur de magazine financier, pas comme un rapport automatise."
2. **Ton** — "Magazine editorial, voix personnelle, references culturelles autorisees, jamais de conseil d'achat/vente. Tu observes, tu decris, tu commentes avec ironie. Tu ne recommandes jamais."
3. **Anchoring** — "Chaque paragraphe du briefing doit ancrer au moins 3 chiffres precis issus des donnees de marche fournies. Pas de generalites."
4. **Variabilite** — "Varie ta structure d'ouverture jour apres jour. Evite le schema repetitif Intro/Corps/Conclusion."
5. **Proscription** — Liste exhaustive des mots/expressions interdits
6. **Few-shot** — 2-3 exemples de paragraphes dans le ton attendu
7. **Format JSON** — Structure exacte du JSON de sortie
8. **Calibration alerte** — Comment ajuster le ton selon le niveau d'alerte
9. **Cadre legal** — Disclaimer AMF + interdictions prescriptives

### Conventions de code a respecter

1. **Extension `.js` dans les imports relatifs** — obligatoire pour ESM avec `pnpm tsx`
2. **Bracket notation** `process.env['VAR']` — pre-commit hook bloque la dot notation
3. **Logs stderr uniquement** — `console.error(JSON.stringify({...}))` si logging necessaire
4. **Types importes avec `type`** — `import type { Kpi } from '...'`
5. **Pas d'import Next.js** — scripts Node.js purs
6. **Vitest pour les tests** — meme framework que toutes les stories pipeline
7. **JSON indent 2 espaces** — convention du projet

### Anti-patterns

1. **NE PAS** appeler Claude dans `user-briefing.ts` — ce fichier construit la string, c'est tout
2. **NE PAS** hardcoder les KPIs dans le prompt — ils sont injectes dynamiquement
3. **NE PAS** inclure les champs `briefing.en`, `tagline.en` etc. dans le prompt FR — la traduction EN est gere par Story 2.10 via Claude Haiku
4. **NE PAS** dupliquer les types `Kpi` ou `AlertState` — importer depuis `src/lib/schemas/`
5. **NE PAS** mettre de commentaires JSON dans les exemples de sortie — le modele doit produire du JSON pur
6. **NE PAS** utiliser des accents dans le nom de fichier markdown (OK: `system-chartiste-lettre.md`)
7. **NE PAS** placer les fichiers dans `prompts/` a la racine — utiliser `scripts/pipeline/prompts/` conformement a la directive
8. **NE PAS** confondre `risk_level` (metadata.risk_level dans AnalysisSchema) et `alert.level` (AlertState) — le premier est editoriale (low/medium/high/crisis), le second est technique (warning/alert/crisis)

### Relation `risk_level` vs `alert.level`

| Champ | Source | Valeurs | Usage |
|-------|--------|---------|-------|
| `alert.level` | `compute-alert.ts` (technique) | `warning`, `alert`, `crisis`, `null` | Seuil VIX percentile, alimente `AlertBanner` |
| `metadata.risk_level` | Claude Opus (editorial) | `low`, `medium`, `high`, `crisis` | Evaluation editoriale globale du jour, alimente `MetadataChips` |

Le prompt doit instruire Claude de determiner `risk_level` en se basant sur l'ensemble des KPIs, pas seulement sur l'alerte VIX. Un marche peut etre `high` risk sans alerte VIX active (ex: spread OAT-Bund en forte hausse).

### References existantes

- `src/lib/schemas/analysis.ts` — `AnalysisSchema` : structure de sortie complete [Source: src/lib/schemas/analysis.ts]
- `src/lib/schemas/kpi.ts` — `KpiSchema`, `type Kpi` : 11 KPIs avec categories, labels bilingues, direction [Source: src/lib/schemas/kpi.ts]
- `src/lib/schemas/alert.ts` — `AlertStateSchema`, `type AlertState` : etat d'alerte VIX [Source: src/lib/schemas/alert.ts]
- `scripts/pipeline/fetch-data.ts` — pattern pipeline, labels KPI, `buildKpis()` [Source: scripts/pipeline/fetch-data.ts]
- `scripts/pipeline/compute-alert.ts` — `buildAlert()`, `AlertComputeError`, seuils [Source: scripts/pipeline/compute-alert.ts]
- `docs/planning-artifacts/architecture.md` Section 4.5 — pattern prompts versionnes [Source: docs/planning-artifacts/architecture.md#4.5]
- `docs/planning-artifacts/ux-design-specification.md` Section 2 — sequence experientielle, Moment 2 "Le Chartiste Lettre parle" [Source: docs/planning-artifacts/ux-design-specification.md#2.1]
- `docs/planning-artifacts/prd.md` Section 5.2 — cadre legal AMF, formulations descriptives [Source: docs/planning-artifacts/prd.md#5.2]
- `docs/planning-artifacts/prd.md` Section 6 — persona Le Chartiste Lettre, proscription list, few-shot [Source: docs/planning-artifacts/prd.md#6]
- `docs/planning-artifacts/epics.md` Story 2.9 — acceptance criteria epics [Source: docs/planning-artifacts/epics.md]

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 — via bmad-create-story

### Debug Log References

_A completer lors de l'implementation_

### Completion Notes List

_A completer lors de l'implementation_

### File List

**Nouveaux fichiers :**
- `scripts/pipeline/prompts/system-chartiste-lettre.md`
- `scripts/pipeline/prompts/user-briefing.ts`
- `scripts/pipeline/prompts/__tests__/user-briefing.test.ts`
