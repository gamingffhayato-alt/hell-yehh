import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  DownloadIcon,
  SparklesIcon,
  XIcon,
} from './Icons'

/* Vite bundles the pdf.js worker as a static asset */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB hard cap
const MAX_PAGES = 8
const MAX_CHARS = 4500
const ROLES = ['Frontend Developer', 'Backend Engineer', 'Data Analyst', 'Custom Role']
const STAGES = [
  'Extracting text from your PDF…',
  'Comparing ATS keywords…',
  'Calculating impact score…',
  'Finalizing recruiter report…',
]

const scoreColor = (s) => (s > 80 ? '#16a34a' : s >= 60 ? '#d97706' : '#e11d48')
const verdictTone = {
  Pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Needs Work': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Fail: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
}

/** Extract plain text in-browser — only a few KB travel to the API. */
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

/** Circular score gauge — hand-rolled SVG, no chart library. */
function ScoreGauge({ score }) {
  const r = 52
  const C = 2 * Math.PI * r
  const color = scoreColor(score)
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-slate-700" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (score / 100) * C}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-extrabold tracking-tight" style={{ color }}>
            {score}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">/ 100</p>
        </div>
      </div>
    </div>
  )
}

function Kbd({ children, tone }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tone}`}>
      {children}
    </span>
  )
}

function AnalysisCard({ title, tone, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen || title === 'Formatting & ATS Readability')
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700">
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
      {open && <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-slate-700/60">{children}</div>}
    </div>
  )
}

export default function AtsScanner({ notify }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [role, setRole] = useState('Frontend Developer')
  const [customRole, setCustomRole] = useState('')
  const [stage, setStage] = useState('idle') // idle | scanning | done
  const [stageIdx, setStageIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
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
    if (!isPdf) return notify('Only PDF resumes are supported — export yours as PDF first')
    if (f.size > MAX_BYTES) return notify('That PDF is over 5 MB — compress it and try again')
    setResult(null)
    setStage('idle')
    setFile(f)
    setProgress(0)
  }

  const startScan = async () => {
    if (!file || stage === 'scanning') return
    if (role === 'Custom Role' && !customRole.trim()) return notify('Type your custom target role first')

    setStage('scanning')
    setStageIdx(0)
    setProgress(3)

    // Rotating stage labels + smooth progress to 92% while waiting on the API
    timers.current.push(setInterval(() => setStageIdx((i) => (i + 1) % STAGES.length), 1300))
    timers.current.push(
      setInterval(() => setProgress((p) => (p < 92 ? p + Math.random() * 4.5 : p)), 300),
    )

    try {
      const text = await extractPdfText(file)
      if (text.length < 80) {
        clearTimers()
        setStage('idle')
        setProgress(0)
        return notify('Could not read text from that PDF — it may be a scanned image. Export from Word/Docs as a text PDF.')
      }

      const res = await fetch('/api/ats-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({ resumeText: text, targetRole: effectiveRole }),
      })
      if (!res.ok) throw new Error(`scan failed (${res.status})`)
      const data = await res.json()

      clearTimers()
      setProgress(100)
      setTimeout(() => {
        setResult(data)
        setStage('done')
        notify(`ATS scan complete — ${data.atsScore}/100 for ${effectiveRole}${data.demo ? ' (demo result)' : ''}`)
      }, 350)
    } catch (err) {
      clearTimers()
      setStage('idle')
      setProgress(0)
      console.error('ATS scan failed:', err)
      notify('Scan failed — please try that PDF again')
    }
  }

  const reset = () => {
    clearTimers()
    setFile(null)
    setResult(null)
    setStage('idle')
    setProgress(0)
  }

  const scanning = stage === 'scanning'

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <DownloadIcon className="h-5 w-5 rotate-180" />
          </span>
          <div>
            <h2 className="text-base font-bold">AI ATS Resume Scanner</h2>
            <p className="text-xs text-violet-100">Instant recruiter-grade score, matched to your target role</p>
          </div>
        </div>
        {result?.demo && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold ring-1 ring-white/25">
            Demo result
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {!result || scanning ? (
          <>
            {/* Upload zone */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]) }}
              className={`relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition ${
                dragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-gray-300 bg-gray-50/60 hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-600 dark:bg-slate-800/40 dark:hover:border-indigo-500'
              }`}
            >
              {scanning && (
                <span className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent" />
              )}
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => { acceptFile(e.target.files?.[0]); e.target.value = '' }}
                disabled={scanning}
              />
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <SparklesIcon className="h-5 w-5" />
              </span>
              {file ? (
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {file.name}
                  <span className="ml-2 text-xs font-medium text-gray-400">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </p>
              ) : (
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  Drag &amp; drop your resume, or click to browse
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">PDF only · max 5 MB · text extracted locally before upload</p>
            </label>

            {/* Role picker + scan button */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={scanning}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-9 text-sm font-medium text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {role === 'Custom Role' && (
                <input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Growth Marketer"
                  disabled={scanning}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60"
                />
              )}
              <button
                onClick={startScan}
                disabled={!file || scanning}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
              >
                {scanning ? 'Scanning…' : 'Scan resume'}
                {!scanning && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </div>

            {/* Scanning state */}
            {scanning && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span key={stageIdx} className="animate-fade-up text-indigo-600 dark:text-indigo-300">
                    {STAGES[stageIdx]}
                  </span>
                  <span className="text-gray-400">{Math.min(99, Math.round(progress))}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          /* ------------------------------ Results ------------------------------ */
          <div className="animate-fade-up">
            {/* Score + verdict */}
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:px-2">
              <ScoreGauge score={result.atsScore} />
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                  ATS Score · {effectiveRole}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {result.verdict}
                </p>
                <button onClick={reset} className="mt-3 text-xs font-semibold text-indigo-600 transition hover:underline dark:text-indigo-300">
                  ← Scan another resume
                </button>
              </div>
            </div>

            {/* Keyword lists */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                  Matched keywords · {result.matchedKeywords.length}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map((k) => (
                    <Kbd key={k} tone="bg-emerald-100 text-emerald-700 ring-emerald-300/50 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/25">{k}</Kbd>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-500/25 dark:bg-rose-500/10">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300">
                  Missing keywords · {result.missingKeywords.length}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((k) => (
                    <Kbd key={k} tone="bg-white/80 text-rose-600 ring-rose-300/60 dark:bg-slate-800 dark:text-rose-300 dark:ring-rose-400/25">{k}</Kbd>
                  ))}
                </div>
              </div>
            </div>

            {/* Sectional analysis */}
            <div className="mt-4 space-y-2.5">
              <AnalysisCard title="Formatting & ATS Readability" tone="bg-sky-500">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Verdict:</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${verdictTone[result.formattingRating] ?? verdictTone['Needs Work']}`}>
                    {result.formattingRating}
                  </span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                  <li className="flex gap-1.5"><CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> Single-column parse check: text extracted successfully</li>
                  <li className="flex gap-1.5"><CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> Keeps margins &amp; standard fonts readable for parsers</li>
                  <li className="flex gap-1.5"><XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" /> Avoid tables/text-boxes for dates — some ATS engines drop them</li>
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Action Verbs & Impact" tone="bg-indigo-500">
                {result.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Working in your favor</p>
                    <ul className="mt-2 space-y-1.5">
                      {result.strengths.map((s) => (
                        <li key={s} className="flex gap-1.5 text-xs leading-relaxed text-gray-700 dark:text-slate-200">
                          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.weaknesses.length > 0 && (
                  <div className="mt-3.5 border-t border-gray-100 pt-3 dark:border-slate-700/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">Costing you points</p>
                    <ul className="mt-2 space-y-1.5">
                      {result.weaknesses.map((w) => (
                        <li key={w} className="flex gap-1.5 text-xs leading-relaxed text-gray-700 dark:text-slate-200">
                          <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AnalysisCard>

              <AnalysisCard title="Missing Technical & Soft Skills" tone="bg-rose-500">
                <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                  These high-value {effectiveRole} keywords never appear in your resume — weave 2–3 into project bullets where they are genuinely true:
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((k) => (
                    <Kbd key={k} tone="bg-rose-100 text-rose-700 ring-rose-300/50 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/25">{k}</Kbd>
                  ))}
                </div>
              </AnalysisCard>
            </div>

            {/* Next steps checklist */}
            <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-500/25 dark:bg-indigo-500/10">
              <p className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-200">
                <SparklesIcon className="h-4 w-4" />
                How to fix — your next 30 minutes
              </p>
              <ul className="mt-2.5 space-y-2">
                {result.actionableRecommendations.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-700 dark:text-slate-200">
                    <span className="grid mt-px h-[18px] w-[18px] shrink-0 place-items-center rounded-md border-2 border-indigo-400 text-[10px] font-bold text-indigo-500 dark:text-indigo-300">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
