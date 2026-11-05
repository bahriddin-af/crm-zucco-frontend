import { useTeacherOptions } from '@/features/staff/hooks/useStaff'

/** O'qituvchilar `<option>` ro'yxati (birinchi bo'sh variant — `placeholder`). */
export function TeacherOptions({ placeholder }: { placeholder: string }) {
  const { data: teachers = [] } = useTeacherOptions()

  return (
    <>
      <option value="">{placeholder}</option>
      {teachers.map((teacher) => (
        <option key={teacher.id} value={teacher.id}>
          {teacher.fullName}
        </option>
      ))}
    </>
  )
}
