import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/routes/paths'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { PageHeader } from '@/components/ui/PageHeader'
import { todayIsoDate } from '@/utils/dateUtils'
import { useGroupLessons } from '../hooks/useAttendance'
import { pickDefaultLesson } from '../utils/attendanceMarks'
import { AttendanceSelectors } from '../components/AttendanceSelectors'
import { AttendanceContent } from '../components/AttendanceContent'

/**
 * Tanlangan guruh/dars holatdan hosil qilinadi (derived state): foydalanuvchi hali tanlamagan
 * yoki tanlovi ro'yxatda yo'q bo'lsa, birinchi guruh va bugungi (oxirgi o'tgan) dars olinadi.
 */
export function AttendanceJournalPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [today] = useState(todayIsoDate)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedLessonId, setSelectedLessonId] = useState('')

  const groupsQuery = useGroupsList({ pageSize: OPTIONS_PAGE_SIZE })
  const groups = groupsQuery.data?.items ?? []
  const groupId = groups.some((group) => group.id === selectedGroupId) ? selectedGroupId : (groups[0]?.id ?? '')

  const lessonsQuery = useGroupLessons(groupId)
  const lessons = lessonsQuery.data ?? []
  const lesson = lessons.find((item) => item.id === selectedLessonId) ?? pickDefaultLesson(lessons, today)

  const handleGroupChange = (nextGroupId: string) => {
    setSelectedGroupId(nextGroupId)
    setSelectedLessonId('')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.attendance.title}
        subtitle={t.attendance.subtitle}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.ATTENDANCE.TEACHER)}>
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.attendance.teacher.open}</span>
          </Button>
        }
      />

      {groupsQuery.isLoading && <Skeleton className="h-16 w-full rounded-lg" />}
      {groupsQuery.isError && <ErrorState error={groupsQuery.error} onRetry={() => void groupsQuery.refetch()} />}

      {groupsQuery.isSuccess && (
        <>
          <AttendanceSelectors
            groups={groups}
            groupId={groupId}
            lessons={lessons}
            lessonId={lesson?.id ?? ''}
            onGroupChange={handleGroupChange}
            onLessonChange={setSelectedLessonId}
          />
          <AttendanceContent
            hasGroups={groups.length > 0}
            groupId={groupId}
            lessonsQuery={lessonsQuery}
            lesson={lesson}
            today={today}
          />
        </>
      )}
    </div>
  )
}
