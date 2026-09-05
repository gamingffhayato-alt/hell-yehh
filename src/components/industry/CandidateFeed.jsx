import { useEffect, useState } from 'react'
import {
  BriefcaseIcon,
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  FlameIcon,
  MailIcon,
  SparklesIcon,
  XIcon,
} from '../Icons'

/* Ranked candidates per posting (ATS auto-match) */
const ALL_MATCHES = {
  jp1: [
    {
      id: 'c1',
      name: 'Saksham V.',
      headline: '1st Year · B.Tech CSE · Quantum University · React/Vite Portfolio attached',
      match: 95,
      skills: ['React', 'Vite', 'Supabase', 'Tailwind'],
      highlight: 'Built the JARVIS Telegram bot (Grok API) — 200+ queries served in week one',
      tint: 'bg-indigo-500',
      assessment: 'DSA 5/5',
    },
    {
      id: 'c2',
      name: 'Priya S.',
      headline: '2nd Year · B.Tech IT · Quantum University',
      match: 88,
      skills: ['Grok API', 'Node.js', 'Express', 'MongoDB'],
      highlight: 'Deployed 3 full-stack apps; runner-up at QuantumHacks 2025',
      tint: 'bg-rose-500',
      assessment: 'DSA 4/5',
    },
    {
      id: 'c3',
      name: 'Arjun M.',
      headline: '1st Year · B.Tech CSE · Quantum University',
      match: 82,
      skills: ['React', 'Tailwind', 'Figma'],
      highlight: 'Strong component-design portfolio; 5/5 on the DS assessment',
      tint: 'bg-emerald-500',
      assessment: 'DSA 5/5',
    },
  ],
  jp2: [
    {
      id: 'c4',
      name: 'Diya K.',
      headline: '3rd Year · B.Tech CSE · Quantum University',
      match: 76,
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      highlight: 'Interned on a payments microservice last summer',
      tint: 'bg-amber-500',
      assessment: 'DSA 4/5',
    },
  ],
}

const RANK_STYLES = [
  'bg-amber-400 text-amber-950',
  'bg-slate-300 text-slate-800',
  'bg-orange-300 text-orange-950',
]

function CvModal({ candidate: c, posting, onClose, onShortlist, shortlisted, notify }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-extrabold text-white ${c.tint}`}>
              {c.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-500">Digital CV · matched for “{posting.title}”</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Match meter */}
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <FlameIcon className="h-4 w-4 text-orange-500" /> ATS match score
            </span>
            <span className="text-sm font-extrabold text-emerald-600">{c.match}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.match}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">{c.headline}</p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Standout signal</p>
          <p className="mt-1 text-sm text-slate-700">⚡ {c.highlight}</p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills & assessment</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {c.skills.map((s) => (
              <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {s}
              </span>
            ))}
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {c.assessment}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <button
            onClick={() => onShortlist(c)}
            className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition active:scale-[0.99] ${
              shortlisted
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-900 text-white hover:bg-slate-700'
            }`}
          >
            <CheckIcon className="h-4 w-4" />
            {shortlisted ? 'Shortlisted' : 'Shortlist'}
          </button>
          <a
            href="https://t.me/jarvis01educationbot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalIcon className="h-4 w-4" />
            Projects
          </a>
          <button
            onClick={() => notify(`Intro email drafted to ${c.name} — check your outbox (demo)`)}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MailIcon className="h-4 w-4" />
            Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CandidateFeed({ postings, notify }) {
  const [selectedId, setSelectedId] = useState(postings[0]?.id ?? null)
  const [shortlisted, setShortlisted] = useState({})
  const [cvCandidate, setCvCandidate] = useState(null)

  const posting = postings.find((p) => p.id === selectedId) ?? postings[0]
  const matches = posting ? (ALL_MATCHES[posting.id] ?? []) : []
  const shortlistCount = Object.values(shortlisted).filter(Boolean).length

  const toggleShortlist = (c) => {
    setShortlisted((s) => {
      const next = { ...s, [c.id]: !s[c.id] }
      notify(next[c.id] ? `${c.name} shortlisted ✓` : `${c.name} removed from shortlist`)
      return next
    })
  }

  return (
    <section id="ats" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <SparklesIcon className="h-5 w-5 text-emerald-400" />
            Automated Candidate Matching · ATS
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            124 applicants auto-screened · ranked by skill match
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
          {shortlistCount} shortlisted
        </span>
      </div>

      {/* Posting selector */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {postings.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.98] ${
              selectedId === p.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Ranked candidates */}
      <div className="mt-4 space-y-3">
        {matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-white/5 p-8 text-center">
            <BriefcaseIcon className="mx-auto h-6 w-6 text-slate-500" />
            <p className="mt-2 text-sm font-medium text-slate-300">No matching candidates yet</p>
            <p className="mt-1 text-xs text-slate-500">
              The ATS will rank students here the moment they apply to “{posting?.title}”.
            </p>
          </div>
        )}

        {matches.map((c, idx) => (
          <article
            key={c.id}
            className="group rounded-2xl border border-slate-700/70 bg-white/5 p-4 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/[0.08]"
          >
            <div className="flex items-start gap-3 sm:items-center">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${RANK_STYLES[idx] ?? 'bg-slate-600 text-white'}`}>
                #{idx + 1}
              </span>
              <span className={`hidden h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white sm:grid ${c.tint}`}>
                {c.name.slice(0, 2).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-400">
                    <FlameIcon className="h-3.5 w-3.5" />
                    {c.match}% Match
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400">{c.headline}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setCvCandidate(c)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <ExternalIcon className="h-3.5 w-3.5" />
                  View Digital CV
                </button>
                <button
                  onClick={() => toggleShortlist(c)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98] ${
                    shortlisted[c.id]
                      ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  {shortlisted[c.id] ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>
            </div>

            {/* Match bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300"
                style={{ width: `${c.match}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={() => notify('Full ranked list (121 more) exports after this demo')}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-emerald-400/50 hover:text-emerald-300"
      >
        <DownloadIcon className="h-4 w-4" />
        Export full ranked list as CSV
      </button>

      {cvCandidate && (
        <CvModal
          candidate={cvCandidate}
          posting={posting}
          shortlisted={Boolean(shortlisted[cvCandidate.id])}
          onShortlist={(c) => { toggleShortlist(c) }}
          onClose={() => setCvCandidate(null)}
          notify={notify}
        />
      )}
    </section>
  )
}
