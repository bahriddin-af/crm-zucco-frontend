import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StaffPasswordResetModal } from './StaffPasswordResetModal'
import { StaffTable } from './StaffTable'
import { staffApi } from '../api/staffApi'
import { MIN_PASSWORD_LENGTH, STAFF_ROLE_TYPE, USER_STATUS, type StaffListItem } from '../types/staffTypes'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { staffMessages } from '@/i18n/messages/staff'
import { settingsMessages } from '@/i18n/messages/settings'
import { errorsMessages } from '@/i18n/messages/errors'
import { getApiErrorMessage } from '@/utils/apiError'
import { createApiError, renderWithProviders } from '@/test/renderWithProviders'
import { HTTP_STATUS } from '@/constants/http'

vi.mock('../api/staffApi', () => ({
  staffApi: { resetPassword: vi.fn() },
}))

const text = staffMessages.en
const settings = settingsMessages.en
const CURRENT_USER_ID = 'user-1'
const NEW_PASSWORD = 'NewSecurePass123'

const member: StaffListItem = {
  id: 'user-2',
  fullName: 'Dilnoza Rahimova',
  phone: '+998901112233',
  status: USER_STATUS.Active,
  roleType: STAFF_ROLE_TYPE.Teacher,
  roles: ['Teacher'],
}

describe('Staff password reset', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('a.b.c', 'refresh', {
      id: CURRENT_USER_ID,
      fullName: 'Admin',
      phone: '+998900000000',
      roles: [],
      permissions: [PERMISSIONS.STAFF.VIEW, PERMISSIONS.STAFF.PASSWORD_RESET],
      branchIds: [],
    })
    vi.mocked(staffApi.resetPassword).mockReset().mockResolvedValue({ success: true, code: 'staff_password_reset', data: null })
  })

  it('validates length and confirmation before calling the API', async () => {
    renderWithProviders(<StaffPasswordResetModal staff={member} onClose={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(new RegExp(settings.newPassword)), 'short')
    await userEvent.type(screen.getByLabelText(new RegExp(settings.confirmPassword)), 'other')
    await userEvent.click(screen.getByRole('button', { name: text.resetPassword.submit }))

    expect(await screen.findByText(text.passwordMin.replace('{min}', String(MIN_PASSWORD_LENGTH)))).toBeInTheDocument()
    expect(screen.getByText(settings.validation.mismatch)).toBeInTheDocument()
    expect(staffApi.resetPassword).not.toHaveBeenCalled()
  })

  it('sends only the new password for the selected staff member', async () => {
    const onClose = vi.fn()
    renderWithProviders(<StaffPasswordResetModal staff={member} onClose={onClose} />)

    await userEvent.type(screen.getByLabelText(new RegExp(settings.newPassword)), NEW_PASSWORD)
    await userEvent.type(screen.getByLabelText(new RegExp(settings.confirmPassword)), NEW_PASSWORD)
    await userEvent.click(screen.getByRole('button', { name: text.resetPassword.submit }))

    await waitFor(() => expect(staffApi.resetPassword).toHaveBeenCalledWith({ staffId: member.id, newPassword: NEW_PASSWORD }))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('offers reset for other staff but not for the signed-in user', () => {
    const self: StaffListItem = { ...member, id: CURRENT_USER_ID, fullName: 'Admin' }
    renderWithProviders(<StaffTable staff={[member, self]} onEdit={vi.fn()} onDelete={vi.fn()} onResetPassword={vi.fn()} />)

    expect(screen.getAllByRole('button', { name: text.resetPassword.action })).toHaveLength(1)
  })

  it.each(['self_password_reset_not_allowed', 'protected_account', 'user_not_found'] as const)(
    'maps %s to its own localized message',
    (code) => {
      expect(getApiErrorMessage(createApiError(HTTP_STATUS.FORBIDDEN, code))).toBe(errorsMessages.en[code])
    }
  )
})
