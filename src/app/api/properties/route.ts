import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, isAgent } from '@/lib/auth'
import { searchParamsSchema } from '@/lib/validations/search'
import { propertyCreateSchema } from '@/lib/validations/property'
import type { Prisma, PropertyStatus, PropertyType } from '@/generated/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const params = Object.fromEntries(searchParams.entries())
  const parsed = searchParamsSchema.safeParse(params)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { city, zip, q, minPrice, maxPrice, beds, baths, type, sort, page, limit, status } = parsed.data

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
    ...(type && {
      propertyType: {
        in: (Array.isArray(type) ? type : [type]) as PropertyType[],
      },
    }),
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === 'price_asc' ? { listPrice: 'asc' }
    : sort === 'price_desc' ? { listPrice: 'desc' }
    : sort === 'sqft_desc' ? { squareFeet: 'desc' }
    : { listedAt: 'desc' }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: ((page ?? 1) - 1) * (limit ?? 24),
      take: limit ?? 24,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.property.count({ where }),
  ])

  return NextResponse.json({ properties, total, page: page ?? 1, limit: limit ?? 24 })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = propertyCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const agentId = session.user.agentId
  if (!agentId) return NextResponse.json({ error: 'No agent profile' }, { status: 400 })

  const property = await prisma.property.create({
    data: {
      ...parsed.data,
      agentId,
      priceHistory: {
        create: { price: parsed.data.listPrice, event: 'Listed', source: 'Agent' },
      },
    },
  })

  return NextResponse.json(property, { status: 201 })
}
