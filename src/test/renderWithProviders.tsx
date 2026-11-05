import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

/** Har bir test uchun alohida QueryClient (qayta urinishlarsiz). */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

/** `renderHook` uchun QueryClient wrapper. */
export function createQueryWrapper(queryClient: QueryClient = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

interface RenderWithProvidersOptions {
  route?: string
  queryClient?: QueryClient
}

/** Alohida QueryClient va router bilan render. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', queryClient = createTestQueryClient() }: RenderWithProvidersOptions = {}
) {
  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
  return { ...result, queryClient }
}

/** Backend `ApiResponse` xatosi (kod bilan) ko'rinishidagi AxiosError. */
export function createApiError(status: number, code: string): AxiosError {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError(code, AxiosError.ERR_BAD_RESPONSE, config, undefined, {
    status,
    statusText: '',
    headers: {},
    config,
    data: { success: false, code },
  })
}

/** Javobsiz (tarmoq) xato. */
export function createNetworkError(): AxiosError {
  return new AxiosError('network', AxiosError.ERR_NETWORK, { headers: new AxiosHeaders() })
}
