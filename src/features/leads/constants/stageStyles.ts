import { LEAD_STAGE_TYPE, type LeadStageType } from '../types/leadTypes'

interface StageStyle {
  /** Kanban ustuni sarlavhasining yuqori chizig'i. */
  border: string
  /** Voronka diagrammasidagi chiziq rangi. */
  bar: string
}

/** Backend `colorHex` o'rniga bosqich turi bo'yicha dizayn tokenlari (inline style ishlatilmaydi). */
export const STAGE_STYLES: Record<LeadStageType, StageStyle> = {
  [LEAD_STAGE_TYPE.NewLead]: { border: 'border-t-primary', bar: 'bg-primary' },
  [LEAD_STAGE_TYPE.Contacted]: { border: 'border-t-focus', bar: 'bg-focus' },
  [LEAD_STAGE_TYPE.TrialScheduled]: { border: 'border-t-warning', bar: 'bg-warning' },
  [LEAD_STAGE_TYPE.TrialAttended]: { border: 'border-t-warning-strong', bar: 'bg-warning-strong' },
  [LEAD_STAGE_TYPE.WaitingList]: { border: 'border-t-subtle', bar: 'bg-subtle' },
  [LEAD_STAGE_TYPE.Converted]: { border: 'border-t-success', bar: 'bg-success' },
  [LEAD_STAGE_TYPE.Lost]: { border: 'border-t-debt', bar: 'bg-debt' },
}

const DEFAULT_STAGE_STYLE: StageStyle = STAGE_STYLES[LEAD_STAGE_TYPE.NewLead]

export function getStageStyle(stageType: number): StageStyle {
  return STAGE_STYLES[stageType as LeadStageType] ?? DEFAULT_STAGE_STYLE
}

/** Foiz → kenglik klassi (12 bo'lakli shkala; dinamik `style.width` o'rniga). */
const WIDTH_BUCKETS = [
  'w-0',
  'w-1/12',
  'w-2/12',
  'w-3/12',
  'w-4/12',
  'w-5/12',
  'w-6/12',
  'w-7/12',
  'w-8/12',
  'w-9/12',
  'w-10/12',
  'w-11/12',
  'w-full',
] as const

const FULL_PERCENT = 100

export function percentToWidthClass(percent: number): string {
  const clamped = Math.min(FULL_PERCENT, Math.max(0, percent))
  const index = Math.round((clamped / FULL_PERCENT) * (WIDTH_BUCKETS.length - 1))
  // Nol bo'lmagan qiymat ko'rinib turishi uchun eng kichik bo'lak.
  return WIDTH_BUCKETS[clamped > 0 && index === 0 ? 1 : index]
}

/** HTML5 drag-and-drop orqali uzatiladigan lid identifikatori turi. */
export const LEAD_DRAG_DATA_TYPE = 'application/x-zucco-lead-id'
