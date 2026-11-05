import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useApproveSalary, useSalaryCalculations } from '../../hooks/usePayroll'
import type { PayrollFilters, SalaryCalculationResponse } from '../../types/payrollTypes'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListState } from '@/components/ui/ListState'
import { CalculateSalaryModal } from './CalculateSalaryModal'
import { PaySalaryModal } from './PaySalaryModal'
import { SalaryCalculationsTable } from './SalaryCalculationsTable'

interface SalaryCalculationsSectionProps {
  period: string
  teacherId: string
}

export function SalaryCalculationsSection({ period, teacherId }: SalaryCalculationsSectionProps) {
  const { t } = useTranslation()
  const messages = t.payroll.calculations
  const [isCalculateOpen, setIsCalculateOpen] = useState(false)
  const [toApprove, setToApprove] = useState<SalaryCalculationResponse | null>(null)
  const [toPay, setToPay] = useState<SalaryCalculationResponse | null>(null)

  const filters: PayrollFilters = { period: period || undefined, teacherId: teacherId || undefined }
  const { data: calculations = [], isLoading, isError, error, refetch } = useSalaryCalculations(filters)
  const approve = useApproveSalary()

  const handleApprove = () => {
    if (!toApprove) return
    approve.mutate(toApprove.id, { onSettled: () => setToApprove(null) })
  }

  const calculateButton = (
    <PermissionGuard permission={PERMISSIONS.PAYROLL.CALCULATE}>
      <Button variant="primary" size="sm" onClick={() => setIsCalculateOpen(true)}>
        <Calculator className="w-3.5 h-3.5" />
        <span>{messages.calculate}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <SectionCard title={messages.title} subtitle={messages.subtitle} actions={calculateButton}>
      <ListState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={calculations.length === 0}
        empty={
          <EmptyState
            icon={<Calculator className="w-5 h-5" />}
            title={messages.emptyTitle}
            description={messages.emptyDescription}
            action={calculateButton}
          />
        }
      >
        <SalaryCalculationsTable calculations={calculations} onApprove={setToApprove} onPay={setToPay} />
      </ListState>

      <CalculateSalaryModal
        isOpen={isCalculateOpen}
        onClose={() => setIsCalculateOpen(false)}
        defaultTeacherId={teacherId}
        defaultPeriod={period}
      />

      {toPay && <PaySalaryModal calculation={toPay} onClose={() => setToPay(null)} />}

      <ConfirmDialog
        isOpen={toApprove !== null}
        onClose={() => setToApprove(null)}
        onConfirm={handleApprove}
        variant="primary"
        title={messages.approveConfirmTitle}
        description={interpolate(messages.approveConfirmDescription, {
          teacher: toApprove?.teacherName ?? '',
          amount: formatCurrency(toApprove?.finalAmount ?? 0),
        })}
        isLoading={approve.isPending}
      />
    </SectionCard>
  )
}
