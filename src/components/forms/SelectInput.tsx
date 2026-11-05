import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { FIELD_CONTROL_CLASS, FIELD_ERROR_CLASS } from './fieldStyles'

export interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

/** `Input` bilan bir xil ko'rinishdagi native select (RHF `register` bilan ishlaydi). */
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(FIELD_CONTROL_CLASS, 'min-h-[34px]', hasError && FIELD_ERROR_CLASS, className)}
      {...props}
    />
  )
)

SelectInput.displayName = 'SelectInput'
