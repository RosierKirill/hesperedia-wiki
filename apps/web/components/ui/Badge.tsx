import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger'
  className?: string
}

const variants = {
  default: 'bg-parchment-200 text-ink dark:bg-nihil-700 dark:text-parchment-200',
  outline: 'border border-parchment-400 dark:border-nihil-500 text-ink dark:text-parchment-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-lumen-100 text-lumen-800 dark:bg-lumen-900/30 dark:text-lumen-300',
  danger: 'bg-sanguis-100 text-sanguis-800 dark:bg-sanguis-900/30 dark:text-sanguis-300',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-ui font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
