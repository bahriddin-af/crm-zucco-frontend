import { useTranslation } from '@/i18n'
import type { StudentAttendanceSheetItem } from '../types/attendanceTypes'
import { AttendanceStudentRow, type StudentMarkChange } from './AttendanceStudentRow'

interface AttendanceTableProps {
  students: StudentAttendanceSheetItem[]
  canGrade: boolean
  disabled: boolean
  onMark: (student: StudentAttendanceSheetItem, change: StudentMarkChange) => void
}

export function AttendanceTable({ students, canGrade, disabled, onMark }: AttendanceTableProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-2xs font-semibold text-caption uppercase">
            <th scope="col" className="py-3 px-4">
              {t.attendance.student}
            </th>
            <th scope="col" className="py-3 px-4">
              {t.attendance.status}
            </th>
            <th scope="col" className="py-3 px-4">
              {t.attendance.score}
            </th>
            <th scope="col" className="py-3 px-4">
              {t.attendance.homework}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider text-xs">
          {students.map((student) => (
            <AttendanceStudentRow
              key={student.studentId}
              student={student}
              canGrade={canGrade}
              disabled={disabled}
              onMark={onMark}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
