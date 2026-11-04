import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title = 'Маълумот топилмади',
  description = 'Ушбу бўлимда ҳозирча ҳеч қандай маълумот мавжуд эмас.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-[#E3EAE5] bg-white',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#F6F8F7] text-[#65776C] flex items-center justify-center mb-3">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="text-xs font-semibold text-[#1E2B24] mb-1">{title}</h3>
      <p className="text-[11px] text-[#65776C] max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
