import type { Property, PropertyPhoto, PriceHistory, Agent, User, OpenHouse } from '@/generated/prisma'

export type PropertySearchResult = Property & {
  photos: PropertyPhoto[]
  _count?: { favorites: number }
}

export type PropertyWithDetails = Property & {
  photos: PropertyPhoto[]
  priceHistory: PriceHistory[]
  openHouses: OpenHouse[]
  agent: Agent & { user: Pick<User, 'name' | 'email' | 'image'> }
  _count: { favorites: number }
}
