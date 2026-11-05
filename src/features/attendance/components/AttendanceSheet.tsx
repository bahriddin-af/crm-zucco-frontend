import { Calendar, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/formatters'
import { LESSON_STATUS, type LessonItem } from '@/features/groups/types/groupTypes'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { parseIsoDate } from '@/utils/dateUtils'
import type { StudentAttendanceSheetItem } from '../types/attendanceTypes'
import { useLessonSheet, useMarkAttendance } from '../hooks/useAttendance'
import { buildStudentMark, isLessonMarkable } from '../utils/attendanceMarks'
import { AttendanceTable } from './AttendanceTable'
import { LessonTopicForm } from './LessonTopicForm'
import type { StudentMarkChange } from './AttendanceStudentRow'

const SKELETON_ROWS = 4

interface AttendanceSheetProps {
  lesson: LessonItem
  today: string
}

export function AttendanceSheet({ lesson, today }: AttendanceSheetProps) {
  const { t } = useTranslation()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const sheetQuery = useLessonSheet(lesson.id)
  const markMutation = useMarkAttendance()
  const canGrade = hasPermission(PERMISSIONS.ATTENDANCE.GRADE)
  const isMarkable = isLessonMarkable(lesson, today)
  const canMark = isMarkable && hasPermission(PERMISSIONS.ATTENDANCE.MARK)

  if (sheetQuery.isLoading) {
    return (
      <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-12 w-full" className="bg-surface border border-border rounded-lg p-5 space-y-3" />
    )
  }
  if (sheetQuery.isError || !sheetQuery.data) {
    return <ErrorState error={sheetQuery.error} onRetry={() => void sheetQuery.refetch()} />
  }

  const sheet = sheetQuery.data
  if (sheet.students.length === 0) {
    return (
      <EmptyState title={t.attendance.emptyNoStudentsTitle} description={t.attendance.emptyNoStudents} icon={<Users className="w-5 h-5" />} />
    )
  }

  const handleMark = (student: StudentAttendanceSheetItem, change: StudentMarkChange) => {
    markMutation.mutate({ lessonId: sheet.lessonId, students: [buildStudentMark(student, canGrade, change)] })
  }

  const handleSaveAll = (topic: string | null) => {
    markMutation.mutate(
      { lessonId: sheet.lessonId, topic, students: sheet.students.map((student) => buildStudentMark(student, canGrade)) },
      { onSuccess: () => toast.success(t.attendance.saved) }
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-border bg-canvas space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-heading">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {interpolate(t.attendance.sheetHeader, {
                group: sheet.groupName,
                lesson: interpolate(t.groups.lessonNumber, { number: sheet.lessonNumber }),
                date: formatDate(parseIsoDate(sheet.lessonDate)),
              })}
            </span>
          </div>
          <Badge variant={sheet.isMarked ? 'success' : 'accent'}>{sheet.isMarked ? t.attendance.marked : t.attendance.notMarked}</Badge>
        </div>
        {!isMarkable && (
          <p role="status" className="text-2xs text-warning-ink bg-warning-soft border border-warning-tint rounded px-2.5 py-1.5">
            {lesson.status === LESSON_STATUS.Cancelled ? t.attendance.cancelledLesson : t.attendance.futureLesson}
          </p>
        )}
        <PermissionGuard permission={PERMISSIONS.ATTENDANCE.MARK}>
          <LessonTopicForm
            key={`${sheet.lessonId}:${sheet.topic ?? ''}`}
            defaultTopic={sheet.topic}
            disabled={!canMark}
            isSaving={markMutation.isPending}
            onSaveAll={handleSaveAll}
          />
        </PermissionGuard>
      </div>
      <AttendanceTable students={sheet.students} canGrade={canGrade} disabled={!canMark} onMark={handleMark} />
    </div>
  )
}
