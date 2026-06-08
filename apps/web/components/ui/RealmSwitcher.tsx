'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const REALMS = [
  { id: 'hesperedia', name: 'Hesperedia', color: '#D4A017', description: 'Le monde principal' },
  { id: 'underworld', name: 'Underworld', color: '#8B0000', description: 'Le monde infernal' },
  { id: 'orla', name: "L'Orla", color: '#4C1D95', description: "L'espace cosmique" },
  { id: 'crimson', name: 'The Crimson', color: '#C41E3A', description: 'Les terres carmin' },
]

interface RealmSwitcherProps {
  activeRealm: string
  onChange: (realm: string) => void
  className?: string
}

export function RealmSwitcher({ activeRealm, onChange, className }: RealmSwitcherProps) {
  return (
    <div className={cn('bg-nihil-900/90 backdrop-blur-sm rounded-xl border border-nihil-700 p-3', className)}>
      <p className="text-xs font-ui text-parchment-500 uppercase tracking-widest mb-3">Royaume</p>
      <div className="space-y-1">
        {REALMS.map((realm) => {
          const isActive = activeRealm === realm.id
          return (
            <motion.button
              key={realm.id}
              onClick={() => onChange(realm.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm font-ui transition-colors flex items-center gap-3',
                isActive ? 'text-white' : 'text-parchment-300 hover:bg-nihil-800',
              )}
              style={isActive ? { backgroundColor: realm.color } : {}}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: realm.color }}
              />
              <span className="font-medium">{realm.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
