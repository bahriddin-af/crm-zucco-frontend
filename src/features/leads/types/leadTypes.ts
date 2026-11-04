export const LEAD_STAGE_TYPE = {
  NewLead: 1,
  Contacted: 2,
  TrialScheduled: 3,
  TrialAttended: 4,
  WaitingList: 5,
  Converted: 6,
  Lost: 7,
} as const

export type LeadStageType = (typeof LEAD_STAGE_TYPE)[keyof typeof LEAD_STAGE_TYPE]

export const LEAD_STATUS = {
  Active: 1,
  Converted: 2,
  Lost: 3,
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

export const LOST_REASON = {
  TooExpensive: 1,
  ScheduleConflict: 2,
  LocationFar: 3,
  CompetitorChosen: 4,
  NoResponse: 5,
  Other: 6,
} as const

export type LostReason = (typeof LOST_REASON)[keyof typeof LOST_REASON]

export const LOST_REASON_LABELS: Record<LostReason, string> = {
  [LOST_REASON.TooExpensive]: 'Нарх қимматлик қилди',
  [LOST_REASON.ScheduleConflict]: 'Дарс вақти тўғри келмади',
  [LOST_REASON.LocationFar]: 'Манзил узоқлик қилди',
  [LOST_REASON.CompetitorChosen]: 'Бошқа марказни танлади',
  [LOST_REASON.NoResponse]: 'Алоқага чиқмади (жавоб бермади)',
  [LOST_REASON.Other]: 'Бошқа сабаб',
}

export interface LeadListItem {
  id: string
  fullName: string
  phone: string
  branchId?: string | null
  branchName?: string | null
  courseId?: string | null
  courseName?: string | null
  sourceId?: string | null
  sourceName?: string | null
  stageId: string
  stageName: string
  status: LeadStatus
  createdAt: string
}

export interface KanbanColumn {
  stageId: string
  stageName: string
  order: number
  stageType: LeadStageType
  colorHex?: string | null
  totalLeads: number
  leads: LeadListItem[]
}

export interface LeadStageDto {
  id: string
  name: string
  order: number
  stageType: LeadStageType
  colorHex?: string | null
}

export interface LeadSourceDto {
  id: string
  name: string
  isActive: boolean
}

export interface CreateOrUpdateLeadRequest {
  id?: string
  fullName: string
  phone: string
  stageId: string
  branchId?: string | null
  courseId?: string | null
  sourceId?: string | null
  parentPhone?: string | null
  assignedToUserId?: string | null
  note?: string | null
}

export interface MoveLeadStageRequest {
  leadId: string
  targetStageId: string
  comment?: string | null
}

export interface ConvertLeadRequest {
  leadId: string
  groupId?: string | null
  joinedDate?: string | null
}

export interface MarkLeadLostRequest {
  leadId: string
  reason: LostReason
  details?: string | null
}
