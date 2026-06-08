import { MagicForce } from '@hesperedia/shared-types'
import { FORCE_COLORS } from '@/lib/utils'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  force?: MagicForce
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

export function Avatar({ src, name, force, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  const borderClass = force ? FORCE_COLORS[force].border : 'border-parchment-400'

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden border-2 shrink-0 bg-nihil-800',
        sizeClasses[size],
        borderClass,
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-nihil-700 text-parchment-300 font-ui font-semibold select-none">
          {initials}
        </div>
      )}
    </div>
  )
}
