import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'

export default function AssessmentPage() {
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answersText, setAnswersText] = useState('')
  const [fileName, setFileName] = useState('')
  const [grade, setGrade] = useState(null)
  const [grading, setGrading] = useState(false)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current=setTimeout(()=>setToast(null),3200) }, [])

  const generate = async () => {
    setLoading(true)
    setGrade(null)
    try {
      const res = await fetch('/api/assessment-generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: 'Full-Stack + DSA 2026' }) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setQuestions(data)
      notify(data.demo ? 'Demo assessment loaded (ASS_KEY missing on server)' : 'Live assessment generated via Groq (openai/gpt-oss-20b)')
    } catch (e) {
      notify('Generate failed — check ASS_KEY env in Vercel + /api/assessment-generate')
    } finally { setLoading(false) }
  }

  const handleFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.txt')) return notify('Upload .txt file only — per spec')
    try {
      const text = await f.text()
      if (text.trim().length < 10) return notify('.txt too short — add your answers')
      setAnswersText(text.slice(0, 15000))
      setFileName(f.name)
      notify(`Loaded ${f.name} — ${text.length} chars`)
    } catch {
      notify('Failed to read .txt')
    }
  }

  const submitGrade = async () => {
    if (!questions?.questions) return notify('Generate questions first')
    if (!answersText) return notify('Upload .txt answers first')
    setGrading(true)
    try {
      const res = await fetch('/api/assessment-grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questions: questions.questions, answersText }) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setGrade(data)
      notify(data.demo ? `Graded ${data.totalScore}/100 (demo)` : `Graded ${data.totalScore}/100 via Groq`)
    } catch {
      notify('Grading failed — check ASS_KEY env')
    } finally { setGrading(false) }
  }

  return (
    <DashboardShell activeMain="profile" activeSub="assessment" title="Assessment · AI coding test">
      <div className="max-w-[900px] space-y-6">
        <div className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-[13px] font-medium tracking-[-0.01em]">How it works</p>
          <p className="mono mt-1 text-[11px] leading-5 text-slate-500">5 questions are generated live via Groq at request time (not hardcoded) using ASS_KEY — separate serverless env from existing chat key AI_API_KEY. Key lives only in Vercel serverless function, never client. Student uploads .txt answers, AI grader returns feedback/score.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={generate} disabled={loading} className="rounded-full bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{loading?'Generating 5 questions…':'Generate 5 Questions (live via Groq)'}</button>
            {questions && <span className="mono self-center text-[11px] text-slate-500">{questions.title} · {questions.duration} {questions.demo?'· demo (ASS_KEY missing)':''}</span>}
          </div>
        </div>

        {questions && (
          <>
            <div className="space-y-3">
              {questions.questions.map(q => (
                <div key={q.id} className="rounded-[14px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`mono rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${q.difficulty==='Easy'?'bg-emerald-600':q.difficulty==='Medium'?'bg-amber-600':'bg-rose-600'}`}>{q.difficulty}</span>
                    <span className="mono text-[10px] text-slate-400">{q.topic}</span>
                    <span className="ml-auto mono text-[10px] text-slate-400">Q{q.id}</span>
                  </div>
                  <p className="mt-2 text-[13px] font-semibold tracking-[-0.01em]">{q.title}</p>
                  <p className="mt-1.5 text-[12px] leading-6 text-slate-600 dark:text-slate-300">{q.description}</p>
                  <div className="mt-3 rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/60">
                    <p className="mono text-[10px] leading-5 text-slate-500">Input: {q.input}</p>
                    <p className="mono text-[10px] leading-5 text-slate-500">Output: {q.output}</p>
                    <p className="mono mt-1 text-[10px] text-slate-400">Constraints: {q.constraints}</p>
                    {q.hints && <p className="mono mt-1 text-[10px] text-indigo-600 dark:text-indigo-300">Hint: {q.hints}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <p className="text-[12px] font-medium tracking-[-0.01em]">Upload answers as .txt</p>
              <p className="mono mt-1 text-[11px] text-slate-500">AI grader reads plain text and scores each question. No IDE needed — just .txt.</p>
              <label className="mt-4 block cursor-pointer rounded-[12px] border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-slate-900 dark:border-slate-700 dark:hover:border-white">
                <input type="file" accept=".txt,text/plain" className="hidden" onChange={handleFile} />
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-[10px] bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">📝</div>
                <p className="mt-3 text-[12px] font-medium">{fileName || 'Click to upload .txt file'}</p>
                <p className="mono mt-1 text-[10px] text-slate-500">{answersText ? `${answersText.length} chars loaded — ready to grade` : 'Student uploads .txt answers — per Task 6 spec'}</p>
              </label>
              <div className="mt-4 flex gap-2">
                <button disabled={!answersText || grading} onClick={submitGrade} className="h-9 rounded-full bg-slate-900 px-5 text-[11px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{grading?'Grading via Groq…':'Submit for AI grading'}</button>
                {answersText && <button onClick={()=>{setAnswersText(''); setFileName('')}} className="h-9 rounded-full bg-white px-4 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Clear</button>}
              </div>
            </div>
          </>
        )}

        {grade && (
          <div className="rounded-[20px] bg-slate-900 p-6 text-white dark:bg-white dark:text-slate-900">
            <div className="flex flex-wrap items-start gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white text-[20px] font-bold tracking-[-0.02em]">{grade.totalScore}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-6">{grade.summary}</p>
                <p className="mono mt-1 text-[11px] opacity-60">{grade.totalScore}/{grade.maxScore} {grade.demo?'· demo (ASS_KEY missing)':''}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(grade.perQuestion||[]).map(pq => (
                <div key={pq.id} className="rounded-[12px] bg-white/10 p-3.5 dark:bg-slate-900/10">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold">Q{pq.id} · {pq.verdict}</p>
                    <span className="mono text-[11px] font-bold">{pq.score}/{pq.maxScore}</span>
                  </div>
                  <p className="mono mt-1.5 text-[10px] leading-5 opacity-70">{pq.feedback}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[12px] bg-white/10 p-3 dark:bg-slate-900/10">
                <p className="mono text-[10px] font-semibold uppercase tracking-[0.08em] opacity-60">Strengths</p>
                <ul className="mt-2 list-disc pl-4 text-[11px] leading-5 opacity-80">{(grade.strengths||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
              </div>
              <div className="rounded-[12px] bg-white/10 p-3 dark:bg-slate-900/10">
                <p className="mono text-[10px] font-semibold uppercase tracking-[0.08em] opacity-60">To improve</p>
                <ul className="mt-2 list-disc pl-4 text-[11px] leading-5 opacity-80">{(grade.improvements||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
              </div>
            </div>

            {grade.recommendation && (
              <div className="mt-4 rounded-[12px] bg-white px-4 py-3 text-[11px] leading-5 text-slate-900 dark:bg-slate-900 dark:text-white">Recommendation: {grade.recommendation}</div>
            )}
          </div>
        )}

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
