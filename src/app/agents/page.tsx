import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AgentCard } from '@/components/agents/AgentCard'

export const metadata: Metadata = {
  title: 'Our Agents',
  description: 'Meet the Mountain Retreat Realty team — Colorado mountain real estate specialists.',
}

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    where: { isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Our Agents</h1>
      <p className="text-stone-500 mb-10">Colorado mountain real estate specialists ready to help you find your perfect retreat.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => <AgentCard key={agent.id} agent={agent as any} />)}
      </div>
    </div>
  )
}
