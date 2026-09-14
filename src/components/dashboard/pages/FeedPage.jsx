import { useState, useCallback, useRef, useMemo } from 'react'
import DashboardShell from '../DashboardShell'
import BackButton from '../../BackButton'

const FILTERS = ['All', 'Internships', 'Jobs', 'Trending Skills → Courses']

const POSTS = [
  { id: 'f1', author: 'Priya Nair', meta: '2nd Year · ECE', tag: 'Internships', type: 'Internship', text: 'Shipped my first React + Vite app to Vercel today — a mess-to-mastery journey in 3 weekends. Repo and live link below, roast my code!', likes: 47, company: 'Vercel', pay: '₹0 · Shipped' },
  { id: 'f2', author: 'E-Cell Quantum', meta: 'Official · Campus Club', tag: 'Jobs', type: 'Jobs', text: '⚡ QuantumHacks 2026 is HERE. 13–14 September · 36 hours · prizes worth ₹50K + direct internship interviews for the top 3 teams.', likes: 132, company: 'E-Cell', pay: 'Prize ₹50K' },
  { id: 'f3', author: 'Rohit Sharma', meta: '3rd Year · B.Tech CSE', tag: 'Trending Skills → Courses', type: 'Course', text: 'Binary search finally clicked: before writing a single line, dry-run your loop on arrays of size 1 and 2. Every off-by-one shows up instantly. 🧠', likes: 89, company: 'DSA Course', pay: 'Free' },
  { id: 'f4', author: 'Sarvam AI', meta: 'Hiring · GenAI', tag: 'Internships', type: 'Internship', text: 'GenAI Engineering Intern — work on RAG evals, Indic LLM finetunes. 3 months, remote, ₹35K. Build real eval harnesses.', likes: 61, company: 'Sarvam AI', pay: '₹35K' },
  { id: 'f5', author: 'Ananya S', meta: 'Alumni · 2024', tag: 'Trending Skills → Courses', type: 'Course', text: 'My Rust at Scale course — 6h, from ownership to WASM edge deploy. Used by 400+ Quantum students.', likes: 73, company: 'Rust Course', pay: '₹499' },
  { id: 'f6', author: 'Linear', meta: 'Design · Remote', tag: 'Jobs', type: 'Jobs', text: 'Frontend Engineer (TypeScript) — help build Linear’s next canvas. TypeScript at scale, CRDTs, real-time.', likes: 102, company: 'Linear', pay: '₹36K' },
]

export default function FeedPage() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current=setTimeout(()=>setToast(null),3000) }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return POSTS.filter(p => {
      const okFilter = filter === 'All' || (filter === 'Trending Skills → Courses' ? p.tag.includes('Courses') : p.tag === filter)
      const okQuery = !q || p.text.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.company.toLowerCase().includes(q)
      return okFilter && okQuery
    })
  }, [filter, query])

  return (
    <DashboardShell activeMain="market" activeSub="feed" title="Personalized Feed">
      <div className="max-w-[760px] space-y-5">
        <BackButton />
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search feed — try @username for profile lookup" className="h-10 w-full rounded-full border border-slate-200 bg-white pl-4 pr-4 text-[12px] placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-4 py-2 text-[11px] font-medium tracking-[-0.01em] ring-1 transition ${filter===f?'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white':'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(p => (
            <article key={p.id} className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 transition hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">{p.author[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold tracking-[-0.01em]">{p.author} <span className="font-normal text-slate-400">· {p.meta}</span></p>
                  <p className="mono mt-0.5 text-[10px] text-slate-500">{p.company} · {p.pay} · {p.type}</p>
                </div>
                <span className={`mono rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${p.tag==='Internships'?'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300':p.tag==='Jobs'?'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300':'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300'}`}>{p.tag}</span>
              </div>
              <p className="mt-3 text-[13px] leading-6 tracking-[-0.01em]">{p.text}</p>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={()=>notify('Liked')} className="mono flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:ring-slate-700">♥ {p.likes}</button>
                <button onClick={()=>notify(`Applied to ${p.company}`)} className="mono rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black dark:bg-white dark:text-slate-900">Apply</button>
                <button onClick={()=>notify('Link copied')} className="mono ml-auto text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white">Share</button>
              </div>
            </article>
          ))}
          {filtered.length===0 && <div className="rounded-[16px] border border-dashed border-slate-300 bg-white p-10 text-center text-[12px] text-slate-500 dark:border-slate-700 dark:bg-slate-900">No posts match “{query}” in {filter}.</div>}
        </div>

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
