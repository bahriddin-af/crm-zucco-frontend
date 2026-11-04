import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap',
          // Variants
          variant === 'primary' &&
            'bg-[#146B52] hover:bg-[#0F5943] text-white shadow-xs border border-transparent',
          variant === 'secondary' &&
            'bg-white hover:bg-[#F6F8F7] text-[#344B3E] border border-[#E3EAE5] shadow-xs',
          variant === 'outline' &&
            'bg-transparent hover:bg-[#E8F3ED] text-[#146B52] border border-[#146B52]',
          variant === 'ghost' &&
            'bg-transparent hover:bg-[#F0F4F1] text-[#65776C]',
          variant === 'danger' &&
            'bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]',
          // Sizes
          size === 'sm' && 'min-h-[28px] px-2.5 py-1 text-[11px] rounded-[5px] gap-1.5',
          size === 'md' && 'min-h-[34px] px-3.5 py-1.5 text-xs rounded-md gap-2',
          size === 'lg' && 'min-h-[40px] px-4 py-2 text-sm rounded-md gap-2.5',
          size === 'icon' && 'h-[32px] w-[32px] p-0 rounded-md',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
