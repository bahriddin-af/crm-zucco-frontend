import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  Printer,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/utils/formatters'
import type { PaymentMethod } from '../types/financeTypes'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Талабани танланг'),
  accountId: z.string().min(1, 'Касса ҳисобини танланг'),
  amount: z.number().min(1000, 'Минимал тўлов суммаси: 1,000 сўм'),
  method: z.enum(['Cash', 'Card', 'Click', 'Payme', 'BankTransfer', 'Other']),
  billingPeriod: z.string().optional(),
  comment: z.string().optional(),
  printReceipt: z.boolean(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: PaymentFormData) => void
}

const METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { id: 'Cash', label: 'Нақд пул', icon: Banknote },
  { id: 'Card', label: 'Терминал', icon: CreditCard },
  { id: 'Payme', label: 'Payme', icon: Smartphone },
  { id: 'Click', label: 'Click', icon: Smartphone },
  { id: 'BankTransfer', label: 'Банк ўтказма', icon: Building },
  { id: 'Other', label: 'Бошқа', icon: CreditCard },
]

export function PaymentDrawer({ isOpen, onClose, onSuccess }: PaymentDrawerProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: 'zu-0248',
      accountId: 'acc-1',
      amount: 450000,
      method: 'Cash',
      billingPeriod: '2026-11',
      comment: '',
      printReceipt: true,
    },
  })

  const currentAmount = watch('amount')

  const onSubmit = (data: PaymentFormData) => {
    onSuccess(data)
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E3EAE5]">
          <div>
            <h2 className="text-base font-bold text-[#1E2B24]">
              Тўлов қабул қилиш
            </h2>
            <p className="text-[11px] text-[#65776C] mt-0.5">
              Талаба ҳисобига маблағ киритиш ва чек чиқариш
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md text-[#65776C] hover:bg-[#F0F4F1] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="payment-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          {/* Selected Student Preview */}
          <div className="p-3 bg-[#F6F8F7] border border-[#E3EAE5] rounded-md space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1E2B24]">
                Темур Бекмирзаев (ZU-0248)
              </span>
              <span className="text-[10px] text-[#BE123C] font-semibold bg-[#FFF1F2] px-1.5 py-0.5 rounded">
                Қарз: -450 000 сўм
              </span>
            </div>
            <p className="text-[11px] text-[#65776C]">
              IELTS Foundation · IF-09
            </p>
          </div>

          {/* Payment Method 3x2 Grid */}
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1.5">
              Тўлов усули <span className="text-[#E11D48]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon
                const isActive = selectedMethod === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(m.id)
                      setValue('method', m.id)
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-md border text-xs font-medium transition-all ${
                      isActive
                        ? 'border-[#146B52] bg-[#E8F3ED] text-[#146B52] shadow-xs'
                        : 'border-[#E3EAE5] bg-white text-[#4D6255] hover:bg-[#F6F8F7]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount input & Quick Amounts */}
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1.5">
              Тўлов суммаси <span className="text-[#E11D48]">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className="w-full h-12 text-2xl font-bold px-3.5 pr-14 rounded-md border border-[#E3EAE5] bg-white text-[#1E2B24] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#418A66]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8B9C91] font-medium">
                сўм
              </span>
            </div>
            {errors.amount && (
              <p className="mt-1 text-[11px] text-[#BE123C]">{errors.amount.message}</p>
            )}

            {/* Quick amount chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {[200000, 450000, 600000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue('amount', amt)}
                  className={`text-[10px] font-medium px-2 py-1 rounded border transition-colors ${
                    currentAmount === amt
                      ? 'bg-[#146B52] text-white border-[#146B52]'
                      : 'bg-[#F6F8F7] text-[#65776C] border-[#E3EAE5] hover:bg-[#E8F3ED]'
                  }`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Account */}
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Касса ҳисоби <span className="text-[#E11D48]">*</span>
            </label>
            <select
              {...register('accountId')}
              className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
            >
              <option value="acc-1">Асосий нақд касса (Чилонзор)</option>
              <option value="acc-2">Humo / Uzcard терминал ҳисоби</option>
              <option value="acc-3">Payme Business расмий ҳисоб</option>
            </select>
          </div>

          {/* Billing Period */}
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Ўқув ойи (давр)
            </label>
            <Input type="month" {...register('billingPeriod')} />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Изоҳ (ихтиёрий)
            </label>
            <Input
              placeholder="Масалан: Отаси пластик картадан ўтказди"
              {...register('comment')}
            />
          </div>

          {/* Print Receipt Switch */}
          <div className="flex items-center justify-between p-3 bg-[#F6F8F7] rounded-md border border-[#E3EAE5]">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#146B52]" />
              <div>
                <span className="text-xs font-medium text-[#1E2B24] block">
                  Чекни автоматик chop этиш
                </span>
                <span className="text-[10px] text-[#65776C]">
                  Тўлов тасдиқлангач, квитанция тайёрланади
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              {...register('printReceipt')}
              className="w-4 h-4 rounded text-[#146B52] border-[#E3EAE5] focus:ring-[#146B52]"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-[#E3EAE5] bg-white space-y-2">
          <Button
            type="submit"
            form="payment-form"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full min-h-[40px] text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Тўловни қабул қилиш</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full text-xs"
          >
            Бекор қилиш
          </Button>
        </div>
      </div>
    </div>
  )
}
