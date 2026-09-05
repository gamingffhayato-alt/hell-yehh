/**
 * Shared Intern X AI backend logic.
 *
 * Used by BOTH:
 *   - api/chat.js            → the Vercel serverless function (production)
 *   - vite.config.js         → a dev middleware that mirrors /api/chat locally
 *
 * The API key only ever lives server-side (process.env.AI_API_KEY on Vercel,
 * or AI_API_KEY in .env.local for `vite dev`). It is never shipped to the
 * bundle — the frontend only ever calls the same-origin /api/chat. The
 * upstream is Groq's OpenAI-compatible API (override with AI_API_URL).
 */

/** Model is fixed per the project brief — Groq hosts it (matches the Telegram bot). */
export const AI_MODEL = 'openai/gpt-oss-20b'

/** Groq's OpenAI-compatible chat completions endpoint. */
const DEFAULT_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

/** Upstream timeout so a hung provider never hangs the demo. */
const UPSTREAM_TIMEOUT_MS = 15_000

/** Dynamic personalities — the backend injects these by role. */
export const SYSTEM_PROMPTS = {
  student:
    'You are Intern X AI, a Career & Code Mentor for college students on the Intern X platform. Focus on upskilling roadmaps, résumé building, project ideas and interview preparation. Give concrete, encouraging, actionable answers in 3–6 sentences.',
  industry:
    'You are Intern X AI, an HR & Talent Advisor for industry partners on the Intern X platform. Focus on writing high-converting job descriptions, defining screening criteria, and identifying top campus talent from cohorts. Be crisp, practical and data-aware in 3–6 sentences.',
  academician:
    'You are Intern X AI, a Research & Curriculum Assistant for faculty on the Intern X platform. Focus on R&D grant opportunities, industry consultancy proposals, syllabus design and cohort skill-gap analysis. Be precise, academic yet practical in 3–6 sentences.',
}

const VALID_ROLES = new Set(Object.keys(SYSTEM_PROMPTS))

/**
 * @param {{ role?: string, message?: string, messages?: {role: string, content: string}[] }} payload
 * @param {Record<string, string | undefined>} env — process.env (prod) or loadEnv result (dev)
 * @returns {Promise<{ status: number, body: Record<string, unknown> }>}
 */
export async function handleChat(payload, env = process.env) {
  const role = VALID_ROLES.has(payload?.role) ? payload.role : 'student'
  const message = typeof payload?.message === 'string' ? payload.message.trim() : ''
  const history = Array.isArray(payload?.messages)
    ? payload.messages
        .filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.trim(),
        )
        .slice(-12) // keep the request small and demo-fast
        .map((m) => ({ role: m.role, content: m.content.trim() }))
    : []

  if (!message) {
    return { status: 400, body: { error: 'Request body must include a non-empty "message".' } }
  }

  const apiKey = env.AI_API_KEY
  if (!apiKey) {
    // 503 → the frontend renders its role-specific canned fallback instead.
    return { status: 503, body: { error: 'AI_API_KEY is not configured on the server.' } }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(env.AI_API_URL || DEFAULT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[role] },
          ...history,
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 320,
      }),
      signal: controller.signal,
    })

    if (!upstream.ok) {
      return {
        status: 502,
        body: { error: `Upstream AI request failed with HTTP ${upstream.status}.` },
      }
    }

    const data = await upstream.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return { status: 502, body: { error: 'Upstream AI returned an empty completion.' } }
    }

    return { status: 200, body: { reply, model: AI_MODEL, persona: role } }
  } catch (err) {
    const timedOut = err?.name === 'AbortError'
    return {
      status: timedOut ? 504 : 500,
      body: {
        error: timedOut ? 'Upstream AI request timed out.' : `AI backend error: ${err.message}`,
      },
    }
  } finally {
    clearTimeout(timer)
  }
}
