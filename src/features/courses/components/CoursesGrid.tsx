import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import type { PagedResult } from '@/types/api'
import type { CourseListItem } from '../types/courseTypes'
import { CourseCard } from './CourseCard'

const SKELETON_CARDS = 4
const GRID_CLASS = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'

interface CoursesGridProps {
  data?: PagedResult<CourseListItem>
  isLoading: boolean
  error: unknown
  onRetry: () => void
  hasFilters: boolean
  onCreate: () => void
  onEdit: (course: CourseListItem) => void
  onDelete: (course: CourseListItem) => void
  onPageChange: (page: number) => void
}

export function CoursesGrid(props: CoursesGridProps) {
  const { data, isLoading, error, onRetry, hasFilters, onCreate, onEdit, onDelete, onPageChange } = props
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (error) return <ErrorState error={error} onRetry={onRetry} />

  const courses = data?.items ?? []
  if (courses.length === 0) {
    return (
      <EmptyState
        title={t.courses.emptyTitle}
        description={hasFilters ? t.courses.emptyFiltered : t.courses.emptyDescription}
        icon={<BookOpen className="w-5 h-5" />}
        action={
          hasFilters ? undefined : (
            <PermissionGuard permission={PERMISSIONS.COURSES.CREATE}>
              <Button variant="primary" size="sm" onClick={onCreate}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.courses.createFirst}</span>
              </Button>
            </PermissionGuard>
          )
        }
      />
    )
  }

  return (
    <div>
      <div className={GRID_CLASS}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={onPageChange} />
    </div>
  )
}
