import { useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { interpolate, useTranslation } from '@/i18n'
import { useCoursesList } from '@/features/courses/hooks/useCourses'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { useTeacherOptions } from '@/features/staff/hooks/useStaff'
import { useRoomOptions } from '@/features/groups/hooks/useGroupOptions'
import type { GroupFormValues } from '../../utils/groupFormSchema'

interface GroupAssignmentFieldsProps {
  isEditing: boolean
}

/** Kurs, nom, filial, o'qituvchi va xona tanlovi. */
export function GroupAssignmentFields({ isEditing }: GroupAssignmentFieldsProps) {
  const { t } = useTranslation()
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<GroupFormValues>()
  const branchId = useWatch({ control, name: 'branchId' })

  const { data: coursesPage } = useCoursesList({ pageSize: OPTIONS_PAGE_SIZE })
  const { data: branches = [] } = useBranchOptions()
  const { data: teachers = [] } = useTeacherOptions()
  const { data: rooms = [] } = useRoomOptions(branchId)
  const courses = coursesPage?.items ?? []

  const courseField = register('courseId', {
    onChange: (event: { target: { value: string } }) => {
      const course = courses.find((item) => item.id === event.target.value)
      if (course && !isEditing) setValue('monthlyPrice', course.basePrice)
    },
  })
  const branchField = register('branchId', {
    onChange: () => setValue('roomId', ''),
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField label={t.groups.fields.course} htmlFor="group-course" required error={errors.courseId?.message}>
        <SelectInput id="group-course" hasError={Boolean(errors.courseId)} {...courseField}>
          <option value="">{t.groups.select}</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={t.groups.fields.name} htmlFor="group-name" required>
        <Input
          id="group-name"
          placeholder={t.groups.fields.namePlaceholder}
          {...register('name')}
          error={errors.name?.message}
        />
      </FormField>

      <FormField label={t.groups.fields.branch} htmlFor="group-branch" required error={errors.branchId?.message}>
        <SelectInput id="group-branch" hasError={Boolean(errors.branchId)} {...branchField}>
          <option value="">{t.groups.select}</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={t.groups.fields.teacher} htmlFor="group-teacher" required error={errors.teacherId?.message}>
        <SelectInput id="group-teacher" hasError={Boolean(errors.teacherId)} {...register('teacherId')}>
          <option value="">{t.groups.select}</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField
        label={t.groups.fields.room}
        htmlFor="group-room"
        required
        error={errors.roomId?.message}
        className="sm:col-span-2"
      >
        <SelectInput id="group-room" hasError={Boolean(errors.roomId)} disabled={!branchId} {...register('roomId')}>
          <option value="">{t.groups.select}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {interpolate(t.groups.roomOption, { name: room.name, capacity: room.capacity })}
            </option>
          ))}
        </SelectInput>
      </FormField>
    </div>
  )
}
