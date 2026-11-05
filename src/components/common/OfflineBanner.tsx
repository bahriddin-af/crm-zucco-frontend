import { WifiOff } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { useTranslation } from '@/i18n'

/** Internet uzilganda sahifa tepasida doimiy ogohlantirish. */
export function OfflineBanner() {
  const isOnline = useAppStore((state) => state.isOnline)
  const { t } = useTranslation()

  if (isOnline) return null

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 px-4 py-2 bg-warning-tint border-b border-warning-border text-warning-ink text-xs font-medium"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>{t.ui.offlineBanner}</span>
    </div>
  )
}
