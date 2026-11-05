import { render, screen } from '@testing-library/react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS, ROLES } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'

const signIn = (roles: string[], permissions: string[]) =>
  useAuthStore.getState().setAuth('token', 'refresh', {
    id: 'u1',
    fullName: 'User',
    phone: '+998900000000',
    roles,
    permissions,
    branchIds: [],
  })

const renderGuarded = () =>
  render(
    <PermissionGuard permission={PERMISSIONS.FINANCE.PAYMENT_CREATE} fallback={<span>denied</span>}>
      <button type="button">pay</button>
    </PermissionGuard>
  )

describe('PermissionGuard', () => {
  it('renders children when the permission is granted', () => {
    signIn([ROLES.CASHIER], [PERMISSIONS.FINANCE.PAYMENT_CREATE])
    renderGuarded()
    expect(screen.getByRole('button', { name: 'pay' })).toBeInTheDocument()
  })

  it('renders the fallback when the permission is missing', () => {
    signIn([ROLES.TEACHER], [PERMISSIONS.ATTENDANCE.MARK])
    renderGuarded()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('denied')).toBeInTheDocument()
  })

  it.each([ROLES.OWNER, ROLES.SUPER_ADMIN])('grants everything to %s like the backend', (role) => {
    signIn([role], [])
    renderGuarded()
    expect(screen.getByRole('button', { name: 'pay' })).toBeInTheDocument()
  })

  it('hides children when signed out', () => {
    useAuthStore.getState().logout()
    renderGuarded()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
