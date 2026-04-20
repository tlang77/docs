import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Mountain Retreat Realty — Colorado mountain real estate specialists committed to transparency and direct service.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-stone-900 mb-4">About Mountain Retreat Realty</h1>
      <p className="text-stone-500 text-lg mb-10">Colorado&apos;s mountain real estate specialists — with a different philosophy.</p>

      <div className="prose prose-stone max-w-none space-y-6 text-stone-700">
        <p>
          Mountain Retreat Realty was founded on a simple belief: buying a home should be about you — not about ad revenue.
          We operate exclusively in Colorado&apos;s premier mountain markets: Aspen, Vail, Telluride, Breckenridge, Steamboat Springs, and beyond.
        </p>
        <p>
          Unlike large national portals that sell your contact information to dozens of agents before you can even ask a question,
          every inquiry on our platform goes directly to our licensed agents. No lead auctions. No spam calls from agents who paid for your number.
        </p>
        <p>
          We also believe in radical price transparency. Every listing on our site shows the complete price history from day one —
          every price reduction, increase, and sale event. This is data that benefits you as a buyer, and we refuse to hide it.
        </p>
        <h2 className="text-xl font-bold text-stone-900 mt-8">Our Markets</h2>
        <ul className="list-disc pl-6 space-y-1">
          {['Aspen & Snowmass Village', 'Vail & Beaver Creek', 'Telluride & Mountain Village', 'Breckenridge & Keystone', 'Steamboat Springs', 'Crested Butte & Mt. Crested Butte', 'Winter Park & Fraser', 'Copper Mountain'].map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex gap-4">
        <Link href="/agents" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl transition">
          Meet Our Agents
        </Link>
        <Link href="/contact" className="border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold px-6 py-3 rounded-xl transition">
          Get in Touch
        </Link>
      </div>
    </div>
  )
}
