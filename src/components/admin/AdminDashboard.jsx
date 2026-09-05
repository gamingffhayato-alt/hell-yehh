import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_FLAG } from './AdminLogin'
import {
  BriefcaseIcon,
  ChartBarIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  UsersIcon,
  XIcon,
} from '../Icons'

/* ------------------------------ Dummy data ------------------------------ */

const INITIAL_RECORDS = [
  { id: 'r1', student: 'Saksham Vishwakarma', doc: 'B.Tech Transcript', cohort: 'CSE · 2nd Year', when: '2h ago', status: 'pending' },
  { id: 'r2', student: 'Priya Sharma', doc: 'Internship Offer Letter', cohort: 'CSE · 3rd Year', when: '5h ago', status: 'pending' },
  { id: 'r3', student: 'Diya Kapoor', doc: 'Skill Certificate — AWS Cloud', cohort: 'IT · 3rd Year', when: '1d ago', status: 'pending' },
  { id: 'r4', student: 'Rahul Nair', doc: 'B.Tech Transcript', cohort: 'ECE · 2nd Year', when: '2d ago', status: 'pending' },
  { id: 'r5', student: 'Arjun Mehta', doc: 'Semester 4 Grade Card', cohort: 'CSE · 2nd Year', when: '2d ago', status: 'verified' },
  { id: 'r6', student: 'Aman Gupta', doc: 'B.Tech Transcript', cohort: 'ME · 2nd Year', when: '3d ago', status: 'rejected' },
]

const INITIAL_FACULTY = [
  { id: 'f1', name: 'Dr. Meera Sharma', dept: 'Computer Science', status: 'active' },
  { id: 'f2', name: 'Dr. Arvind Gupta', dept: 'Information Technology', status: 'active' },
  { id: 'f3', name: 'Prof. Nisha Rao', dept: 'Electronics & Comm.', status: 'active' },
  { id: 'f4', name: 'Dr. Karthik Iyer', dept: 'Mechanical Eng.', status: 'active' },
]

/** Institution-wide missing skills — share of flagged profiles (gap %). */
const SKILL_GAPS = [
  { skill: 'Advanced System Design', gap: 60 },
  { skill: 'Cloud Architecture', gap: 45 },
  { skill: 'Database Indexing', gap: 38 },
  { skill: 'DevOps & CI/CD', gap: 32 },
  { skill: 'DSA Fundamentals', gap: 18 },
]

const ANALYTICS_STATS = [
  { label: 'Offers rolled out', value: '214' },
  { label: 'Average package', value: '₹6.8 LPA' },
  { label: 'Active recruiters', value: '38' },
  { label: 'Drives this semester', value: '12' },
]

