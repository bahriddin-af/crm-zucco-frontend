import { Ban } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { getWeekday } from '@/features/groups/utils/weekday'
import { parseIsoDate, shortTime } from '@/utils/dateUtils'
import type { LessonItem } from '../../types/groupTypes'
import { LESSON_STATUS_VARIANT, canCancelLesson } from '../../utils/lessonStatus'

interface LessonRowProps {
  lesson: LessonItem
  onCancel: (lesson: LessonItem) => void
}

export function LessonRow({ lesson, onCancel }: LessonRowProps) {
  const { t } = useTranslation()
  const date = parseIsoDate(lesson.lessonDate)
  const weekday = getWeekday(date)

  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-heading">
            {interpolate(t.groups.lessonNumber, { number: lesson.lessonNumber })}
          </span>
          <span className="text-caption tabular-nums">
            {t.groups.weekdaysShort[weekday]}, {formatDate(date)} · {shortTime(lesson.startTime)}–{shortTime(lesson.endTime)}
          </span>
        </div>
        {lesson.topic && <p className="text-[11px] text-copy truncate">{lesson.topic}</p>}
        {lesson.cancellationReason && (
          <p className="text-[11px] text-debt-ink truncate">
            {interpolate(t.groups.cancelledReason, { reason: lesson.cancellationReason })}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={LESSON_STATUS_VARIANT[lesson.status]}>{t.groups.lessonStatus[lesson.status]}</Badge>
        {canCancelLesson(lesson.status) && (
          <PermissionGuard permission={PERMISSIONS.ATTENDANCE.CANCEL_LESSON}>
            <Button variant="ghost" size="sm" onClick={() => onCancel(lesson)}>
              <Ban className="w-3.5 h-3.5" />
              <span>{t.groups.cancelLesson}</span>
            </Button>
          </PermissionGuard>
        )}
      </div>
    </li>
  )
}
