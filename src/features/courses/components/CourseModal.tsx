import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import {
  COURSE_LEVEL,
  COURSE_LEVEL_LABELS,
  COURSE_STATUS,
  type SubjectItem,
  type CourseListItem,
} from '../types/courseTypes'

const courseSchema = z.object({
  subjectId: z.string().min(1, 'Йўналишни танланг ёки киритинг'),
  name: z.string().min(2, 'Курс номини киритинг'),
  description: z.string().optional(),
  durationMonths: z.number().min(1, 'Камида 1 ой').max(36, 'Кўпи билан 36 ой'),
  lessonsPerMonth: z.number().min(1, 'Камида 1 та дарс').max(31, 'Кўпи билан 31 та дарс'),
  lessonDurationMinutes: z.number().min(20, 'Камида 20 дақиқа').max(240, 'Кўпи билан 240 дақиқа'),
  basePrice: z.number().min(0, 'Нарх манфий бўлиши мумкин эмас'),
  level: z.number().min(1),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  subjects: SubjectItem[]
  courseToEdit?: CourseListItem | null
}

export function CourseModal({ isOpen, onClose, subjects, courseToEdit }: CourseModalProps) {
  const queryClient = useQueryClient()
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      subjectId: subjects[0]?.id || '',
      name: '',
      description: '',
      durationMonths: 3,
      lessonsPerMonth: 12,
      lessonDurationMinutes: 80,
      basePrice: 600000,
      level: COURSE_LEVEL.General,
    },
  })

  useEffect(() => {
    if (courseToEdit) {
      reset({
        subjectId: courseToEdit.subjectId,
        name: courseToEdit.name,
        durationMonths: courseToEdit.durationMonths,
        lessonsPerMonth: courseToEdit.lessonsPerMonth,
        lessonDurationMinutes: courseToEdit.lessonDurationMinutes,
        basePrice: courseToEdit.basePrice,
        level: courseToEdit.level,
      })
    } else {
      reset({
        subjectId: subjects[0]?.id || '',
        name: '',
        description: '',
        durationMonths: 3,
        lessonsPerMonth: 12,
        lessonDurationMinutes: 80,
        basePrice: 600000,
        level: COURSE_LEVEL.General,
      })
    }
  }, [courseToEdit, isOpen, reset, subjects])

  // Subject create mutation
  const createSubjectMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post<ApiResponse<SubjectItem>>(API_ROUTES.COURSES.SUBJECTS, {
        name,
        description: '',
      })
      return res.data.data
    },
    onSuccess: (newSubj) => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'subjects'] })
      setValue('subjectId', newSubj.id)
      setIsAddingNewSubject(false)
      setNewSubjectName('')
      toast.success('Янги йўналиш яратилди!')
    },
    onError: () => {
      toast.error('Йўналиш яратишда хатолик юз берди')
    },
  })

  // Course save mutation
  const saveCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const payload = {
        id: courseToEdit ? courseToEdit.id : undefined,
        subjectId: data.subjectId,
        name: data.name,
        description: data.description || '',
        durationMonths: data.durationMonths,
        lessonsPerMonth: data.lessonsPerMonth,
        lessonDurationMinutes: data.lessonDurationMinutes,
        basePrice: data.basePrice,
        level: data.level,
        status: COURSE_STATUS.Active,
      }
      const res = await apiClient.post(API_ROUTES.COURSES.CREATE_OR_UPDATE, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL })
      toast.success(courseToEdit ? 'Курс муваффақиятли янгиланди!' : 'Янги курс муваффақиятли қўшилди!')
      onClose()
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Курсни сақлашда хатолик юз берди')
    },
  })

  const onSubmit = (data: CourseFormData) => {
    saveCourseMutation.mutate(data)
  }

  const handleCreateSubjectQuick = () => {
    if (!newSubjectName.trim()) return
    createSubjectMutation.mutate(newSubjectName.trim())
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseToEdit ? 'Курсни таҳрирлаш' : 'Янги курс яратиш'}
      description="Ўқув маркази курслар каталогига янги дастур қўшиш"
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={saveCourseMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {courseToEdit ? 'Сақлаш' : 'Курс қўшиш'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject Selection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[#1E2B24]">
              Таълим йўналиши (Фан) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsAddingNewSubject(!isAddingNewSubject)}
              className="text-[11px] text-[#146B52] hover:underline font-medium"
            >
              {isAddingNewSubject ? 'Рўйхатдан танлаш' : '+ Янги йўналиш қўшиш'}
            </button>
          </div>

          {isAddingNewSubject ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Масалан: Инглиз тили, IT, Робототехника..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={createSubjectMutation.isPending}
                onClick={handleCreateSubjectQuick}
              >
                Қўшиш
              </Button>
            </div>
          ) : (
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('subjectId')}
            >
              {subjects.length === 0 && <option value="">Йўналишлар йўқ (аввал қўшинг)</option>}
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {errors.subjectId && (
            <p className="mt-1 text-[11px] text-[#BE123C]">{errors.subjectId.message}</p>
          )}
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Курс номи <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Масалан: IELTS Foundation, General English..."
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        {/* Level and Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Даража (Level)
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('level', { valueAsNumber: true })}
            >
              {Object.entries(COURSE_LEVEL_LABELS).map(([lvlVal, label]) => (
                <option key={lvlVal} value={lvlVal}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Давомийлиги (ой) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              max={36}
              placeholder="3"
              {...register('durationMonths', { valueAsNumber: true })}
              error={errors.durationMonths?.message}
            />
          </div>
        </div>

        {/* Lessons per Month & Lesson Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Ойдаги дарслар сони <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              max={31}
              placeholder="12"
              {...register('lessonsPerMonth', { valueAsNumber: true })}
              error={errors.lessonsPerMonth?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Дарс вақти (дақиқа) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={20}
              max={240}
              placeholder="80"
              {...register('lessonDurationMinutes', { valueAsNumber: true })}
              error={errors.lessonDurationMinutes?.message}
            />
          </div>
        </div>

        {/* Monthly Base Price */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Ойлик тўлов нархи (сўмда) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="10000"
            placeholder="600000"
            {...register('basePrice', { valueAsNumber: true })}
            error={errors.basePrice?.message}
          />
        </div>
      </form>
    </Modal>
  )
}
