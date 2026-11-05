import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageMenu } from '@/components/common/LanguageMenu'
import { useLanguageStore } from '@/stores/languageStore'
import { layoutMessages } from '@/i18n/messages/layout'

describe('LanguageMenu', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('opens the list, switches the language and closes', async () => {
    render(<LanguageMenu />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.selectLanguage }))
    expect(screen.getAllByRole('option')).toHaveLength(4)

    await userEvent.click(screen.getByRole('button', { name: /РУС/ }))
    expect(useLanguageStore.getState().language).toBe('ru')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByText(`${layoutMessages.ru.languageLabel}:`)).toBeInTheDocument()
  })

  it('closes on Escape and on outside click', async () => {
    render(
      <div>
        <LanguageMenu />
        <span>outside</span>
      </div>
    )
    const trigger = screen.getByRole('button', { name: layoutMessages.en.selectLanguage })

    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    await userEvent.click(trigger)
    await userEvent.click(screen.getByText('outside'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
