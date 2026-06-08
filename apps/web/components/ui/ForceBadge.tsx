import { MagicForce } from '@hesperedia/shared-types'
import { cn, FORCE_COLORS, FORCE_ICONS, FORCE_LABELS } from '@/lib/utils'

interface ForceBadgeProps {
  force: MagicForce
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const forceBgMap: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'bg-lumen-500/20 text-lumen-600 dark:text-lumen-400 border-lumen-400/50',
  [MagicForce.VESPER]: 'bg-vesper-500/20 text-vesper-500 dark:text-vesper-300 border-vesper-400/50',
  [MagicForce.AETHER]: 'bg-aether-500/20 text-aether-600 dark:text-aether-300 border-aether-400/50',
  [MagicForce.HUMUS]: 'bg-humus-500/20 text-humus-600 dark:text-humus-400 border-humus-400/50',
  [MagicForce.SANGUIS]: 'bg-sanguis-500/20 text-sanguis-600 dark:text-sanguis-400 border-sanguis-400/50',
  [MagicForce.NIHIL]: 'bg-nihil-500/20 text-nihil-500 dark:text-nihil-300 border-nihil-400/50',
}

const sizes = { sm: 'text-xs px-1.5 py-0.5', md: 'text-sm px-2 py-1', lg: 'text-base px-3 py-1.5' }

export function ForceBadge({ force, size = 'md', showLabel = true, className }: ForceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-ui font-medium',
        forceBgMap[force],
        sizes[size],
        className,
      )}
    >
      <span>{FORCE_ICONS[force]}</span>
      {showLabel && <span>{FORCE_LABELS[force]}</span>}
    </span>
  )
}
