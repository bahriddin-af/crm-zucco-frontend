import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useTranslation } from '@/i18n'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-border bg-surface',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-canvas text-caption flex items-center justify-center mb-3">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="text-xs font-semibold text-heading mb-1">{title ?? t.ui.emptyTitle}</h3>
      <p className="text-2xs text-caption max-w-sm mb-4">{description ?? t.ui.emptyDescription}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
