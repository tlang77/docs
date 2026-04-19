import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ListChecks, MessageSquare, Plus } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user.role !== 'AGENT' && session.user.role !== 'ADMIN')) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="hidden lg:block w-60 border-r border-stone-200 bg-white px-4 py-6">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Agent Dashboard</p>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-700 transition">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/admin/listings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-700 transition">
            <ListChecks className="w-4 h-4" /> My Listings
          </Link>
          <Link href="/admin/listings/new" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-700 transition">
            <Plus className="w-4 h-4" /> Add Listing
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-700 transition">
            <MessageSquare className="w-4 h-4" /> Inquiries
          </Link>
        </nav>
      </aside>
      <div className="flex-1 px-4 sm:px-8 py-6">{children}</div>
    </div>
  )
}
