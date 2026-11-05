import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import contactHandler from './api/contact.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-api-contact',
      configureServer(server) {
        server.middlewares.use('/api/contact', (req, res) => {
          void contactHandler(req, res)
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/contact', (req, res) => {
          void contactHandler(req, res)
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
