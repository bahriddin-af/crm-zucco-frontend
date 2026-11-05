import { useTranslation } from '@/i18n'
import type { StudentListItem } from '../types/studentTypes'
import { StudentTableRow, type StudentRowActions } from './StudentTableRow'

interface StudentsTableProps extends StudentRowActions {
  students: StudentListItem[]
}

export function StudentsTable({ students, ...actions }: StudentsTableProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-surface border border-border rounded-lg shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas border-b border-border text-2xs font-semibold text-caption uppercase tracking-wider">
              <th className="py-3 px-4">{t.students.table.student}</th>
              <th className="py-3 px-4">{t.students.table.group}</th>
              <th className="py-3 px-4">{t.students.table.balance}</th>
              <th className="py-3 px-4">{t.students.table.coins}</th>
              <th className="py-3 px-4">{t.students.table.status}</th>
              <th className="py-3 px-4 text-right">{t.students.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider text-xs">
            {students.map((student) => (
              <StudentTableRow key={student.id} student={student} {...actions} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
