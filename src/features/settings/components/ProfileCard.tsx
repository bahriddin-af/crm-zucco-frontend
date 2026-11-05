import { UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { useCurrentProfile } from '../hooks/useSettings'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { SectionCard } from '@/components/ui/SectionCard'
import { RoleName } from './RoleName'

/** Joriy foydalanuvchi profili (`API_ROUTES.AUTH.ME`). */
export function ProfileCard() {
  const { t } = useTranslation()
  const { data: profile, isLoading, isError, error, refetch } = useCurrentProfile()

  return (
    <SectionCard title={t.settings.profileTitle}>
      {isLoading && <ListSkeleton rows={4} />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {profile && (
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 rounded-full bg-primary-soft text-primary flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs flex-1">
            <ProfileRow label={t.settings.fullName} value={profile.fullName} />
            <ProfileRow label={t.common.phone} value={formatPhone(profile.phone)} />
            <ProfileRow label={t.settings.email} value={profile.email ?? t.settings.notSet} />
            <ProfileRow
              label={t.settings.roleType}
              value={profile.roleType ? t.settings.roleTypes[profile.roleType] : t.settings.notSet}
            />
            <div className="sm:col-span-2">
              <dt className="text-[11px] text-caption">{t.settings.roles}</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {profile.roles.map((role) => (
                  <Badge key={role} variant="accent">
                    <RoleName name={role} />
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </SectionCard>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-caption">{label}</dt>
      <dd className="font-semibold text-heading mt-0.5">{value}</dd>
    </div>
  )
}
