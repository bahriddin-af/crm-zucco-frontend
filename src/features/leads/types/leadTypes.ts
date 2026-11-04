export const LEAD_STAGES = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  TRIAL_SCHEDULED: 'TrialScheduled',
  TRIAL_ATTENDED: 'TrialAttended',
  WAITING_LIST: 'WaitingList',
  CONVERTED: 'Converted',
  LOST: 'Lost',
} as const

export type LeadStage = (typeof LEAD_STAGES)[keyof typeof LEAD_STAGES]

export interface Lead {
  id: string
  fullName: string
  phone: string
  courseInterest: string
  stage: LeadStage
  source: string
  createdAt: string
  trialDate?: string
  assignedStaffName?: string
}

export interface ConvertLeadRequest {
  leadId: string
  isExistingStudent: boolean
  studentId?: string
  groupId?: string
  joinedDate: string
  customPrice?: number
}

export interface LostLeadRequest {
  leadId: string
  reason: string
  notes?: string
}
