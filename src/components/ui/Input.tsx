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
            'flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] placeholder:text-[#8B9C91] shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#E11D48] focus-visible:ring-[#E11D48]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[11px] text-[#BE123C]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
