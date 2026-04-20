import type { Agent, User, Property, PropertyPhoto } from '@/generated/prisma'

export type AgentWithUser = Agent & {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>
  _count: { listings: number }
}

export type AgentWithListings = Agent & {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>
  listings: (Property & { photos: PropertyPhoto[] })[]
}
