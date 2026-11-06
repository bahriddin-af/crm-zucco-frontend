export const PERMISSIONS = {
  BRANCHES: {
    VIEW: 'branches.view',
    CREATE: 'branches.create',
    UPDATE: 'branches.update',
    DELETE: 'branches.delete',
    /** Filialga bog'langan xodim ham barcha filiallar ma'lumotini ko'radi. */
    ACCESS_ALL: 'branches.access_all',
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
    /** Boshqa xodimning parolini qayta o'rnatish (barcha sessiyalari yopiladi). */
    PASSWORD_RESET: 'staff.password_reset',
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
    VIEW: 'notifications.view',
    SEND_SMS: 'notifications.send_sms',
    TEMPLATE_MANAGE: 'notifications.template_manage',
  },
} as const

type PermissionCatalog = typeof PERMISSIONS

export type PermissionModule = keyof PermissionCatalog

/** Barcha ruxsatnoma satrlari birlashmasi (`'students.view' | 'finance.payment_create' | ...`). */
export type Permission = {
  [Module in PermissionModule]: PermissionCatalog[Module][keyof PermissionCatalog[Module]]
}[PermissionModule]

/** Backend `Constants.Roles` bilan mos. Bu rollar barcha ruxsatnomalarga ega (CurrentUser.HasPermission). */
export const ROLES = {
  OWNER: 'Owner',
  SUPER_ADMIN: 'SuperAdmin',
  ADMINISTRATOR: 'Administrator',
  TEACHER: 'Teacher',
  CASHIER: 'Cashier',
} as const

export const FULL_ACCESS_ROLES: readonly string[] = [ROLES.OWNER, ROLES.SUPER_ADMIN]
