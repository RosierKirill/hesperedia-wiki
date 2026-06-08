'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ArticleCategory, MagicForce } from '@hesperedia/shared-types'
import { Button } from '@/components/ui/Button'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { cn } from '@/lib/utils'

const EditorComponent = dynamic(
  () => import('@/components/admin/ArticleEditor').then((m) => m.ArticleEditor),
  { ssr: false, loading: () => <div className="h-96 rounded-lg bg-parchment-200 dark:bg-nihil-700 animate-pulse" /> },
)

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

interface ArticleEditPageProps {
  params: { slug: string }
}

export default function ArticleEditPage({ params }: ArticleEditPageProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isNew = params.slug === 'new'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<ArticleCategory>(ArticleCategory.HISTORY)
  const [tags, setTags] = useState('')
  const [forces, setForces] = useState<MagicForce[]>([])
  const [featured, setFeatured] = useState(false)
  const [slug, setSlug] = useState('')

  const { data: article } = useQuery({
    queryKey: ['article-edit', params.slug],
    queryFn: async () => {
      const { data } = await api.get(`/articles/${params.slug}`)
      return data.data
    },
    enabled: !isNew,
  })

  useEffect(() => {
    if (article) {
      setTitle((article as { title: string }).title ?? '')
      setContent((article as { content: string }).content ?? '')
      setExcerpt((article as { excerpt: string }).excerpt ?? '')
      setCategory((article as { category: ArticleCategory }).category ?? ArticleCategory.HISTORY)
      setTags(((article as { tags: string[] }).tags ?? []).join(', '))
      setForces((article as { magicForces: MagicForce[] }).magicForces ?? [])
      setFeatured((article as { featured: boolean }).featured ?? false)
      setSlug((article as { slug: string }).slug ?? '')
    }
  }, [article])

  const saveMutation = useMutation({
    mutationFn: (publish: boolean) => {
      const payload = {
        title, content, excerpt, category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        magicForces: forces, featured, slug: slug || undefined,
        publishedAt: publish ? new Date().toISOString() : null,
      }
      return isNew
        ? api.post('/articles', payload)
        : api.put(`/articles/${params.slug}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      router.push('/admin/articles')
    },
  })

  const toggleForce = (f: MagicForce) => {
    setForces((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-ink dark:text-parchment-100">
          {isNew ? 'Nouvel Article' : 'Modifier l\'Article'}
        </h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => saveMutation.mutate(false)} isLoading={saveMutation.isPending}>
            Brouillon
          </Button>
          <Button onClick={() => saveMutation.mutate(true)} isLoading={saveMutation.isPending}>
            Publier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="w-full px-4 py-3 text-xl font-heading rounded-lg border border-parchment-300 dark:border-nihil-600 bg-parchment-50 dark:bg-nihil-800 text-ink dark:text-parchment-100 focus:outline-none focus:ring-2 focus:ring-lumen-500/50"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Extrait (affiché dans les listes)"
            rows={2}
            className="w-full px-4 py-3 text-sm font-body italic rounded-lg border border-parchment-300 dark:border-nihil-600 bg-parchment-50 dark:bg-nihil-800 text-ink dark:text-parchment-100 focus:outline-none focus:ring-2 focus:ring-lumen-500/50 resize-none"
          />
          <div className="min-h-[500px] rounded-lg border border-parchment-300 dark:border-nihil-600 overflow-hidden">
            <EditorComponent content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5 space-y-4">
            <div>
              <label className="block text-xs font-ui font-medium text-ink/60 dark:text-parchment-500 uppercase tracking-wider mb-2">Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-généré si vide"
                className="w-full px-3 py-2 text-sm font-mono rounded border border-parchment-200 dark:border-nihil-600 bg-parchment-100 dark:bg-nihil-700 text-ink dark:text-parchment-100 focus:outline-none focus:ring-1 focus:ring-lumen-500"
              />
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-ink/60 dark:text-parchment-500 uppercase tracking-wider mb-2">Catégorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-3 py-2 text-sm font-ui rounded border border-parchment-200 dark:border-nihil-600 bg-parchment-100 dark:bg-nihil-700 text-ink dark:text-parchment-100 focus:outline-none focus:ring-1 focus:ring-lumen-500"
              >
                {Object.values(ArticleCategory).map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-ink/60 dark:text-parchment-500 uppercase tracking-wider mb-2">Tags (séparés par virgule)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="histoire, magie, ..."
                className="w-full px-3 py-2 text-sm font-ui rounded border border-parchment-200 dark:border-nihil-600 bg-parchment-100 dark:bg-nihil-700 text-ink dark:text-parchment-100 focus:outline-none focus:ring-1 focus:ring-lumen-500"
              />
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-ink/60 dark:text-parchment-500 uppercase tracking-wider mb-2">Forces Magiques</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(MagicForce).map((f) => (
                  <button key={f} onClick={() => toggleForce(f)}
                    className={cn('transition-all', forces.includes(f) ? 'ring-2 ring-offset-1 ring-lumen-500' : 'opacity-50 hover:opacity-80')}
                  >
                    <ForceBadge force={f} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-parchment-300 dark:border-nihil-600 text-lumen-600"
              />
              <label htmlFor="featured" className="text-sm font-ui text-ink dark:text-parchment-200">Article mis en avant</label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
