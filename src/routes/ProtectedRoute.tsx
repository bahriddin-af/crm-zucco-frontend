import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from './paths'

export function ProtectedRoute() {
  const { isAuthenticated, token } = useAuthStore()
  const location = useLocation()

  // Haqiqiy JWT token bo'lishi shart (header.payload.signature)
  const isValidJwt = Boolean(token && token.split('.').length === 3)

  if (!isAuthenticated || !isValidJwt) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
