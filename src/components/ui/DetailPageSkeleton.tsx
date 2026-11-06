import { Skeleton } from '@/components/ui/Skeleton'

/** Tafsilot sahifalari yuklanayotganda ko'rsatiladigan karkas. */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
