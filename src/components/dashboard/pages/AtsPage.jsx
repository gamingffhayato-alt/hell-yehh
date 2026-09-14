import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'

export default function AtsPage() {
  const [existingResume, setExistingResume] = useState(() => {
    try { return localStorage.getItem('internx_resume_name') || '' } catch { return '' }
  })
  const [mode, setMode] = useState(existingResume ? 'choose' : 'upload')
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('Frontend Developer')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const notify = useCallback((m) => {
    clearTimeout(timer.current)
    setToast(m)
    timer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const startScan = async (f = file) => {
    if (!f) return notify('Upload a PDF first')
    setScanning(true)
    try {
      const { default: pdfjsLib } = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
      const buf = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      let text = ''
      for (let i=1;i<=Math.min(doc.numPages,8);i++) {
        const page = await doc.getPage(i)
        const c = await page.getTextContent()
        text += c.items.map(it=>it.str).join(' ') + '\n'
      }
      text = text.replace(/\s+/g,' ').trim().slice(0,4500)
      if (text.length < 80) {
        setResult({ atsScore: 0, verdict: 'Invalid document', matchedKeywords: [], missingKeywords: [], demo: false, _invalid: true })
        setMode('result')
        return
      }
      const res = await fetch('/api/ats-analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resumeText: text, targetRole: role }) })
      const data = await res.json()
      setResult(data)
      setMode('result')
      try { localStorage.setItem('internx_resume_name', f.name) } catch {}
      setExistingResume(f.name)
      notify(`ATS ${data.atsScore}/100 for ${role}${data.demo ? ' (demo)' : ''}`)
    } catch (e) {
      notify('Scan failed — try another PDF')
    } finally { setScanning(false) }
  }

  return (
    <DashboardShell activeMain="profile" activeSub="ats" title="ATS Scanner">
      <div className="space-y-5 max-w-[920px]">
        {mode === 'choose' && (
          <div className="rounded-[20px] bg-white p-8 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <p className="text-[14px] font-semibold tracking-[-0.02em]">We found your previous resume</p>
            <p className="mono mt-1 text-[11px] text-slate-500">{existingResume} — you can continue or upload another.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[14px] border-2 border-dashed border-slate-300 p-6 dark:border-slate-700">
                <p className="text-[13px] font-semibold">Already uploaded</p>
                <p className="mono mt-1 text-[11px] leading-5 text-slate-500">Continue with existing scan context, or choose Upload another to replace.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => setMode('upload')} className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">Upload another</button>
                  <button onClick={() => { notify(`Continuing with ${existingResume}`); setMode('upload') }} className="rounded-full bg-white px-4 py-2 text-[11px] font-medium ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Continue existing</button>
                </div>
              </div>
              <div className="rounded-[14px] bg-slate-900 p-6 text-white dark:bg-white dark:text-slate-900">
                <p className="text-[13px] font-semibold">New resume</p>
                <p className="mono mt-1 text-[11px] opacity-70">Upload flow starts directly on this ATS portal — PDF parsed locally, scored via Groq.</p>
                <button onClick={() => setMode('upload')} className="mt-4 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-slate-900 dark:bg-slate-900 dark:text-white">Start upload →</button>
              </div>
            </div>
          </div>
        )}

        {mode === 'upload' && (
          <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <label className="block cursor-pointer rounded-[14px] border-2 border-dashed border-slate-300 p-10 text-center transition hover:border-slate-900 dark:border-slate-700 dark:hover:border-white">
              <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-[12px] bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">◐</div>
              <p className="mt-3 text-[13px] font-medium tracking-[-0.01em]">{file ? file.name : 'Drop PDF here or click to browse'}</p>
              <p className="mono mt-1 text-[11px] text-slate-500">PDF only · max 5MB · 8 pages max · 4500 chars extracted</p>
            </label>
            <div className="mt-5 flex flex-wrap gap-3">
              <select value={role} onChange={e=>setRole(e.target.value)} className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900">
                {['Frontend Developer','Backend Engineer','Data Analyst','Custom Role'].map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
              <button disabled={!file || scanning} onClick={()=>startScan()} className="h-10 rounded-[10px] bg-slate-900 px-6 text-[12px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{scanning?'Scanning…':'Scan resume →'}</button>
              {existingResume && <button onClick={()=>setMode('choose')} className="h-10 rounded-[10px] bg-white px-4 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">← Back</button>}
            </div>
          </div>
        )}

        {mode === 'result' && result && (
          <div className="space-y-4">
            <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex flex-wrap items-start gap-5">
                <div className="relative grid h-[88px] w-[88px] place-items-center">
                  <svg className="h-[88px] w-[88px] -rotate-90" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="6"/>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" className={`${result.atsScore>=75?'text-emerald-600':result.atsScore>=50?'text-amber-500':'text-slate-900 dark:text-white'} transition-all duration-700`} strokeWidth="6" strokeLinecap="round" strokeDasharray={2*Math.PI*36} strokeDashoffset={2*Math.PI*36*(1-(result.atsScore||0)/100)} />
                  </svg>
                  <span className="absolute text-[18px] font-bold tracking-[-0.02em]">{result.atsScore}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold tracking-[-0.02em]">{result.verdict || (result._invalid ? 'Invalid document' : 'Scanned')}</p>
                  <p className="mono mt-1 text-[11px] text-slate-500">Role: {role} {result.demo ? '· demo report' : ''}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(result.matchedKeywords||[]).slice(0,6).map(k=> <span key={k} className="mono rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300">{k}</span>)}
                    {(result.missingKeywords||[]).slice(0,4).map(k=> <span key={k} className="mono rounded-full bg-amber-50 px-2.5 py-1 text-[10px] text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300">missing: {k}</span>)}
                  </div>
                  <p className="mt-3 text-[12px] leading-6 text-slate-600 dark:text-slate-300">{result.summary || 'Add quantifiable impact and role-specific keywords to improve score.'}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={()=>setMode('upload')} className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">Scan another</button>
                <button onClick={()=>{ setMode('choose'); }} className="rounded-full bg-white px-4 py-2 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Choose flow</button>
              </div>
            </div>

            {result.improvements && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                  <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Improvements</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-slate-600 dark:text-slate-300">
                    {(result.improvements||[]).slice(0,4).map((im,i)=><li key={i}>{im}</li>)}
                  </ul>
                </div>
                <div className="rounded-[14px] bg-slate-900 p-4 text-white dark:bg-white dark:text-slate-900">
                  <p className="mono text-[11px] uppercase tracking-[0.08em] opacity-60">Next steps</p>
                  <p className="mt-2 text-[11px] leading-5 opacity-80">Add projects with live links, tailor bullets to {role}, then rescan. Target 85+ for top matches.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
