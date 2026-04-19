import { z } from 'zod'

export const propertyCreateSchema = z.object({
  streetAddress: z.string().min(1),
  unit: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().min(5),
  county: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  neighborhood: z.string().optional(),
  propertyType: z.enum(['SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE', 'MULTI_FAMILY', 'LAND', 'COMMERCIAL']),
  listPrice: z.number().int().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().int().positive().optional(),
  lotSizeSqFt: z.number().int().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  garageSpaces: z.number().int().min(0).optional(),
  hasPool: z.boolean().optional(),
  description: z.string().optional(),
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
})

export const propertyUpdateSchema = propertyCreateSchema.partial().extend({
  status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET']).optional(),
})

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>
