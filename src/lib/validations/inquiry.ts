import { z } from 'zod'

export const inquiryCreateSchema = z.object({
  propertyId: z.string().min(1),
  contactName: z.string().min(1, 'Name is required'),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().optional(),
  message: z.string().min(10, 'Please write at least 10 characters'),
  preferredContactMethod: z.enum(['email', 'phone', 'either']).optional(),
  preferredContactTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
})

export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>
