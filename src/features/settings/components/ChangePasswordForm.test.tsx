import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useLanguageStore } from '@/stores/languageStore'
import { useAuthStore } from '@/stores/authStore'
import { settingsMessages } from '@/i18n/messages/settings'
import { interpolate } from '@/i18n'
import { ROUTES } from '@/routes/paths'
import { HTTP_STATUS } from '@/constants/http'
import { createApiError, renderWithProviders } from '@/test/renderWithProviders'
import { settingsApi } from '../api/settingsApi'
import { PASSWORD_MIN_LENGTH } from '../types/settingsTypes'
import { ChangePasswordForm } from './ChangePasswordForm'

vi.mock('../api/settingsApi', () => ({ settingsApi: { changePassword: vi.fn() } }))

const t = settingsMessages.en
const changePassword = vi.mocked(settingsApi.changePassword)
const SETTINGS_ROUTE = '/settings'
const NEW_PASSWORD = 'NewSecurePass123'

const renderForm = () =>
  renderWithProviders(
    <Routes>
      <Route path={SETTINGS_ROUTE} element={<ChangePasswordForm />} />
      <Route path={ROUTES.AUTH.LOGIN} element={<div data-testid="login-route" />} />
    </Routes>,
    { route: SETTINGS_ROUTE }
  )

const fill = async (current: string, next: string, confirm: string) => {
  if (current) await userEvent.type(screen.getByLabelText(t.currentPassword), current)
  if (next) await userEvent.type(screen.getByLabelText(t.newPassword), next)
  if (confirm) await userEvent.type(screen.getByLabelText(t.confirmPassword), confirm)
  await userEvent.click(screen.getByRole('button', { name: t.changePassword }))
}

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('token', 'refresh', {
      id: 'user-1',
      fullName: 'Owner',
      phone: '+998901234567',
      roles: [],
      permissions: [],
      branchIds: [],
    })
    changePassword.mockReset()
  })

  it('mirrors the backend password policy and requires a matching confirmation', async () => {
    renderForm()
    await fill('', 'short', 'other')

    expect(await screen.findByText(t.validation.currentRequired)).toBeInTheDocument()
    expect(screen.getByText(interpolate(t.validation.newMin, { min: PASSWORD_MIN_LENGTH }))).toBeInTheDocument()
    expect(screen.getByText(t.validation.mismatch)).toBeInTheDocument()
    expect(changePassword).not.toHaveBeenCalled()
  })

  it('shows a wrong current password on the field and keeps the session', async () => {
    changePassword.mockRejectedValueOnce(createApiError(HTTP_STATUS.UNAUTHORIZED, 'invalid_credentials'))
    renderForm()
    await fill('wrong-password', NEW_PASSWORD, NEW_PASSWORD)

    expect(await screen.findByText(t.currentPasswordWrong)).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('logs the user out and redirects to login after the password is changed', async () => {
    changePassword.mockResolvedValueOnce({ success: true, code: 'password_changed_successfully', data: undefined })
    renderForm()
    await fill('current-password', NEW_PASSWORD, NEW_PASSWORD)

    await waitFor(() => expect(screen.getByTestId('login-route')).toBeInTheDocument())
    expect(changePassword).toHaveBeenCalledWith({ currentPassword: 'current-password', newPassword: NEW_PASSWORD })
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
  })
})
