import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="bg-[#0a1628] text-zinc-100 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Page introuvable
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-8">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            href="/fr"
            className="inline-flex items-center justify-center rounded-lg bg-[#c9a84c] text-[#0a1628] px-6 py-3 text-sm font-medium hover:bg-[#c9a84c]/80 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  )
}
