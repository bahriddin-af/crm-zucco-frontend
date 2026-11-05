import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const DEV_SERVER_PORT = 5173
// crm-zucco-backend/backend/src/Zucco.Api/Properties/launchSettings.json ("http" profili)
const LOCAL_API_URL = 'http://localhost:5103'

// https://vite.dev/config/
export default defineConfig({
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
        target: LOCAL_API_URL,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
