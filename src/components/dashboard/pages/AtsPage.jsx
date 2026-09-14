import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'
import AtsScanner from '../../AtsScanner'

export default function AtsPage() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => {
    clearTimeout(timer.current)
    setToast(m)
    timer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <DashboardShell activeMain="profile" activeSub="ats" title="Resume Scanner">
      <div className="max-w-[920px] space-y-5">
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
