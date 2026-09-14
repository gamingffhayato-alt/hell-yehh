import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'
import AtsScanner from '../../AtsScanner'
import BackButton from '../../BackButton'

export default function AtsPage() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => {
    clearTimeout(timer.current)
    setToast(m)
    timer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <DashboardShell activeMain="profile" activeSub="ats" title="ATS Scanner · Groq">
      <div className="max-w-[920px] space-y-5">
        <div className="flex items-center gap-3">
          <BackButton />
          <p className="mono text-[11px] text-slate-500">Premium circle back · Groq openai/gpt-oss-20b · exact format</p>
        </div>

        <div className="rounded-[16px] bg-slate-950 p-4 text-white dark:bg-black">
          <p className="mono text-[11px] uppercase tracking-[0.08em] text-white/60">Flow</p>
          <p className="mt-1 text-[12px] leading-5 text-white/80">
            Already uploaded → Continue existing or Upload another · New resume → upload flow on ATS portal. Now rewired to Groq API direct via <span className="font-mono">VITE_GROQ_API_KEY</span>.
          </p>
        </div>

        {/* Rewired AtsScanner handles Groq directly */}
        <AtsScanner notify={notify} />

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">
            {toast}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
