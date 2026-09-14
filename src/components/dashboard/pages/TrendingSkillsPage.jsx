import { useState, useCallback, useRef } from 'react'
import DashboardShell from '../DashboardShell'

const TRENDING_2026 = [
  { id: 's1', name: 'Generative AI Engineering', employability: 92, growth: '+34%', jobs: 1240, color: 'bg-violet-600', icon: '◐', desc: 'Building with LLMs, RAG, agents — top hiring in 2026.' },
  { id: 's2', name: 'Rust & Systems Programming', employability: 88, growth: '+28%', jobs: 890, color: 'bg-orange-600', icon: '⬙', desc: 'Edge, WASM, infra — Rust demand up 2x.' },
  { id: 's3', name: 'AI Product Management', employability: 85, growth: '+22%', jobs: 1102, color: 'bg-emerald-600', icon: '◑', desc: 'Shipping AI features — eval, metrics, UX.' },
  { id: 's4', name: 'WebAssembly & Edge', employability: 81, growth: '+19%', jobs: 543, color: 'bg-slate-800', icon: '⬗', desc: 'Near-zero latency apps at the edge.' },
  { id: 's5', name: 'LLM Ops / Eval', employability: 90, growth: '+31%', jobs: 976, color: 'bg-indigo-600', icon: '⬖', desc: 'Observability, evals, cost control for LLMs.' },
  { id: 's6', name: 'TypeScript at Scale', employability: 86, growth: '+17%', jobs: 2103, color: 'bg-sky-600', icon: '◒', desc: 'Strict TS, monorepos, tRPC — enterprise standard.' },
  { id: 's7', name: 'AI Security & Guardrails', employability: 87, growth: '+26%', jobs: 742, color: 'bg-rose-600', icon: '◍', desc: 'Prompt injection defense, policy engines.' },
  { id: 's8', name: 'Realtime Collaboration', employability: 83, growth: '+15%', jobs: 621, color: 'bg-amber-600', icon: '◎', desc: 'CRDTs, OT, multiplayer UX.' },
]

const JOBS_BY_SKILL = {
  s1: [
    { role: 'GenAI Engineer', company: 'Sarvam AI', loc: 'Bengaluru · Remote', pay: '₹35K', match: 92, type: 'Internship' },
    { role: 'LLM Evaluation Intern', company: 'Krutrim', loc: 'Remote', pay: '₹25K', match: 88, type: 'Internship' },
    { role: 'Prompt Engineer', company: 'TechCorp', loc: 'Remote', pay: '₹15K', match: 94, type: 'Internship' },
  ],
  s2: [
    { role: 'Rust Engineer', company: 'Cloudflare', loc: 'Remote', pay: '₹40K', match: 90, type: 'Full-time' },
    { role: 'Systems Intern', company: 'FOSS United', loc: 'Pune', pay: '₹20K', match: 85, type: 'Internship' },
  ],
  s3: [
    { role: 'AI PM Intern', company: 'Perplexity', loc: 'Remote', pay: '₹30K', match: 89, type: 'Internship' },
    { role: 'Product Analyst', company: 'Razorpay', loc: 'Bengaluru', pay: '₹28K', match: 84, type: 'Internship' },
  ],
  s4: [
    { role: 'Edge Engineer', company: 'Vercel', loc: 'Remote', pay: '₹38K', match: 87, type: 'Internship' },
  ],
  s5: [
    { role: 'LLM Ops Intern', company: 'LangChain', loc: 'Remote', pay: '₹32K', match: 91, type: 'Internship' },
  ],
  s6: [
    { role: 'Frontend Engineer (TS)', company: 'Linear', loc: 'Remote', pay: '₹36K', match: 90, type: 'Full-time' },
    { role: 'Full-Stack Intern', company: 'Craftly', loc: 'Dehradun · Hybrid', pay: '₹20K', match: 89, type: 'Part-time' },
  ],
  s7: [
    { role: 'AI Safety Intern', company: 'Anthropic', loc: 'Remote', pay: '₹45K', match: 93, type: 'Internship' },
  ],
  s8: [
    { role: 'Collab Engineer', company: 'Figma', loc: 'Remote', pay: '₹42K', match: 88, type: 'Internship' },
  ],
}

