'use client'

import { useAdminStats } from '@/hooks/useApi'
import { Skeleton } from '@/components/ui/Skeleton'

interface Stats {
  articles: { total: number; published: number; drafts: number }
  characters: number
  creatures: number
  factions: number
  pendingComments: number
  openProposals: number
}

function StatCard({ label, value, icon, sub }: { label: string; value: number; icon: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs font-ui text-ink/50 dark:text-parchment-500">{sub}</span>}
      </div>
      <p className="text-3xl font-heading font-bold text-ink dark:text-parchment-100 mb-1">{value.toLocaleString('fr-FR')}</p>
      <p className="text-sm font-ui text-ink/60 dark:text-parchment-400">{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminStats()
  const s = stats as Stats | undefined

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100 mb-8">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard label="Articles Publiés" value={s?.articles.published ?? 0} icon="📜" sub={`${s?.articles.drafts ?? 0} brouillons`} />
          <StatCard label="Personnages" value={s?.characters ?? 0} icon="⚔" />
          <StatCard label="Créatures" value={s?.creatures ?? 0} icon="🦷" />
          <StatCard label="Factions" value={s?.factions ?? 0} icon="⚜" />
          <StatCard label="Commentaires en Attente" value={s?.pendingComments ?? 0} icon="💬" />
          <StatCard label="Propositions Ouvertes" value={s?.openProposals ?? 0} icon="🗳" />
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-6">
          <h2 className="font-heading text-lg font-semibold text-ink dark:text-parchment-100 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/articles/new', label: 'Nouvel Article', icon: '📝' },
              { href: '/admin/characters/new', label: 'Nouveau Personnage', icon: '⚔' },
              { href: '/admin/bestiary/new', label: 'Nouvelle Créature', icon: '🦷' },
              { href: '/admin/moderation', label: 'Modérer', icon: '🛡' },
            ].map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-parchment-200 dark:border-nihil-600 hover:border-lumen-400 dark:hover:border-lumen-700 transition-colors text-sm font-ui text-ink dark:text-parchment-200"
              >
                <span>{icon}</span>{label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
