import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PageHeader } from '@/components/ui/PageHeader'
import { COURSES_PAGE_SIZE, type CourseListItem } from '../types/courseTypes'
import { useCoursesList, useDeleteCourse, useSubjectsList } from '../hooks/useCourses'
import { CourseModal } from '../components/CourseModal'
import { CoursesGrid } from '../components/CoursesGrid'
import { CoursesToolbar, type CoursesToolbarValue } from '../components/CoursesToolbar'
import { SubjectsPanel } from '../components/SubjectsPanel'

type DialogState = { type: 'form'; course: CourseListItem | null } | { type: 'delete'; course: CourseListItem } | null

const INITIAL_FILTERS: CoursesToolbarValue = { search: '', subjectId: '' }

export function CourseListPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<CoursesToolbarValue>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<DialogState>(null)
  const search = useDebouncedValue(filters.search.trim())

  const coursesQuery = useCoursesList({
    page,
    pageSize: COURSES_PAGE_SIZE,
    search: search || undefined,
    subjectId: filters.subjectId || undefined,
    status: filters.status,
  })
  const { data: subjects = [] } = useSubjectsList()
  const deleteMutation = useDeleteCourse()

  const hasFilters = Boolean(search || filters.subjectId || filters.status)
  const closeDialog = () => setDialog(null)
  const openCreate = () => setDialog({ type: 'form', course: null })

  const handleFiltersChange = (next: CoursesToolbarValue) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.courses.title}
        subtitle={t.courses.subtitle}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void coursesQuery.refetch()}
              title={t.courses.refresh}
              aria-label={t.courses.refresh}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <PermissionGuard permission={PERMISSIONS.COURSES.CREATE}>
              <Button variant="primary" size="sm" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.courses.create}</span>
              </Button>
            </PermissionGuard>
          </>
        }
      />

      <ErrorBoundary>
        <SubjectsPanel />
      </ErrorBoundary>

      <CoursesToolbar value={filters} subjects={subjects} onChange={handleFiltersChange} />

      <ErrorBoundary>
        <CoursesGrid
          data={coursesQuery.data}
          isLoading={coursesQuery.isLoading}
          error={coursesQuery.isError ? coursesQuery.error : null}
          onRetry={() => void coursesQuery.refetch()}
          hasFilters={hasFilters}
          onCreate={openCreate}
          onEdit={(course) => setDialog({ type: 'form', course })}
          onDelete={(course) => setDialog({ type: 'delete', course })}
          onPageChange={setPage}
        />
      </ErrorBoundary>

      <CourseModal
        isOpen={dialog?.type === 'form'}
        onClose={closeDialog}
        subjects={subjects}
        courseToEdit={dialog?.type === 'form' ? dialog.course : null}
      />

      <ConfirmDialog
        isOpen={dialog?.type === 'delete'}
        onClose={closeDialog}
        onConfirm={() => dialog?.type === 'delete' && deleteMutation.mutate(dialog.course.id, { onSuccess: closeDialog })}
        isLoading={deleteMutation.isPending}
        title={t.courses.deleteTitle}
        description={interpolate(t.courses.deleteDescription, { name: dialog?.course?.name ?? '' })}
      />
    </div>
  )
}
