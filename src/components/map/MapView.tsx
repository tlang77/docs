'use client'

import { useEffect, useRef, useState } from 'react'
import { centsToUSD } from '@/lib/formatters'
import Link from 'next/link'

interface MapProperty {
  id: string
  lat: number
  lng: number
  listPrice: number
  bedrooms: number
  bathrooms: number
  streetAddress: string
  city: string
  photo?: string
}

interface MapViewProps {
  properties: MapProperty[]
}

export function MapView({ properties }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let map: any
    let mapboxgl: any

    async function initMap() {
      const module = await import('mapbox-gl')
      mapboxgl = module.default
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-106.5, 39.5],
        zoom: 7,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.on('load', () => setMapLoaded(true))
    }

    initMap()

    return () => {
      markersRef.current.forEach((m) => m.remove())
      map?.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    let mapboxgl: any
    import('mapbox-gl').then((module) => {
      mapboxgl = module.default

      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      properties.forEach((prop) => {
        const el = document.createElement('div')
        el.className = `price-marker ${selectedId === prop.id ? 'selected' : ''}`
        el.innerHTML = `<span>${centsToUSD(prop.listPrice).replace('$', '$').split(',')[0]}${prop.listPrice >= 100000000 ? 'M+' : 'K+'}</span>`
        el.style.cssText = `
          background: ${selectedId === prop.id ? '#065f46' : '#047857'};
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid ${selectedId === prop.id ? '#d1fae5' : 'transparent'};
          transition: all 0.15s;
        `
        el.innerHTML = centsToUSD(prop.listPrice)

        el.addEventListener('click', () => setSelectedId(prop.id))

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([prop.lng, prop.lat])
          .addTo(mapRef.current)

        markersRef.current.push(marker)
      })

      if (properties.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        properties.forEach((p) => bounds.extend([p.lng, p.lat]))
        mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 13 })
      }
    })
  }, [properties, mapLoaded, selectedId])

  const selected = properties.find((p) => p.id === selectedId)

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 flex gap-3 items-center">
          {selected.photo && (
            <img src={selected.photo} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-900 text-sm">{centsToUSD(selected.listPrice)}</p>
            <p className="text-xs text-stone-500 truncate">{selected.streetAddress}, {selected.city}</p>
            <p className="text-xs text-stone-400">{selected.bedrooms} bd · {selected.bathrooms} ba</p>
          </div>
          <Link href={`/listings/${selected.id}`} className="shrink-0 bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition">
            View
          </Link>
          <button onClick={() => setSelectedId(null)} className="text-stone-400 hover:text-stone-600 text-lg leading-none">×</button>
        </div>
      )}
    </div>
  )
}
