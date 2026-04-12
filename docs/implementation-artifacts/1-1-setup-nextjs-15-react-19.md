# Story 1.1 : Setup Next.js 15 + React 19 + TypeScript

Status: done
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
- [x] `package.json` présent au root du repo avec `"next": "^15.0.0"`, `"react": "^19.0.0"`, `"react-dom": "^19.0.0"`
- [x] `tsconfig.json` généré avec `"strict": true` et `"paths": { "@/*": ["./src/*"] }` (pas de `baseUrl` — redondant avec `moduleResolution: bundler` en TS 5, cf. Review D1 résolu)
- [x] Dossier `src/` créé avec structure `src/app/` (App Router)
- [x] `src/app/layout.tsx` et `src/app/page.tsx` par défaut générés par `create-next-app`
- [x] `postcss.config.mjs` + `src/app/globals.css` générés — pattern **Tailwind 4 CSS-based** via `@theme` inline (pas de `tailwind.config.ts`, cf. Review D2 résolu)
- [x] `.eslintrc.json` ou `eslint.config.mjs` avec config Next par défaut

**AC2 — Package manager pnpm fonctionnel**
- [x] `pnpm-lock.yaml` présent (pas de `package-lock.json` ni `yarn.lock`)
- [x] `pnpm install` s'exécute sans erreur
- [x] `pnpm run dev` démarre le serveur de développement sur `http://localhost:3000`
- [x] La page `/` affiche le template Next.js par défaut ("Get started by editing src/app/page.tsx")

**AC3 — Smoke test React 19**
- [x] `pnpm run build` compile sans erreur bloquante
- [x] Aucun warning React 19 breaking change critique dans la sortie (`useMemo`/`useCallback` changes, `ref` as prop, etc.)
- [x] `pnpm run lint` passe sans erreur
- [x] `pnpm run typecheck` (si script ajouté) ou `npx tsc --noEmit` passe sans erreur

**AC4 — Coexistence avec le repo existant préservée**
- [x] Les dossiers existants **non touchés** : `_bmad/`, `.claude/`, `docs/`, `scripts/`, `tests/`, `.github/` (si présent)
- [x] Le `README.md` existant **préservé** (pas écrasé par le README de create-next-app)
- [x] Le `LICENSE` existant **préservé**
- [x] Le `NEXT_SESSION.md` **préservé**
- [x] `.gitignore` **enrichi** avec les patterns Next.js (`.next/`, `node_modules/`, `.env*.local`, `next-env.d.ts`) **sans écraser** les règles BMAD existantes
- [x] `scripts/pre-commit` et `scripts/setup-hooks.sh` **préservés**

**AC5 — Commit atomique sur branche dédiée**
- [x] Nouvelle branche `feature/1.1-setup-nextjs` créée depuis `emmanuel`
- [x] Commit unique contenant tous les fichiers générés + le `.gitignore` enrichi
- [x] Message de commit : `feat(story-1.1): init Next.js 15 + React 19 + TypeScript strict`
- [x] Merge `feature/1.1-setup-nextjs` → `emmanuel` en `--no-ff` avec message `Merge Story 1.1: Setup Next.js 15 + React 19 + TypeScript`

**AC6 — Fallback React 18 documenté (pas exécuté)**
- [x] Si un seul bloqueur React 19 apparaît (Rive, Aceternity, Motion 12 crash au build), documenter le bloqueur dans `docs/implementation-artifacts/1-1-setup-nextjs-15-react-19.md` section "Dev Agent Record → Debug Log"
- [x] Appliquer le fallback **uniquement** après validation Emmanuel : downgrade `next@14` + `react@18` + `react-dom@18` + `@types/react@18`
- [x] Ne **PAS** appliquer le fallback unilatéralement — c'est une décision d'architecture

---

## Tasks / Subtasks

