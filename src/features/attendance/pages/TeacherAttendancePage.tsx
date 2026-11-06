import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { addDaysIsoDate, todayIsoDate } from '@/utils/dateUtils'
import { useScheduleRange } from '@/features/schedule/hooks/useSchedule'
import { TEACHER_LESSONS_LOOKBACK_DAYS, pickTeacherDefaultLesson } from '../utils/teacherLessons'
import { TeacherLessonSelect } from '../components/teacher/TeacherLessonSelect'
import { TeacherLessonSheet } from '../components/teacher/TeacherLessonSheet'

/** O'qituvchining o'z darslari (so'nggi 7 kun) va tanlangan dars davomati. */
export function TeacherAttendancePage() {
  const { t } = useTranslation()
  const teacherId = useAuthStore((state) => state.user?.id ?? '')
  const [today] = useState(todayIsoDate)
  const [from] = useState(() => addDaysIsoDate(-TEACHER_LESSONS_LOOKBACK_DAYS))
  const [selectedId, setSelectedId] = useState('')

  const scheduleQuery = useScheduleRange({ from, to: today, teacherId })
  const lessons = scheduleQuery.data ?? []
  const lesson = lessons.find((item) => item.id === selectedId) ?? pickTeacherDefaultLesson(lessons, today)

  return (
    <div className="space-y-5">
      <PageHeader title={t.attendance.teacher.title} subtitle={t.attendance.teacher.subtitle} />
      <ListState
        isLoading={scheduleQuery.isLoading}
        isError={scheduleQuery.isError}
        error={scheduleQuery.error}
        onRetry={() => void scheduleQuery.refetch()}
        isEmpty={!lesson}
        empty={
          <EmptyState
            title={t.attendance.teacher.emptyTitle}
            description={t.attendance.teacher.emptyDescription}
            icon={<CalendarX className="w-5 h-5" />}
          />
        }
      >
        {lesson && (
          <>
            <TeacherLessonSelect lessons={lessons} lessonId={lesson.id} onChange={setSelectedId} />
            <TeacherLessonSheet key={lesson.id} lesson={lesson} today={today} />
          </>
        )}
      </ListState>
    </div>
  )
}
