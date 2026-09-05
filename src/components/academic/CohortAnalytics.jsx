import { useState } from 'react'
import {
  ChartBarIcon,
  DownloadIcon,
  ShareIcon,
  SparklesIcon,
  UsersIcon,
} from '../Icons'

/** Aggregated skill-gap analytics per cohort (HTML/CSS bars — no chart lib). */
const COHORTS = [
  {
    id: 'cse2',
    label: 'B.Tech CSE · 2nd Year',
    stats: [
      { label: 'Students tracked', value: '128' },
      { label: 'Avg. quiz score', value: '78/100' },
      { label: 'Placement-ready', value: '42%' },
      { label: 'At-risk students', value: '14', alert: true },
    ],
    skills: [
      { name: 'Frontend (React/Vite)', value: 85 },
      { name: 'Backend APIs (Node/Supabase)', value: 62 },
      { name: 'Testing & CI/CD', value: 55 },
      { name: 'Advanced System Design', value: 40 },
      { name: 'Database Indexing', value: 38 },
    ],
    action:
      'Introduce System Design case studies — run a 2-week module on load balancing & B-tree indexing, timed right before the placement drive.',
  },
  {
    id: 'cse3',
    label: 'B.Tech CSE · 3rd Year',
    stats: [
      { label: 'Students tracked', value: '96' },
      { label: 'Avg. quiz score', value: '74/100' },
      { label: 'Placement-ready', value: '61%' },
      { label: 'At-risk students', value: '9', alert: true },
    ],
    skills: [
      { name: 'Frontend (React/Vite)', value: 88 },
      { name: 'Backend APIs (Node/Supabase)', value: 71 },
      { name: 'Advanced System Design', value: 58 },
      { name: 'Database Indexing', value: 52 },
      { name: 'DevOps & Cloud Fundamentals', value: 46 },
    ],
    action:
      'Add a DevOps crash course plus a capstone review rubric — cloud fundamentals are the only sub-50% signal in this cohort.',
  },
  {
    id: 'mca1',
    label: 'MCA · 1st Year',
    stats: [
      { label: 'Students tracked', value: '64' },
      { label: 'Avg. quiz score', value: '81/100' },
      { label: 'Placement-ready', value: '35%' },
      { label: 'At-risk students', value: '6', alert: true },
    ],
    skills: [
      { name: 'Programming Fundamentals', value: 90 },
      { name: 'Frontend (React/Vite)', value: 76 },
      { name: 'SQL & Data Modeling', value: 64 },
      { name: 'Soft Skills & Interviews', value: 49 },
      { name: 'Advanced System Design', value: 44 },
    ],
    action:
      'Schedule fortnightly mock interviews and a distributed-systems seminar series before internship season begins.',
  },
]

const bandOf = (v) =>
  v >= 75
    ? { bar: 'bg-emerald-500', text: 'text-emerald-600' }
    : v >= 50
      ? { bar: 'bg-amber-400', text: 'text-amber-600' }
      : { bar: 'bg-rose-500', text: 'text-rose-600' }

export default function CohortAnalytics({ notify }) {
  const [cohortId, setCohortId] = useState(COHORTS[0].id)
  const cohort = COHORTS.find((c) => c.id === cohortId)

  return (
    <section id="cohort" className="scroll-mt-24 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-600 text-white">
            <ChartBarIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Student Monitoring
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated cohort skill gaps — from quiz &amp; project signals
            </p>
          </div>
        </div>

        {/* Cohort selector */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Select cohort">
          {COHORTS.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cohortId === c.id}
              onClick={() => setCohortId(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                cohortId === c.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat chips */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cohort.stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
            <p className={`text-xl font-extrabold ${s.alert ? 'text-rose-500' : 'text-slate-900'}`}>
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Skill bars */}
      <div key={cohort.id} className="animate-fade-up mt-6 space-y-4">
        {cohort.skills.map((skill) => {
          const band = bandOf(skill.value)
          const gap = 100 - skill.value
          const isGap = skill.value < 50
          return (
            <div key={skill.name}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  {skill.name}
                  {isGap && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-rose-200">
                      {gap}% skill gap
                    </span>
                  )}
                </p>
                <p className={`text-sm font-bold ${band.text}`}>{skill.value}%</p>
              </div>
              <div
                className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={skill.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div
                  className={`h-full rounded-full ${band.bar} transition-all duration-700`}
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> ≥75% &nbsp;Strong
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> 50–74% &nbsp;Developing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> &lt;50% &nbsp;Skill gap
        </span>
      </div>

      {/* Recommended action */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-600 text-white">
          <SparklesIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Recommended action
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{cohort.action}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => notify(`Cohort report exported — ${cohort.label} (PDF)`)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-500 active:scale-[0.99]"
        >
          <DownloadIcon className="h-4 w-4" />
          Export cohort report
        </button>
        <button
          onClick={() => notify(`Skill-gap summary shared with the placement cell — ${cohort.label}`)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-teal-200 text-xs font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white"
        >
          <ShareIcon className="h-4 w-4" />
          Share with placement cell
        </button>
        <span className="hidden items-center gap-1.5 rounded-xl bg-slate-50 px-3 text-[11px] font-medium text-slate-400 ring-1 ring-slate-100 sm:flex">
          <UsersIcon className="h-3.5 w-3.5" />
          Updated 2h ago
        </span>
      </div>
    </section>
  )
}
