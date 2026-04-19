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
  enableDraw?: boolean
  onPolygonChange?: (coordinates: number[][][] | null) => void
}

export function MapView({ properties, enableDraw, onPolygonChange }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const drawRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const onPolygonChangeRef = useRef(onPolygonChange)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [polygonActive, setPolygonActive] = useState(false)

  onPolygonChangeRef.current = onPolygonChange

  useEffect(() => {
    if (!containerRef.current) return

    let map: any

    async function initMap() {
      const [mapboxModule, drawModule] = await Promise.all([
        import('mapbox-gl'),
        enableDraw ? import('@mapbox/mapbox-gl-draw') : Promise.resolve(null),
      ])

      const mapboxgl = mapboxModule.default
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-106.5, 39.5],
        zoom: 7,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      if (enableDraw && drawModule) {
        const MapboxDraw = drawModule.default
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: { polygon: true, trash: true },
          defaultMode: 'simple_select',
        })
        map.addControl(draw, 'top-left')
        drawRef.current = draw

        const handleDrawChange = () => {
          const data = draw.getAll()
          const polygon = data.features.find((f: any) => f.geometry.type === 'Polygon')
          if (polygon) {
            setPolygonActive(true)
            onPolygonChangeRef.current?.((polygon.geometry as any).coordinates as number[][][])
          } else {
            setPolygonActive(false)
            onPolygonChangeRef.current?.(null)
          }
        }

        map.on('draw.create', handleDrawChange)
        map.on('draw.update', handleDrawChange)
        map.on('draw.delete', () => {
          setPolygonActive(false)
          onPolygonChangeRef.current?.(null)
        })
      }

      map.on('load', () => setMapLoaded(true))
    }

    initMap()

    return () => {
      markersRef.current.forEach((m) => m.remove())
      map?.remove()
    }
  }, [enableDraw])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    import('mapbox-gl').then((module) => {
      const mapboxgl = module.default

      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      properties.forEach((prop) => {
        const el = document.createElement('div')
        const isSelected = selectedId === prop.id
        el.style.cssText = `
          background: ${isSelected ? '#065f46' : '#047857'};
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid ${isSelected ? '#d1fae5' : 'transparent'};
          transition: all 0.15s;
        `
        el.textContent = centsToUSD(prop.listPrice)
        el.addEventListener('click', () => setSelectedId(prop.id))

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([prop.lng, prop.lat])
          .addTo(mapRef.current)

        markersRef.current.push(marker)
      })

      if (properties.length > 0 && !polygonActive) {
        const bounds = new mapboxgl.LngLatBounds()
        properties.forEach((p) => bounds.extend([p.lng, p.lat]))
        mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 13 })
      }
    })
  }, [properties, mapLoaded, selectedId, polygonActive])

  const selected = properties.find((p) => p.id === selectedId)

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {enableDraw && polygonActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow pointer-events-none">
          Showing homes inside drawn area
        </div>
      )}

      {selected && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 bg-white rounded-xl shadow-lg p-3">
          <div className="flex gap-3 items-center">
            {selected.photo && (
              <img src={selected.photo} alt="" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900 text-sm">{centsToUSD(selected.listPrice)}</p>
              <p className="text-xs text-stone-500 truncate">{selected.streetAddress}, {selected.city}</p>
              <p className="text-xs text-stone-400">{selected.bedrooms} bd · {selected.bathrooms} ba</p>
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <button onClick={() => setSelectedId(null)} className="text-stone-400 hover:text-stone-600 text-lg leading-none">×</button>
              <Link href={`/listings/${selected.id}`} className="bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition whitespace-nowrap">
                View
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
