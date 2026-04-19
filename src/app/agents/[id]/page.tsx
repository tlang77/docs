import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Phone, Mail, Award } from 'lucide-react'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = await prisma.agent.findUnique({ where: { id: params.id }, include: { user: { select: { name: true } } } })
  return { title: agent?.user.name ?? 'Agent Profile' }
}

export default async function AgentProfilePage({ params }: PageProps) {
  const agent = await prisma.agent.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      listings: {
        where: { status: 'ACTIVE' },
        include: { photos: { where: { isPrimary: true }, take: 1 }, _count: { select: { favorites: true } } },
        orderBy: { listedAt: 'desc' },
      },
    },
  })

  if (!agent) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-12 bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
        {agent.photoUrl ? (
          <Image src={agent.photoUrl} alt={agent.user.name ?? ''} width={100} height={100} className="rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-4xl shrink-0">
            {(agent.user.name ?? 'A')[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-900">{agent.user.name}</h1>
          <p className="text-emerald-700 font-medium mb-1">{agent.title}</p>
          <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-4">
            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-emerald-600" /> License #{agent.licenseNum}</span>
            <a href={`tel:${agent.phone}`} className="flex items-center gap-1 hover:text-emerald-700"><Phone className="w-4 h-4" />{agent.phone}</a>
            <a href={`mailto:${agent.user.email}`} className="flex items-center gap-1 hover:text-emerald-700"><Mail className="w-4 h-4" />Email</a>
          </div>
          {agent.bio && <p className="text-stone-600 leading-relaxed">{agent.bio}</p>}
        </div>
      </div>

      {agent.listings.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-stone-900 mb-6">{agent.listings.length} Active Listing{agent.listings.length !== 1 ? 's' : ''}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agent.listings.map((p) => <PropertyCard key={p.id} property={p as any} />)}
          </div>
        </>
      )}
    </div>
  )
}
