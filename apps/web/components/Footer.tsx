import Link from 'next/link'
import { MagicForce } from '@hesperedia/shared-types'
import { FORCE_ICONS, FORCE_LABELS } from '@/lib/utils'

const navColumns = [
  {
    title: 'Monde',
    links: [
      { href: '/map', label: 'Carte Interactive' },
      { href: '/characters', label: 'Personnages' },
      { href: '/bestiary', label: 'Bestiaire' },
      { href: '/factions', label: 'Factions' },
    ],
  },
  {
    title: 'Lore',
    links: [
      { href: '/lore', label: 'Articles' },
      { href: '/lore?category=HISTORY', label: 'Histoire' },
      { href: '/lore?category=MAGIC_SYSTEM', label: 'Système de Magie' },
      { href: '/lore?category=RELIGION', label: 'Religions' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { href: '/community', label: 'Communauté' },
      { href: '/projects', label: 'Projets' },
      { href: '/login', label: 'Connexion' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-nihil-900 text-parchment-300 border-t border-nihil-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lumen-500 text-xl">✦</span>
              <span className="font-heading text-lg font-bold text-parchment-100">HESPEREDIA</span>
            </div>
            <p className="text-sm font-body text-parchment-400 leading-relaxed">
              L&apos;encyclopédie complète d&apos;un univers fantasy forgé par six forces primordiales.
            </p>
            {/* Forces */}
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.values(MagicForce).map((force) => (
                <span key={force} className="text-sm text-parchment-500 hover:text-parchment-200 transition-colors" title={FORCE_LABELS[force]}>
                  {FORCE_ICONS[force]}
                </span>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-ui text-xs font-semibold text-parchment-500 uppercase tracking-widest mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-ui text-parchment-400 hover:text-parchment-100 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-nihil-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-ui text-parchment-600">
            © {new Date().getFullYear()} Hesperedia Wiki. Univers fictif.
          </p>
          <p className="text-xs font-ui text-parchment-600 italic font-body">
            &quot;Par la Lumière et le Vide, le monde tient.&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}
