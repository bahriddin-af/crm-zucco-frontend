import { useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { SelectInput } from '@/components/forms/SelectInput'
import {
  HOMEWORK_STATUS_VALUES,
  type AttendanceStatus,
  type HomeworkStatus,
  type StudentAttendanceSheetItem,
} from '../types/attendanceTypes'
import { AttendanceStatusButtons } from './AttendanceStatusButtons'
import { ScoreInput } from './ScoreInput'

export interface StudentMarkChange {
  status?: AttendanceStatus
  score?: number | null
  homeworkStatus?: HomeworkStatus
}

interface AttendanceStudentRowProps {
  student: StudentAttendanceSheetItem
  canGrade: boolean
  disabled: boolean
  onMark: (student: StudentAttendanceSheetItem, change: StudentMarkChange) => void
}

const EMPTY_VALUE = '—'

const isHomeworkStatus = (value: number): value is HomeworkStatus =>
  (HOMEWORK_STATUS_VALUES as readonly number[]).includes(value)

export function AttendanceStudentRow({ student, canGrade, disabled, onMark }: AttendanceStudentRowProps) {
  const { t } = useTranslation()

  const handleHomework = (raw: string) => {
    const homeworkStatus = Number(raw)
    if (isHomeworkStatus(homeworkStatus)) onMark(student, { homeworkStatus })
  }

  return (
    <tr className="hover:bg-surface-muted align-top">
      <td className="py-3 px-4">
        <p className="font-bold text-heading">{student.studentName}</p>
        <p className="text-[11px] text-caption tabular-nums">{formatPhone(student.phone)}</p>
      </td>
      <td className="py-3 px-4">
        <AttendanceStatusButtons
          value={student.status}
          disabled={disabled}
          onSelect={(status) => onMark(student, { status })}
        />
      </td>
      <td className="py-3 px-4">
        {canGrade ? (
          <ScoreInput
            value={student.score}
            disabled={disabled}
            label={`${t.attendance.score}: ${student.studentName}`}
            onCommit={(score) => onMark(student, { score })}
          />
        ) : (
          <span className="font-bold text-heading tabular-nums">{student.score ?? EMPTY_VALUE}</span>
        )}
      </td>
      <td className="py-3 px-4">
        <SelectInput
          aria-label={`${t.attendance.homework}: ${student.studentName}`}
          className="w-36"
          value={student.homeworkStatus ?? ''}
          disabled={disabled}
          onChange={(event) => handleHomework(event.target.value)}
        >
          <option value="" disabled>
            {EMPTY_VALUE}
          </option>
          {HOMEWORK_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {t.attendance.homeworkStatuses[status]}
            </option>
          ))}
        </SelectInput>
      </td>
    </tr>
  )
}
