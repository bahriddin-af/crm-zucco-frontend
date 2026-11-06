import { Skeleton } from '@/components/ui/Skeleton'

/** Sahifa (lazy chunk yoki tafsilot ma'lumoti) yuklanayotganda ko'rsatiladigan karkas. */
export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
