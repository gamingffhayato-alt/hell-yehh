/**
 * Shared Assessment backend — Groq-powered, uses ASS_KEY only (never AI_API_KEY)
 *
 * Two handlers:
 * - handleAssessmentGenerate: generates 5 coding questions live via Groq
 * - handleAssessmentGrade: grades .txt submission against generated questions
 *
 * Key lives server-side only: process.env.ASS_KEY (Vercel) / ASS_KEY in .env.local
 * Never shipped to client bundle — same pattern as api/_shared.js
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const UPSTREAM_TIMEOUT_MS = 20000
const MODEL = 'openai/gpt-oss-20b'

const GENERATE_SYSTEM = `You are an expert coding assessment generator for Intern X, a placement platform for Indian engineering students.
Generate EXACTLY 5 coding questions, varied difficulty (2 Easy, 2 Medium, 1 Hard), covering DSA, JavaScript/React, and practical problem solving relevant to 2026 hiring.

You must respond with STRICT JSON ONLY — no markdown, no prose — matching this shape:
{
  "title": "Intern X — Full-Stack & DSA Assessment",
  "duration": "45 mins",
  "questions": [
    {
      "id": 1,
      "title": "Two Sum Variant",
      "difficulty": "Easy",
      "topic": "Arrays",
      "description": "Detailed problem statement...",
      "input": "Example input...",
      "output": "Example output...",
      "constraints": "Constraints...",
      "hints": "Optional hint"
    }
  ]
}

Rules:
- Exactly 5 questions, ids 1-5
- Difficulty must be Easy, Medium, or Hard
- Description must be complete and self-contained
- Input/Output examples must be concrete
- No markdown fences, only raw JSON
- Questions must be original, not copied from LeetCode verbatim
- Mix of DSA and practical JS/React
`

const GRADE_SYSTEM = `You are an expert coding assessment grader for Intern X.
You will receive:
- The 5 questions that were asked
- The student's answers as plain text (from a .txt file they uploaded)

You must evaluate each answer for correctness, approach, edge cases, and clarity.
Respond with STRICT JSON ONLY — no markdown — matching:
{
  "totalScore": 78,
  "maxScore": 100,
  "summary": "Overall feedback in 2-3 sentences...",
  "perQuestion": [
    {
      "id": 1,
      "score": 15,
      "maxScore": 20,
      "verdict": "Correct / Partial / Incorrect",
      "feedback": "Specific feedback..."
    }
  ],
  "strengths": ["..."],
  "improvements": ["..."],
  "recommendation": "What to study next..."
}

Rules:
- totalScore is sum of perQuestion scores, max 100
- Be fair but strict — 0 for blank/nonsense, partial for approach without code
- No markdown, only raw JSON
`

function mockQuestions() {
  return {
    title: 'Intern X — Full-Stack & DSA Assessment (Demo)',
    duration: '45 mins',
    demo: true,
    questions: [
      {
        id: 1,
        title: 'Array Chunking Utility',
        difficulty: 'Easy',
        topic: 'JavaScript',
        description: 'Write a function chunk(arr, size) that splits an array into groups of given size. Return empty array if size <=0.',
        input: 'chunk([1,2,3,4,5], 2) => [[1,2],[3,4],[5]]',
        output: '[[1,2],[3,4],[5]]',
        constraints: 'O(n) time, handle edge cases',
        hints: 'Use slice in a loop',
      },
      {
        id: 2,
        title: 'Valid Parentheses Checker',
        difficulty: 'Easy',
        topic: 'Stack',
        description: 'Given a string containing only ()[]{} , determine if brackets are closed correctly and nested properly.',
        input: '"{[()]}" => true, "{[(])}" => false',
        output: 'boolean',
        constraints: 'Use stack, O(n)',
        hints: 'Map closing to opening',
      },
      {
        id: 3,
        title: 'Debounce Implementation',
        difficulty: 'Medium',
        topic: 'JavaScript',
        description: 'Implement debounce(fn, delay) that returns a debounced version. It should invoke fn after delay ms since last call, with correct this and args.',
        input: 'const d = debounce(log, 300); d(); d(); // only last calls after 300ms',
        output: 'Function',
        constraints: 'Handle this, clearTimeout, leading/trailing optional',
        hints: 'Closure + setTimeout',
      },
      {
        id: 4,
        title: 'LRU Cache',
        difficulty: 'Medium',
        topic: 'System Design',
        description: 'Design LRUCache with get(key) and put(key,value). Both O(1). Evict least recently used when capacity exceeded.',
        input: 'cache = LRUCache(2); put(1,1); put(2,2); get(1) => 1; put(3,3) evicts 2',
        output: 'See description',
        constraints: 'Use Map + Doubly Linked List or Ordered Map',
        hints: 'Map preserves insertion order in JS',
      },
      {
        id: 5,
        title: 'React List Virtualization',
        difficulty: 'Hard',
        topic: 'React',
        description: 'You have 100k items. Design a virtualized list component that only renders visible rows + overscan. Explain approach and provide pseudo-code for calculating start/end indices from scrollTop, containerHeight, rowHeight.',
        input: 'Props: items, rowHeight=40, containerHeight=600, scrollTop',
        output: 'Explain + code',
        constraints: 'O(visible) not O(n), handle dynamic heights optionally',
        hints: 'start = floor(scrollTop/rowHeight), end = start + ceil(containerHeight/rowHeight) + overscan',
      },
    ],
  }
}

function mockGrade() {
  return {
    totalScore: 72,
    maxScore: 100,
    demo: true,
    summary: 'Solid fundamentals — JavaScript utilities correct, but LRU and virtualization need deeper edge-case handling.',
    perQuestion: [
      { id: 1, score: 18, maxScore: 20, verdict: 'Correct', feedback: 'Clean slice loop, handles size<=0. Add type check for non-array.' },
      { id: 2, score: 16, maxScore: 20, verdict: 'Correct', feedback: 'Stack approach works, missing early return for odd length.' },
      { id: 3, score: 14, maxScore: 20, verdict: 'Partial', feedback: 'Core debounce done, this binding could be clearer. Mention leading option.' },
      { id: 4, score: 12, maxScore: 20, verdict: 'Partial', feedback: 'Map order idea correct, but get should move key to end to mark recent use.' },
      { id: 5, score: 12, maxScore: 20, verdict: 'Partial', feedback: 'Start/end calc correct, add overscan and estimate for dynamic heights.' },
    ],
    strengths: ['Strong JS fundamentals', 'Clear explanations', 'Good edge-case awareness on Easy'],
    improvements: ['Practice O(1) LRU with explicit doubly linked list', 'Add virtualization buffer and scroll anchoring'],
    recommendation: 'Next: Build a tiny virtualized list in React and benchmark vs non-virtualized for 10k rows.',
  }
}

function coerceQuestions(raw) {
  try {
    if (!raw || typeof raw !== 'object') return null
    const qs = raw.questions
    if (!Array.isArray(qs) || qs.length !== 5) return null
    // basic validation
    for (const q of qs) {
      if (!q.id || !q.title || !q.description) return null
    }
    return {
      title: raw.title || 'Intern X — Coding Assessment',
      duration: raw.duration || '45 mins',
      questions: qs.slice(0, 5),
    }
  } catch {
    return null
  }
}

function coerceGrade(raw) {
  try {
    if (!raw || typeof raw !== 'object') return null
    if (typeof raw.totalScore !== 'number') return null
    if (!Array.isArray(raw.perQuestion) || raw.perQuestion.length !== 5) return null
    return raw
  } catch {
    return null
  }
}

export async function handleAssessmentGenerate(payload, env) {
  const topic = String(payload?.topic || 'Full-Stack + DSA').slice(0, 100)
  const key = env?.ASS_KEY
  const model = env?.ASS_MODEL || MODEL

  console.log('Assessment generate →', JSON.stringify({ topic, model, hasKey: Boolean(key), keyTail: key ? `…${key.slice(-4)}` : null }))

  if (!key) {
    console.warn('ASS_KEY not configured — serving mock questions')
    return { status: 200, body: mockQuestions() }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: GENERATE_SYSTEM },
          { role: 'user', content: `Generate assessment. Focus topic: ${topic}. Return ONLY JSON.` },
        ],
      }),
    })
    clearTimeout(timer)

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Groq HTTP ${res.status}: ${txt.slice(0, 400)}`)
    }
    const data = await res.json()
    let content = String(data?.choices?.[0]?.message?.content || '').replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(content)
    const coerced = coerceQuestions(parsed)
    if (!coerced) throw new Error('Invalid questions shape')
    return { status: 200, body: coerced }
  } catch (err) {
    console.error('Assessment generate failed, serving mock:', err.message)
    return { status: 200, body: mockQuestions() }
  }
}

export async function handleAssessmentGrade(payload, env) {
  const questions = payload?.questions
  const answersText = String(payload?.answersText || '').slice(0, 15000)
  const key = env?.ASS_KEY
  const model = env?.ASS_MODEL || MODEL

  console.log('Assessment grade →', JSON.stringify({ hasQuestions: Boolean(questions), answersChars: answersText.length, hasKey: Boolean(key) }))

  if (!questions || !answersText || answersText.trim().length < 10) {
    return { status: 400, body: { error: 'Missing questions or answersText (too short).' } }
  }

  if (!key) {
    console.warn('ASS_KEY not configured — serving mock grade')
    return { status: 200, body: mockGrade() }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: GRADE_SYSTEM },
          { role: 'user', content: `QUESTIONS:\n${JSON.stringify(questions, null, 2)}\n\nSTUDENT ANSWERS (from .txt):\n${answersText}\n\nReturn ONLY JSON.` },
        ],
      }),
    })
    clearTimeout(timer)

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Groq HTTP ${res.status}: ${txt.slice(0, 400)}`)
    }
    const data = await res.json()
    let content = String(data?.choices?.[0]?.message?.content || '').replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(content)
    const coerced = coerceGrade(parsed)
    if (!coerced) throw new Error('Invalid grade shape')
    return { status: 200, body: coerced }
  } catch (err) {
    console.error('Assessment grade failed, serving mock:', err.message)
    return { status: 200, body: mockGrade() }
  }
}
