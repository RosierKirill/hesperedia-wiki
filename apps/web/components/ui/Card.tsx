'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MagicForce } from '@hesperedia/shared-types'

interface CardProps {
  children: React.ReactNode
  variant?: 'parchment' | 'dark' | 'force'
  force?: MagicForce
  className?: string
  hover?: boolean
}

const forceGlowMap: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'border-lumen-400/50 hover:shadow-lumen-500/20',
  [MagicForce.VESPER]: 'border-vesper-400/50 hover:shadow-vesper-500/20',
  [MagicForce.AETHER]: 'border-aether-400/50 hover:shadow-aether-500/20',
  [MagicForce.HUMUS]: 'border-humus-400/50 hover:shadow-humus-500/20',
  [MagicForce.SANGUIS]: 'border-sanguis-400/50 hover:shadow-sanguis-500/20',
  [MagicForce.NIHIL]: 'border-nihil-400/50 hover:shadow-nihil-500/20',
}

export function Card({ children, variant = 'parchment', force, className, hover = false }: CardProps) {
  const baseClass = cn(
    'rounded-lg border transition-all duration-200',
    variant === 'parchment' && 'bg-parchment-50 dark:bg-nihil-800 border-parchment-300 dark:border-nihil-700',
    variant === 'dark' && 'bg-nihil-800 border-nihil-700',
    variant === 'force' && force && `bg-parchment-50 dark:bg-nihil-800 border ${forceGlowMap[force]}`,
    hover && 'hover:shadow-lg cursor-pointer',
    className,
  )

  if (hover) {
    return (
      <motion.div
        className={baseClass}
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={baseClass}>{children}</div>
}
