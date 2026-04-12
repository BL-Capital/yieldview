import Link from 'next/link'

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yield-dark-base">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
          Page introuvable
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/fr"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
