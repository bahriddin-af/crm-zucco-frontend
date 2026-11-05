import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { authApi } from '../api/authApi'
import type { LoginRequest } from '../types/authTypes'
import { mapTokenToSession } from '../utils/session'

/**
 * Login: xato forma ichida ko'rsatiladi (global toast o'chirilgan).
 * Muvaffaqiyatda sessiya saqlanadi — `LoginPage` autentifikatsiyani ko'rib yo'naltiradi.
 */
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    meta: { silentError: true },
    onSuccess: (response, payload) => {
      setAuth(response.accessToken, response.refreshToken, mapTokenToSession(response, payload.phone))
      toast.success(t.auth.successMessage)
    },
  })
}

/** Backend sessiyasini bekor qiladi; so'rov muvaffaqiyatsiz bo'lsa ham mijoz sessiyasi tozalanadi. */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    meta: { silentError: true },
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    },
  })
}
