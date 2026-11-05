import { Banknote, Building, CreditCard, Smartphone, type LucideIcon } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { PAYMENT_METHOD, PAYMENT_METHODS, type PaymentMethod } from '../../types/financeTypes'

const METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  [PAYMENT_METHOD.Cash]: Banknote,
  [PAYMENT_METHOD.Card]: CreditCard,
  [PAYMENT_METHOD.BankTransfer]: Building,
  [PAYMENT_METHOD.Click]: Smartphone,
  [PAYMENT_METHOD.Payme]: Smartphone,
  [PAYMENT_METHOD.Uzum]: Smartphone,
}

interface PaymentMethodPickerProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  error?: string
}

export function PaymentMethodPicker({ value, onChange, error }: PaymentMethodPickerProps) {
  const { t } = useTranslation()

  return (
    <fieldset>
      <legend className="block text-[11px] font-medium text-heading mb-1">
        {t.finance.drawer.paymentMethod}
        <span className="text-debt-ink ml-0.5">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = METHOD_ICONS[method]
          const isSelected = value === method
          return (
            <button
              type="button"
              key={method}
              aria-pressed={isSelected}
              onClick={() => onChange(method)}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-md border text-xs font-medium transition-colors text-left',
                isSelected
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border text-copy hover:bg-canvas'
              )}
            >
              <Icon className={cn('w-4 h-4', isSelected ? 'text-primary' : 'text-subtle')} />
              <span className="truncate">{t.finance.paymentMethods[method]}</span>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1 text-[11px] text-debt-ink">{error}</p>}
    </fieldset>
  )
}
