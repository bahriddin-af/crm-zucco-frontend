import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import type { PagedResult } from '@/types/api'
import type { GroupListItem } from '../types/groupTypes'
import { GroupCard } from './GroupCard'
import type { GroupAction } from './GroupCardActions'

const SKELETON_CARDS = 6
const GRID_CLASS = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'

interface GroupsGridProps {
  data?: PagedResult<GroupListItem>
  isLoading: boolean
  error: unknown
  onRetry: () => void
  hasFilters: boolean
  onCreate: () => void
  onAction: (action: GroupAction, group: GroupListItem) => void
  onPageChange: (page: number) => void
}

export function GroupsGrid({ data, isLoading, error, onRetry, hasFilters, onCreate, onAction, onPageChange }: GroupsGridProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <div key={index} className="bg-white border border-border rounded-lg p-5 space-y-3.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (error) return <ErrorState error={error} onRetry={onRetry} />

  const groups = data?.items ?? []
  if (groups.length === 0) {
    return (
      <EmptyState
        title={t.groups.emptyTitle}
        description={hasFilters ? t.groups.emptyFiltered : t.groups.emptyDescription}
        icon={<Users className="w-5 h-5" />}
        action={
          hasFilters ? undefined : (
            <PermissionGuard permission={PERMISSIONS.GROUPS.CREATE}>
              <Button variant="primary" size="sm" onClick={onCreate}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.groups.createFirst}</span>
              </Button>
            </PermissionGuard>
          )
        }
      />
    )
  }

  return (
    <div>
      <div className={GRID_CLASS}>
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onAction={onAction} />
        ))}
      </div>
      <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={onPageChange} />
    </div>
  )
}
