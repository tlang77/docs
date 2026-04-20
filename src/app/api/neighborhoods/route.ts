import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  const neighborhoods = await prisma.neighborhood.findMany({
    where: city ? { city: { contains: city, mode: 'insensitive' } } : undefined,
    select: { id: true, name: true, city: true, geoJson: true, medianPrice: true },
  })

  return NextResponse.json(neighborhoods)
}
