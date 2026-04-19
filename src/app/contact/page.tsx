'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Contact Us</h1>
      <p className="text-stone-500 mb-12">Reach out to our team directly. No bots, no form-to-CRM-to-eventual-maybe-callback.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 rounded-xl p-3 shrink-0"><Phone className="w-5 h-5 text-emerald-700" /></div>
            <div>
              <p className="font-semibold text-stone-900">Phone</p>
              <a href="tel:+19705550100" className="text-stone-600 hover:text-emerald-700">(970) 555-0100</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 rounded-xl p-3 shrink-0"><Mail className="w-5 h-5 text-emerald-700" /></div>
            <div>
              <p className="font-semibold text-stone-900">Email</p>
              <a href="mailto:info@mountainretreatrealty.com" className="text-stone-600 hover:text-emerald-700">info@mountainretreatrealty.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 rounded-xl p-3 shrink-0"><MapPin className="w-5 h-5 text-emerald-700" /></div>
            <div>
              <p className="font-semibold text-stone-900">Office</p>
              <p className="text-stone-600">123 Main St, Aspen, CO 81611</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">✓</p>
            <p className="font-semibold text-stone-900">Message received!</p>
            <p className="text-stone-500 text-sm mt-2">One of our agents will reach out within 1 business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input required type="email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
              <textarea required rows={4} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
