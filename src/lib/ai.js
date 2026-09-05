/**
 * Intern X AI — client-side service.
 *
 * The widget never talks to Groq directly: it POSTs to our own same-origin
 * backend  POST /api/chat  (Vercel serverless function in prod, Vite dev
 * middleware locally). The API key lives ONLY on the server — nothing secret
 * ships in this bundle.
 *
 * Backend contract:
 *   →  { role, message, messages? }
 *   ←  200 { reply } | 4xx/5xx { error }  → caller falls back to the
 *      role-specific canned demo reply (demoReplyFor) so the hackathon
 *      demo never breaks — offline answers are keyword-matched to feel
 *      genuinely responsive instead of repeating one frozen sentence.
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
    // Keyword-matched offline demo brain — first rule that matches wins.
    demoBrain: [
      {
        match: /interview|mock|prep/i,
        reply:
          "Mock question: “Explain React's virtual DOM and how reconciliation decides which nodes to update.” Give it a shot, then ask me for the model answer — plus one follow-up an interviewer would ask.",
      },
      {
        match: /react|component|hook|jsx|frontend|virtual dom/i,
        reply:
          "React in one breath: a component-based UI library with one-way data flow. UI = f(state) — state changes trigger a re-render, and hooks like useState/useEffect manage state and side effects. Next step: rebuild your portfolio cards with useReducer to really feel it. Want a 3-step practice plan?",
      },
      {
        match: /resume|cv|portfolio/,
        reply:
          "Résumé tip: lead every bullet with an impact metric — “cut render time 40% with memoization” beats “worked on performance”. Your JARVIS bot project is a strong top item. Send me a bullet and I'll tighten it.",
      },
      {
        match: /skill|learn|roadmap|course|next|study/i,
        reply:
          "Suggested path for you: solidify modern JS (array methods, async/await) → TypeScript fundamentals → one testing framework (Vitest). Recruiters flag TypeScript in 68% of your target roles.",
      },
      {
        match: /internship|apply|job|placement|offer/i,
        reply:
          "Application strategy: your 94% TechCorp match is worth a tailored note — mention the exact skill listed in the JD. Apply within 24h of posting; your tracker shows recruiters who view Digital CVs respond 2× more.",
      },
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
    demoBrain: [
      {
        match: /job description|jd|posting|draft|write/i,
        reply:
          "JD formula that converts: a punchy 2-line mission, max 4 must-haves (not 12 wishlist items), one “you'll love it here” perk, and a visible stipend band. Tell me the role and I'll draft the full post.",
      },
      {
        match: /screen|shortlist|rubric|ats|filter/i,
        reply:
          "Screening rubric for freshers: 40% project depth, 25% skill-assessment score, 20% structured answers, 15% communication. Your ATS already ranks Saksham V. at 95% for the frontend role — worth an interview slot.",
      },
      {
        match: /talent|campus|cohort|hire|candidate|university/i,
        reply:
          "Strongest campus signal this week: Quantum University CSE 2nd-years — 85% frontend proficiency. A weekend hackathon + speed-interview day there builds pipeline fast. Want the outreach template?",
      },
      {
        match: /stipend|salary|offer|pay|ctc/i,
        reply:
          "Benchmark: ₹15–20K/month wins offers for remote frontend interns across tier-1 campus circuits; add a weekly mentorship touchpoint — it costs nothing and closes most dropouts.",
      },
      {
        match: /workshop|hackathon|mentor|l&d|learning/i,
        reply:
          "Your Cloud Architecture Workshop (45 enrolled) is your best employer-branding asset — cap it with a pitch day and auto-shortlist the top 10% for internships.",
      },
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
    demoBrain: [
      {
        match: /cohort|gap|student|class|analytics|struggl/i,
        reply:
          "Cohort read: B.Tech CSE 2nd Year is 85% proficient on Frontend (React/Vite) but shows a 60% skill gap in Advanced System Design and Database Indexing. Recommended: case-study modules before the placement drive.",
      },
      {
        match: /grant|fund|r&d|research|funding/i,
        reply:
          "Grant tip: TechCorp's React-rendering R&D problem (₹50K) maps neatly onto a performance-engineering elective — a joint lab proposal with 2 student RAs would score very well.",
      },
      {
        match: /syllabus|curriculum|module|course|teach/i,
        reply:
          "Curriculum nudge: insert a 2-week module on load balancing + B-tree indexing right before placement season — it directly closes your cohort's biggest flagged gap at roughly 4 lab hours per week.",
      },
      {
        match: /proposal|consult|industry/i,
        reply:
          "Proposal skeleton: problem restatement → method → 3 milestones → measurable outcomes → team bio. Eight-week timelines get the fastest industry sign-off. Point me at a problem card and I'll draft section one.",
      },
      {
        match: /fdp|workshop|masterclass|training/i,
        reply:
          "FDP pick: the Google AI Pro cohort (LLMs into CS Curriculum) starts Sep 12 with 8 seats left — its teaching-kit slides convert directly into a guest-lecture series for your 3rd-years.",
      },
    ],
    fallback:
      "I've analyzed the recent cohort data. Would you like a breakdown of the specific concepts they are struggling with?",
  },
}

/**
 * Offline demo answer: keyword-match the user's message against the persona's
 * demo brain; fall back to the persona's stock line when nothing matches.
 * Keeps hackathon demos conversational even without a server-side API key.
 */
export function demoReplyFor(role, message = '') {
  const persona = AI_PERSONAS[role] ?? AI_PERSONAS.student
  const hit = persona.demoBrain?.find((rule) => rule.match.test(message))
  return hit ? hit.reply : persona.fallback
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
 *   callers render the persona demo reply instead
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
