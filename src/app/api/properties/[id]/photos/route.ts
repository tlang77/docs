import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, isAgent } from '@/lib/auth'
import { z } from 'zod'

const photoSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean().optional(),
  caption: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = photoSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  if (parsed.data.isPrimary) {
    await prisma.propertyPhoto.updateMany({
      where: { propertyId: params.id },
      data: { isPrimary: false },
    })
  }

  const photo = await prisma.propertyPhoto.create({
    data: { propertyId: params.id, ...parsed.data },
  })

  return NextResponse.json(photo, { status: 201 })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { photoId } = await req.json()
  await prisma.propertyPhoto.delete({ where: { id: photoId, propertyId: params.id } })
  return NextResponse.json({ ok: true })
}
