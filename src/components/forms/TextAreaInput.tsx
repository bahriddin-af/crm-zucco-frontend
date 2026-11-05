import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { FIELD_CONTROL_CLASS, FIELD_ERROR_CLASS } from './fieldStyles'

export interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(FIELD_CONTROL_CLASS, 'resize-none placeholder:text-subtle', hasError && FIELD_ERROR_CLASS, className)}
      {...props}
    />
  )
)

TextAreaInput.displayName = 'TextAreaInput'
