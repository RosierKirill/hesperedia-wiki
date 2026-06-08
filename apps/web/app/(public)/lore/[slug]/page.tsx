import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Article } from '@hesperedia/shared-types'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { Badge } from '@/components/ui/Badge'
import { ArticleRenderer } from '@/components/ArticleRenderer'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

interface ArticlePageProps {
  params: { slug: string }
}

async function getArticle(slug: string) {
  try {
    const { data } = await api.get<{ data: Article & { avgRating?: number; ratingCount?: number } }>(`/articles/${slug}`)
    return data.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Article introuvable' }
  return {
    title: article.title,
    description: article.excerpt ?? article.content.slice(0, 160),
    openGraph: {
      title: `${article.title} | Hesperedia Wiki`,
      description: article.excerpt ?? article.content.slice(0, 160),
      images: article.coverImageUrl ? [{ url: article.coverImageUrl, alt: article.title }] : [],
      type: 'article',
    },
  }
}

const categoryLabels: Record<string, string> = {
  HISTORY: 'Histoire', MAGIC_SYSTEM: 'Magie', CULTURE: 'Culture',
  RELIGION: 'Religion', GEOGRAPHY: 'Géographie', POLITICS: 'Politique',
  EVENT: 'Événement', MYTHOLOGY: 'Mythologie',
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="default">{categoryLabels[article.category] ?? article.category}</Badge>
          {article.magicForces.map((f) => <ForceBadge key={f} force={f} size="sm" />)}
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-black text-ink dark:text-parchment-100 leading-tight mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="font-body text-xl text-ink/70 dark:text-parchment-300 italic leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 mt-4 text-sm font-ui text-ink/50 dark:text-parchment-500">
          <span>{formatDate(article.publishedAt)}</span>
          {article.avgRating && (
            <span>★ {article.avgRating.toFixed(1)} ({article.ratingCount} votes)</span>
          )}
        </div>
      </header>

      {/* Cover image */}
      {article.coverImageUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-parchment-300 dark:border-nihil-700">
          <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <ArticleRenderer content={article.content} />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-parchment-200 dark:border-nihil-700">
          <p className="text-xs font-ui text-ink/60 dark:text-parchment-500 uppercase tracking-widest mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
