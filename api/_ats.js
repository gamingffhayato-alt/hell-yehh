/**
 * Shared ATS analysis handler — called by BOTH:
 *   - the Vercel serverless function  api/ats-analyze.js
 *   - the Vite dev mirror in vite.config.js (same behavior locally)
 *
 * The browser extracts the resume's plain text with pdfjs-dist before calling
 * us, so this function only ever receives a few KB of text — well inside
 * serverless body limits. If the Groq key is missing OR the upstream request
 * fails/times out OR the model returns unparseable text, we fall back to a
 * pre-built mock report — the demo can never die on stage.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const UPSTREAM_TIMEOUT_MS = 15000
const MAX_INPUT_CHARS = 6000

/** System prompt: the model must act as a recruiter + ATS parser, replying
    with strict JSON in exactly this shape. */
const buildSystemPrompt = () => `You are an "Executive Tech Recruiter & ATS Algorithm" with 15 years of campus-hiring experience.
You evaluate resumes the way a modern Applicant Tracking System does: exact keyword coverage,
formatting parsability (tables, margins, fonts, columns), action-verb strength, and quantified impact.
Be strict but fair. Be specific. Never invent skills the resume does not contain.

You must respond with STRICT JSON ONLY — no markdown fences, no prose before or after —
matching this exact structure:
{
  "atsScore": 78,
  "verdict": "Strong candidate with solid fundamentals, but lacks metrics and cloud competencies.",
  "matchedKeywords": ["React", "JavaScript", "Tailwind CSS", "Git"],
  "missingKeywords": ["Docker", "CI/CD", "TypeScript", "Jest"],
  "formattingRating": "Pass",
  "strengths": ["Clear project descriptions", "Relevant coursework listed"],
  "weaknesses": ["No quantified outcomes (percentages or metrics)", "Missing live deployment links"],
  "actionableRecommendations": [
    "Add metrics to your experience (e.g., 'improved load time by 25%').",
    "Include TypeScript keywords in your frontend projects."
  ]
}

Rules:
- atsScore is an integer 0–100 for the given target role.
- matchedKeywords = skills actually present in the resume text (max 10).
- missingKeywords = high-value ATS keywords for the target role that are absent (max 10).
- formattingRating is exactly "Pass", "Needs Work", or "Fail".
- strengths = 2–4 short items; weaknesses = 2–4 short items; actionableRecommendations = 3–5 concrete, imperative fixes.
- JSON only. No commentary.`

/** Fallback report — returned on ANY failure path (84% match for the demo). */
const mockReport = (targetRole) => ({
  atsScore: 84,
  verdict: `Strong ${targetRole} profile — solid core stack and projects, docking a few points for missing metrics and deployment evidence.`,
  matchedKeywords: ['React', 'JavaScript', 'Tailwind CSS', 'Git', 'Node.js', 'REST APIs'],
  missingKeywords: ['TypeScript', 'Docker', 'CI/CD', 'Jest'],
  formattingRating: 'Pass',
  strengths: [
    'Clean single-column layout — fully parseable by ATS engines',
    'Clear project descriptions with tech stack named',
    'Relevant coursework and certifications listed',
  ],
  weaknesses: [
    'No quantified outcomes (percentages, user counts, latency numbers)',
    'Missing live deployment or portfolio links for projects',
    'Summary section reads generic — no role-specific keywords',
  ],
  actionableRecommendations: [
    'Add metrics to every role (e.g., "improved load time by 25%").',
    'Weave TypeScript into your frontend project bullets.',
    'Link live demos (Vercel/Netlify) next to each project.',
    'Tailor the summary line to the exact job title you target.',
  ],
})

/** Clamp/normalize model output into the contract the UI renders. */
function coerce(raw, targetRole) {
  const arr = (v, max = 10) =>
    Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).slice(0, max) : []
  const score = Number(raw?.atsScore)
  const fallback = mockReport(targetRole)
  return {
    atsScore: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback.atsScore,
    verdict: typeof raw?.verdict === 'string' && raw.verdict.trim() ? raw.verdict.trim() : fallback.verdict,
    matchedKeywords: arr(raw?.matchedKeywords).length ? arr(raw?.matchedKeywords) : fallback.matchedKeywords,
    missingKeywords: arr(raw?.missingKeywords).length ? arr(raw?.missingKeywords) : fallback.missingKeywords,
    formattingRating: ['Pass', 'Needs Work', 'Fail'].includes(raw?.formattingRating)
      ? raw.formattingRating
      : fallback.formattingRating,
    strengths: arr(raw?.strengths, 5).length ? arr(raw?.strengths, 5) : fallback.strengths,
    weaknesses: arr(raw?.weaknesses, 5).length ? arr(raw?.weaknesses, 5) : fallback.weaknesses,
    actionableRecommendations: arr(raw?.actionableRecommendations, 6).length
      ? arr(raw?.actionableRecommendations, 6)
      : fallback.actionableRecommendations,
  }
}

export async function handleAts(payload, env) {
  const resumeText = String(payload?.resumeText ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_INPUT_CHARS)
  const targetRole = String(payload?.targetRole ?? 'Frontend Developer').trim().slice(0, 80) || 'Frontend Developer'

  if (resumeText.length < 80) {
    return { status: 400, body: { error: 'resumeText is missing or too short to analyze.' } }
  }

  const key = env?.AI_API_KEY

  /* No key → instant mock. Any network/timeout/parse failure → mock as well. */
  if (key) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        signal: controller.signal,
        body: JSON.stringify({
          /* Strictly openai/gpt-oss-20b — matches the global AI config
             (same model the chat widget uses; overridable without redeploy). */
          model: env?.AI_ATS_MODEL || 'openai/gpt-oss-20b',
          temperature: 0.3,
          max_tokens: 900,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            {
              role: 'user',
              content: `TARGET ROLE: ${targetRole}\n\nRESUME TEXT:\n${resumeText}\n\nReturn ONLY the strict JSON report.`,
            },
          ],
        }),
      })
      clearTimeout(timer)
      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        console.error(`ATS upstream ${res.status}: ${errText.slice(0, 200)}`)
        throw new Error(`upstream ${res.status}`)
      }
      const data = await res.json()
      const rawText = String(data?.choices?.[0]?.message?.content ?? '')
      /* Tolerate models that wrap JSON in markdown fences */
      const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/^[^{\[]*/, '').replace(/[^}\]]*$/, '')
      const parsed = JSON.parse(cleaned)
      return { status: 200, body: coerce(parsed, targetRole) }
    } catch (err) {
      console.error('ATS analysis fell back to mock:', err.message)
    }
  }
  return { status: 200, body: { ...mockReport(targetRole), demo: true } }
}
