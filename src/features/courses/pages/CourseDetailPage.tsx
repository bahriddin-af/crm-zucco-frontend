import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { BackLink } from '@/components/ui/BackLink'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DetailPageSkeleton } from '@/components/ui/DetailPageSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { interpolate, useTranslation } from '@/i18n'
import { useCourseDetail, useDeleteCourse, useSubjectsList } from '../hooks/useCourses'
import { CourseDetailHeader } from '../components/detail/CourseDetailHeader'
import { CourseGroupsList } from '../components/detail/CourseGroupsList'
import { CourseModal } from '../components/CourseModal'

type DetailDialog = 'edit' | 'delete' | null

export function CourseDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: course, isLoading, error, refetch } = useCourseDetail(id)
  const { data: subjects = [] } = useSubjectsList()
  const deleteMutation = useDeleteCourse()
  const [dialog, setDialog] = useState<DetailDialog>(null)
  const backLink = <BackLink to={ROUTES.COURSES.LIST} label={t.courses.detail.backToList} />

  if (isLoading) return <DetailPageSkeleton />
  if (error || !course) {
    return (
      <div className="space-y-4">
        {backLink}
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  const confirmDelete = () =>
    deleteMutation.mutate(course.id, { onSuccess: () => navigate(ROUTES.COURSES.LIST, { replace: true }) })

  return (
    <div className="space-y-5">
      {backLink}
      <CourseDetailHeader course={course} onEdit={() => setDialog('edit')} onDelete={() => setDialog('delete')} />
      <ErrorBoundary>
        <CourseGroupsList courseId={course.id} />
      </ErrorBoundary>

      <CourseModal isOpen={dialog === 'edit'} onClose={() => setDialog(null)} subjects={subjects} courseToEdit={course} />
      <ConfirmDialog
        isOpen={dialog === 'delete'}
        onClose={() => setDialog(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title={t.courses.deleteTitle}
        description={interpolate(t.courses.deleteDescription, { name: course.name })}
      />
    </div>
  )
}
