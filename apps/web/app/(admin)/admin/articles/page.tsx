'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useArticles } from '@/hooks/useApi'
import { Article, PaginatedResponse } from '@hesperedia/shared-types'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function AdminArticlesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useArticles({ page, pageSize: 20 })
  const paginated = data as PaginatedResponse<Article> | undefined
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/articles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100">Articles</h1>
        <Link
          href="/admin/articles/new/edit"
          className="px-4 py-2 rounded bg-lumen-600 hover:bg-lumen-700 text-white font-ui text-sm font-medium transition-colors"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-parchment-300 dark:border-nihil-700 bg-parchment-100 dark:bg-nihil-900">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider">Titre</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Featured</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Publié</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden xl:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-200 dark:divide-nihil-700">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-parchment-200 dark:bg-nihil-700 rounded animate-pulse w-full" /></td>
                  ))}
                  <td />
                </tr>
              ))
              : (paginated?.data ?? []).map((a) => (
                <tr key={a.id} className="hover:bg-parchment-100 dark:hover:bg-nihil-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-heading text-sm font-medium text-ink dark:text-parchment-100 max-w-xs truncate">{a.title}</p>
                    <p className="text-xs font-ui text-ink/40 dark:text-parchment-600">{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="default">{a.category}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={a.featured ? 'warning' : 'default'}>{a.featured ? 'Oui' : 'Non'}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={a.publishedAt ? 'success' : 'default'}>{a.publishedAt ? 'Oui' : 'Non'}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs font-ui text-ink/50 dark:text-parchment-500">{formatDate(a.publishedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/articles/${a.id}/edit`} className="text-xs font-ui text-lumen-600 dark:text-lumen-400 hover:underline">Éditer</Link>
                      <button
                        onClick={() => { if (confirm(`Supprimer "${a.title}" ?`)) deleteMutation.mutate(a.id) }}
                        className="text-xs font-ui text-sanguis-600 dark:text-sanguis-400 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="mt-6">
          <Pagination page={paginated.page} totalPages={paginated.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
