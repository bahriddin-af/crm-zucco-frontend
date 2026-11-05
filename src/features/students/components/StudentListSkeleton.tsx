import { Skeleton } from '@/components/ui/Skeleton'

const SKELETON_ROWS = 5

export function StudentListSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b border-divider last:border-none">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}
