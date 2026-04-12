# Story 2.7 : Script `compute-alert.ts` avec VIX percentile

Status: ready-for-dev
Epic: 2 — Data Pipeline Backend
Sprint: 2a (semaine 2)
Points: 3
Priority: P0
Created: 2026-04-12
Author: Claude Sonnet 4.6 via bmad-create-story

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un script `scripts/pipeline/compute-alert.ts` qui lit l'historique VIX local, calcule le percentile du VIX courant sur 252 jours, et retourne un `AlertState` conforme au schema Zod,
**so that** le pipeline peut injecter l'état d'alerte dans le briefing Claude (Story 2.10) et dans l'`AnalysisSchema` publié sur R2.

**Business value :** Ce script est la pièce de logique financière centrale du pipeline. Sans lui, l'`AlertBanner` du front-end est toujours vide et l'IA ne peut pas contextualiser le briefing avec le niveau de stress marché. Il est le pont entre les données historiques VIX (Story 2.6) et la génération IA (Story 2.10).

---

## Acceptance Criteria

**AC1 — `scripts/pipeline/compute-alert.ts`**

- [ ] Fichier `scripts/pipeline/compute-alert.ts` créé
- [ ] Compatible `pnpm tsx scripts/pipeline/compute-alert.ts` (pas de compilation préalable)
- [ ] Exécutable aussi depuis Story 2.13 `daily-pipeline.yml` en séquence après `fetch-data.ts`
- [ ] Pas d'import Next.js — script Node.js pur
- [ ] Export de la fonction principale : `buildAlert(vixCurrent: number): Promise<AlertState>`

**AC2 — Lecture de l'historique VIX local**

- [ ] Lit `data/vix-history.json` (tableau `VixPoint[]` = `{ date: string; value: number }[]`)
- [ ] Si le fichier n'existe pas : throw `AlertComputeError('vix-history.json not found — run bootstrap:vix first')`
- [ ] Si le fichier est vide ou corrompu (JSON invalide) : throw `AlertComputeError`
- [ ] Prend les **252 derniers points** du tableau (les données étant triées chronologiquement par Story 2.6)
- [ ] Si moins de 10 points disponibles : throw `AlertComputeError('Insufficient history: need at least 10 points')`

**AC3 — Calcul du percentile VIX**

- [ ] Formule exacte : `rank = (count of historical values < vix_current) / total_count * 100`
- [ ] `total_count` = nombre de points utilisés (min 10, max 252)
- [ ] Le percentile est une valeur entre 0 et 100 (inclusif)
- [ ] Arrondi à 2 décimales dans les logs (pas dans le calcul intermédiaire)
- [ ] `vix_p90_252d` dans l'`AlertState` = la valeur du 90e percentile de l'historique (pas le percentile du VIX courant)

**AC4 — Calcul de `vix_p90_252d` (le seuil réel P90)**

- [ ] `vix_p90_252d` = valeur au 90e percentile de l'historique des 252 points
- [ ] Calcul : `sorted[Math.floor(0.90 * count)]` (tri ascendant, index floor)
- [ ] Ce champ alimente directement `AlertStateSchema.vix_p90_252d` (champ requis par le schema Zod)

**AC5 — Détermination du niveau d'alerte**

- [ ] Seuils configurables via constante `ALERT_THRESHOLDS` en tête de fichier :
  ```typescript
  const ALERT_THRESHOLDS = {
    warning: 80,  // p80 — default configurable, user context dit "default 80th percentile"
    alert:   90,  // p90
    crisis:  99,  // p99
  } as const;
  ```
- [ ] Logique de décision :
  - `percentile >= ALERT_THRESHOLDS.crisis` → `level: 'crisis'`, `active: true`
  - `percentile >= ALERT_THRESHOLDS.alert` → `level: 'alert'`, `active: true`
  - `percentile >= ALERT_THRESHOLDS.warning` → `level: 'warning'`, `active: true`
  - Sinon → `level: null`, `active: false`
- [ ] `triggered_at` = `new Date().toISOString()` si `active === true`, sinon `null`

**AC6 — Output `AlertState` conforme au schema Zod**

- [ ] Utilise `AlertStateSchema.parse(result)` avant de retourner — garantit conformité
- [ ] Structure exacte :
  ```typescript
  {
    active: boolean,
    level: 'warning' | 'alert' | 'crisis' | null,
    vix_current: number,           // VIX courant (paramètre d'entrée)
    vix_p90_252d: number,          // Valeur réelle au P90 de l'historique
    triggered_at: string | null,   // ISO 8601 si active, null sinon
  }
  ```
