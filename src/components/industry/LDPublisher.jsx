import { useState } from 'react'
import { BookIcon, PlusIcon, RocketIcon, XIcon } from '../Icons'

const INITIAL_MODULES = [
  {
    id: 'm1',
    title: 'TechCorp Cloud Architecture Workshop',
    kind: 'Workshop',
    enrolled: 45,
    cap: 60,
    status: 'Live · Cohort 3',
    tint: 'bg-sky-500',
  },
  {
    id: 'm2',
    title: 'React Bootcamp — Cohort 2',
    kind: 'Training module',
    enrolled: 28,
    cap: 30,
    status: 'Live · Week 2 of 4',
    tint: 'bg-violet-500',
  },
]

function HostHackathonModal({ onClose, onHost }) {
  const [title, setTitle] = useState('TechCorp Innovation Sprint 2026')
  const [date, setDate] = useState('Oct 12–13, 2026')
  const [seats, setSeats] = useState('100')

  const inputClass =
    'block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Host New Hackathon</h3>
            <p className="text-xs text-slate-500">Goes live on campus feeds instantly</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onHost({
              id: `m-${Date.now()}`,
              title: title.trim(),
              kind: 'Hackathon',
              enrolled: 0,
              cap: parseInt(seats, 10) || 100,
              status: 'Just launched 🚀',
              tint: 'bg-emerald-500',
            })
          }}
        >
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hackathon title" className={inputClass} />
          <input required value={date} onChange={(e) => setDate(e.target.value)} placeholder="Dates (e.g. Oct 12–13, 2026)" className={inputClass} />
          <input required value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="Team seats (e.g. 100)" className={inputClass} />
          <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.99]">
            <RocketIcon className="h-4 w-4" />
            Launch hackathon
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LDPublisher({ notify }) {
  const [modules, setModules] = useState(INITIAL_MODULES)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="ld" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">L&D Publisher</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Hosted workshops, training modules & hackathons
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {modules.length} active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {modules.map((m) => {
          const pct = Math.min(100, Math.round((m.enrolled / m.cap) * 100))
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-200 p-4 transition duration-150 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50"
            >
              <div className="flex items-start gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${m.tint}`}>
                  <BookIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-slate-900">{m.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {m.enrolled} Students Enrolled · {m.status}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    {m.enrolled}/{m.cap} seats filled
                  </p>
                </div>
              </div>
              <button
                onClick={() => notify(`Share link for “${m.title}” copied`)}
                className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                Share with campus
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.99]"
      >
        <PlusIcon className="h-4 w-4" />
        Host New Hackathon
      </button>

      {modalOpen && (
        <HostHackathonModal
          onClose={() => setModalOpen(false)}
          onHost={(m) => {
            setModules((ms) => [m, ...ms])
            setModalOpen(false)
            notify(`🚀 “${m.title}” is live on 3 campus feeds`)
          }}
        />
      )}
    </section>
  )
}
