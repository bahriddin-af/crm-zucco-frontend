import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { CheckboxField } from '@/components/forms/CheckboxField'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useUpsertBranch } from '../hooks/useBranches'
import { createBranchSchema, type BranchFormValues } from '../types/branchSchemas'
import { BRANCH_STATUS, type BranchListItem } from '../types/branchTypes'

const FORM_ID = 'branch-form'
const STATUSES = Object.values(BRANCH_STATUS)

interface BranchFormModalProps {
  /** `null` — yangi filial. */
  branch: BranchListItem | null
  onClose: () => void
}

const emptyToNull = (value: string): string | null => (value.length > 0 ? value : null)

export function BranchFormModal({ branch, onClose }: BranchFormModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createBranchSchema(t), [t])
  const upsert = useUpsertBranch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: branch?.name ?? '',
      address: branch?.address ?? '',
      phone: branch?.phone ?? '',
      isMain: branch?.isMain ?? false,
      status: branch?.status ?? BRANCH_STATUS.Active,
    },
  })

  const onSubmit = (values: BranchFormValues) => {
    upsert.mutate(
      {
        id: branch?.id ?? null,
        name: values.name,
        address: emptyToNull(values.address),
        phone: emptyToNull(values.phone),
        isMain: values.isMain,
        status: values.status,
      },
      {
        onSuccess: () => {
          toast.success(t.branches.saved)
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={branch ? t.branches.editBranch : t.branches.newBranch}
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
        <FormField label={t.branches.name} htmlFor="branch-name" error={errors.name?.message}>
          <Input id="branch-name" {...register('name')} />
        </FormField>
        <FormField label={t.branches.address} htmlFor="branch-address">
          <Input id="branch-address" {...register('address')} />
        </FormField>
        <FormField label={t.common.phone} htmlFor="branch-phone">
          <Input id="branch-phone" type="tel" {...register('phone')} />
        </FormField>
        <FormField label={t.common.status} htmlFor="branch-status" error={errors.status?.message}>
          <SelectInput id="branch-status" {...register('status', { valueAsNumber: true })}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t.branches.statuses[status]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <CheckboxField id="branch-main" label={t.branches.isMain} {...register('isMain')} />
      </form>
    </Modal>
  )
}
