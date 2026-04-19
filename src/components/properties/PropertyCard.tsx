'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Maximize2, Heart, MapPin } from 'lucide-react'
import { PriceTag } from '@/components/ui/PriceTag'
import { Badge } from '@/components/ui/Badge'
import { formatBaths, propertyTypeLabel, daysOnMarket } from '@/lib/formatters'
import type { PropertySearchResult } from '@/types/property'

interface PropertyCardProps {
  property: PropertySearchResult
  isFavorited?: boolean
  onFavoriteToggle?: (id: string) => void
}

const statusVariant = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  SOLD: 'red',
  OFF_MARKET: 'default',
} as const

export function PropertyCard({ property, isFavorited, onFavoriteToggle }: PropertyCardProps) {
  const primaryPhoto = property.photos[0]
  const dom = daysOnMarket(property.listedAt)

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/listings/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={`${property.streetAddress}, ${property.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Maximize2 className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant[property.status as keyof typeof statusVariant] ?? 'default'}>
            {property.status === 'ACTIVE' ? (dom <= 7 ? 'New' : 'Active') : property.status.replace('_', ' ')}
          </Badge>
        </div>
        {onFavoriteToggle && (
          <button
            onClick={(e) => { e.preventDefault(); onFavoriteToggle(property.id) }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow transition"
            aria-label={isFavorited ? 'Remove from saved' : 'Save home'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
          </button>
        )}
      </Link>

      <Link href={`/listings/${property.id}`} className="block p-4">
        <PriceTag cents={property.listPrice} className="text-xl font-bold text-stone-900" />
        <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {property.streetAddress}, {property.city}, {property.state}
        </p>
        <div className="flex items-center gap-3 mt-3 text-sm text-stone-600">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} bd</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{formatBaths(property.bathrooms)} ba</span>
          {property.squareFeet && (
            <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" />{property.squareFeet.toLocaleString()} sqft</span>
          )}
        </div>
        <p className="text-xs text-stone-400 mt-2">{propertyTypeLabel(property.propertyType)} · {dom === 0 ? 'Listed today' : `${dom}d on market`}</p>
      </Link>
    </article>
  )
}
