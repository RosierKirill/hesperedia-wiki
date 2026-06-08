'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MagicForce } from '@hesperedia/shared-types'
import { FORCE_ICONS, FORCE_LABELS } from '@/lib/utils'
import { CharacterCard } from '@/components/CharacterCard'
import { ArticleCard } from '@/components/ArticleCard'
import { CardSkeleton, ArticleCardSkeleton } from '@/components/ui/Skeleton'
import { useFeaturedCharacters, useFeaturedArticles, useProjects, useRealms, useCharacters, useCreatures, useArticles } from '@/hooks/useApi'
import { Character, Article, Project } from '@hesperedia/shared-types'

const forceDescriptions: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'Lumière, vérité et guérison',
  [MagicForce.VESPER]: 'Ombre, illusion et prophétie',
  [MagicForce.AETHER]: 'Vent, ciel et liberté',
  [MagicForce.HUMUS]: 'Terre, croissance et patience',
  [MagicForce.SANGUIS]: 'Sang, passion et transformation',
  [MagicForce.NIHIL]: 'Vide, silence et cycles',
}

const forceBg: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'from-lumen-900/80 to-lumen-800/60 border-lumen-600/30 hover:border-lumen-500/60',
  [MagicForce.VESPER]: 'from-vesper-900/80 to-vesper-800/60 border-vesper-600/30 hover:border-vesper-500/60',
  [MagicForce.AETHER]: 'from-aether-900/80 to-aether-800/60 border-aether-600/30 hover:border-aether-500/60',
  [MagicForce.HUMUS]: 'from-humus-900/80 to-humus-800/60 border-humus-600/30 hover:border-humus-500/60',
  [MagicForce.SANGUIS]: 'from-sanguis-900/80 to-sanguis-800/60 border-sanguis-600/30 hover:border-sanguis-500/60',
  [MagicForce.NIHIL]: 'from-nihil-900 to-nihil-800 border-nihil-600/30 hover:border-nihil-500/60',
}

const forceText: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'text-lumen-300',
  [MagicForce.VESPER]: 'text-vesper-300',
  [MagicForce.AETHER]: 'text-aether-300',
  [MagicForce.HUMUS]: 'text-humus-300',
  [MagicForce.SANGUIS]: 'text-sanguis-300',
  [MagicForce.NIHIL]: 'text-nihil-300',
}

function StatCounter({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-heading font-bold text-lumen-400">{value.toLocaleString('fr-FR')}</p>
      <p className="text-sm font-ui text-parchment-400 mt-1">{label}</p>
    </div>
  )
}

