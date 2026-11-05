import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { AxiosError, AxiosHeaders } from 'axios'
import { LoginPage } from './LoginPage'
import { authApi } from '../api/authApi'
import type { AuthTokenResponse } from '../types/authTypes'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { authMessages } from '@/i18n/messages/auth'
import { errorsMessages } from '@/i18n/messages/errors'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/authApi', () => ({
  authApi: { login: vi.fn(), logout: vi.fn(), getMe: vi.fn() },
}))

const tokenResponse: AuthTokenResponse = {
  accessToken: 'header.payload.signature',
  expiresIn: 900,
  tokenType: 'Bearer',
  userId: 'user-1',
  fullName: 'Zulfiya Rahimova',
  tenantId: 'tenant-1',
  branchId: 'branch-1',
  roleType: 5,
  roles: ['Cashier'],
  permissions: ['finance.view', 'finance.payment_create'],
  refreshToken: 'refresh-1',
  refreshExpiresAt: '2026-12-01T00:00:00Z',
}

const apiError = (status: number, code: string) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { success: false, code },
  })

const renderLogin = () => {
  renderWithProviders(
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.OVERVIEW} element={<div>overview-page</div>} />
    </Routes>,
    { route: ROUTES.AUTH.LOGIN }
  )
}

const fillAndSubmit = async (phone: string, password: string) => {
  await userEvent.type(screen.getByLabelText(authMessages.en.phone), phone)
  await userEvent.type(screen.getByLabelText(authMessages.en.password), password)
  await userEvent.click(screen.getByRole('button', { name: authMessages.en.loginButton }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().logout()
    vi.mocked(authApi.login).mockReset()
  })

  it('maps the token response to the session and redirects', async () => {
    vi.mocked(authApi.login).mockResolvedValue(tokenResponse)
    renderLogin()

    await fillAndSubmit('+998 (90) 123-45-67', 'secret-password')

    await waitFor(() =>
      expect(authApi.login).toHaveBeenCalledWith({
        phone: '+998901234567',
        password: 'secret-password',
        tenantId: null,
      })
    )
    expect(await screen.findByText('overview-page')).toBeInTheDocument()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe(tokenResponse.accessToken)
    expect(state.refreshToken).toBe(tokenResponse.refreshToken)
    expect(state.activeBranchId).toBe('branch-1')
    expect(state.user).toEqual({
      id: 'user-1',
      fullName: 'Zulfiya Rahimova',
      phone: '+998901234567',
      roles: ['Cashier'],
      permissions: ['finance.view', 'finance.payment_create'],
      branchIds: ['branch-1'],
    })
  })

  it('shows the translated error on invalid_credentials and keeps the user signed out', async () => {
    vi.mocked(authApi.login).mockRejectedValue(apiError(401, 'invalid_credentials'))
    renderLogin()

    await fillAndSubmit('+998901234567', 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent(errorsMessages.en.invalid_credentials)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('asks for the tenant id when the phone belongs to several centers and resubmits with it', async () => {
    vi.mocked(authApi.login)
      .mockRejectedValueOnce(apiError(409, 'tenant_selection_required'))
      .mockResolvedValueOnce(tokenResponse)
    renderLogin()

    await fillAndSubmit('+998901234567', 'secret-password')
    const tenantInput = await screen.findByLabelText(authMessages.en.tenantId)

    const tenantId = '3f2504e0-4f89-11d3-9a0c-0305e82c3301'
    await userEvent.type(tenantInput, tenantId)
    await userEvent.click(screen.getByRole('button', { name: authMessages.en.loginButton }))

    await waitFor(() =>
      expect(authApi.login).toHaveBeenLastCalledWith({ phone: '+998901234567', password: 'secret-password', tenantId })
    )
  })
})
