import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { useSaveStaff, useStaffDetail, useStaffRoles } from '../hooks/useStaff'
import { StaffForm } from './StaffForm'

interface StaffModalProps {
  onClose: () => void
  /** Berilsa — tahrirlash: to'liq ma'lumot (`email`, `hireDate`, rollar) `GET /api/staff/{id}` dan olinadi. */
  staffId?: string
}

const FORM_ID = 'staff-form'

export function StaffModal({ onClose, staffId }: StaffModalProps) {
  const { t } = useTranslation()
  const canManageRoles = useAuthStore((state) => state.hasPermission(PERMISSIONS.STAFF.ROLES_MANAGE))
  const detail = useStaffDetail(staffId)
  const roles = useStaffRoles(canManageRoles)
  const saveMutation = useSaveStaff()

  const isLoading = (Boolean(staffId) && detail.isLoading) || (canManageRoles && roles.isLoading)
  const error = detail.error ?? roles.error
  const isReady = !isLoading && !error && (!staffId || detail.data)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={staffId ? t.staff.form.editTitle : t.staff.form.createTitle}
      description={t.staff.form.description}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" disabled={!isReady} isLoading={saveMutation.isPending}>
            {staffId ? t.common.save : t.staff.form.submitCreate}
          </Button>
        </>
      }
    >
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-2/3" />
        </div>
      )}
      {error && (
        <ErrorState
          error={error}
          onRetry={() => {
            void detail.refetch()
            void roles.refetch()
          }}
        />
      )}
      {isReady && (
        <StaffForm
          formId={FORM_ID}
          staff={detail.data}
          roles={canManageRoles ? (roles.data ?? []) : null}
          onSubmit={(payload) => saveMutation.mutate(payload, { onSuccess: onClose })}
        />
      )}
    </Modal>
  )
}
