import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { getApiErrorCode, getApiErrorMessage } from '@/utils/apiError'
import { FormField } from '@/components/forms/FormField'
import { useChangePassword } from '../hooks/useSettings'
import { createChangePasswordSchema, type ChangePasswordFormValues } from '../types/settingsSchemas'
import { SectionCard } from '@/components/ui/SectionCard'

/** Backend joriy parol noto'g'ri bo'lganda qaytaradigan kod. */
const INVALID_CREDENTIALS_CODE = 'invalid_credentials'

const EMPTY_VALUES: ChangePasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

/** Parolni almashtirish. Backend barcha sessiyalarni bekor qiladi — foydalanuvchi qayta kiradi. */
export function ChangePasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)
  const schema = useMemo(() => createChangePasswordSchema(t), [t])
  const changePassword = useChangePassword()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY_VALUES })

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success(t.settings.passwordChanged)
          logout()
          queryClient.clear()
          navigate(ROUTES.AUTH.LOGIN, { replace: true })
        },
        onError: (error) => {
          if (getApiErrorCode(error) === INVALID_CREDENTIALS_CODE) {
            setError('currentPassword', { message: t.settings.currentPasswordWrong })
            return
          }
          toast.error(getApiErrorMessage(error))
        },
      }
    )
  }

  return (
    <SectionCard title={t.settings.passwordTitle}>
      <form className="space-y-3 max-w-md" noValidate onSubmit={handleSubmit(onSubmit)}>
        <p className="text-2xs text-caption">{t.settings.passwordHint}</p>
        <FormField label={t.settings.currentPassword} htmlFor="current-password" error={errors.currentPassword?.message}>
          <Input id="current-password" type="password" autoComplete="current-password" {...register('currentPassword')} />
        </FormField>
        <FormField label={t.settings.newPassword} htmlFor="new-password" error={errors.newPassword?.message}>
          <Input id="new-password" type="password" autoComplete="new-password" {...register('newPassword')} />
        </FormField>
        <FormField label={t.settings.confirmPassword} htmlFor="confirm-password" error={errors.confirmPassword?.message}>
          <Input id="confirm-password" type="password" autoComplete="new-password" {...register('confirmPassword')} />
        </FormField>
        <Button variant="primary" size="sm" type="submit" isLoading={changePassword.isPending}>
          <KeyRound className="w-3.5 h-3.5" />
          <span>{t.settings.changePassword}</span>
        </Button>
      </form>
    </SectionCard>
  )
}
