import { centsToUSD } from '@/lib/formatters'

export function PriceTag({ cents, className }: { cents: number; className?: string }) {
  return <span className={className}>{centsToUSD(cents)}</span>
}
