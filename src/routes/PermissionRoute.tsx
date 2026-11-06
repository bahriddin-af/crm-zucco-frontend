import type { ReactNode } from 'react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { AccessDeniedPage } from '@/features/auth/pages/AccessDeniedPage'
import { getRoutePermission } from './routePermissions'

interface PermissionRouteProps {
  /** `ROUTES` dagi yo'l; ruxsat `ROUTE_PERMISSIONS` dan olinadi. */
  path: string
  children: ReactNode
}

/** Sahifani URL orqali to'g'ridan-to'g'ri ochishda ham ruxsatni tekshiradi; yo'q bo'lsa "Ruxsat yo'q" sahifasi. */
export function PermissionRoute({ path, children }: PermissionRouteProps) {
  const permission = getRoutePermission(path)
  if (!permission) return children

  return (
    <PermissionGuard permission={permission} fallback={<AccessDeniedPage />}>
      {children}
    </PermissionGuard>
  )
}