const STATUS_META = {
  pending: { label: 'Pending Review', chip: 'bg-amber-500/15 text-amber-300 ring-amber-400/30' },
  verified: { label: 'Verified', chip: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30' },
  rejected: { label: 'Rejected', chip: 'bg-rose-500/15 text-rose-300 ring-rose-400/30' },
}

const gapColor = (gap) =>
  gap >= 45 ? 'bg-rose-500' : gap >= 25 ? 'bg-amber-400' : 'bg-emerald-500'

let idCounter = 100
const nextId = () => `x${idCounter++}`

/**
 * /admin-dashboard — highest-level institutional oversight portal.
 * Access is gated by the standalone admin session flag (NOT Supabase auth).
 */
export default function AdminDashboard() {
  const navigate = useNavigate()

  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [faculty, setFaculty] = useState(INITIAL_FACULTY)
  const [suspended, setSuspended] = useState([
    { id: 's1', user: 'rahul.dev@student.quantum.edu', when: 'Aug 30' },
  ])

  // Onboard form + suspend field
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newDept, setNewDept] = useState('')
  const [suspendTarget, setSuspendTarget] = useState('')

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const notify = (message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 3400)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const authorized = sessionStorage.getItem(ADMIN_FLAG) === 'granted'
  useEffect(() => {
    if (!authorized) navigate('/admin-login', { replace: true })
  }, [authorized, navigate])
  if (!authorized) return null

  const signOutAdmin = () => {
    sessionStorage.removeItem(ADMIN_FLAG)
    navigate('/admin-login', { replace: true })
  }

  /* ------------------------- Verification Engine ------------------------- */
  const setRecordStatus = (id, status) => {
    setRecords((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
    const rec = records.find((r) => r.id === id)
    notify(
      status === 'verified'
        ? `Verified ${rec?.doc} — ${rec?.student}`
        : `Rejected ${rec?.doc} — ${rec?.student}. Student notified to re-upload.`,
    )
  }
  const pendingCount = records.filter((r) => r.status === 'pending').length
  const verifiedCount = records.filter((r) => r.status === 'verified').length

  /* -------------------------- Access management -------------------------- */
  const revokeFaculty = (id) => {
    setFaculty((fs) => fs.map((f) => (f.id === id ? { ...f, status: 'revoked' } : f)))
    notify(`Access revoked for ${faculty.find((f) => f.id === id)?.name}`)
  }

  const onboardFaculty = (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name || !newEmail.trim() || !newDept.trim()) return
    setFaculty((fs) => [
      { id: nextId(), name, dept: newDept.trim(), status: 'active' },
      ...fs,
    ])
    notify(`Invitation sent to ${newEmail.trim()} — ${name} onboarded as faculty`)
    setNewName('')
    setNewEmail('')
    setNewDept('')
  }

  const suspendUser = (e) => {
    e.preventDefault()
    const target = suspendTarget.trim()
    if (!target) return
    setSuspended((ss) => [{ id: nextId(), user: target, when: 'Just now' }, ...ss])
    notify(`${target} suspended — student & recruiter views frozen`)
    setSuspendTarget('')
  }

  const restoreUser = (id) => {
    const entry = suspended.find((s) => s.id === id)
    setSuspended((ss) => ss.filter((s) => s.id !== id))
    notify(`${entry?.user} restored — account reactivated`)
  }

  const inputClass =
    'block w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* ============================== Header ============================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-900/40">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Intern X
              <span className="ml-2 hidden rounded-full bg-rose-500/15 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-rose-300 ring-1 ring-rose-400/30 sm:inline-block">
                Admin
              </span>
            </span>
          </div>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {[
              ['Verification', '#verification'],
              ['Analytics', '#analytics'],
              ['Access Control', '#access'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-white/5 py-1.5 pl-2 pr-3 ring-1 ring-white/10 sm:flex">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
                J
              </span>
              <span className="text-xs font-semibold text-slate-300">johny · Super Admin</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" title="Session active" />
            </span>
            <button
              onClick={signOutAdmin}
              className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-rose-300 ring-1 ring-white/10 transition hover:bg-rose-500/15 hover:ring-rose-400/30"
            >
              Exit admin
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Title row */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Institutional Control Portal
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Quantum University · placement cell oversight · live demo session
            </p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-400 ring-1 ring-white/10">
            Academic year 2025–26 · Semester 1
          </span>
        </div>

        {/* ============================ Stat band ============================ */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Placement readiness', value: '82%', accent: 'text-emerald-400', Icon: ChartBarIcon },
            { label: 'Records awaiting review', value: String(pendingCount), accent: 'text-amber-400', Icon: ClockIcon },
            { label: 'Records verified', value: String(verifiedCount), accent: 'text-emerald-400', Icon: CheckIcon },
            { label: 'Faculty accounts', value: String(faculty.length), accent: 'text-sky-400', Icon: UsersIcon },
          ].map(({ label, value, accent, Icon }) => (
            <div key={label} className="rounded-2xl bg-slate-900 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <p className={`text-2xl font-extrabold ${accent}`}>{value}</p>
                <Icon className="h-4 w-4 text-slate-600" />
              </div>
              <p className="mt-1 text-[11px] leading-tight text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-3">
          {/* ========================= Verification Engine ========================= */}
          <section id="verification" className="scroll-mt-24 rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10 lg:col-span-2 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Verification Engine</h2>
                <p className="text-xs text-slate-400">
                  Placement-cell workflow for validating student-uploaded records
                </p>
              </div>
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/30">
                {pendingCount} pending
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="pb-2.5 pr-4 font-semibold">Student</th>
                    <th className="pb-2.5 pr-4 font-semibold">Document</th>
                    <th className="pb-2.5 pr-4 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((r) => {
                    const meta = STATUS_META[r.status]
                    return (
                      <tr key={r.id} className="transition hover:bg-white/[0.03]">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-slate-100">{r.student}</p>
                          <p className="text-[11px] text-slate-500">{r.cohort} · {r.when}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{r.doc}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${meta.chip}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-3">
                          {r.status === 'pending' ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setRecordStatus(r.id, 'verified')}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-emerald-500 active:scale-95"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => setRecordStatus(r.id, 'rejected')}
                                className="rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-rose-500 active:scale-95"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-600">
                              {r.status === 'verified' ? '✓ Signed off' : '✗ Closed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ======================= Role & Access Management ======================= */}
          <section id="access" className="scroll-mt-24 rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-base font-bold text-white">Role &amp; Access Management</h2>
            <p className="text-xs text-slate-400">Platform security &amp; onboarding controls</p>

            {/* Faculty list */}
            <div className="mt-4 space-y-2">
              {faculty.map((f) => (
                <div
                  key={f.id}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition ${
                    f.status === 'active'
                      ? 'bg-white/[0.03] ring-white/10'
                      : 'bg-rose-500/5 ring-rose-500/20'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white ${
                      f.status === 'active' ? 'bg-sky-600' : 'bg-slate-600'
                    }`}
                  >
                    {f.name.replace(/^Dr\.\s+|^Prof\.\s+/, '').split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-semibold ${f.status === 'active' ? 'text-slate-100' : 'text-slate-500 line-through'}`}>
                      {f.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {f.dept} · {f.status === 'active' ? 'Active' : 'Revoked'}
                    </p>
                  </div>
                  {f.status === 'active' ? (
                    <button
                      onClick={() => revokeFaculty(f.id)}
                      className="shrink-0 rounded-lg bg-rose-600/15 px-2.5 py-1.5 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/30 transition hover:bg-rose-600 hover:text-white"
                    >
                      Revoke Access
                    </button>
                  ) : (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Locked
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Onboard new faculty */}
            <form onSubmit={onboardFaculty} className="mt-5 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Onboard New Faculty
              </p>
              <div className="mt-3 space-y-2.5">
                <input placeholder="Full name (e.g. Dr. P. Verma)" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
                <input type="email" placeholder="Faculty email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputClass} />
                <input placeholder="Department" value={newDept} onChange={(e) => setNewDept(e.target.value)} className={inputClass} />
                <button
                  type="submit"
                  disabled={!newName.trim() || !newEmail.trim() || !newDept.trim()}
                  className="h-10 w-full rounded-xl bg-emerald-600 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send faculty invitation
                </button>
              </div>
            </form>

            {/* Suspend user */}
            <form onSubmit={suspendUser} className="mt-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Suspend User Account
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  placeholder="Student email or roll no."
                  value={suspendTarget}
                  onChange={(e) => setSuspendTarget(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={!suspendTarget.trim()}
                  className="shrink-0 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition hover:bg-rose-500 active:scale-[0.99] disabled:opacity-40"
                >
                  Suspend
                </button>
              </div>

              {suspended.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {suspended.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 rounded-lg bg-rose-500/5 px-3 py-2 text-[11px] ring-1 ring-rose-500/15">
                      <span className="min-w-0 flex-1 truncate text-slate-400">
                        {s.user} <span className="text-slate-600">· {s.when}</span>
                      </span>
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-bold text-rose-300">Suspended</span>
                      <button
                        type="button"
                        onClick={() => restoreUser(s.id)}
                        className="font-bold text-emerald-400 transition hover:underline"
                      >
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </section>
        </div>

        {/* ===================== Placement & Skill Analytics ===================== */}
        <section id="analytics" className="mt-5 scroll-mt-24 rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Placement &amp; Skill Analytics</h2>
              <p className="text-xs text-slate-400">
                Institution-wide readiness and missing-skill radar
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-white/10">
              <BriefcaseIcon className="h-3.5 w-3.5" />
              2025–26 placement season
            </span>
          </div>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-5">
            {/* Readiness meter */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 p-5 ring-1 ring-emerald-400/20 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
                Placement Readiness Rate
              </p>
              <p className="mt-2 text-5xl font-black tracking-tight text-white">
                82<span className="text-2xl text-emerald-400">%</span>
              </p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
              </div>
              <p className="mt-2 text-[11px] text-emerald-200/70">
                +6 pts vs last semester · 1,048 of 1,280 eligible students placement-ready
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {ANALYTICS_STATS.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    <p className="text-lg font-extrabold text-white">{s.value}</p>
                    <p className="text-[10px] leading-tight text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill-gap bars (pure CSS flexbox chart) */}
            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10 lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top institution-wide missing skills
              </p>
              <div className="mt-4 space-y-4">
                {SKILL_GAPS.map(({ skill, gap }) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <p className="font-semibold text-slate-200">{skill}</p>
                      <p className={`font-bold ${gap >= 45 ? 'text-rose-400' : gap >= 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {gap}% gap
                      </p>
                    </div>
                    <div className="mt-1.5 flex h-3 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                      <div
                        className={`h-full rounded-full ${gapColor(gap)} transition-all duration-700`}
                        style={{ width: `${gap}%` }}
                        role="progressbar"
                        aria-valuenow={gap}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill} gap`}
                      />
                      <div className="h-full flex-1" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-white/[0.03] px-4 py-3 text-[11px] leading-relaxed text-slate-500 ring-1 ring-white/5">
                Bars = share of unplaced student profiles missing each skill, aggregated from
                recruiter ATS flags. Recommend forwarding the top two to the academic council
                as elective proposals.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          className="animate-fade-up fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-rose-400/30"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-rose-400" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
