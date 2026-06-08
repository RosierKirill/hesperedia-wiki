'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { SearchBar } from './ui/SearchBar'

const navLinks = [
  { href: '/map', label: 'Carte' },
  { href: '/characters', label: 'Personnages' },
  { href: '/bestiary', label: 'Bestiaire' },
  { href: '/lore', label: 'Lore' },
  { href: '/projects', label: 'Projets' },
  { href: '/community', label: 'Communauté' },
]

export function NavBar() {
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-parchment-100/95 dark:bg-nihil-900/95 backdrop-blur-md border-b border-parchment-300 dark:border-nihil-700 shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lumen-500 text-xl" aria-hidden>✦</span>
            <span className="font-heading text-lg font-bold text-ink dark:text-parchment-100 tracking-wider">
              HESPEREDIA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 text-sm font-ui font-medium rounded transition-colors',
                  pathname.startsWith(href)
                    ? 'text-lumen-600 dark:text-lumen-400 bg-lumen-50 dark:bg-lumen-900/20'
                    : 'text-ink/70 dark:text-parchment-300 hover:text-ink dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-nihil-800',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <SearchBar className="hidden md:block w-52 lg:w-64" />

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden lg:block text-xs font-ui px-2 py-1 rounded bg-lumen-100 dark:bg-lumen-900/30 text-lumen-700 dark:text-lumen-300 border border-lumen-300 dark:border-lumen-700"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="hidden lg:block text-sm font-ui text-ink/70 dark:text-parchment-300">
                    {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-ui text-ink/60 dark:text-parchment-400 hover:text-sanguis-600 dark:hover:text-sanguis-400 transition-colors px-2 py-1 rounded"
                    aria-label="Se déconnecter"
                  >
                    Déco
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-ui font-medium px-3 py-1.5 rounded border border-lumen-400 dark:border-lumen-700 text-lumen-700 dark:text-lumen-300 hover:bg-lumen-50 dark:hover:bg-lumen-900/20 transition-colors"
              >
                Connexion
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded hover:bg-parchment-200 dark:hover:bg-nihil-800 transition-colors"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
            >
              <span className="block w-5 h-0.5 bg-ink dark:bg-parchment-100 mb-1 transition-all" />
              <span className="block w-5 h-0.5 bg-ink dark:bg-parchment-100 mb-1 transition-all" />
              <span className="block w-5 h-0.5 bg-ink dark:bg-parchment-100 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-900"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-3 space-y-1">
              <SearchBar className="w-full mb-3" />
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 text-sm font-ui rounded transition-colors',
                    pathname.startsWith(href)
                      ? 'text-lumen-600 dark:text-lumen-400 bg-lumen-50 dark:bg-lumen-900/20'
                      : 'text-ink/70 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-nihil-800',
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
