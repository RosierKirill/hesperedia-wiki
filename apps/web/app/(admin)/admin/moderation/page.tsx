'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface PendingComment {
  id: string
  content: string
  createdAt: string
  user: { username: string }
  article: { title: string; slug: string }
}

function PendingComments() {
  const queryClient = useQueryClient()
  const { data: comments, isLoading } = useQuery({
    queryKey: ['admin', 'pending-comments'],
    queryFn: async () => {
      const { data } = await api.get<{ data: PendingComment[] }>('/admin/comments/pending')
      return data.data
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/admin/comments/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending-comments'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/articles/0/comments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending-comments'] }),
  })

  if (isLoading) return <p className="text-ink/50 dark:text-parchment-500 font-ui text-sm">Chargement…</p>
  if (!comments?.length) return <p className="text-ink/50 dark:text-parchment-500 font-ui text-sm">Aucun commentaire en attente.</p>

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="rounded-lg border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-heading font-semibold text-ink dark:text-parchment-100">{c.user.username}</span>
                <span className="text-xs font-ui text-ink/50 dark:text-parchment-500">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm font-body text-ink/80 dark:text-parchment-300 mb-2 line-clamp-3">{c.content}</p>
              <p className="text-xs font-ui text-ink/50 dark:text-parchment-500">
                Article : <span className="text-lumen-600 dark:text-lumen-400">{c.article.title}</span>
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="primary" onClick={() => approveMutation.mutate(c.id)} isLoading={approveMutation.isPending}>
                Approuver
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(c.id)}>
                Rejeter
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ModerationPage() {
  const tabs = [
    { key: 'comments', label: `Commentaires en Attente`, content: <PendingComments /> },
    { key: 'proposals', label: 'Propositions', content: <p className="text-ink/50 dark:text-parchment-500 font-ui text-sm">Gestion des propositions à venir.</p> },
  ]

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100 mb-8">Modération</h1>
      <Tabs tabs={tabs} />
    </div>
  )
}
