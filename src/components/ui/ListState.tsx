import type { ReactNode } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'
import { ListSkeleton } from '@/components/ui/ListSkeleton'

const DEFAULT_SKELETON_ROWS = 5

interface ListStateProps {
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  isEmpty: boolean
  empty: ReactNode
  skeletonRows?: number
  children: ReactNode
}

/** Ro'yxatlar uchun yagona holatlar: Skeleton → ErrorState → EmptyState → ma'lumot. */
export function ListState({
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  empty,
  skeletonRows = DEFAULT_SKELETON_ROWS,
  children,
}: ListStateProps) {
  if (isLoading) return <ListSkeleton rows={skeletonRows} rowClassName="h-10" />
  if (isError) return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return <>{empty}</>
  return <>{children}</>
}
