'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { centsToUSD, formatDate } from '@/lib/formatters'
import type { PriceHistory } from '@/generated/prisma'

interface PriceHistoryChartProps {
  history: PriceHistory[]
}

export function PriceHistoryChart({ history }: PriceHistoryChartProps) {
  if (history.length === 0) return null

  const data = history.map((h) => ({
    date: formatDate(h.date),
    price: h.price / 100,
    event: h.event,
    rawPrice: h.price,
  }))

  return (
    <div>
      <h3 className="text-base font-semibold text-stone-900 mb-4">Price History</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#78716c' }}
              width={55}
            />
            <Tooltip
              formatter={(v: unknown) => [centsToUSD((v as number) * 100), 'Price']}
              labelStyle={{ fontSize: 12, color: '#292524' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 divide-y divide-stone-100">
        {[...history].reverse().map((h) => (
          <li key={h.id} className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-stone-600">{formatDate(h.date)}</span>
            <span className="text-stone-500 text-xs">{h.event}</span>
            <span className="font-medium text-stone-900">{centsToUSD(h.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
