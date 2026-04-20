import { z } from 'zod'

export const searchParamsSchema = z.object({
  city: z.string().optional(),
  zip: z.string().optional(),
  q: z.string().optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  beds: z.coerce.number().int().min(0).optional(),
  baths: z.coerce.number().min(0).optional(),
  type: z.union([z.string(), z.array(z.string())]).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'sqft_desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(24),
  bbox: z.string().optional(),
  polygon: z.string().optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET']).optional(),
})

export type SearchParams = z.infer<typeof searchParamsSchema>
