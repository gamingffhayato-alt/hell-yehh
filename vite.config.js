import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleChat } from './api/_shared.js'

/**
 * Dev mirror of the Vercel serverless function `api/chat.js` — answers
 * POST /api/chat with the exact same handler, so local development and
 * production behave identically. Server-only env vars are read with
 * loadEnv (no VITE_ prefix needed — they never enter the client bundle).
 */
function devApiPlugin() {
  return {
    name: 'intern-x-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed — use POST.' }))
          return
        }

        res.setHeader('Content-Type', 'application/json')
        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })
        req.on('end', async () => {
          try {
            const payload = JSON.parse(raw || '{}')
            const env = loadEnv(server.config.mode, process.cwd(), '')
            const { status, body } = await handleChat(payload, env)
            res.statusCode = status
            res.end(JSON.stringify(body))
          } catch (err) {
            res.statusCode = err instanceof SyntaxError ? 400 : 500
            res.end(
              JSON.stringify({
                error:
                  err instanceof SyntaxError
                    ? 'Request body must be valid JSON.'
                    : `AI backend crashed: ${err.message}`,
              }),
            )
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
})
