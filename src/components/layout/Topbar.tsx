import { Link } from 'react-router-dom'
import { LogOut, Plus } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { BranchSwitcher } from './BranchSwitcher'
import { GlobalStudentSearch } from './GlobalStudentSearch'

export function Topbar() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const initial = (user?.fullName || t.layout.userFallback).charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-border px-6 flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <BranchSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <GlobalStudentSearch />
        <LanguageSwitcher />

        <PermissionGuard permission={PERMISSIONS.FINANCE.PAYMENT_CREATE}>
          <Link to={ROUTES.FINANCE.DESK} className="hidden sm:inline-flex">
            <Button variant="primary" size="sm" tabIndex={-1}>
              <Plus className="w-3.5 h-3.5" />
              <span>{t.layout.quickPayment}</span>
            </Button>
          </Link>
        </PermissionGuard>

        <div
          title={user?.fullName}
          className="w-7 h-7 rounded-full bg-primary-ring text-primary-hover border border-primary-line flex items-center justify-center text-xs font-semibold"
        >
          {initial}
        </div>

        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          title={t.layout.logout}
          aria-label={t.layout.logout}
          className="w-8 h-8 rounded-md flex items-center justify-center text-caption hover:text-debt-ink hover:bg-debt-soft transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
