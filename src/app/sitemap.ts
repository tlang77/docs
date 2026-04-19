import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://mountainretreatrealty.com'

  const properties = await prisma.property.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, updatedAt: true },
  })

  const agents = await prisma.agent.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  })

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/listings`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
    ...properties.map((p: { id: string; updatedAt: Date }) => ({ url: `${baseUrl}/listings/${p.id}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...agents.map((a: { id: string; updatedAt: Date }) => ({ url: `${baseUrl}/agents/${a.id}`, lastModified: a.updatedAt, priority: 0.6 })),
  ]
}
