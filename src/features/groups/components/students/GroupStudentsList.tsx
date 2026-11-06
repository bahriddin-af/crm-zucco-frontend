import { UserX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useTranslation } from '@/i18n'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import type { GroupStudentStatus } from '../../types/groupTypes'
import { GroupStudentRow, type GroupStudentRowStudent } from './GroupStudentRow'

const SKELETON_ROWS = 4

export interface PendingStudentStatus {
  student: GroupStudentRowStudent
  status: GroupStudentStatus
}

interface GroupStudentsListProps {
  groupId: string
  onChangeStatus: (change: PendingStudentStatus) => void
}

/** Guruh talabalari ro'yxati holatlari (yuklanish → xato → bo'sh → ro'yxat). Modal va sahifada ishlatiladi. */
export function GroupStudentsList({ groupId, onChangeStatus }: GroupStudentsListProps) {
  const { t } = useTranslation()
  const studentsQuery = useStudentsList({ groupId })
  const students = studentsQuery.data?.items ?? []

  if (studentsQuery.isLoading) return <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-10 w-full" />
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
        <GroupStudentRow
          key={student.id}
          student={student}
          onChangeStatus={(status) => onChangeStatus({ student, status })}
        />
      ))}
    </ul>
  )
}
