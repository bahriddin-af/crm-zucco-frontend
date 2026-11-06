import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { PERMISSIONS } from '@/constants/permissions'
import { Button } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/ui/PageHeader'
import { ActiveStudentsKpi } from '../components/ActiveStudentsKpi'
import { FinanceKpis } from '../components/FinanceKpis'
import { ActiveGroupsWidget } from '../components/ActiveGroupsWidget'
import { LeadsFunnelWidget } from '../components/LeadsFunnelWidget'
import { RiskSummaryWidget } from '../components/RiskSummaryWidget'

/** Har bir vidjet o'z ruxsati bilan ko'rsatiladi va alohida `ErrorBoundary` ga o'ralgan. */
export function OverviewPage() {
  const { t } = useTranslation()
  const canViewLeads = useAuthStore((state) => state.hasPermission(PERMISSIONS.LEADS.VIEW))

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.overview.title}
        subtitle={t.overview.subtitle}
        actions={
          <>
            <PermissionGuard permission={PERMISSIONS.LEADS.CREATE}>
              <Link to={ROUTES.LEADS.LIST}>
                <Button size="sm" tabIndex={-1}>
                  {t.overview.addLead}
                </Button>
              </Link>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.FINANCE.PAYMENT_CREATE}>
              <Link to={ROUTES.FINANCE.DESK}>
                <Button variant="primary" size="sm" tabIndex={-1}>
                  {t.overview.acceptPayment}
                </Button>
              </Link>
            </PermissionGuard>
          </>
        }
      />

      {/* auto-fit: ruxsat bo'lmagani uchun yashirilgan kartalar o'rnida bo'sh joy qolmaydi */}
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
        <PermissionGuard permission={PERMISSIONS.STUDENTS.VIEW}>
          <ErrorBoundary>
            <ActiveStudentsKpi />
          </ErrorBoundary>
        </PermissionGuard>
        <PermissionGuard permission={PERMISSIONS.FINANCE.VIEW}>
          <ErrorBoundary>
            <FinanceKpis />
          </ErrorBoundary>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PermissionGuard permission={PERMISSIONS.GROUPS.VIEW}>
          <ErrorBoundary>
            <ActiveGroupsWidget className={canViewLeads ? 'lg:col-span-2' : 'lg:col-span-3'} />
          </ErrorBoundary>
        </PermissionGuard>
        <PermissionGuard permission={PERMISSIONS.LEADS.VIEW}>
          <ErrorBoundary>
            <LeadsFunnelWidget />
          </ErrorBoundary>
        </PermissionGuard>
      </div>

      <PermissionGuard permission={PERMISSIONS.STUDENTS.RISK_VIEW}>
        <ErrorBoundary>
          <RiskSummaryWidget />
        </ErrorBoundary>
      </PermissionGuard>
    </div>
  )
}
