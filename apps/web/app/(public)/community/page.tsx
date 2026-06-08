'use client'

import { useProposals, useFeaturedArticles } from '@/hooks/useApi'
import { ArticleCard } from '@/components/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Article } from '@hesperedia/shared-types'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

interface Proposal {
  id: string
  title: string
  description: string
  type: string
  voteCount: number
  status: string
  createdAt: string
}

function ProposalItem({ proposal }: { proposal: Proposal }) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const vote = async (value: 1 | -1) => {
    if (!user) return
    await api.post(`/community/proposals/${proposal.id}/vote`, { value })
    queryClient.invalidateQueries({ queryKey: ['proposals'] })
  }

  return (
    <div className="rounded-lg border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={() => vote(1)}
            disabled={!user}
            className="text-xl hover:text-lumen-500 transition-colors disabled:opacity-30"
            aria-label="Vote positif"
          >
            ▲
          </button>
          <span className="font-heading font-bold text-ink dark:text-parchment-100 text-lg">
            {proposal.voteCount}
          </span>
          <button
            onClick={() => vote(-1)}
            disabled={!user}
            className="text-xl hover:text-sanguis-500 transition-colors disabled:opacity-30"
            aria-label="Vote négatif"
          >
            ▼
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-ink dark:text-parchment-100 font-semibold mb-1">{proposal.title}</h3>
          <p className="text-sm font-body text-ink/70 dark:text-parchment-400 line-clamp-2">{proposal.description}</p>
          <span className="mt-2 inline-block text-xs font-ui text-ink/50 dark:text-parchment-500">{proposal.type}</span>
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { data: proposals, isLoading: loadingProposals } = useProposals()
  const { data: topArticles } = useFeaturedArticles()
  const { user } = useAuthStore()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-parchment-100 mb-2">Communauté</h1>
        <p className="font-body text-ink/60 dark:text-parchment-400 italic text-lg">
          Vote, propose, et façonne le futur de l&apos;univers Hesperedia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Proposals */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-ink dark:text-parchment-100">Propositions en Vote</h2>
              {user && (
                <Button size="sm" variant="secondary">+ Proposer</Button>
              )}
            </div>
            <div className="space-y-3">
              {loadingProposals
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-lg bg-parchment-200 dark:bg-nihil-800 animate-pulse" />
                  ))
                : (proposals as Proposal[] ?? []).map((p) => (
                    <ProposalItem key={p.id} proposal={p} />
                  ))}
              {!loadingProposals && !(proposals as Proposal[])?.length && (
                <p className="text-center text-ink/50 dark:text-parchment-500 font-ui py-8">
                  Aucune proposition ouverte pour le moment.
                </p>
              )}
            </div>
          </section>

          {/* Rules */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-ink dark:text-parchment-100 mb-6">Règles & FAQ</h2>
            <div className="rounded-xl border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 p-6 space-y-4">
              {[
                { q: 'Qui peut proposer du contenu ?', a: 'Tout utilisateur inscrit avec un compte actif peut soumettre des propositions.' },
                { q: 'Comment fonctionne le vote ?', a: 'Chaque utilisateur peut voter +1 ou -1 sur chaque proposition. Les propositions avec le plus de votes positifs sont prioritaires.' },
                { q: 'Que se passe-t-il avec les propositions acceptées ?', a: "L'équipe crée le contenu et l'ajoute au wiki. Les proposeurs sont crédités." },
                { q: 'Les commentaires sont-ils modérés ?', a: 'Oui. Tous les commentaires passent par une modération avant publication.' },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-parchment-200 dark:border-nihil-700 pb-4 last:border-0 last:pb-0">
                  <p className="font-heading font-semibold text-ink dark:text-parchment-100 mb-1">{q}</p>
                  <p className="text-sm font-body text-ink/70 dark:text-parchment-400">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold text-ink dark:text-parchment-100 mb-4">Articles les Mieux Notés</h2>
            <div className="space-y-3">
              {(topArticles as Article[] ?? []).slice(0, 5).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>

          {/* Donation */}
          <section className="rounded-xl border border-lumen-300/50 dark:border-lumen-700/30 bg-lumen-50 dark:bg-lumen-900/10 p-5">
            <h2 className="font-heading text-xl font-bold text-ink dark:text-parchment-100 mb-3">Soutenir le Projet</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm font-ui text-ink/70 dark:text-parchment-400">
                <span>Prochain palier</span>
                <span className="text-lumen-600 dark:text-lumen-400 font-medium">200€</span>
              </div>
              <div className="h-3 rounded-full bg-parchment-200 dark:bg-nihil-700 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-lumen-500 to-lumen-600" />
              </div>
              <p className="text-xs font-ui text-ink/60 dark:text-parchment-500">
                Débloque : +3 articles de lore sur les religions d&apos;Hesperedia
              </p>
            </div>
            <Button variant="primary" size="sm" className="w-full">Soutenir ✦</Button>
          </section>
        </aside>
      </div>
    </div>
  )
}
