'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1
    if (page >= totalPages - 3) return totalPages - 6 + i
    return page - 3 + i
  })

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded hover:bg-parchment-200 dark:hover:bg-nihil-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <>
          <PageButton p={1} current={page} onChange={onChange} />
          {pages[0] > 2 && <span className="px-1 text-ink/40 dark:text-parchment-500">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PageButton key={p} p={p} current={page} onChange={onChange} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-ink/40 dark:text-parchment-500">…</span>
          )}
          <PageButton p={totalPages} current={page} onChange={onChange} />
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded hover:bg-parchment-200 dark:hover:bg-nihil-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        ›
      </button>
    </nav>
  )
}

function PageButton({ p, current, onChange }: { p: number; current: number; onChange: (p: number) => void }) {
  return (
    <button
      onClick={() => onChange(p)}
      className={cn(
        'w-9 h-9 rounded font-ui text-sm transition-colors',
        p === current
          ? 'bg-lumen-600 text-white font-medium'
          : 'hover:bg-parchment-200 dark:hover:bg-nihil-700 text-ink dark:text-parchment-200',
      )}
      aria-current={p === current ? 'page' : undefined}
    >
      {p}
    </button>
  )
}
