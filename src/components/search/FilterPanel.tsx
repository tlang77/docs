'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

const PRICE_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '$500K', value: '50000000' },
  { label: '$1M', value: '100000000' },
  { label: '$2M', value: '200000000' },
  { label: '$5M', value: '500000000' },
]

const BED_OPTIONS = [0, 1, 2, 3, 4, 5]
const PROPERTY_TYPES = [
  { value: 'SINGLE_FAMILY', label: 'House' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'MULTI_FAMILY', label: 'Multi-Family' },
  { value: 'LAND', label: 'Land' },
]

export function FilterPanel() {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      router.push('/listings?' + next.toString())
    },
    [params, router]
  )

  const toggleType = (type: string) => {
    const existing = params.getAll('type')
    const next = new URLSearchParams(params.toString())
    next.delete('type')
    if (existing.includes(type)) {
      existing.filter((t) => t !== type).forEach((t) => next.append('type', t))
    } else {
      ;[...existing, type].forEach((t) => next.append('type', t))
    }
    next.delete('page')
    router.push('/listings?' + next.toString())
  }

  const clear = () => router.push('/listings')

  const hasFilters = ['minPrice', 'maxPrice', 'beds', 'type'].some((k) => params.has(k))

  return (
    <div className="py-3 space-y-2 sm:space-y-0">
      {/* Row 1: price + beds selects (always visible, scroll on xs) */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:items-center sm:gap-3">
        <select
          className="shrink-0 border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white text-stone-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={params.get('minPrice') ?? ''}
          onChange={(e) => update('minPrice', e.target.value)}
        >
          <option value="">Min price</option>
          {PRICE_OPTIONS.slice(1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          className="shrink-0 border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white text-stone-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={params.get('maxPrice') ?? ''}
          onChange={(e) => update('maxPrice', e.target.value)}
        >
          <option value="">Max price</option>
          {PRICE_OPTIONS.slice(1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          className="shrink-0 border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white text-stone-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={params.get('beds') ?? ''}
          onChange={(e) => update('beds', e.target.value)}
        >
          <option value="">Beds</option>
          {BED_OPTIONS.map((b) => <option key={b} value={b}>{b === 0 ? 'Studio' : `${b}+ bd`}</option>)}
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear} className="shrink-0 gap-1 text-stone-500">
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>

      {/* Row 2: property type pills (horizontal scroll on mobile) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
        {PROPERTY_TYPES.map((t) => {
          const active = params.getAll('type').includes(t.value)
          return (
            <button
              key={t.value}
              onClick={() => toggleType(t.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                active ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
