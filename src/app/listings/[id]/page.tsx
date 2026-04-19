import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PriceHistoryChart } from '@/components/properties/PriceHistoryChart'
import { PropertyFeatures } from '@/components/properties/PropertyFeatures'
import { InquiryForm } from '@/components/inquiry/InquiryForm'
import { PriceTag } from '@/components/ui/PriceTag'
import { Badge } from '@/components/ui/Badge'
import { formatDate, propertyTypeLabel, daysOnMarket } from '@/lib/formatters'
import { MapPin, Calendar, ExternalLink, Phone, Mail } from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    select: { streetAddress: true, city: true, state: true, listPrice: true, description: true, photos: { where: { isPrimary: true }, take: 1 } },
  })
  if (!property) return { title: 'Property Not Found' }
  return {
    title: `${property.streetAddress}, ${property.city}`,
    description: property.description?.slice(0, 155) ?? `${propertyTypeLabel('SINGLE_FAMILY')} in ${property.city}, ${property.state}`,
    openGraph: {
      images: property.photos[0] ? [{ url: property.photos[0].url }] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      photos: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      priceHistory: { orderBy: { date: 'asc' } },
      openHouses: { orderBy: { startTime: 'asc' }, where: { startTime: { gte: new Date() } } },
      agent: { include: { user: { select: { name: true, email: true, image: true } } } },
      _count: { select: { favorites: true } },
    },
  })

  if (!property) notFound()

  const primaryPhoto = property.photos.find((p) => p.isPrimary) ?? property.photos[0]
  const secondaryPhotos = property.photos.filter((p) => p.id !== primaryPhoto?.id).slice(0, 4)
  const dom = daysOnMarket(property.listedAt)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Photo gallery */}
      <div className="rounded-2xl overflow-hidden mb-8">
        {/* Mobile: single full-width photo */}
        <div className="sm:hidden relative bg-stone-200 h-64">
          {primaryPhoto && (
            <Image src={primaryPhoto.url} alt={property.streetAddress} fill className="object-cover" sizes="100vw" priority />
          )}
        </div>
        {/* sm+: grid layout */}
        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
          <div className="col-span-2 row-span-2 relative bg-stone-200">
            {primaryPhoto && (
              <Image src={primaryPhoto.url} alt={property.streetAddress} fill className="object-cover" sizes="50vw" priority />
            )}
          </div>
          {secondaryPhotos.map((photo, i) => (
            <div key={photo.id} className={`relative bg-stone-200 ${i >= 2 ? 'row-start-2' : ''}`}>
              <Image src={photo.url} alt={`Photo ${i + 2}`} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <PriceTag cents={property.listPrice} className="text-3xl font-bold text-stone-900" />
              <Badge variant={property.status === 'ACTIVE' ? 'green' : property.status === 'SOLD' ? 'red' : 'yellow'}>
                {property.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="flex items-center gap-1.5 text-stone-600 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              {property.streetAddress}{property.unit ? `, ${property.unit}` : ''}, {property.city}, {property.state} {property.zipCode}
            </p>
            <p className="text-sm text-stone-400">
              {propertyTypeLabel(property.propertyType)} · Listed {formatDate(property.listedAt)} · {dom === 0 ? 'Listed today' : `${dom} days on market`}
            </p>
          </div>

          {/* Features */}
          <PropertyFeatures property={property} />

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="text-base font-semibold text-stone-900 mb-2">About this home</h3>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Virtual tour */}
          {property.virtualTourUrl && (
            <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium hover:underline">
              <ExternalLink className="w-4 h-4" /> Virtual Tour
            </a>
          )}

          {/* Open houses */}
          {property.openHouses.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-stone-900 mb-3">Open Houses</h3>
              <ul className="space-y-2">
                {property.openHouses.map((oh) => (
                  <li key={oh.id} className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {formatDate(oh.startTime)} · {new Date(oh.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(oh.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {oh.notes && <span className="text-stone-400">· {oh.notes}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price history — the #1 differentiator */}
          <div className="bg-stone-50 rounded-2xl p-5">
            <PriceHistoryChart history={property.priceHistory} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent card */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-stone-400 mb-3">Listed by</p>
            <Link href={`/agents/${property.agent.id}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition">
              {property.agent.photoUrl ? (
                <Image src={property.agent.photoUrl} alt={property.agent.user.name ?? ''} width={48} height={48} className="rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                  {(property.agent.user.name ?? 'A')[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-stone-900 text-sm">{property.agent.user.name}</p>
                <p className="text-xs text-stone-500">{property.agent.title}</p>
              </div>
            </Link>
            <div className="flex flex-col gap-2 text-sm text-stone-600 mb-4">
              <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 hover:text-emerald-700">
                <Phone className="w-4 h-4" /> {property.agent.phone}
              </a>
              <a href={`mailto:${property.agent.user.email}`} className="flex items-center gap-2 hover:text-emerald-700">
                <Mail className="w-4 h-4" /> Email agent
              </a>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">Request a showing</h3>
            <InquiryForm
              propertyId={property.id}
              agentId={property.agent.id}
              propertyAddress={`${property.streetAddress}, ${property.city}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
