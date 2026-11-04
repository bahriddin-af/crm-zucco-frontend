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
        variant === 'default' && 'bg-[#F6F8F7] border-[#E3EAE5] text-[#4D6255]',
        variant === 'accent' && 'bg-[#E8F3ED] border-[#D7EADF] text-[#0F5943]',
        variant === 'success' && 'bg-[#ECFDF5] border-[#D1FAE5] text-[#047857]',
        variant === 'warning' && 'bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]',
        variant === 'danger' && 'bg-[#FFF1F2] border-[#FFE4E6] text-[#BE123C]',
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}
