import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const agents = await prisma.agent.findMany({
    where: { isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(agents)
}
