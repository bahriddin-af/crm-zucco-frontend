import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Student } from '../types/studentTypes'

const freezeSchema = z.object({
  startDate: z.string().min(1, 'Бошланиш санасини киритинг'),
  endDate: z.string().min(1, 'Тугаш санасини киритинг'),
  reason: z.string().min(3, 'Музлатиш сабабини батафсилроқ ёзинг'),
})

type FreezeFormData = z.infer<typeof freezeSchema>

interface StudentFreezeModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: FreezeFormData) => void
}

export function StudentFreezeModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: StudentFreezeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FreezeFormData>({
    resolver: zodResolver(freezeSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      reason: 'Саломатлиги туфайли вақтинчалик танаффус',
    },
  })

  const onSubmit = (data: FreezeFormData) => {
    onSuccess(data)
    reset()
    onClose()
  }

  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ўқишни музлатиш"
      description={`${student.fullName} (${student.code}) ўқишини вақтинча тўхтатиш`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-md text-[11px] text-[#92400E]">
          Музлатилган даврда талабага тўлов ҳисобланмайди ва давомат журналида «Музлатилган» мақомида бўлади.
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Музлатиш бошланиш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input type="date" {...register('startDate')} error={errors.startDate?.message} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Кутилаётган тугаш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input type="date" {...register('endDate')} error={errors.endDate?.message} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Сабаби <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            placeholder="Саломатлик, сафар ёки бошқа сабаб..."
            {...register('reason')}
            error={errors.reason?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3EAE5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Музлатишни тасдиқлаш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
