import Link from 'next/link'
import { Mountain, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Mountain className="w-5 h-5 text-emerald-400" />
            Mountain Retreat Realty
          </div>
          <p className="text-sm leading-relaxed">
            Colorado&apos;s trusted mountain real estate specialists. No ads, no lead selling — just direct connections to our expert agents.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/listings" className="hover:text-white transition">Browse Listings</Link></li>
            <li><Link href="/agents" className="hover:text-white transition">Meet Our Agents</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (970) 555-0100</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@mountainretreatrealty.com</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Aspen, CO 81611</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-600">
        © {new Date().getFullYear()} Mountain Retreat Realty. All rights reserved.
      </div>
    </footer>
  )
}
