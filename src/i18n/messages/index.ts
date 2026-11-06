import type { SupportedLanguage } from '../types'
import { attendanceMessages } from './attendance'
import { authMessages } from './auth'
import { branchesMessages } from './branches'
import { coinsMessages } from './coins'
import { commonMessages } from './common'
import { coursesMessages } from './courses'
import { errorsMessages } from './errors'
import { expensesMessages } from './expenses'
import { financeMessages } from './finance'
import { groupsMessages } from './groups'
import { layoutMessages } from './layout'
import { leadsMessages } from './leads'
import { marketMessages } from './market'
import { navMessages } from './nav'
import { overviewMessages } from './overview'
import { payrollMessages } from './payroll'
import { reportsMessages } from './reports'
import { riskMessages } from './risk'
import { rolesMessages } from './roles'
import { scheduleMessages } from './schedule'
import { settingsMessages } from './settings'
import { smsMessages } from './sms'
import { staffMessages } from './staff'
import { studentsMessages } from './students'
import { uiMessages } from './ui'

/**
 * Har bir namespace o'z faylida 4 til bilan saqlanadi (`messages/<namespace>.ts`).
 * Yangi namespace qo'shilganda faqat shu ro'yxatga yoziladi.
 */
const NAMESPACES = {
  attendance: attendanceMessages,
  auth: authMessages,
  branches: branchesMessages,
  coins: coinsMessages,
  common: commonMessages,
  courses: coursesMessages,
  errors: errorsMessages,
  expenses: expensesMessages,
  finance: financeMessages,
  groups: groupsMessages,
  layout: layoutMessages,
  leads: leadsMessages,
  market: marketMessages,
  nav: navMessages,
  overview: overviewMessages,
  payroll: payrollMessages,
  reports: reportsMessages,
  risk: riskMessages,
  roles: rolesMessages,
  schedule: scheduleMessages,
  settings: settingsMessages,
  sms: smsMessages,
  staff: staffMessages,
  students: studentsMessages,
  ui: uiMessages,
} as const

type Namespaces = typeof NAMESPACES

export type Translations = {
  [K in keyof Namespaces]: Namespaces[K][SupportedLanguage]
}

function buildTranslations(language: SupportedLanguage): Translations {
  const entries = Object.entries(NAMESPACES).map(([namespace, messages]) => [namespace, messages[language]])
  return Object.fromEntries(entries) as Translations
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  'uz-Cyrl': buildTranslations('uz-Cyrl'),
  uz: buildTranslations('uz'),
  ru: buildTranslations('ru'),
  en: buildTranslations('en'),
}
