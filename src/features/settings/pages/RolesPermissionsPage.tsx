import { Info, ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { useRoles } from '../hooks/useSettings'
import { RolesMatrix } from '../components/RolesMatrix'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { PageHeader } from '@/components/ui/PageHeader'

function RolesMatrixSection() {
  const { t } = useTranslation()
  const { data: roles, isLoading, isError, error, refetch } = useRoles()

  if (isLoading) return <ListSkeleton rows={10} />
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />
  if (!roles || roles.length === 0) {
    return <EmptyState icon={<ShieldCheck className="w-5 h-5" />} title={t.roles.emptyTitle} />
  }
  return <RolesMatrix roles={roles} />
}

/** Rollar va ruxsatlar matritsasi (`API_ROUTES.STAFF.ROLES`) — faqat ko'rish uchun. */
export function RolesPermissionsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <PageHeader title={t.roles.title} subtitle={t.roles.subtitle} />
      <div className="flex items-start gap-2 rounded-md border border-primary-ring bg-primary-soft px-3 py-2 text-[11px] text-primary-hover">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>{t.roles.readOnlyNote}</span>
      </div>
      <PermissionGuard permission={PERMISSIONS.STAFF.VIEW} fallback={<EmptyState title={t.roles.noAccess} />}>
        <ErrorBoundary>
          <RolesMatrixSection />
        </ErrorBoundary>
      </PermissionGuard>
    </div>
  )
}
