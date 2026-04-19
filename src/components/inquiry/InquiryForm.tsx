'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquiryCreateSchema, type InquiryCreateInput } from '@/lib/validations/inquiry'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

interface InquiryFormProps {
  propertyId: string
  agentId: string
  propertyAddress: string
}

export function InquiryForm({ propertyId, propertyAddress }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InquiryCreateInput>({
    resolver: zodResolver(inquiryCreateSchema),
    defaultValues: {
      propertyId,
      message: `I'm interested in ${propertyAddress}. Please contact me to arrange a showing.`,
    },
  })

  async function onSubmit(data: InquiryCreateInput) {
    setServerError('')
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      setServerError('Something went wrong. Please try again.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-4 gap-3">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
        <p className="font-semibold text-stone-900">Request sent!</p>
        <p className="text-sm text-stone-500">Your agent will be in touch shortly. No middlemen — direct to Mountain Retreat Realty.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register('propertyId')} />

      <div>
        <input
          {...register('contactName')}
          placeholder="Your name"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
      </div>

      <div>
        <input
          {...register('contactEmail')}
          type="email"
          placeholder="Email address"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
      </div>

      <div>
        <input
          {...register('contactPhone')}
          type="tel"
          placeholder="Phone (optional)"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <textarea
          {...register('message')}
          rows={3}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? 'Sending…' : 'Request a showing'}
      </Button>
      <p className="text-xs text-stone-400 text-center">Your info goes directly to our agents — never sold to third parties.</p>
    </form>
  )
}
