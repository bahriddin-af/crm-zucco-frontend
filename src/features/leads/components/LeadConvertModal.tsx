import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Lead } from '../types/leadTypes'

const convertSchema = z.object({
  isExistingStudent: z.boolean(),
  groupId: z.string().min(1, 'Илтимос, гуруҳни танланг'),
  joinedDate: z.string().min(1, 'Бошланиш санаси талаб этилади'),
  customPrice: z.number().optional(),
})

type ConvertFormData = z.infer<typeof convertSchema>

interface LeadConvertModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: ConvertFormData) => void
}

export function LeadConvertModal({
  lead,
  isOpen,
  onClose,
  onSuccess,
}: LeadConvertModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConvertFormData>({
    resolver: zodResolver(convertSchema),
    defaultValues: {
      isExistingStudent: false,
      groupId: 'g1',
      joinedDate: new Date().toISOString().split('T')[0],
      customPrice: undefined,
    },
  })

  const onSubmit = (data: ConvertFormData) => {
    onSuccess(data)
    reset()
    onClose()
  }

  if (!lead) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Лидни талабага айлантириш"
      description={`${lead.fullName} (${lead.phone}) профилини талаба сифатида расмийлаштириш`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Student Type Option */}
        <div className="p-3 bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-xs space-y-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E2B24]">
            <input
              type="checkbox"
              {...register('isExistingStudent')}
              className="rounded border-[#E3EAE5] text-[#146B52] focus:ring-[#146B52]"
            />
            <span>Мавжуд талаба профили билан боғлаш</span>
          </label>
          <p className="text-[11px] text-[#65776C]">
            Агар ушбу рақамли талаба аллақачон базада мавжуд бўлса, такрорий профиль яратилмайди.
          </p>
        </div>

        {/* Group Selection */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Гуруҳни танланг <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('groupId')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          >
            <option value="g1">IELTS Foundation · IF-09 (12/14)</option>
            <option value="g2">General English · GE-04 (10/12)</option>
            <option value="g3">Frontend React · FE-02 (14/16)</option>
          </select>
          {errors.groupId && (
            <p className="mt-1 text-[11px] text-[#BE123C]">{errors.groupId.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Ўқиш бошланиш санаси <span className="text-[#E11D48]">*</span>
          </label>
          <Input
            type="date"
            {...register('joinedDate')}
            error={errors.joinedDate?.message}
          />
        </div>

        {/* Custom Price */}
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Шахсий ойлик тўлов (ихтиёрий, сўмда)
          </label>
          <Input
            type="number"
            placeholder="Масалан: 450000 (бўш қолса гуруҳ нархи олинади)"
            {...register('customPrice', { valueAsNumber: true })}
            error={errors.customPrice?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3EAE5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Талабага айлантириш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
