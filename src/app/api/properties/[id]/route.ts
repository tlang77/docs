import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, isAgent } from '@/lib/auth'
import { propertyUpdateSchema } from '@/lib/validations/property'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
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

  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(property)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.property.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (session.user.role !== 'ADMIN' && existing.agentId !== session.user.agentId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = propertyUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const priceChanged = parsed.data.listPrice && parsed.data.listPrice !== existing.listPrice
  const priceEvent = priceChanged
    ? parsed.data.listPrice! > existing.listPrice ? 'Price Increased' : 'Price Reduced'
    : null

  const statusChangedToSold = parsed.data.status === 'SOLD' && existing.status !== 'SOLD'

  const property = await prisma.property.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      ...(statusChangedToSold && { soldAt: new Date() }),
      ...(priceEvent && {
        priceHistory: { create: { price: parsed.data.listPrice!, event: priceEvent, source: 'Agent' } },
      }),
      ...(statusChangedToSold && {
        priceHistory: { create: { price: existing.listPrice, event: 'Sold', source: 'Agent' } },
      }),
    },
  })

  return NextResponse.json(property)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.property.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (session.user.role !== 'ADMIN' && existing.agentId !== session.user.agentId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.property.update({ where: { id: params.id }, data: { status: 'OFF_MARKET' } })
  return NextResponse.json({ ok: true })
}
