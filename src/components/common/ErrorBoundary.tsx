import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { getTranslations } from '@/i18n'

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
}

/**
 * Lokal xatolik izolyatsiyasi: blokdagi kutilmagan JS xatosi butun ilovani oq ekranga aylantirmaydi.
 * Har bir sahifa va mustaqil vidjet alohida o'raladi.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Xato foydalanuvchiga fallback UI orqali ko'rsatiladi; konsolga yozilmaydi (RULES §6).
    void error
    void errorInfo
  }

  private handleReload = () => {
    this.setState({ hasError: false })
  }

  public override render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const { ui } = getTranslations()

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-border rounded-lg shadow-xs my-4">
        <div className="w-12 h-12 rounded-full bg-debt-soft text-debt-ink flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-heading mb-1">{ui.boundaryTitle}</h3>
        <p className="text-xs text-caption max-w-md mb-5">
          {this.props.fallbackMessage ?? ui.boundaryDescription}
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {ui.boundaryReload}
        </button>
      </div>
    )
  }
}
