# Deferred Work

Fichier de tracking des findings de code review reportés à une story ultérieure.
Géré automatiquement par `bmad-code-review`.

---

## Deferred from: code review of 1-1-setup-nextjs-15-react-19 (2026-04-11)

- **`html lang="en"` hardcodé** [`src/app/layout.tsx:26`] — sera géré par next-intl en Story 1.4 (lang dynamique FR/EN)
- **Metadata boilerplate "Create Next App"** [`src/app/layout.tsx:15-18`] — page template à remplacer en Story 3.13 (HeroSection)
- **`font-family: Arial` en body écrase `@theme inline`** [`src/app/globals.css:24`] — globals.css sera réécrit en Story 1.2 (design tokens Tailwind 4)
- **`@types/node ^20` sans `@cloudflare/workers-types`** [`package.json:18`] — setup Cloudflare runtime types prévu lors du déploiement (Epic 7)
- **`next.config.ts` vide — stratégie déploiement Cloudflare non définie** [`next.config.ts:3`] — output strategy à configurer en Epic 7 (static export ou @cloudflare/next-on-pages)
- **`next/font/google` réseau requis au build** [`src/app/layout.tsx:2`] — risque acceptable en dev local; polices cachées par Next.js, à valider sur Cloudflare Pages CI en Epic 7
