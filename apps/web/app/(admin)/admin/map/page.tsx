'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useLocations, useRealms } from '@/hooks/useApi'
import { api } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'

const AdminMap = dynamic(() => import('@/components/admin/AdminMapEditor'), { ssr: false })

interface LocationForm {
  id?: string
  name: string
  slug?: string
  type: string
  realmId: string
  regionId?: string
  description: string
  isCapital: boolean
  mapCoords: { x: number; y: number }
}

const LOCATION_TYPES = ['CITY', 'VILLAGE', 'FORTRESS', 'RUIN', 'DUNGEON', 'LANDMARK', 'SACRED_SITE', 'CAMP']

const emptyForm: LocationForm = {
  name: '', slug: '', type: 'CITY', realmId: '', regionId: '',
  description: '', isCapital: false, mapCoords: { x: 0, y: 0 },
}

export default function AdminMapPage() {
  const [modal, setModal] = useState<LocationForm | null>(null)
  const [filterRealmId, setFilterRealmId] = useState('')
  const qc = useQueryClient()

  const { data: locations } = useLocations(filterRealmId ? { realmId: filterRealmId } : undefined)
  const { data: realms } = useRealms()

  const saveMutation = useMutation({
    mutationFn: (form: LocationForm) =>
      form.id
        ? api.put(`/map/locations/${form.id}`, form)
        : api.post('/map/locations', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      setModal(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/map/locations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }),
  })

  function handleMapClick(coords: { x: number; y: number }) {
    setModal({ ...emptyForm, mapCoords: coords })
  }

  function handleLocationClick(loc: { id?: string; name: string; slug?: string; type: string; realmId?: string; regionId?: string; description?: string; isCapital?: boolean; mapCoords?: { x: number; y: number } }) {
    setModal({ ...emptyForm, ...loc })
  }

  const locationList = (locations as LocationForm[] ?? [])
  const realmList = (realms as Array<{ id: string; name: string; color?: string }> ?? [])

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 flex flex-col">
        <div className="p-4 border-b border-parchment-300 dark:border-nihil-700 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-ink dark:text-parchment-100">Carte Admin</h1>
          <button
            onClick={() => setModal({ ...emptyForm })}
            className="text-xs font-ui px-2 py-1 rounded bg-lumen-600 hover:bg-lumen-700 text-white transition-colors"
          >
            + Lieu
          </button>
        </div>

        <div className="p-3 border-b border-parchment-200 dark:border-nihil-700">
          <select
            value={filterRealmId}
            onChange={(e) => setFilterRealmId(e.target.value)}
            className="w-full text-sm font-ui rounded border border-parchment-300 dark:border-nihil-600 bg-white dark:bg-nihil-800 text-ink dark:text-parchment-100 px-2 py-1.5"
          >
            <option value="">Tous les royaumes</option>
            {realmList.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-parchment-200 dark:divide-nihil-700">
          {locationList.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-parchment-100 dark:hover:bg-nihil-700/50 cursor-pointer group transition-colors"
              onClick={() => handleLocationClick(loc)}
            >
              <div>
                <p className="text-sm font-ui font-medium text-ink dark:text-parchment-100">{loc.name}</p>
                <p className="text-xs font-ui text-ink/50 dark:text-parchment-500">{loc.type}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (loc.id && confirm(`Supprimer ${loc.name} ?`)) deleteMutation.mutate(loc.id)
                  }}
                  className="text-xs text-sanguis-400 hover:text-sanguis-300 font-ui"
                  aria-label={`Supprimer ${loc.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {locationList.length === 0 && (
            <div className="p-6 text-center text-sm font-ui text-ink/40 dark:text-parchment-600">
              Aucun lieu trouvé.<br />
              <span className="text-xs">Cliquez sur la carte pour en ajouter un.</span>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        <AdminMap
          locations={locationList}
          onMapClick={handleMapClick}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Location Modal */}
      {modal && (
        <Modal isOpen onClose={() => setModal(null)} title={modal.id ? 'Modifier le lieu' : 'Nouveau lieu'}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              saveMutation.mutate(modal)
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Nom *</label>
                <input
                  required
                  className="input-base"
                  value={modal.name}
                  onChange={(e) => setModal((m) => m && ({ ...m, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Type</label>
                <select
                  className="input-base"
                  value={modal.type}
                  onChange={(e) => setModal((m) => m && ({ ...m, type: e.target.value }))}
                >
                  {LOCATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Royaume</label>
                <select
                  className="input-base"
                  value={modal.realmId}
                  onChange={(e) => setModal((m) => m && ({ ...m, realmId: e.target.value }))}
                >
                  <option value="">— Aucun —</option>
                  {realmList.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Coord X</label>
                <input
                  type="number"
                  className="input-base"
                  value={modal.mapCoords.x}
                  onChange={(e) => setModal((m) => m && ({ ...m, mapCoords: { ...m.mapCoords, x: parseFloat(e.target.value) } }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Coord Y</label>
                <input
                  type="number"
                  className="input-base"
                  value={modal.mapCoords.y}
                  onChange={(e) => setModal((m) => m && ({ ...m, mapCoords: { ...m.mapCoords, y: parseFloat(e.target.value) } }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">Description</label>
              <textarea
                rows={3}
                className="input-base resize-none"
                value={modal.description}
                onChange={(e) => setModal((m) => m && ({ ...m, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCapitalModal"
                checked={modal.isCapital}
                onChange={(e) => setModal((m) => m && ({ ...m, isCapital: e.target.checked }))}
              />
              <label htmlFor="isCapitalModal" className="text-sm font-ui text-ink dark:text-parchment-200">Capitale</label>
            </div>

            <div className={cn('flex justify-end gap-3 pt-2')}>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded font-ui text-sm text-ink/60 dark:text-parchment-400 hover:text-ink dark:hover:text-parchment-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-5 py-2 rounded bg-lumen-600 hover:bg-lumen-700 text-white font-ui text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
