import { useState } from 'react'
import { CalendarIcon, CheckIcon, UsersIcon, XIcon } from '../Icons'

const INITIAL_SCHEDULE = [
  {
    id: 's1',
    title: 'Project Review: EduBridge App',
    who: 'with Priya S.',
    time: '2:00 PM',
    tint: 'bg-violet-100 text-violet-700',
  },
  {
    id: 's2',
    title: '1:1 Mentorship Call',
    who: 'with Saksham V.',
    time: '4:30 PM',
    tint: 'bg-emerald-100 text-emerald-700',
  },
]

const INITIAL_REQUESTS = [
  {
    id: 'r1',
    name: 'Aman G.',
    meta: 'B.Tech 2nd yr · Quantum University',
    topic: 'Resume review for frontend roles',
  },
  {
    id: 'r2',
    name: 'Diya K.',
    meta: 'BCA 1st yr',
    topic: 'Career guidance: Web dev roadmap',
  },
]

export default function Mentorship({ notify }) {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE)
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [accepting, setAccepting] = useState(true)

  const accept = (r) => {
    setRequests((rs) => rs.filter((x) => x.id !== r.id))
    setSchedule((s) => [
      ...s,
      {
        id: `s${Date.now()}`,
        title: `1:1 with ${r.name} — ${r.topic.split(':')[0]}`,
        who: 'Request accepted',
        time: 'Tomorrow · 5:00 PM',
        tint: 'bg-emerald-100 text-emerald-700',
      },
    ])
    notify(`Accepted ${r.name}'s request — added to tomorrow's schedule`)
  }

  const decline = (r) => {
    setRequests((rs) => rs.filter((x) => x.id !== r.id))
    notify(`Declined ${r.name}'s request — polite email sent (demo)`)
  }

  return (
    <section id="mentorship" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Mentorship Portal</h2>
          <p className="mt-0.5 text-xs text-slate-500">Volunteer hours, reviews & 1-on-1s</p>
        </div>

        {/* Accepting mentees toggle */}
        <label className="flex cursor-pointer items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Accepting mentees</span>
          <button
            role="switch"
            aria-checked={accepting}
            onClick={() => {
              setAccepting((a) => !a)
              notify(!accepting ? 'You are now accepting mentee requests' : 'Mentee requests paused')
            }}
            className={`relative h-6 w-11 rounded-full transition ${
              accepting ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                accepting ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Today's schedule */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <CalendarIcon className="h-4 w-4" />
          Today's schedule
        </p>
        <div className="mt-3 space-y-2.5">
          {schedule.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <span className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${s.tint}`}>
                {s.time}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="truncate text-xs text-slate-500">{s.who}</p>
              </div>
              <button
                onClick={() => notify(`Meeting link for “${s.title}” copied to clipboard`)}
                className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-700"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pending requests */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <UsersIcon className="h-4 w-4" />
          Pending requests · {requests.length}
        </p>
        {requests.length === 0 && (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-400">
            Inbox zero — no pending requests 🎉
          </p>
        )}
        <div className="mt-3 space-y-2.5">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:border-emerald-300"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  New
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{r.meta}</p>
              <p className="mt-1.5 text-xs font-medium text-slate-700">“{r.topic}”</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => accept(r)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.99]"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  Accept
                </button>
                <button
                  onClick={() => decline(r)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-rose-600 active:scale-[0.99]"
                >
                  <XIcon className="h-3.5 w-3.5" />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
