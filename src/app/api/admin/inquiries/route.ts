import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, isAgent } from '@/lib/auth'
import type { InquiryStatus } from '@/generated/prisma'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as InquiryStatus | null

  const inquiries = await prisma.inquiry.findMany({
    where: {
      assignedAgentId: session.user.agentId ?? undefined,
      ...(status && { status }),
    },
    include: { property: { select: { streetAddress: true, city: true, listPrice: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(inquiries)
}
