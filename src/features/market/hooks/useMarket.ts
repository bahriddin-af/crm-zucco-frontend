import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { PERMISSIONS } from '@/constants/permissions'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/authStore'
import { marketApi } from '../api/marketApi'
import type {
  CoinTransactionsFilter,
  CreateOrUpdateMarketItemRequest,
  IssueCoinsRequest,
  OrdersFilter,
  PurchaseMarketItemRequest,
} from '../types/marketTypes'

/** Tanga harakati talaba balansini ham o'zgartiradi. */
const COIN_BALANCE_KEYS = [QUERY_KEYS.GAMIFICATION.ALL, QUERY_KEYS.STUDENTS.ALL] as const

/** Mahsulot boshqaruvchilari yashirilgan (nofaol) mahsulotlarni ham ko'radi, qayta yoqa olishi uchun. */
export function useMarketItems() {
  const canManageItems = useAuthStore((state) => state.hasPermission(PERMISSIONS.GAMIFICATION.ITEMS_MANAGE))

  return useQuery({
    queryKey: QUERY_KEYS.GAMIFICATION.ITEMS_LIST(canManageItems),
    queryFn: () => marketApi.getItems(canManageItems),
  })
}

export function useUpsertMarketItem() {
  return useMutation({
    mutationFn: (payload: CreateOrUpdateMarketItemRequest) => marketApi.upsertItem(payload),
    meta: { invalidates: [QUERY_KEYS.GAMIFICATION.ITEMS] },
  })
}

export function usePurchaseMarketItem() {
  return useMutation({
    mutationFn: (payload: PurchaseMarketItemRequest) => marketApi.purchase(payload),
    meta: { invalidates: COIN_BALANCE_KEYS },
  })
}

export function useMarketOrders(filter: OrdersFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.GAMIFICATION.ORDERS({ ...filter }),
    queryFn: () => marketApi.getOrders(filter),
    placeholderData: keepPreviousData,
  })
}

export function useDeliverOrder() {
  return useMutation({
    mutationFn: (orderId: string) => marketApi.deliverOrder(orderId),
    meta: { invalidates: [QUERY_KEYS.GAMIFICATION.ALL] },
  })
}

export function useCoinTransactions(filter: CoinTransactionsFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.GAMIFICATION.TRANSACTIONS({ ...filter }),
    queryFn: () => marketApi.getCoinTransactions(filter),
    placeholderData: keepPreviousData,
  })
}

export function useIssueCoins() {
  return useMutation({
    mutationFn: (payload: IssueCoinsRequest) => marketApi.issueCoins(payload),
    meta: { invalidates: COIN_BALANCE_KEYS },
  })
}
