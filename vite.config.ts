/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxies all /v1 API requests to the backend. Requires the backend server
      // to be running at http://localhost:3000 for local development.
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            const code = (err as NodeJS.ErrnoException).code
            console.error(
              `[vite] Proxy error for /v1: ${err.message}${
                code ? ` (code: ${code})` : ''
              }. Is the backend running at http://localhost:3000?`,
            )
            if ('writeHead' in res && !res.headersSent && !res.writableEnded) {
              res.writeHead(502, { 'Content-Type': 'text/plain' })
              res.end(
                'Vite dev proxy could not reach the backend at http://localhost:3000.\n' +
                  'Please start the backend server before making /v1 API requests.',
              )
            }
          })
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
