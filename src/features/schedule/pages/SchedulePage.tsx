import { useState } from 'react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { parseIsoDate, todayIsoDate } from '@/utils/dateUtils'
import type { ScheduleFiltersValue } from '../types/scheduleTypes'
import { useScheduleRange } from '../hooks/useSchedule'
import { getWeekDays, getWeekRange, getWeekStart, shiftWeek } from '../utils/week'
import { ScheduleFilters } from '../components/ScheduleFilters'
import { ScheduleToolbar } from '../components/ScheduleToolbar'
import { ScheduleWeekGrid } from '../components/ScheduleWeekGrid'

export function SchedulePage() {
  const { t } = useTranslation()
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const [today] = useState(todayIsoDate)
  const [weekStart, setWeekStart] = useState(() => getWeekStart(parseIsoDate(today)))
  const [filters, setFilters] = useState<ScheduleFiltersValue>(() => ({
    branchId: activeBranchId ?? '',
    teacherId: '',
    roomId: '',
  }))

  const currentWeekStart = getWeekStart(parseIsoDate(today))
  const { from, to } = getWeekRange(weekStart)
  const scheduleQuery = useScheduleRange({
    from,
    to,
    branchId: filters.branchId || undefined,
    teacherId: filters.teacherId || undefined,
    roomId: filters.roomId || undefined,
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-heading tracking-tight">{t.schedule.title}</h1>
          <p className="text-xs text-caption mt-0.5">{t.schedule.subtitle}</p>
        </div>
        <ScheduleToolbar
          from={from}
          to={to}
          isCurrentWeek={weekStart === currentWeekStart}
          onPrevious={() => setWeekStart((value) => shiftWeek(value, -1))}
          onNext={() => setWeekStart((value) => shiftWeek(value, 1))}
          onToday={() => setWeekStart(currentWeekStart)}
        />
      </div>

      <ScheduleFilters value={filters} onChange={setFilters} />

      <ErrorBoundary>
        <ScheduleWeekGrid
          days={getWeekDays(weekStart)}
          today={today}
          lessons={scheduleQuery.data}
          isLoading={scheduleQuery.isLoading}
          error={scheduleQuery.isError ? scheduleQuery.error : null}
          onRetry={() => void scheduleQuery.refetch()}
        />
      </ErrorBoundary>
    </div>
  )
}
