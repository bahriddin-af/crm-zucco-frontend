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
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/utils/formatters'
import {
  PAYMENT_METHOD,
  type PaymentMethod,
} from '../types/financeTypes'
import { useCashAccounts, useRecordPayment } from '../hooks/useFinance'
import { useStudentsList } from '@/features/students/hooks/useStudents'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Талабани танланг'),
  cashAccountId: z.string().min(1, 'Касса ҳисобини танланг'),
  amount: z.number().min(1000, 'Минимал тўлов суммаси: 1,000 сўм'),
  paymentMethod: z.number().min(1).max(6),
  groupId: z.string().optional(),
  comment: z.string().optional(),
  printReceipt: z.boolean(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentDrawerProps {
  isOpen: boolean
  onClose: () => void
  preselectedStudentId?: string
}

const METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { id: PAYMENT_METHOD.Cash, label: 'Нақд пул', icon: Banknote },
  { id: PAYMENT_METHOD.Card, label: 'Терминал (Uzcard/Humo)', icon: CreditCard },
  { id: PAYMENT_METHOD.Payme, label: 'Payme', icon: Smartphone },
  { id: PAYMENT_METHOD.Click, label: 'Click', icon: Smartphone },
  { id: PAYMENT_METHOD.BankTransfer, label: 'Банк ўтказма', icon: Building },
  { id: PAYMENT_METHOD.Uzum, label: 'Uzum Bank', icon: Smartphone },
]

export function PaymentDrawer({ isOpen, onClose, preselectedStudentId }: PaymentDrawerProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHOD.Cash)
  const { data: accounts = [], isLoading: isLoadingAccounts } = useCashAccounts()
  const { data: studentsData, isLoading: isLoadingStudents } = useStudentsList()
  const students = studentsData?.items || []

  const recordPaymentMutation = useRecordPayment(() => {
    onClose()
  })

  const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    values: {
      studentId: preselectedStudentId || (students[0]?.id || ''),
      cashAccountId: defaultAccount?.id || '',
      amount: 500000,
      paymentMethod: selectedMethod,
      groupId: undefined,
      comment: '',
      printReceipt: true,
    },
  })

  const currentAmount = watch('amount')

  const onSubmit = (data: PaymentFormData) => {
    recordPaymentMutation.mutate({
      studentId: data.studentId,
      cashAccountId: data.cashAccountId,
      amount: Number(data.amount),
      paymentMethod: selectedMethod,
      groupId: data.groupId || null,
      comment: data.comment || null,
    })
    reset()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E9EB]">
            <div>
              <h2 className="text-xl font-bold text-[#1E2B24]">Тўлов қабул қилиш</h2>
              <p className="text-xs text-[#5A6C62] mt-0.5">
                Талаба ҳисобини тўлдириш ва расмий квитанция яратиш
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#5A6C62] hover:text-[#1E2B24] hover:bg-[#F0F3F1] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Talaba tanlash */}
            <div>
              <label className="block text-xs font-medium text-[#1E2B24] mb-1.5">
                Талаба <span className="text-[#E11D48]">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('studentId')}
                  disabled={isLoadingStudents}
                  className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E5E9EB] text-sm text-[#1E2B24] bg-white focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48] transition-all"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.phone})
                    </option>
                  ))}
                </select>
                <Users className="w-4 h-4 text-[#8C9E94] absolute right-3 top-3 pointer-events-none" />
              </div>
              {errors.studentId && (
                <p className="text-xs text-[#E11D48] mt-1">{errors.studentId.message}</p>
              )}
            </div>

            {/* Kassa hisob raqami */}
            <div>
              <label className="block text-xs font-medium text-[#1E2B24] mb-1.5">
                Касса ҳисоби <span className="text-[#E11D48]">*</span>
              </label>
              <select
                {...register('cashAccountId')}
                disabled={isLoadingAccounts}
                className="w-full h-10 px-3 rounded-lg border border-[#E5E9EB] text-sm text-[#1E2B24] bg-white focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48] transition-all"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Баланс: {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
              {errors.cashAccountId && (
                <p className="text-xs text-[#E11D48] mt-1">{errors.cashAccountId.message}</p>
              )}
            </div>

            {/* To'lov usuli */}
            <div>
              <label className="block text-xs font-medium text-[#1E2B24] mb-2">
                Тўлов усули <span className="text-[#E11D48]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {METHODS.map((m) => {
                  const Icon = m.icon
                  const isSelected = selectedMethod === m.id
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => {
                        setSelectedMethod(m.id)
                        setValue('paymentMethod', m.id)
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'border-[#027A48] bg-[#027A48]/5 text-[#027A48] shadow-xs'
                          : 'border-[#E5E9EB] text-[#5A6C62] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#027A48]' : 'text-[#8C9E94]'}`} />
                      <span className="truncate">{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* To'lov summasi */}
            <div>
              <label className="block text-xs font-medium text-[#1E2B24] mb-1">
                Тўлов суммаси (сўм) <span className="text-[#E11D48]">*</span>
              </label>
              <Input
                type="number"
                step="50000"
                error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
              />
              <div className="flex gap-2 mt-2">
                {[300000, 500000, 800000, 1000000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setValue('amount', amt)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F0F3F1] hover:bg-[#E5E9EB] text-[#1E2B24] transition-colors"
                  >
                    {amt / 1000} минг
                  </button>
                ))}
              </div>
            </div>

            {/* Izoh */}
            <div>
              <label className="block text-xs font-medium text-[#1E2B24] mb-1">
                Изоҳ (ихтиёрий)
              </label>
              <Input
                placeholder="Масалан: Ноябрь ойи учун тўлов"
                {...register('comment')}
              />
            </div>

            {/* Kvitansiya chop etish */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="printReceipt"
                {...register('printReceipt')}
                className="w-4 h-4 rounded border-[#D0D5DD] text-[#027A48] focus:ring-[#027A48]"
              />
              <label htmlFor="printReceipt" className="text-xs text-[#5A6C62] flex items-center gap-1.5 cursor-pointer">
                <Printer className="w-3.5 h-3.5" />
                Тўлов квитанциясини автоматик чиқариш
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E9EB] bg-[#F8FAF9] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#5A6C62]">Қабул қилинадиган сумма:</span>
            <span className="font-bold text-[#027A48] text-base">
              {formatCurrency(currentAmount || 0)}
            </span>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Бекор қилиш
            </Button>
            <Button
              type="submit"
              form="payment-form"
              className="flex-1"
              isLoading={isSubmitting || recordPaymentMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Тўловни сақлаш
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
