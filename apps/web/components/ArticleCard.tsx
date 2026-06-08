'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@hesperedia/shared-types'
import { ForceBadge } from './ui/ForceBadge'
import { Badge } from './ui/Badge'
import { cn, formatDate } from '@/lib/utils'

interface ArticleCardProps {
  article: Article & { avgRating?: number; ratingCount?: number }
}

const categoryLabels: Record<string, string> = {
  HISTORY: 'Histoire',
  MAGIC_SYSTEM: 'Magie',
  CULTURE: 'Culture',
  RELIGION: 'Religion',
  GEOGRAPHY: 'Géographie',
  POLITICS: 'Politique',
  EVENT: 'Événement',
  MYTHOLOGY: 'Mythologie',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note: ${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn('text-xs', i < Math.round(rating) ? 'text-lumen-500' : 'text-parchment-400 dark:text-nihil-600')}>
          ★
        </span>
      ))}
      <span className="text-xs text-ink/50 dark:text-parchment-400 ml-1 font-ui">{rating.toFixed(1)}</span>
    </div>
  )
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/lore/${article.slug}`} className="block group">
      <div className="rounded-lg overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 h-full hover:border-lumen-400/50 dark:hover:border-lumen-700/50 transition-colors">
        <div className="relative aspect-video overflow-hidden bg-parchment-200 dark:bg-nihil-900">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-parchment-300 to-parchment-400 dark:from-nihil-800 dark:to-nihil-700">
              <span className="text-3xl opacity-20">📜</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <Badge variant="default" className="text-xs">
            {categoryLabels[article.category] ?? article.category}
          </Badge>
          <h3 className="font-heading text-ink dark:text-parchment-100 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-lumen-600 dark:group-hover:text-lumen-400 transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-xs text-ink/70 dark:text-parchment-400 font-body line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {article.magicForces.slice(0, 3).map((f) => (
              <ForceBadge key={f} force={f} size="sm" showLabel={false} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            {article.avgRating ? <StarRating rating={article.avgRating} /> : <span />}
            <span className="text-xs text-ink/50 dark:text-parchment-500 font-ui">
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
