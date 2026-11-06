import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'
import { getTranslations } from '@/i18n'
import { useLanguageStore } from '@/stores/languageStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { financeApi } from '../api/financeApi'
import { PAYMENT_METHOD, PAYMENT_STATUS, type PaymentResponse } from '../types/financeTypes'
import { PaymentDrawer } from './PaymentDrawer'

vi.mock('../api/financeApi', () => ({
  financeApi: {
    getCashAccounts: vi.fn(),
    recordPayment: vi.fn(),
  },
}))

const STUDENT = { id: 'student-1', fullName: 'Ali Valiyev', phone: '+998901112233' }

vi.mock('@/features/students/hooks/useStudents', () => ({
  useStudentsList: () => ({ data: { items: [STUDENT] }, isLoading: false }),
  useStudentDetail: (id: string) => ({
    data: id ? { ...STUDENT, enrolledGroups: [] } : undefined,
  }),
}))

const t = getTranslations('en')
const mockedApi = vi.mocked(financeApi)

const PAYMENT: PaymentResponse = {
  id: 'payment-1',
  studentId: STUDENT.id,
  studentName: STUDENT.fullName,
  cashAccountId: 'account-1',
  cashAccountName: 'Main cash',
  amount: 500000,
  paymentMethod: PAYMENT_METHOD.Cash,
  receiptNumber: 'RCP-1',
  paymentDate: '2026-11-05T10:00:00Z',
  studentBalanceAfter: 0,
  status: PAYMENT_STATUS.Completed,
}

function renderDrawer(onClose = vi.fn()) {
  renderWithProviders(<PaymentDrawer isOpen onClose={onClose} />)
  return { onClose }
}

async function fillAndSubmit() {
  const user = userEvent.setup()
  await waitFor(() => expect(screen.getByLabelText(/^Cash account/)).toHaveValue('account-1'))
  await user.selectOptions(screen.getByLabelText(/^Student/), STUDENT.id)
  await user.type(screen.getByLabelText(/^Payment amount/), '500000')
  await user.click(screen.getByRole('button', { name: t.finance.drawer.submit }))
  return user
}

describe('PaymentDrawer', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    mockedApi.getCashAccounts.mockResolvedValue([
      { id: 'account-1', name: 'Main cash', type: 1, balance: 1000000, isDefault: true },
    ])
    mockedApi.recordPayment.mockReset()
  })

  it('blocks submission while the form is invalid', async () => {
    renderDrawer()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: t.finance.drawer.submit }))

    expect(await screen.findByText(t.finance.validation.studentRequired, { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText(t.finance.validation.amountRequired, { selector: 'p' })).toBeInTheDocument()
    expect(screen.queryByText(t.finance.drawer.confirmTitle)).not.toBeInTheDocument()
    expect(mockedApi.recordPayment).not.toHaveBeenCalled()
  })

  it('records the payment once with an operationId after confirmation', async () => {
    mockedApi.recordPayment.mockResolvedValue(PAYMENT)
    const { onClose } = renderDrawer()

    const user = await fillAndSubmit()
    expect(await screen.findByText(t.finance.drawer.confirmTitle)).toBeInTheDocument()
    expect(mockedApi.recordPayment).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: t.ui.confirmAction }))

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    expect(mockedApi.recordPayment).toHaveBeenCalledTimes(1)
    expect(mockedApi.recordPayment.mock.calls[0][0]).toEqual({
      studentId: STUDENT.id,
      cashAccountId: 'account-1',
      amount: 500000,
      paymentMethod: PAYMENT_METHOD.Cash,
      groupId: null,
      billingPeriod: expect.stringMatching(/^\d{4}-\d{2}$/),
      comment: null,
      operationId: expect.stringMatching(/^[0-9a-f-]{36}$/),
    })
  })

  it('reuses the same operationId when retrying after a network error', async () => {
    mockedApi.recordPayment
      .mockRejectedValueOnce(new AxiosError('Network Error', AxiosError.ERR_NETWORK))
      .mockResolvedValueOnce(PAYMENT)
    const { onClose } = renderDrawer()

    const user = await fillAndSubmit()
    await user.click(await screen.findByRole('button', { name: t.ui.confirmAction }))
    await waitFor(() => expect(mockedApi.recordPayment).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.queryByText(t.finance.drawer.confirmTitle)).not.toBeInTheDocument())
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: t.finance.drawer.submit }))
    await user.click(await screen.findByRole('button', { name: t.ui.confirmAction }))

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    const [first, second] = mockedApi.recordPayment.mock.calls.map(([payload]) => payload)
    expect(second.operationId).toBe(first.operationId)
    expect(second).toEqual(first)
  })
})