- [ ] Validation Zod throw si le résultat ne respecte pas le schema

**AC7 — Mise à jour de `data/vix-history.json`**

- [ ] Après calcul, appender le VIX du jour dans l'historique local :
  - `{ date: today_YYYY-MM-DD, value: vix_current }`
- [ ] Si une entrée pour la date du jour existe déjà : overwrite (pas de doublon)
- [ ] Garder uniquement les **252 derniers points** après ajout (fenêtre glissante)
- [ ] Sauvegarder le fichier mis à jour (JSON indenté 2 espaces, même format que Story 2.6)
- [ ] Cette mise à jour locale est distincte de l'upload R2 (Story 2.11 gère le R2)

**AC8 — Intégration dans `scripts/pipeline/fetch-data.ts`**

- [ ] Ajouter la fonction `buildAlert(vixCurrent: number): Promise<AlertState>` dans `compute-alert.ts`
- [ ] Modifier `fetch-data.ts` pour appeler `buildAlert()` depuis une nouvelle fonction `buildAlertState()` ou directement dans le pipeline orchestrateur
- [ ] **Option recommandée** : créer `buildAlert()` exportée de `compute-alert.ts`, et appeler depuis `main()` de `fetch-data.ts` après `buildKpis()` — ou via un orchestrateur séparé Story 2.13
- [ ] Si `data/vix-history.json` absent : log warn + retourner un `AlertState` neutre (active: false, level: null) sans throw — le script `fetch-data.ts` ne doit pas être bloqué par l'absence de bootstrap

**AC9 — Log structuré JSON**

- [ ] Tous les logs vers `console.error(JSON.stringify({...}))` (stderr — jamais stdout)
- [ ] Log de démarrage : `{ level: 'info', msg: 'compute-alert start', vix_current, history_count }`
- [ ] Log de résultat : `{ level: 'info', msg: 'compute-alert result', percentile, level, active }`
- [ ] En cas d'erreur : `{ level: 'error', msg, error: string, timestamp }`

**AC10 — Tests Vitest**

- [ ] `scripts/pipeline/__tests__/compute-alert.test.ts` créé
- [ ] Mock de `fs.readFileSync` pour simuler `data/vix-history.json`
- [ ] Mock de `fs.writeFileSync` pour vérifier la mise à jour de l'historique
- [ ] Test percentile : VIX = 25 avec historique [10..30] → percentile correct
- [ ] Test niveau `warning` : percentile = 83 → `level: 'warning'`, `active: true`
- [ ] Test niveau `alert` : percentile = 92 → `level: 'alert'`, `active: true`
- [ ] Test niveau `crisis` : percentile = 99.5 → `level: 'crisis'`, `active: true`
- [ ] Test niveau `none` : percentile = 50 → `level: null`, `active: false`
- [ ] Test fichier absent : throw `AlertComputeError` (sauf depuis `fetch-data.ts` integration)
- [ ] Test historique < 10 points : throw `AlertComputeError`
- [ ] Test mise à jour historique glissante : après ajout, max 252 points
- [ ] `pnpm test` passe sans erreurs

**AC11 — Git**

- [ ] Commit sur `emmanuel` : `feat(story-2.7): add compute-alert.ts with VIX percentile rank`

---

## Tasks / Subtasks

- [ ] **Task 1** — Créer `scripts/pipeline/compute-alert.ts` (AC1–AC9)
  - [ ] Interface `VixPoint` : `{ date: string; value: number }` (même que Story 2.6 — NE PAS importer depuis bootstrap)
  - [ ] Classe `AlertComputeError` (extends Error)
  - [ ] Constante `ALERT_THRESHOLDS` (configurable, valeurs p80/p90/p99)
  - [ ] Fonction `log()` — pattern identique à `fetch-data.ts`
  - [ ] Fonction `loadHistory(filePath: string): VixPoint[]` — lit + valide le fichier JSON
  - [ ] Fonction `computePercentileRank(history: number[], current: number): number` — formule pure, testable
  - [ ] Fonction `computeP90Value(history: number[]): number` — calcule la valeur au 90e percentile
  - [ ] Fonction `determineAlertLevel(percentileRank: number): AlertLevel | null`
  - [ ] Fonction `updateHistory(filePath: string, points: VixPoint[], today: string, vixCurrent: number): void` — fenêtre glissante 252 points
  - [ ] Fonction principale exportée `buildAlert(vixCurrent: number): Promise<AlertState>`
  - [ ] Entry point `main()` : lit VIX via `fetchVIX()` + appelle `buildAlert()` + stdout JSON

