import { useState } from 'react'
import { Plus, Settings2 } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { useSalarySchemes } from '../../hooks/usePayroll'
import type { SalarySchemeResponse } from '../../types/payrollTypes'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListState } from '@/components/ui/ListState'
import { SalarySchemeModal } from './SalarySchemeModal'
import { SalarySchemesTable } from './SalarySchemesTable'

type EditorState = { scheme?: SalarySchemeResponse } | null

export function SalarySchemesSection({ teacherId }: { teacherId: string }) {
  const { t } = useTranslation()
  const messages = t.payroll.schemes
  const [editor, setEditor] = useState<EditorState>(null)
  const { data: schemes = [], isLoading, isError, error, refetch } = useSalarySchemes(teacherId || undefined)

  const addButton = (
    <PermissionGuard permission={PERMISSIONS.PAYROLL.CALCULATE}>
      <Button variant="secondary" size="sm" onClick={() => setEditor({})}>
        <Plus className="w-3.5 h-3.5" />
        <span>{messages.add}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <SectionCard title={messages.title} subtitle={messages.subtitle} actions={addButton}>
      <ListState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={schemes.length === 0}
        empty={
          <EmptyState
            icon={<Settings2 className="w-5 h-5" />}
            title={messages.emptyTitle}
            description={messages.emptyDescription}
            action={addButton}
          />
        }
      >
        <SalarySchemesTable schemes={schemes} onEdit={(scheme) => setEditor({ scheme })} />
      </ListState>

      {editor && (
        <SalarySchemeModal scheme={editor.scheme} defaultTeacherId={teacherId} onClose={() => setEditor(null)} />
      )}
    </SectionCard>
  )
}
