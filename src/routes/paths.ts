export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  OVERVIEW: '/',
  ACCESS_DENIED: '/access-denied',
  LEADS: {
    LIST: '/leads',
  },
  STUDENTS: {
    LIST: '/students',
    DETAIL: '/students/:id',
  },
  GROUPS: {
    LIST: '/groups',
    DETAIL: '/groups/:id',
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
  },
  STAFF: {
    LIST: '/staff',
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
