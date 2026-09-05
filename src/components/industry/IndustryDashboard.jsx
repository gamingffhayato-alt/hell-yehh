import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import JobCreator from './JobCreator'
import CandidateFeed from './CandidateFeed'
import LDPublisher from './LDPublisher'
import Mentorship from './Mentorship'
import {
  BellIcon,
  BriefcaseIcon,
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  GradCapIcon,
  SparklesIcon,
  UsersIcon,
} from '../Icons'

const INITIAL_POSTINGS = [
  {
    id: 'jp1',
    title: 'Frontend Developer Intern',
    skills: ['React', 'Supabase', 'Tailwind'],
    degree: 'B.Tech Computer Science',
    type: 'Internship',
    status: 'live',
    postedOn: 'Posted Sep 2',
  },
  {
    id: 'jp2',
    title: 'Node.js Backend Intern',
    skills: ['Node.js', 'PostgreSQL'],
    degree: 'B.Tech Computer Science',
    type: 'Internship',
    status: 'live',
    postedOn: 'Posted Aug 30',
  },
]

const COMPANIES = ['TechCorp', 'Innovate Labs', 'FinEdge']

const NOTIFICATIONS = [
  { id: 'n1', Icon: UsersIcon, tint: 'bg-emerald-500/15 text-emerald-300', text: 'Saksham V. just applied to Frontend Developer Intern — 95% match', time: '5m' },
  { id: 'n2', Icon: SparklesIcon, tint: 'bg-amber-500/15 text-amber-300', text: 'Cloud Architecture Workshop crossed 45 enrollments', time: '1h' },
  { id: 'n3', Icon: BriefcaseIcon, tint: 'bg-sky-500/15 text-sky-300', text: '3 new mentorship requests this week', time: '2h' },
]

const STATS = [
  { label: 'Active postings', value: '3' },
  { label: 'Matched candidates', value: '128' },
  { label: 'Interviews this week', value: '4' },
]

export default function IndustryDashboard() {
  const { session } = useAuth()
  const [company, setCompany] = useState(COMPANIES[0])
  const [companyOpen, setCompanyOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [postings, setPostings] = useState(INITIAL_POSTINGS)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const notify = (message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3400)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const publishPosting = (p) => {
    setPostings((ps) => [...ps, p])
    notify(`“${p.title}” is live — the ATS is ranking candidates now`)
  }

  if (!session?.user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ===================== Header (dark, distinct from student) ===================== */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg shadow-slate-900/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand → landing */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-slate-950">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Intern X
              <span className="ml-2 hidden rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30 align-middle sm:inline-block">
                Industry
              </span>
            </span>
          </Link>

          {/* Section tabs */}
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {[
              ['Postings', '#post'],
              ['Candidates', '#ats'],
              ['L&D', '#ld'],
              ['Mentorship', '#mentorship'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setCompanyOpen(false) }}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <BellIcon className="h-5 w-5" />
                {notifs.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-950">
                    {notifs.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-800 p-2 text-white shadow-2xl">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                      <button
                        onClick={() => { setNotifs([]); setNotifOpen(false) }}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-300 transition hover:underline"
                      >
                        <CheckIcon className="h-3 w-3" /> Mark all read
                      </button>
                    </div>
                    {notifs.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/5">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${n.tint}`}>
                          <n.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs leading-snug text-slate-200">{n.text}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{n.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Company switcher */}
            <div className="relative">
              <button
                onClick={() => { setCompanyOpen((o) => !o); setNotifOpen(false) }}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-2 pr-3 transition hover:bg-white/20"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-extrabold text-slate-950">
                  {company[0]}
                </span>
                <span className="hidden text-sm font-semibold sm:block">{company}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-400" />
              </button>

              {companyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCompanyOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-800 p-2 text-white shadow-2xl">
                    <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Viewing as
                    </p>
                    {COMPANIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCompany(c); setCompanyOpen(false); notify(`Now viewing as ${c} talent team`) }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 ${
                          company === c ? 'font-semibold text-emerald-300' : 'text-slate-200'
                        }`}
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-white/10 text-[10px] font-bold">
                          {c[0]}
                        </span>
                        {c}
                        {company === c && <CheckIcon className="ml-auto h-4 w-4" />}
                      </button>
                    ))}
                    <div className="mt-1 border-t border-slate-700 pt-1">
                      <Link
                        to="/dashboard"
                        className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                      >
                        Switch to student view
                      </Link>
                      <button
                        onClick={() => supabase.auth.signOut()}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================================ Hero strip ================================ */}
      <section className="bg-slate-900 pb-16 pt-8 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-800 to-slate-800 p-6 ring-1 ring-white/10 sm:p-8">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(rgba(52,211,153,0.6) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                <BuildingIcon className="h-3.5 w-3.5" />
                Industry Partner Portal
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, {company} Talent Team 👋
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-slate-300">
                Hire without the resume haystack — the ATS already pre-ranked today&rsquo;s
                applicants by real skill signals.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10">
                    <p className="text-xl font-extrabold text-emerald-300 sm:text-2xl">{s.value}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================ Bento grid ================================ */}
      <main className="mx-auto -mt-10 max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid items-start gap-5 lg:grid-cols-3">
          <div className="min-w-0 space-y-5 lg:col-span-2">
            <JobCreator postings={postings} onPublish={publishPosting} notify={notify} />
            <CandidateFeed postings={postings} notify={notify} />
          </div>
          <aside className="min-w-0 space-y-5">
            <LDPublisher notify={notify} />
            <Mentorship notify={notify} />
          </aside>
        </div>
      </main>

      {/* ================================= Toast ================================= */}
      {toast && (
        <div
          key={toast.id}
          className="animate-fade-up fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-emerald-400/30"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
