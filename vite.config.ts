import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
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

const API_URL_ENV_KEY = 'VITE_API_URL'
const ENV_PREFIX = 'VITE_'

/**
 * Build paytida API manzili majburiy: aks holda deploy qilingan ilova qaysi backendga ulanishini taxmin qilishga majbur bo'ladi.
 * `loadEnv` `.env*` fayllarni ham, CI/Vercel environment o'zgaruvchilarini ham o'qiydi.
 */
function assertApiUrlForBuild(mode: string): void {
  const apiUrl = loadEnv(mode, process.cwd(), ENV_PREFIX)[API_URL_ENV_KEY]
  if (!apiUrl) {
    throw new Error(
      `${API_URL_ENV_KEY} o'rnatilmagan. Build uchun backend manzilini bering (masalan ${API_URL_ENV_KEY}=https://api.zucco.uz). .env.example ga qarang.`
    )
  }
  if (!URL.canParse(apiUrl)) {
    throw new Error(`${API_URL_ENV_KEY} to'g'ri URL emas: "${apiUrl}"`)
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') assertApiUrlForBuild(mode)

  return {
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
  }
})
