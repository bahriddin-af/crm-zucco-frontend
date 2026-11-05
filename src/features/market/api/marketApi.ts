import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CoinTransaction,
  CoinTransactionsFilter,
  CreateOrUpdateMarketItemRequest,
  IssueCoinsRequest,
  MarketItem,
  MarketOrder,
  OrdersFilter,
  PurchaseMarketItemRequest,
} from '../types/marketTypes'

export const marketApi = {
  getItems: async (includeInactive = false) => {
    const response = await apiClient.get<ApiResponse<MarketItem[]>>(API_ROUTES.GAMIFICATION.ITEMS, {
      params: { includeInactive },
    })
    return response.data.data
  },

  upsertItem: async (payload: CreateOrUpdateMarketItemRequest) => {
    const response = await apiClient.post<ApiResponse<MarketItem>>(API_ROUTES.GAMIFICATION.ITEMS, payload)
    return response.data.data
  },

  purchase: async (payload: PurchaseMarketItemRequest) => {
    const response = await apiClient.post<ApiResponse<MarketOrder>>(API_ROUTES.GAMIFICATION.ORDERS, payload)
    return response.data.data
  },

  getOrders: async (filter: OrdersFilter) => {
    const response = await apiClient.get<ApiResponse<PagedResult<MarketOrder>>>(API_ROUTES.GAMIFICATION.ORDERS, {
      params: filter,
    })
    return response.data.data
  },

  deliverOrder: async (orderId: string) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.GAMIFICATION.DELIVER_ORDER(orderId))
    return response.data
  },

  getCoinTransactions: async (filter: CoinTransactionsFilter) => {
    const response = await apiClient.get<ApiResponse<PagedResult<CoinTransaction>>>(
      API_ROUTES.GAMIFICATION.COIN_TRANSACTIONS,
      { params: filter }
    )
    return response.data.data
  },

  issueCoins: async (payload: IssueCoinsRequest) => {
    const response = await apiClient.post<ApiResponse<CoinTransaction>>(
      API_ROUTES.GAMIFICATION.COIN_TRANSACTIONS,
      payload
    )
    return response.data.data
  },
}
