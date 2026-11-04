import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  GENDER,
  STUDENT_STATUS,
  type StudentDetail,
} from '../types/studentTypes'
import { useSaveStudent } from '../hooks/useStudents'

const studentSchema = z.object({
  fullName: z.string().min(2, 'Исм-шарифни киритинг'),
  phone: z.string().min(9, 'Телефон рақамини тўлиқ киритинг'),
  birthDate: z.string().optional(),
  gender: z.number().min(1),
  address: z.string().optional(),
  note: z.string().optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  studentToEdit?: StudentDetail | null
}

export function StudentModal({ isOpen, onClose, studentToEdit }: StudentModalProps) {
  const saveMutation = useSaveStudent(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      phone: '+998',
      birthDate: '',
      gender: GENDER.Male,
      address: '',
      note: '',
    },
  })

  useEffect(() => {
    if (studentToEdit) {
      reset({
        fullName: studentToEdit.fullName,
        phone: studentToEdit.phone,
        birthDate: studentToEdit.birthDate || '',
        gender: studentToEdit.gender,
        address: studentToEdit.address || '',
        note: studentToEdit.note || '',
      })
    } else {
      reset({
        fullName: '',
        phone: '+998',
        birthDate: '',
        gender: GENDER.Male,
        address: '',
        note: '',
      })
    }
  }, [studentToEdit, isOpen, reset])

  const onSubmit = (data: StudentFormData) => {
    saveMutation.mutate({
      id: studentToEdit ? studentToEdit.id : undefined,
      fullName: data.fullName,
      phone: data.phone,
      birthDate: data.birthDate || null,
      gender: data.gender as typeof GENDER[keyof typeof GENDER],
      address: data.address || null,
      note: data.note || null,
      status: studentToEdit ? studentToEdit.status : STUDENT_STATUS.Active,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? 'Талаба маълумотларини таҳрирлаш' : 'Янги талаба рўйхатга олиш'}
      description="Ўқув марказига янги талаба карточкасини яратиш"
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
            {studentToEdit ? 'Сақлаш' : 'Рўйхатга олиш'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Талаба исм-шарифи <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Масалан: Темур Бекмирзаев"
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Туғилган санаси
            </label>
            <Input type="date" {...register('birthDate')} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Жинси
            </label>
            <select
              className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
              {...register('gender', { valueAsNumber: true })}
            >
              <option value={GENDER.Male}>Эркак (Ўғил бола)</option>
              <option value={GENDER.Female}>Аёл (Қиз бола)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Яшаш манзили
          </label>
          <Input
            placeholder="Чилонзор тумани, 9-мавзе..."
            {...register('address')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Қўшимча эслатма
          </label>
          <Input
            placeholder="Мақсади, мактаби ёки бошқа маълумотлар..."
            {...register('note')}
          />
        </div>
      </form>
    </Modal>
  )
}
