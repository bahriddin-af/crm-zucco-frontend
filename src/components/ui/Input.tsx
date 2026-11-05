import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'flex w-full min-h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-heading placeholder:text-subtle shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-debt focus-visible:ring-debt',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-2xs text-debt-ink">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
