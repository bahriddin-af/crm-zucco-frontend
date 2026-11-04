import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import { toast } from 'sonner'

const loginSchema = z.object({
  phone: z.string().min(9, 'Телефон рақамини тўлиқ киритинг'),
  password: z.string().min(6, 'Пароль камида 6 та белгидан иборат бўлиши керак'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '+998901234567',
      password: 'Admin123$SecurePassword',
    },
  })

  // Haqiqiy Backend API orqali kirish
  const onSubmit = async (data: LoginFormData) => {
    try {
      const cleanPhone = data.phone.replace(/[\s\(\)\-]/g, '')
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

      const loginRes = await apiClient.post(API_ROUTES.AUTH.LOGIN, {
        phone: formattedPhone,
        password: data.password,
      })

      const authData = loginRes.data.data

      setAuth(authData.accessToken, authData.refreshToken, {
        id: authData.userId,
        fullName: authData.fullName || 'Administrator',
        phone: formattedPhone,
        role: authData.roles?.[0] || 'Owner',
        permissions: authData.permissions || ['*'],
        branchIds: authData.branchId ? [authData.branchId] : ['adc72a29-310f-4a2a-8ede-29aa81214f87'],
      })

      toast.success('Тизимга муваффақиятли кирдингиз!')
      navigate(ROUTES.OVERVIEW)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { code?: string; message?: string } } }
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.code ||
        'Телефон рақам ёки пароль нотўғри'
      toast.error(errorMsg)
    }
  }

  // Tezkor Demo Kirish (Sinov uchun)
  const handleQuickLogin = async (role: 'Owner' | 'Teacher' | 'Cashier') => {
    setLoadingRole(role)
    try {
      if (role === 'Owner') {
        const loginRes = await apiClient.post(API_ROUTES.AUTH.LOGIN, {
          phone: '+998901234567',
          password: 'Admin123$SecurePassword',
        })
        const authData = loginRes.data.data

        setAuth(authData.accessToken, authData.refreshToken, {
          id: authData.userId,
          fullName: authData.fullName || 'Super Administrator',
          phone: '+998901234567',
          role: authData.roles?.[0] || 'Owner',
          permissions: authData.permissions || ['*'],
          branchIds: authData.branchId ? [authData.branchId] : ['adc72a29-310f-4a2a-8ede-29aa81214f87'],
        })
        toast.success('Раҳбар (Owner) роли билан кирилди!')
        navigate(ROUTES.OVERVIEW)
        return
      }

      if (role === 'Teacher') {
        setAuth('jwt-teacher', 'rf-teacher', {
          id: 'u-teacher',
          fullName: 'Азиз Каримов (Ўқитувчи)',
          phone: '+998 (93) 555-44-33',
          role: 'Teacher',
          permissions: ['attendance.view', 'attendance.mark', 'attendance.grade', 'courses.view'],
          branchIds: ['adc72a29-310f-4a2a-8ede-29aa81214f87'],
        })
      } else {
        setAuth('jwt-cashier', 'rf-cashier', {
          id: 'u-cashier',
          fullName: 'Зулфия Раҳимова (Кассир)',
          phone: '+998 (97) 111-22-33',
          role: 'Cashier',
          permissions: ['finance.view', 'finance.payment_create', 'finance.expense_create'],
          branchIds: ['adc72a29-310f-4a2a-8ede-29aa81214f87'],
        })
      }
      toast.success(`${role} роли билан кирилди!`)
      navigate(ROUTES.OVERVIEW)
    } catch {
      toast.error('Тизимга киришда хатолик юз берди')
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[420px] bg-white border border-[#E3EAE5] rounded-xl shadow-lg p-7 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#146B52] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            Z
          </div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Zucco CRM тизимига кириш
          </h1>
          <p className="text-xs text-[#65776C]">
            Ўқув маркази бошқаруви ва молиявий ҳисоб тизими
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Телефон рақами
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
              <Input
                placeholder="+998901234567"
                className="pl-9"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Пароль
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full min-h-[40px] text-xs font-semibold"
          >
            <span>Тизимга кириш</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-[#E3EAE5] space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#65776C] justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#146B52]" />
            <span>Тест учун роллар орқали тезкор кириш:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Owner')}
              disabled={Boolean(loadingRole)}
              className="py-1.5 px-2 bg-[#F6F8F7] hover:bg-[#E8F3ED] text-[#146B52] border border-[#E3EAE5] rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              Раҳбар (Owner)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Teacher')}
              disabled={Boolean(loadingRole)}
              className="py-1.5 px-2 bg-[#F6F8F7] hover:bg-[#E8F3ED] text-[#146B52] border border-[#E3EAE5] rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              Ўқитувчи
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Cashier')}
              disabled={Boolean(loadingRole)}
              className="py-1.5 px-2 bg-[#F6F8F7] hover:bg-[#E8F3ED] text-[#146B52] border border-[#E3EAE5] rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              Кассир
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
