'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { MagicForce, CharacterStatus } from '@hesperedia/shared-types'
import { FORCE_LABELS, FORCE_ICONS } from '@/lib/utils'

const statusOptions = Object.values(CharacterStatus)
const forceOptions = Object.values(MagicForce)

interface FormData {
  name: string
  titles: string
  species: string
  gender: string
  age: string
  status: CharacterStatus
  primaryForce: MagicForce | ''
  secondaryForce: MagicForce | ''
  magicLevel: string
  biography: string
  personality: string
  abilities: string
  history: string
  isMainCharacter: boolean
  portraitUrl: string
  bannerUrl: string
  publishedAt: string
  affiliationIds: string
}

const emptyForm: FormData = {
  name: '', titles: '', species: '', gender: '', age: '',
  status: CharacterStatus.UNKNOWN, primaryForce: '', secondaryForce: '',
  magicLevel: '', biography: '', personality: '', abilities: '', history: '',
  isMainCharacter: false, portraitUrl: '', bannerUrl: '', publishedAt: '',
  affiliationIds: '',
}

export default function CharacterEditPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const isNew = slug === 'new'

  const [form, setForm] = useState<FormData>(emptyForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    api.get(`/characters/${slug}`).then(({ data }) => {

      const c = data.data
      setForm({
        name: c.name ?? '',
        titles: (c.titles ?? []).join(', '),
        species: c.species ?? '',
        gender: c.gender ?? '',
        age: c.age ?? '',
        status: c.status ?? CharacterStatus.UNKNOWN,
        primaryForce: c.primaryForce ?? '',
        secondaryForce: c.secondaryForce ?? '',
        magicLevel: c.magicLevel?.toString() ?? '',
        biography: c.biography ?? '',
        personality: c.personality ?? '',
        abilities: c.abilities ?? '',
        history: c.history ?? '',
        isMainCharacter: c.isMainCharacter ?? false,
        portraitUrl: c.portraitUrl ?? '',
        bannerUrl: c.bannerUrl ?? '',
        publishedAt: c.publishedAt ? c.publishedAt.slice(0, 16) : '',
        affiliationIds: (c.affiliations ?? []).map((a: { faction: { id: string } }) => a.faction.id).join(', '),
      })
    }).finally(() => setLoading(false))
  }, [slug, isNew])

  async function handleSubmit(publish: boolean) {
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        titles: form.titles.split(',').map((t) => t.trim()).filter(Boolean),
        species: form.species,
        gender: form.gender || undefined,
        age: form.age || undefined,
        status: form.status,
        primaryForce: form.primaryForce || undefined,
        secondaryForce: form.secondaryForce || undefined,
        magicLevel: form.magicLevel ? parseInt(form.magicLevel) : undefined,
        biography: form.biography,
        personality: form.personality || undefined,
        abilities: form.abilities || undefined,
        history: form.history || undefined,
        isMainCharacter: form.isMainCharacter,
        portraitUrl: form.portraitUrl || undefined,
        bannerUrl: form.bannerUrl || undefined,
        publishedAt: publish ? (form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString()) : null,
        affiliationIds: form.affiliationIds.split(',').map((s) => s.trim()).filter(Boolean),
      }

      if (isNew) {
        await api.post('/characters', payload)
      } else {
        await api.put(`/characters/${slug}`, payload)
      }

      qc.invalidateQueries({ queryKey: ['characters'] })
      router.push('/admin/characters')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ?? 'Erreur lors de la sauvegarde'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-lumen-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const field = (label: string, key: keyof FormData, type: 'text' | 'textarea' | 'select' = 'text', options?: string[]) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-ui font-semibold text-ink/60 dark:text-parchment-500 uppercase tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={5}
          className="rounded-lg border border-parchment-300 dark:border-nihil-600 bg-white dark:bg-nihil-800 text-ink dark:text-parchment-100 px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-lumen-500 resize-y"
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      ) : type === 'select' && options ? (
        <select
          className="rounded-lg border border-parchment-300 dark:border-nihil-600 bg-white dark:bg-nihil-800 text-ink dark:text-parchment-100 px-3 py-2 text-sm font-ui focus:outline-none focus:ring-2 focus:ring-lumen-500"
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        >
          <option value="">— Aucun —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          className="rounded-lg border border-parchment-300 dark:border-nihil-600 bg-white dark:bg-nihil-800 text-ink dark:text-parchment-100 px-3 py-2 text-sm font-ui focus:outline-none focus:ring-2 focus:ring-lumen-500"
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      )}
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100">
          {isNew ? 'Nouveau Personnage' : 'Éditer Personnage'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-sanguis-900/30 border border-sanguis-700/40 text-sanguis-300 text-sm font-ui">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {field('Nom *', 'name')}
        {field('Titres (séparés par virgule)', 'titles')}
        {field('Espèce *', 'species')}
        {field('Genre', 'gender')}
        {field('Âge', 'age')}
        {field('Statut *', 'status', 'select', statusOptions)}
        {field('Force Primaire', 'primaryForce', 'select', forceOptions.map((f) => `${FORCE_ICONS[f]} ${FORCE_LABELS[f]}`))}
        {field('Force Secondaire', 'secondaryForce', 'select', forceOptions.map((f) => `${FORCE_ICONS[f]} ${FORCE_LABELS[f]}`))}
        {field('Niveau Magique (1-10)', 'magicLevel')}
        {field('URL Portrait', 'portraitUrl')}
        {field('URL Bannière', 'bannerUrl')}
        {field('Date de publication', 'publishedAt')}
        {field('IDs Factions (séparés par virgule)', 'affiliationIds')}
      </div>

      <div className="mt-6 space-y-4">
        {field('Biographie *', 'biography', 'textarea')}
        {field('Personnalité', 'personality', 'textarea')}
        {field('Capacités', 'abilities', 'textarea')}
        {field('Histoire', 'history', 'textarea')}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="isMain"
          className="rounded border-parchment-400"
          checked={form.isMainCharacter}
          onChange={(e) => setForm((f) => ({ ...f, isMainCharacter: e.target.checked }))}
        />
        <label htmlFor="isMain" className="text-sm font-ui text-ink dark:text-parchment-200">
          Personnage principal (mis en avant sur la homepage)
        </label>
      </div>

      <div className="mt-8 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="px-5 py-2 rounded-lg border border-parchment-400 dark:border-nihil-600 text-ink dark:text-parchment-200 font-ui text-sm hover:bg-parchment-100 dark:hover:bg-nihil-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Sauvegarde…' : 'Sauvegarder brouillon'}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-lumen-600 hover:bg-lumen-700 text-white font-ui text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Publication…' : 'Publier'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg font-ui text-sm text-sanguis-400 hover:text-sanguis-300 transition-colors ml-auto"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
