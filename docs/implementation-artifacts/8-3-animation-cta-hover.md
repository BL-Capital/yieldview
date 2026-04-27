# Story 8.3: Animation CTA — remplacer par hover teinte simple

Status: ready-for-dev

## Story

As a visiteur de YieldField,
I want voir un bouton CTA "Coulisses" sobre et élégant sans animation agitée en continu,
so that l'interface respire et le bouton reste visible sans distraire.

## Acceptance Criteria

1. Les animations continues `heartbeat` et `pulse-dot` sont **supprimées** du CTA "Voir les Coulisses"
2. Le bouton au repos est statique — aucune animation `animate-*` qui tourne en boucle
3. Au hover : transition douce de la teinte de fond vers `bg-yield-gold/15` en 200ms — pas d'animation `scale`
4. Le point doré (statut live) reste visible mais **statique** au repos — suppression de `animate-[pulse-dot...]`
5. Les keyframes `@keyframes heartbeat` et `@keyframes pulse-dot` sont **retirées** de `globals.css` si plus utilisées ailleurs
6. `prefers-reduced-motion` n'est plus nécessaire sur ce composant (animations supprimées)
7. `pnpm build` et `pnpm typecheck` clean, aucune régression visuelle sur les autres sections

## Tasks / Subtasks

- [ ] Modifier le CTA dans `HeroSection.tsx` (AC: #1, #2, #3, #4)
  - [ ] Supprimer les 2 `<span>` de rings heartbeat (lignes avec `animate-[heartbeat...]`)
  - [ ] Supprimer `animate-[pulse-dot...]` du point doré — le garder statique
  - [ ] Nouveau hover : remplacer `hover:bg-yield-gold/10 hover:scale-105 hover:shadow-[...]` par `hover:bg-yield-gold/15 transition-colors duration-200`
  - [ ] Supprimer `relative mt-4` wrapper div si les rings sont retirés (nettoyer le JSX)

- [ ] Vérifier si `heartbeat` / `pulse-dot` sont utilisés ailleurs (AC: #5)
  - [ ] `grep -rn "heartbeat\|pulse-dot" src/` — si 0 autres usages, supprimer de `globals.css`
  - [ ] Si d'autres composants l'utilisent, conserver dans `globals.css` et documenter

- [ ] Valider rendu visuel + build (AC: #6, #7)
  - [ ] `pnpm build` → 0 erreur
  - [ ] `pnpm typecheck` → 0 erreur
  - [ ] Vérifier que les autres sections (AlertBanner, FreshnessIndicator, marquee) ne sont pas affectées

## Dev Notes

### Code actuel à remplacer (HeroSection.tsx lignes ~124-143)
```tsx
{/* 8. CTA Coulisses — heartbeat pulse */}
<div className="relative mt-4">
  {/* ❌ À SUPPRIMER — Heartbeat rings */}
  <span className="absolute -inset-3 rounded-full border-2 border-yield-gold/60 animate-[heartbeat_1.8s_ease-in-out_infinite] shadow-[0_0_15px_rgba(201,168,76,0.4)] motion-reduce:animate-none" />
  <span className="absolute -inset-5 rounded-full border border-yield-gold/30 animate-[heartbeat_1.8s_ease-in-out_0.3s_infinite] shadow-[0_0_25px_rgba(201,168,76,0.2)] motion-reduce:animate-none" />
  <a
    href={`/${locale}/coulisses`}
    className={cn(
      'relative inline-flex items-center gap-3',
      'rounded-full border-2 border-yield-gold px-8 py-3',
      'text-base font-mono text-yield-gold',
      'shadow-[0_0_20px_rgba(201,168,76,0.25)]',
      'transition-all hover:bg-yield-gold/10 hover:scale-105',  // ❌ scale à supprimer
      'hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]',
    )}
  >
    {/* ❌ animate-[pulse-dot...] à supprimer */}
    <span className="inline-block w-3 h-3 rounded-full bg-yield-gold shadow-[0_0_8px_rgba(201,168,76,0.8)] animate-[pulse-dot_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
    {locale === 'fr' ? 'Voir les Coulisses' : 'Behind the Scenes'}
  </a>
</div>
```

### Code cible (remplacement)
```tsx
{/* 8. CTA Coulisses — hover teinte simple */}
<a
  href={`/${locale}/coulisses`}
  className={cn(
    'inline-flex items-center gap-3',
    'rounded-full border-2 border-yield-gold px-8 py-3',
    'text-base font-mono text-yield-gold',
    'shadow-[0_0_20px_rgba(201,168,76,0.25)]',
    'transition-colors duration-200',
    'hover:bg-yield-gold/15',
  )}
>
  {/* Point statique — indicateur live */}
  <span className="inline-block w-3 h-3 rounded-full bg-yield-gold shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
  {locale === 'fr' ? 'Voir les Coulisses' : 'Behind the Scenes'}
</a>
```

### Keyframes dans globals.css à vérifier
```css
/* globals.css lignes ~255-270 — supprimer si plus utilisées */
@keyframes heartbeat { ... }
@keyframes pulse-dot { ... }
```

Commande de vérification avant suppression :
```bash
grep -rn "heartbeat\|pulse-dot" src/ --include="*.tsx" --include="*.css"
```

### Fichier unique à modifier
```
src/components/dashboard/HeroSection.tsx
src/app/globals.css  (si keyframes plus utilisées)
```

### Contraintes importantes
- **Ne pas toucher** au reste de `HeroSection.tsx` (Aurora, Avatar, AlertBanner, Marquee, KpiGrid)
- **Ne pas modifier** `tailwind.config.ts`
- Le `<Link>` de navigation reste fonctionnel
- `motion-reduce:animate-none` devient inutile si on supprime toutes les animations → supprimer aussi

### Project Structure Notes
- Fichier principal : `src/components/dashboard/HeroSection.tsx`
- Fichier CSS : `src/app/globals.css` (conditionnellement)
- Aucun nouveau fichier à créer

### References
- [Source: src/components/dashboard/HeroSection.tsx#lignes 124-143] — CTA heartbeat actuel
- [Source: src/app/globals.css#lignes 253-270] — keyframes heartbeat + pulse-dot
- [Source: docs/planning-artifacts/epics.md#Epic 8 Story 8.3]
- [Source: GitHub Issue #12 feedback #3] — Bryan : "animation plus lente et pas aussi agité, juste un bouton qui change de teinte quand on passe dessus"

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (create-story)

### Debug Log References

### Completion Notes List

### File List
