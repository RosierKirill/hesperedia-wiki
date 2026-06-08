import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PaginatedResponse } from '@hesperedia/shared-types'

export function useCharacters(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['characters', params],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaginatedResponse<unknown> }>('/characters', { params })
      return data.data
    },
  })
}

export function useCharacter(slug: string) {
  return useQuery({
    queryKey: ['character', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/characters/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedCharacters() {
  return useQuery({
    queryKey: ['characters', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/characters/featured')
      return data.data
    },
  })
}

export function useCreatures(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['creatures', params],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaginatedResponse<unknown> }>('/bestiary', { params })
      return data.data
    },
  })
}

export function useCreature(slug: string) {
  return useQuery({
    queryKey: ['creature', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/bestiary/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useArticles(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaginatedResponse<unknown> }>('/articles', { params })
      return data.data
    },
  })
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/articles/featured')
      return data.data
    },
  })
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/articles/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFactions() {
  return useQuery({
    queryKey: ['factions'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/factions')
      return data.data
    },
  })
}

export function useRealms() {
  return useQuery({
    queryKey: ['realms'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/map/realms')
      return data.data
    },
  })
}

export function useLocations(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/map/locations', { params })
      return data.data
    },
  })
}

export function useProjects(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/projects', { params })
      return data.data
    },
  })
}

export function useProposals() {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/community/proposals')
      return data.data
    },
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>('/admin/stats')
      return data.data
    },
  })
}

export function useSearch(q: string, type?: string) {
  return useQuery({
    queryKey: ['search', q, type],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>('/search', { params: { q, type } })
      return data.data
    },
    enabled: q.length >= 2,
  })
}

export function useLocation(slug: string) {
  return useQuery({
    queryKey: ['location', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/map/locations/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/projects/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFaction(slug: string) {
  return useQuery({
    queryKey: ['faction', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown }>(`/factions/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useComments(articleId: string) {
  return useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      const { data } = await api.get<{ data: unknown[] }>(`/articles/${articleId}/comments`)
      return data.data
    },
    enabled: !!articleId,
  })
}

export function useRateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      api.post(`/articles/${id}/rate`, { score }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
    },
  })
}

export function usePostComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ articleId, content, parentId }: { articleId: string; content: string; parentId?: string }) =>
      api.post(`/articles/${articleId}/comments`, { content, parentId }),
    onSuccess: (_data, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
    },
  })
}
