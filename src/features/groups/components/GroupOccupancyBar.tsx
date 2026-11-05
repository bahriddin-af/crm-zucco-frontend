import { interpolate, useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'

interface GroupOccupancyBarProps {
  enrolled: number
  capacity: number
}

/** Bo'sh joy shu miqdorga tushganda guruh "deyarli to'lgan" hisoblanadi. */
const ALMOST_FULL_SEATS_LEFT = 2

/** Inline style'siz to'lganlik ko'rsatkichi: Tailwind bilan bezatilgan native `<progress>`. */
export function GroupOccupancyBar({ enrolled, capacity }: GroupOccupancyBarProps) {
  const { t } = useTranslation()
  const isAlmostFull = enrolled >= capacity - ALMOST_FULL_SEATS_LEFT
  const label = interpolate(t.groups.capacityValue, { enrolled, capacity })

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-caption">{t.groups.capacity}</span>
        <span className={cn('font-semibold tabular-nums', isAlmostFull ? 'text-debt-ink' : 'text-success-ink')}>
          {label}
        </span>
      </div>
      <progress
        value={Math.min(enrolled, capacity)}
        max={Math.max(capacity, 1)}
        aria-label={label}
        className={cn(
          'block h-1.5 w-full appearance-none overflow-hidden rounded-full bg-divider-strong',
          '[&::-webkit-progress-bar]:bg-divider-strong [&::-webkit-progress-value]:rounded-full',
          isAlmostFull
            ? '[&::-webkit-progress-value]:bg-debt [&::-moz-progress-bar]:bg-debt'
            : '[&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary'
        )}
      />
    </div>
  )
}
