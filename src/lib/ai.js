/**
 * Intern X AI — client-side service.
 *
 * The widget never talks to OpenRouter directly: it POSTs to our own
 * same-origin backend  POST /api/chat  (Vercel serverless function in prod,
 * Vite dev middleware locally). The API key lives ONLY on the server —
 * nothing secret ships in this bundle.
 *
 * Backend contract:
 *   →  { role, message, messages? }
 *   ←  200 { reply } | 4xx/5xx { error }  → caller falls back to the
 *      role-specific canned demo reply.
 */

/** Client-side watchdog — if the backend hangs, the demo must not. */
const BACKEND_TIMEOUT_MS = 20_000

/**
 * Role-aware personas (UI layer: greetings, quick starters, hackathon
 * fallbacks). The authoritative system prompts live server-side in
 * api/_shared.js and are injected by role on every request.
 */
export const AI_PERSONAS = {
  student: {
    label: 'Student',
    title: 'Career & Code Mentor',
    tagline: 'Upskilling · résumé building · interview prep',
    accent: 'indigo',
    greeting:
      "Hey! I'm your Career & Code Mentor. Ask me about skills to learn next, résumé tweaks, or interview prep — what are we working on today?",
    starters: [
      'Give me a frontend mock interview question',
      'How do I make my résumé stand out?',
      'What should I learn after React?',
    ],
    fallback:
      "Hey, I noticed you're working on your React skills. Want me to generate a mock interview question for frontend development?",
  },
  industry: {
    label: 'Industry',
    title: 'HR & Talent Advisor',
    tagline: 'Job descriptions · screening · campus talent',
    accent: 'emerald',
    greeting:
      "Welcome back! I'm your HR & Talent Advisor. I can sharpen job posts, suggest screening rubrics, or surface the strongest campus talent — where should we start?",
    starters: [
      'Tighten my React intern job description',
      'What screening rubric works for freshers?',
      'Which cohort should I hire from this month?',
    ],
    fallback:
      'I can help you draft that job description. Should we make it focused on entry-level React developers?',
  },
  academician: {
    label: 'Academician',
    title: 'Research & Curriculum Assistant',
    tagline: 'R&D grants · syllabus design · gap analysis',
    accent: 'teal',
    greeting:
      "Hello, Professor. I'm your Research & Curriculum Assistant — ask me about R&D grants, consultancy proposals, or your cohorts' skill-gap data.",
    starters: [
      'Summarize my 2nd-year cohort’s skill gaps',
      'Draft an outline for the TechCorp R&D proposal',
      'Any grants fitting a systems-design module?',
    ],
    fallback:
      "I've analyzed the recent cohort data. Would you like a breakdown of the specific concepts they are struggling with?",
  },
}

/**
 * Ask the Intern X AI backend.
 *
 * @param {object} args
 * @param {'student'|'industry'|'academician'} args.role — injected server-side
 *   into the matching system prompt
 * @param {string} args.message — the user's latest message
 * @param {{role: 'user'|'assistant', content: string}[]} [args.history]
 * @returns {Promise<string>} assistant reply text
 * @throws if the backend errors, times out, or returns an empty reply —
 *   callers render the persona fallback instead
 */
export async function askInternXAI({ role, message, history = [] }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS)

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, message, messages: history }),
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`AI backend responded with HTTP ${res.status}`)
    }

    const data = await res.json()
    const reply = data?.reply?.trim()
    if (!reply) throw new Error('AI backend returned an empty reply')
    return reply
  } finally {
    clearTimeout(timer)
  }
}
