import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { SearchBar } from '@/components/search/SearchBar'
import { AgentCard } from '@/components/agents/AgentCard'
import { Shield, TrendingDown, Map, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mountain Retreat Realty — Colorado Mountain Real Estate',
  description: 'Buy Colorado mountain homes in Aspen, Vail, Telluride, Breckenridge and beyond. No ads, full price transparency, direct agent access.',
}

export default async function HomePage() {
  const [featuredProperties, agents] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { listedAt: 'desc' },
      take: 6,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.agent.findMany({
      where: { isActive: true },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { listings: true } },
      },
      take: 3,
    }),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Colorado mountains"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Find Your Colorado<br />Mountain Retreat
          </h1>
          <p className="text-stone-300 text-lg mb-10 max-w-xl mx-auto">
            Aspen · Vail · Telluride · Breckenridge · and beyond.<br />No ads. No lead selling. Just your perfect mountain home.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar size="lg" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {['Aspen', 'Vail', 'Telluride', 'Breckenridge', 'Steamboat Springs'].map((city) => (
              <Link
                key={city}
                href={`/listings?city=${encodeURIComponent(city)}`}
                className="text-sm text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-10">Better than Zillow. Here&apos;s why.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'No ads, ever', desc: 'Your search is never monetized. We never sell your contact info.' },
              { icon: TrendingDown, title: 'Full price history', desc: 'See every price change since day one. No hidden data.' },
              { icon: Map, title: 'Better map search', desc: 'Draw a polygon on the map to search exact areas you want.' },
              { icon: Users, title: 'Direct to our agents', desc: 'Every inquiry goes directly to Mountain Retreat Realty. No middlemen.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-5">
                <div className="bg-emerald-100 rounded-2xl p-4 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-900">New Listings</h2>
          <Link href="/listings" className="text-sm text-emerald-700 font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((p) => (
            <PropertyCard key={p.id} property={p as any} />
          ))}
        </div>
      </section>

      {/* Meet the agents */}
      {agents.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Meet Our Agents</h2>
              <Link href="/agents" className="text-sm text-emerald-700 font-medium hover:underline">All agents →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-emerald-800 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to find your mountain home?</h2>
        <p className="text-emerald-200 mb-8">Our agents specialize in Colorado&apos;s premier ski resort markets.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/listings" className="bg-white text-emerald-800 font-semibold px-8 py-3 rounded-xl hover:bg-emerald-50 transition">
            Browse Listings
          </Link>
          <Link href="/contact" className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">
            Talk to an Agent
          </Link>
        </div>
      </section>
    </>
  )
}
