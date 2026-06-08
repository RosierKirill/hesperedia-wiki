'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useCreatures } from '@/hooks/useApi'
import { Creature, PaginatedResponse } from '@hesperedia/shared-types'
import { Badge } from '@/components/ui/Badge'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { DangerMeter } from '@/components/ui/DangerMeter'
import { Pagination } from '@/components/ui/Pagination'
import { api } from '@/lib/api'

export default function AdminBestiaryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCreatures({ page, pageSize: 20 })
  const paginated = data as PaginatedResponse<Creature> | undefined
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/bestiary/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['creatures'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100">Bestiaire</h1>
        <Link
          href="/admin/bestiary/new/edit"
          className="px-4 py-2 rounded bg-lumen-600 hover:bg-lumen-700 text-white font-ui text-sm font-medium transition-colors"
        >
          + Nouvelle créature
        </Link>
      </div>

      <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-parchment-300 dark:border-nihil-700 bg-parchment-100 dark:bg-nihil-900">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider">Portrait</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider">Nom</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Force</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Danger</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Publié</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-200 dark:divide-nihil-700">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-parchment-200 dark:bg-nihil-700 rounded animate-pulse" /></td>
                  ))}
                  <td />
                </tr>
              ))
              : (paginated?.data ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-parchment-100 dark:hover:bg-nihil-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-parchment-200 dark:bg-nihil-700 shrink-0">
                      {c.portraitUrl && <Image src={c.portraitUrl} alt={c.name} fill className="object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-heading text-sm font-medium text-ink dark:text-parchment-100">{c.name}</p>
                    {c.subcategory && <p className="text-xs font-body italic text-ink/50 dark:text-parchment-500">{c.subcategory}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="default">{c.category.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {c.primaryForce && <ForceBadge force={c.primaryForce} size="sm" />}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {c.dangerLevel != null && <DangerMeter level={c.dangerLevel} size="sm" />}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={c.publishedAt ? 'success' : 'default'}>{c.publishedAt ? 'Oui' : 'Non'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/bestiary/${c.id}/edit`} className="text-xs font-ui text-lumen-600 dark:text-lumen-400 hover:underline">Éditer</Link>
                      <button
                        onClick={() => { if (confirm(`Supprimer ${c.name} ?`)) deleteMutation.mutate(c.id) }}
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
