'use client'

import { useState } from 'react'
import { MagicForce, CreatureCategory } from '@hesperedia/shared-types'
import { Creature, PaginatedResponse } from '@hesperedia/shared-types'
import { useCreatures } from '@/hooks/useApi'
import { CreatureCard } from '@/components/CreatureCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { cn } from '@/lib/utils'

const categoryLabels: Record<CreatureCategory, string> = {
  [CreatureCategory.SANGUIS_CORRUPTION]: 'Corruption Sanguis',
  [CreatureCategory.NIHIL_CORRUPTION]: 'Corruption Nihil',
  [CreatureCategory.MONSTER]: 'Monstre',
  [CreatureCategory.DEMON]: 'Démon',
  [CreatureCategory.ORLA_ENTITY]: "Entité Orla",
  [CreatureCategory.TRANSFORMED_ANIMAL]: 'Animal Transformé',
  [CreatureCategory.HYBRID]: 'Hybride',
  [CreatureCategory.DEEP_CREATURE]: 'Créature des Profondeurs',
}

const dangerRanges = [
  { key: 'low', label: '💀 Faible (1-3)' },
  { key: 'medium', label: '💀💀 Moyen (4-6)' },
  { key: 'high', label: '💀💀💀 Élevé (7-10)' },
]

export default function BestiaryPage() {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<CreatureCategory | ''>('')
  const [selectedForce, setSelectedForce] = useState<MagicForce | ''>('')
  const [selectedDanger, setSelectedDanger] = useState('')

  const params = {
    page,
    pageSize: 20,
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(selectedForce ? { force: selectedForce } : {}),
    ...(selectedDanger ? { danger: selectedDanger } : {}),
  }

  const { data, isLoading } = useCreatures(params)
  const paginated = data as PaginatedResponse<Creature> | undefined

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-parchment-100 mb-2">Bestiaire</h1>
        <p className="font-body text-ink/60 dark:text-parchment-400 italic text-lg">
          Créatures, monstres et entités qui peuplent Hesperedia
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Catégorie</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1) }}
              className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                !selectedCategory ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
            >
              Toutes
            </button>
            {Object.values(CreatureCategory).map((c) => (
              <button key={c}
                onClick={() => { setSelectedCategory(c === selectedCategory ? '' : c); setPage(1) }}
                className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  c === selectedCategory ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Danger</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setSelectedDanger(''); setPage(1) }}
                className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  !selectedDanger ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
              >Tous</button>
              {dangerRanges.map((d) => (
                <button key={d.key} onClick={() => { setSelectedDanger(d.key === selectedDanger ? '' : d.key); setPage(1) }}
                  className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                    d.key === selectedDanger ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
                >{d.label}</button>
              ))}
            </div>
          </div>
        </div>

        {paginated && (
          <p className="text-sm font-ui text-ink/50 dark:text-parchment-500">
            {paginated.total} créature{paginated.total !== 1 ? 's' : ''} trouvée{paginated.total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
        {isLoading
          ? Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)
          : paginated?.data.map((c) => <CreatureCard key={c.id} creature={c} />)}
      </div>

      {paginated && (
        <Pagination page={paginated.page} totalPages={paginated.totalPages} onChange={setPage} />
      )}
    </div>
  )
}
