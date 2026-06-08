'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeTab = tabs.find((t) => t.key === active)

  return (
    <div className={className}>
      <div className="relative flex border-b border-parchment-300 dark:border-nihil-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[tab.key] = el }}
            onClick={() => setActive(tab.key)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-ui font-medium transition-colors',
              active === tab.key
                ? 'text-lumen-600 dark:text-lumen-400'
                : 'text-ink/60 dark:text-parchment-400 hover:text-ink dark:hover:text-parchment-200',
            )}
          >
            {tab.label}
            {active === tab.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lumen-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeTab?.content}</div>
    </div>
  )
}
