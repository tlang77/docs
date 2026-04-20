export function centsToUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatSqFt(sqft: number | null | undefined): string {
  if (!sqft) return 'N/A'
  return new Intl.NumberFormat('en-US').format(sqft) + ' sqft'
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatBaths(baths: number): string {
  return baths % 1 === 0 ? baths.toString() : baths.toFixed(1)
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SINGLE_FAMILY: 'Single Family',
    CONDO: 'Condo',
    TOWNHOUSE: 'Townhouse',
    MULTI_FAMILY: 'Multi-Family',
    LAND: 'Land',
    COMMERCIAL: 'Commercial',
  }
  return labels[type] ?? type
}

export function daysOnMarket(listedAt: Date | string): number {
  const ms = Date.now() - new Date(listedAt).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}
