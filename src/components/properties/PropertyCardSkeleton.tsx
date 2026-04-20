export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-stone-200 rounded w-1/2" />
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="flex gap-3">
          <div className="h-4 bg-stone-100 rounded w-12" />
          <div className="h-4 bg-stone-100 rounded w-12" />
          <div className="h-4 bg-stone-100 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
