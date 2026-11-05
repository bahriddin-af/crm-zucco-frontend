import type { CashAccount } from '../types/financeTypes'

/** Forma ochilganda tanlanadigan standart kassa (asosiy yoki birinchisi). */
export function getDefaultAccountId(accounts: CashAccount[]): string {
  return (accounts.find((account) => account.isDefault) ?? accounts[0])?.id ?? ''
}
