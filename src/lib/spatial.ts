import { prisma } from './prisma'
import type { PropertyStatus, PropertyType } from '@/generated/prisma'

interface SpatialFilter {
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  type?: PropertyType[]
  status?: PropertyStatus
}

interface BboxFilter extends SpatialFilter {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

interface PolygonFilter extends SpatialFilter {
  polygon: number[][][]
}

interface RadiusFilter extends SpatialFilter {
  lat: number
  lng: number
  radiusMiles: number
}

function buildWhereClause(filter: SpatialFilter): string {
  const clauses: string[] = []
  if (filter.minPrice) clauses.push(`p."listPrice" >= ${filter.minPrice}`)
  if (filter.maxPrice) clauses.push(`p."listPrice" <= ${filter.maxPrice}`)
  if (filter.bedrooms) clauses.push(`p.bedrooms >= ${filter.bedrooms}`)
  if (filter.bathrooms) clauses.push(`p.bathrooms >= ${filter.bathrooms}`)
  if (filter.type?.length) {
    const types = filter.type.map((t) => `'${t}'`).join(', ')
    clauses.push(`p."propertyType"::"PropertyType" IN (${types})`)
  }
  const status = filter.status ?? 'ACTIVE'
  clauses.push(`p.status = '${status}'::"PropertyStatus"`)
  return clauses.length ? 'AND ' + clauses.join(' AND ') : ''
}

export async function searchByBbox(filter: BboxFilter) {
  const where = buildWhereClause(filter)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await prisma.$queryRawUnsafe<{ id: string }[]>(`
    SELECT p.id FROM "Property" p
    WHERE ST_Within(
      p.location,
      ST_MakeEnvelope(${filter.minLng}, ${filter.minLat}, ${filter.maxLng}, ${filter.maxLat}, 4326)
    ) ${where}
  `)
  return result.map((r) => r.id)
}

export async function searchByPolygon(filter: PolygonFilter) {
  const geoJson = JSON.stringify({ type: 'Polygon', coordinates: filter.polygon })
  const where = buildWhereClause(filter)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await prisma.$queryRawUnsafe<{ id: string }[]>(`
    SELECT p.id FROM "Property" p
    WHERE ST_Within(
      p.location,
      ST_GeomFromGeoJSON('${geoJson}')
    ) ${where}
  `)
  return result.map((r) => r.id)
}

export async function searchByRadius(filter: RadiusFilter) {
  const radiusMeters = filter.radiusMiles * 1609.34
  const where = buildWhereClause(filter)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await prisma.$queryRawUnsafe<{ id: string }[]>(`
    SELECT p.id FROM "Property" p
    WHERE ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(${filter.lng}, ${filter.lat}), 4326),
      ${radiusMeters}
    ) ${where}
  `)
  return result.map((r) => r.id)
}
