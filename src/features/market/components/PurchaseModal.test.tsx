import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { validate as isUuid } from 'uuid'
import { useLanguageStore } from '@/stores/languageStore'
import { interpolate } from '@/i18n'
import { formatCoins } from '@/utils/formatters'
import { marketMessages } from '@/i18n/messages/market'
import { coinsMessages } from '@/i18n/messages/coins'
import { createNetworkError, renderWithProviders } from '@/test/renderWithProviders'
import { marketApi } from '../api/marketApi'
import type { MarketItem, MarketOrder } from '../types/marketTypes'
import { PurchaseModal } from './PurchaseModal'

vi.mock('../api/marketApi', () => ({ marketApi: { purchase: vi.fn() } }))
vi.mock('@/features/students/hooks/useStudents', () => ({
  useStudentsList: () => ({
    isLoading: false,
    data: { items: [{ id: 'student-1', fullName: 'Ali Valiyev', coinsBalance: 300 }] },
  }),
}))

const t = marketMessages.en
const item: MarketItem = {
  id: 'item-1',
  name: 'Hoodie',
  description: null,
  priceInCoins: 150,
  stockQuantity: 3,
  imageUrl: null,
  isActive: true,
}
const order = { id: 'order-1' } as MarketOrder
const purchase = vi.mocked(marketApi.purchase)

const confirmButton = () => screen.getAllByRole('button', { name: t.purchase }).at(-1)

describe('PurchaseModal', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    purchase.mockReset()
  })

  it('requires a student before asking for confirmation', async () => {
    renderWithProviders(<PurchaseModal item={item} onClose={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: t.purchase }))

    expect(await screen.findByText(coinsMessages.en.validation.studentRequired)).toBeInTheDocument()
    expect(purchase).not.toHaveBeenCalled()
  })

  it('spends coins only after confirmation and retries with the same operationId', async () => {
    const onClose = vi.fn()
    purchase.mockRejectedValueOnce(createNetworkError()).mockResolvedValueOnce(order)
    renderWithProviders(<PurchaseModal item={item} onClose={onClose} />)

    await userEvent.selectOptions(screen.getByLabelText(coinsMessages.en.picker.label), 'student-1')
    await userEvent.click(screen.getByRole('button', { name: t.purchase }))

    expect(
      await screen.findByText(interpolate(t.purchaseConfirm, { student: 'Ali Valiyev', item: item.name, price: formatCoins(150) }))
    ).toBeInTheDocument()
    expect(purchase).not.toHaveBeenCalled()

    const button = confirmButton()
    if (!button) throw new Error('confirm button missing')
    await userEvent.click(button)
    await waitFor(() => expect(purchase).toHaveBeenCalledTimes(1))
    expect(onClose).not.toHaveBeenCalled()

    // Tarmoq xatosidan keyin foydalanuvchi qayta urinadi — kalit o'zgarmasligi shart.
    await userEvent.click(screen.getByRole('button', { name: t.purchase }))
    const retryButton = confirmButton()
    if (!retryButton) throw new Error('confirm button missing')
    await userEvent.click(retryButton)
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    const [first, second] = purchase.mock.calls.map(([payload]) => payload)
    expect(first).toEqual({ studentId: 'student-1', marketItemId: 'item-1', operationId: expect.any(String) })
    expect(isUuid(first?.operationId ?? '')).toBe(true)
    expect(second?.operationId).toBe(first?.operationId)
  })
})
