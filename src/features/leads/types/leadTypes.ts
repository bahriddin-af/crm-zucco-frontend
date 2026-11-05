/** Backend `Zucco.Domain.Leads.Enums` bilan 1:1 (JSON'da raqam sifatida keladi). */
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
  None: 0,
  TooExpensive: 1,
  UnsuitableTime: 2,
  LocationTooFar: 3,
  ChoseCompetitor: 4,
  PhoneUnreachable: 5,
  Other: 6,
} as const

export type LostReason = (typeof LOST_REASON)[keyof typeof LOST_REASON]

/** Foydalanuvchi tanlay oladigan sabablar (`None` faqat backend standart qiymati). */
export const SELECTABLE_LOST_REASONS: readonly LostReason[] = [
  LOST_REASON.TooExpensive,
  LOST_REASON.UnsuitableTime,
  LOST_REASON.LocationTooFar,
  LOST_REASON.ChoseCompetitor,
  LOST_REASON.PhoneUnreachable,
  LOST_REASON.Other,
]

export const LEAD_ACTIVITY_TYPE = {
  Note: 1,
  Call: 2,
  Meeting: 3,
  StageChange: 4,
} as const

export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPE)[keyof typeof LEAD_ACTIVITY_TYPE]

/** Qo'lda qo'shiladigan faoliyat turlari (`StageChange` backend tomonidan yoziladi). */
export const MANUAL_ACTIVITY_TYPES: readonly LeadActivityType[] = [
  LEAD_ACTIVITY_TYPE.Note,
  LEAD_ACTIVITY_TYPE.Call,
  LEAD_ACTIVITY_TYPE.Meeting,
]

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

export interface LeadActivityItem {
  id: string
  activityType: LeadActivityType
  note: string
  createdAt: string
  createdBy?: string | null
}

/** Backend `LeadResponse` (`GET /api/leads/{id}`). */
export interface LeadResponse extends LeadListItem {
  parentPhone?: string | null
  assignedToUserId?: string | null
  assignedToName?: string | null
  note?: string | null
  lostReason: LostReason
  lostReasonDetails?: string | null
  activities: LeadActivityItem[]
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

/** `type` (interface emas): query key `Record<string, unknown>` sifatida qabul qilishi uchun. */
export type KanbanFilters = {
  branchId?: string
  courseId?: string
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
  id?: string | null
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

export interface LeadConversionResponse {
  leadId: string
  studentId: string
}

export interface MarkLeadLostRequest {
  leadId: string
  reason: LostReason
  details?: string | null
}

export interface AddLeadActivityRequest {
  leadId: string
  activityType: LeadActivityType
  note: string
}
