import { BookOpen } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { interpolate, useTranslation } from '@/i18n'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { GROUP_STATUS } from '@/features/groups/types/groupTypes'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { WidgetCard } from './WidgetCard'

const VISIBLE_GROUPS = 5
const SKELETON_ROWS = 3
/** Backend `TimeOnly` ("HH:mm:ss") dan "HH:mm" qismi. */
const TIME_PREFIX_LENGTH = 5

export function ActiveGroupsWidget() {
  const { t } = useTranslation()
  const { data, isLoading, error, refetch } = useGroupsList({ status: GROUP_STATUS.Active })
  const groups = (data?.items ?? []).slice(0, VISIBLE_GROUPS)

  return (
    <WidgetCard
      title={t.overview.activeGroups}
      icon={<BookOpen className="w-4 h-4 text-primary" />}
      linkTo={ROUTES.GROUPS.LIST}
      linkLabel={t.overview.allGroups}
      className="lg:col-span-2"
    >
      {isLoading && (
        <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-12 w-full" className="p-5 space-y-3" />
      )}
      {error && <ErrorState error={error} onRetry={() => void refetch()} className="m-4" />}
      {!isLoading && !error && groups.length === 0 && (
        <EmptyState description={t.overview.noGroups} className="m-4 border-none" />
      )}
      {groups.length > 0 && (
        <div className="divide-y divide-divider">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center justify-between gap-3 p-4 hover:bg-canvas transition-colors">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-heading truncate">
                    {group.courseName} · {group.name}
                  </span>
                  <Badge variant="success">{t.common.active}</Badge>
                </div>
                <p className="text-2xs text-caption truncate">
                  <strong className="text-secondary-ink font-medium">
                    {group.teacherName || t.overview.teacherNotAssigned}
                  </strong>{' '}
                  · {group.roomName || t.overview.roomNotAssigned}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-heading tabular-nums">
                  {group.startTime.slice(0, TIME_PREFIX_LENGTH)} - {group.endTime.slice(0, TIME_PREFIX_LENGTH)}
                </p>
                <p className="text-3xs text-caption">
                  {interpolate(t.overview.groupCapacity, {
                    enrolled: group.enrolledStudentsCount,
                    capacity: group.capacity,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  )
}
