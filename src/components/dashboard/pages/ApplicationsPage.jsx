import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'
import BackButton from '../../BackButton'

const INITIAL_COLS = [
  { key: 'Applied', items: [
    { id:'a1', role: 'Microsoft Learn Ambassador', company: 'Microsoft', loc: 'Remote', pay: 'Stipend', date: '2d ago' },
    { id:'a2', role: 'Data Science Micro-Internship', company: 'Analytics Vidhya', loc: 'Remote', pay: '₹8K', date: '5d ago' },
  ]},
  { key: 'Shortlisted', items: [
    { id:'s1', role: 'Gemini Student Ambassador', company: 'Google', loc: 'Remote', pay: 'Perks', date: '1d ago' },
  ]},
  { key: 'Interviewing', items: [
    { id:'i1', role: 'UI Design Intern', company: 'Figma Fellows', loc: 'Remote', pay: '₹42K', date: 'Today' },
  ]},
]

export default function ApplicationsPage() {
  const [cols, setCols] = useState(INITIAL_COLS)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current=setTimeout(()=>setToast(null),3000) }, [])

  const move = (id, fromKey, toKey) => {
    if (fromKey===toKey) return
    setCols(cs => {
      const copy = cs.map(c => ({ ...c, items: [...c.items] }))
      const from = copy.find(c=>c.key===fromKey)
      const to = copy.find(c=>c.key===toKey)
      const idx = from.items.findIndex(it=>it.id===id)
      if (idx<0) return cs
      const [it] = from.items.splice(idx,1)
      to.items.push(it)
      return copy
    })
    notify(`Moved to ${toKey}`)
  }

  return (
    <DashboardShell activeMain="market" activeSub="applications" title="Applications · Tracker">
      <div className="max-w-[1100px] space-y-5">
        <BackButton />
        <p className="mono text-[11px] text-slate-500">Kanban-style tracker — Applied / Shortlisted / Interviewing. Real profile data feeds completion %.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {cols.map(col => (
            <div key={col.key} className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{col.key}</p>
                <span className="mono rounded-full bg-white px-2 py-1 text-[10px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">{col.items.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {col.items.map(it => (
                  <div key={it.id} className="rounded-[12px] bg-white p-3.5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <p className="text-[12px] font-semibold tracking-[-0.01em] leading-snug">{it.role}</p>
                    <p className="mono mt-1 text-[10px] text-slate-500">{it.company} · {it.loc} · {it.pay} · {it.date}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['Applied','Shortlisted','Interviewing'].filter(k=>k!==col.key).map(k => (
                        <button key={k} onClick={()=>move(it.id, col.key, k)} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] ring-1 ring-slate-200 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-white dark:hover:text-slate-900">→ {k}</button>
                      ))}
                    </div>
                  </div>
                ))}
                {col.items.length===0 && <p className="mono rounded-[12px] bg-white p-6 text-center text-[11px] text-slate-400 ring-1 ring-dashed ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">No items</p>}
              </div>
            </div>
          ))}
        </div>

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
