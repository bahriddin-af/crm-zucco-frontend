import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { formatRoles } from './navConfig'

const INITIALS_LENGTH = 2

export function SidebarUserCard() {
  const user = useAuthStore((state) => state.user)
  const { t } = useTranslation()
  const fullName = user?.fullName || t.layout.userFallback

  return (
    <div className="flex items-center gap-2.5 flex-1 min-w-0 px-1">
      <div className="w-7 h-7 rounded-full bg-primary-ring text-primary-hover border border-primary-line flex items-center justify-center text-3xs font-bold shrink-0">
        {fullName.slice(0, INITIALS_LENGTH).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-heading truncate leading-tight">{fullName}</p>
        <p className="text-3xs text-caption truncate leading-tight">{formatRoles(user?.roles ?? [], t)}</p>
      </div>
    </div>
  )
}
