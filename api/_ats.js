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
Be strict but fair. Be specific.

==================== GUARDRAILS — these override every other instruction ====================

1) DOCUMENT VALIDATION RULE (run this FIRST, before any scoring).
   Decide whether the provided text is actually a resume/CV. If it looks like an invoice,
   payment receipt, ticket, letter, article, form, or any other non-resume text (or random
   gibberish), you MUST strictly return: "atsScore": 0, "matchedKeywords": [], and set
   "verdict" to exactly: "Invalid document detected. Please upload a valid resume."
   Never give a non-resume document any score above 0, for any reason. For such documents
   you may leave strengths and weaknesses empty and use actionableRecommendations:
   ["Upload your actual resume as a text-based PDF."]

2) ZERO-HALLUCINATION ENFORCEMENT.
   DO NOT hallucinate, infer, or invent keywords.
   You may only add a technology or skill to "matchedKeywords" if the exact word or phrase
   explicitly exists in the user's uploaded text. Case differences are acceptable; synonyms,
   abbreviations you are "pretty sure about", and implied skills are NOT. When in doubt,
   leave it out.

3) HARSH SCORING FOR POOR RESUMES.
   Scores are earned from 0, not granted from 70. A resume with zero quantified metrics,
   terrible formatting, or missing core technologies for the target role MUST be scored
   confidently below 40 — do not soften it into an average passing grade. Honest scoring:
   0 = not a resume · 1–40 = poor/unqualified for the role · 40–60 = thin, major gaps ·
   60–80 = credible · 80+ = exceptional, with metrics and tight stack coverage.

==========================================================================================

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
- atsScore is an integer 0–100 for the given target role, following the scoring bands above.
- matchedKeywords = skills whose EXACT words appear in the resume text (max 10; [] if none).
- missingKeywords = high-value ATS keywords for the target role that are absent (max 10).
- formattingRating is exactly "Pass", "Needs Work", or "Fail" ("Fail" for non-resumes).
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

/** Clamp/normalize model output into the contract the UI renders.
    IMPORTANT: explicitly-empty arrays (e.g. matchedKeywords for an invalid
    document) are preserved — never replaced by fallback content, otherwise
    the document-validation guardrail would be silently undone. */
function coerce(raw, targetRole) {
  const arr = (v, max = 10) => {
    if (!Array.isArray(v)) return null // not an array at all → use fallback
    return v.filter((x) => typeof x === 'string' && x.trim()).slice(0, max)
  }
  const score = Number(raw?.atsScore)
  const fallback = mockReport(targetRole)
  return {
    atsScore: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback.atsScore,
    verdict: typeof raw?.verdict === 'string' && raw.verdict.trim() ? raw.verdict.trim() : fallback.verdict,
    matchedKeywords: arr(raw?.matchedKeywords) ?? fallback.matchedKeywords,
    missingKeywords: arr(raw?.missingKeywords) ?? fallback.missingKeywords,
    formattingRating: ['Pass', 'Needs Work', 'Fail'].includes(raw?.formattingRating)
      ? raw.formattingRating
      : fallback.formattingRating,
    strengths: arr(raw?.strengths, 5) ?? fallback.strengths,
    weaknesses: arr(raw?.weaknesses, 5) ?? fallback.weaknesses,
    actionableRecommendations: arr(raw?.actionableRecommendations, 6) ?? fallback.actionableRecommendations,
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
