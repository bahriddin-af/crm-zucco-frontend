import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { Lead } from '../types/leadTypes'

const lostSchema = z.object({
  reason: z.string().min(1, 'Йўқотиш сабабини танланг'),
  notes: z.string().optional(),
})

type LostFormData = z.infer<typeof lostSchema>

interface LeadLostModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: LostFormData) => void
}

export function LeadLostModal({
  lead,
  isOpen,
  onClose,
  onSuccess,
}: LeadLostModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LostFormData>({
    resolver: zodResolver(lostSchema),
    defaultValues: {
      reason: 'Нарх қимматлик қилди',
      notes: '',
    },
  })

  const onSubmit = (data: LostFormData) => {
    onSuccess(data)
    reset()
    onClose()
  }

  if (!lead) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Лидни йўқотиш ҳолати"
      description={`${lead.fullName} учун воз кечиш сабабини кўрсатинг`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Асосий сабаб <span className="text-[#E11D48]">*</span>
          </label>
          <select
            {...register('reason')}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          >
            <option value="Нарх қимматлик қилди">Нарх қимматлик қилди</option>
            <option value="Дарс вақти тўғри келмади">Дарс вақти тўғри келмади</option>
            <option value="Манзил узоқлик қилди">Манзил узоқлик қилди</option>
            <option value="Бошқа ўқув марказини танлади">Бошқа ўқув марказини танлади</option>
            <option value="Алоқага чиқмади / жавоб бермади">Алоқага чиқмади / жавоб бермади</option>
            <option value="Бошқа сабаб">Бошқа сабаб</option>
          </select>
          {errors.reason && (
            <p className="mt-1 text-[11px] text-[#BE123C]">{errors.reason.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Қўшимча изоҳ (ихтиёрий)
          </label>
          <textarea
            rows={3}
            placeholder="Мижоз билдирган эътирозлар ёки тафсилотлар..."
            {...register('notes')}
            className="w-full rounded-md border border-[#E3EAE5] bg-white px-3 py-2 text-xs text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3EAE5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
          >
            Йўқотилган деб белгилаш
          </Button>
        </div>
      </form>
    </Modal>
  )
}
