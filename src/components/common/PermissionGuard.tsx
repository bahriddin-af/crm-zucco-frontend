import type { ReactNode } from 'react'
import type { Permission } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'

interface PermissionGuardProps {
  permission: Permission
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({
  permission,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission)

  if (!hasPermission(permission)) {
    return fallback
  }

  return children
}
