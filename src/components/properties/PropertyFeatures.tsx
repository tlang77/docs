import { Bed, Bath, Maximize2, Car, Waves, Calendar, TreePine } from 'lucide-react'
import { formatBaths, formatSqFt } from '@/lib/formatters'
import type { Property } from '@/generated/prisma'

export function PropertyFeatures({ property }: { property: Property }) {
  const features = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms.toString() },
    { icon: Bath, label: 'Bathrooms', value: formatBaths(property.bathrooms) },
    ...(property.squareFeet ? [{ icon: Maximize2, label: 'Living area', value: formatSqFt(property.squareFeet) }] : []),
    ...(property.lotSizeSqFt ? [{ icon: TreePine, label: 'Lot size', value: formatSqFt(property.lotSizeSqFt) }] : []),
    ...(property.garageSpaces ? [{ icon: Car, label: 'Garage', value: `${property.garageSpaces} space${property.garageSpaces > 1 ? 's' : ''}` }] : []),
    ...(property.hasPool ? [{ icon: Waves, label: 'Pool', value: 'Yes' }] : []),
    ...(property.yearBuilt ? [{ icon: Calendar, label: 'Year built', value: property.yearBuilt.toString() }] : []),
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {features.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
          <div className="bg-emerald-100 rounded-lg p-2">
            <Icon className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs text-stone-500">{label}</p>
            <p className="text-sm font-semibold text-stone-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