- [ ] **Task 2** — Modifier `scripts/pipeline/fetch-data.ts` pour intégrer l'alerte (AC8)
  - [ ] Importer `buildAlert` depuis `./compute-alert.js`
  - [ ] Dans `buildKpis()` ou `main()` : appeler `buildAlert(vixValue)` avec try/catch
  - [ ] Si `AlertComputeError` : log warn + retourner `AlertState` neutre (ne pas bloquer le pipeline)
  - [ ] Inclure `alert` dans l'output JSON de `main()` : `{ kpis, fetchedAt, alert }`

- [ ] **Task 3** — Créer les tests Vitest (AC10)
  - [ ] `scripts/pipeline/__tests__/compute-alert.test.ts`
  - [ ] Mock `fs` module pour isoler I/O
  - [ ] Tests unitaires fonctions pures (`computePercentileRank`, `computeP90Value`, `determineAlertLevel`)
  - [ ] Tests intégration `buildAlert()` avec mock fs
  - [ ] `pnpm test` ✅

- [ ] **Task 4** — Git commit : `feat(story-2.7): add compute-alert.ts with VIX percentile rank`

- [ ] **Task 5** — Update story → status review

---

## Dev Notes

### Formule percentile (exacte, à implémenter sans variation)

```typescript
/**
 * Percentile rank : proportion de valeurs historiques STRICTEMENT inférieures au VIX courant
 * Formule : rank = (count of historical values < current) / total_count * 100
 *
 * Exemple : historique [10, 15, 20, 25, 30], current = 22
 *   → 3 valeurs < 22 (10, 15, 20)
 *   → rank = 3/5 * 100 = 60.0
 */
export function computePercentileRank(history: number[], current: number): number {
  const count = history.filter((v) => v < current).length;
  return (count / history.length) * 100;
}
```

### Calcul `vix_p90_252d` (valeur seuil au P90 de l'historique)

```typescript
export function computeP90Value(history: number[]): number {
  const sorted = [...history].sort((a, b) => a - b);
  const idx = Math.floor(0.90 * sorted.length);
  return sorted[idx] ?? sorted[sorted.length - 1]!;
}
```

### Seuils d'alerte et logique de décision

```typescript
const ALERT_THRESHOLDS = {
  warning: 80,  // >= p80 → warning
  alert:   90,  // >= p90 → alert
  crisis:  99,  // >= p99 → crisis
} as const;

function determineAlertLevel(percentileRank: number): AlertLevel | null {
  if (percentileRank >= ALERT_THRESHOLDS.crisis)  return 'crisis';
  if (percentileRank >= ALERT_THRESHOLDS.alert)   return 'alert';
  if (percentileRank >= ALERT_THRESHOLDS.warning) return 'warning';
  return null;
}
```

### Pattern `loadHistory`

```typescript
import fs from 'fs';
import path from 'path';

interface VixPoint {
  date: string;
  value: number;
}

const VIX_HISTORY_PATH = path.join(process.cwd(), 'data', 'vix-history.json');

function loadHistory(filePath: string = VIX_HISTORY_PATH): VixPoint[] {
  if (!fs.existsSync(filePath)) {
    throw new AlertComputeError('vix-history.json not found — run bootstrap:vix first');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    throw new AlertComputeError('vix-history.json is invalid JSON');
  }

  if (!Array.isArray(raw)) {
    throw new AlertComputeError('vix-history.json must be an array');
  }

  const points = raw as VixPoint[];
  if (points.length < 10) {
    throw new AlertComputeError(
      `Insufficient history: need at least 10 points, got ${points.length}`,
    );
  }

  // Prendre les 252 derniers points (déjà triés chronologiquement par Story 2.6)
  return points.slice(-252);
}
```

### Pattern `updateHistory` (fenêtre glissante)

```typescript
function updateHistory(
  filePath: string,
  currentHistory: VixPoint[],
  today: string,
  vixCurrent: number,
): void {
  // Supprimer toute entrée existante pour aujourd'hui (éviter doublon)
  const filtered = currentHistory.filter((p) => p.date !== today);
  // Ajouter le point du jour
  const updated = [...filtered, { date: today, value: vixCurrent }];
  // Fenêtre glissante : garder les 252 derniers
  const windowed = updated.slice(-252);
  fs.writeFileSync(filePath, JSON.stringify(windowed, null, 2), 'utf-8');
}
```

### Pattern `buildAlert` (fonction exportée principale)

