import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function DashboardShell({ activeMain: initialMain = 'dashboard', activeSub: initialSub = 'overview', children, title }) {
  const { session, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const user = session?.user
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Aarav'
  const email = profile?.email || user?.email || ''
  const initial = (name[0] || 'U').toUpperCase()

  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem('internx_username') || '' } catch { return '' }
  })
  const [usernameEditing, setUsernameEditing] = useState(false)
  const [usernameDraft, setUsernameDraft] = useState(username)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])
  useEffect(() => {
    try { localStorage.setItem('internx_username', username) } catch {}
  }, [username])

  const completion = useMemo(() => {
    const p = profile || {}
    const checks = [p.full_name, p.email, p.institution, p.course, p.stream, p.role, p.github, p.linkedin, username]
    const filled = checks.filter(Boolean).length
    return Math.max(18, Math.min(100, Math.round((filled / 11) * 100)))
  }, [profile, username])

  const [activeMain, setActiveMain] = useState(initialMain)
  const [activeSub, setActiveSub] = useState(initialSub)

  useEffect(() => {
    setActiveMain(initialMain)
    setActiveSub(initialSub)
  }, [initialMain, initialSub])

  const handleNav = (main, sub) => {
    setActiveMain(main)
    setActiveSub(sub)
    if (main === 'dashboard') navigate('/dashboard')
    else if (main === 'profile' && sub === 'ats') navigate('/dashboard/ats')
    else if (main === 'profile' && sub === 'projects') navigate('/dashboard/projects')
    else if (main === 'profile' && sub === 'assessment') navigate('/dashboard/assessment')
    else if (main === 'market' && sub === 'trending') navigate('/dashboard/trending')
    else if (main === 'market' && sub === 'feed') navigate('/dashboard/feed')
    else if (main === 'market' && sub === 'applications') navigate('/dashboard/applications')
  }

  const handleUsernameSave = () => {
    const clean = usernameDraft.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
    if (!clean) return notify('Username must be alphanumeric')
    setUsername(clean)
    setUsernameEditing(false)
    notify(`Username @${clean} saved — used for profile lookup`)
  }

  function IconButton({ active, onClick, children, label }) {
    return (
      <button aria-label={label} onClick={onClick} className={`group relative grid h-[48px] w-[48px] place-items-center rounded-[14px] transition-all ${active ? 'bg-slate-900 text-white shadow-[0_0_0_1px_rgba(0,0,0,1),0_4px_12px_rgba(0,0,0,0.15)] dark:bg-white dark:text-slate-900' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
        {active && <span className="absolute -left-[14px] top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-slate-900 dark:bg-white" />}
        {children}
      </button>
    )
  }

  function SubNavButton({ active, onClick, children }) {
    return (
      <button onClick={onClick} className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[12.5px] font-medium tracking-[-0.01em] transition ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}>{children}</button>
    )
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
        <aside className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col items-center border-r border-slate-200/70 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-[12px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white">
            <span className="display text-[16px] font-semibold tracking-[-0.02em]">IX</span>
          </Link>
          <div className="mono mt-8 rotate-180 text-[10px] uppercase tracking-[0.18em] text-slate-300 [writing-mode:vertical-lr] dark:text-slate-600">Intern X · 2026</div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <IconButton active={activeMain === 'dashboard'} onClick={() => handleNav('dashboard', 'overview')} label="Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
            </IconButton>
            <IconButton active={activeMain === 'profile'} onClick={() => handleNav('profile', 'ats')} label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0"/></svg>
            </IconButton>
            <IconButton active={activeMain === 'market'} onClick={() => handleNav('market', 'trending')} label="Market">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>
            </IconButton>
          </div>
          <div className="mt-auto flex flex-col items-center gap-3">
            <Link to="/profile" className="group relative grid h-[56px] w-[56px] place-items-center">
              <svg className="h-[56px] w-[56px] -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4"/>
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white transition-all duration-700" strokeWidth="4" strokeLinecap="round" strokeDasharray={2*Math.PI*24} strokeDashoffset={2*Math.PI*24*(1-completion/100)} />
              </svg>
              <span className="absolute text-[11px] font-bold tracking-[-0.02em]">{completion}%</span>
            </Link>
            <span className="mono text-[11px] text-slate-400 dark:text-slate-500">Profile</span>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="mono mt-6 text-[11px] text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white">Logout</button>
        </aside>

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
                    <span className="mono text-[11px] text-slate-400">Username lookup</span>
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
                </div>
              </>
            )}
            {activeMain === 'profile' && (
              <>
                <h2 className="display text-[22px] font-semibold tracking-[-0.02em]">Profile</h2>
                <p className="mono mt-2 text-[11px] text-slate-500">Bundles ATS, Projects, Assessment</p>
                <nav className="mt-6 space-y-1">
                  <SubNavButton active={activeSub === 'ats'} onClick={() => handleNav('profile', 'ats')}><span className="h-1.5 w-1.5 rounded-full bg-violet-500"/> ATS Scanner</SubNavButton>
                  <SubNavButton active={activeSub === 'projects'} onClick={() => handleNav('profile', 'projects')}><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Projects</SubNavButton>
                  <SubNavButton active={activeSub === 'assessment'} onClick={() => handleNav('profile', 'assessment')}><span className="h-1.5 w-1.5 rounded-full bg-amber-500"/> Assessment</SubNavButton>
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
                  <SubNavButton active={activeSub === 'trending'} onClick={() => handleNav('market', 'trending')}><span className="h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white"/> Trending Skills</SubNavButton>
                  <SubNavButton active={activeSub === 'feed'} onClick={() => handleNav('market', 'feed')}><span className="h-1.5 w-1.5 rounded-full bg-indigo-500"/> Personalized Feed</SubNavButton>
                  <SubNavButton active={activeSub === 'applications'} onClick={() => handleNav('market', 'applications')}><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Applications</SubNavButton>
                </nav>
              </>
            )}
          </div>
        </div>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex h-[64px] items-center gap-4 px-6 sm:px-8">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold tracking-[-0.01em]">{name}</span>
                <span className="mono text-[10px] text-slate-500">@{username || 'handle'} · {email.split('@')[0]}</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Link to="/dashboard" className="mono rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-white dark:bg-white dark:text-slate-900">Dashboard</Link>
                <Link to="/profile" className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">{completion}%</Link>
              </div>
            </div>
          </header>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {title && <h1 className="display mb-6 text-[28px] font-semibold tracking-[-0.02em]">{title}</h1>}
            {children}
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[64px] items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
        <button onClick={() => handleNav('dashboard','overview')} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='dashboard'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">D</span></button>
        <button onClick={() => handleNav('profile','ats')} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='profile'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">P</span></button>
        <button onClick={() => handleNav('market','trending')} className={`grid h-10 w-10 place-items-center rounded-[12px] ${activeMain==='market'?'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'text-slate-400'}`}><span className="text-[11px] font-bold">M</span></button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-[12px] font-medium text-white shadow-xl dark:bg-white dark:text-slate-900">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{toast.message}
        </div>
      )}
    </div>
  )
}
