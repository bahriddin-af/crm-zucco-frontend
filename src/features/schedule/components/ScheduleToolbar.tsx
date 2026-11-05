import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate } from '@/utils/dateUtils'

interface ScheduleToolbarProps {
  from: string
  to: string
  isCurrentWeek: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function ScheduleToolbar({ from, to, isCurrentWeek, onPrevious, onNext, onToday }: ScheduleToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onPrevious} aria-label={t.schedule.previousWeek} title={t.schedule.previousWeek}>
        <ChevronLeft className="w-3.5 h-3.5" />
      </Button>
      <span className="text-xs font-semibold text-heading px-2 tabular-nums" aria-live="polite">
        {interpolate(t.schedule.weekRange, {
          from: formatDate(parseIsoDate(from)),
          to: formatDate(parseIsoDate(to)),
        })}
      </span>
      <Button variant="secondary" size="sm" onClick={onNext} aria-label={t.schedule.nextWeek} title={t.schedule.nextWeek}>
        <ChevronRight className="w-3.5 h-3.5" />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday} disabled={isCurrentWeek}>
        {t.schedule.thisWeek}
      </Button>
    </div>
  )
}
