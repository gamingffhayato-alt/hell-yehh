import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import FdpBoard from './FdpBoard'
import ConsultancyBoard from './ConsultancyBoard'
import CohortAnalytics from './CohortAnalytics'
import {
  BellIcon,
  BookIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  GradCapIcon,
  SparklesIcon,
  UsersIcon,
} from '../Icons'

/** Dummy default identity — used until a real academician profile exists. */
const FALLBACK = {
  name: 'Dr. Sharma',
  institution: 'Quantum University',
  dept: 'Department of Computer Science',
}

const NOTIFICATIONS = [
  { id: 'n1', Icon: BookIcon, tint: 'bg-teal-50 text-teal-600', text: 'New FDP: Google AI Pro cohort opens Sep 12 — 8 seats left', time: '20m' },
  { id: 'n2', Icon: BriefcaseIcon, tint: 'bg-sky-50 text-sky-600', text: 'TechCorp viewed your proposal on React rendering optimization', time: '1h' },
  { id: 'n3', Icon: ChartBarIcon, tint: 'bg-amber-50 text-amber-600', text: 'Cohort report ready: B.Tech CSE 2nd Year skill analysis', time: '3h' },
]

const TABS = [
  ['FDP Board', '#fdp'],
  ['Consultancy', '#consultancy'],
  ['Cohort Analytics', '#cohort'],
]

const initialsOf = (name) =>
  name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'A'

/**
 * /academic-dashboard — the Academician/Faculty Portal.
 * Light slate + teal theme: distinct from the student (indigo) and industry
 * (dark emerald) dashboards, while reusing their layout language.
 */
export default function AcademicDashboard() {
  const { session, profile } = useAuth()

  // Identity: real profile first, requested dummy default otherwise.
  const fullName = profile?.full_name?.trim() || FALLBACK.name
  const institution = profile?.institution?.trim() || FALLBACK.institution
  const deptLine = profile?.job_title?.trim() || FALLBACK.dept

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const notify = (message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3400)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  if (!session?.user) return <Navigate to="/login" replace />

  const STATS = [
    { label: 'Active R&D proposals', value: '2', Icon: BriefcaseIcon },
    { label: 'FDP hours this term', value: '36', Icon: BookIcon },
    { label: 'Students mentored', value: '148', Icon: UsersIcon },
    { label: 'Cohorts tracked', value: '3', Icon: ChartBarIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================= Header (light, teal accent) ======================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand → landing */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Intern X
              <span className="ml-2 hidden rounded-full bg-teal-50 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200 sm:inline-block">
                Academician
              </span>
            </span>
          </Link>

          {/* Section tabs */}
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {TABS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false) }}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
              >
                <BellIcon className="h-5 w-5" />
                {notifs.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-teal-500 text-[9px] font-bold text-white">
                    {notifs.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-80 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                      <button
                        onClick={() => { setNotifs([]); setNotifOpen(false) }}
                        className="flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:underline"
                      >
                        <CheckIcon className="h-3 w-3" /> Mark all read
                      </button>
                    </div>
                    {notifs.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${n.tint}`}>
                          <n.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs leading-snug text-slate-700">{n.text}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{n.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false) }}
                className="flex items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-2 pr-3 transition hover:bg-slate-200"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-600 text-[11px] font-extrabold text-white">
                  {initialsOf(fullName)}
                </span>
                <span className="hidden max-w-32 truncate text-sm font-semibold text-slate-700 sm:block">
                  {fullName}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-slate-400" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-60 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{fullName}</p>
                      <p className="truncate text-xs text-slate-400">{institution} · {deptLine}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                      >
                        Faculty profile
                      </Link>
                      <button
                        onClick={() => supabase.auth.signOut()}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
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

      {/* ============================ Hero (dark teal) ============================ */}
      <section className="bg-slate-50 pb-16 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100 ring-1 ring-white/20">
                <BookIcon className="h-3.5 w-3.5" />
                Faculty Portal
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, {fullName} 👋
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-teal-100/90">
                {institution} — {deptLine}. Your FDPs, consultancy pipeline and
                cohort pulse, all in one workspace.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
                {STATS.map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-extrabold text-white sm:text-2xl">{value}</p>
                      <Icon className="h-4 w-4 text-teal-200/70" />
                    </div>
                    <p className="mt-0.5 text-[11px] leading-tight text-teal-100/80">{label}</p>
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
            <FdpBoard notify={notify} />
            <CohortAnalytics notify={notify} />
          </div>
          <aside className="min-w-0">
            <ConsultancyBoard notify={notify} />
          </aside>
        </div>
      </main>

      {/* ================================= Toast ================================= */}
      {toast && (
        <div
          key={toast.id}
          className="animate-fade-up fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-teal-400/30"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-teal-400" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
