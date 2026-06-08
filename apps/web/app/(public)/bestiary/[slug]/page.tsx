import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Creature } from '@hesperedia/shared-types'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { DangerMeter } from '@/components/ui/DangerMeter'
import { Badge } from '@/components/ui/Badge'
import { ArticleRenderer } from '@/components/ArticleRenderer'

export const revalidate = 3600

interface CreaturePageProps {
  params: { slug: string }
}

async function getCreature(slug: string): Promise<Creature | null> {
  try {
    const { data } = await api.get<{ data: Creature }>(`/bestiary/${slug}`)
    return data.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: CreaturePageProps): Promise<Metadata> {
  const creature = await getCreature(params.slug)
  if (!creature) return { title: 'Créature introuvable' }
  return {
    title: creature.name,
    description: creature.description.slice(0, 160),
    openGraph: { title: `${creature.name} | Hesperedia Wiki`, description: creature.description.slice(0, 160) },
  }
}

const categoryLabels: Record<string, string> = {
  SANGUIS_CORRUPTION: 'Corruption Sanguis', NIHIL_CORRUPTION: 'Corruption Nihil',
  MONSTER: 'Monstre', DEMON: 'Démon', ORLA_ENTITY: "Entité de l'Orla",
  TRANSFORMED_ANIMAL: 'Animal Transformé', HYBRID: 'Hybride', DEEP_CREATURE: 'Créature des Profondeurs',
}

export default async function CreaturePage({ params }: CreaturePageProps) {
  const creature = await getCreature(params.slug)
  if (!creature) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left */}
        <aside className="md:col-span-1 space-y-5">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-nihil-900">
            {creature.portraitUrl ? (
              <Image src={creature.portraitUrl} alt={creature.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">🦷</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5 space-y-4">
            <h2 className="font-heading text-sm font-bold text-ink/60 dark:text-parchment-500 uppercase tracking-widest border-b border-parchment-200 dark:border-nihil-700 pb-2">
              Données
            </h2>
            <div className="space-y-3 text-sm font-ui">
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-parchment-500">Catégorie</span>
                <Badge variant="outline">{categoryLabels[creature.category] ?? creature.category}</Badge>
              </div>
              {creature.origin && (
                <div className="flex justify-between">
                  <span className="text-ink/60 dark:text-parchment-500">Origine</span>
                  <span className="text-ink dark:text-parchment-200">{creature.origin}</span>
                </div>
              )}
              {creature.habitat && (
                <div className="flex flex-col gap-1">
                  <span className="text-ink/60 dark:text-parchment-500">Habitat</span>
                  <span className="text-ink dark:text-parchment-200 text-xs">{creature.habitat}</span>
                </div>
              )}
            </div>

            {creature.primaryForce && (
              <div className="space-y-2">
                <p className="text-xs font-ui text-ink/60 dark:text-parchment-500 uppercase tracking-widest">Force</p>
                <ForceBadge force={creature.primaryForce} />
              </div>
            )}

            {creature.dangerLevel && (
              <div className="space-y-2">
                <p className="text-xs font-ui text-ink/60 dark:text-parchment-500 uppercase tracking-widest">Danger</p>
                <DangerMeter level={creature.dangerLevel} />
                <p className="text-xs text-ink/50 dark:text-parchment-500 font-ui">{creature.dangerLevel}/10</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="font-heading text-4xl font-black text-ink dark:text-parchment-100">{creature.name}</h1>
            {creature.subcategory && (
              <p className="font-body italic text-ink/60 dark:text-parchment-400 mt-1">{creature.subcategory}</p>
            )}
          </div>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink dark:text-parchment-100 mb-3">Description</h2>
            <ArticleRenderer content={creature.description} className="prose-sm" />
          </section>

          {creature.abilities && (
            <section>
              <h2 className="font-heading text-lg font-semibold text-ink dark:text-parchment-100 mb-3">Capacités</h2>
              <ArticleRenderer content={creature.abilities} className="prose-sm" />
            </section>
          )}

          {creature.weaknesses && (
            <section>
              <h2 className="font-heading text-lg font-semibold text-ink dark:text-parchment-100 mb-3">Faiblesses & Résistances</h2>
              <ArticleRenderer content={creature.weaknesses} className="prose-sm" />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
