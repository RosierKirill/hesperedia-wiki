'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User, UserRole } from '@hesperedia/shared-types'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'

const roleVariants: Record<UserRole, 'success' | 'warning' | 'default'> = {
  [UserRole.ADMIN]: 'success',
  [UserRole.EDITOR]: 'warning',
  [UserRole.SUBSCRIBER]: 'default',
}

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<UserRole>(UserRole.SUBSCRIBER)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get<{ data: User[] }>('/admin/users')
      return data.data
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      setEditingId(null)
    },
  })

  const users = data ?? []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100">Utilisateurs</h1>
        <p className="font-body text-ink/50 dark:text-parchment-500 mt-1 text-sm">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-parchment-300 dark:border-nihil-700 bg-parchment-100 dark:bg-nihil-900">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider">Utilisateur</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider">Rôle</th>
              <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wider hidden lg:table-cell">Inscrit le</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-200 dark:divide-nihil-700">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-parchment-200 dark:bg-nihil-700 rounded animate-pulse" /></td>
                  ))}
                  <td />
                </tr>
              ))
              : users.map((u) => (
                <tr key={u.id} className="hover:bg-parchment-100 dark:hover:bg-nihil-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatarUrl} name={u.username} size="sm" />
                      <span className="font-ui text-sm font-medium text-ink dark:text-parchment-100">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm font-ui text-ink/60 dark:text-parchment-400">{u.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as UserRole)}
                          className="text-xs font-ui rounded border border-parchment-300 dark:border-nihil-600 bg-white dark:bg-nihil-700 text-ink dark:text-parchment-100 px-2 py-1"
                        >
                          {Object.values(UserRole).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => roleMutation.mutate({ id: u.id, role: newRole })}
                          disabled={roleMutation.isPending}
                          className="text-xs font-ui px-2 py-1 rounded bg-lumen-600 text-white"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs font-ui text-sanguis-400"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <Badge variant={roleVariants[u.role]}>{u.role}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-ui text-ink/50 dark:text-parchment-500">{formatDate(u.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId !== u.id && (
                      <button
                        onClick={() => {
                          setEditingId(u.id)
                          setNewRole(u.role)
                        }}
                        className="text-xs font-ui text-lumen-600 dark:text-lumen-400 hover:underline"
                      >
                        Modifier rôle
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
