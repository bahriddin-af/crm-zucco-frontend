import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

/** Yorlig'i bilan birga bosiladigan checkbox (RHF `register` bilan ishlaydi). */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, id, className, ...props }, ref) => (
    <label htmlFor={id} className={cn('inline-flex items-center gap-2 text-xs text-copy cursor-pointer', className)}>
      <input ref={ref} id={id} type="checkbox" className="w-4 h-4 rounded border-border accent-primary" {...props} />
      <span>{label}</span>
    </label>
  )
)

CheckboxField.displayName = 'CheckboxField'
