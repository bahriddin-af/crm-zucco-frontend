import { Building, Calendar, Clock, User } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { interpolate, useTranslation, type Translations } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { shortTime } from '@/utils/dateUtils'
import { DAY_SCHEDULE_TYPE, GROUP_STATUS, WEEK_ORDER, type GroupListItem, type GroupStatus } from '../types/groupTypes'
import { GroupOccupancyBar } from './GroupOccupancyBar'
import { GroupCardActions, type GroupAction } from './GroupCardActions'

const STATUS_VARIANT: Record<GroupStatus, NonNullable<BadgeProps['variant']>> = {
  [GROUP_STATUS.Recruiting]: 'accent',
  [GROUP_STATUS.Active]: 'success',
  [GROUP_STATUS.Frozen]: 'warning',
  [GROUP_STATUS.Completed]: 'default',
}

function scheduleDaysText(t: Translations, group: GroupListItem): string {
  if (group.daysSchedule !== DAY_SCHEDULE_TYPE.Custom || !group.customDays?.length) {
    return t.groups.daySchedule[group.daysSchedule]
  }
  const selected = group.customDays
  return WEEK_ORDER.filter((day) => selected.includes(day))
    .map((day) => t.groups.weekdaysShort[day])
    .join(' / ')
}

interface GroupCardProps {
  group: GroupListItem
  onAction: (action: GroupAction, group: GroupListItem) => void
}

export function GroupCard({ group, onAction }: GroupCardProps) {
  const { t } = useTranslation()

  return (
    <article className="bg-surface border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between gap-3.5 hover:border-primary-line hover:shadow-sm transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-heading truncate">{group.name}</h3>
            <p className="text-xs text-caption mt-0.5 truncate font-medium">{group.courseName}</p>
          </div>
          <Badge variant={STATUS_VARIANT[group.status]}>{t.groups.groupStatus[group.status]}</Badge>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-caption">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-subtle shrink-0" />
            <span className="truncate">{group.teacherName || t.groups.noTeacher}</span>
          </div>
          <div className="flex items-center gap-1 text-2xs text-copy-strong bg-canvas px-2 py-0.5 rounded border border-border shrink-0">
            <Building className="w-3 h-3 text-primary" />
            <span>{group.roomName || t.groups.noRoom}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-copy-strong bg-canvas p-2.5 rounded-md border border-border">
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{scheduleDaysText(t, group)}</span>
          </div>
          <div className="flex items-center gap-1.5 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {shortTime(group.startTime)} – {shortTime(group.endTime)}
            </span>
          </div>
        </div>

        <GroupOccupancyBar enrolled={group.enrolledStudentsCount} capacity={group.capacity} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-divider">
        <span className="font-bold text-primary tabular-nums text-sm">
          {interpolate(t.groups.perMonth, { price: formatCurrency(group.monthlyPrice) })}
        </span>
        <GroupCardActions onAction={(action) => onAction(action, group)} />
      </div>
    </article>
  )
}
