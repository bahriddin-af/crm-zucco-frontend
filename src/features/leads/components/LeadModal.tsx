import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { useCoursesList } from '@/features/courses/hooks/useCourses'
import { useLeadStages, useSaveLead } from '../hooks/useLeads'

const leadSchema = z.object({
  fullName: z.string().min(2, 'Исм-шарифни киритинг'),
  phone: z.string().min(9, 'Телефон рақамини киритинг'),
  stageId: z.string().min(1, 'Босқични танланг'),
  courseId: z.string().optional(),
  note: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  defaultStageId?: string
}

export function LeadModal({ isOpen, onClose, defaultStageId }: LeadModalProps) {
  const activeBranchId =
    useAuthStore((state) => state.activeBranchId) ||
    'adc72a29-310f-4a2a-8ede-29aa81214f87'

  const { data: stages = [] } = useLeadStages()
  const { data: coursesData } = useCoursesList()
  const courses = coursesData?.items || []

  const saveMutation = useSaveLead(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: '',
      phone: '+998',
      stageId: defaultStageId || stages[0]?.id || '',
      courseId: '',
      note: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: '',
        phone: '+998',
        stageId: defaultStageId || stages[0]?.id || '',
        courseId: courses[0]?.id || '',
        note: '',
      })
    }
  }, [isOpen, defaultStageId, stages, courses, reset])

  const onSubmit = (data: LeadFormData) => {
    saveMutation.mutate({
      fullName: data.fullName,
      phone: data.phone,
      stageId: data.stageId,
      courseId: data.courseId || null,
      branchId: activeBranchId,
      note: data.note || null,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Янги лид қўшиш"
      description="Марказга мурожаат қилган потенциал мижозни воронкага киритиш"
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={saveMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Лидни сақлаш
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Мижоз исм-шарифи <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Масаlan: Сардор Раҳимов"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Телефон рақами <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="+998901234567"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Воронка босқичи <span className="text-red-500">*</span>
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('stageId')}
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Қизиққан курси
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('courseId')}
            >
              <option value="">Курсни танланг...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Изоҳ / Эслатма
          </label>
          <Input
            placeholder="Мурожаат манбаси, қизиқиши ёки талаблари ҳақида қисқача..."
            {...register('note')}
          />
        </div>
      </form>
    </Modal>
  )
}
