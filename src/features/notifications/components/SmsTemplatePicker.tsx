import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useSmsTemplates } from '../hooks/useSms'
import type { SmsTemplate } from '../types/smsTypes'

interface SmsTemplatePickerProps {
  onSelect: (template: SmsTemplate) => void
}

/** Faol shablonni tanlash — matn va trigger formaga ko'chiriladi. */
export function SmsTemplatePicker({ onSelect }: SmsTemplatePickerProps) {
  const { t } = useTranslation()
  const { data: templates } = useSmsTemplates()
  const activeTemplates = templates?.filter((template) => template.isActive) ?? []

  if (activeTemplates.length === 0) return null

  return (
    <FormField label={t.sms.template} htmlFor="sms-template">
      <SelectInput
        id="sms-template"
        defaultValue=""
        onChange={(event) => {
          const template = activeTemplates.find((item) => item.id === event.target.value)
          if (template) onSelect(template)
        }}
      >
        <option value="">{t.sms.templateNone}</option>
        {activeTemplates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.title}
          </option>
        ))}
      </SelectInput>
    </FormField>
  )
}
