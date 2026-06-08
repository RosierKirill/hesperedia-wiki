import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <p className="text-6xl">○</p>
        <h1 className="font-heading text-4xl font-black text-ink dark:text-parchment-100">404 — Page Introuvable</h1>
        <p className="font-body text-lg italic text-ink/60 dark:text-parchment-400 max-w-sm mx-auto">
          Cette page a été engloutie par le Vide. Même les Revenants ne peuvent la retrouver.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-lumen-600 hover:bg-lumen-700 text-white font-ui font-medium transition-colors"
        >
          Retour à l&apos;Accueil
        </Link>
      </div>
    </div>
  )
}
