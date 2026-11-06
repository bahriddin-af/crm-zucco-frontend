import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { interpolate, useTranslation } from '@/i18n'
import { useChangeStudentGroupStatus } from '../../hooks/useGroupStudents'
import type { PendingStudentStatus } from './GroupStudentsList'

interface StudentStatusConfirmDialogProps {
  groupId: string
  pending: PendingStudentStatus | null
  onClose: () => void
}

/** Guruhdagi talaba holatini o'zgartirishdan oldin majburiy tasdiq. */
export function StudentStatusConfirmDialog({ groupId, pending, onClose }: StudentStatusConfirmDialogProps) {
  const { t } = useTranslation()
  const changeMutation = useChangeStudentGroupStatus()

  const handleConfirm = () => {
    if (!pending) return
    changeMutation.mutate(
      { groupId, studentId: pending.student.id, status: pending.status },
      { onSuccess: onClose }
    )
  }

  return (
    <ConfirmDialog
      isOpen={pending !== null}
      variant="primary"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={changeMutation.isPending}
      title={t.groups.changeStatusTitle}
      description={
        pending
          ? interpolate(t.groups.changeStatusConfirm, {
              name: pending.student.fullName,
              status: t.groups.studentStatus[pending.status],
            })
          : undefined
      }
    />
  )
}
