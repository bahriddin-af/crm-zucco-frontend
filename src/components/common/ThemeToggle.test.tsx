import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { THEMES, useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { layoutMessages } from '@/i18n/messages/layout'

describe('ThemeToggle', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useThemeStore.setState({ theme: THEMES.LIGHT })
  })

  it('switches the document theme back and forth', async () => {
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe(THEMES.LIGHT)

    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.switchToDark }))
    expect(document.documentElement.dataset.theme).toBe(THEMES.DARK)

    await userEvent.click(screen.getByRole('button', { name: layoutMessages.en.switchToLight }))
    expect(document.documentElement.dataset.theme).toBe(THEMES.LIGHT)
  })
})
