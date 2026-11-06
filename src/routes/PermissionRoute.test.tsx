import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PermissionRoute } from './PermissionRoute'
import { ROUTE_PERMISSIONS } from './routePermissions'
import { ROUTES } from './paths'
import { PERMISSIONS, ROLES } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { uiMessages } from '@/i18n/messages/ui'

const ui = uiMessages.en

const signIn = (roles: string[], permissions: string[]) =>
  useAuthStore.getState().setAuth('header.payload.signature', 'refresh', {
    id: 'u1',
    fullName: 'User',
    phone: '+998900000000',
    roles,
    permissions,
    branchIds: [],
  })

const renderAt = (path: string, url: string = path) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path={path}
          element={
            <PermissionRoute path={path}>
              <span>page content</span>
            </PermissionRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('PermissionRoute', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('shows the access denied page when the URL is opened without the permission', () => {
    signIn([ROLES.TEACHER], [PERMISSIONS.ATTENDANCE.VIEW])
    renderAt(ROUTES.FINANCE.PAYROLL)

    expect(screen.queryByText('page content')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: ui.accessDeniedTitle })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: ui.accessDeniedBack })).toHaveAttribute('href', ROUTES.OVERVIEW)
  })

  it('renders the page when the user has the route permission', () => {
    signIn([ROLES.ADMINISTRATOR], [PERMISSIONS.NOTIFICATIONS.VIEW])
    renderAt(ROUTES.NOTIFICATIONS.SMS)

    expect(screen.getByText('page content')).toBeInTheDocument()
  })

  it('guards parameterised routes such as the student profile', () => {
    signIn([ROLES.CASHIER], [PERMISSIONS.FINANCE.VIEW])
    renderAt(ROUTES.STUDENTS.DETAIL, '/students/42')

    expect(screen.getByRole('heading', { name: ui.accessDeniedTitle })).toBeInTheDocument()
  })

  it('leaves routes without a configured permission open to any signed-in user', () => {
    signIn([ROLES.TEACHER], [])
    renderAt(ROUTES.SETTINGS)

    expect(screen.getByText('page content')).toBeInTheDocument()
  })

  it.each([ROLES.OWNER, ROLES.SUPER_ADMIN])('lets %s open every guarded route', (role) => {
    signIn([role], [])
    for (const path of Object.keys(ROUTE_PERMISSIONS)) {
      const { unmount } = renderAt(path, path.replace(':id', '1'))
      expect(screen.getByText('page content')).toBeInTheDocument()
      unmount()
    }
  })
})
