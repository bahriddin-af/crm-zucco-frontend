import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Zero Tolerance: No console.log in production, but in ErrorBoundary we retain boundary handling
    void error
    void errorInfo
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null })
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-[#E3EAE5] rounded-lg shadow-xs my-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF1F2] text-[#BE123C] flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1E2B24] mb-1">
            Кўзда тутилмаган хатолик юз берди
          </h3>
          <p className="text-xs text-[#65776C] max-w-md mb-5">
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              'Интерфейс ушбу блокни юклашда муаммога дуч келди. Илтимос, қайта уриниб кўринг.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#146B52] hover:bg-[#0F5943] text-white text-xs font-medium rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Қайта юклаш
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
