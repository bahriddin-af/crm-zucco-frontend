import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { useRunBillingJob } from '../hooks/useFinance'

/** Oylik o'qish haqi hisob-kitobini qo'lda ishga tushirish (tasdiqlash bilan). */
export function RunBillingButton() {
  const { t } = useTranslation()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const runBilling = useRunBillingJob()

  const handleConfirm = () => {
    runBilling.mutate(undefined, { onSettled: () => setIsConfirmOpen(false) })
  }

  return (
    <PermissionGuard permission={PERMISSIONS.FINANCE.RUN_BILLING_JOB}>
      <Button variant="secondary" onClick={() => setIsConfirmOpen(true)}>
        <CalendarClock className="w-4 h-4" />
        <span>{t.finance.runBilling}</span>
      </Button>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        variant="primary"
        title={t.finance.runBillingConfirmTitle}
        description={t.finance.runBillingConfirmDescription}
        isLoading={runBilling.isPending}
      />
    </PermissionGuard>
  )
}
