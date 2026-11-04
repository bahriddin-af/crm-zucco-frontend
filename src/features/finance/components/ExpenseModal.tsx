import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const expenseSchema = z.object({
  accountId: z.string().min(1, 'Касса ҳисобини танланг'),
  categoryId: z.string().min(1, 'Харажат турини танланг'),
  amount: z.number().min(500, 'Минимал сумма: 500 сўм'),
  recipient: z.string().optional(),
  comment: z.string().min(3, 'Изоҳни киритинг'),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: ExpenseFormData) => void
}

export function ExpenseModal({ isOpen, onClose, onSuccess }: ExpenseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      accountId: 'acc-1',
      categoryId: 'cat-1',
      amount: 150000,
      recipient: '',
      comment: 'Офис учун канцелярия ва маркерлар',
    },
  })

  const onSubmit = (data: ExpenseFormData) => {
    onSuccess(data)
    reset()
    onClose()
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
            {...register('accountId')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          >
            <option value="acc-1">Асосий нақд касса</option>
            <option value="acc-2">Терминал ҳисоби</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Харажат тури (категория) <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('categoryId')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          >
            <option value="cat-1">Канцелярия ва хўжалик моллари</option>
            <option value="cat-2">Бино ижараси</option>
            <option value="cat-3">Коммунал ва интернет тўловлари</option>
            <option value="cat-4">Маркетинг ва реклама (Instagram, Target)</option>
            <option value="cat-5">Кофе-брейк ва чойхона харажатлари</option>
            <option value="cat-6">Бошқа харажатлар</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Сумма (сўмда) <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            type="number"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Олувчи шахс ёки ташкилот (ихтиёрий)
          </label>
          <Input placeholder="Масалан: Korzinka маркет" {...register('recipient')} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Изоҳ <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            placeholder="Нима мақсадда чиқим қилинди..."
            {...register('comment')}
            error={errors.comment?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3EAE5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Харажатни тасдиқлаш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
