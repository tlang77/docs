'use client'

import { useState, useCallback, useTransition } from 'react'
import { MapView } from '@/components/map/MapView'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import type { PropertySearchResult } from '@/types/property'

interface Props {
  initialProperties: PropertySearchResult[]
  initialTotal: number
  mapProperties: {
    id: string
    lat: number
    lng: number
    listPrice: number
    bedrooms: number
    bathrooms: number
    streetAddress: string
    city: string
    photo?: string
  }[]
  paginationHtml?: React.ReactNode
}

export function ListingsClientLayout({ initialProperties, initialTotal, mapProperties, paginationHtml }: Props) {
  const [polygonResults, setPolygonResults] = useState<PropertySearchResult[] | null>(null)
  const [polygonLoading, setPolygonLoading] = useState(false)
  const [, startTransition] = useTransition()

  const handlePolygonChange = useCallback(async (coordinates: number[][][] | null) => {
    if (!coordinates) {
      startTransition(() => setPolygonResults(null))
      return
    }

    setPolygonLoading(true)
    try {
      const res = await fetch('/api/properties/spatial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'polygon', coordinates }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      startTransition(() => setPolygonResults(data.properties ?? data))
    } catch {
      // keep showing current results on error
    } finally {
      setPolygonLoading(false)
    }
  }, [])

  const displayProperties = polygonResults ?? initialProperties
  const displayTotal = polygonResults ? polygonResults.length : initialTotal
  const isPolygonMode = polygonResults !== null

  const displayMapProperties = polygonResults
    ? polygonResults.map((p) => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        listPrice: p.listPrice,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        streetAddress: p.streetAddress,
        city: p.city,
        photo: p.photos[0]?.url,
      }))
    : mapProperties

  return (
    <div className="flex gap-6">
      {/* Results list */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-500 mb-4">
          {polygonLoading ? 'Searching…' : (
            <>
              {displayTotal.toLocaleString()} home{displayTotal !== 1 ? 's' : ''} found
              {isPolygonMode && <span className="ml-2 text-emerald-700 font-medium">· in drawn area</span>}
            </>
          )}
        </p>
        {polygonLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-stone-100 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <>
            <PropertyGrid properties={displayProperties} />
            {!isPolygonMode && paginationHtml}
          </>
        )}
      </div>

      {/* Map */}
      <div className="hidden lg:block w-[480px] xl:w-[600px] shrink-0 sticky top-[80px] h-[calc(100vh-100px)]">
        <MapView
          properties={displayMapProperties}
          enableDraw
          onPolygonChange={handlePolygonChange}
        />
      </div>
    </div>
  )
}
