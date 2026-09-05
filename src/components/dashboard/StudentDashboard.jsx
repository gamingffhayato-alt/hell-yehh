import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import WelcomeHero from './WelcomeHero'
import AssessmentBanner from './AssessmentBanner'
import Portfolio from './Portfolio'
import Feed from './Feed'
import JobMatches from './JobMatches'
import SkillGapCard from './SkillGapCard'
import Tracker from './Tracker'
import {
  BellIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  GradCapIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
} from '../Icons'

/* ------------------------------ Dummy data ------------------------------ */

const INITIAL_JOBS = [
  {
    id: 'j1',
    role: 'Prompt Engineering Intern',
    company: 'TechCorp',
    loc: 'Remote',
    type: 'Internship',
    pay: '₹15K/month',
    match: 94,
    tint: 'bg-indigo-500',
    applied: false,
  },
  {
    id: 'j2',
    role: 'Frontend Developer (React/Vite) Part-time',
    company: 'Craftly Studio',
    loc: 'Dehradun · Hybrid',
    type: 'Part-time',
    pay: '₹20K/month',
    match: 89,
    tint: 'bg-violet-500',
    applied: false,
  },
  {
    id: 'j3',
    role: 'Data Structures Peer Tutor',
    company: 'CampusLMS',
    loc: 'On-campus',
    type: 'Part-time',
    pay: '₹6K/month',
    match: 91,
    tint: 'bg-emerald-500',
    applied: false,
  },
]

const INITIAL_TRACKER = {
  applied: [
    {
      id: 't1',
      role: 'Microsoft Student Learn Ambassador',
      company: 'Microsoft',
      note: 'Application sent',
      appliedOn: 'Applied Sep 3',
    },
    {
      id: 't2',
      role: 'Data Science Micro-Internship',
      company: 'Analytics Vidhya',
      note: 'Resume viewed',
      appliedOn: 'Applied Aug 28',
    },
  ],
  shortlisted: [
    {
      id: 't3',
      role: 'Gemini Student Ambassador Program',
      company: 'Google',
      note: 'Shortlisted · Video Challenge Submitted',
      appliedOn: 'Applied Aug 21',
    },
  ],
  interviewing: [
    {
      id: 't4',
      role: 'UI Design Intern',
      company: 'Figma Fellows',
      note: 'Interview · Fri 4:00 PM',
      appliedOn: 'Applied Aug 15',
    },
  ],
}

const NOTIFICATIONS = [
  { id: 'n1', Icon: BriefcaseIcon, tint: 'bg-indigo-100 text-indigo-600', text: 'New 94% match: Prompt Engineering Intern at TechCorp', time: '10m' },
  { id: 'n2', Icon: SparklesIcon, tint: 'bg-amber-100 text-amber-600', text: 'Recruiter from Craftly Studio viewed your Digital CV', time: '1h' },
  { id: 'n3', Icon: UsersIcon, tint: 'bg-emerald-100 text-emerald-600', text: 'Priya Nair started following your projects', time: '3h' },
]

const FLOW = ['applied', 'shortlisted', 'interviewing']

/* ------------------------------ Component ------------------------------ */

export default function StudentDashboard() {
  const { session, profile } = useAuth()
  const user = session?.user
  const name =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Aarav Verma'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = (name[0] || 'U').toUpperCase()

  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [tracker, setTracker] = useState(INITIAL_TRACKER)
  const [toast, setToast] = useState(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const toastTimer = useRef(null)

  const notify = (message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3400)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  /* Apply → mark applied + push into the tracker, with a toast */
  const applyToJob = (job) => {
    setJobs((js) => js.map((j) => (j.id === job.id ? { ...j, applied: true } : j)))
    setTracker((t) => ({
      ...t,
      applied: [
        {
          id: `t-${job.id}`,
          role: job.role,
          company: job.company,
          note: 'Applied just now',
          appliedOn: 'Applied today',
        },
        ...t.applied,
      ],
    }))
    notify(`Application sent to ${job.company} — added to your tracker`)
  }

  const advanceTracker = (column, id) => {
    const idx = FLOW.indexOf(column)
    if (idx === -1 || idx === FLOW.length - 1) return
    const nextCol = FLOW[idx + 1]
    setTracker((t) => {
      const item = t[column].find((i) => i.id === id)
      if (!item) return t
      const upgraded = {
        ...item,
        note: nextCol === 'shortlisted' ? 'Shortlisted · Review passed' : 'Interview scheduled',
      }
      return {
        ...t,
        [column]: t[column].filter((i) => i.id !== id),
        [nextCol]: [...t[nextCol], upgraded],
      }
    })
    notify('Moved to the next stage — nice progress! 🚀')
  }

  const withdrawTracker = (column, id) => {
    setTracker((t) => ({ ...t, [column]: t[column].filter((i) => i.id !== id) }))
    notify('Application withdrawn')
  }

  const q = query.trim().toLowerCase()
  const visibleJobs = q
    ? jobs.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.type.toLowerCase().includes(q),
      )
    : jobs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="hidden text-lg font-extrabold tracking-tight text-gray-900 sm:block">
              Intern X
            </span>
          </Link>

          {/* Search */}
          <div className="relative min-w-0 flex-1 sm:mx-4 sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search feed, jobs, companies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-transparent bg-gray-100 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false) }}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <BellIcon className="h-5 w-5" />
                {notifs.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {notifs.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-gray-900/5">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Notifications
                      </p>
                      <button
                        onClick={() => { setNotifs([]); setNotifOpen(false) }}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:underline"
                      >
                        <CheckIcon className="h-3 w-3" /> Mark all read
                      </button>
                    </div>
                    {notifs.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-gray-50">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${n.tint}`}>
                          <n.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs leading-snug text-gray-700">{n.text}</p>
                          <p className="mt-0.5 text-[10px] text-gray-400">{n.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Avatar menu */}
            <div className="relative">
              <button
                onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false) }}
                className="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-gray-100"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="h-9 w-9 rounded-full ring-2 ring-white" />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {initial}
                  </span>
                )}
                <ChevronDownIcon className="hidden h-4 w-4 text-gray-400 sm:block" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-gray-900/5">
                    <div className="border-b border-gray-100 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
                      <p className="truncate text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      View profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/industry-dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      Industry view (demo)
                    </Link>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------ Content ----------------------------- */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <WelcomeHero name={name} />

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-3">
          {/* Main column */}
          <div className="min-w-0 space-y-5 lg:col-span-2">
            <AssessmentBanner notify={notify} />
            <Portfolio notify={notify} />
            <Feed query={query} notify={notify} />
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-5">
            <JobMatches
              jobs={visibleJobs}
              onApply={applyToJob}
              onSeeAll={() => notify('42 more matches unlock right after your next assessment')}
            />
            <SkillGapCard notify={notify} />
          </aside>
        </div>

        {/* Application tracker */}
        <div className="mt-5">
          <Tracker tracker={tracker} onAdvance={advanceTracker} onWithdraw={withdrawTracker} />
        </div>
      </main>

      {/* ------------------------------- Toast ------------------------------ */}
      {toast && (
        <div
          key={toast.id}
          className="animate-fade-up fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
