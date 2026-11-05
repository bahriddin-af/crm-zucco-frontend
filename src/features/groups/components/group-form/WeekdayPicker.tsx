import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { WEEK_ORDER, type DayOfWeek } from '../../types/groupTypes'

interface WeekdayPickerProps {
  value: DayOfWeek[]
  onChange: (days: DayOfWeek[]) => void
}

/** `DayScheduleType.Custom` uchun hafta kunlarini tanlash (dushanbadan boshlab). */
export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const { t } = useTranslation()

  const toggle = (day: DayOfWeek) => {
    onChange(value.includes(day) ? value.filter((item) => item !== day) : [...value, day])
  }

  return (
    <div className="flex flex-wrap gap-1.5" role="group">
      {WEEK_ORDER.map((day) => {
        const isSelected = value.includes(day)
        return (
          <button
            key={day}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(day)}
            className={cn(
              'min-w-[44px] px-2.5 py-1.5 rounded-md border text-2xs font-medium transition-colors cursor-pointer',
              isSelected
                ? 'bg-primary border-primary text-white'
                : 'bg-surface border-border text-caption hover:bg-primary-soft'
            )}
          >
            {t.groups.weekdaysShort[day]}
          </button>
        )
      })}
    </div>
  )
}
