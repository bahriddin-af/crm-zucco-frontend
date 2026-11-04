import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { useEnrollStudent } from '../hooks/useStudents'
import type { StudentListItem, StudentDetail } from '../types/studentTypes'

const enrollSchema = z.object({
  groupId: z.string().min(1, 'Гуруҳни танланг'),
  joinedDate: z.string().min(1, 'Санани танланг'),
  customPrice: z.number().optional(),
})

type EnrollFormData = z.infer<typeof enrollSchema>

interface StudentEnrollModalProps {
  student: StudentListItem | StudentDetail | null
  isOpen: boolean
  onClose: () => void
}

export function StudentEnrollModal({
  student,
  isOpen,
  onClose,
}: StudentEnrollModalProps) {
  const { data: groupsData } = useGroupsList()
  const groups = groupsData?.items || []

  const enrollMutation = useEnrollStudent(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      groupId: '',
      joinedDate: new Date().toISOString().split('T')[0],
      customPrice: undefined,
    },
  })

  const onSubmit = (data: EnrollFormData) => {
    if (!student) return
    enrollMutation.mutate({
      groupId: data.groupId,
      studentId: student.id,
      joinedDate: data.joinedDate,
      customPrice: data.customPrice || undefined,
    })
  }

  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Гуруҳга бириктириш"
      description={`${student.fullName} ни ўқув гуруҳига қўшиш`}
      maxWidth="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={enrollMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Гуруҳга ёзиш
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Гуруҳни танланг <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('groupId')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
          >
            <option value="">Гуруҳни танланг...</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — {g.courseName} ({g.teacherName})
              </option>
            ))}
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
            step="10000"
            placeholder="Бўш бўлса гуруҳ стандарти олинади"
            {...register('customPrice', { valueAsNumber: true })}
            error={errors.customPrice?.message}
          />
        </div>
      </form>
    </Modal>
  )
}
