import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PropertyCard } from '@/components/properties/PropertyCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Saved Homes' }

export default async function FavoritesPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      property: {
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          _count: { select: { favorites: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Saved Homes ({favorites.length})</h1>
      {favorites.length === 0 ? (
        <p className="text-stone-500 text-center py-20">No saved homes yet. Heart a listing to save it here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <PropertyCard key={f.id} property={f.property as any} />
          ))}
        </div>
      )}
    </div>
  )
}
