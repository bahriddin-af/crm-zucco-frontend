import { useTranslation } from '@/i18n'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { useTeacherOptions } from '@/features/staff/hooks/useStaff'
import { useRoomOptions } from '@/features/groups/hooks/useGroupOptions'
import { SelectInput } from '@/components/forms/SelectInput'
import type { ScheduleFiltersValue } from '../types/scheduleTypes'

interface ScheduleFiltersProps {
  value: ScheduleFiltersValue
  onChange: (value: ScheduleFiltersValue) => void
}

/** Filial → xona bog'liq: filial almashganda xona filtri tozalanadi. */
export function ScheduleFilters({ value, onChange }: ScheduleFiltersProps) {
  const { t } = useTranslation()
  const { data: branches = [] } = useBranchOptions()
  const { data: teachers = [] } = useTeacherOptions()
  const { data: rooms = [] } = useRoomOptions(value.branchId)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface p-3 rounded-lg border border-border shadow-xs">
      <SelectInput
        aria-label={t.schedule.branch}
        value={value.branchId}
        onChange={(event) => onChange({ ...value, branchId: event.target.value, roomId: '' })}
      >
        <option value="">{t.schedule.allBranches}</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        aria-label={t.schedule.teacher}
        value={value.teacherId}
        onChange={(event) => onChange({ ...value, teacherId: event.target.value })}
      >
        <option value="">{t.schedule.allTeachers}</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.fullName}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        aria-label={t.schedule.room}
        value={value.roomId}
        disabled={!value.branchId}
        onChange={(event) => onChange({ ...value, roomId: event.target.value })}
      >
        <option value="">{t.schedule.allRooms}</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
