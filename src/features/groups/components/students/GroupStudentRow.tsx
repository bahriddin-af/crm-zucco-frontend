import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { SelectInput } from '@/components/forms/SelectInput'
import { GROUP_STUDENT_STATUS_VALUES, type GroupStudentStatus } from '../../types/groupTypes'

export interface GroupStudentRowStudent {
  id: string
  fullName: string
  phone: string
}

interface GroupStudentRowProps {
  student: GroupStudentRowStudent
  onChangeStatus: (status: GroupStudentStatus) => void
}

const isGroupStudentStatus = (value: number): value is GroupStudentStatus =>
  (GROUP_STUDENT_STATUS_VALUES as readonly number[]).includes(value)

export function GroupStudentRow({ student, onChangeStatus }: GroupStudentRowProps) {
  const { t } = useTranslation()

  const handleChange = (raw: string) => {
    const status = Number(raw)
    if (isGroupStudentStatus(status)) onChangeStatus(status)
  }

  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-heading truncate">{student.fullName}</p>
        <p className="text-2xs text-caption tabular-nums">{formatPhone(student.phone)}</p>
      </div>
      <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
        <SelectInput
          aria-label={t.groups.changeStatusTitle}
          className="w-44 shrink-0"
          value=""
          onChange={(event) => handleChange(event.target.value)}
        >
          <option value="">{t.groups.changeStatusTitle}</option>
          {GROUP_STUDENT_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {t.groups.studentStatus[status]}
            </option>
          ))}
        </SelectInput>
      </PermissionGuard>
    </li>
  )
}
