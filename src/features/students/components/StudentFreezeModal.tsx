import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useFreezeStudent } from '../hooks/useStudents'
import type { StudentListItem, StudentDetail } from '../types/studentTypes'

const freezeSchema = z.object({
  fromDate: z.string().min(1, 'Бошланиш санасини киритинг'),
  toDate: z.string().min(1, 'Тугаш санасини киритинг'),
  reason: z.string().min(3, 'Музлатиш сабабини ёзинг'),
})

type FreezeFormData = z.infer<typeof freezeSchema>

interface StudentFreezeModalProps {
  student: StudentListItem | StudentDetail | null
  isOpen: boolean
  onClose: () => void
}

export function StudentFreezeModal({
  student,
  isOpen,
  onClose,
}: StudentFreezeModalProps) {
  const freezeMutation = useFreezeStudent(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreezeFormData>({
    resolver: zodResolver(freezeSchema),
    defaultValues: {
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      reason: 'Саломатлиги туфайли вақтинчалик танаффус',
    },
  })

  const onSubmit = (data: FreezeFormData) => {
    if (!student) return
    freezeMutation.mutate({
      studentId: student.id,
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
    })
  }

  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ўқишни музлатиш"
      description={`${student.fullName} ўқишини вақтинча тўхтатиш`}
      maxWidth="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={freezeMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Музлатишни тасдиқлаш
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-md text-[11px] text-[#92400E]">
          Музлатилган даврда талабага тўлов ҳисобланмайди ва давомат журналида «Музлатилган» мақомида бўлади.
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Музлатиш бошланиш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input type="date" {...register('fromDate')} error={errors.fromDate?.message} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Кутилаётган тугаш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input type="date" {...register('toDate')} error={errors.toDate?.message} />
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
      </form>
    </Modal>
  )
}
