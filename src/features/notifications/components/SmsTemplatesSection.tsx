import { useState } from 'react'
import { FileText, Pencil, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useSmsTemplates } from '../hooks/useSms'
import type { SmsTemplate } from '../types/smsTypes'
import { SmsTemplateFormModal } from './SmsTemplateFormModal'

/** `undefined` — forma yopiq, `null` — yangi shablon. */
type EditingTemplate = SmsTemplate | null | undefined

export function SmsTemplatesSection() {
  const { t } = useTranslation()
  const { data: templates, isLoading, isError, error, refetch } = useSmsTemplates()
  const [editing, setEditing] = useState<EditingTemplate>(undefined)

  const createButton = (
    <PermissionGuard permission={PERMISSIONS.NOTIFICATIONS.TEMPLATE_MANAGE}>
      <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
        <Plus className="w-3.5 h-3.5" />
        <span>{t.sms.newTemplate}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <SectionCard title={t.sms.templatesTitle} actions={createButton}>
      {isLoading && <ListSkeleton rows={3} rowClassName="h-14" />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {templates && templates.length === 0 && (
        <EmptyState icon={<FileText className="w-5 h-5" />} title={t.sms.emptyTemplates} action={createButton} />
      )}
      {templates && templates.length > 0 && (
        <ul className="divide-y divide-divider">
          {templates.map((template) => (
            <li key={template.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-heading">{template.title}</h3>
                  <Badge variant={template.isActive ? 'accent' : 'default'}>
                    {template.isActive ? t.sms.triggers[template.trigger] : t.sms.inactive}
                  </Badge>
                </div>
                <p className="text-[11px] text-caption mt-1 line-clamp-2">{template.templateText}</p>
              </div>
              <PermissionGuard permission={PERMISSIONS.NOTIFICATIONS.TEMPLATE_MANAGE}>
                <Button variant="ghost" size="icon" aria-label={t.sms.editTemplate} onClick={() => setEditing(template)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </PermissionGuard>
            </li>
          ))}
        </ul>
      )}
      {editing !== undefined && <SmsTemplateFormModal template={editing} onClose={() => setEditing(undefined)} />}
    </SectionCard>
  )
}
