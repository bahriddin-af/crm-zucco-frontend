import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { validate as isUuid } from 'uuid'
import { useLanguageStore } from '@/stores/languageStore'
import { coinsMessages } from '@/i18n/messages/coins'
import { OPERATION_CONFLICT_CODE } from '@/utils/apiError'
import { HTTP_STATUS } from '@/constants/http'
import { createApiError, createNetworkError, renderWithProviders } from '@/test/renderWithProviders'
import { marketApi } from '../api/marketApi'
import { COIN_REASON, type CoinTransaction } from '../types/marketTypes'
import { IssueCoinsModal } from './IssueCoinsModal'

vi.mock('../api/marketApi', () => ({ marketApi: { issueCoins: vi.fn() } }))
vi.mock('@/features/students/hooks/useStudents', () => ({
  useStudentsList: () => ({
    isLoading: false,
    data: { items: [{ id: 'student-1', fullName: 'Ali Valiyev', coinsBalance: 40 }] },
  }),
}))

const t = coinsMessages.en
const issueCoins = vi.mocked(marketApi.issueCoins)
const transaction = { id: 'tx-1' } as CoinTransaction

const submitAndConfirm = async () => {
  await userEvent.click(screen.getByRole('button', { name: t.issue }))
  const confirm = (await screen.findAllByRole('button', { name: t.issue })).at(-1)
  if (!confirm) throw new Error('confirm button missing')
  await userEvent.click(confirm)
}

const fillForm = async (amount: string) => {
  await userEvent.selectOptions(screen.getByLabelText(t.picker.label), 'student-1')
  await userEvent.type(screen.getByLabelText(t.amount), amount)
}

describe('IssueCoinsModal', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    issueCoins.mockReset()
  })

  it('rejects a zero amount without calling the API', async () => {
    renderWithProviders(<IssueCoinsModal onClose={vi.fn()} />)
    await fillForm('0')
    await userEvent.click(screen.getByRole('button', { name: t.issue }))

    expect(await screen.findByText(t.validation.amountNonZero)).toBeInTheDocument()
    expect(issueCoins).not.toHaveBeenCalled()
  })

  it('keeps one operationId across a network retry and renews it after a payload conflict', async () => {
    const onClose = vi.fn()
    issueCoins
      .mockRejectedValueOnce(createNetworkError())
      .mockRejectedValueOnce(createApiError(HTTP_STATUS.CONFLICT, OPERATION_CONFLICT_CODE))
      .mockResolvedValueOnce(transaction)
    renderWithProviders(<IssueCoinsModal onClose={onClose} />)
    await fillForm('-5')

    await submitAndConfirm()
    await waitFor(() => expect(issueCoins).toHaveBeenCalledTimes(1))
    await submitAndConfirm()
    await waitFor(() => expect(issueCoins).toHaveBeenCalledTimes(2))
    await submitAndConfirm()
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    const ids = issueCoins.mock.calls.map(([payload]) => payload.operationId)
    expect(issueCoins.mock.calls[0]?.[0]).toEqual({
      studentId: 'student-1',
      amount: -5,
      reason: COIN_REASON.ManualAdjustment,
      description: null,
      operationId: ids[0],
    })
    expect(ids.every((id) => isUuid(id))).toBe(true)
    expect(ids[1]).toBe(ids[0])
    expect(ids[2]).not.toBe(ids[1])
  })
})
