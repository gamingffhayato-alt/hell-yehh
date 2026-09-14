import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {
  ArrowRightIcon,
  ChevronDownIcon,
  DownloadIcon,
  SparklesIcon,
} from './Icons'
import BackButton from './BackButton'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const MAX_BYTES = 5 * 1024 * 1024
const MAX_PAGES = 8
const MAX_CHARS = 6500
const ROLES = ['Frontend Developer', 'Backend Engineer', 'Data Analyst', 'Custom Role']
const STAGES = [
  'Extracting text from your resume…',
  'Analyzing your profile…',
  'Checking key skills…',
  'Finalizing your report…',
]

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-20b'

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) CV analyzer. Compare the provided CV text against the target Job Description (or general industry standards if none provided). You MUST output your response EXACTLY in this format, with no conversational filler before or after:

### 1. Keyword Analysis
**Present Keywords:** [comma-separated list of matched skills/keywords]
**Missing Keywords:** [comma-separated list of missing skills/keywords]

### 2. Detailed Feedback
[Write exactly 5 to 6 lines describing specific mistakes, formatting errors, and missing skills in the CV. Be direct, constructive, and actionable.]`

function getGroqKey() {
  const viteKey = import.meta.env?.VITE_GROQ_API_KEY
  if (viteKey) return viteKey
  const fallback =
    import.meta.env?.VITE_ASS_KEY ||
    import.meta.env?.VITE_AI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GROQ_API_KEY || process.env?.ASS_KEY || process.env?.AI_API_KEY : '')
  return fallback || ''
}

async function extractPdfText(file) {
  const buf = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: buf }).promise
  const pages = Math.min(doc.numPages, MAX_PAGES)
  let text = ''
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    text += `${content.items.map((it) => it.str).join(' ')}\n`
  }
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)
}

function Kbd({ children, tone }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tone}`}>
      {children}
    </span>
  )
}

function AnalysisCard({ title, tone, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-slate-800/60"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${tone}`} />
        <span className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</span>
        <ChevronDownIcon
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-slate-800">{children}</div>}
    </div>
  )
}