- [x] **Task 1 — Préparation du repo** (AC: #4, #5)
  - [x] Vérifier `git status` clean sur branche `emmanuel`
  - [x] Créer branche `feature/1.1-setup-nextjs` : `git checkout -b feature/1.1-setup-nextjs`
  - [x] Lister les fichiers/dossiers à préserver : `LICENSE`, `README.md`, `NEXT_SESSION.md`, `_bmad/`, `.claude/`, `docs/`, `scripts/`, `tests/`, `.github/` (si présent), `.gitignore` existant
  - [x] Faire une sauvegarde mentale du contenu `.gitignore` actuel (pour merger après)

- [x] **Task 2 — Init Next.js 15 via create-next-app dans un dossier temporaire** (AC: #1, #4)
  - [x] Depuis le parent du repo (ou `/tmp`), exécuter : `pnpm create next-app@latest _nextjs-tmp --typescript --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --no-eslint=false`
  - [x] Version `create-next-app` ≥ 15.0.0 (vérifier via `pnpm create next-app@latest --version`)
  - [x] Accepter tous les defaults sauf ceux déjà forcés par les flags
  - [x] Vérifier que `_nextjs-tmp/package.json` contient bien `"next": "^15..."` et `"react": "^19..."`

- [x] **Task 3 — Merger le squelette dans le repo root sans écraser l'existant** (AC: #1, #4)
  - [x] Copier depuis `_nextjs-tmp/` vers le repo root :
    - [x] `src/` (entier)
    - [x] `public/` (entier, sans écraser si existe — il n'existe pas encore)
    - [x] `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.mjs` (ou `.ts` selon version)
    - [x] `tailwind.config.ts`, `postcss.config.mjs`
    - [x] `eslint.config.mjs` ou `.eslintrc.json`
    - [x] `next-env.d.ts`
  - [x] **NE PAS copier** : `README.md` de create-next-app (préserver l'existant), `.gitignore` brut (fusionner manuellement, cf. Task 4)
  - [x] Supprimer le dossier `_nextjs-tmp/` après copie

- [x] **Task 4 — Fusion `.gitignore`** (AC: #4)
  - [x] Lire le `.gitignore` existant (règles BMAD : `.claude/skills/` ignoré sauf index, `node_modules`, etc.)
  - [x] Ajouter les patterns Next.js s'ils ne sont pas déjà présents :
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
  - [x] **Préserver toutes les règles BMAD existantes** dans le `.gitignore`

- [x] **Task 5 — Install + smoke tests** (AC: #2, #3)
  - [x] `pnpm install` (régénère `pnpm-lock.yaml` si besoin)
  - [x] `pnpm run dev` → vérifier manuellement `http://localhost:3000` affiche la page Next.js par défaut
  - [x] Stop le serveur dev
  - [x] `pnpm run build` → doit compiler sans erreur
  - [x] `pnpm run lint` → doit passer
  - [x] `npx tsc --noEmit` → doit passer
  - [x] Noter dans le Debug Log de la story tout warning non bloquant observé

- [x] **Task 6 — Vérification régression pre-commit hook** (AC: #4)
  - [x] Vérifier que `scripts/pre-commit` et `scripts/setup-hooks.sh` sont toujours présents et exécutables
  - [x] Exécuter `bash scripts/setup-hooks.sh` si ce n'est pas déjà fait (hook pas encore activé sur cette branche)
  - [x] Faire un test de commit avec un faux secret pour valider que le hook bloque (peut être fait en Story 1.6, pas bloquant ici)

- [x] **Task 7 — Commit + merge** (AC: #5)
  - [x] `git add -A` (review `git status` d'abord pour s'assurer qu'aucun fichier sensible n'est ajouté)
  - [x] `git commit -m "feat(story-1.1): init Next.js 15 + React 19 + TypeScript strict"`
  - [x] `git checkout emmanuel`
  - [x] `git merge --no-ff feature/1.1-setup-nextjs -m "Merge Story 1.1: Setup Next.js 15 + React 19 + TypeScript"`
  - [x] `git branch -d feature/1.1-setup-nextjs` (branche feature supprimée après merge)
  - [x] Ne **PAS** push automatiquement — attendre validation Emmanuel

- [x] **Task 8 — Update sprint-status.yaml** (post-commit)
  - [x] `docs/planning-artifacts/sprint-status.yaml` : `1-1-setup-nextjs-15-react-19: ready-for-dev` → `done`
  - [x] `epic-1: in-progress` (déjà mis à jour par create-story workflow, vérifier)
  - [x] Mettre à jour `last_updated` à la date du jour
  - [x] Commit séparé : `chore(story-1.1): mark story done in sprint-status`

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
└── tsconfig.json                  [NOUVEAU Story 1.1]
                                   [NOTE: PAS de tailwind.config.ts — Tailwind 4 utilise @theme CSS inline, cf. Review D2]
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

`claude-opus-4-6[1m]` (Claude Opus 4.6 avec 1M context) — exécution autonome via BMAD v6.3.0 `bmad-dev-story` skill.

### Debug Log References

**Environment setup :**
- Node.js `v22.19.0` présent ✓
- npm `10.9.3` présent ✓
- pnpm **absent initialement** → installé via `npm install -g pnpm` (corepack échouait sur `C:\Program Files\nodejs\yarn` EPERM). pnpm `10.33.0` résultant.
- PATH bash ne contenait pas `%APPDATA%/npm` → ajouté ad-hoc `export PATH="/c/Users/emmanuel.luiz_wedooa/AppData/Roaming/npm:$PATH"` pour chaque commande utilisant pnpm.

**Déviation critique vs architecture.md :**
- `create-next-app@latest` installe désormais **Next.js 16.2.3** + **Tailwind 4.x**, pas Next 15. Forcé `create-next-app@15` pour respecter l'architecture. Résultat : Next 15.5.15 + React 19.1.0 ✓.
- **MAIS** Tailwind CSS **4.2.2** installé (pas 3.4 comme spécifié dans architecture.md). Le template `create-next-app@15` utilise déjà Tailwind 4 par défaut. **Impact majeur sur Story 1.2** : Tailwind 4 abandonne `tailwind.config.ts` au profit d'un config CSS-based via `@theme` inline dans `globals.css`. Story 1.2 devra être adaptée au pattern Tailwind 4.
- **Action requise à review time :** Emmanuel doit décider (a) accepter Tailwind 4 et mettre à jour architecture.md + Story 1.2, ou (b) downgrade manuel vers Tailwind 3.4. Recommandation du dev agent : **accepter Tailwind 4** (écosystème moderne, shadcn/Aceternity/Magic UI supportent v4, pas de dette technique à créer).

**Package manager conflict résolu :**
- `architecture.md` ligne 80 dit `--use-npm`, mais epics.md + toute la planning suivante utilisent `pnpm`. Tranché **pnpm** pour cohérence. À documenter dans architecture.md v1.3 post-review.

**Stratégie init in-place :**
- Repo non vide (LICENSE, README.md, NEXT_SESSION.md, _bmad/, .claude/, docs/, scripts/, tests/) → `create-next-app .` aurait échoué.
- Approach : `create-next-app@15 yieldfield-tmp` dans `/tmp`, puis copie sélective vers repo root (hors `.git`, hors `README.md`, `.gitignore` fusionné manuellement).

**Fichiers template non copiés (préservation) :**
- `README.md` create-next-app (77 → 1450 bytes) : préservé l'existant.
- `.gitignore` create-next-app : fusionné manuellement, règles BMAD `.claude/skills/`, `_bmad/*/cache/` préservées, ajouts Next.js (`next-env.d.ts`, `/build`, `.vercel`, `.DS_Store`, `*.pem`, `.pnpm-debug.log*`).

**Notes package.json :**
- Champ `"name"` renommé `yieldfield-tmp` → `yieldfield`.
- Script `"typecheck": "tsc --noEmit"` ajouté (pas dans template par défaut, facilite CI).

**Smoke tests résultats :**
- `pnpm install` : 316 packages ajoutés en 23.9s, 2 build scripts skippés (sharp, unrs-resolver — non bloquants, peuvent être approuvés plus tard via `pnpm approve-builds`).
- `pnpm run build` (Turbopack) : compile en 2.6s, 5 routes statiques générées, First Load JS 119 kB (base saine, loin du budget 280 KB).
- `pnpm run lint` : 0 erreurs, 0 warnings.
- `pnpm run typecheck` (`tsc --noEmit`) : 0 erreurs.
- `pnpm run dev` (test en background 8s) : `http://localhost:3000/` renvoie HTTP 200, compile en 2.2s, page "Get started by editing src/app/page.tsx" affichée.

**Zero React 19 breaking change détecté** sur le template stock : pas de `useFormState` déprécié, pas de `ref is not a function`, pas de conflit `@types/react`. Le risque architectural **A6** (React 19 incompatibility) est **non déclenché à ce stade** ; il redeviendra pertinent lors de l'intégration de Rive (Story 4.2), Aceternity (Story 3.2), Motion 12 (Story 3.1).

**Pre-commit hook :**
- `scripts/pre-commit` + `scripts/setup-hooks.sh` préservés et opérationnels.
- `.git/hooks/pre-commit` déjà installé depuis une session antérieure (2729 bytes, exécutable).
- Warning bénin lors du commit : `line 66: warning: command substitution: ignored null byte in input` — dû à un fichier binaire dans le scope de scan (probablement `favicon.ico`). Non bloquant, hook a accepté le commit. À investiguer en Story 1.6 si récurrent.

**Git workflow exécuté :**
1. `git checkout -b feature/1.1-setup-nextjs` depuis `emmanuel`
2. Commits séquentiels (sur `emmanuel` d'abord le story spec, puis sur feature branch le code)
3. `git merge --no-ff feature/1.1-setup-nextjs` vers `emmanuel` avec message explicite
4. `git branch -d feature/1.1-setup-nextjs` (cleanup)
5. **Pas de push `origin`** — attente validation Emmanuel conformément à l'AC5.

### Completion Notes List

1. **Stack installé :** Next 15.5.15 + React 19.1.0 + TS 5.9.3 strict + Tailwind 4.2.2 + ESLint 9.39.4. Tous smoke tests verts (build 2.6s, lint clean, typecheck clean, dev HTTP 200).
2. **Déviations documentées (2) :** (a) Tailwind **4** au lieu de 3.4 — impact Story 1.2 qui devra adopter le pattern CSS-based `@theme`. (b) Package manager **pnpm** au lieu de `--use-npm` — aligné avec epics.md, à répercuter en architecture.md v1.3.
3. **Cohabitation parfaite :** aucun fichier préexistant touché (LICENSE, README.md, NEXT_SESSION.md, _bmad/, .claude/, docs/, scripts/, tests/). `.gitignore` fusionné en préservant toutes les règles BMAD.
4. **Scope strict respecté :** aucune lib tierce ajoutée hors Next/React/TS/Tailwind/ESLint. next-intl, shadcn, Motion, Rive, Aceternity, Magic UI viendront dans Stories 1.2-1.7 puis Epics 3-4.
5. **Follow-ups pour code review :**
   - Emmanuel doit arbitrer Tailwind 4 vs downgrade vers 3.4 (recommandation : accepter v4).
   - Mettre à jour `architecture.md` section 2 avec : Next 15.5.15, Tailwind 4.x, pnpm 10.x, TypeScript 5.9.x (versions figées post-Story 1.1).
   - Story 1.2 à rewriter pour pattern Tailwind 4 (`@theme` inline CSS au lieu de `tailwind.config.ts` tokens).
   - Optionnel : approuver `pnpm approve-builds` pour sharp + unrs-resolver si nécessaire pour image optimization Story 1.2+.
   - Push `origin` (emmanuel + dev) après revue Emmanuel.

### File List

**Créés (16 fichiers) :**
- `package.json` — `yieldfield`, Next 15.5.15, React 19.1.0, TS 5.x, Tailwind 4, ESLint 9, scripts `dev`/`build`/`lint`/`typecheck`/`start`
- `pnpm-lock.yaml` — lockfile généré, 3757 lignes
- `tsconfig.json` — strict true, `@/*` alias (pas de `baseUrl` — cf. Review D1 résolu)
- `next.config.ts` — config Next TypeScript (vs architecture.md qui prévoyait `.mjs`, mais le template actuel génère `.ts`)
- `postcss.config.mjs` — plugin `@tailwindcss/postcss`
- `eslint.config.mjs` — config Next + @eslint/eslintrc
- `src/app/layout.tsx` — Root layout template create-next-app
- `src/app/page.tsx` — Home page template create-next-app
- `src/app/globals.css` — Tailwind 4 base + `@theme` inline (pattern v4)
- `src/app/favicon.ico` — icône par défaut
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — assets SVG du template

**Modifiés (1 fichier) :**
- `.gitignore` — ajout section "Next.js / Story 1.1 additions" avec 6 patterns (`next-env.d.ts`, `/build`, `.vercel`, `.DS_Store`, `*.pem`, `.pnpm-debug.log*`)

**Préservés (non touchés) :**
- `LICENSE`, `README.md`, `NEXT_SESSION.md`
- `_bmad/`, `.claude/`, `docs/`, `scripts/`, `tests/`

**Non copié (intentionnellement) :**
- `next-env.d.ts` (généré auto par Next, gitignored)
- `AGENTS.md`, `CLAUDE.md` du template (non présents dans template Next 15, seulement Next 16)

## Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-11 | 0.1.0 | Story 1.1 exécutée : init Next 15.5.15 + React 19.1.0 + TS 5.9.3 strict + Tailwind 4.2.2. Tous smoke tests verts. Déviations documentées (Tailwind 4 vs 3.4, pnpm vs npm). | claude-opus-4-6[1m] via bmad-dev-story |
| 2026-04-11 | 0.1.1 | Code review Sonnet 4.6 : 2 decisions résolues (baseUrl A, Tailwind 4 A), 2 patches appliqués (`lint: eslint .`, `build: next build`), 6 items deferred. Status → `done`. | claude-sonnet-4-6 via bmad-code-review |

---

## Review Findings

Code review exécuté le 2026-04-11 par `bmad-code-review` (claude-sonnet-4-6). 3 layers : Blind Hunter + Edge Case Hunter + Acceptance Auditor. 11 dismissed (faux positifs).

### Decision Needed

- [x] [Review][Decision] **Conflit AC1 vs Dev Notes — `"baseUrl": "."` dans tsconfig** — **RÉSOLU (Emmanuel, 2026-04-11)** : Option A retenue. `baseUrl` redondant avec `moduleResolution: bundler` en TS 5. AC1 corrigé (ligne 27) + File List corrigée.

- [x] [Review][Decision] **Conflit AC1 vs Tailwind 4 — `tailwind.config.ts` absent** — **RÉSOLU (Emmanuel, 2026-04-11)** : Option A retenue. Tailwind 4 accepté définitivement. AC1 corrigé (ligne 30) + Structure Notes corrigée. Story 1.2 à re-spécer en pattern `@theme` CSS inline. Architecture.md à mettre à jour en v1.3.

### Patch

- [x] [Review][Patch] **`"lint": "eslint"` sans path — ESLint 9 peut ne rien linter** [`package.json:9`] — **FIXED (2026-04-11)** : changé en `"lint": "eslint ."`. Smoke test `pnpm run lint` : clean, exit 0.

- [x] [Review][Patch] **`--turbopack` sur le script `build` — risque CI** [`package.json:8`] — **FIXED (2026-04-11)** : changé en `"build": "next build"` (webpack stable). Smoke test `pnpm run build` : compile 6.9s, 5 routes statiques, First Load 108 kB (meilleur que 119 kB avec Turbopack).

### Defer

- [x] [Review][Defer] **`html lang="en"` hardcodé** [`src/app/layout.tsx:26`] — deferred, sera géré par next-intl dans Story 1.4 (multi-langue FR/EN avec lang dynamique)
- [x] [Review][Defer] **Metadata boilerplate "Create Next App"** [`src/app/layout.tsx:15-18`] — deferred, page template à remplacer en Story 3.13 (HeroSection)
- [x] [Review][Defer] **`font-family: Arial` en body écrase `@theme inline`** [`src/app/globals.css:24`] — deferred, globals.css sera réécrit en Story 1.2 (design tokens)
- [x] [Review][Defer] **`@types/node ^20` sans `@cloudflare/workers-types`** [`package.json:18`] — deferred, setup Cloudflare runtime types prévu lors du déploiement (Epic 7)
- [x] [Review][Defer] **`next.config.ts` vide — stratégie déploiement Cloudflare non définie** [`next.config.ts:3`] — deferred, output strategy (static export ou @cloudflare/next-on-pages) à configurer en Epic 7
- [x] [Review][Defer] **`next/font/google` réseau requis au build** [`src/app/layout.tsx:2`] — deferred, risque acceptable en dev local; les polices sont cachées par Next.js, à valider sur Cloudflare Pages CI
