import { Badge } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatCoins, formatDate, formatTime } from '@/utils/formatters'
import type { CoinTransaction } from '../types/marketTypes'

interface CoinTransactionsTableProps {
  transactions: CoinTransaction[]
}

export function CoinTransactionsTable({ transactions }: CoinTransactionsTableProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-2xs font-semibold">
            <th className="py-3 px-4">{t.coins.student}</th>
            <th className="py-3 px-4">{t.coins.reason}</th>
            <th className="py-3 px-4">{t.coins.description}</th>
            <th className="py-3 px-4">{t.common.date}</th>
            <th className="py-3 px-4 text-right">{t.coins.amount}</th>
            <th className="py-3 px-4 text-right">{t.coins.balanceAfter}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {transactions.map((transaction) => {
            const isEarn = transaction.amount > 0
            return (
              <tr key={transaction.id} className="hover:bg-surface-tint transition-colors">
                <td className="py-3 px-4 font-semibold text-heading">{transaction.studentName}</td>
                <td className="py-3 px-4">
                  <Badge variant={isEarn ? 'success' : 'danger'}>{t.coins.reasons[transaction.reason]}</Badge>
                </td>
                <td className="py-3 px-4 text-copy-strong">{transaction.description}</td>
                <td className="py-3 px-4 text-subtle tabular-nums">
                  {formatDate(transaction.createdAt)} {formatTime(transaction.createdAt)}
                </td>
                <td
                  className={cn(
                    'py-3 px-4 text-right font-bold tabular-nums',
                    isEarn ? 'text-success-ink' : 'text-debt-ink'
                  )}
                >
                  {isEarn ? '+' : ''}
                  {formatCoins(transaction.amount)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-copy">{formatCoins(transaction.balanceAfter)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
