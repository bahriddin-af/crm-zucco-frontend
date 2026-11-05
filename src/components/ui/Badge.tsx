import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  children: ReactNode
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-medium leading-[14px] whitespace-nowrap border',
        variant === 'default' && 'bg-canvas border-border text-copy-strong',
        variant === 'accent' && 'bg-primary-soft border-primary-ring text-primary-hover',
        variant === 'success' && 'bg-success-soft border-success-line text-success-ink',
        variant === 'warning' && 'bg-warning-soft border-warning-tint text-warning-ink',
        variant === 'danger' && 'bg-debt-soft border-debt-line text-debt-ink',
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}
