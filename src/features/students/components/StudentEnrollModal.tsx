import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Student } from '../types/studentTypes'

const enrollSchema = z.object({
  groupId: z.string().min(1, 'Гуруҳни танланг'),
  joinedDate: z.string().min(1, 'Санани танланг'),
  customPrice: z.number().optional(),
})

type EnrollFormData = z.infer<typeof enrollSchema>

interface StudentEnrollModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: EnrollFormData) => void
}

export function StudentEnrollModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: StudentEnrollModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      groupId: 'g3',
      joinedDate: new Date().toISOString().split('T')[0],
      customPrice: undefined,
    },
  })

  const onSubmit = (data: EnrollFormData) => {
    onSuccess(data)
    reset()
    onClose()
  }

  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Қўшимча гуруҳга ёзиш"
      description={`${student.fullName} ни янги гуруҳга қўшиш (олдинги гуруҳлари сақланиб қолади)`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Гуруҳни танланг <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('groupId')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          >
            <option value="g2">General English · GE-04 (10/12)</option>
            <option value="g3">Frontend React · FE-02 (14/16)</option>
            <option value="g4">Matematika Intensive · M-11 (8/10)</option>
          </select>
          {errors.groupId && (
            <p className="mt-1 text-[11px] text-[#BE123C]">{errors.groupId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Қўшилиш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input type="date" {...register('joinedDate')} error={errors.joinedDate?.message} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Шахсий нарх (ихтиёрий, сўмда)
          </label>
          <Input
            type="number"
            placeholder="Бўш бўлса гуруҳ стандарти олинади"
            {...register('customPrice', { valueAsNumber: true })}
            error={errors.customPrice?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3EAE5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Гуруҳга ёзиш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
