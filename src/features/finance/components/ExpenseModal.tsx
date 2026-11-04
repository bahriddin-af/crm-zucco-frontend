import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCashAccounts, useRecordExpense } from '../hooks/useFinance'
import { formatCurrency } from '@/utils/formatters'

const expenseSchema = z.object({
  cashAccountId: z.string().min(1, 'Касса ҳисобини танланг'),
  amount: z.number().min(500, 'Минимал сумма: 500 сўм'),
  recipient: z.string().optional(),
  description: z.string().min(3, 'Харажат мақсади ёки изоҳини киритинг'),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useCashAccounts()
  const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0]

  const recordExpenseMutation = useRecordExpense(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    values: {
      cashAccountId: defaultAccount?.id || '',
      amount: 150000,
      recipient: '',
      description: 'Офис учун канцелярия ва маркерлар',
    },
  })

  const onSubmit = (data: ExpenseFormData) => {
    recordExpenseMutation.mutate({
      cashAccountId: data.cashAccountId,
      amount: Number(data.amount),
      recipient: data.recipient || null,
      description: data.description,
    })
    reset()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Харажатни қайд этиш"
      description="Марказ кассасидан чиқим қилиш ва балансни камайтириш"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Касса ҳисоби <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('cashAccountId')}
            disabled={isLoadingAccounts}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E9EB] text-sm text-[#1E2B24] bg-white focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48] transition-all"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — Мавжуд: {formatCurrency(acc.balance)}
              </option>
            ))}
          </select>
          {errors.cashAccountId && (
            <p className="text-xs text-[#E11D48] mt-1">{errors.cashAccountId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Чиқим суммаси (сўм) <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            type="number"
            step="10000"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Олувчи шахс ёки компания (ихтиёрий)
          </label>
          <Input
            placeholder="Масалан: Ishonch Do'koni MChJ"
            error={errors.recipient?.message}
            {...register('recipient')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Харажат мақсади ва изоҳ <span className="text-[#E11D48]">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Нима мақсадда харажат қилинганлигини ёзинг..."
            className="w-full px-3 py-2 rounded-lg border border-[#E5E9EB] text-sm text-[#1E2B24] placeholder:text-[#8C9E94] focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48] transition-all resize-none"
          />
          {errors.description && (
            <p className="text-xs text-[#E11D48] mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E9EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting || recordExpenseMutation.isPending}
          >
            Харажатни сақлаш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
