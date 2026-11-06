import { CalendarX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useTranslation } from '@/i18n'
import type { LessonItem } from '../../types/groupTypes'
import { useGroupLessons } from '../../hooks/useGroupLessons'
import { LessonRow } from './LessonRow'

const SKELETON_ROWS = 4

interface GroupLessonsListProps {
  groupId: string
  onCancel: (lesson: LessonItem) => void
}

/** Guruh darslari ro'yxati holatlari. Modal va guruh sahifasida ishlatiladi. */
export function GroupLessonsList({ groupId, onCancel }: GroupLessonsListProps) {
  const { t } = useTranslation()
  const lessonsQuery = useGroupLessons(groupId)
  const lessons = lessonsQuery.data ?? []

  if (lessonsQuery.isLoading) return <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-10 w-full" />
  if (lessonsQuery.isError) {
    return <ErrorState error={lessonsQuery.error} onRetry={() => void lessonsQuery.refetch()} />
  }
  if (lessons.length === 0) {
    return (
      <EmptyState
        title={t.groups.lessonsEmptyTitle}
        description={t.groups.lessonsEmptyDescription}
        icon={<CalendarX className="w-5 h-5" />}
      />
    )
  }
  return (
    <ul className="divide-y divide-divider max-h-[50vh] overflow-y-auto pr-1">
      {lessons.map((lesson) => (
        <LessonRow key={lesson.id} lesson={lesson} onCancel={onCancel} />
      ))}
    </ul>
  )
}
