import type { Translations } from '@/i18n'
import { DAY_SCHEDULE_TYPE, WEEK_ORDER, type GroupListItem } from '../types/groupTypes'

/** Guruh dars kunlari matni: standart jadval nomi yoki tanlangan hafta kunlari (Du / Chor / ...). */
export function formatScheduleDays(
  t: Translations,
  group: Pick<GroupListItem, 'daysSchedule' | 'customDays'>
): string {
  if (group.daysSchedule !== DAY_SCHEDULE_TYPE.Custom || !group.customDays?.length) {
    return t.groups.daySchedule[group.daysSchedule]
  }
  const selected = group.customDays
  return WEEK_ORDER.filter((day) => selected.includes(day))
    .map((day) => t.groups.weekdaysShort[day])
    .join(' / ')
}
