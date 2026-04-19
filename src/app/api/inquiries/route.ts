import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { inquiryCreateSchema } from '@/lib/validations/inquiry'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/email'

export async function POST(req: Request) {
  const session = await auth()
  const body = await req.json()
  const parsed = inquiryCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const property = await prisma.property.findUnique({
    where: { id: parsed.data.propertyId },
    include: { agent: { include: { user: { select: { name: true, email: true } } } } },
  })
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

  const inquiry = await prisma.inquiry.create({
    data: {
      ...parsed.data,
      userId: session?.user.id ?? null,
      assignedAgentId: property.agentId,
    },
  })

  const address = `${property.streetAddress}, ${property.city}`
  try {
    await Promise.all([
      sendInquiryNotification({
        agentName: property.agent.user.name ?? 'Agent',
        agentEmail: property.agent.user.email,
        contactName: parsed.data.contactName,
        contactEmail: parsed.data.contactEmail,
        contactPhone: parsed.data.contactPhone,
        propertyAddress: address,
        propertyId: property.id,
        message: parsed.data.message,
      }),
      sendInquiryConfirmation({
        contactName: parsed.data.contactName,
        contactEmail: parsed.data.contactEmail,
        propertyAddress: address,
        agentName: property.agent.user.name ?? 'Agent',
        agentPhone: property.agent.phone,
      }),
    ])
  } catch {
    // Email failure doesn't fail the request
  }

  return NextResponse.json({ id: inquiry.id, createdAt: inquiry.createdAt }, { status: 201 })
}
