import { useEffect, useState } from 'react'
import {
  BanknotesIcon,
  CheckIcon,
  ClockIcon,
  SparklesIcon,
  XIcon,
} from '../Icons'

/** Industry R&D problems looking for academic research partners. */
const INITIAL_PROBLEMS = [
  {
    id: 'c1',
    company: 'TechCorp',
    initials: 'Te',
    tile: 'bg-indigo-600',
    title: 'Optimizing React Rendering for Large Data Sets',
    grant: '₹50,000',
    posted: '2d ago',
    deadline: 'Apply by Sep 15',
    tags: ['React', 'Performance', 'Virtualization'],
    brief:
      'Our recruiter dashboard stutters past 10k rows. We want a research-backed rendering strategy — windowing, memoization, concurrent features — with reproducible benchmarks.',
  },
  {
    id: 'c2',
    company: 'FinTech Solutions',
    initials: 'Fi',
    tile: 'bg-sky-600',
    title: 'Blockchain Security Audit',
    grant: '₹75,000',
    posted: '5d ago',
    deadline: 'Apply by Sep 20',
    tags: ['Blockchain', 'Smart Contracts', 'Cryptography'],
    brief:
      'Independent audit of our escrow smart-contract suite: threat modeling, re-entrancy & oracle-risk analysis, plus a faculty-led remediation report.',
  },
  {
    id: 'c3',
    company: 'HealthStack',
    initials: 'He',
    tile: 'bg-emerald-600',
    title: 'Federated Learning for Medical Imaging',
    grant: '₹1,20,000',
    posted: '1w ago',
    deadline: 'Apply by Sep 22',
    tags: ['PyTorch', 'Privacy', 'MLOps'],
    brief:
      'Prototype a privacy-preserving training loop across 3 hospital silos — no raw data leaves site — and publish accuracy-vs-privacy findings.',
  },
]

const TIMELINES = ['4 weeks', '8 weeks', '12 weeks']

function ProposalModal({ problem, onClose, onSubmitted }) {
  const [outline, setOutline] = useState('')
  const [timeline, setTimeline] = useState(TIMELINES[1])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const canSubmit = outline.trim().length >= 20

  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto" role="dialog" aria-modal="true" aria-label={`Submit proposal — ${problem.title}`}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto my-10 w-full max-w-lg px-4">
        <div className="animate-fade-up rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
          {/* Problem summary */}
          <div className="flex items-start gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${problem.tile}`}>
              {problem.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500">{problem.company}</p>
              <h3 className="text-sm font-bold leading-snug text-slate-900">{problem.title}</h3>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <BanknotesIcon className="h-3 w-3" />
                Grant {problem.grant}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Proposal form */}
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="proposal-outline" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Proposal outline
              </label>
              <textarea
                id="proposal-outline"
                rows={5}
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Approach, milestones, research team & expected outcomes… (min. 20 characters)"
                className="block w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">
                {outline.trim().length}/20 min
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-700">Expected timeline</p>
              <div className="flex gap-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    aria-pressed={timeline === t}
                    className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      timeline === t
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => canSubmit && onSubmitted(problem, timeline)}
              disabled={!canSubmit}
              className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConsultancyBoard({ notify }) {
  const [problems, setProblems] = useState(INITIAL_PROBLEMS)
  const [active, setActive] = useState(null) // problem open in the modal

  const handleSubmitted = (problem, timeline) => {
    setProblems((list) => list.map((p) => (p.id === problem.id ? { ...p, submitted: true } : p)))
    setActive(null)
    notify(`Proposal sent to ${problem.company} — ${timeline} timeline · grant ${problem.grant}`)
  }

  return (
    <section id="consultancy" className="scroll-mt-24 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-600 text-white">
          <SparklesIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Consultancy &amp; Research Marketplace
          </h2>
          <p className="text-xs text-slate-500">
            Industry R&amp;D problems, solved with your lab
          </p>
        </div>
      </div>

      {/* Problem cards */}
      <div className="mt-5 space-y-4">
        {problems.map((p) => (
          <article
            key={p.id}
            className={`rounded-2xl border p-4 transition duration-150 ${
              p.submitted
                ? 'border-teal-200 bg-teal-50/40 dark:border-teal-500/30 dark:bg-teal-500/10'
                : 'border-slate-200 hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold text-white ${p.tile}`}>
                {p.initials}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-600">
                {p.company} <span className="font-normal text-slate-400">seeks R&amp;D</span>
              </p>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <ClockIcon className="h-3 w-3" />
                {p.posted}
              </span>
            </div>

            <h3 className="mt-2.5 text-sm font-bold leading-snug text-slate-900">{p.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.brief}</p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <BanknotesIcon className="h-3 w-3" />
                Grant: {p.grant}
              </span>
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium text-slate-400">{p.deadline}</span>
              <button
                onClick={() => !p.submitted && setActive(p)}
                disabled={p.submitted}
                className={`flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition ${
                  p.submitted
                    ? 'cursor-default bg-teal-600/10 text-teal-700 ring-1 ring-teal-200'
                    : 'bg-teal-600 text-white shadow-sm hover:bg-teal-500 active:scale-[0.98]'
                }`}
              >
                {p.submitted && <CheckIcon className="h-3.5 w-3.5" />}
                {p.submitted ? 'Proposal submitted' : 'Submit Proposal'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500 ring-1 ring-slate-100">
        Submitted proposals are routed to the company&apos;s R&amp;D cell and show up on
        your department&apos;s consultancy ledger within 48 hours.
      </p>

      {active && (
        <ProposalModal
          problem={active}
          onClose={() => setActive(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </section>
  )
}
