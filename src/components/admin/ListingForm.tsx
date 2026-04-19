'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertyCreateSchema, type PropertyCreateInput } from '@/lib/validations/property'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ListingFormProps {
  initialValues?: Partial<PropertyCreateInput> & { id?: string }
}

const PROPERTY_TYPES = [
  { value: 'SINGLE_FAMILY', label: 'Single Family' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'MULTI_FAMILY', label: 'Multi-Family' },
  { value: 'LAND', label: 'Land' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

export function ListingForm({ initialValues }: ListingFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const isEdit = !!initialValues?.id

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(data: PropertyCreateInput) {
    setError('')
    const res = await fetch(isEdit ? `/api/properties/${initialValues!.id}` : '/api/properties', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      setError('Failed to save listing. Check all fields.')
      return
    }
    const property = await res.json()
    router.push(`/admin/listings`)
    router.refresh()
  }

  const field = (label: string, name: keyof PropertyCreateInput, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        {...register(name, { valueAsNumber: type === 'number' })}
        type={type}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{(errors[name] as any)?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-stone-900">Address</h2>
        <div className="grid grid-cols-2 gap-4">
          {field('Street address', 'streetAddress')}
          {field('Unit (optional)', 'unit')}
          {field('City', 'city')}
          {field('State (2-letter)', 'state', 'text', 'CO')}
          {field('ZIP code', 'zipCode')}
          {field('County (optional)', 'county')}
          {field('Neighborhood (optional)', 'neighborhood')}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {field('Latitude', 'latitude', 'number')}
          {field('Longitude', 'longitude', 'number')}
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-stone-900">Property Details</h2>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Property type</label>
          <select {...register('propertyType')} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {field('List price (cents)', 'listPrice', 'number', '125000000')}
          {field('Bedrooms', 'bedrooms', 'number')}
          {field('Bathrooms', 'bathrooms', 'number', '2.5')}
          {field('Square feet', 'squareFeet', 'number')}
          {field('Lot size (sqft)', 'lotSizeSqFt', 'number')}
          {field('Year built', 'yearBuilt', 'number')}
          {field('Garage spaces', 'garageSpaces', 'number')}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="hasPool" {...register('hasPool')} className="rounded" />
          <label htmlFor="hasPool" className="text-sm text-stone-700">Has pool</label>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-stone-900">Description</h2>
        <div>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe the property…"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>
        {field('Virtual tour URL (optional)', 'virtualTourUrl', 'url')}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
