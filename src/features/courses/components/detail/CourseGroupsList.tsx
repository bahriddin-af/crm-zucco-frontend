import { useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { Pagination } from '@/components/ui/Pagination'
import { SectionCard } from '@/components/ui/SectionCard'
import { ROUTES } from '@/routes/paths'
import { interpolate, useTranslation } from '@/i18n'
import { shortTime } from '@/utils/dateUtils'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { GROUPS_PAGE_SIZE } from '@/features/groups/types/groupTypes'
import { formatScheduleDays } from '@/features/groups/utils/groupSchedule'
import { GROUP_STATUS_VARIANT } from '@/features/groups/utils/groupStatus'

/** Kursga tegishli guruhlar (sahifalangan), har biri guruh sahifasiga havola. */
export function CourseGroupsList({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const groupsQuery = useGroupsList({ courseId, page, pageSize: GROUPS_PAGE_SIZE })
  const groups = groupsQuery.data?.items ?? []

  return (
    <SectionCard title={t.courses.detail.groupsTitle}>
      <ListState
        isLoading={groupsQuery.isLoading}
        isError={groupsQuery.isError}
        error={groupsQuery.error}
        onRetry={() => void groupsQuery.refetch()}
        isEmpty={groups.length === 0}
        empty={
          <EmptyState
            title={t.courses.detail.groupsEmptyTitle}
            description={t.courses.detail.groupsEmptyDescription}
            icon={<Users className="w-5 h-5" />}
          />
        }
      >
        <ul className="divide-y divide-divider">
          {groups.map((group) => (
            <li key={group.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={generatePath(ROUTES.GROUPS.DETAIL, { id: group.id })}
                  className="text-xs font-semibold text-heading hover:text-primary transition-colors"
                >
                  {group.name}
                </Link>
                <p className="text-2xs text-caption truncate">
                  {group.teacherName || t.groups.noTeacher} · {formatScheduleDays(t, group)} · {shortTime(group.startTime)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xs text-copy-strong tabular-nums">
                  {interpolate(t.groups.capacityValue, {
                    enrolled: group.enrolledStudentsCount,
                    capacity: group.capacity,
                  })}
                </span>
                <Badge variant={GROUP_STATUS_VARIANT[group.status]}>{t.groups.groupStatus[group.status]}</Badge>
              </div>
            </li>
          ))}
        </ul>
        <Pagination page={page} totalPages={groupsQuery.data?.totalPages ?? 1} onPageChange={setPage} />
      </ListState>
    </SectionCard>
  )
}
