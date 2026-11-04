export const PERMISSIONS = {
  BRANCHES: {
    VIEW: 'branches.view',
    CREATE: 'branches.create',
    UPDATE: 'branches.update',
    DELETE: 'branches.delete',
  },
  ROOMS: {
    VIEW: 'rooms.view',
    CREATE: 'rooms.create',
    UPDATE: 'rooms.update',
    DELETE: 'rooms.delete',
  },
  STAFF: {
    VIEW: 'staff.view',
    CREATE: 'staff.create',
    UPDATE: 'staff.update',
    DELETE: 'staff.delete',
    ROLES_MANAGE: 'staff.roles_manage',
  },
  COURSES: {
    VIEW: 'courses.view',
    CREATE: 'courses.create',
    UPDATE: 'courses.update',
    DELETE: 'courses.delete',
  },
  LEADS: {
    VIEW: 'leads.view',
    CREATE: 'leads.create',
    UPDATE: 'leads.update',
    DELETE: 'leads.delete',
    CONVERT: 'leads.convert',
  },
  GROUPS: {
    VIEW: 'groups.view',
    CREATE: 'groups.create',
    UPDATE: 'groups.update',
    DELETE: 'groups.delete',
  },
  STUDENTS: {
    VIEW: 'students.view',
    CREATE: 'students.create',
    UPDATE: 'students.update',
    DELETE: 'students.delete',
    FREEZE: 'students.freeze',
  },
  ATTENDANCE: {
    VIEW: 'attendance.view',
    MARK: 'attendance.mark',
    CANCEL_LESSON: 'attendance.cancel_lesson',
    GRADE: 'attendance.grade',
  },
  FINANCE: {
    VIEW: 'finance.view',
    PAYMENT_CREATE: 'finance.payment_create',
    EXPENSE_CREATE: 'finance.expense_create',
    REFUND: 'finance.refund',
    CASH_ACCOUNT_MANAGE: 'finance.cash_account_manage',
    RUN_BILLING_JOB: 'finance.run_billing_job',
  },
  PAYROLL: {
    VIEW: 'payroll.view',
    CALCULATE: 'payroll.calculate',
    APPROVE: 'payroll.approve',
    PAY: 'payroll.pay',
  },
  GAMIFICATION: {
    VIEW: 'gamification.view',
    COINS_ISSUE: 'gamification.coins_issue',
    ITEMS_MANAGE: 'gamification.items_manage',
    ORDERS_MANAGE: 'gamification.orders_manage',
    PURCHASE: 'gamification.purchase',
  },
  NOTIFICATIONS: {
    SMS_SEND: 'notifications.sms_send',
    TEMPLATES_MANAGE: 'notifications.templates_manage',
  },
} as const

export type Permission =
  | (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]]
