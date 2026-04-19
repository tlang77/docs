'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { formatDate } from '@/lib/formatters'

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const STATUS_TABS = ['ALL', 'NEW', 'CONTACTED', 'CLOSED'] as const

export default function AdminInquiriesPage() {
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>('ALL')
  const url = tab === 'ALL' ? '/api/admin/inquiries' : `/api/admin/inquiries?status=${tab}`
  const { data, mutate } = useSWR<any[]>(url, fetcher)

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    mutate()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Inquiries</h1>

      <div className="flex gap-1 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Property</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-stone-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {(data ?? []).map((inq: any) => (
              <tr key={inq.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{inq.contactName}</p>
                  <a href={`mailto:${inq.contactEmail}`} className="text-emerald-700 hover:underline text-xs">{inq.contactEmail}</a>
                  {inq.contactPhone && <p className="text-stone-400 text-xs">{inq.contactPhone}</p>}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {inq.property?.streetAddress ?? '—'}
                </td>
                <td className="px-4 py-3 text-stone-400">{formatDate(inq.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="text-sm border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-400">No inquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
