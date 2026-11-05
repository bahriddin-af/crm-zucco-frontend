import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { useUpsertRoom } from '../hooks/useBranches'
import { createRoomSchema, type RoomFormValues } from '../types/branchSchemas'
import { ROOM_TYPE, type RoomResponse } from '../types/branchTypes'

const FORM_ID = 'room-form'
const ROOM_TYPES = Object.values(ROOM_TYPE)

interface RoomFormModalProps {
  branchId: string
  /** `null` — yangi xona. */
  room: RoomResponse | null
  onClose: () => void
}

export function RoomFormModal({ branchId, room, onClose }: RoomFormModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createRoomSchema(t), [t])
  const upsert = useUpsertRoom()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: room?.name ?? '',
      capacity: room?.capacity ?? Number.NaN,
      type: room?.type ?? ROOM_TYPE.StandardClassroom,
      equipment: room?.equipment ?? '',
    },
  })

  const onSubmit = (values: RoomFormValues) => {
    upsert.mutate(
      {
        id: room?.id ?? null,
        branchId,
        name: values.name,
        capacity: values.capacity,
        type: values.type,
        equipment: values.equipment.length > 0 ? values.equipment : null,
      },
      {
        onSuccess: () => {
          toast.success(t.branches.roomSaved)
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={room ? t.branches.editRoom : t.branches.newRoom}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" size="sm" type="submit" form={FORM_ID} isLoading={upsert.isPending}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} className="space-y-3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormField label={t.branches.roomName} htmlFor="room-name" error={errors.name?.message}>
          <Input id="room-name" {...register('name')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.branches.capacity} htmlFor="room-capacity" error={errors.capacity?.message}>
            <Input id="room-capacity" type="number" min={1} step={1} {...register('capacity', { valueAsNumber: true })} />
          </FormField>
          <FormField label={t.branches.roomType} htmlFor="room-type" error={errors.type?.message}>
            <SelectInput id="room-type" {...register('type', { valueAsNumber: true })}>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t.branches.roomTypes[type]}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>
        <FormField label={t.branches.equipment} htmlFor="room-equipment">
          <TextAreaInput id="room-equipment" rows={2} {...register('equipment')} />
        </FormField>
      </form>
    </Modal>
  )
}
