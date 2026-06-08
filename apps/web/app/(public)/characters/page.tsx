'use client'

import { useState } from 'react'
import { MagicForce, CharacterStatus } from '@hesperedia/shared-types'
import { Character, PaginatedResponse } from '@hesperedia/shared-types'
import { useCharacters } from '@/hooks/useApi'
import { CharacterCard } from '@/components/CharacterCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

const statusLabels: Record<CharacterStatus, string> = {
  [CharacterStatus.ALIVE]: 'Vivant',
  [CharacterStatus.DECEASED]: 'Décédé',
  [CharacterStatus.UNDEAD]: 'Mort-Vivant',
  [CharacterStatus.UNKNOWN]: 'Inconnu',
  [CharacterStatus.TRANSFORMED]: 'Transformé',
}

export default function CharactersPage() {
  const [page, setPage] = useState(1)
  const [selectedForce, setSelectedForce] = useState<MagicForce | ''>('')
  const [selectedStatus, setSelectedStatus] = useState<CharacterStatus | ''>('')

  const params = {
    page,
    pageSize: 20,
    ...(selectedForce ? { force: selectedForce } : {}),
    ...(selectedStatus ? { status: selectedStatus } : {}),
  }

  const { data, isLoading } = useCharacters(params)
  const paginated = data as PaginatedResponse<Character> | undefined

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-parchment-100 mb-2">Personnages</h1>
        <p className="font-body text-ink/60 dark:text-parchment-400 italic text-lg">
          Les héros, vilains et figures légendaires d&apos;Hesperedia
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Force Magique</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedForce(''); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                !selectedForce
                  ? 'bg-lumen-600 text-white border-lumen-600'
                  : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800',
              )}
            >
              Toutes
            </button>
            {Object.values(MagicForce).map((f) => (
              <button
                key={f}
                onClick={() => { setSelectedForce(f === selectedForce ? '' : f); setPage(1) }}
                className={cn(f === selectedForce ? 'ring-2 ring-offset-2 ring-offset-parchment-100 dark:ring-offset-nihil-900' : '')}
              >
                <ForceBadge force={f} size="sm" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Statut</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedStatus(''); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                !selectedStatus
                  ? 'bg-lumen-600 text-white border-lumen-600'
                  : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800',
              )}
            >
              Tous
            </button>
            {Object.values(CharacterStatus).map((s) => (
              <button
                key={s}
                onClick={() => { setSelectedStatus(s === selectedStatus ? '' : s); setPage(1) }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  s === selectedStatus
                    ? 'bg-lumen-600 text-white border-lumen-600'
                    : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800',
                )}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {paginated && (
          <p className="text-sm font-ui text-ink/50 dark:text-parchment-500">
            {paginated.total} personnage{paginated.total !== 1 ? 's' : ''} trouvé{paginated.total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
        {isLoading
          ? Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)
          : paginated?.data.map((c) => <CharacterCard key={c.id} character={c} />)}
      </div>

      {paginated && (
        <Pagination page={paginated.page} totalPages={paginated.totalPages} onChange={setPage} />
      )}
    </div>
  )
}
