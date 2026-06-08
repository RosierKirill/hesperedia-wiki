'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Creature } from '@hesperedia/shared-types'
import { ForceBadge } from './ui/ForceBadge'
import { DangerMeter } from './ui/DangerMeter'
import { Badge } from './ui/Badge'

interface CreatureCardProps {
  creature: Creature
}

const categoryLabels: Record<string, string> = {
  SANGUIS_CORRUPTION: 'Corruption Sanguis',
  NIHIL_CORRUPTION: 'Corruption Nihil',
  MONSTER: 'Monstre',
  DEMON: 'Démon',
  ORLA_ENTITY: "Entité de l'Orla",
  TRANSFORMED_ANIMAL: 'Animal Transformé',
  HYBRID: 'Hybride',
  DEEP_CREATURE: 'Créature des Profondeurs',
}

export function CreatureCard({ creature }: CreatureCardProps) {
  return (
    <Link href={`/bestiary/${creature.slug}`} className="block group">
      <motion.div
        className="rounded-lg overflow-hidden border border-parchment-300 dark:border-nihil-700 bg-parchment-50 dark:bg-nihil-800 h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative aspect-square overflow-hidden bg-nihil-900">
          {creature.portraitUrl ? (
            <Image
              src={creature.portraitUrl}
              alt={creature.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-nihil-800 to-sanguis-900/30">
              <span className="text-5xl opacity-20">🦷</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-2 right-2">
            {creature.dangerLevel && (
              <div className="bg-black/60 rounded-full px-2 py-1">
                <DangerMeter level={creature.dangerLevel} size="sm" />
              </div>
            )}
          </div>
        </div>
        <div className="p-3 space-y-2">
          <div>
            <p className="font-heading text-ink dark:text-parchment-100 font-semibold text-sm line-clamp-1">
              {creature.name}
            </p>
            <Badge variant="outline" className="mt-1 text-xs">
              {categoryLabels[creature.category] ?? creature.category}
            </Badge>
          </div>
          {creature.primaryForce && (
            <ForceBadge force={creature.primaryForce} size="sm" />
          )}
        </div>
      </motion.div>
    </Link>
  )
}