```typescript
import { AlertStateSchema, type AlertState, type AlertLevel } from '../../src/lib/schemas/alert.js';

export async function buildAlert(vixCurrent: number): Promise<AlertState> {
  const filePath = VIX_HISTORY_PATH;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  log('info', 'compute-alert start', { vix_current: vixCurrent });

  const points = loadHistory(filePath);
  const history = points.map((p) => p.value);

  const percentileRank = computePercentileRank(history, vixCurrent);
  const vixP90Value = computeP90Value(history);
  const level = determineAlertLevel(percentileRank);
  const active = level !== null;

  log('info', 'compute-alert result', {
    history_count: history.length,
    percentile: Math.round(percentileRank * 100) / 100,
    vix_p90_252d: vixP90Value,
    level,
    active,
  });

  // Mettre à jour l'historique local (fenêtre glissante)
  updateHistory(filePath, points, today, vixCurrent);

  const result: AlertState = {
    active,
    level,
    vix_current: vixCurrent,
    vix_p90_252d: vixP90Value,
    triggered_at: active ? new Date().toISOString() : null,
  };

  // Validation Zod — throw si non conforme (ne devrait jamais arriver)
  return AlertStateSchema.parse(result);
}
```

### Pattern `main()` standalone (exécution directe)

```typescript
import { fetchVIX } from '../../src/lib/finnhub.js';
import { fileURLToPath } from 'url';

async function main(): Promise<void> {
  const { value: vixCurrent } = await fetchVIX();
  const alertState = await buildAlert(vixCurrent);
  process.stdout.write(JSON.stringify(alertState, null, 2) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'compute-alert fatal',
      error: String(err),
      timestamp: new Date().toISOString(),
    }));
    process.exit(1);
  });
}
```

### Intégration dans `fetch-data.ts` (modification Task 2)

Modifier `fetch-data.ts` pour inclure l'alerte dans l'output. **Ne pas bloquer le pipeline si l'historique est absent** :

```typescript
// En haut de fetch-data.ts — ajouter import
import { buildAlert } from './compute-alert.js';
import type { AlertState } from '../../src/lib/schemas/alert.js';

// AlertState neutre (fallback si historique VIX absent)
const NEUTRAL_ALERT: AlertState = {
  active: false,
  level: null,
  vix_current: 0,
  vix_p90_252d: 0,
  triggered_at: null,
};

// Dans main() de fetch-data.ts, après buildKpis() :
async function main() {
  const { kpis, fetchedAt } = await buildKpis();

  // Récupérer le VIX courant depuis les KPIs déjà fetchés
  const vixKpi = kpis.find((k) => k.id === 'vix');
  let alert: AlertState = NEUTRAL_ALERT;

  if (vixKpi) {
    try {
      alert = await buildAlert(vixKpi.value);
    } catch (err) {
      log('warn', 'compute-alert skipped — vix history unavailable', { error: String(err) });
      alert = { ...NEUTRAL_ALERT, vix_current: vixKpi.value };
    }
  }

  process.stdout.write(JSON.stringify({ kpis, fetchedAt, alert }, null, 2) + '\n');
}
```

**Point critique** : réutiliser le VIX déjà fetchés par `buildKpis()` — NE PAS appeler `fetchVIX()` une seconde fois.

### Pattern tests Vitest

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { computePercentileRank, computeP90Value } from '../compute-alert';

// Test fonctions pures (pas de mock nécessaire)
describe('computePercentileRank', () => {
  it('returns 60 when 3 of 5 values are below current', () => {
    expect(computePercentileRank([10, 15, 20, 25, 30], 22)).toBe(60);
  });

  it('returns 0 when current is below all historical values', () => {
    expect(computePercentileRank([20, 25, 30], 10)).toBe(0);
  });

  it('returns 100 when current exceeds all historical values', () => {
    expect(computePercentileRank([10, 15, 20], 99)).toBe(100);
  });
});

// Mock fs pour tests I/O
vi.mock('fs');
import fs from 'fs';
const mockFs = vi.mocked(fs);

