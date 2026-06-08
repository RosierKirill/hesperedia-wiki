'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/articles', label: 'Articles', icon: '📜' },
  { href: '/admin/characters', label: 'Personnages', icon: '⚔' },
  { href: '/admin/bestiary', label: 'Bestiaire', icon: '🦷' },
  { href: '/admin/map', label: 'Carte', icon: '🗺' },
  { href: '/admin/media', label: 'Médias', icon: '🖼' },
  { href: '/admin/moderation', label: 'Modération', icon: '🛡' },
  { href: '/admin/users', label: 'Utilisateurs', icon: '👥' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user !== null && !isAdmin) {
      router.replace('/')
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-ui text-ink/60 dark:text-parchment-400">Vérification des droits…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-parchment-100 dark:bg-nihil-900">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-parchment-50 dark:bg-nihil-800 border-r border-parchment-300 dark:border-nihil-700">
        <div className="p-4 border-b border-parchment-300 dark:border-nihil-700">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lumen-500">✦</span>
            <span className="font-heading text-sm font-bold text-ink dark:text-parchment-100">Admin</span>
          </Link>
        </div>
        <nav className="p-2">
          {sidebarLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded text-sm font-ui transition-colors mb-0.5',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-lumen-100 dark:bg-lumen-900/30 text-lumen-700 dark:text-lumen-300 font-medium'
                  : 'text-ink/70 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-nihil-700',
              )}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-60 p-4 border-t border-parchment-300 dark:border-nihil-700">
          <p className="text-xs font-ui text-ink/50 dark:text-parchment-500 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
