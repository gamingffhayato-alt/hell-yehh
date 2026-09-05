import { handleChat } from './_shared.js'

/**
 * Vercel Serverless Function — POST /api/chat
 *
 * Body:   { role: 'student' | 'industry' | 'academician',
 *           message: string,
 *           messages?: { role: 'user' | 'assistant', content: string }[] }
 * Reply:  200 { reply, model, persona }
 *         400/405/5xx { error }  → the frontend shows its canned demo
 *         fallback so the live demo never breaks.
 *
 * Reads process.env.AI_API_KEY (+ optional AI_API_URL) — configured in the
 * Vercel dashboard; the key never reaches the client bundle.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed — use POST.' })
  }

  try {
    const { status, body } = await handleChat(req.body, process.env)
    return res.status(status).json(body)
  } catch (err) {
    return res.status(500).json({ error: `AI backend crashed: ${err.message}` })
  }
}
