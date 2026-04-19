import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PriceTag } from '@/components/ui/PriceTag'
import { Badge } from '@/components/ui/Badge'
import { Plus } from 'lucide-react'

export const metadata = { title: 'My Listings' }

export default async function AdminListingsPage() {
  const session = await auth()
  const listings = await prisma.property.findMany({
    where: { agentId: session!.user.agentId ?? undefined },
    include: { photos: { where: { isPrimary: true }, take: 1 } },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Listings</h1>
        <Link href="/admin/listings/new" className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
          <Plus className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Property</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {listings.map((l) => (
              <tr key={l.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{l.streetAddress}</p>
                  <p className="text-stone-400 text-xs">{l.city}, {l.state}</p>
                </td>
                <td className="px-4 py-3"><PriceTag cents={l.listPrice} /></td>
                <td className="px-4 py-3">
                  <Badge variant={l.status === 'ACTIVE' ? 'green' : l.status === 'SOLD' ? 'red' : 'yellow'}>
                    {l.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/listings/${l.id}/edit`} className="text-emerald-700 hover:underline text-sm">Edit</Link>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-400">No listings yet. <Link href="/admin/listings/new" className="text-emerald-700 hover:underline">Add one.</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
