import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useLanguageStore } from '@/stores/languageStore'
import { uiMessages } from '@/i18n/messages/ui'
import { commonMessages } from '@/i18n/messages/common'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('confirms only through the confirm button', async () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(<ConfirmDialog isOpen onClose={onClose} onConfirm={onConfirm} description="Delete student?" />)

    expect(screen.getByText('Delete student?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: commonMessages.en.cancel }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: uiMessages.en.confirmDelete }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('uses the neutral confirm label for non-destructive actions and renders nothing when closed', () => {
    const { rerender } = render(
      <ConfirmDialog isOpen variant="primary" onClose={vi.fn()} onConfirm={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: uiMessages.en.confirmAction })).toBeInTheDocument()

    rerender(<ConfirmDialog isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('disables cancel while the action is running', () => {
    render(<ConfirmDialog isOpen isLoading onClose={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByRole('button', { name: commonMessages.en.cancel })).toBeDisabled()
  })
})
