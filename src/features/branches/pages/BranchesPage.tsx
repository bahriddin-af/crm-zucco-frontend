import { useState } from 'react'
import { MousePointerClick, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { BranchesSection } from '../components/BranchesSection'
import { BranchFormModal } from '../components/BranchFormModal'
import { RoomsPanel } from '../components/RoomsPanel'
import type { BranchListItem } from '../types/branchTypes'

/** `undefined` — forma yopiq, `null` — yangi filial. */
type EditingBranch = BranchListItem | null | undefined

export function BranchesPage() {
  const { t } = useTranslation()
  const [editingBranch, setEditingBranch] = useState<EditingBranch>(undefined)
  const [selectedBranch, setSelectedBranch] = useState<BranchListItem | null>(null)

  const openCreate = () => setEditingBranch(null)

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.branches.title}
        subtitle={t.branches.subtitle}
        actions={
          <PermissionGuard permission={PERMISSIONS.BRANCHES.CREATE}>
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus className="w-3.5 h-3.5" />
              <span>{t.branches.newBranch}</span>
            </Button>
          </PermissionGuard>
        }
      />

      <ErrorBoundary>
        <BranchesSection
          selectedId={selectedBranch?.id ?? null}
          onSelect={setSelectedBranch}
          onCreate={openCreate}
          onEdit={setEditingBranch}
          onDeleted={(branchId) => {
            if (selectedBranch?.id === branchId) setSelectedBranch(null)
          }}
        />
      </ErrorBoundary>

      <PermissionGuard permission={PERMISSIONS.ROOMS.VIEW}>
        <ErrorBoundary>
          {selectedBranch ? (
            <RoomsPanel key={selectedBranch.id} branch={selectedBranch} />
          ) : (
            <EmptyState icon={<MousePointerClick className="w-5 h-5" />} title={t.branches.selectBranchHint} />
          )}
        </ErrorBoundary>
      </PermissionGuard>

      {editingBranch !== undefined && (
        <BranchFormModal branch={editingBranch} onClose={() => setEditingBranch(undefined)} />
      )}
    </div>
  )
}
