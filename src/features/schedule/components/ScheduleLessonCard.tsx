import { Building, Clock, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { LESSON_STATUS } from '@/features/groups/types/groupTypes'
import { LESSON_STATUS_VARIANT } from '@/features/groups/utils/lessonStatus'
import { shortTime } from '@/utils/dateUtils'
import type { ScheduleLessonResponse } from '../types/scheduleTypes'

interface ScheduleLessonCardProps {
  lesson: ScheduleLessonResponse
}

export function ScheduleLessonCard({ lesson }: ScheduleLessonCardProps) {
  const { t } = useTranslation()
  const isCancelled = lesson.status === LESSON_STATUS.Cancelled

  return (
    <article
      className={cn(
        'p-2 rounded-md border border-l-4 text-2xs space-y-1 shadow-2xs',
        isCancelled
          ? 'bg-debt-soft border-debt-line border-l-debt text-copy'
          : 'bg-primary-soft border-primary-line border-l-primary text-copy-strong'
      )}
    >
      <div className="flex items-center gap-1 font-semibold text-heading tabular-nums">
        <Clock className="w-3 h-3 shrink-0" />
        <span>
          {shortTime(lesson.startTime)}–{shortTime(lesson.endTime)}
        </span>
      </div>
      <p className={cn('font-bold text-heading truncate', isCancelled && 'line-through')}>{lesson.groupName}</p>
      <div className="flex items-center gap-1 min-w-0">
        <User className="w-3 h-3 shrink-0 text-subtle" />
        <span className="truncate">{lesson.teacherName}</span>
      </div>
      <div className="flex items-center gap-1 min-w-0">
        <Building className="w-3 h-3 shrink-0 text-subtle" />
        <span className="truncate">{lesson.roomName}</span>
      </div>
      <Badge variant={LESSON_STATUS_VARIANT[lesson.status]}>{t.groups.lessonStatus[lesson.status]}</Badge>
    </article>
  )
}
