import { CalendarCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { SectionCard } from '@/components/ui/SectionCard'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate } from '@/utils/dateUtils'
import { cn } from '@/utils/cn'
import { useStudentAttendanceHistory } from '../hooks/useAttendance'
import { ATTENDANCE_STATUS_VARIANT } from '../utils/attendanceStatus'

/** Talaba profilidagi davomat tarixi (backend eng yangi darsdan boshlab qaytaradi). */
export function StudentAttendanceHistory({ studentId }: { studentId: string }) {
  const { t } = useTranslation()
  const text = t.attendance.history
  const historyQuery = useStudentAttendanceHistory(studentId)
  const records = historyQuery.data ?? []

  const columns: TableColumn[] = [
    { key: 'date', label: text.date },
    { key: 'group', label: text.group },
    { key: 'lesson', label: text.lesson },
    { key: 'status', label: text.status },
    { key: 'score', label: text.score, align: 'right' },
    { key: 'homework', label: text.homework },
  ]

  return (
    <SectionCard title={text.title}>
      <ListState
        isLoading={historyQuery.isLoading}
        isError={historyQuery.isError}
        error={historyQuery.error}
        onRetry={() => void historyQuery.refetch()}
        isEmpty={records.length === 0}
        empty={
          <EmptyState
            title={text.emptyTitle}
            description={text.emptyDescription}
            icon={<CalendarCheck className="w-5 h-5" />}
          />
        }
      >
        <div className="max-h-[420px] overflow-y-auto">
          <DataTable columns={columns}>
            {records.map((record) => (
              <tr key={record.lessonId}>
                <td className={cn(CELL_CLASS, 'tabular-nums')}>{formatDate(parseIsoDate(record.lessonDate))}</td>
                <td className={CELL_CLASS}>{record.groupName}</td>
                <td className={CELL_CLASS}>{interpolate(text.lessonNumber, { number: record.lessonNumber })}</td>
                <td className={CELL_CLASS}>
                  <Badge variant={ATTENDANCE_STATUS_VARIANT[record.status]}>{t.attendance.statuses[record.status]}</Badge>
                </td>
                <td className={cn(CELL_CLASS, 'text-right tabular-nums')}>{record.score ?? text.noScore}</td>
                <td className={CELL_CLASS}>{t.attendance.homeworkStatuses[record.homeworkStatus]}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </ListState>
    </SectionCard>
  )
}
