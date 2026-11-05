import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TeacherOptions } from './TeacherOptions'

interface PayrollFiltersBarProps {
  period: string
  teacherId: string
  onPeriodChange: (period: string) => void
  onTeacherChange: (teacherId: string) => void
}

/** Backend `GET calculations` filtrlari: `period` (yyyy-MM) va `teacherId`. */
export function PayrollFiltersBar({ period, teacherId, onPeriodChange, onTeacherChange }: PayrollFiltersBarProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-surface rounded-lg border border-border shadow-xs p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <FormField label={t.payroll.period} htmlFor="payroll-period">
        <Input
          id="payroll-period"
          type="month"
          value={period}
          onChange={(event) => onPeriodChange(event.target.value)}
        />
      </FormField>
      <FormField label={t.payroll.teacher} htmlFor="payroll-teacher">
        <SelectInput
          id="payroll-teacher"
          value={teacherId}
          onChange={(event) => onTeacherChange(event.target.value)}
        >
          <TeacherOptions placeholder={t.payroll.allTeachers} />
        </SelectInput>
      </FormField>
    </div>
  )
}
