import { cn } from '@/lib/utils'

interface DangerMeterProps {
  level: number
  max?: number
  size?: 'sm' | 'md'
}

export function DangerMeter({ level, max = 10, size = 'md' }: DangerMeterProps) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'transition-all',
            size === 'sm' ? 'text-xs' : 'text-sm',
            i < level ? 'opacity-100' : 'opacity-20',
            level >= 7 ? 'text-sanguis-500' : level >= 4 ? 'text-lumen-600' : 'text-nihil-500',
          )}
          aria-hidden="true"
        >
          💀
        </span>
      ))}
    </div>
  )
}
