import { useState } from 'react'
import { CheckIcon, PlusIcon, SparklesIcon, XIcon } from '../Icons'

const TYPES = ['Internship', 'Part-time', 'Full-time']

const inputClass =
  'block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'

export default function JobCreator({ postings, onPublish, notify }) {
  // Pre-filled smart draft (auto-generated from the company's hiring history)
  const [title, setTitle] = useState('Frontend Developer Intern')
  const [skills, setSkills] = useState(['React', 'Supabase', 'Tailwind'])
  const [newSkill, setNewSkill] = useState('')
  const [degree, setDegree] = useState('B.Tech Computer Science')
  const [type, setType] = useState('Internship')
  const [stipend, setStipend] = useState('₹15,000 / month')
  const [location, setLocation] = useState('Remote')

  const addSkill = (e) => {
    e.preventDefault()
    const s = newSkill.trim()
    if (!s || skills.includes(s)) return
    setSkills((sk) => [...sk, s])
    setNewSkill('')
  }

  const publish = (e) => {
    e.preventDefault()
    onPublish({
      id: `jp-${Date.now()}`,
      title: title.trim(),
      skills,
      degree: degree.trim(),
      type,
      stipend: stipend.trim(),
      location: location.trim(),
      status: 'live',
      postedOn: 'Posted just now',
    })
  }

  return (
    <section id="post" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Smart Job & Internship Creator</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <SparklesIcon className="h-3.5 w-3.5 text-emerald-500" />
            Draft auto-generated from your last 12 postings
          </p>
        </div>
        <button
          onClick={() => notify('Draft saved — resumes matching will run once you publish')}
          className="rounded-full border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Save draft
        </button>
      </div>

      <form onSubmit={publish} className="mt-5 space-y-4">
        {/* Role + type toggle */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Role title
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`h-9 rounded-full px-4 text-xs font-semibold transition active:scale-[0.98] ${
                type === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <SparklesIcon className="h-3 w-3" /> Auto-skills ON
          </span>
        </div>

        {/* Skill tags */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Skill tags (auto-generated)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="group flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                {s}
                <button
                  type="button"
                  onClick={() => setSkills((sk) => sk.filter((x) => x !== s))}
                  aria-label={`Remove ${s}`}
                  className="text-emerald-400 transition hover:text-emerald-700"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            <form onSubmit={addSkill} className="flex items-center gap-1.5">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="+ add skill"
                className="h-8 w-28 rounded-full border border-dashed border-slate-300 bg-white px-3 text-xs outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />
            </form>
          </div>
        </div>

        {/* Degree / stipend / location */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Degree requirement
            </label>
            <input value={degree} onChange={(e) => setDegree(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stipend / pay
            </label>
            <input value={stipend} onChange={(e) => setStipend(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.99]"
        >
          <PlusIcon className="h-4 w-4" />
          Publish posting
        </button>
      </form>

      {/* Live postings */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Your live postings · {postings.length}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {postings.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