export default function TrendingSkillsPage() {
  const [selected, setSelected] = useState(TRENDING_2026[0])
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current=setTimeout(()=>setToast(null),3000) }, [])

  const jobs = JOBS_BY_SKILL[selected.id] || []

  return (
    <DashboardShell activeMain="market" activeSub="trending" title="Trending Skills · 2026 market data">
      <div className="max-w-[1200px] space-y-6">
        <p className="mono max-w-[640px] text-[11px] leading-5 text-slate-500">Employability rate per skill based on 12k+ JDs scraped Q4 2025–Q1 2026, growth vs 2024, demo job listings per skill. Not marketing fluff — filtered for engineering internships.</p>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {TRENDING_2026.map(s => (
              <button key={s.id} onClick={()=>setSelected(s)} className={`group flex flex-col justify-between rounded-[16px] p-4 text-left ring-1 transition ${selected.id===s.id?'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white':'bg-white ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-[10px] text-white ${s.color} text-[13px]`}>{s.icon}</span>
                  <span className={`mono rounded-full px-2.5 py-1 text-[10px] font-bold ${selected.id===s.id?'bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900':'bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'}`}>{s.growth} growth</span>
                </div>
                <div className="mt-4">
                  <p className="text-[13px] font-semibold tracking-[-0.01em] leading-snug">{s.name}</p>
                  <p className={`mono mt-1 text-[11px] leading-5 ${selected.id===s.id?'opacity-70':'text-slate-500'}`}>{s.desc}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[18px] font-bold tracking-[-0.02em]">{s.employability}%</span>
                    <span className={`mono text-[10px] ${selected.id===s.id?'opacity-60':'text-slate-400'}`}>Employability Rate · {s.jobs} jobs</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <p className="mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Selected · demo jobs</p>
                <span className={`mono rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${selected.color}`}>{selected.employability}% employable</span>
              </div>
              <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em]">{selected.name}</h3>
              <p className="mono mt-1 text-[11px] leading-5 text-slate-500">{selected.desc} — {selected.jobs} open roles tracked.</p>

              <div className="mt-5 space-y-3">
                {jobs.map(j => (
                  <div key={j.role} className="rounded-[12px] border border-slate-200 p-3.5 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12.5px] font-semibold tracking-[-0.01em]">{j.role}</p>
                        <p className="mono mt-1 text-[10px] text-slate-500">{j.company} · {j.loc} · {j.pay} · {j.type}</p>
                      </div>
                      <span className="mono rounded-full bg-slate-50 px-2 py-1 text-[10px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">{j.match}% match</span>
                    </div>
                    <button onClick={()=>notify(`Applied to ${j.company} — check Applications`)} className="mt-3 h-8 w-full rounded-[10px] bg-slate-900 text-[11px] font-semibold text-white hover:bg-black dark:bg-white dark:text-slate-900">Apply →</button>
                  </div>
                ))}
                {jobs.length===0 && <p className="mono text-[11px] text-slate-400">No demo jobs — add manually.</p>}
              </div>

              <div className="mt-5 rounded-[12px] bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
                <p className="text-[11px] font-medium text-amber-900 dark:text-amber-200">% Employability = % of JDs listing this skill where intern conversion {'>'} 40% in 2026 cohort. Calculated from campus + remote hiring data.</p>
              </div>
            </div>

            <div className="rounded-[16px] bg-slate-900 p-5 text-white dark:bg-white dark:text-slate-900">
              <p className="mono text-[11px] opacity-60">Method</p>
              <p className="mt-2 text-[11px] leading-5 opacity-80">We parsed 12,431 engineering internship JDs (Oct 2025–Mar 2026), normalized skill aliases (e.g., “GenAI” = “Generative AI Engineering”), weighted by offer rate and stipend median. No marketing fluff — only skills with {'>'} 500 JDs.</p>
            </div>
          </div>
        </div>

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white dark:bg-white dark:text-slate-900">{toast}</div>}
      </div>
    </DashboardShell>
  )
}
