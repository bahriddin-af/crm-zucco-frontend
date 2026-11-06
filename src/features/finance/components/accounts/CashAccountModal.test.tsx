import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CashAccountModal } from './CashAccountModal'
import { financeApi } from '../../api/financeApi'
import { CASH_ACCOUNT_TYPE, type CashAccount } from '../../types/financeTypes'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { useLanguageStore } from '@/stores/languageStore'
import { financeMessages } from '@/i18n/messages/finance'
import { commonMessages } from '@/i18n/messages/common'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../../api/financeApi', () => ({
  financeApi: { upsertCashAccount: vi.fn() },
}))

vi.mock('@/features/branches/hooks/useBranches', () => ({
  useBranchOptions: vi.fn(),
}))

const text = financeMessages.en.accountForm
const common = commonMessages.en

const account: CashAccount = {
  id: 'account-1',
  name: 'Main desk',
  type: CASH_ACCOUNT_TYPE.Cash,
  branchId: null,
  balance: 1200000,
  isDefault: true,
}

describe('CashAccountModal', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(financeApi.upsertCashAccount).mockReset().mockResolvedValue(account)
    vi.mocked(useBranchOptions).mockReturnValue({
      data: [{ id: 'branch-1', name: 'Chilonzor' }],
    } as unknown as ReturnType<typeof useBranchOptions>)
  })

  it('requires a non-blank name', async () => {
    renderWithProviders(<CashAccountModal account={null} onClose={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(new RegExp(text.name)), '   ')
    await userEvent.click(screen.getByRole('button', { name: common.save }))

    expect(await screen.findByText(text.nameRequired)).toBeInTheDocument()
    expect(financeApi.upsertCashAccount).not.toHaveBeenCalled()
  })

  it('creates an account with a numeric type and optional branch', async () => {
    const onClose = vi.fn()
    renderWithProviders(<CashAccountModal account={null} onClose={onClose} />)

    await userEvent.type(screen.getByLabelText(new RegExp(text.name)), '  Payme  ')
    await userEvent.selectOptions(screen.getByLabelText(new RegExp(text.type)), String(CASH_ACCOUNT_TYPE.OnlineAggregator))
    await userEvent.selectOptions(screen.getByLabelText(text.branch), 'branch-1')
    await userEvent.click(screen.getByRole('button', { name: common.save }))

    await waitFor(() =>
      expect(financeApi.upsertCashAccount).toHaveBeenCalledWith({
        id: null,
        name: 'Payme',
        type: CASH_ACCOUNT_TYPE.OnlineAggregator,
        branchId: 'branch-1',
        isDefault: false,
      })
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('edits an existing account and keeps it shared across branches', async () => {
    renderWithProviders(<CashAccountModal account={account} onClose={vi.fn()} />)

    expect(screen.getByLabelText(new RegExp(text.name))).toHaveValue('Main desk')
    await userEvent.click(screen.getByRole('button', { name: common.save }))

    await waitFor(() =>
      expect(financeApi.upsertCashAccount).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'account-1', branchId: null, isDefault: true })
      )
    )
  })
})
