import { useState } from 'react'
import { UserX } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { interpolate, useTranslation } from '@/i18n'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import type { GroupListItem, GroupStudentStatus } from '../../types/groupTypes'
import { useChangeStudentGroupStatus } from '../../hooks/useGroupStudents'
import { GroupStudentRow, type GroupStudentRowStudent } from './GroupStudentRow'

const SKELETON_ROWS = 4

interface PendingChange {
  student: GroupStudentRowStudent
  status: GroupStudentStatus
}

interface GroupStudentsModalProps {
  group: GroupListItem
  onClose: () => void
}

export function GroupStudentsModal({ group, onClose }: GroupStudentsModalProps) {
  const { t } = useTranslation()
  const [pending, setPending] = useState<PendingChange | null>(null)
  const studentsQuery = useStudentsList({ groupId: group.id })
  const changeMutation = useChangeStudentGroupStatus()
  const students = studentsQuery.data?.items ?? []

  const handleConfirm = () => {
    if (!pending) return
    changeMutation.mutate(
      { groupId: group.id, studentId: pending.student.id, status: pending.status },
      { onSuccess: () => setPending(null) }
    )
  }

  const renderBody = () => {
    if (studentsQuery.isLoading) {
      return (
        <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-10 w-full" />
      )
    }
    if (studentsQuery.isError) {
      return <ErrorState error={studentsQuery.error} onRetry={() => void studentsQuery.refetch()} />
    }
    if (students.length === 0) {
      return (
        <EmptyState
          title={t.groups.studentsEmptyTitle}
          description={t.groups.studentsEmptyDescription}
          icon={<UserX className="w-5 h-5" />}
        />
      )
    }
    return (
      <ul className="divide-y divide-divider max-h-[55vh] overflow-y-auto pr-1">
        {students.map((student) => (
          <GroupStudentRow key={student.id} student={student} onChangeStatus={(status) => setPending({ student, status })} />
        ))}
      </ul>
    )
  }

  return (
    <>
      <Modal
        isOpen={pending === null}
        onClose={onClose}
        title={interpolate(t.groups.studentsTitle, { name: group.name })}
        maxWidth="lg"
      >
        {renderBody()}
      </Modal>
      <ConfirmDialog
        isOpen={pending !== null}
        variant="primary"
        onClose={() => setPending(null)}
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
    </>
  )
}
