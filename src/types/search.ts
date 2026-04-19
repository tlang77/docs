export interface SearchFilters {
  city?: string
  zip?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  type?: string[]
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sqft_desc'
  status?: 'ACTIVE' | 'PENDING' | 'SOLD' | 'OFF_MARKET'
  bbox?: string
  polygon?: string
}
