'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/Skeleton'

const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap').then((m) => m.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <Skeleton className="w-full h-full rounded-none" />
      </div>
    ),
  },
)

export default function MapPage() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      <InteractiveMap />
    </div>
  )
}
