export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  OVERVIEW: '/',
  ACCESS_DENIED: '/access-denied',
  LEADS: {
    LIST: '/leads',
    CONVERT: '/leads/convert/:id',
    LOST: '/leads/lost/:id',
  },
  STUDENTS: {
    LIST: '/students',
    DETAIL: '/students/:id',
    ENROLL: '/students/:id/enroll',
    FREEZE: '/students/:id/freeze',
  },
  GROUPS: {
    LIST: '/groups',
    DETAIL: '/groups/:id',
    CREATE: '/groups/create',
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: '/courses/:id',
  },
  SCHEDULE: '/schedule',
  ATTENDANCE: {
    JOURNAL: '/attendance',
    TEACHER: '/attendance/teacher',
  },
  FINANCE: {
    DESK: '/finance',
    EXPENSES: '/expenses',
    PAYROLL: '/payroll',
    PAYMENT_MODAL: '/finance/payment',
    BILLING_REVIEW: '/finance/billing-review',
  },
  STAFF: {
    LIST: '/staff',
    CREATE: '/staff/create',
    ROLES: '/settings/roles',
  },
  BRANCHES: '/branches',
  MARKET: {
    ITEMS: '/market',
    COIN_ACTIVITY: '/coins',
  },
  NOTIFICATIONS: {
    SMS: '/sms',
  },
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const
