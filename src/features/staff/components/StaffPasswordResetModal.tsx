import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FormField } from '@/components/forms/FormField'
import { interpolate, useTranslation } from '@/i18n'
import { useResetStaffPassword } from '../hooks/useStaff'
import { createResetPasswordSchema, type ResetPasswordFormValues } from '../schemas/staffSchema'
import type { StaffListItem } from '../types/staffTypes'

interface StaffPasswordResetModalProps {
  staff: StaffListItem
  onClose: () => void
}

const FORM_ID = 'staff-password-reset-form'

/** Administrator boshqa xodimga yangi parol o'rnatadi; backend uning barcha sessiyalarini yopadi. */
export function StaffPasswordResetModal({ staff, onClose }: StaffPasswordResetModalProps) {
  const { t } = useTranslation()
  const text = t.staff.resetPassword
  const schema = useMemo(() => createResetPasswordSchema(t), [t])
  const resetPassword = useResetStaffPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = (values: ResetPasswordFormValues) =>
    resetPassword.mutate({ staffId: staff.id, newPassword: values.newPassword }, { onSuccess: onClose })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={text.title}
      description={interpolate(text.description, { name: staff.fullName })}
      maxWidth="sm"
      footer={
        <>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" size="sm" isLoading={resetPassword.isPending}>
            {text.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField label={t.settings.newPassword} htmlFor="reset-new-password" required error={errors.newPassword?.message}>
          <Input id="reset-new-password" type="password" autoComplete="new-password" {...register('newPassword')} />
        </FormField>
        <FormField
          label={t.settings.confirmPassword}
          htmlFor="reset-confirm-password"
          required
          error={errors.confirmPassword?.message}
        >
          <Input id="reset-confirm-password" type="password" autoComplete="new-password" {...register('confirmPassword')} />
        </FormField>
      </form>
    </Modal>
  )
}
