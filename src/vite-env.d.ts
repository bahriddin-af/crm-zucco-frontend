/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API manzili (masalan `https://api.zucco.uz`). Production build'da majburiy; dev'da bo'sh — `/api` proxy ishlatiladi. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
