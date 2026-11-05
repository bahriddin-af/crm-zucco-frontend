import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useLanguageStore } from '@/stores/languageStore'

const FORM_TITLE = 'Form modal'
const CONFIRM_TEXT = 'Are you sure?'

function StackedModals({ onFormClose }: { onFormClose: () => void }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(true)
  return (
    <>
      <Modal isOpen onClose={onFormClose} title={FORM_TITLE}>
        <p>form body</p>
      </Modal>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={vi.fn()}
        description={CONFIRM_TEXT}
      />
    </>
  )
}

describe('Modal', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('closes a single open modal on Escape', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title={FORM_TITLE}>
        <p>body</p>
      </Modal>
    )

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes only the top-most modal when modals are stacked', async () => {
    const onFormClose = vi.fn()
    render(<StackedModals onFormClose={onFormClose} />)
    expect(screen.getByText(CONFIRM_TEXT)).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByText(CONFIRM_TEXT)).not.toBeInTheDocument()
    expect(screen.getByText(FORM_TITLE)).toBeInTheDocument()
    expect(onFormClose).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')

    expect(onFormClose).toHaveBeenCalledTimes(1)
  })
})
