import { MagicForce } from '@hesperedia/shared-types'
import { cn } from '@/lib/utils'

interface MagicMeterProps {
  level: number
  force: MagicForce
  maxLevel?: number
  label?: boolean
}

const forceFill: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'bg-lumen-500',
  [MagicForce.VESPER]: 'bg-vesper-500',
  [MagicForce.AETHER]: 'bg-aether-500',
  [MagicForce.HUMUS]: 'bg-humus-500',
  [MagicForce.SANGUIS]: 'bg-sanguis-600',
  [MagicForce.NIHIL]: 'bg-nihil-500',
}

export function MagicMeter({ level, force, maxLevel = 10, label = true }: MagicMeterProps) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs font-ui text-ink/60 dark:text-parchment-400">
          <span>Niveau magique</span>
          <span>{level}/{maxLevel}</span>
        </div>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-2.5 rounded-sm transition-all',
              i < level ? forceFill[force] : 'bg-parchment-300 dark:bg-nihil-700',
              i < level && 'shadow-sm',
            )}
          />
        ))}
      </div>
    </div>
  )
}
