export const DAY_SCHEDULE_TYPE = {
  OddDays: 1, // Du - Cho - Ju
  EvenDays: 2, // Se - Pay - Sha
  Everyday: 3, // Har kuni
  Custom: 4, // Maxsus kunlar
} as const

export type DayScheduleType = (typeof DAY_SCHEDULE_TYPE)[keyof typeof DAY_SCHEDULE_TYPE]

export const DAY_SCHEDULE_LABELS: Record<DayScheduleType, string> = {
  [DAY_SCHEDULE_TYPE.OddDays]: 'Душ / Чор / Жум',
  [DAY_SCHEDULE_TYPE.EvenDays]: 'Сеш / Пай / Шан',
  [DAY_SCHEDULE_TYPE.Everyday]: 'Ҳар куни',
  [DAY_SCHEDULE_TYPE.Custom]: 'Танланган кунлар',
}

export const GROUP_STATUS = {
  Recruiting: 1, // Qabul ochiq
  Active: 2, // Faol
  Frozen: 3, // Muzlatilgan
  Completed: 4, // Bitirgan / Arxiv
} as const

export type GroupStatus = (typeof GROUP_STATUS)[keyof typeof GROUP_STATUS]

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  [GROUP_STATUS.Recruiting]: 'Қабул очиқ',
  [GROUP_STATUS.Active]: 'Фаол',
  [GROUP_STATUS.Frozen]: 'Музлатилган',
  [GROUP_STATUS.Completed]: 'Якунланган',
}

export const BILLING_MODE = {
  MonthlyCalendar: 1, // Har oyning 1-sanasida
  CycleBased: 2, // 30 kunlik davr
  PerLesson: 3, // Darsbay
  FullCourse: 4, // Kurs uchun to'liq
} as const

export type BillingMode = (typeof BILLING_MODE)[keyof typeof BILLING_MODE]

export const BILLING_MODE_LABELS: Record<BillingMode, string> = {
  [BILLING_MODE.MonthlyCalendar]: 'Ойлик (1-санада)',
  [BILLING_MODE.CycleBased]: '30 кунлик давр',
  [BILLING_MODE.PerLesson]: 'Дарсбай тўлов',
  [BILLING_MODE.FullCourse]: 'Курс учун тўлиқ',
}

export interface GroupListItem {
  id: string
  name: string
  courseId: string
  courseName: string
  teacherId: string
  teacherName: string
  branchId: string
  branchName: string
  roomId: string
  roomName: string
  daysSchedule: DayScheduleType
  startTime: string
  endTime: string
  monthlyPrice: number
  capacity: number
  enrolledStudentsCount: number
  status: GroupStatus
  customDays?: number[]
}

export interface GroupResponse extends GroupListItem {
  startDate: string
  endDate?: string | null
  billingMode: BillingMode
  createdAt: string
}

export interface CreateOrUpdateGroupRequest {
  id?: string
  name: string
  courseId: string
  teacherId: string
  branchId: string
  roomId: string
  startDate: string
  daysSchedule: DayScheduleType
  startTime: string
  endTime: string
  monthlyPrice: number
  capacity: number
  billingMode: BillingMode
  endDate?: string | null
  status: GroupStatus
  customDays?: number[] | null
}

export interface RoomOption {
  id: string
  branchId: string
  name: string
  capacity: number
}

export interface TeacherOption {
  id: string
  fullName: string
  phone: string
  specialization?: string
}

export interface CourseOption {
  id: string
  name: string
  basePrice: number
  durationMonths: number
  lessonsPerMonth: number
}
