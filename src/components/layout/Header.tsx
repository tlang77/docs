'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Mountain, Menu, X, User, Heart, LayoutDashboard, LogOut } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const isAgent = session?.user.role === 'AGENT' || session?.user.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800 text-lg">
          <Mountain className="w-6 h-6" />
          <span className="hidden sm:inline">Mountain Retreat Realty</span>
          <span className="sm:hidden">MRR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
          <Link href="/listings" className="hover:text-emerald-700 transition">Buy</Link>
          <Link href="/agents" className="hover:text-emerald-700 transition">Agents</Link>
          <Link href="/about" className="hover:text-emerald-700 transition">About</Link>
          <Link href="/contact" className="hover:text-emerald-700 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/account/favorites" className="p-2 text-stone-500 hover:text-emerald-700 transition" title="Saved homes">
                <Heart className="w-5 h-5" />
              </Link>
              {isAgent && (
                <Link href="/admin" className="p-2 text-stone-500 hover:text-emerald-700 transition" title="Agent dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="p-2 text-stone-500 hover:text-red-600 transition"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block text-sm text-stone-600 hover:text-emerald-700 px-3 py-1.5 transition">
                Sign in
              </Link>
              <Link href="/auth/register" className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                Join
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 text-stone-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-2 text-sm">
          <Link href="/listings" className="block py-2 text-stone-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>Buy</Link>
          <Link href="/agents" className="block py-2 text-stone-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>Agents</Link>
          <Link href="/about" className="block py-2 text-stone-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="block py-2 text-stone-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>Contact</Link>
          {!session && (
            <Link href="/auth/login" className="block py-2 text-stone-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  )
}
