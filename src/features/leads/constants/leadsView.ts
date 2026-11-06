/** Lidlar sahifasi ko'rinishlari. */
export const LEADS_VIEW = {
  Kanban: 'kanban',
  Table: 'table',
} as const

export type LeadsView = (typeof LEADS_VIEW)[keyof typeof LEADS_VIEW]
