import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import contactHandler from './api/contact.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const injectLocalServerEnv = () => {
    const env = loadEnv(mode, process.cwd(), '')
    for (const [key, value] of Object.entries(env)) {
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-contact',
        configureServer(server) {
          injectLocalServerEnv()
          server.middlewares.use('/api/contact', (req, res) => {
            void contactHandler(req, res)
          })
        },
        configurePreviewServer(server) {
          injectLocalServerEnv()
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
  }
})
