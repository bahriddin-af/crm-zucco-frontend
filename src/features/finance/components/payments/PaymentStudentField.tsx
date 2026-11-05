import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from '@/i18n'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { SearchInput } from '@/components/forms/SearchInput'

interface SelectedStudent {
  id: string
  fullName: string
}

interface PaymentStudentFieldProps {
  registration: UseFormRegisterReturn
  error?: string
  /** Ro'yxatning joriy sahifasida bo'lmasa ham tanlangan talaba ko'rinib turishi uchun. */
  selectedStudent?: SelectedStudent
}

/** Talabani qidirish (debounce) va tanlash maydoni. */
export function PaymentStudentField({ registration, error, selectedStudent }: PaymentStudentFieldProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data, isLoading } = useStudentsList(debouncedSearch ? { search: debouncedSearch } : undefined)

  const students = data?.items ?? []
  const isSelectedMissing =
    selectedStudent !== undefined && !students.some((student) => student.id === selectedStudent.id)

  return (
    <FormField label={t.finance.drawer.student} htmlFor="payment-student" required error={error}>
      <div className="space-y-2">
        <SearchInput value={search} onChange={setSearch} placeholder={t.finance.drawer.studentSearch} className="sm:w-full" />
        <SelectInput id="payment-student" disabled={isLoading} hasError={Boolean(error)} {...registration}>
          <option value="">{t.finance.drawer.studentPlaceholder}</option>
          {isSelectedMissing && <option value={selectedStudent.id}>{selectedStudent.fullName}</option>}
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.fullName} · {student.phone}
            </option>
          ))}
        </SelectInput>
      </div>
    </FormField>
  )
}
