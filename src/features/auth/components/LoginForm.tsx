import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, ArrowRight, Building2, Lock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { getApiErrorCode, getApiErrorMessage } from '@/utils/apiError'
import { normalizePhone } from '@/utils/formUtils'
import { createLoginSchema, type LoginFormValues } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useAuth'
import { TENANT_SELECTION_REQUIRED_CODE } from '../types/authTypes'

const DEFAULT_VALUES: LoginFormValues = { phone: '', password: '', requireTenant: false, tenantId: '' }

/** Muvaffaqiyatli kirishdan so'ng `LoginPage` sessiyani ko'rib o'zi yo'naltiradi. */
export function LoginForm() {
  const { t } = useTranslation()
  const login = useLogin()
  const [requireTenant, setRequireTenant] = useState(false)
  const schema = useMemo(() => createLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(
      {
        phone: normalizePhone(values.phone),
        password: values.password,
        tenantId: values.requireTenant ? values.tenantId : null,
      },
      {
        onError: (error) => {
          if (getApiErrorCode(error) === TENANT_SELECTION_REQUIRED_CODE) {
            setRequireTenant(true)
            setValue('requireTenant', true)
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {login.isError && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-md border border-debt-border bg-debt-soft text-2xs text-debt-ink"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{getApiErrorMessage(login.error)}</span>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="login-phone" className="block text-xs font-medium text-heading">
          {t.auth.phone}
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-3 top-[17px] -translate-y-1/2 text-subtle" />
          <Input
            id="login-phone"
            type="tel"
            autoComplete="username"
            placeholder={t.auth.phonePlaceholder}
            className="pl-9"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="login-password" className="block text-xs font-medium text-heading">
          {t.auth.password}
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-[17px] -translate-y-1/2 text-subtle" />
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t.auth.passwordPlaceholder}
            className="pl-9"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>
      </div>

      {requireTenant && (
        <div className="space-y-1">
          <label htmlFor="login-tenant" className="block text-xs font-medium text-heading">
            {t.auth.tenantId}
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-[17px] -translate-y-1/2 text-subtle" />
            <Input
              id="login-tenant"
              placeholder={t.auth.tenantIdPlaceholder}
              className="pl-9"
              error={errors.tenantId?.message}
              {...register('tenantId')}
            />
          </div>
          <p className="text-2xs text-caption">{t.auth.tenantIdHint}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={login.isPending}
        className="w-full min-h-[40px] text-xs font-semibold"
      >
        <span>{t.auth.loginButton}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </form>
  )
}
