import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { STUDENT_STATUS, type StudentStatus } from '../types/studentTypes'

const STATUS_VARIANTS: Record<StudentStatus, BadgeProps['variant']> = {
  [STUDENT_STATUS.Active]: 'success',
  [STUDENT_STATUS.Trial]: 'accent',
  [STUDENT_STATUS.Frozen]: 'warning',
  [STUDENT_STATUS.Debtor]: 'danger',
  [STUDENT_STATUS.Completed]: 'default',
  [STUDENT_STATUS.Dropped]: 'default',
}

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const { t } = useTranslation()
  return <Badge variant={STATUS_VARIANTS[status] ?? 'default'}>{t.students.statuses[status]}</Badge>
}
