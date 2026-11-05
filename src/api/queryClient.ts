import { MutationCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HTTP_STATUS } from '@/constants/http'
import { getApiErrorMessage, getApiErrorStatus, isNetworkError } from '@/utils/apiError'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Muvaffaqiyatli bo'lganda (va 409 konfliktda) yangilanadigan query kalitlari. */
      invalidates?: readonly QueryKey[]
      /** Xatoni mutatsiya o'zi ko'rsatadigan bo'lsa, global toast o'chiriladi. */
      silentError?: boolean
    }
  }
}

const STALE_TIME_MS = 5 * 60 * 1000
const MAX_QUERY_RETRIES = 1
/** Faqat tarmoq xatolari qayta yuboriladi: payload ichidagi operationId bir xil qolgani uchun bu xavfsiz. */
const MAX_MUTATION_NETWORK_RETRIES = 2

export const queryClient: QueryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      mutation.meta?.invalidates?.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey })
      })
    },
    onError: (error, _variables, _context, mutation) => {
      if (getApiErrorStatus(error) === HTTP_STATUS.CONFLICT) {
        mutation.meta?.invalidates?.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey })
        })
      }
      if (!mutation.meta?.silentError) {
        toast.error(getApiErrorMessage(error))
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isNetworkError(error) && failureCount < MAX_QUERY_RETRIES,
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME_MS,
    },
    mutations: {
      retry: (failureCount, error) => isNetworkError(error) && failureCount < MAX_MUTATION_NETWORK_RETRIES,
    },
  },
})
