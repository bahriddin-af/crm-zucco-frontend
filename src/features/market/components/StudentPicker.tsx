import { useState } from 'react'
import { interpolate, useTranslation } from '@/i18n'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import { formatCoins } from '@/utils/formatters'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { SearchInput } from '@/components/forms/SearchInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

interface StudentPickerProps {
  id: string
  value: string
  /** Tanlangan talaba id'si va ismi (tasdiqlash oynasida ko'rsatish uchun). */
  onChange: (studentId: string, studentName: string) => void
  error?: string
}

/** Talabani qidirib tanlash (tanga balansi bilan). */
export function StudentPicker({ id, value, onChange, error }: StudentPickerProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data, isLoading } = useStudentsList(debouncedSearch ? { search: debouncedSearch } : undefined)
  const students = data?.items ?? []

  return (
    <FormField label={t.coins.picker.label} htmlFor={id} error={error}>
      <div className="space-y-2">
        <SearchInput value={search} onChange={setSearch} placeholder={t.coins.picker.searchPlaceholder} className="sm:w-full" />
        <SelectInput id={id} value={value} hasError={Boolean(error)} onChange={(event) => onChange(event.target.value, event.target.selectedOptions[0]?.dataset.name ?? '')}
        >
          <option value="">{isLoading ? t.common.loading : t.coins.picker.select}</option>
          {students.map((student) => (
            <option key={student.id} value={student.id} data-name={student.fullName}>
              {interpolate(t.coins.picker.option, {
                name: student.fullName,
                balance: formatCoins(student.coinsBalance),
              })}
            </option>
          ))}
        </SelectInput>
        {!isLoading && students.length === 0 && <p className="text-[11px] text-caption">{t.coins.picker.empty}</p>}
      </div>
    </FormField>
  )
}
