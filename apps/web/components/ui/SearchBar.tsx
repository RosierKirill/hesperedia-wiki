'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearch } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SearchBarProps {
  className?: string
  placeholder?: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

type SearchResultItem = {
  id: string
  type: string
  slug: string
  name: string
  excerpt?: string
  portraitUrl?: string
  coverImageUrl?: string
}

const typeLabels: Record<string, string> = {
  character: 'Personnage',
  creature: 'Créature',
  article: 'Article',
  faction: 'Faction',
  location: 'Lieu',
}

const typeRoutes: Record<string, string> = {
  character: '/characters',
  creature: '/bestiary',
  article: '/lore',
  faction: '/factions',
  location: '/map',
}

export function SearchBar({ className, placeholder = 'Rechercher...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debounced = useDebounce(query, 300)
  const { data: results } = useSearch(debounced)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-parchment-500" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-parchment-100 dark:bg-nihil-800 border border-parchment-300 dark:border-nihil-600 text-ink dark:text-parchment-100 placeholder:text-ink/40 dark:placeholder:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-lumen-500/50 font-ui"
          aria-label="Recherche globale"
          aria-autocomplete="list"
          aria-expanded={isOpen && !!results?.length}
        />
      </div>

      {isOpen && debounced.length >= 2 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-lg border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 shadow-xl overflow-hidden">
          {!results?.length ? (
            <p className="p-3 text-sm text-ink/60 dark:text-parchment-400 font-ui text-center">Aucun résultat</p>
          ) : (
            <ul role="listbox">
              {(results as SearchResultItem[]).map((item) => (
                <li key={`${item.type}-${item.id}`} role="option">
                  <Link
                    href={`${typeRoutes[item.type]}/${item.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-parchment-200 dark:hover:bg-nihil-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xs font-ui px-1.5 py-0.5 rounded bg-parchment-300 dark:bg-nihil-700 text-ink/60 dark:text-parchment-400 shrink-0">
                      {typeLabels[item.type] ?? item.type}
                    </span>
                    <span className="text-sm font-ui text-ink dark:text-parchment-100 truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
