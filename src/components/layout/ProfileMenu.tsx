import { useCallback, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useDismiss } from '@/hooks/useDismiss'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { useCurrentProfile } from '@/features/settings/hooks/useSettings'
import { formatPhone } from '@/utils/formatters'
import { formatRoles } from './navConfig'

/** Topbar'dagi avatar: bosilganda profil ma'lumotlari va "Chiqish" tugmasi ko'rsatiladi. */
export function ProfileMenu() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  const session = useAuthStore((state) => state.user)
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const { data: profile } = useCurrentProfile()
  const { data: branches } = useBranchOptions(isOpen)
  const logout = useLogout()

  const fullName = profile?.fullName ?? session?.fullName ?? t.layout.userFallback
  const phone = profile?.phone ?? session?.phone
  const position = profile?.roleType ? t.staff.roleTypes[profile.roleType] : formatRoles(session?.roles ?? [], t)
  const branchId = profile?.branchId ?? activeBranchId
  const branchName = branches?.find((branch) => branch.id === branchId)?.name

  const details = [
    { label: t.layout.positionLabel, value: position },
    { label: t.layout.phoneLabel, value: phone ? formatPhone(phone) : undefined },
    { label: t.layout.emailLabel, value: profile?.email ?? undefined },
    { label: t.layout.branchLabel, value: branchName },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t.layout.profileLabel}
        title={fullName}
        onClick={() => setIsOpen((open) => !open)}
        className="w-9 h-9 rounded-full bg-primary-ring text-primary-hover border border-primary-line flex items-center justify-center text-sm font-semibold hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {fullName.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={t.layout.profileLabel}
          className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-border bg-surface shadow-lg p-5"
        >
          <p className="text-sm font-semibold text-heading uppercase tracking-wide break-words">{fullName}</p>

          <dl className="mt-3 space-y-1 text-xs">
            {details.map((item) => (
              <div key={item.label} className="flex gap-1">
                <dt className="text-caption shrink-0">{item.label}:</dt>
                <dd className="text-heading break-words">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 pt-4 border-t border-divider flex justify-end">
            <Button variant="danger" size="sm" isLoading={logout.isPending} onClick={() => logout.mutate()}>
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.layout.signOut}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
