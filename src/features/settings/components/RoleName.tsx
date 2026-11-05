import { useTranslation } from '@/i18n'

/** Tizim rollari (Owner, Teacher ...) tarjima qilinadi; markaz yaratgan rollar o'z nomi bilan ko'rsatiladi. */
export function RoleName({ name }: { name: string }) {
  const { t } = useTranslation()
  const names: Record<string, string> = t.roles.roleNames
  return <>{names[name] ?? name}</>
}
