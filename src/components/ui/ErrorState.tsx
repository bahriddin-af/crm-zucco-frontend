import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { getApiErrorMessage } from '@/utils/apiError'
import { cn } from '@/utils/cn'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  className?: string
}

/** So'rov xatosi uchun tushunarli xabar va "Qayta urinish" tugmasi. */
export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center rounded-lg border border-debt-line bg-debt-soft',
        className
      )}
    >
      <AlertTriangle className="w-5 h-5 text-debt-ink mb-2" />
      <h3 className="text-xs font-semibold text-heading mb-1">{t.ui.errorTitle}</h3>
      <p className="text-2xs text-copy max-w-sm mb-4">{getApiErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.ui.retry}</span>
        </Button>
      )}
    </div>
  )
}
