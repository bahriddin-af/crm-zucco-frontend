import { AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  /** `danger` — o'chirish kabi qaytarib bo'lmaydigan amallar uchun. */
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

/** O'chirish va to'lov amallaridan oldin majburiy tasdiqlash oynasi. */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const defaultConfirmLabel = variant === 'danger' ? t.ui.confirmDelete : t.ui.confirmAction

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? t.ui.confirmTitle}
      maxWidth="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            {t.common.cancel}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel ?? defaultConfirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-full bg-warning-soft text-warning-strong flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-xs text-copy leading-relaxed">{description ?? t.ui.confirmDescription}</p>
      </div>
    </Modal>
  )
}
