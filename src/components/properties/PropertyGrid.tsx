'use client'

import { PropertyCard } from './PropertyCard'
import { PropertyCardSkeleton } from './PropertyCardSkeleton'
import type { PropertySearchResult } from '@/types/property'

interface PropertyGridProps {
  properties: PropertySearchResult[]
  loading?: boolean
  favoritedIds?: Set<string>
  onFavoriteToggle?: (id: string) => void
}

export function PropertyGrid({ properties, loading, favoritedIds, onFavoriteToggle }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!properties.length) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p className="text-lg font-medium">No properties found</p>
        <p className="text-sm mt-1">Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          isFavorited={favoritedIds?.has(p.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}
