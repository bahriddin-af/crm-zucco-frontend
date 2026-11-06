import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { BackLink } from '@/components/ui/BackLink'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DetailPageSkeleton } from '@/components/ui/DetailPageSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { SectionCard } from '@/components/ui/SectionCard'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import type { LessonItem } from '../types/groupTypes'
import { useDeleteGroup, useGroupDetail } from '../hooks/useGroups'
import { GroupDetailHeader } from '../components/detail/GroupDetailHeader'
import { GroupModal } from '../components/GroupModal'
import { GroupStudentsList, type PendingStudentStatus } from '../components/students/GroupStudentsList'
import { StudentStatusConfirmDialog } from '../components/students/StudentStatusConfirmDialog'
import { GroupLessonsList } from '../components/lessons/GroupLessonsList'
import { GenerateScheduleForm } from '../components/lessons/GenerateScheduleForm'
import { CancelLessonDialog } from '../components/lessons/CancelLessonDialog'

type DetailDialog = 'edit' | 'delete' | null

export function GroupDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data: group, isLoading, error, refetch } = useGroupDetail(id)
  const deleteMutation = useDeleteGroup()
  const [dialog, setDialog] = useState<DetailDialog>(null)
  const [pendingStatus, setPendingStatus] = useState<PendingStudentStatus | null>(null)
  const [cancelTarget, setCancelTarget] = useState<LessonItem | null>(null)
  const backLink = <BackLink to={ROUTES.GROUPS.LIST} label={t.groups.detail.backToList} />

  if (isLoading) return <DetailPageSkeleton />
  if (error || !group) {
    return (
      <div className="space-y-4">
        {backLink}
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  const confirmDelete = () =>
    deleteMutation.mutate(group.id, { onSuccess: () => navigate(ROUTES.GROUPS.LIST, { replace: true }) })

  return (
    <div className="space-y-5">
      {backLink}
      <GroupDetailHeader group={group} onEdit={() => setDialog('edit')} onDelete={() => setDialog('delete')} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ErrorBoundary>
          <SectionCard title={t.groups.students}>
            <GroupStudentsList groupId={group.id} onChangeStatus={setPendingStatus} />
          </SectionCard>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionCard title={t.groups.lessons}>
            <div className="space-y-4">
              <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
                <GenerateScheduleForm groupId={group.id} />
              </PermissionGuard>
              <GroupLessonsList groupId={group.id} onCancel={setCancelTarget} />
            </div>
          </SectionCard>
        </ErrorBoundary>
      </div>

      <GroupModal isOpen={dialog === 'edit'} onClose={() => setDialog(null)} groupToEdit={group} />
      <ConfirmDialog
        isOpen={dialog === 'delete'}
        onClose={() => setDialog(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title={t.groups.deleteTitle}
        description={interpolate(t.groups.deleteDescription, { name: group.name })}
      />
      <StudentStatusConfirmDialog groupId={group.id} pending={pendingStatus} onClose={() => setPendingStatus(null)} />
      {cancelTarget && <CancelLessonDialog lesson={cancelTarget} onClose={() => setCancelTarget(null)} />}
    </div>
  )
}
