import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'

const DEMO = [
  { id: 'p1', title: 'JARVIS — Telegram Edu Bot', desc: 'AI study assistant answering DSA queries on Telegram. 200+ queries week one.', tags: ['Grok API', 'Python', 'Telegram'], live: 'https://t.me/jarvis01educationbot', code: 'https://github.com', featured: true },
  { id: 'p2', title: 'Campus Notes Hub', desc: 'Quantum students upload/rate previous-year notes by course and professor.', tags: ['React', 'Vite', 'Firebase'], live: '#', code: '#', featured: false },
  { id: 'p3', title: 'InternX ATS Engine', desc: 'Local PDF parsing + Groq scoring — recruiter-grade feedback in <3s.', tags: ['pdfjs', 'Groq', 'Tailwind'], live: '#', code: '#', featured: true },
  { id: 'p4', title: 'SkillGap Visualizer', desc: 'Cohort skill-gap heatmap for faculty — D3 + Supabase realtime.', tags: ['D3', 'Supabase'], live: '#', code: '#', featured: false },
  { id: 'p5', title: 'Portfolio Forge', desc: 'One-click portfolio generator from GitHub profile + projects.', tags: ['Next.js', 'GitHub API'], live: '#', code: '#', featured: false },
  { id: 'p6', title: 'Interview Scheduler', desc: 'Cal.com clone for campus placements with Google Calendar sync.', tags: ['React', 'Cal'], live: '#', code: '#', featured: false },
  { id: 'p7', title: 'CodeCollab', desc: 'Live code collaboration with OT — like Figma for DSA.', tags: ['WebSocket', 'Monaco'], live: '#', code: '#', featured: false },
  { id: 'p8', title: 'Resume Tailor AI', desc: 'Tailors resume bullets to JD keywords — 40% higher callback rate.', tags: ['AI', 'NLP'], live: '#', code: '#', featured: true },
  { id: 'p9', title: 'Placement Pulse', desc: 'Real-time placement stats dashboard for Quantum University.', tags: ['Recharts', 'Postgres'], live: '#', code: '#', featured: false },
  { id: 'p10', title: 'Mock Interview Bot', desc: 'Voice-based mock interviews with instant feedback.', tags: ['Whisper', 'Groq'], live: '#', code: '#', featured: false },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(DEMO)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', desc:'', tags:'', live:'', code:'' })
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current=setTimeout(()=>setToast(null),3000) }, [])

  const openAdd = () => { setEditing(null); setForm({ title:'', desc:'', tags:'', live:'', code:'' }) }
  const openEdit = (p) => { setEditing(p); setForm({ title:p.title, desc:p.desc, tags:p.tags.join(', '), live:p.live, code:p.code }) }

  const save = (e) => {
    e.preventDefault()
    const obj = { id: editing?.id || `p${Date.now()}`, title: form.title.trim(), desc: form.desc.trim(), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), live: form.live.trim() || '#', code: form.code.trim() || '#', featured: editing?.featured || false }
    if (!obj.title) return notify('Title required')
    if (editing) setProjects(ps => ps.map(x => x.id===editing.id?obj:x))
    else setProjects(ps => [obj, ...ps])
    setEditing(null)
    setForm({ title:'', desc:'', tags:'', live:'', code:'' })
    notify(editing ? 'Project updated' : 'Project added')
  }

  return (
    <DashboardShell activeMain="profile" activeSub="projects" title={`Projects · ${projects.length} demo seeded`}>
      <div className="max-w-[1100px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono text-[11px] text-slate-500">Each card has Add/Edit + live link + codebase link — full add/edit functionality.</p>
          <button onClick={openAdd} className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">+ Add project</button>
        </div>

        {(editing || form.title || form.desc) && (
          <form onSubmit={save} className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
              <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="Tags comma separated" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
              <input value={form.live} onChange={e=>setForm({...form,live:e.target.value})} placeholder="Live link (https://…)" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
              <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Codebase link (GitHub)" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
              <textarea required value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Description" className="sm:col-span-2 min-h-[80px] rounded-[10px] border border-slate-200 bg-white p-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <div className="mt-3 flex gap-2">
              <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">{editing?'Update':'Add'} project</button>
              <button type="button" onClick={()=>{setEditing(null); setForm({ title:'', desc:'', tags:'', live:'', code:'' })}} className="rounded-full bg-white px-4 py-2 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Cancel</button>
            </div>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map(p => (
            <div key={p.id} className="group rounded-[16px] bg-white p-5 ring-1 ring-slate-200 transition hover:shadow-sm dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[13px] font-semibold tracking-[-0.01em]">{p.title}</h3>
                <div className="flex gap-1.5">
                  {p.featured && <span className="mono rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300">Featured</span>}
                  <button onClick={()=>openEdit(p)} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:ring-slate-700">Add/Edit</button>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map(t=> <span key={t} className="mono rounded-full bg-slate-50 px-2 py-1 text-[9px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">{t}</span>)}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={p.live} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-slate-900 px-3 py-2 text-[11px] font-medium text-white hover:bg-black dark:bg-white dark:text-slate-900">↗ Live link</a>
                <a href={p.code} target="_blank" rel="noreferrer" className="flex-1 rounded-[10px] border border-slate-200 px-3 py-2 text-center text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Codebase</a>
              </div>
            </div>
          ))}
        </div>

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
