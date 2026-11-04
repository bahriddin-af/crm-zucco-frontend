import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  STAFF_ROLE_TYPE,
  STAFF_ROLE_LABELS,
  type StaffListItem,
  type StaffRoleType,
} from '../types/staffTypes'
import { useSaveStaff } from '../hooks/useStaff'

const staffSchema = z.object({
  fullName: z.string().min(2, 'Исм ва фамилияни киритинг'),
  phone: z.string().min(9, 'Телефон рақамини тўлиқ киритинг'),
  password: z
    .string()
    .min(12, 'Пароль камида 12 та белгидан иборат бўлиши шарт')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Тўғри email киритинг').optional().or(z.literal('')),
  roleType: z.number().min(1).max(7),
  specialization: z.string().optional(),
  hireDate: z.string().min(1, 'Ишга олинган санани киритинг'),
})

type StaffFormData = z.infer<typeof staffSchema>

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  initialStaff?: StaffListItem | null
}

export function StaffModal({ isOpen, onClose, initialStaff }: StaffModalProps) {
  const isEditing = !!initialStaff

  const saveMutation = useSaveStaff(() => {
    onClose()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: '',
      phone: '+998',
      password: '',
      email: '',
      roleType: STAFF_ROLE_TYPE.Teacher,
      specialization: '',
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (initialStaff) {
      reset({
        fullName: initialStaff.fullName,
        phone: initialStaff.phone,
        password: '',
        roleType: initialStaff.roleType,
        specialization: initialStaff.specialization || '',
        hireDate: new Date().toISOString().split('T')[0],
      })
    } else {
      reset({
        fullName: '',
        phone: '+998',
        password: '',
        email: '',
        roleType: STAFF_ROLE_TYPE.Teacher,
        specialization: '',
        hireDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [initialStaff, reset])

  const onSubmit = (data: StaffFormData) => {
    const cleanPhone = data.phone.replace(/[\s\(\)\-]/g, '')
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

    saveMutation.mutate({
      id: initialStaff?.id || null,
      fullName: data.fullName,
      phone: formattedPhone,
      email: data.email || null,
      password: data.password ? data.password : null,
      roleType: data.roleType as StaffRoleType,
      specialization: data.specialization || null,
      hireDate: data.hireDate,
      primaryBranchId: 'adc72a29-310f-4a2a-8ede-29aa81214f87',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Ходим маълумотларини таҳрирлаш' : 'Янги ходим қўшиш'}
      description="Ходимнинг шахсий маълумотлари, роли ва тизимга кириш ҳуқуқлари"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Исм ва фамилия <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            placeholder="Масалан: Сардор Раҳимов"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Телефон рақами <span className="text-[#E11D48]">*</span>
            </label>
            <Input
              placeholder="+998901234567"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Роли ва лавозими <span className="text-[#E11D48]">*</span>
            </label>
            <select
              {...register('roleType', { valueAsNumber: true })}
              className="w-full h-10 px-3 rounded-lg border border-[#E5E9EB] text-sm text-[#1E2B24] bg-white focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48] transition-all"
            >
              {Object.entries(STAFF_ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Мутахассислиги / Фан
            </label>
            <Input
              placeholder="Масалан: IELTS & General English"
              error={errors.specialization?.message}
              {...register('specialization')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Ишга олинган сана <span className="text-[#E11D48]">*</span>
            </label>
            <Input
              type="date"
              error={errors.hireDate?.message}
              {...register('hireDate')}
            />
          </div>
        </div>

        {!isEditing && (
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Тизимга кириш пароли (камида 12 та белги) <span className="text-[#E11D48]">*</span>
            </label>
            <Input
              type="password"
              placeholder="Камида 12 белги, катта-кичик ҳарф ва рақам"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E9EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
            {isEditing ? 'Сақлаш' : 'Қўшиш'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
