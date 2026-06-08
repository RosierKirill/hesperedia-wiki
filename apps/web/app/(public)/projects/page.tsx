'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Project, ProjectType, ProjectStatus } from '@hesperedia/shared-types'
import { useProjects } from '@/hooks/useApi'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const statusLabels: Record<string, string> = {
  ANNOUNCED: 'Annoncé', IN_DEVELOPMENT: 'En Développement',
  DEMO_AVAILABLE: 'Démo Disponible', RELEASED: 'Disponible',
  ON_HOLD: 'En Pause', CANCELLED: 'Annulé',
}

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'outline'> = {
  ANNOUNCED: 'outline', IN_DEVELOPMENT: 'warning',
  DEMO_AVAILABLE: 'success', RELEASED: 'success',
  ON_HOLD: 'default', CANCELLED: 'danger',
}

const typeLabels: Record<string, string> = {
  VIDEO_GAME: 'Jeu Vidéo', TABLETOP_GAME: 'Jeu de Plateau',
  COMIC: 'Comic', MANGA: 'Manga', ANIMATION: 'Animation',
  NOVEL: 'Roman', SHORT_FILM: 'Court-Métrage', OTHER: 'Autre',
}

export default function ProjectsPage() {
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  const { data: projects, isLoading } = useProjects(
    Object.fromEntries([...(type ? [['type', type]] : []), ...(status ? [['status', status]] : [])]),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-parchment-100 mb-2">Projets</h1>
        <p className="font-body text-ink/60 dark:text-parchment-400 italic text-lg">
          Hesperedia prend vie dans de multiples formats créatifs
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {['', ...Object.values(ProjectType)].map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  t === type ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
              >{t ? typeLabels[t] ?? t : 'Tous'}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Statut</p>
          <div className="flex flex-wrap gap-2">
            {['', ...Object.values(ProjectStatus)].map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  s === status ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
              >{s ? statusLabels[s] ?? s : 'Tous'}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-video rounded-lg" />)
          : (projects as Project[] ?? []).map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
                <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 overflow-hidden hover:border-lumen-400/50 dark:hover:border-lumen-700/50 transition-colors h-full">
                  <div className="relative aspect-video bg-nihil-900">
                    {p.coverImageUrl ? (
                      <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl opacity-20">🎮</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{typeLabels[p.type] ?? p.type}</Badge>
                      <Badge variant={statusVariants[p.status]}>{statusLabels[p.status] ?? p.status}</Badge>
                    </div>
                    <h2 className="font-heading text-ink dark:text-parchment-100 font-semibold group-hover:text-lumen-600 dark:group-hover:text-lumen-400 transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-sm font-body text-ink/70 dark:text-parchment-400 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  )
}