export default function HomePage() {
  const { data: featuredChars, isLoading: loadingChars } = useFeaturedCharacters()
  const { data: featuredArticles, isLoading: loadingArticles } = useFeaturedArticles()
  const { data: projects } = useProjects()
  const { data: charsMeta } = useCharacters({ pageSize: 1 })
  const { data: creaturesMeta } = useCreatures({ pageSize: 1 })
  const { data: articlesMeta } = useArticles({ pageSize: 1 })
  const { data: realms } = useRealms()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-nihil-900">
        <div className="absolute inset-0 bg-gradient-to-b from-nihil-900 via-nihil-900/90 to-nihil-900" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4A017 0%, transparent 70%)' }}
        />
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-lumen-500 font-ui text-sm tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Encyclopédie de l&apos;Univers
          </motion.p>
          <motion.h1
            className="font-heading text-6xl md:text-8xl font-black text-parchment-100 mb-6 tracking-widest"
            style={{ textShadow: '0 0 60px rgba(212,160,23,0.3)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            HESPEREDIA
          </motion.h1>
          <motion.p
            className="font-body text-xl text-parchment-300 italic mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Un monde façonné par six forces primordiales, où les royaumes s&apos;affrontent et les légendes naissent.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/map"
              className="px-6 py-3 rounded-lg bg-lumen-600 hover:bg-lumen-700 text-white font-ui font-medium transition-colors shadow-lg shadow-lumen-900/50"
            >
              Explorer la Carte
            </Link>
            <Link
              href="/characters"
              className="px-6 py-3 rounded-lg border border-parchment-600 hover:border-parchment-400 text-parchment-200 hover:text-parchment-100 font-ui font-medium transition-colors"
            >
              Découvrir l&apos;Univers
            </Link>
          </motion.div>
        </motion.div>

        {/* Force symbols decoration */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-8 pb-8 opacity-30">
          {Object.values(MagicForce).map((force) => (
            <span key={force} className={`text-2xl ${forceText[force]}`}>{FORCE_ICONS[force]}</span>
          ))}
        </div>
      </section>

      {/* Six Forces */}
      <section className="py-20 bg-nihil-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-parchment-100 mb-4">Les Six Forces Primordiales</h2>
            <p className="font-body text-parchment-400 max-w-2xl mx-auto text-lg italic">
              Chaque mage du monde porte en lui l&apos;empreinte d&apos;une ou plusieurs de ces forces primordiales.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.values(MagicForce).map((force) => (
              <Link key={force} href={`/lore?force=${force}`}>
                <motion.div
                  className={`rounded-xl border bg-gradient-to-br p-5 text-center cursor-pointer transition-all ${forceBg[force]}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-3xl mb-2 ${forceText[force]}`}>{FORCE_ICONS[force]}</div>
                  <h3 className={`font-heading text-sm font-bold mb-1 ${forceText[force]}`}>{FORCE_LABELS[force]}</h3>
                  <p className="text-parchment-500 text-xs font-ui leading-tight">{forceDescriptions[force]}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Characters */}
      <section className="py-20 bg-parchment-100 dark:bg-nihil-800 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100 mb-2">
                Personnages Principaux
              </h2>
              <p className="font-body text-ink/60 dark:text-parchment-400 italic">
                Les figures qui façonnent le destin d&apos;Hesperedia
              </p>
            </div>
            <Link
              href="/characters"
              className="text-sm font-ui text-lumen-600 dark:text-lumen-400 hover:underline hidden sm:block"
            >
              Voir tous →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingChars
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : (featuredChars as Character[] ?? []).map((c) => (
                  <CharacterCard key={c.id} character={c} />
                ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-nihil-900 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-parchment-100 text-center mb-10">
            L&apos;Univers en Chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter label="Royaumes" value={(realms as unknown[])?.length ?? 4} />
            <StatCounter label="Personnages" value={(charsMeta as { total?: number })?.total ?? 0} />
            <StatCounter label="Créatures" value={(creaturesMeta as { total?: number })?.total ?? 0} />
            <StatCounter label="Articles" value={(articlesMeta as { total?: number })?.total ?? 0} />
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-parchment-100 dark:bg-nihil-800 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-ink dark:text-parchment-100 mb-2">
                Derniers Articles
              </h2>
              <p className="font-body text-ink/60 dark:text-parchment-400 italic">
                Explorez le lore, l&apos;histoire et la magie d&apos;Hesperedia
              </p>
            </div>
            <Link href="/lore" className="text-sm font-ui text-lumen-600 dark:text-lumen-400 hover:underline hidden sm:block">
              Voir tous →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingArticles
              ? Array.from({ length: 3 }).map((_, i) => <ArticleCardSkeleton key={i} />)
              : (featuredArticles as Article[] ?? []).slice(0, 3).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {(projects as Project[] ?? []).length > 0 && (
        <section className="py-20 bg-nihil-900 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-parchment-100 mb-3">Projets en Cours</h2>
              <p className="font-body text-parchment-400 italic">
                Hesperedia prend vie dans de multiples formats créatifs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {(projects as Project[] ?? []).slice(0, 3).map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`}>
                  <div className="rounded-lg border border-nihil-700 hover:border-lumen-600/50 bg-nihil-800 p-5 transition-colors h-full">
                    <p className="text-xs font-ui text-parchment-500 mb-2">{p.type.replace('_', ' ')}</p>
                    <h3 className="font-heading text-parchment-100 font-semibold mb-2">{p.title}</h3>
                    <p className="text-sm font-body text-parchment-400 line-clamp-2">{p.description}</p>
                    <span className="inline-block mt-3 text-xs font-ui px-2 py-0.5 rounded bg-lumen-900/30 text-lumen-400 border border-lumen-700/30">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community CTA */}
      <section className="py-20 bg-gradient-to-br from-vesper-900 to-nihil-900 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-parchment-100 mb-4">
            Rejoins la Communauté
          </h2>
          <p className="font-body text-parchment-300 text-lg mb-8 leading-relaxed">
            Vote pour les prochains ajouts de contenu, propose tes idées, et soutiens le développement de l&apos;univers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/community"
              className="px-6 py-3 rounded-lg bg-vesper-600 hover:bg-vesper-700 text-white font-ui font-medium transition-colors"
            >
              Explorer la Communauté
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-parchment-600 hover:border-parchment-400 text-parchment-200 font-ui font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
