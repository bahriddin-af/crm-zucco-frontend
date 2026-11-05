import { screen } from '@testing-library/react'
import { useLanguageStore } from '@/stores/languageStore'
import { useAuthStore } from '@/stores/authStore'
import { rolesMessages } from '@/i18n/messages/roles'
import { PERMISSIONS, ROLES } from '@/constants/permissions'
import { renderWithProviders } from '@/test/renderWithProviders'
import { settingsApi } from '../api/settingsApi'
import type { RoleDto } from '../types/settingsTypes'
import { RolesPermissionsPage } from './RolesPermissionsPage'

vi.mock('../api/settingsApi', () => ({ settingsApi: { getRoles: vi.fn() } }))

const t = rolesMessages.en
const roles: RoleDto[] = [
  { id: 'role-owner', name: ROLES.OWNER, description: null, permissions: [] },
  {
    id: 'role-teacher',
    name: ROLES.TEACHER,
    description: null,
    permissions: [PERMISSIONS.ATTENDANCE.MARK, PERMISSIONS.GROUPS.VIEW],
  },
]

const cell = (role: string, permission: string) => {
  const element = document.querySelector(`[data-role="${role}"][data-permission="${permission}"]`)
  if (!element) throw new Error(`cell ${role}/${permission} missing`)
  return element
}

describe('RolesPermissionsPage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('token', 'refresh', {
      id: 'user-1',
      fullName: 'Manager',
      phone: '+998901234567',
      roles: [],
      permissions: [PERMISSIONS.STAFF.VIEW],
      branchIds: [],
    })
    vi.mocked(settingsApi.getRoles).mockResolvedValue(roles)
  })

  it('renders granted and denied cells from the backend roles', async () => {
    renderWithProviders(<RolesPermissionsPage />)

    expect(await screen.findByRole('columnheader', { name: t.roleNames.Teacher })).toBeInTheDocument()
    expect(screen.getByText(t.modules.ATTENDANCE)).toBeInTheDocument()
    expect(screen.getAllByText(t.permissions[PERMISSIONS.ATTENDANCE.MARK]).length).toBeGreaterThan(0)

    expect(cell(ROLES.TEACHER, PERMISSIONS.ATTENDANCE.MARK)).toHaveAccessibleName(t.granted)
    expect(cell(ROLES.TEACHER, PERMISSIONS.FINANCE.REFUND)).toHaveAccessibleName(t.denied)
    // Owner — backend `CurrentUser.HasPermission` bo'yicha barcha ruxsatlarga ega.
    expect(cell(ROLES.OWNER, PERMISSIONS.FINANCE.REFUND)).toHaveAccessibleName(t.granted)
  })

  it('hides the matrix from users without staff.view', () => {
    useAuthStore.getState().setAuth('token', 'refresh', {
      id: 'user-2',
      fullName: 'Teacher',
      phone: '+998901234568',
      roles: [],
      permissions: [],
      branchIds: [],
    })
    renderWithProviders(<RolesPermissionsPage />)

    expect(screen.getByText(t.noAccess)).toBeInTheDocument()
    expect(settingsApi.getRoles).not.toHaveBeenCalled()
  })
})
