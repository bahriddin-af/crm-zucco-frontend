import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

const DEFAULT_ROWS = 5

interface ListSkeletonProps {
  rows?: number
  rowClassName?: string
  className?: string
}

/** Ro'yxat/jadval yuklanayotganda ko'rsatiladigan skeleton qatorlar. */
export function ListSkeleton({ rows = DEFAULT_ROWS, rowClassName = 'h-9', className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className={rowClassName} />
      ))}
    </div>
  )
}
