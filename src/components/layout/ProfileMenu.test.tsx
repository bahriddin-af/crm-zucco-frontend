import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { renderWithProviders } from '@/test/renderWithProviders'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { layoutMessages } from '@/i18n/messages/layout'
import { staffMessages } from '@/i18n/messages/staff'

const logoutMutate = vi.fn()

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useLogout: () => ({ mutate: logoutMutate, isPending: false }),
}))

vi.mock('@/features/settings/hooks/useSettings', () => ({
  useCurrentProfile: () => ({
    data: {
      userId: 'u1',
      fullName: 'Bexbudiyev Asilbek',
      phone: '+998901234567',
      email: null,
      tenantId: 't1',
      branchId: 'b1',
      roleType: 1,
      roles: ['Owner'],
      permissions: [],
    },
  }),
}))

vi.mock('@/features/branches/hooks/useBranches', () => ({
  useBranchOptions: () => ({ data: [{ id: 'b1', name: 'Bosh Filial (Chilonzor)' }] }),
}))

describe('ProfileMenu', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('token', 'refresh', {
      id: 'u1',
      fullName: 'Bexbudiyev Asilbek',
      phone: '+998901234567',
      roles: ['Owner'],
      permissions: [],
      branchIds: ['b1'],
    })
    logoutMutate.mockClear()
  })

  it('shows the profile details on click and signs out from the panel', async () => {
    renderWithProviders(<ProfileMenu />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.profileLabel }))

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveTextContent('Bexbudiyev Asilbek')
    expect(panel).toHaveTextContent(staffMessages.en.roleTypes[1])
    expect(panel).toHaveTextContent('+998 (90) 123-45-67')
    expect(panel).toHaveTextContent('Bosh Filial (Chilonzor)')
    expect(panel).not.toHaveTextContent(layoutMessages.en.emailLabel)

    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.signOut }))
    expect(logoutMutate).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape', async () => {
    renderWithProviders(<ProfileMenu />)
    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.profileLabel }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
