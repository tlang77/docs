import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, isAgent } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CLOSED']),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const inquiry = await prisma.inquiry.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json(inquiry)
}
