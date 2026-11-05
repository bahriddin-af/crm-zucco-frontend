import { FULL_ACCESS_ROLES, PERMISSIONS, type Permission, type PermissionModule } from '@/constants/permissions'
import type { RoleDto } from './settingsTypes'

export interface PermissionGroup {
  module: PermissionModule
  permissions: Permission[]
}

const isPermissionModule = (key: string): key is PermissionModule => key in PERMISSIONS

const permissionsOf = (module: PermissionModule): Permission[] => {
  const group: Record<string, Permission> = PERMISSIONS[module]
  return Object.values(group)
}

/** `PERMISSIONS` konstantasidan modul bo'yicha guruhlangan ro'yxat (matritsa qatorlari). */
export const PERMISSION_GROUPS: PermissionGroup[] = Object.keys(PERMISSIONS)
  .filter(isPermissionModule)
  .map((module) => ({ module, permissions: permissionsOf(module) }))

/** Backend `CurrentUser.HasPermission` bilan bir xil: Owner va SuperAdmin barcha ruxsatlarga ega. */
export const isFullAccessRole = (role: RoleDto): boolean => FULL_ACCESS_ROLES.includes(role.name)

export const isPermissionGranted = (role: RoleDto, permission: Permission): boolean =>
  isFullAccessRole(role) || role.permissions.includes(permission)
