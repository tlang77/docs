'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  defaultValue?: string
  size?: 'sm' | 'lg'
}

export function SearchBar({ defaultValue = '', size = 'sm' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/listings?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const isLg = size === 'lg'

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className={`relative flex-1 ${isLg ? 'text-base' : 'text-sm'}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City, ZIP, address, or neighborhood…"
          className={`w-full pl-9 pr-4 border border-stone-300 rounded-l-xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isLg ? 'py-4 text-base' : 'py-2.5 text-sm'
          }`}
        />
      </div>
      <button
        type="submit"
        className={`bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-r-xl transition whitespace-nowrap ${
          isLg ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm'
        }`}
      >
        Search
      </button>
    </form>
  )
}
