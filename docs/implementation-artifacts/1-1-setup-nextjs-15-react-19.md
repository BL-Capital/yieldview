# Story 1.1 : Setup Next.js 15 + React 19 + TypeScript

Status: ready-for-dev
Epic: 1 — Foundation & Tooling Setup
Sprint: 1 (semaine 1)
Points: 3
Priority: P0
Created: 2026-04-11
Author: Scrum Master (BMAD v6.3.0 `bmad-create-story`)

---

## Story

**As a** Lead dev (Emmanuel + Claude Code),
**I want** un squelette Next.js 15 + React 19 + TypeScript strict opérationnel dans le repo `yieldview` existant,
**so that** toutes les stories suivantes (1.2 à 1.7 puis Epics 2-7) aient une base technique stable, typée et conforme à l'architecture validée.

**Business value :** Story fondation dont dépendent les 68 autres stories. Un setup raté = cascade d'échecs sur tout le projet. C'est le socle non négociable.

---

## Acceptance Criteria

**AC1 — Next.js 15 + React 19 initialisés**
- [ ] `package.json` présent au root du repo avec `"next": "^15.0.0"`, `"react": "^19.0.0"`, `"react-dom": "^19.0.0"`
- [ ] `tsconfig.json` généré avec `"strict": true` et `"baseUrl": "."` + `"paths": { "@/*": ["./src/*"] }`
- [ ] Dossier `src/` créé avec structure `src/app/` (App Router)
- [ ] `src/app/layout.tsx` et `src/app/page.tsx` par défaut générés par `create-next-app`
- [ ] `tailwind.config.ts` + `postcss.config.mjs` + `src/app/globals.css` générés (base, sans tokens YieldField — ça c'est Story 1.2)
- [ ] `.eslintrc.json` ou `eslint.config.mjs` avec config Next par défaut

**AC2 — Package manager pnpm fonctionnel**
- [ ] `pnpm-lock.yaml` présent (pas de `package-lock.json` ni `yarn.lock`)
- [ ] `pnpm install` s'exécute sans erreur
- [ ] `pnpm run dev` démarre le serveur de développement sur `http://localhost:3000`
- [ ] La page `/` affiche le template Next.js par défaut ("Get started by editing src/app/page.tsx")

**AC3 — Smoke test React 19**
- [ ] `pnpm run build` compile sans erreur bloquante
- [ ] Aucun warning React 19 breaking change critique dans la sortie (`useMemo`/`useCallback` changes, `ref` as prop, etc.)
- [ ] `pnpm run lint` passe sans erreur
- [ ] `pnpm run typecheck` (si script ajouté) ou `npx tsc --noEmit` passe sans erreur

**AC4 — Coexistence avec le repo existant préservée**
- [ ] Les dossiers existants **non touchés** : `_bmad/`, `.claude/`, `docs/`, `scripts/`, `tests/`, `.github/` (si présent)
- [ ] Le `README.md` existant **préservé** (pas écrasé par le README de create-next-app)
- [ ] Le `LICENSE` existant **préservé**
- [ ] Le `NEXT_SESSION.md` **préservé**
- [ ] `.gitignore` **enrichi** avec les patterns Next.js (`.next/`, `node_modules/`, `.env*.local`, `next-env.d.ts`) **sans écraser** les règles BMAD existantes
- [ ] `scripts/pre-commit` et `scripts/setup-hooks.sh` **préservés**

**AC5 — Commit atomique sur branche dédiée**
- [ ] Nouvelle branche `feature/1.1-setup-nextjs` créée depuis `emmanuel`
- [ ] Commit unique contenant tous les fichiers générés + le `.gitignore` enrichi
- [ ] Message de commit : `feat(story-1.1): init Next.js 15 + React 19 + TypeScript strict`
- [ ] Merge `feature/1.1-setup-nextjs` → `emmanuel` en `--no-ff` avec message `Merge Story 1.1: Setup Next.js 15 + React 19 + TypeScript`

**AC6 — Fallback React 18 documenté (pas exécuté)**
- [ ] Si un seul bloqueur React 19 apparaît (Rive, Aceternity, Motion 12 crash au build), documenter le bloqueur dans `docs/implementation-artifacts/1-1-setup-nextjs-15-react-19.md` section "Dev Agent Record → Debug Log"
- [ ] Appliquer le fallback **uniquement** après validation Emmanuel : downgrade `next@14` + `react@18` + `react-dom@18` + `@types/react@18`
- [ ] Ne **PAS** appliquer le fallback unilatéralement — c'est une décision d'architecture

---

## Tasks / Subtasks

- [ ] **Task 1 — Préparation du repo** (AC: #4, #5)
  - [ ] Vérifier `git status` clean sur branche `emmanuel`
  - [ ] Créer branche `feature/1.1-setup-nextjs` : `git checkout -b feature/1.1-setup-nextjs`
  - [ ] Lister les fichiers/dossiers à préserver : `LICENSE`, `README.md`, `NEXT_SESSION.md`, `_bmad/`, `.claude/`, `docs/`, `scripts/`, `tests/`, `.github/` (si présent), `.gitignore` existant
  - [ ] Faire une sauvegarde mentale du contenu `.gitignore` actuel (pour merger après)

- [ ] **Task 2 — Init Next.js 15 via create-next-app dans un dossier temporaire** (AC: #1, #4)
  - [ ] Depuis le parent du repo (ou `/tmp`), exécuter : `pnpm create next-app@latest _nextjs-tmp --typescript --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --no-eslint=false`
  - [ ] Version `create-next-app` ≥ 15.0.0 (vérifier via `pnpm create next-app@latest --version`)
  - [ ] Accepter tous les defaults sauf ceux déjà forcés par les flags
  - [ ] Vérifier que `_nextjs-tmp/package.json` contient bien `"next": "^15..."` et `"react": "^19..."`

- [ ] **Task 3 — Merger le squelette dans le repo root sans écraser l'existant** (AC: #1, #4)
  - [ ] Copier depuis `_nextjs-tmp/` vers le repo root :
    - [ ] `src/` (entier)
    - [ ] `public/` (entier, sans écraser si existe — il n'existe pas encore)
    - [ ] `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.mjs` (ou `.ts` selon version)
    - [ ] `tailwind.config.ts`, `postcss.config.mjs`
    - [ ] `eslint.config.mjs` ou `.eslintrc.json`
    - [ ] `next-env.d.ts`
  - [ ] **NE PAS copier** : `README.md` de create-next-app (préserver l'existant), `.gitignore` brut (fusionner manuellement, cf. Task 4)
  - [ ] Supprimer le dossier `_nextjs-tmp/` après copie

- [ ] **Task 4 — Fusion `.gitignore`** (AC: #4)
  - [ ] Lire le `.gitignore` existant (règles BMAD : `.claude/skills/` ignoré sauf index, `node_modules`, etc.)
  - [ ] Ajouter les patterns Next.js s'ils ne sont pas déjà présents :
    ```
    # Next.js
    .next/
    out/
    build/
    next-env.d.ts
    
    # Dependencies
    node_modules/
    
    # Environment
    .env*.local
    
    # Logs & debug
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    .pnpm-debug.log*
    ```
  - [ ] **Préserver toutes les règles BMAD existantes** dans le `.gitignore`

- [ ] **Task 5 — Install + smoke tests** (AC: #2, #3)
  - [ ] `pnpm install` (régénère `pnpm-lock.yaml` si besoin)
  - [ ] `pnpm run dev` → vérifier manuellement `http://localhost:3000` affiche la page Next.js par défaut
  - [ ] Stop le serveur dev
  - [ ] `pnpm run build` → doit compiler sans erreur
  - [ ] `pnpm run lint` → doit passer
  - [ ] `npx tsc --noEmit` → doit passer
  - [ ] Noter dans le Debug Log de la story tout warning non bloquant observé

- [ ] **Task 6 — Vérification régression pre-commit hook** (AC: #4)
  - [ ] Vérifier que `scripts/pre-commit` et `scripts/setup-hooks.sh` sont toujours présents et exécutables
  - [ ] Exécuter `bash scripts/setup-hooks.sh` si ce n'est pas déjà fait (hook pas encore activé sur cette branche)
  - [ ] Faire un test de commit avec un faux secret pour valider que le hook bloque (peut être fait en Story 1.6, pas bloquant ici)

- [ ] **Task 7 — Commit + merge** (AC: #5)
  - [ ] `git add -A` (review `git status` d'abord pour s'assurer qu'aucun fichier sensible n'est ajouté)
  - [ ] `git commit -m "feat(story-1.1): init Next.js 15 + React 19 + TypeScript strict"`
  - [ ] `git checkout emmanuel`
  - [ ] `git merge --no-ff feature/1.1-setup-nextjs -m "Merge Story 1.1: Setup Next.js 15 + React 19 + TypeScript"`
  - [ ] `git branch -d feature/1.1-setup-nextjs` (branche feature supprimée après merge)
  - [ ] Ne **PAS** push automatiquement — attendre validation Emmanuel

- [ ] **Task 8 — Update sprint-status.yaml** (post-commit)
  - [ ] `docs/planning-artifacts/sprint-status.yaml` : `1-1-setup-nextjs-15-react-19: ready-for-dev` → `done`
  - [ ] `epic-1: in-progress` (déjà mis à jour par create-story workflow, vérifier)
  - [ ] Mettre à jour `last_updated` à la date du jour
  - [ ] Commit séparé : `chore(story-1.1): mark story done in sprint-status`

---

## Dev Notes

### Contexte projet critique

**Le repo `yieldview` est DÉJÀ initialisé** avec :
- `LICENSE`, `README.md`, `NEXT_SESSION.md` à la racine
- `_bmad/` (BMAD v6.3.0 config)
- `.claude/` (41 skills BMAD per-project)
- `docs/planning-artifacts/` (9 livrables BMAD ~5700 lignes)
- `scripts/pre-commit` et `scripts/setup-hooks.sh` (détection secrets)
- `tests/` (vide pour l'instant)
- Git branches : `emmanuel` (work), `dev` (merge target), `main` (PR target)

**Conséquence :** `create-next-app .` dans le dossier courant **échouera** (dossier non vide). La stratégie est **init dans un dossier temporaire puis merge des fichiers**.

### Choix techniques verrouillés (ne PAS re-décider)

**Source : `docs/planning-artifacts/architecture.md` section 2.1-2.3**

- **Framework :** Next.js 15 (App Router, Turbopack dev stable, PPR disponible)
- **Language :** TypeScript 5.x strict
- **React :** 19.0.0 (avec fallback R18 documenté, voir AC6)
- **CSS :** Tailwind CSS 3.4.x
- **Package manager :** **pnpm** — l'architecture dit `--use-npm` mais **epics.md Story 1.1 et toute la planning ultérieure utilisent pnpm**. **Trancher pnpm** (plus rapide, node_modules plus petit, meilleur pour Cloudflare Pages CI).
- **Structure :** `src/app/`, `src/components/`, `src/lib/` (via flag `--src-dir`)
- **Alias imports :** `@/*` → `./src/*`
- **Linting :** ESLint 9 + config Next par défaut

### ⚠️ Conflit doc à signaler à Emmanuel après exécution

`architecture.md` ligne 80 dit `--use-npm`, mais toutes les stories ultérieures (1.1 à 7.6) utilisent `pnpm run ...`. **Je tranche pnpm pour cohérence avec le reste du planning.** À confirmer lors du code review Story 1.1.

### Structure cible du repo après Story 1.1

```
yieldview/                         [repo root]
├── _bmad/                         [existant, NE PAS TOUCHER]
├── .claude/                       [existant, NE PAS TOUCHER]
├── .github/                       [peut ne pas exister, créé en Story 1.7]
├── docs/                          [existant, NE PAS TOUCHER]
├── scripts/                       [existant pre-commit, NE PAS TOUCHER]
├── tests/                         [existant, vide]
├── src/                           [NOUVEAU Story 1.1]
│   └── app/
│       ├── layout.tsx             [default create-next-app]
│       ├── page.tsx               [default create-next-app]
│       ├── globals.css            [default create-next-app]
│       └── favicon.ico            [default create-next-app]
├── public/                        [NOUVEAU Story 1.1, contenu default]
├── .gitignore                     [EXISTANT enrichi avec règles Next]
├── eslint.config.mjs              [NOUVEAU Story 1.1]
├── LICENSE                        [existant, NE PAS TOUCHER]
├── next-env.d.ts                  [NOUVEAU Story 1.1]
├── next.config.mjs                [NOUVEAU Story 1.1]
├── NEXT_SESSION.md                [existant, NE PAS TOUCHER]
├── package.json                   [NOUVEAU Story 1.1]
├── pnpm-lock.yaml                 [NOUVEAU Story 1.1]
├── postcss.config.mjs             [NOUVEAU Story 1.1]
├── README.md                      [existant, NE PAS TOUCHER - pas écraser]
├── tailwind.config.ts             [NOUVEAU Story 1.1 — contenu default, Story 1.2 l'enrichira]
└── tsconfig.json                  [NOUVEAU Story 1.1]
```

### Pièges connus & anti-patterns à éviter

1. **NE PAS écraser le `README.md`** existant avec celui de create-next-app. Le README actuel est minimal (77 octets) mais il existe pour une raison (à étendre plus tard côté projet, pas côté Next.js template).

2. **NE PAS exécuter `create-next-app .` dans le repo root.** Utiliser un dossier temporaire externe (`/tmp/yieldfield-tmp` ou `../_nextjs-tmp`) puis copier les fichiers.

3. **NE PAS supprimer le `.gitignore` existant.** Le fusionner avec les patterns Next.js. Les règles BMAD (`.claude/skills/` ignored sauf index) DOIVENT être préservées.

4. **NE PAS initialiser avec npm ou yarn.** pnpm est le standard du projet. Si `create-next-app` n'a pas de flag `--use-pnpm` dans la version installée, initialiser avec npm puis :
   - Supprimer `package-lock.json` et `node_modules/`
   - `pnpm install` (génère `pnpm-lock.yaml`)

5. **NE PAS ajouter les design tokens YieldField** au `tailwind.config.ts` dans cette story. C'est le scope exact de **Story 1.2**. Laisser la config Tailwind par défaut (juste les paths de scan corrects).

6. **NE PAS configurer next-intl, shadcn, Motion, ou quoi que ce soit d'autre.** Story 1.1 = strict minimum Next.js 15 + React 19 + TS. Les autres libs viennent dans Stories 1.2-1.7.

7. **NE PAS committer `node_modules/`, `.next/`, ou `.env*.local`.** Le `.gitignore` enrichi doit les exclure.

8. **NE PAS push sur `origin` sans validation Emmanuel.** Merge local sur `emmanuel`, puis stopper. Emmanuel décide quand push.

### Vérifications React 19 breaking changes à scanner

Pendant `pnpm run build`, surveiller les erreurs/warnings suivants (symptômes React 19 incompatibility) :

- `Warning: useRef must be initialized`
- `Warning: forwardRef is deprecated` (c'est OK, ce n'est plus obligatoire mais non bloquant)
- `Error: Cannot use 'useFormState' — use 'useActionState' instead`
- `TypeError: ref is not a function` sur un composant tiers
- Erreurs liées à `@types/react` version 18 vs 19

Si l'un de ces patterns apparaît **dans le smoke test create-next-app par défaut** (pas encore d'ajout de lib tierce), c'est un bug Next.js/React 19 et il faut ouvrir une issue. **À ce stade (stock template), tout devrait compiler proprement.**

### Testing standards

**Pour cette story :** pas de test automatisé (pas encore de logique métier). Les "tests" sont les smoke tests manuels listés en AC3 et AC4.

**À partir de Story 2.1 :** Vitest pour unit tests + Playwright pour e2e (setup en Story 1.7 via GitHub Actions).

### Budget performance (contraintes NFR)

Pas applicable pour Story 1.1 (page Next.js template). Les gates Lighthouse (≥ 90) s'activent à partir de Story 6.1. Juste vérifier que `pnpm run build` ne sort pas un bundle absurde pour un template vide.

---

### Project Structure Notes

**Alignement parfait avec l'architecture :** oui, la structure cible respecte exactement `architecture.md` section 5.1.

**Variance constatée :**
- `architecture.md` ligne 80 dit `--use-npm` → **on override à pnpm** (voir Dev Notes / Conflit doc).
- Aucune autre variance.

**Conflits détectés :**
- README.md default de create-next-app vs README.md existant → **préserver l'existant**.
- .gitignore default de create-next-app vs .gitignore existant avec règles BMAD → **fusion manuelle**.

---

### References

- `docs/planning-artifacts/epics.md#Story-1.1` (lignes 40-48) — AC d'origine
- `docs/planning-artifacts/architecture.md#2.1-Starter-choisi` (lignes 67-99) — stack verrouillé
- `docs/planning-artifacts/architecture.md#5.1-Top-level-structure` (lignes 677-805) — structure cible
- `docs/planning-artifacts/architecture.md#5.2-Key-dependencies` (lignes 807-845) — versions de deps
- `docs/planning-artifacts/architecture.md#6.3-Risques-architecturaux` (risque A6 React 19 incompatibility) — fallback documenté
- `docs/planning-artifacts/sprint-plan.md#Sprint-1` (ligne 47-74) — Sprint 1 goal + DoD
- `NEXT_SESSION.md` — contexte de reprise et décisions projet

---

## Dev Agent Record

### Agent Model Used

À remplir par le dev agent lors de l'exécution (ex: `claude-opus-4-6[1m]` ou `claude-sonnet-4-6`).

### Debug Log References

(Section à remplir pendant l'exécution — noter warnings, erreurs, décisions prises, bloqueurs React 19 éventuels)

### Completion Notes List

(Section à remplir à la fin — résumé 3-5 lignes de ce qui a été fait, toute déviation par rapport au plan, tout follow-up nécessaire)

### File List

(Liste à remplir à la fin — tous les fichiers créés/modifiés par cette story)

**Créés prévus :**
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `next.config.mjs`
- `next-env.d.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/favicon.ico`
- `public/*.svg` (contenu template par défaut)

**Modifiés prévus :**
- `.gitignore` (enrichi avec règles Next.js, règles BMAD préservées)

**Préservés (non touchés) :**
- `LICENSE`
- `README.md`
- `NEXT_SESSION.md`
- `_bmad/`
- `.claude/`
- `docs/`
- `scripts/`
- `tests/`
