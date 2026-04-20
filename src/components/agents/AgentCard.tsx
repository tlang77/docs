import Image from 'next/image'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import type { AgentWithUser } from '@/types/agent'

export function AgentCard({ agent }: { agent: AgentWithUser }) {
  return (
    <Link href={`/agents/${agent.id}`} className="group bg-white rounded-2xl border border-stone-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow block">
      {agent.photoUrl ? (
        <Image
          src={agent.photoUrl}
          alt={agent.user.name ?? ''}
          width={72}
          height={72}
          className="rounded-full object-cover mx-auto mb-3"
        />
      ) : (
        <div className="w-18 h-18 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl mx-auto mb-3 w-16 h-16">
          {(agent.user.name ?? 'A')[0]}
        </div>
      )}
      <p className="font-semibold text-stone-900">{agent.user.name}</p>
      <p className="text-sm text-stone-500 mb-1">{agent.title}</p>
      <p className="text-xs text-emerald-700 font-medium">{agent._count.listings} active listing{agent._count.listings !== 1 ? 's' : ''}</p>
      <p className="text-xs text-stone-400 mt-2 flex items-center justify-center gap-1">
        <Phone className="w-3 h-3" /> {agent.phone}
      </p>
    </Link>
  )
}
