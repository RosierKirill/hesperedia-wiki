import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Character, Faction } from '@hesperedia/shared-types'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { MagicMeter } from '@/components/ui/MagicMeter'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { ArticleRenderer } from '@/components/ArticleRenderer'
import { MagicForce } from '@hesperedia/shared-types'

export const revalidate = 3600

interface CharacterPageProps {
  params: { slug: string }
}

async function getCharacter(slug: string): Promise<Character | null> {
  try {
    const { data } = await api.get<{ data: Character }>(`/characters/${slug}`)
    return data.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const character = await getCharacter(params.slug)
  if (!character) return { title: 'Personnage introuvable' }

  return {
    title: character.name,
    description: character.biography.slice(0, 160),
    openGraph: {
      title: `${character.name} | Hesperedia Wiki`,
      description: character.biography.slice(0, 160),
      images: character.portraitUrl ? [{ url: character.portraitUrl, alt: character.name }] : [],
    },
  }
}

const statusLabels: Record<string, string> = {
  ALIVE: 'Vivant', DECEASED: 'Décédé', UNDEAD: 'Mort-Vivant', UNKNOWN: 'Inconnu', TRANSFORMED: 'Transformé',
}
const statusVariants: Record<string, 'success' | 'danger' | 'warning' | 'outline'> = {
  ALIVE: 'success', DECEASED: 'outline', UNDEAD: 'warning', UNKNOWN: 'outline', TRANSFORMED: 'danger',
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const character = await getCharacter(params.slug)
  if (!character) notFound()

  const tabs = [
    { key: 'bio', label: 'Biographie', content: <ArticleRenderer content={character.biography} className="prose-sm" /> },
    ...(character.personality ? [{ key: 'personality', label: 'Personnalité', content: <ArticleRenderer content={character.personality} className="prose-sm" /> }] : []),
    ...(character.abilities ? [{ key: 'abilities', label: 'Capacités', content: <ArticleRenderer content={character.abilities} className="prose-sm" /> }] : []),
    ...((character as Character & { history?: string }).history ? [{ key: 'history', label: 'Histoire', content: <ArticleRenderer content={(character as Character & { history?: string }).history!} className="prose-sm" /> }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Portrait */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-200 dark:bg-nihil-900">
            {character.portraitUrl ? (
              <Image src={character.portraitUrl} alt={character.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">⚔</span>
              </div>
            )}
          </div>

          {/* Infobox */}
          <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5 space-y-4">
            <h2 className="font-heading text-sm font-bold text-ink/60 dark:text-parchment-500 uppercase tracking-widest border-b border-parchment-200 dark:border-nihil-700 pb-2">
              Informations
            </h2>

            <div className="space-y-3 text-sm font-ui">
              {[
                { label: 'Espèce', value: character.species },
                { label: 'Genre', value: character.gender },
                { label: 'Âge', value: character.age },
                { label: 'Statut', value: <Badge variant={statusVariants[character.status]}>{statusLabels[character.status]}</Badge> },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-ink/60 dark:text-parchment-500 shrink-0">{label}</span>
                    <span className="text-ink dark:text-parchment-200 text-right">{value}</span>
                  </div>
                ) : null,
              )}
            </div>

            {/* Forces */}
            {(character.primaryForce || character.secondaryForce) && (
              <div className="space-y-2">
                <p className="text-xs font-ui text-ink/60 dark:text-parchment-500 uppercase tracking-widest">Forces</p>
                <div className="flex flex-wrap gap-2">
                  {character.primaryForce && <ForceBadge force={character.primaryForce} />}
                  {character.secondaryForce && <ForceBadge force={character.secondaryForce} />}
                </div>
                {character.magicLevel && character.primaryForce && (
                  <MagicMeter level={character.magicLevel} force={character.primaryForce as MagicForce} />
                )}
              </div>
            )}

            {/* Affiliations */}
            {character.affiliations?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-ui text-ink/60 dark:text-parchment-500 uppercase tracking-widest">Affiliations</p>
                <div className="flex flex-wrap gap-1.5">
                  {character.affiliations.map((aff) => {
                    const faction = (aff as unknown as { faction?: Faction })?.faction ?? (aff as Faction)
                    return (
                      <Link
                        key={faction.id}
                        href={`/factions/${faction.slug}`}
                        className="text-xs font-ui px-2 py-1 rounded bg-parchment-200 dark:bg-nihil-700 text-ink/70 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-nihil-600 transition-colors"
                      >
                        {faction.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {character.titles[0] && (
              <p className="font-body italic text-ink/60 dark:text-parchment-400 mb-1">{character.titles[0]}</p>
            )}
            <h1 className="font-heading text-4xl md:text-5xl font-black text-ink dark:text-parchment-100">
              {character.name}
            </h1>
            {character.titles.length > 1 && (
              <p className="font-body italic text-ink/50 dark:text-parchment-500 mt-1 text-sm">
                {character.titles.slice(1).join(' · ')}
              </p>
            )}
          </div>

          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  )
}
