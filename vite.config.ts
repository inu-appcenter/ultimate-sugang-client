import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 03 §7-3: 절대경로 alias `@/` 만 사용(rules/architecture.md)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
