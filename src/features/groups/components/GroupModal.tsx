import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import {
  DAY_SCHEDULE_TYPE,
  DAY_SCHEDULE_LABELS,
  GROUP_STATUS,
  GROUP_STATUS_LABELS,
  BILLING_MODE,
  BILLING_MODE_LABELS,
  type GroupListItem,
} from '../types/groupTypes'
import { useGroupDependencies, useSaveGroup } from '../hooks/useGroups'

const groupSchema = z.object({
  name: z.string().min(2, 'Гуруҳ номини киритинг'),
  courseId: z.string().min(1, 'Курсни танланг'),
  teacherId: z.string().min(1, 'Ўқитувчини танланг'),
  roomId: z.string().min(1, 'Хонани танланг'),
  startDate: z.string().min(1, 'Бошланиш санасини киритинг'),
  daysSchedule: z.number().min(1),
  startTime: z.string().min(4, 'Бошланиш вақти (масалан: 14:00)'),
  endTime: z.string().min(4, 'Тугаш вақти (масалан: 15:30)'),
  monthlyPrice: z.number().min(0, 'Нарх 0 дан катта бўлиши керак'),
  capacity: z.number().min(1, 'Камида 1 та').max(50, 'Кўпи билан 50 та'),
  billingMode: z.number().min(1),
  status: z.number().min(1),
})

type GroupFormData = z.infer<typeof groupSchema>

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  groupToEdit?: GroupListItem | null
}

export function GroupModal({ isOpen, onClose, groupToEdit }: GroupModalProps) {
  const activeBranchId =
    useAuthStore((state) => state.activeBranchId) ||
    'adc72a29-310f-4a2a-8ede-29aa81214f87'

  const { courses, teachers, rooms, isLoading: isDependenciesLoading } =
    useGroupDependencies(activeBranchId)

  const saveMutation = useSaveGroup(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      courseId: '',
      teacherId: '',
      roomId: '',
      startDate: new Date().toISOString().split('T')[0],
      daysSchedule: DAY_SCHEDULE_TYPE.OddDays,
      startTime: '14:00',
      endTime: '15:30',
      monthlyPrice: 600000,
      capacity: 14,
      billingMode: BILLING_MODE.MonthlyCalendar,
      status: GROUP_STATUS.Recruiting,
    },
  })

  // Autofill monthlyPrice and default name when course changes
  const selectedCourseId = watch('courseId')
  useEffect(() => {
    if (!groupToEdit && selectedCourseId && courses.length > 0) {
      const course = courses.find((c) => c.id === selectedCourseId)
      if (course) {
        setValue('monthlyPrice', course.basePrice)
        const currentName = watch('name')
        if (!currentName || currentName.length <= 3) {
          setValue('name', `${course.name.slice(0, 3).toUpperCase()}-01`)
        }
      }
    }
  }, [selectedCourseId, courses, groupToEdit, setValue, watch])

  // Populate form if editing
  useEffect(() => {
    if (groupToEdit) {
      reset({
        name: groupToEdit.name,
        courseId: groupToEdit.courseId,
        teacherId: groupToEdit.teacherId,
        roomId: groupToEdit.roomId,
        startDate: new Date().toISOString().split('T')[0],
        daysSchedule: groupToEdit.daysSchedule,
        startTime: groupToEdit.startTime.slice(0, 5),
        endTime: groupToEdit.endTime.slice(0, 5),
        monthlyPrice: groupToEdit.monthlyPrice,
        capacity: groupToEdit.capacity,
        billingMode: BILLING_MODE.MonthlyCalendar,
        status: groupToEdit.status,
      })
    } else {
      reset({
        name: '',
        courseId: courses[0]?.id || '',
        teacherId: teachers[0]?.id || '',
        roomId: rooms[0]?.id || '',
        startDate: new Date().toISOString().split('T')[0],
        daysSchedule: DAY_SCHEDULE_TYPE.OddDays,
        startTime: '14:00',
        endTime: '15:30',
        monthlyPrice: courses[0]?.basePrice || 600000,
        capacity: 14,
        billingMode: BILLING_MODE.MonthlyCalendar,
        status: GROUP_STATUS.Recruiting,
      })
    }
  }, [groupToEdit, isOpen, reset, courses, teachers, rooms])

  const onSubmit = (data: GroupFormData) => {
    saveMutation.mutate({
      id: groupToEdit ? groupToEdit.id : undefined,
      name: data.name,
      courseId: data.courseId,
      teacherId: data.teacherId,
      branchId: activeBranchId,
      roomId: data.roomId,
      startDate: data.startDate,
      daysSchedule: data.daysSchedule as typeof DAY_SCHEDULE_TYPE[keyof typeof DAY_SCHEDULE_TYPE],
      startTime: data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
      endTime: data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime,
      monthlyPrice: data.monthlyPrice,
      capacity: data.capacity,
      billingMode: data.billingMode as typeof BILLING_MODE[keyof typeof BILLING_MODE],
      status: data.status as typeof GROUP_STATUS[keyof typeof GROUP_STATUS],
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={groupToEdit ? 'Гуруҳни таҳрирлаш' : 'Янги ўқув гуруҳи очиш'}
      description="Ўқув марказида янги гуруҳни шакллантириш ва жадвалга бириктириш"
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={saveMutation.isPending || isDependenciesLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {groupToEdit ? 'Сақлаш' : 'Гуруҳни очиш'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Course & Group Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Таълим курси <span className="text-red-500">*</span>
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
            {errors.courseId && (
              <p className="mt-1 text-[11px] text-[#BE123C]">{errors.courseId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Гуруҳ номи/коди <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Масалан: IF-01, FE-React-04"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>
        </div>

        {/* Row 2: Teacher & Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Ўқитувчи (Мураббий) <span className="text-red-500">*</span>
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('teacherId')}
            >
              <option value="">Ўқитувчини танланг...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} {t.specialization ? `(${t.specialization})` : ''}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="mt-1 text-[11px] text-[#BE123C]">{errors.teacherId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Дарс хонаси (Аудитория) <span className="text-red-500">*</span>
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('roomId')}
            >
              <option value="">Хонани танланг...</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Сиғими: {r.capacity})
                </option>
              ))}
            </select>
            {errors.roomId && (
              <p className="mt-1 text-[11px] text-[#BE123C]">{errors.roomId.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: Days Schedule & Start Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Дарс кунлари <span className="text-red-500">*</span>
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('daysSchedule', { valueAsNumber: true })}
            >
              {Object.entries(DAY_SCHEDULE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Дарслар бошланиш санаси <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
          </div>
        </div>

        {/* Row 4: Lesson Times */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Бошланиш вақти <span className="text-red-500">*</span>
            </label>
            <Input
              type="time"
              {...register('startTime')}
              error={errors.startTime?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Тугаш вақти <span className="text-red-500">*</span>
            </label>
            <Input
              type="time"
              {...register('endTime')}
              error={errors.endTime?.message}
            />
          </div>
        </div>

        {/* Row 5: Price, Capacity & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Ойлик тўлов (сўм) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="10000"
              {...register('monthlyPrice', { valueAsNumber: true })}
              error={errors.monthlyPrice?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Максимал сиғим (талаба)
            </label>
            <Input
              type="number"
              min={1}
              max={50}
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Гуруҳ ҳолати
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('status', { valueAsNumber: true })}
            >
              {Object.entries(GROUP_STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 6: Billing Mode */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Ҳисоб-китоб модели (Billing Mode)
          </label>
          <select
            className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
            {...register('billingMode', { valueAsNumber: true })}
          >
            {Object.entries(BILLING_MODE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  )
}
