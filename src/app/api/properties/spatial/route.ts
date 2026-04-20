import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchByPolygon, searchByRadius, searchByBbox } from '@/lib/spatial'
import { z } from 'zod'

const polygonSchema = z.object({
  type: z.literal('polygon'),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
})

const radiusSchema = z.object({
  type: z.literal('radius'),
  lat: z.number(),
  lng: z.number(),
  radiusMiles: z.number().max(100),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
})

const bboxSchema = z.object({
  type: z.literal('bbox'),
  minLng: z.number(),
  minLat: z.number(),
  maxLng: z.number(),
  maxLat: z.number(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
})

export async function POST(req: Request) {
  const body = await req.json()
  let ids: string[] = []

  if (body.type === 'polygon') {
    const parsed = polygonSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid polygon' }, { status: 400 })
    const { type: _type, coordinates, ...filters } = parsed.data
    ids = await searchByPolygon({ polygon: coordinates as number[][][], ...filters })
  } else if (body.type === 'radius') {
    const parsed = radiusSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid radius' }, { status: 400 })
    const { type: _type, ...filters } = parsed.data
    ids = await searchByRadius(filters)
  } else if (body.type === 'bbox') {
    const parsed = bboxSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid bbox' }, { status: 400 })
    const { type: _type, ...filters } = parsed.data
    ids = await searchByBbox(filters)
  } else {
    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }

  if (!ids.length) return NextResponse.json({ properties: [], total: 0 })

  const properties = await prisma.property.findMany({
    where: { id: { in: ids } },
    include: {
      photos: { where: { isPrimary: true }, take: 1 },
      _count: { select: { favorites: true } },
    },
  })

  return NextResponse.json({ properties, total: properties.length })
}
