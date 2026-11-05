import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from './paths'

/** JWT uch qismdan iborat bo'ladi: header.payload.signature */
const JWT_PART_COUNT = 3

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  const hasValidToken = Boolean(token && token.split('.').length === JWT_PART_COUNT)

  if (!isAuthenticated || !hasValidToken) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
