import { CalendarX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import { getWeekday } from '@/features/groups/utils/weekday'
import { parseIsoDate } from '@/utils/dateUtils'
import type { ScheduleLessonResponse } from '../types/scheduleTypes'
import { groupLessonsByDate } from '../utils/week'
import { ScheduleLessonCard } from './ScheduleLessonCard'

const SKELETON_CARDS_PER_DAY = 2
const GRID_CLASS = 'grid grid-cols-1 md:grid-cols-7 gap-2'

interface ScheduleWeekGridProps {
  days: string[]
  today: string
  lessons?: ScheduleLessonResponse[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
}

export function ScheduleWeekGrid({ days, today, lessons, isLoading, error, onRetry }: ScheduleWeekGridProps) {
  const { t } = useTranslation()

  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (!isLoading && (lessons ?? []).length === 0) {
    return (
      <EmptyState
        title={t.schedule.emptyTitle}
        description={t.schedule.emptyDescription}
        icon={<CalendarX className="w-5 h-5" />}
      />
    )
  }

  const byDate = groupLessonsByDate(lessons ?? [])

  return (
    <div className={GRID_CLASS}>
      {days.map((day) => {
        const date = parseIsoDate(day)
        const isToday = day === today
        const dayLessons = byDate.get(day) ?? []
        return (
          <section
            key={day}
            aria-label={t.groups.weekdaysLong[getWeekday(date)]}
            className="bg-white border border-border rounded-lg overflow-hidden flex flex-col min-h-[120px]"
          >
            <header
              className={cn(
                'px-2.5 py-2 border-b border-border text-[11px] font-semibold flex items-center justify-between gap-1',
                isToday ? 'bg-primary-soft text-primary' : 'bg-canvas text-caption'
              )}
            >
              <span>{t.groups.weekdaysShort[getWeekday(date)]}</span>
              <span className="tabular-nums">{formatDate(date)}</span>
            </header>
            <div className="p-1.5 space-y-1.5 flex-1">
              {isLoading
                ? Array.from({ length: SKELETON_CARDS_PER_DAY }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)
                : dayLessons.map((lesson) => <ScheduleLessonCard key={lesson.id} lesson={lesson} />)}
              {!isLoading && dayLessons.length === 0 && (
                <p className="text-[10px] text-subtle text-center py-3">{t.schedule.noLessons}</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
