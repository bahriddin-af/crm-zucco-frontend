import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ROUTES } from '@/routes/paths'
import { PERMISSIONS, ROLES } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { navMessages } from '@/i18n/messages/nav'
import { layoutMessages } from '@/i18n/messages/layout'

const nav = navMessages.en

const signIn = (roles: string[], permissions: string[]) =>
  useAuthStore.getState().setAuth('header.payload.signature', 'refresh', {
    id: 'u1',
    fullName: 'Aziz Karimov',
    phone: '+998900000000',
    roles,
    permissions,
    branchIds: [],
  })

const renderSidebar = () =>
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  )

describe('Sidebar', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('shows only the sections the user has the view permission for', () => {
    signIn([ROLES.TEACHER], [PERMISSIONS.ATTENDANCE.VIEW, PERMISSIONS.STUDENTS.VIEW])
    renderSidebar()

    expect(screen.getByRole('link', { name: nav.overview })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: nav.students })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: nav.attendance })).toBeInTheDocument()

    for (const hidden of [nav.leads, nav.financeDesk, nav.payroll, nav.staff, nav.branches, nav.roles, nav.rewardMarket]) {
      expect(screen.queryByRole('link', { name: hidden })).not.toBeInTheDocument()
    }
    // Bo'sh qolgan bo'lim sarlavhasi ham ko'rsatilmaydi.
    expect(screen.queryByText(nav.incentiveSection)).not.toBeInTheDocument()
  })

  it('highlights only the most specific item (risk page is not also "Students")', () => {
    signIn([ROLES.OWNER], [])
    render(
      <MemoryRouter initialEntries={[ROUTES.STUDENTS.RISK]}>
        <Sidebar />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: nav.studentRisk })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: nav.students })).not.toHaveAttribute('aria-current')
  })

  it('keeps "Students" active on a student profile', () => {
    signIn([ROLES.OWNER], [])
    render(
      <MemoryRouter initialEntries={['/students/student-1']}>
        <Sidebar />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: nav.students })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: nav.studentRisk })).not.toHaveAttribute('aria-current')
  })

  it('hides the risk item without students.risk_view', () => {
    signIn([ROLES.TEACHER], [PERMISSIONS.STUDENTS.VIEW])
    renderSidebar()

    expect(screen.queryByRole('link', { name: nav.studentRisk })).not.toBeInTheDocument()
  })

  it('shows every item, including Branches, to an Owner and translates the role', () => {
    signIn([ROLES.OWNER], [])
    renderSidebar()

    expect(screen.getByRole('link', { name: nav.branches })).toHaveAttribute('href', ROUTES.BRANCHES)
    expect(screen.getByRole('link', { name: nav.leads })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: nav.roles })).toBeInTheDocument()
    expect(screen.getByText(layoutMessages.en.roles.Owner)).toBeInTheDocument()
  })
})
