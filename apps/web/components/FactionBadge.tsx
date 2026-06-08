import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface FactionBadgeProps {
  faction: {
    id: string
    slug: string
    name: string
    logoUrl?: string | null
    type?: string
  }
  size?: 'sm' | 'md'
  className?: string
  asLink?: boolean
}

export function FactionBadge({ faction, size = 'md', className, asLink = true }: FactionBadgeProps) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-parchment-300 dark:border-nihil-600 bg-parchment-100 dark:bg-nihil-800 font-ui text-ink dark:text-parchment-200 transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        asLink && 'hover:border-lumen-500 hover:text-lumen-600 dark:hover:text-lumen-300 cursor-pointer',
        className,
      )}
    >
      {faction.logoUrl && (
        <span className={cn('relative shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}>
          <Image src={faction.logoUrl} alt="" fill className="object-contain" />
        </span>
      )}
      {faction.name}
    </span>
  )

  if (!asLink) return content

  return (
    <Link href={`/factions/${faction.slug}`} className="inline-block">
      {content}
    </Link>
  )
}
