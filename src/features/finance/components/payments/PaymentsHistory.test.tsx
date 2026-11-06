import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaymentsHistory } from './PaymentsHistory'
import { financeApi } from '../../api/financeApi'
import { PAYMENT_METHOD, PAYMENT_STATUS, type PaymentResponse } from '../../types/financeTypes'
import { PERMISSIONS, type Permission } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { financeMessages } from '@/i18n/messages/finance'
import { errorsMessages } from '@/i18n/messages/errors'
import { getApiErrorMessage } from '@/utils/apiError'
import { createApiError, renderWithProviders } from '@/test/renderWithProviders'
import { HTTP_STATUS } from '@/constants/http'

vi.mock('../../api/financeApi', () => ({
  financeApi: { getPayments: vi.fn(), voidPayment: vi.fn() },
}))

const text = financeMessages.en
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const basePayment: PaymentResponse = {
  id: 'payment-1',
  studentId: 'student-1',
  studentName: 'Ali Valiyev',
  cashAccountId: 'account-1',
  cashAccountName: 'Main cash',
  amount: 500000,
  paymentMethod: PAYMENT_METHOD.Cash,
  receiptNumber: 'RCP-1',
  paymentDate: '2026-11-05T10:00:00Z',
  studentBalanceAfter: 0,
  status: PAYMENT_STATUS.Completed,
}
const voidedPayment: PaymentResponse = { ...basePayment, id: 'payment-2', receiptNumber: 'RCP-2', status: PAYMENT_STATUS.Voided }

function signIn(permissions: Permission[]) {
  useAuthStore.getState().setAuth('a.b.c', 'refresh', {
    id: 'user-1',
    fullName: 'Cashier',
    phone: '+998900000000',
    roles: [],
    permissions,
    branchIds: [],
  })
}

describe('PaymentsHistory void flow', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    signIn([PERMISSIONS.FINANCE.VIEW, PERMISSIONS.FINANCE.REFUND])
    vi.mocked(financeApi.getPayments).mockReset().mockResolvedValue({
      items: [basePayment, voidedPayment],
      totalCount: 2,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    })
    vi.mocked(financeApi.voidPayment).mockReset().mockResolvedValue({
      id: 'void-1',
      paymentId: basePayment.id,
      amount: basePayment.amount,
      reason: 'Wrong student',
      voidedAt: '2026-11-06T10:00:00Z',
      studentBalanceAfter: -500000,
      cashAccountBalanceAfter: 0,
    })
  })

  it('marks voided payments and offers voiding only for completed ones', async () => {
    renderWithProviders(<PaymentsHistory />)

    expect(await screen.findByText(text.paymentStatuses[PAYMENT_STATUS.Voided])).toBeInTheDocument()
    expect(screen.getByText(text.paymentStatuses[PAYMENT_STATUS.Completed])).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: text.voidPayment.action })).toHaveLength(1)
  })

  it('hides the void action without finance.refund', async () => {
    signIn([PERMISSIONS.FINANCE.VIEW])
    renderWithProviders(<PaymentsHistory />)

    await screen.findByText('RCP-1')
    expect(screen.queryByRole('button', { name: text.voidPayment.action })).not.toBeInTheDocument()
  })

  it('requires a reason, confirms, then sends the trimmed reason with a UUID operationId', async () => {
    renderWithProviders(<PaymentsHistory />)
    await userEvent.click(await screen.findByRole('button', { name: text.voidPayment.action }))

    await userEvent.click(screen.getByRole('button', { name: text.voidPayment.submit }))
    expect(await screen.findByText(text.voidPayment.reasonRequired)).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(new RegExp(text.voidPayment.reason)), '  Wrong student  ')
    await userEvent.click(screen.getByRole('button', { name: text.voidPayment.submit }))
    expect(financeApi.voidPayment).not.toHaveBeenCalled()

    expect(await screen.findByText(text.voidPayment.confirmTitle)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: text.voidPayment.confirm }))

    await waitFor(() => expect(financeApi.voidPayment).toHaveBeenCalledTimes(1))
    const payload = vi.mocked(financeApi.voidPayment).mock.calls[0][0]
    expect(payload).toMatchObject({ paymentId: basePayment.id, reason: 'Wrong student' })
    expect(payload.operationId).toMatch(UUID_PATTERN)
  })

  it.each(['payment_not_found', 'payment_already_voided', 'insufficient_cash_balance'] as const)(
    'maps %s to its own localized message',
    (code) => {
      expect(getApiErrorMessage(createApiError(HTTP_STATUS.CONFLICT, code))).toBe(errorsMessages.en[code])
    }
  )
})
