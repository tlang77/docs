import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { searchParamsSchema } from '@/lib/validations/search'
import { FilterPanel } from '@/components/search/FilterPanel'
import { SearchBar } from '@/components/search/SearchBar'
import { ListingsClientLayout } from '@/components/search/ListingsClientLayout'
import type { Prisma, PropertyStatus, PropertyType } from '@/generated/prisma'

export const metadata: Metadata = {
  title: 'Search Listings',
  description: 'Browse Colorado mountain properties — Aspen, Vail, Telluride, Breckenridge and more.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Record<string, string | string[]>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  )
  const parsed = searchParamsSchema.safeParse({ ...params, page: params.page ?? '1' })
  const { city, zip, q, minPrice, maxPrice, beds, baths, type, sort, page, limit, status } = parsed.success
    ? parsed.data
    : { city: undefined, zip: undefined, q: undefined, minPrice: undefined, maxPrice: undefined, beds: undefined, baths: undefined, type: undefined, sort: undefined, page: 1, limit: 24, status: undefined }

  const typeArray = type ? (Array.isArray(type) ? type : [type]) : undefined

  const where: Prisma.PropertyWhereInput = {
    status: (status as PropertyStatus) ?? 'ACTIVE',
    ...(city && { city: { contains: city, mode: 'insensitive' } }),
    ...(zip && { zipCode: zip }),
    ...(q && {
      OR: [
        { streetAddress: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { neighborhood: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(minPrice && { listPrice: { gte: minPrice } }),
    ...(maxPrice && { listPrice: { lte: maxPrice } }),
    ...(beds && { bedrooms: { gte: beds } }),
    ...(baths && { bathrooms: { gte: baths } }),
    ...(typeArray?.length && { propertyType: { in: typeArray as PropertyType[] } }),
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === 'price_asc' ? { listPrice: 'asc' }
    : sort === 'price_desc' ? { listPrice: 'desc' }
    : sort === 'sqft_desc' ? { squareFeet: 'desc' }
    : { listedAt: 'desc' }

  const pageNum = page ?? 1
  const pageSize = limit ?? 24

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.property.count({ where }),
  ])

  const mapProperties = properties.map((p) => ({
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

  const pagination = total > pageSize ? (
    <div className="mt-8 flex justify-center gap-2 text-sm">
      {pageNum > 1 && (
        <a href={`/listings?${new URLSearchParams({ ...params, page: String(pageNum - 1) })}`}
          className="px-4 py-2 border rounded-lg hover:bg-stone-50">← Prev</a>
      )}
      {pageNum * pageSize < total && (
        <a href={`/listings?${new URLSearchParams({ ...params, page: String(pageNum + 1) })}`}
          className="px-4 py-2 border rounded-lg hover:bg-stone-50">Next →</a>
      )}
    </div>
  ) : null

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <SearchBar defaultValue={q ?? city ?? ''} />
      </div>
      <FilterPanel />
      <ListingsClientLayout
        initialProperties={properties as any}
        initialTotal={total}
        mapProperties={mapProperties}
        paginationHtml={pagination}
      />
    </div>
  )
}
