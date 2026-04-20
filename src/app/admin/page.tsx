import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PriceTag } from '@/components/ui/PriceTag'

export const metadata = { title: 'Agent Dashboard' }

export default async function AdminDashboardPage() {
  const session = await auth()
  const agentId = session!.user.agentId

  const [activeListings, newInquiries, recentInquiries] = await Promise.all([
    prisma.property.count({ where: { agentId: agentId ?? undefined, status: 'ACTIVE' } }),
    prisma.inquiry.count({ where: { assignedAgentId: agentId ?? undefined, status: 'NEW' } }),
    prisma.inquiry.findMany({
      where: { assignedAgentId: agentId ?? undefined },
      include: { property: { select: { streetAddress: true, city: true, listPrice: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Active Listings</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">{activeListings}</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">New Inquiries</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{newInquiries}</p>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-emerald-700 hover:underline">View all</Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="p-5 text-sm text-stone-400">No inquiries yet.</p>
        ) : (
          <ul className="divide-y divide-stone-50">
            {recentInquiries.map((inq) => (
              <li key={inq.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{inq.contactName}</p>
                  <p className="text-xs text-stone-500 truncate">{inq.property.streetAddress}, {inq.property.city}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  inq.status === 'NEW' ? 'bg-emerald-100 text-emerald-700'
                  : inq.status === 'CONTACTED' ? 'bg-amber-100 text-amber-700'
                  : 'bg-stone-100 text-stone-500'
                }`}>{inq.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
