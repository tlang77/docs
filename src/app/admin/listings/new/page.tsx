import { ListingForm } from '@/components/admin/ListingForm'

export const metadata = { title: 'Add Listing' }

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Add New Listing</h1>
      <ListingForm />
    </div>
  )
}
