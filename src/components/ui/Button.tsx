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
          'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap',
          // Variants
          variant === 'primary' &&
            'bg-primary hover:bg-primary-hover text-white shadow-xs border border-transparent',
          variant === 'secondary' &&
            'bg-surface hover:bg-canvas text-secondary-ink border border-border shadow-xs',
          variant === 'outline' &&
            'bg-transparent hover:bg-primary-soft text-primary border border-primary',
          variant === 'ghost' &&
            'bg-transparent hover:bg-divider text-caption',
          variant === 'danger' &&
            'bg-debt-soft hover:bg-debt-line text-debt-ink border border-debt-border',
          // Sizes
          size === 'sm' && 'min-h-8 px-3 py-1 text-xs rounded-md gap-1.5',
          size === 'md' && 'min-h-9 px-4 py-1.5 text-sm rounded-md gap-2',
          size === 'lg' && 'min-h-11 px-5 py-2 text-sm rounded-md gap-2.5',
          size === 'icon' && 'h-8 w-8 p-0 rounded-md',
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
