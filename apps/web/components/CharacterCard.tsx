'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Character } from '@hesperedia/shared-types'
import { ForceBadge } from './ui/ForceBadge'
import { Badge } from './ui/Badge'
import { cn } from '@/lib/utils'

interface CharacterCardProps {
  character: Character
}

const statusVariants: Record<string, 'success' | 'danger' | 'warning' | 'outline'> = {
  ALIVE: 'success',
  DECEASED: 'outline',
  UNDEAD: 'warning',
  UNKNOWN: 'outline',
  TRANSFORMED: 'danger',
}

const statusLabels: Record<string, string> = {
  ALIVE: 'Vivant',
  DECEASED: 'Décédé',
  UNDEAD: 'Mort-Vivant',
  UNKNOWN: 'Inconnu',
  TRANSFORMED: 'Transformé',
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={`/characters/${character.slug}`} className="block group">
      <motion.div
        className="relative rounded-lg overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-parchment-200 dark:bg-nihil-900">
          {character.portraitUrl ? (
            <Image
              src={character.portraitUrl}
              alt={character.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-parchment-300 to-parchment-400 dark:from-nihil-800 dark:to-nihil-900">
              <span className="text-4xl opacity-30">⚔</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="font-heading text-white text-sm font-semibold leading-tight line-clamp-2">
              {character.name}
            </p>
            {character.titles[0] && (
              <p className="text-parchment-300 text-xs mt-0.5 line-clamp-1 font-body italic">
                {character.titles[0]}
              </p>
            )}
          </div>
        </div>
        <div className="p-3 flex flex-wrap gap-1.5">
          {character.primaryForce && (
            <ForceBadge force={character.primaryForce} size="sm" />
          )}
          {character.secondaryForce && (
            <ForceBadge force={character.secondaryForce} size="sm" showLabel={false} />
          )}
          <Badge variant={statusVariants[character.status] ?? 'outline'} className="ml-auto">
            {statusLabels[character.status] ?? character.status}
          </Badge>
        </div>
      </motion.div>
    </Link>
  )
}
