'use client'

import { useState } from 'react'
import { ArticleCategory, MagicForce } from '@hesperedia/shared-types'
import { Article, PaginatedResponse } from '@hesperedia/shared-types'
import { useArticles } from '@/hooks/useApi'
import { ArticleCard } from '@/components/ArticleCard'
import { ArticleCardSkeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { cn } from '@/lib/utils'

const categoryLabels: Record<ArticleCategory, string> = {
  [ArticleCategory.HISTORY]: 'Histoire',
  [ArticleCategory.MAGIC_SYSTEM]: 'Magie',
  [ArticleCategory.CULTURE]: 'Culture',
  [ArticleCategory.RELIGION]: 'Religion',
  [ArticleCategory.GEOGRAPHY]: 'Géographie',
  [ArticleCategory.POLITICS]: 'Politique',
  [ArticleCategory.EVENT]: 'Événement',
  [ArticleCategory.MYTHOLOGY]: 'Mythologie',
}

export default function LorePage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<ArticleCategory | ''>('')
  const [force, setForce] = useState<MagicForce | ''>('')

  const params = { page, pageSize: 12, ...(category ? { category } : {}), ...(force ? { force } : {}) }
  const { data, isLoading } = useArticles(params)
  const paginated = data as PaginatedResponse<Article> | undefined

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-parchment-100 mb-2">Lore</h1>
        <p className="font-body text-ink/60 dark:text-parchment-400 italic text-lg">
          Histoire, magie, culture et mythologie d&apos;Hesperedia
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Catégorie</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setCategory(''); setPage(1) }}
              className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                !category ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
            >Toutes</button>
            {Object.values(ArticleCategory).map((c) => (
              <button key={c} onClick={() => { setCategory(c === category ? '' : c); setPage(1) }}
                className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                  c === category ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
              >{categoryLabels[c]}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-ui font-medium text-ink/60 dark:text-parchment-400 uppercase tracking-wider mb-2">Force Magique</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setForce(''); setPage(1) }}
              className={cn('px-3 py-1.5 rounded-full text-sm font-ui transition-colors border',
                !force ? 'bg-lumen-600 text-white border-lumen-600' : 'border-parchment-300 dark:border-nihil-600 text-ink/70 dark:text-parchment-400 hover:bg-parchment-200 dark:hover:bg-nihil-800')}
            >Toutes</button>
            {Object.values(MagicForce).map((f) => (
              <button key={f} onClick={() => { setForce(f === force ? '' : f); setPage(1) }}
                className={cn(f === force ? 'ring-2 ring-offset-2 ring-offset-parchment-100 dark:ring-offset-nihil-900' : '')}
              ><ForceBadge force={f} size="sm" /></button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <ArticleCardSkeleton key={i} />)
          : paginated?.data.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>

      {paginated && (
        <Pagination page={paginated.page} totalPages={paginated.totalPages} onChange={setPage} />
      )}
    </div>
  )
}
