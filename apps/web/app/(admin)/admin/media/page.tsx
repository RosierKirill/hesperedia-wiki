'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

interface MediaAsset {
  id: string
  filename: string
  url: string
  type: string
  mimeType: string
  size: number
  createdAt: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: assets, isLoading } = useQuery({
    queryKey: ['admin', 'media'],
    queryFn: async () => {
      const { data } = await api.get<{ data: MediaAsset[] }>('/media')
      return data.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      await api.post('/media/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadMutation.mutate(file)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100">Bibliothèque Médias</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadMutation.isPending}
          >
            Uploader une image
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="mb-8 rounded-xl border-2 border-dashed border-parchment-300 dark:border-nihil-600 p-8 text-center cursor-pointer hover:border-lumen-400 dark:hover:border-lumen-700 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) uploadMutation.mutate(file)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-4xl mb-3">🖼</p>
        <p className="font-ui text-ink/60 dark:text-parchment-400 text-sm">
          Glissez-déposez une image ici ou <span className="text-lumen-600 dark:text-lumen-400">cliquez pour choisir</span>
        </p>
        <p className="text-xs font-ui text-ink/40 dark:text-parchment-500 mt-1">JPG, PNG, WebP — max 10 MB</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)
          : (assets ?? []).map((a) => (
              <div key={a.id} className="group relative aspect-square rounded-lg overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-200 dark:bg-nihil-800">
                {a.type === 'image' && (
                  <Image src={a.url} alt={a.filename} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end opacity-0 group-hover:opacity-100">
                  <div className="w-full p-2 space-y-1">
                    <p className="text-white text-xs font-ui truncate">{a.filename}</p>
                    <p className="text-white/60 text-xs font-ui">{formatBytes(a.size)}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigator.clipboard.writeText(a.url)}
                        className="text-xs font-ui px-2 py-0.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        Copier URL
                      </button>
                      <button
                        onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(a.id) }}
                        className="text-xs font-ui px-2 py-0.5 rounded bg-sanguis-600/60 text-white hover:bg-sanguis-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
