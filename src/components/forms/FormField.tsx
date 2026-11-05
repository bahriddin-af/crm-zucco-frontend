import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  /** Kontrol o'zi ko'rsatmaydigan xato (select, textarea, checkbox). `Input` xatoni o'zi chiqaradi. */
  error?: string
  /** Xato bo'lmaganda ko'rsatiladigan maslahat matni. */
  hint?: string
  className?: string
  children: ReactNode
}

/** Forma maydoni: yorliq, majburiylik belgisi, maslahat va xato matni. */
export function FormField({ label, htmlFor, required = false, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn('min-w-0 space-y-1', className)}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-heading">
        {label}
        {required && <span className="text-debt-ink ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-caption">{hint}</p>}
      {error && (
        <p role="alert" className="text-[11px] text-debt-ink">
          {error}
        </p>
      )}
    </div>
  )
}
