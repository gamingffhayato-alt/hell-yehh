import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { 
  GradCapIcon, SearchIcon, BellIcon, CheckIcon, 
  BriefcaseIcon, SparklesIcon, UsersIcon, XIcon,
  ArrowRightIcon, ExternalIcon, PlusIcon, RocketIcon,
  ChartBarIcon, BookIcon, FlameIcon
} from '../Icons'
import BackButton from '../BackButton'

/* ---------- Types & Data ---------- */
const INITIAL_JOBS = [
  { id: 'j1', role: 'Prompt Engineering Intern', company: 'TechCorp', loc: 'Remote', type: 'Internship', pay: '₹15K', match: 94, tint: 'bg-slate-900 dark:bg-white dark:text-slate-900' },
  { id: 'j2', role: 'Frontend Developer (React/Vite)', company: 'Craftly Studio', loc: 'Dehradun · Hybrid', type: 'Part-time', pay: '₹20K', match: 89, tint: 'bg-indigo-600' },
  { id: 'j3', role: 'Data Structures Peer Tutor', company: 'CampusLMS', loc: 'On-campus', type: 'Part-time', pay: '₹6K', match: 91, tint: 'bg-emerald-600' },
]

const TRENDING_2026 = [
  { id: 's1', name: 'Generative AI Engineering', employability: 92, growth: '+34%', jobs: 1240, color: 'bg-violet-600', icon: '◐' },
  { id: 's2', name: 'Rust & Systems Programming', employability: 88, growth: '+28%', jobs: 890, color: 'bg-orange-600', icon: '⬙' },
  { id: 's3', name: 'AI Product Management', employability: 85, growth: '+22%', jobs: 1102, color: 'bg-emerald-600', icon: '◑' },
  { id: 's4', name: 'WebAssembly & Edge', employability: 81, growth: '+19%', jobs: 543, color: 'bg-slate-800', icon: '⬗' },
  { id: 's5', name: 'LLM Ops / Eval', employability: 90, growth: '+31%', jobs: 976, color: 'bg-indigo-600', icon: '⬖' },
  { id: 's6', name: 'TypeScript at Scale', employability: 86, growth: '+17%', jobs: 2103, color: 'bg-sky-600', icon: '◒' },
]

const DEMO_PROJECTS = [
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

const FEED_FILTERS = ['All', 'Internships', 'Jobs', 'Trending Skills → Courses']

/* ---------- Helper Components ---------- */
function Mono({ children, className = '' }) {
  return <span className={`mono text-[11px] tracking-[0.02em] ${className}`}>{children}</span>
}

function IconButton({ active, children, onClick, label }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`group relative grid h-[48px] w-[48px] place-items-center rounded-[14px] transition-all duration-200 ${
        active
          ? 'bg-slate-900 text-white shadow-[0_0_0_1px_rgba(0,0,0,1),0_4px_12px_rgba(0,0,0,0.15)] dark:bg-white dark:text-slate-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,1)]'
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white'
      }`}
    >
      {active && <span className="absolute -left-[14px] top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-slate-900 dark:bg-white" />}
      {children}
    </button>
  )
}

function SubNavButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[12.5px] font-medium tracking-[-0.01em] transition ${
        active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

/* ---------- Main Dashboard ---------- */
export default function StudentDashboard() {
  const { session, profile } = useAuth()
  const navigate = useNavigate()
  const user = session?.user
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Aarav'
  const email = profile?.email || user?.email || ''
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = (name[0] || 'U').toUpperCase()

  // Username setup — used ONLY for searching/looking up profile (not display handle)
  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem('internx_username') || '' } catch { return '' }
  })
  const [usernameEditing, setUsernameEditing] = useState(false)
  const [usernameDraft, setUsernameDraft] = useState(username)

  useEffect(() => {
    try { localStorage.setItem('internx_username', username) } catch {}
  }, [username])

  // Profile completion — real-time
  const completion = useMemo(() => {
    const p = profile || {}
    const checks = [
      p.full_name, p.email, p.institution, p.course, p.stream,
      p.role, profile?.skills?.length || (p.skills?.length > 0),
      p.github, p.linkedin, username
    ]
    // Also count local projects, resume, etc. as progress signals
    const filled = checks.filter(Boolean).length
    const pct = Math.round((filled / 12) * 100)
    return Math.max(18, Math.min(100, pct))
  }, [profile, username])

  // Navigation — exactly 3 icon-buttons
  const [activeMain, setActiveMain] = useState('dashboard') // dashboard | profile | market
  const [activeSub, setActiveSub] = useState('overview') // sub-view

  // Data states
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [projects, setProjects] = useState(DEMO_PROJECTS)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const handleUsernameSave = () => {
    const clean = usernameDraft.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
    if (!clean) return notify('Username must be alphanumeric')
    setUsername(clean)
    setUsernameEditing(false)
    notify(`Username @${clean} saved — used for profile lookup`)
  }

  const applyToJob = (job) => {
    setJobs(js => js.map(j => j.id === job.id ? { ...j, applied: true } : j))
    notify(`Applied to ${job.company} — check Applications`)
  }

  // Search uses username for profile lookup
  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim().toLowerCase()
    if (!q) return
    if (q.startsWith('@') || q === username.toLowerCase()) {
      notify(`Profile lookup: @${q.replace('@','')} — ${name} · ${email}`)
    } else {
      notify(`Searching: ${q} — try @${username} for profile lookup`)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,600&display=swap');
        * { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, monospace; }
        .display { font-family: "Fraunces", serif; }
      `}</style>

      <div className="mx-auto flex max-w-[1600px]">
        {/* ---------- Left Sidebar — signature treatment ---------- */}
        <aside className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col items-center border-r border-slate-200/70 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
          {/* Logo — distinct */}
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-[12px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white">
            <span className="display text-[16px] font-semibold tracking-[-0.02em]">IX</span>
          </Link>

          <div className="mono mt-8 rotate-180 text-[10px] uppercase tracking-[0.18em] text-slate-300 [writing-mode:vertical-lr] dark:text-slate-600">Intern X · 2026</div>

          {/* Exactly 3 icon-buttons */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <IconButton active={activeMain === 'dashboard'} onClick={() => { setActiveMain('dashboard'); setActiveSub('overview') }} label="Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
            </IconButton>

            <IconButton active={activeMain === 'profile'} onClick={() => { setActiveMain('profile'); setActiveSub('ats') }} label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0"/></svg>
            </IconButton>

            <IconButton active={activeMain === 'market'} onClick={() => { setActiveMain('market'); setActiveSub('trending') }} label="Market">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>
            </IconButton>
          </div>

          {/* Profile completion — real-time, links to actual profile page */}
          <div className="mt-auto flex flex-col items-center gap-3">
            <Link to="/profile" className="group relative grid h-[56px] w-[56px] place-items-center">
              <svg className="h-[56px] w-[56px] -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4"/>
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white transition-all duration-700" strokeWidth="4" strokeLinecap="round" strokeDasharray={2*Math.PI*24} strokeDashoffset={2*Math.PI*24*(1-completion/100)} />
              </svg>
              <span className="absolute text-[11px] font-bold tracking-[-0.02em]">{completion}%</span>
            </Link>
            <Mono className="text-slate-400 dark:text-slate-500">Profile</Mono>
          </div>

          <button onClick={() => supabase.auth.signOut()} className="mono mt-6 text-[11px] text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white">Logout</button>
        </aside>

        {/* ---------- Second column — sub-nav for active main ---------- */}
        <div className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-slate-200/60 bg-[#fafaf7] dark:border-slate-800 dark:bg-slate-900/50 lg:block">
          <div className="flex h-full flex-col p-6">
            {activeMain === 'dashboard' && (
              <>
                <div>
                  <h2 className="display text-[22px] font-semibold tracking-[-0.02em] leading-[1.1]">Dashboard</h2>
                  <p className="mono mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Standalone overview — never under Profile menu.</p>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="rounded-[12px] bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <Mono className="text-slate-400">Username lookup</Mono>
                    {usernameEditing ? (
                      <div className="mt-2 flex gap-2">
                        <input value={usernameDraft} onChange={e => setUsernameDraft(e.target.value)} placeholder="your handle" className="h-8 w-full rounded-[8px] border border-slate-200 bg-white px-2 text-[12px] dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                        <button onClick={handleUsernameSave} className="h-8 rounded-[8px] bg-slate-900 px-3 text-[11px] font-medium text-white dark:bg-white dark:text-slate-900">Save</button>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[13px] font-medium tracking-[-0.01em]">@{username || 'set username'}</span>
                        <button onClick={() => { setUsernameEditing(true); setUsernameDraft(username) }} className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400">Edit</button>
                      </div>
                    )}
                    <p className="mono mt-2 text-[10px] leading-4 text-slate-400">Used ONLY for searching/looking up profile — not display handle.</p>
                  </div>

                  <div className="rounded-[12px] bg-slate-900 p-4 text-white dark:bg-white dark:text-slate-900">
                    <Mono className="text-white/60 dark:text-slate-500">Quick actions</Mono>
                    <div className="mt-3 space-y-2">
                      <button onClick={() => navigate('/dashboard/ats')} className="flex w-full items-center justify-between rounded-[8px] bg-white/10 px-3 py-2 text-[12px] font-medium hover:bg-white/15 dark:bg-slate-900/10 dark:hover:bg-slate-900/15">ATS Scanner →<span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/></button>
                      <button onClick={() => { setActiveMain('profile'); setActiveSub('projects') }} className="flex w-full items-center justify-between rounded-[8px] bg-white/10 px-3 py-2 text-[12px] font-medium hover:bg-white/15">Projects →</button>
                      <button onClick={() => { setActiveMain('profile'); setActiveSub('assessment') }} className="flex w-full items-center justify-between rounded-[8px] bg-white/10 px-3 py-2 text-[12px] font-medium hover:bg-white/15">Assessment →</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMain === 'profile' && (
              <>
                <h2 className="display text-[22px] font-semibold tracking-[-0.02em]">Profile</h2>
                <p className="mono mt-2 text-[11px] text-slate-500">Bundles ATS, Projects, Assessment</p>
                <nav className="mt-6 space-y-1">
                  <SubNavButton active={activeSub === 'ats'} onClick={() => setActiveSub('ats')}><span className="h-1.5 w-1.5 rounded-full bg-violet-500"/> ATS Scanner</SubNavButton>
                  <SubNavButton active={activeSub === 'projects'} onClick={() => setActiveSub('projects')}><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Projects</SubNavButton>
                  <SubNavButton active={activeSub === 'assessment'} onClick={() => setActiveSub('assessment')}><span className="h-1.5 w-1.5 rounded-full bg-amber-500"/> Assessment</SubNavButton>
                  <div className="pt-2">
                    <Link to="/profile" className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800">Full Profile → <span className="ml-auto text-[11px]">{completion}%</span></Link>
                  </div>
                </nav>
              </>
            )}

            {activeMain === 'market' && (
              <>
                <h2 className="display text-[22px] font-semibold tracking-[-0.02em]">Opportunities</h2>
                <p className="mono mt-2 text-[11px] text-slate-500">Trending, Feed, Applications</p>
                <nav className="mt-6 space-y-1">
                  <SubNavButton active={activeSub === 'trending'} onClick={() => setActiveSub('trending')}><span className="h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white"/> Trending Skills</SubNavButton>
                  <SubNavButton active={activeSub === 'feed'} onClick={() => setActiveSub('feed')}><span className="h-1.5 w-1.5 rounded-full bg-indigo-500"/> Personalized Feed</SubNavButton>
                  <SubNavButton active={activeSub === 'applications'} onClick={() => setActiveSub('applications')}><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Applications</SubNavButton>
                </nav>

                <div className="mt-auto rounded-[12px] bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <Mono className="text-slate-500">Live market</Mono>
                  <div className="mt-2 space-y-2">
                    {TRENDING_2026.slice(0,3).map(s => (
                      <div key={s.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-medium">{s.name}</span>
                        <span className="mono text-emerald-600">{s.employability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------- Main Content ---------- */}
        <main className="min-w-0 flex-1">
          {/* Top bar — search uses username for lookup */}
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex h-[64px] items-center gap-4 px-6 sm:px-8">
              {(activeMain !== 'dashboard' || activeSub !== 'overview') && <BackButton variant="circle" />}
              <form onSubmit={handleSearch} className="relative flex-1 max-w-[520px]">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search — try @${username || 'username'} for profile lookup, or jobs, skills...`} className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13px] tracking-[-0.01em] placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white" />
              </form>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="text-right">
                    <p className="text-[12px] font-semibold tracking-[-0.01em]">{name}</p>
                    <p className="mono text-[10px] text-slate-500">@{username || 'handle'} · {email.split('@')[0]}</p>
                  </div>
                  {avatarUrl ? <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full ring-1 ring-slate-200 dark:ring-slate-700" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">{initial}</span>}
                </div>
                <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900"><span className="text-[11px] font-bold">{completion}%</span></Link>
              </div>
            </div>
          </header>

          {/* Content — switches based on 3-icon nav */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {activeMain === 'dashboard' && <DashboardHome name={name} username={username} completion={completion} jobs={jobs} projects={projects} trending={TRENDING_2026} onApply={applyToJob} notify={notify} navigate={navigate} setActiveMain={setActiveMain} setActiveSub={setActiveSub} />}

            {activeMain === 'profile' && activeSub === 'ats' && <AtsPageEmbedded notify={notify} navigate={navigate} />}
            {activeMain === 'profile' && activeSub === 'projects' && <ProjectsPageEmbedded projects={projects} setProjects={setProjects} notify={notify} />}
            {activeMain === 'profile' && activeSub === 'assessment' && <AssessmentPageEmbedded notify={notify} />}

            {activeMain === 'market' && activeSub === 'trending' && <TrendingSkillsPageEmbedded trending={TRENDING_2026} notify={notify} />}
            {activeMain === 'market' && activeSub === 'feed' && <FeedPageEmbedded query={query} notify={notify} />}
            {activeMain === 'market' && activeSub === 'applications' && <ApplicationsPageEmbedded notify={notify} />}
          </div>
        </main>
      </div>

      {/* Mobile nav — 3 icons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[64px] items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
        <button onClick={() => { setActiveMain('dashboard'); setActiveSub('overview') }} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='dashboard'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">D</span></button>
        <button onClick={() => { setActiveMain('profile'); setActiveSub('ats') }} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='profile'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">P</span></button>
        <button onClick={() => { setActiveMain('market'); setActiveSub('trending') }} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='market'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">M</span></button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-[12px] font-medium text-white shadow-xl dark:bg-white dark:text-slate-900">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{toast.message}
        </div>
      )}
    </div>
  )
}

/* ---------- Sub-pages (embedded) ---------- */

function DashboardHome({ name, username, completion, jobs, projects, trending, onApply, notify, navigate, setActiveMain, setActiveSub }) {
  return (
    <div className="space-y-6">
      {/* Profile banner — redesigned, distinct identity */}
      <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-[1px] dark:bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-500/20" />
        <div className="relative rounded-[23px] bg-white dark:bg-slate-900">
          <div className="grid lg:grid-cols-[1.6fr_1fr]">
            {/* Left — identity */}
            <div className="p-7 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <span className="display text-[20px] font-semibold">{(name[0]||'U').toUpperCase()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="display text-[28px] font-semibold tracking-[-0.02em] leading-[0.95]">{name}</h1>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">VERIFIED</span>
                  </div>
                  <p className="mono mt-1.5 text-[11px] text-slate-500">@{username || 'set username in sidebar'} · B.Tech CSE · Quantum University</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Full-Stack', 'DSA', 'System Design'].map(chip => (
                      <span key={chip} className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary strip — top-left reference layout */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { k: 'Applications', v: '12', sub: '3 active' },
                  { k: 'Projects', v: String(projects.length), sub: '3 featured' },
                  { k: 'Streak', v: '7d', sub: 'Keep going' },
                ].map(s => (
                  <div key={s.k} className="rounded-[14px] bg-slate-50 p-3.5 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                    <p className="mono text-[10px] uppercase tracking-[0.08em] text-slate-400">{s.k}</p>
                    <p className="mt-1 text-[20px] font-bold tracking-[-0.02em]">{s.v}</p>
                    <p className="mono text-[10px] text-slate-500">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — completion + ATS redirect */}
            <div className="border-t border-slate-200 bg-[#fcfcf9] p-7 dark:border-slate-800 dark:bg-slate-800/30 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <Mono className="font-semibold uppercase tracking-[0.08em] text-slate-400">Profile completion</Mono>
                <Link to="/profile" className="mono text-[11px] font-medium text-slate-900 underline-offset-4 hover:underline dark:text-white">Open profile →</Link>
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div className="relative h-[88px] w-[88px]">
                  <svg className="h-[88px] w-[88px] -rotate-90" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="6"/>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white transition-all duration-700" strokeWidth="6" strokeLinecap="round" strokeDasharray={2*Math.PI*36} strokeDashoffset={2*Math.PI*36*(1-completion/100)} />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-[16px] font-bold tracking-[-0.02em]">{completion}%</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">Real-time progress</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Add username, 2 skills, and a project link to reach 100%. Links directly to /profile.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={() => navigate('/dashboard/ats')} className="flex w-full items-center justify-between rounded-[12px] bg-slate-900 px-4 py-3 text-[12.5px] font-semibold tracking-[-0.01em] text-white transition hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  <span className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-[8px] bg-white/10 dark:bg-slate-900/10">◐</span> Scan resume in ATS portal</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setActiveMain('market'); setActiveSub('trending') }} className="rounded-[10px] bg-white px-3 py-2.5 text-[11px] font-medium ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-700 dark:hover:bg-slate-800">Trending Skills</button>
                  <button onClick={() => { setActiveMain('market'); setActiveSub('feed') }} className="rounded-[10px] bg-white px-3 py-2.5 text-[11px] font-medium ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-700 dark:hover:bg-slate-800">Personalized Feed</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric grid — modular sections below */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold tracking-[-0.02em]">Smart Matches</h3>
              <span className="mono rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300">{jobs.filter(j=>!j.applied).length} new</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {jobs.map(job => (
                <div key={job.id} className="rounded-[14px] border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-[10px] text-[11px] font-bold text-white ${job.tint}`}>{job.company.slice(0,2)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold leading-snug tracking-[-0.01em]">{job.role}</p>
                      <p className="mono mt-1 text-[10px] text-slate-500">{job.company} · {job.loc} · {job.pay}</p>
                    </div>
                    <span className="mono rounded-full bg-slate-50 px-2 py-1 text-[10px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">{job.match}%</span>
                  </div>
                  <button disabled={job.applied} onClick={() => onApply(job)} className={`mt-3 h-8 w-full rounded-[10px] text-[11px] font-semibold ${job.applied?'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300':'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900'}`}>{job.applied?'Applied':'Apply now'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]">Featured Projects</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {projects.slice(0,4).map(p => (
                <div key={p.id} className="rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                  <p className="text-[12px] font-semibold tracking-[-0.01em]">{p.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{p.desc.slice(0,80)}…</p>
                  <div className="mt-2 flex gap-1.5">
                    {p.tags.slice(0,2).map(t => <span key={t} className="mono rounded-full bg-white px-2 py-0.5 text-[9px] ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[20px] bg-slate-900 p-6 text-white dark:bg-white dark:text-slate-900">
            <Mono className="text-white/60 dark:text-slate-500">Trending now · 2026</Mono>
            <div className="mt-4 space-y-3">
              {trending.slice(0,4).map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-[12px] bg-white/10 px-3 py-2.5 dark:bg-slate-900/10">
                  <span className="flex items-center gap-2 text-[12px] font-medium"><span className="grid h-6 w-6 place-items-center rounded-[8px] bg-white/15 text-[11px] dark:bg-slate-900/15">{s.icon}</span>{s.name}</span>
                  <span className="mono text-[11px] text-emerald-300 dark:text-emerald-600">{s.employability}% employable</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setActiveMain('market'); setActiveSub('trending') }} className="mono mt-4 text-[11px] underline-offset-4 hover:underline">View all →</button>
          </div>

          <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]">Assessment</h3>
            <p className="mono mt-1 text-[11px] text-slate-500">AI-generated · 5 questions · Groq live</p>
            <div className="mt-4 rounded-[12px] bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
              <p className="text-[11px] font-medium text-amber-900 dark:text-amber-200">Next up: Full-Stack & DSA · 45 mins</p>
              <p className="mono mt-1 text-[10px] text-amber-700/70 dark:text-amber-300/70">Upload answers as .txt — AI grader returns score</p>
            </div>
            <button onClick={() => { setActiveMain('profile'); setActiveSub('assessment') }} className="mt-3 h-9 w-full rounded-[10px] bg-slate-900 text-[11px] font-semibold text-white hover:bg-black dark:bg-white dark:text-slate-900">Start assessment →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AtsPageEmbedded({ notify, navigate }) {
  const [existingResume, setExistingResume] = useState(() => {
    try { return localStorage.getItem('internx_resume_name') || '' } catch { return '' }
  })
  const [mode, setMode] = useState(existingResume ? 'choose' : 'upload') // choose | upload | result
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('Frontend Developer')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const startScan = async (f = file) => {
    if (!f) return notify('Upload a PDF first')
    setScanning(true)
    try {
      // reuse logic from original AtsScanner — extract text locally then call /api/ats-analyze
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
      const res = await fetch('/api/ats-analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resumeText: text, targetRole: role }) })
      const data = await res.json()
      setResult(data)
      setMode('result')
      try { localStorage.setItem('internx_resume_name', f.name) } catch {}
      setExistingResume(f.name)
      notify(`ATS scan ${data.atsScore}/100 for ${role}`)
    } catch (e) {
      notify('Scan failed — try again')
    } finally { setScanning(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">ATS Scanner</h2>
        <button onClick={() => navigate('/dashboard')} className="mono rounded-full bg-white px-3 py-1.5 text-[11px] ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-700">← Back to Dashboard</button>
      </div>

      {mode === 'choose' && (
        <div className="rounded-[20px] bg-white p-8 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-[14px] font-medium">Scan Resume</p>
          <p className="mono mt-1 text-[11px] text-slate-500">We found an existing resume: {existingResume}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => { setFile(null); setMode('upload') }} className="rounded-[14px] border-2 border-dashed border-slate-300 p-6 text-left hover:border-slate-900 dark:border-slate-700 dark:hover:border-white">
              <p className="text-[13px] font-semibold">Already uploaded</p>
              <p className="mono mt-1 text-[11px] text-slate-500">Continue with existing resume, or Upload another</p>
              <div className="mt-4 flex gap-2">
                <button onClick={(e)=>{e.stopPropagation(); setMode('upload');}} className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white dark:bg-white dark:text-slate-900">Upload another</button>
                <button onClick={(e)=>{e.stopPropagation(); notify('Continuing with existing resume'); setMode('upload')}} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Continue with existing</button>
              </div>
            </button>
            <button onClick={() => setMode('upload')} className="rounded-[14px] bg-slate-900 p-6 text-left text-white hover:bg-black dark:bg-white dark:text-slate-900">
              <p className="text-[13px] font-semibold">New resume</p>
              <p className="mono mt-1 text-[11px] text-white/60 dark:text-slate-500">Goes straight into upload flow on this ATS portal</p>
              <p className="mt-4 text-[11px] font-medium">Start upload →</p>
            </button>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <label className="block cursor-pointer rounded-[14px] border-2 border-dashed border-slate-300 p-8 text-center hover:border-slate-900 dark:border-slate-700 dark:hover:border-white">
            <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0])} />
            <p className="text-[13px] font-medium">{file ? file.name : 'Drop PDF or click to browse'}</p>
            <p className="mono mt-1 text-[11px] text-slate-500">PDF only · max 5MB · extracted locally</p>
          </label>
          <div className="mt-4 flex gap-3">
            <select value={role} onChange={e=>setRole(e.target.value)} className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900">
              {['Frontend Developer','Backend Engineer','Data Analyst','Custom Role'].map(r=> <option key={r} value={r}>{r}</option>)}
            </select>
            <button disabled={!file || scanning} onClick={()=>startScan()} className="h-10 rounded-[10px] bg-slate-900 px-5 text-[12px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{scanning?'Scanning…':'Scan resume'}</button>
          </div>
        </div>
      )}

      {mode === 'result' && result && (
        <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[20px] font-bold">{result.atsScore}</div>
            <div>
              <p className="text-[14px] font-semibold">{result.verdict}</p>
              <p className="mono mt-1 text-[11px] text-slate-500">Matched: {result.matchedKeywords?.join(', ')} · Missing: {result.missingKeywords?.join(', ')}</p>
            </div>
          </div>
          <button onClick={()=>setMode('upload')} className="mt-4 rounded-full bg-white px-4 py-2 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">Scan another →</button>
        </div>
      )}
    </div>
  )
}

function ProjectsPageEmbedded({ projects, setProjects, notify }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', desc:'', tags:'', live:'', code:'' })

  const openAdd = () => { setEditing(null); setForm({ title:'', desc:'', tags:'', live:'', code:'' }) }
  const openEdit = (p) => { setEditing(p); setForm({ title:p.title, desc:p.desc, tags:p.tags.join(', '), live:p.live, code:p.code }) }

  const save = (e) => {
    e.preventDefault()
    const obj = { id: editing?.id || `p${Date.now()}`, title: form.title.trim(), desc: form.desc.trim(), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), live: form.live.trim() || '#', code: form.code.trim() || '#', featured: editing?.featured || false }
    if (editing) setProjects(ps => ps.map(x => x.id===editing.id?obj:x))
    else setProjects(ps => [obj, ...ps])
    setEditing(null)
    setForm({ title:'', desc:'', tags:'', live:'', code:'' })
    notify(editing ? 'Project updated' : 'Project added')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">Projects · {projects.length}</h2>
        <button onClick={openAdd} className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">+ Add project</button>
      </div>

      {(editing || form.title || form.desc) && (
        <form onSubmit={save} className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
            <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="Tags comma separated" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
            <input value={form.live} onChange={e=>setForm({...form,live:e.target.value})} placeholder="Live link" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
            <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Codebase link" className="h-10 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] dark:border-slate-700 dark:bg-slate-900" />
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
              <button onClick={()=>openEdit(p)} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:ring-slate-700">Add/Edit</button>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{p.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map(t=> <span key={t} className="mono rounded-full bg-slate-50 px-2 py-1 text-[9px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">{t}</span>)}
            </div>
            <div className="mt-4 flex gap-2">
              <a href={p.live} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-slate-900 px-3 py-2 text-[11px] font-medium text-white hover:bg-black dark:bg-white dark:text-slate-900"><ExternalIcon className="h-3 w-3"/> Live</a>
              <a href={p.code} target="_blank" rel="noreferrer" className="flex-1 rounded-[10px] border border-slate-200 px-3 py-2 text-center text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Codebase</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendingSkillsPageEmbedded({ trending, notify }) {
  const [selected, setSelected] = useState(trending[0])

  const jobsForSkill = [
    { role: 'GenAI Engineer', company: 'Sarvam AI', loc: 'Bengaluru · Remote', pay: '₹35K', match: 92 },
    { role: 'LLM Evaluation Intern', company: 'Krutrim', loc: 'Remote', pay: '₹25K', match: 88 },
    { role: 'Prompt Engineer', company: 'TechCorp', loc: 'Remote', pay: '₹15K', match: 94 },
  ]

  return (
    <div className="space-y-5">
      <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">Trending Skills · 2026 Market Data</h2>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {trending.map(s => (
            <button key={s.id} onClick={()=>setSelected(s)} className={`flex w-full items-center justify-between rounded-[14px] p-4 text-left ring-1 transition ${selected.id===s.id?'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white':'bg-white ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800'}`}>
              <span className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-[10px] text-white ${s.color}`}>{s.icon}</span>
                <span>
                  <span className="block text-[13px] font-semibold tracking-[-0.01em]">{s.name}</span>
                  <span className="mono mt-0.5 block text-[10px] opacity-70">{s.jobs} jobs · {s.growth} growth</span>
                </span>
              </span>
              <span className="text-right">
                <span className="block text-[13px] font-bold">{s.employability}%</span>
                <span className="mono text-[10px] opacity-70">Employability</span>
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-[20px] bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Demo jobs for {selected.name}</p>
          <div className="mt-4 space-y-3">
            {jobsForSkill.map(j => (
              <div key={j.role} className="rounded-[12px] border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-[12px] font-semibold">{j.role}</p>
                <p className="mono mt-1 text-[10px] text-slate-500">{j.company} · {j.loc} · {j.pay} · {j.match}% match</p>
                <button onClick={()=>notify(`Applied to ${j.company}`)} className="mt-2 h-7 rounded-full bg-slate-900 px-3 text-[10px] font-medium text-white dark:bg-white dark:text-slate-900">Apply</button>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[12px] bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
            <p className="text-[11px] font-medium text-amber-900 dark:text-amber-200">% Employability Rate: {selected.employability}% — based on 2026 hiring data across 12k+ JDs</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedPageEmbedded({ query, notify }) {
  const [filter, setFilter] = useState('All')
  const posts = [
    { id: '1', author: 'Priya Nair', tag: 'Internships', text: 'Shipped React+Vite app to Vercel — 3 weekends. Roast my code!', likes: 47 },
    { id: '2', author: 'E-Cell Quantum', tag: 'Jobs', text: 'QuantumHacks 2026 — 36h, ₹50K prizes + internship interviews', likes: 132 },
    { id: '3', author: 'Rohit Sharma', tag: 'Trending Skills → Courses', text: 'Binary search trick: dry-run on size 1 and 2 arrays first.', likes: 89 },
  ]
  const filtered = filter==='All' ? posts : posts.filter(p => p.tag===filter || (filter==='Trending Skills → Courses' && p.tag.includes('Courses')))

  return (
    <div className="space-y-5">
      <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">Personalized Feed</h2>
      <div className="flex flex-wrap gap-2">
        {FEED_FILTERS.map(f => (
          <button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-4 py-2 text-[11px] font-medium tracking-[-0.01em] ring-1 transition ${filter===f?'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white':'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <p className="mono text-[10px] text-slate-400">{p.author} · {p.tag}</p>
            <p className="mt-2 text-[13px] leading-6 tracking-[-0.01em]">{p.text}</p>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={()=>notify('Liked')} className="mono rounded-full bg-slate-50 px-3 py-1 text-[11px] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">♥ {p.likes}</button>
              <button onClick={()=>notify('Filtered')} className="mono text-[11px] text-slate-500 hover:text-slate-900">Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsPageEmbedded({ notify }) {
  const cols = [
    { key: 'Applied', items: [{ role: 'Microsoft Learn Ambassador', company: 'Microsoft' }, { role: 'Data Science Micro-Internship', company: 'Analytics Vidhya' }] },
    { key: 'Shortlisted', items: [{ role: 'Gemini Student Ambassador', company: 'Google' }] },
    { key: 'Interviewing', items: [{ role: 'UI Design Intern', company: 'Figma Fellows' }] },
  ]
  return (
    <div className="space-y-5">
      <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">Applications</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map(col => (
          <div key={col.key} className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{col.key} · {col.items.length}</p>
            <div className="mt-3 space-y-2">
              {col.items.map(it => (
                <div key={it.role} className="rounded-[12px] bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <p className="text-[12px] font-medium">{it.role}</p>
                  <p className="mono text-[10px] text-slate-500">{it.company}</p>
                  <button onClick={()=>notify('Moved stage')} className="mt-2 text-[10px] font-medium text-slate-900 underline-offset-4 hover:underline dark:text-white">Advance →</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssessmentPageEmbedded({ notify }) {
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answersText, setAnswersText] = useState('')
  const [fileName, setFileName] = useState('')
  const [grade, setGrade] = useState(null)
  const [grading, setGrading] = useState(false)

  const generate = async () => {
    setLoading(true)
    setGrade(null)
    try {
      const res = await fetch('/api/assessment-generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: 'Full-Stack + DSA 2026' }) })
      const data = await res.json()
      setQuestions(data)
      notify(data.demo ? 'Demo assessment loaded (ASS_KEY missing)' : 'Live assessment generated via Groq')
    } catch {
      notify('Generate failed')
    } finally { setLoading(false) }
  }

  const handleFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.endsWith('.txt')) return notify('Upload .txt file only')
    const text = await f.text()
    setAnswersText(text)
    setFileName(f.name)
    notify(`Loaded ${f.name} — ${text.length} chars`)
  }

  const submitGrade = async () => {
    if (!questions || !answersText) return notify('Generate questions and upload .txt first')
    setGrading(true)
    try {
      const res = await fetch('/api/assessment-grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questions: questions.questions, answersText }) })
      const data = await res.json()
      setGrade(data)
      notify(data.demo ? `Graded ${data.totalScore}/100 (demo)` : `Graded ${data.totalScore}/100`)
    } catch {
      notify('Grading failed')
    } finally { setGrading(false) }
  }

  return (
    <div className="space-y-5">
      <h2 className="display text-[24px] font-semibold tracking-[-0.02em]">Assessment · AI-generated coding test</h2>
      <p className="mono text-[11px] text-slate-500">5 questions generated live via Groq at request time — not hardcoded. Uses ASS_KEY server-side only.</p>

      <div className="flex gap-2">
        <button onClick={generate} disabled={loading} className="rounded-full bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{loading?'Generating…':'Generate 5 Questions'}</button>
        {questions && <span className="mono self-center text-[11px] text-slate-500">{questions.title} · {questions.duration} {questions.demo?'· demo':''}</span>}
      </div>

      {questions && (
        <div className="space-y-3">
          {questions.questions.map(q => (
            <div key={q.id} className="rounded-[14px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-center gap-2">
                <span className="mono rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">{q.difficulty}</span>
                <span className="mono text-[10px] text-slate-400">{q.topic}</span>
                <span className="ml-auto mono text-[10px] text-slate-400">Q{q.id}</span>
              </div>
              <p className="mt-2 text-[13px] font-semibold tracking-[-0.01em]">{q.title}</p>
              <p className="mt-1 text-[12px] leading-6 text-slate-600 dark:text-slate-300">{q.description}</p>
              <p className="mono mt-2 text-[10px] text-slate-500">Input: {q.input} · Output: {q.output}</p>
            </div>
          ))}
        </div>
      )}

      {questions && (
        <div className="rounded-[16px] bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-[12px] font-medium">Upload answers as .txt</p>
          <label className="mt-3 block cursor-pointer rounded-[12px] border-2 border-dashed border-slate-300 p-6 text-center hover:border-slate-900 dark:border-slate-700 dark:hover:border-white">
            <input type="file" accept=".txt" className="hidden" onChange={handleFile} />
            <p className="text-[12px]">{fileName || 'Click to upload .txt file'}</p>
            <p className="mono mt-1 text-[10px] text-slate-500">{answersText ? `${answersText.length} chars loaded` : 'AI grader reviews submission'}</p>
          </label>
          <button disabled={!answersText || grading} onClick={submitGrade} className="mt-3 h-9 rounded-full bg-slate-900 px-4 text-[11px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">{grading?'Grading…':'Submit for AI grading'}</button>
        </div>
      )}

      {grade && (
        <div className="rounded-[20px] bg-slate-900 p-6 text-white dark:bg-white dark:text-slate-900">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white text-[18px] font-bold">{grade.totalScore}</div>
            <div>
              <p className="text-[13px] font-semibold">{grade.summary}</p>
              <p className="mono mt-1 text-[11px] opacity-70">{grade.totalScore}/{grade.maxScore} {grade.demo?'· demo':''}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {grade.perQuestion?.map(pq => (
              <div key={pq.id} className="rounded-[12px] bg-white/10 p-3 dark:bg-slate-900/10">
                <p className="text-[11px] font-medium">Q{pq.id} · {pq.verdict} · {pq.score}/{pq.maxScore}</p>
                <p className="mono mt-1 text-[10px] opacity-70">{pq.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
