import { useState } from 'react'
import {
  BookmarkIcon,
  BookIcon,
  CalendarIcon,
  CheckIcon,
  MapPinIcon,
  SparklesIcon,
} from '../Icons'

/** Faculty Development Programs — industrial training curated for professors. */
const INITIAL_FDPS = [
  {
    id: 'f1',
    provider: 'Google',
    initials: 'Go',
    tile: 'bg-blue-600',
    title: 'Google AI Pro: Integrating LLMs into CS Curriculum',
    meta: 'Online · 4 weeks · Live sessions',
    status: 'enrolling',
    skills: ['LLMs', 'Prompt Engineering', 'Curriculum Design'],
    seatsTotal: 40,
    seatsFilled: 32,
  },
  {
    id: 'f2',
    provider: 'TechCorp',
    initials: 'Te',
    tile: 'bg-teal-600',
    title: 'TechCorp Cloud Architecture Masterclass',
    meta: 'Hybrid · 2 days · TechCorp Bengaluru campus',
    status: 'next-thu',
    skills: ['AWS', 'System Design', 'Cost Optimization'],
    seatsTotal: 25,
    seatsFilled: 18,
  },
  {
    id: 'f3',
    provider: 'NVIDIA DLI',
    initials: 'Nv',
    tile: 'bg-green-600',
    title: 'Accelerated Data Science in the Classroom',
    meta: 'Self-paced · 8 hrs · Includes teaching kit',
    status: 'enrolling',
    skills: ['RAPIDS', 'CUDA', 'Python'],
    seatsTotal: 60,
    seatsFilled: 54,
  },
  {
    id: 'f4',
    provider: 'AWS Academy',
    initials: 'Aw',
    tile: 'bg-amber-500',
    title: 'AWS Academy Cloud Foundations for Educators',
    meta: 'Online · 6 weeks · Certification track',
    status: 'enrolling',
    applied: true, // pre-applied → shows the applied state out of the box
    skills: ['Cloud Basics', 'IAM', 'Educator Credits'],
    seatsTotal: 50,
    seatsFilled: 41,
  },
]

function StatusChip({ status }) {
  if (status === 'next-thu') {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
        <CalendarIcon className="h-3 w-3" />
        Next Thursday
      </span>
    )
  }
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      Enrolling
    </span>
  )
}

export default function FdpBoard({ notify }) {
  const [fdps, setFdps] = useState(INITIAL_FDPS)
  const [saved, setSaved] = useState(() => new Set())

  const apply = (fdp) => {
    if (fdp.applied) return
    setFdps((list) =>
      list.map((f) =>
        f.id === fdp.id
          ? { ...f, applied: true, seatsFilled: Math.min(f.seatsFilled + 1, f.seatsTotal) }
          : f,
      ),
    )
    notify(`Application sent — “${fdp.title}”`)
  }

  const toggleSave = (fdp) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(fdp.id)) {
        next.delete(fdp.id)
        notify(`Removed “${fdp.title}” from saved FDPs`)
      } else {
        next.add(fdp.id)
        notify(`Saved “${fdp.title}” for later`)
      }
      return next
    })
  }

  return (
    <section id="fdp" className="scroll-mt-24 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-600 text-white">
            <BookIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Faculty Development Programs
            </h2>
            <p className="text-xs text-slate-500">
              Industrial training workshops designed for professors
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700 ring-1 ring-teal-100 sm:flex">
          <SparklesIcon className="h-3 w-3" />
          {fdps.filter((f) => f.applied).length} applied
        </span>
      </div>

      {/* FDP cards */}
      <div className="mt-5 space-y-4">
        {fdps.map((fdp) => {
          const isSaved = saved.has(fdp.id)
          const pct = Math.round((fdp.seatsFilled / fdp.seatsTotal) * 100)
          return (
            <article
              key={fdp.id}
              className="rounded-2xl border border-slate-200 p-4 transition duration-150 hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60 sm:p-5"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${fdp.tile}`}
                >
                  {fdp.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-snug text-slate-900">
                    {fdp.title}
                  </h3>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{fdp.provider}</span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {fdp.meta}
                    </span>
                  </p>
                </div>
                <StatusChip status={fdp.status} />
              </div>

              {/* Skills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {fdp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Seats + actions */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="min-w-36 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>
                      Seats {fdp.seatsFilled}/{fdp.seatsTotal}
                    </span>
                    <span className={pct >= 85 ? 'font-bold text-rose-500' : 'text-slate-400'}>
                      {pct >= 85 ? 'Filling fast' : `${pct}% full`}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 85 ? 'bg-rose-400' : 'bg-teal-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSave(fdp)}
                    aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
                    aria-pressed={isSaved}
                    className={`grid h-9 w-9 place-items-center rounded-xl border transition ${
                      isSaved
                        ? 'border-teal-200 bg-teal-50 text-teal-600'
                        : 'border-slate-200 text-slate-400 hover:border-teal-200 hover:text-teal-600'
                    }`}
                  >
                    <BookmarkIcon className="h-4 w-4" filled={isSaved} />
                  </button>
                  <button
                    onClick={() => apply(fdp)}
                    disabled={fdp.applied}
                    className={`flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition ${
                      fdp.applied
                        ? 'cursor-default bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                        : 'bg-teal-600 text-white shadow-sm hover:bg-teal-500 active:scale-[0.98]'
                    }`}
                  >
                    {fdp.applied && <CheckIcon className="h-3.5 w-3.5" />}
                    {fdp.applied ? 'Applied' : 'Apply for FDP'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
