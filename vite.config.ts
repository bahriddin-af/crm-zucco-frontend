import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const DEV_SERVER_PORT = 5173
// crm-zucco-backend/backend/src/Zucco.Api/Properties/launchSettings.json ("http" profili)
const LOCAL_API_URL = 'http://localhost:5103'

/**
 * Dev serverdagi `/api` proxy manzili rejimga qarab tanlanadi:
 * - `pnpm dev`      → lokal backend (localhost:5103)
 * - `pnpm dev:test` → test server (api-test.zucco.uz); lokal backend kerak emas.
 * Proxy orqali so'rov brauzer uchun bir xil origin'dan ketadi, shuning uchun CORS to'sig'i bo'lmaydi.
 * Prod API ataylab qo'shilmagan: lokal tajribalar haqiqiy ma'lumotga tegmasligi kerak.
 */
const API_PROXY_TARGETS: Record<string, string> = {
  development: LOCAL_API_URL,
  staging: 'https://api-test.zucco.uz',
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: DEV_SERVER_PORT,
    proxy: {
      '/api': {
        target: API_PROXY_TARGETS[mode] ?? LOCAL_API_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}))
