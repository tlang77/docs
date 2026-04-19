import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ListingForm } from '@/components/admin/ListingForm'

export const metadata = { title: 'Edit Listing' }

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({ where: { id: params.id } })
  if (!property) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit Listing</h1>
      <ListingForm
        initialValues={{
          id: property.id,
          streetAddress: property.streetAddress,
          unit: property.unit ?? undefined,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          county: property.county ?? undefined,
          latitude: property.latitude,
          longitude: property.longitude,
          neighborhood: property.neighborhood ?? undefined,
          propertyType: property.propertyType,
          listPrice: property.listPrice,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.squareFeet ?? undefined,
          lotSizeSqFt: property.lotSizeSqFt ?? undefined,
          yearBuilt: property.yearBuilt ?? undefined,
          garageSpaces: property.garageSpaces ?? undefined,
          hasPool: property.hasPool,
          description: property.description ?? undefined,
          virtualTourUrl: property.virtualTourUrl ?? undefined,
        }}
      />
    </div>
  )
}
