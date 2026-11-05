import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatPhone } from '@/utils/formatters'

/** Yuborish natijasi: backend qanday holat qaytarganini halol ko'rsatadi. */
export type SmsSendOutcome =
  | { kind: 'accepted'; phone: string }
  | { kind: 'rejected' }
  | { kind: 'unknown' }

interface SmsSendResultProps {
  outcome: SmsSendOutcome
  onStartNew: () => void
}

export function SmsSendResult({ outcome, onStartNew }: SmsSendResultProps) {
  const { t } = useTranslation()
  const view = {
    accepted: {
      icon: CheckCircle2,
      className: 'bg-success-soft border-success-line text-success-ink',
      title: t.sms.result.acceptedTitle,
      description: outcome.kind === 'accepted' ? `${formatPhone(outcome.phone)} · ${t.sms.result.acceptedDescription}` : '',
    },
    rejected: {
      icon: XCircle,
      className: 'bg-debt-soft border-debt-line text-debt-ink',
      title: t.sms.result.rejectedTitle,
      description: t.sms.result.rejectedDescription,
    },
    unknown: {
      icon: HelpCircle,
      className: 'bg-warning-soft border-warning-border text-warning-ink',
      title: t.sms.result.unknownTitle,
      description: t.sms.result.unknownDescription,
    },
  }[outcome.kind]
  const Icon = view.icon

  return (
    <div role="status" className={cn('rounded-md border p-3 space-y-2', view.className)}>
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold">{view.title}</p>
          <p className="text-2xs text-copy mt-0.5">{view.description}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onStartNew}>
        {t.sms.result.newMessage}
      </Button>
    </div>
  )
}
