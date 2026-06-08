import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ForceBadge } from '@/components/ui/ForceBadge'
import { Badge } from '@/components/ui/Badge'
import { MagicForce } from '@hesperedia/shared-types'

export const revalidate = 3600

interface FactionPageProps {
  params: { slug: string }
}

interface FactionDetail {
  id: string
  name: string
  slug: string
  type: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  dominantForce?: MagicForce
  alignment?: string
  characters?: Array<{
    character: { id: string; name: string; slug: string; portraitUrl?: string; primaryForce?: MagicForce }
  }>
  articles?: Array<{
    article: { id: string; title: string; slug: string; excerpt?: string }
  }>
}

const typeLabels: Record<string, string> = {
  KINGDOM: 'Royaume', EMPIRE: 'Empire', CITY_STATE: 'Cité-État',
  CULT: 'Culte', ORDER: 'Ordre', GUILD: 'Guilde',
  CLAN: 'Clan', CHURCH: 'Église', SECRET_SOCIETY: 'Société Secrète',
}

async function getFaction(slug: string): Promise<FactionDetail | null> {
  try {
    const { data } = await api.get<{ data: FactionDetail }>(`/factions/${slug}`)
    return data.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: FactionPageProps): Promise<Metadata> {
  const faction = await getFaction(params.slug)
  if (!faction) return { title: 'Faction introuvable' }
  return {
    title: faction.name,
    description: faction.description?.slice(0, 160),
    openGraph: {
      title: `${faction.name} | Hesperedia Wiki`,
      description: faction.description?.slice(0, 160),
      images: faction.logoUrl ? [{ url: faction.logoUrl, alt: faction.name }] : [],
    },
  }
}

export default async function FactionPage({ params }: FactionPageProps) {
  const faction = await getFaction(params.slug)
  if (!faction) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner */}
      {faction.bannerUrl && (
        <div className="relative h-48 rounded-xl overflow-hidden mb-8">
          <Image src={faction.bannerUrl} alt={faction.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-nihil-900/80 to-transparent" />
        </div>
      )}

      <div className="flex items-start gap-6 mb-8">
        {faction.logoUrl && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-200 dark:bg-nihil-800 shrink-0">
            <Image src={faction.logoUrl} alt={faction.name} fill className="object-contain p-2" />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="default">{typeLabels[faction.type] ?? faction.type}</Badge>
            {faction.alignment && <Badge variant="outline">{faction.alignment}</Badge>}
            {faction.dominantForce && <ForceBadge force={faction.dominantForce} />}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-ink dark:text-parchment-100">
            {faction.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {faction.description && (
            <div className="prose dark:prose-invert prose-headings:font-heading prose-a:text-lumen-600 dark:prose-a:text-lumen-400 max-w-none font-body">
              <p className="text-lg leading-relaxed text-ink/80 dark:text-parchment-200">{faction.description}</p>
            </div>
          )}

          {faction.characters && faction.characters.length > 0 && (
            <section className="mt-10">
              <h2 className="font-heading text-xl font-bold text-ink dark:text-parchment-100 mb-4">
                Membres Notables
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {faction.characters.map(({ character: c }) => (
                  <Link key={c.id} href={`/characters/${c.slug}`}>
                    <div className="rounded-lg border border-parchment-200 dark:border-nihil-700 hover:border-lumen-500/50 bg-parchment-50 dark:bg-nihil-800 p-3 text-center transition-colors group">
                      {c.portraitUrl ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-parchment-300 dark:border-nihil-600">
                          <Image src={c.portraitUrl} alt={c.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-nihil-700 mx-auto mb-2 flex items-center justify-center text-xl">⚔</div>
                      )}
                      <p className="font-heading text-xs font-semibold text-ink dark:text-parchment-100 group-hover:text-lumen-600 dark:group-hover:text-lumen-300 transition-colors line-clamp-2">{c.name}</p>
                      {c.primaryForce && <ForceBadge force={c.primaryForce} size="sm" className="mt-1 mx-auto" />}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5 space-y-3">
            <h3 className="font-heading text-sm font-bold text-ink/60 dark:text-parchment-500 uppercase tracking-widest border-b border-parchment-200 dark:border-nihil-700 pb-2">
              Informations
            </h3>
            <div className="space-y-2.5 text-sm font-ui">
              <div className="flex justify-between gap-2">
                <span className="text-ink/50 dark:text-parchment-500">Type</span>
                <span className="text-ink dark:text-parchment-200 font-medium">{typeLabels[faction.type] ?? faction.type}</span>
              </div>
              {faction.alignment && (
                <div className="flex justify-between gap-2">
                  <span className="text-ink/50 dark:text-parchment-500">Alignement</span>
                  <span className="text-ink dark:text-parchment-200 font-medium">{faction.alignment}</span>
                </div>
              )}
              {faction.dominantForce && (
                <div className="flex justify-between gap-2 items-center">
                  <span className="text-ink/50 dark:text-parchment-500">Force Dominante</span>
                  <ForceBadge force={faction.dominantForce} size="sm" />
                </div>
              )}
            </div>
          </div>

          {faction.articles && faction.articles.length > 0 && (
            <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-5">
              <h3 className="font-heading text-sm font-bold text-ink/60 dark:text-parchment-500 uppercase tracking-widest border-b border-parchment-200 dark:border-nihil-700 pb-2 mb-3">
                Articles Liés
              </h3>
              <div className="space-y-2">
                {faction.articles.map(({ article: a }) => (
                  <Link key={a.id} href={`/lore/${a.slug}`} className="block group">
                    <p className="text-sm font-ui text-lumen-600 dark:text-lumen-400 group-hover:underline line-clamp-1">{a.title}</p>
                    {a.excerpt && <p className="text-xs font-body text-ink/50 dark:text-parchment-600 line-clamp-1 mt-0.5">{a.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