describe('buildAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Générer 252 points de test [10..30]
    const history = Array.from({ length: 252 }, (_, i) => ({
      date: `2025-${String(Math.floor(i/20)+1).padStart(2,'0')}-01`,
      value: 10 + (i % 20),
    }));
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(history));
    mockFs.writeFileSync.mockImplementation(() => {});
  });
  // ...
});
```

### Contraintes importantes

1. **Bracket notation** : `process.env['FINNHUB_API_KEY']` — obligatoire, pre-commit hook (même pattern que tous les scripts pipeline)
2. **Jamais stdout** pour les logs — uniquement `console.error(JSON.stringify(...))` (stderr)
3. **stdout propre** : seul `process.stdout.write(JSON.stringify(result))` quand script exécuté directement
4. **Extension `.js`** dans les imports relatifs — obligatoire pour ESM avec `pnpm tsx` : `import from './compute-alert.js'`
5. **`VixPoint` redéfini localement** — NE PAS importer depuis `bootstrap-vix-history.ts` (pas d'export public là-bas)
6. **`AlertStateSchema.parse()`** obligatoire avant return — validation de conformité Zod
7. **Fenêtre glissante 252 points** — après ajout du point du jour, `slice(-252)` pour maintenir la taille

### Anti-patterns

1. **NE PAS** appeler `fetchVIX()` dans `buildAlert()` — la valeur VIX est un paramètre d'entrée (évite double fetch)
2. **NE PAS** importer `VixPoint` depuis `bootstrap-vix-history.ts` — redéfinir l'interface localement
3. **NE PAS** utiliser `process.env.VAR` (dot notation) — pré-commit hook
4. **NE PAS** bloquer le pipeline `fetch-data.ts` si l'historique est absent — try/catch + fallback neutre
5. **NE PAS** confondre `vix_p90_252d` (valeur seuil au P90) et le percentile rank du VIX courant
6. **NE PAS** utiliser `import.meta.url` sans le guard `process.argv[1] === fileURLToPath(import.meta.url)` — le script doit être importable sans exécuter `main()`
7. **NE PAS** écrire sur R2 dans cette story — c'est Story 2.11 qui gère les uploads R2

### Arborescence fichiers

```
scripts/
  pipeline/
    fetch-data.ts              ← MODIFIER (intégrer buildAlert + output alert)
    compute-alert.ts           ← NEW (cette story)
    bootstrap-vix-history.ts   ← existant (Story 2.6)
    __tests__/
      fetch-data.test.ts       ← existant (Story 2.5)
      compute-alert.test.ts    ← NEW (cette story)
data/
  vix-history.json             ← lu + mis à jour par compute-alert.ts (runtime, dans .gitignore)
src/
  lib/
    schemas/
      alert.ts                 ← existant (Story 2.1) — AlertStateSchema importé
```

### Distinction `vix_p90_252d` vs percentile rank

Ces deux valeurs sont différentes — ne pas les confondre :

| Champ | Définition | Exemple (VIX=25, historique 252 pts) |
|-------|-----------|--------------------------------------|
| `percentileRank` | % de valeurs historiques < VIX courant | 72.2% |
| `vix_p90_252d` | Valeur du VIX au P90 de l'historique | 28.4 |

Le `AlertStateSchema` stocke `vix_p90_252d` (la valeur seuil, pas le rank). Le `level` d'alerte est déterminé par le rank.

### Références existantes

- `src/lib/schemas/alert.ts` — `AlertStateSchema`, `AlertLevelSchema`, `AlertState`, `AlertLevel` (Story 2.1)
- `src/lib/schemas/analysis.ts` — `AnalysisSchema.alert: AlertStateSchema` (consommateur final)
- `src/lib/finnhub.ts` — `fetchVIX()`, pattern retry + bracket notation + log structuré (Story 2.2)
- `scripts/pipeline/fetch-data.ts` — pattern `PipelineError`, `log()`, `main()` avec guard ESM, `buildKpis()` (Story 2.5)
- `scripts/pipeline/__tests__/fetch-data.test.ts` — pattern mock vitest, `vi.mock`, `vi.mocked` (Story 2.5)
- `docs/planning-artifacts/architecture.md` — Section 3.2 `AlertState`, Section 3.4 pipeline séquentiel
- `data/vix-history.json` — généré par Story 2.6, format `VixPoint[]`

### Note sur `AlertStateSchema` — champ `triggered_at`

Le schema utilise `z.iso.datetime()` (Zod v4). La valeur doit être une string ISO 8601 valide :
`new Date().toISOString()` retourne bien ce format (ex: `"2026-04-12T06:00:00.000Z"`).

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 — via bmad-create-story

### Debug Log References

_À compléter lors de l'implémentation_

### Completion Notes List

_À compléter lors de l'implémentation_

### File List

**Nouveaux fichiers :**
- `scripts/pipeline/compute-alert.ts`
- `scripts/pipeline/__tests__/compute-alert.test.ts`

**Fichiers modifiés :**
- `scripts/pipeline/fetch-data.ts` — intégration `buildAlert()` + `alert` dans l'output JSON