function parseGroqResponse(raw) {
  if (!raw) return { present: [], missing: [], feedback: '', sections: [] }
  const sections = raw.split(/###\s*/g).map((s) => s.trim()).filter(Boolean)
  let present = []
  let missing = []
  let feedback = ''

  const presentMatch = raw.match(/\*\*Present Keywords:\*\*\s*([^\n]+)/i)
  if (presentMatch) {
    present = presentMatch[1].split(',').map((k) => k.trim().replace(/^\[|\]$/g, '').trim()).filter(Boolean)
  }
  const missingMatch = raw.match(/\*\*Missing Keywords:\*\*\s*([^\n]+)/i)
  if (missingMatch) {
    missing = missingMatch[1].split(',').map((k) => k.trim().replace(/^\[|\]$/g, '').trim()).filter(Boolean)
  }
  const feedbackMatch = raw.split(/###\s*2\. Detailed Feedback/i)[1]
  if (feedbackMatch) {
    feedback = feedbackMatch.trim()
  } else {
    feedback = sections[sections.length - 1] || ''
    feedback = feedback.replace(/\*\*Present Keywords:\*\*.*\n?/i, '').replace(/\*\*Missing Keywords:\*\*.*\n?/i, '').trim()
  }
  return { present, missing, feedback, sections, raw }
}

export default function AtsScanner({ notify }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [role, setRole] = useState('Frontend Developer')
  const [customRole, setCustomRole] = useState('')
  const [stage, setStage] = useState('idle')
  const [stageIdx, setStageIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [groqText, setGroqText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const timers = useRef([])

  const effectiveRole = role === 'Custom Role' ? customRole.trim() || 'General Role' : role

  useEffect(() => () => timers.current.forEach(clearInterval), [])

  const clearTimers = () => {
    timers.current.forEach(clearInterval)
    timers.current = []
  }

  const acceptFile = (f) => {
    if (!f) return
    const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
    if (!isPdf) return notify?.('Only PDF resumes are supported — export yours as PDF first')
    if (f.size > MAX_BYTES) return notify?.('That file is too large — please upload a file under 5 MB')
    setGroqText('')
    setParsed(null)
    setError('')
    setStage('idle')
    setFile(f)
    setProgress(0)
  }

  const startScan = async () => {
    if (!file || stage === 'scanning') return
    if (role === 'Custom Role' && !customRole.trim()) return notify?.('Please enter your target role first')

    const GROQ_KEY = getGroqKey()
    if (!GROQ_KEY) {
      setError('Service temporarily unavailable — please try again in a moment.')
      notify?.('Service temporarily unavailable')
      return
    }

    setStage('scanning')
    setStageIdx(0)
    setProgress(6)
    setGroqText('')
    setParsed(null)
    setError('')

    timers.current.push(setInterval(() => setStageIdx((i) => (i + 1) % STAGES.length), 1200))
    timers.current.push(
      setInterval(() => setProgress((p) => (p < 88 ? p + Math.random() * 4 : p)), 280),
    )

    try {
      const cvText = await extractPdfText(file)
      if (cvText.length < 80) {
        clearTimers()
        setStage('idle')
        setProgress(0)
        return notify?.('Could not read text from that file — it may be a scanned image. Please export as a text-based PDF.')
      }

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Target Job Role / Job Description: ${effectiveRole}\n\nCV Text:\n${cvText}\n\nAnalyze per the required format exactly.`,
        },
      ]

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.3,
          max_tokens: 1200,
          messages,
        }),
      })

      if (!res.ok) {
        const errTxt = await res.text().catch(() => '')
        throw new Error(`Request failed (${res.status})`)
      }

      const data = await res.json()
      const content = data?.choices?.[0]?.message?.content?.trim() || ''
      if (!content) throw new Error('Empty response')

      clearTimers()
      setProgress(100)
      setTimeout(() => {
        setGroqText(content)
        const p = parseGroqResponse(content)
        setParsed(p)
        setStage('done')
        notify?.(`Scan complete — ${p.present.length} matching skills found`)
      }, 300)
    } catch (err) {
      clearTimers()
      setStage('idle')
      setProgress(0)
      setError('Something went wrong while analyzing — please try again.')
      notify?.('Scan failed — please try again')
    }
  }

  const reset = () => {
    clearTimers()
    setFile(null)
    setGroqText('')
    setParsed(null)
    setError('')
    setStage('idle')
    setProgress(0)
  }

  const scanning = stage === 'scanning'
  const hasResult = stage === 'done' && parsed

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="relative flex items-center justify-between gap-3 bg-slate-950 px-5 py-5 text-white dark:bg-black sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-amber-500/10" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-white/10 ring-1 ring-white/15">
            <DownloadIcon className="h-5 w-5 rotate-180" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold tracking-[-0.02em]">Resume Scanner</h2>
            <p className="mono mt-0.5 text-[11px] text-white/60">Instant analysis · tailored feedback</p>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <BackButton variant="circle" className="bg-white/10 text-white ring-white/10 hover:bg-white hover:text-slate-900" />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex">
          <BackButton label="Back" />
        </div>

        {!hasResult || scanning ? (
          <>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]) }}
              className={`relative block cursor-pointer overflow-hidden rounded-[16px] border-2 border-dashed p-6 text-center transition ${
                dragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-slate-300 bg-slate-50/60 hover:border-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-white'
              }`}
            >
              {scanning && (
                <span className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-indigo-400/20 to-transparent" />
              )}
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => { acceptFile(e.target.files?.[0]); e.target.value = '' }}
                disabled={scanning}
              />
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <SparklesIcon className="h-5 w-5" />
              </span>
              {file ? (
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                  {file.name}
                  <span className="ml-2 text-xs font-medium text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                </p>
              ) : (
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                  Drag & drop your resume, or click to browse
                </p>
              )}
              <p className="mono mt-1 text-[11px] text-slate-500 dark:text-slate-400">PDF only · max 5 MB</p>
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={scanning}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-9 text-sm font-medium text-slate-800 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 disabled:opacity-60"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {role === 'Custom Role' && (
                <input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Enter your target role"
                  disabled={scanning}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 disabled:opacity-60"
                />
              )}
              <button
                onClick={startScan}
                disabled={!file || scanning}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:shrink-0"
              >
                {scanning ? 'Analyzing...' : 'Scan resume'}
                {!scanning && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </div>

            {scanning && (
              <div className="mt-5 rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span key={stageIdx} className="animate-pulse text-slate-900 dark:text-white">
                    {STAGES[stageIdx]}
                  </span>
                  <span className="mono text-slate-400">{Math.min(99, Math.round(progress))}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-slate-900 transition-all duration-300 dark:bg-white" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-[12px] bg-rose-50 p-3 text-[12px] leading-5 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                {error}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between">
              <p className="mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Your report</p>
              <button onClick={reset} className="mono text-[11px] font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white">
                ← Scan another
              </button>
            </div>

            {parsed.sections.map((sec, idx) => {
              const isKeyword = /1\. Keyword Analysis/i.test(sec)
              const isFeedback = /2\. Detailed Feedback/i.test(sec)
              const cleanTitle = sec.split('\n')[0].replace(/^\d+\.\s*/, '').trim()

              if (isKeyword) {
                return (
                  <div key={idx} className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <p className="mono text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Present Skills · {parsed.present.length}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {parsed.present.length ? parsed.present.map((k) => (
                          <Kbd key={k} tone="bg-emerald-100 text-emerald-700 ring-emerald-300/50 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/20">{k}</Kbd>
                        )) : <span className="mono text-[11px] text-slate-500">None detected</span>}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                      <p className="mono text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        Skills to Add · {parsed.missing.length}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {parsed.missing.length ? parsed.missing.map((k) => (
                          <Kbd key={k} tone="bg-white text-amber-700 ring-amber-300/60 dark:bg-slate-800 dark:text-amber-300 dark:ring-amber-400/20">{k}</Kbd>
                        )) : <span className="mono text-[11px] text-slate-500">Well covered</span>}
                      </div>
                    </div>
                  </div>
                )
              }

              if (isFeedback) {
                return (
                  <AnalysisCard key={idx} title={cleanTitle || 'Detailed Feedback'} tone="bg-slate-900 dark:bg-white" defaultOpen>
                    <div className="space-y-2">
                      {parsed.feedback.split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} className="flex gap-2 text-[12px] leading-6 text-slate-700 dark:text-slate-200">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          <span>{line.replace(/^[-•]\s*/, '').trim()}</span>
                        </p>
                      ))}
                    </div>
                  </AnalysisCard>
                )
              }

              return (
                <AnalysisCard key={idx} title={cleanTitle} tone="bg-indigo-500" defaultOpen>
                  <p className="whitespace-pre-wrap text-[12px] leading-6 text-slate-600 dark:text-slate-300">{sec.split('\n').slice(1).join('\n').trim()}</p>
                </AnalysisCard>
              )
            })}

            <div className="rounded-[14px] bg-slate-950 p-4 text-white dark:bg-black">
              <p className="mono text-[11px] uppercase tracking-[0.08em] text-white/60">Next steps</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-white/80">
                <li>Add 2–3 missing skills into project descriptions where relevant</li>
                <li>Keep formatting clean: single column, clear headings</li>
                <li>Rescan after updates to track improvements</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan-sweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        .animate-scan-sweep { animation: scan-sweep 1.2s linear infinite; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      `}</style>
    </section>
  )
}
