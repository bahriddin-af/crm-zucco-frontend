import { MessageSquare, Phone, Users, ArrowRightLeft, type LucideIcon } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { formatDate, formatTime } from '@/utils/formatters'
import { LEAD_ACTIVITY_TYPE, type LeadActivityItem, type LeadActivityType } from '../types/leadTypes'

const ACTIVITY_ICONS: Record<LeadActivityType, LucideIcon> = {
  [LEAD_ACTIVITY_TYPE.Note]: MessageSquare,
  [LEAD_ACTIVITY_TYPE.Call]: Phone,
  [LEAD_ACTIVITY_TYPE.Meeting]: Users,
  [LEAD_ACTIVITY_TYPE.StageChange]: ArrowRightLeft,
}

export function LeadActivityList({ activities }: { activities: LeadActivityItem[] }) {
  const { t } = useTranslation()

  if (activities.length === 0) {
    return <p className="text-xs text-subtle py-2">{t.leads.detail.noActivities}</p>
  }

  return (
    <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {activities.map((activity) => {
        const Icon = ACTIVITY_ICONS[activity.activityType] ?? MessageSquare
        return (
          <li key={activity.id} className="flex gap-2.5 p-2.5 rounded-md bg-canvas border border-border">
            <div className="w-6 h-6 shrink-0 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Icon className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex justify-between gap-2 text-[10px] text-caption">
                <span className="font-semibold text-copy-strong">{t.leads.activityTypes[activity.activityType]}</span>
                <span className="tabular-nums">
                  {formatDate(activity.createdAt)} {formatTime(activity.createdAt)}
                </span>
              </div>
              <p className="text-xs text-heading break-words">{activity.note}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
