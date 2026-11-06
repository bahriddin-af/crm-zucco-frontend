import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { BackLink } from '@/components/ui/BackLink'
import { DetailPageSkeleton } from '@/components/ui/DetailPageSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { interpolate, useTranslation } from '@/i18n'
import { StudentProfileHeader } from '../components/StudentProfileHeader'
import { StudentGroupsCard } from '../components/StudentGroupsCard'
import { StudentParentsCard } from '../components/StudentParentsCard'
import { StudentModal } from '../components/StudentModal'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'
import { useDeleteStudent, useStudentDetail, useUnfreezeStudent } from '../hooks/useStudents'

type DetailDialog = 'edit' | 'enroll' | 'freeze' | 'delete' | null

export function StudentDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: student, isLoading, error, refetch } = useStudentDetail(id)
  const unfreezeMutation = useUnfreezeStudent()
  const deleteMutation = useDeleteStudent()
  const [dialog, setDialog] = useState<DetailDialog>(null)
  const closeDialog = () => setDialog(null)

  const backLink = <BackLink to={ROUTES.STUDENTS.LIST} label={t.students.detail.backToList} />

  if (isLoading) return <DetailPageSkeleton />

  if (error || !student) {
    return (
      <div className="space-y-4">
        {backLink}
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  const confirmDelete = () =>
    deleteMutation.mutate(student.id, { onSuccess: () => navigate(ROUTES.STUDENTS.LIST, { replace: true }) })

  return (
    <div className="space-y-5">
      {backLink}

      <StudentProfileHeader
        student={student}
        isUnfreezing={unfreezeMutation.isPending}
        onEdit={() => setDialog('edit')}
        onEnroll={() => setDialog('enroll')}
        onFreeze={() => setDialog('freeze')}
        onUnfreeze={() => unfreezeMutation.mutate(student.id)}
        onDelete={() => setDialog('delete')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <StudentGroupsCard groups={student.enrolledGroups} />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <StudentParentsCard student={student} />
        </ErrorBoundary>
      </div>

      {dialog === 'edit' && <StudentModal student={student} onClose={closeDialog} />}
      {dialog === 'enroll' && <StudentEnrollModal student={student} onClose={closeDialog} />}
      {dialog === 'freeze' && <StudentFreezeModal student={student} onClose={closeDialog} />}
      <ConfirmDialog
        isOpen={dialog === 'delete'}
        onClose={closeDialog}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        description={interpolate(t.students.deleteConfirm, { name: student.fullName })}
      />
    </div>
  )
}
