import { ErrorState } from '@/components/ui/ErrorState'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import type { ScheduleLessonResponse } from '@/features/groups/types/groupTypes'
import { useGroupLessons } from '../../hooks/useAttendance'
import { AttendanceSheet } from '../AttendanceSheet'

const SKELETON_ROWS = 4

interface TeacherLessonSheetProps {
  lesson: ScheduleLessonResponse
  today: string
}

/** Jadvaldagi darsni guruh darslaridan to'liq ko'rinishda topib, mavjud davomat varag'ini ochadi. */
export function TeacherLessonSheet({ lesson, today }: TeacherLessonSheetProps) {
  const lessonsQuery = useGroupLessons(lesson.groupId)
  const fullLesson = lessonsQuery.data?.find((item) => item.id === lesson.id)

  if (lessonsQuery.isLoading) {
    return (
      <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-12 w-full" className="bg-surface border border-border rounded-lg p-5 space-y-3" />
    )
  }
  if (lessonsQuery.isError || !fullLesson) {
    return <ErrorState error={lessonsQuery.error} onRetry={() => void lessonsQuery.refetch()} />
  }
  return (
    <ErrorBoundary>
      <AttendanceSheet lesson={fullLesson} today={today} />
    </ErrorBoundary>
  )
}
