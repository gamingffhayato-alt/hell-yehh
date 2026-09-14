import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

/* Icons — Lucide style */
function ArrowRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  )
}
function Sparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3Z" />
      <path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
      <path d="M5 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
    </svg>
  )
}
function GraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3 2 8.5 12 14l10-5.5L12 3Z" />
      <path d="M6 10.5v3.5c0 .9 1.8 2.5 6 2.5s6-1.6 6-2.5v-3.5" />
    </svg>
  )
}
function Building(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01M12 9h.01M12 12h.01M12 15h.01M12 18h.01M15 9h.01M15 12h.01M15 15h.01M15 18h.01" />
    </svg>
  )
}
function BookOpen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 5c2.5-1.5 5.5-1.5 8 0v14c-2.5-1.5-5.5-1.5-8 0V5Z" />
      <path d="M22 5c-2.5-1.5-5.5-1.5-8 0v14c2.5-1.5 5.5-1.5 8 0V5Z" />
    </svg>
  )
}
function Layers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}
function CheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2 2 5-5" />
    </svg>
  )
}

export default function WhyInternX() {
  const { session } = useAuth()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
              <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Intern X</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#portals" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Portals
            </a>
            <Link to="/why-intern-x" className="text-[13.5px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white">
              Why Intern X
            </Link>
            <Link to="/contact" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link to="/dashboard" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100">
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link to="/login" className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100">
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Header / Intro */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
          <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -top-20 -right-32 h-[480px] w-[480px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />

          <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pt-28">
            <div className="mx-auto max-w-[880px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="mono text-[11px] font-medium tracking-[0.04em] text-slate-600 dark:text-slate-300">WHY INTERN X</span>
              </div>

              <h1 className="mt-6 text-[34px] font-[800] leading-[0.95] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[48px] lg:text-[56px]">
                What is Intern X?
              </h1>

              <div className="mt-8 grid gap-8 rounded-2xl bg-slate-50/70 p-6 ring-1 ring-gray-200 dark:bg-slate-900/60 dark:ring-slate-800 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
                <div>
                  <p className="text-[16px] leading-7 tracking-[-0.01em] text-slate-700 dark:text-slate-300 sm:text-[17px] sm:leading-8">
                    Intern X brings <span className="font-semibold text-slate-900 dark:text-white">3 portals in one unified place</span>: Internships, Skill Polishing, and Faculty R&D.
                  </p>
                  <p className="mt-4 text-[15px] leading-7 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                    Students stay updated to currently trending industry skills through continuous assessment and targeted learning paths. Industry partners post once and receive ranked, verified matches. Faculty get real cohort data to shape what they teach next.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Internships', 'Skill Polishing', 'Faculty R&D'].map((t) => (
                      <span key={t} className="mono inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                        <span className="h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white p-[1px] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-indigo-500/10 blur-[40px] dark:bg-indigo-500/20" />
                  <div className="relative h-full rounded-[15px] bg-slate-50 p-5 dark:bg-slate-900">
                    <div className="mono mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                      <span>Unified flow</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: GraduationCap, label: 'Student', sub: 'Digital CV • ATS • Tracker', active: true },
                        { icon: Building, label: 'Industry', sub: 'Roles • Ranked Matches • Feed' },
                        { icon: BookOpen, label: 'Faculty', sub: 'Analytics • R&D • Course Plan' },
                      ].map((row) => (
                        <div key={row.label} className={`flex items-center gap-3 rounded-xl px-3 py-3 ring-1 ${row.active ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white' : 'bg-white text-slate-700 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'}`}>
                          <span className={`grid h-8 w-8 place-items-center rounded-lg ${row.active ? 'bg-white/10 dark:bg-slate-900/10' : 'bg-slate-50 dark:bg-slate-700/50'} ring-1 ${row.active ? 'ring-white/10 dark:ring-slate-900/10' : 'ring-gray-200 dark:ring-slate-600'}`}>
                            <row.icon className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-[13px] font-semibold tracking-[-0.01em]">{row.label}</div>
                            <div className={`mono text-[11px] ${row.active ? 'text-white/70 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>{row.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it's helpful + Image Block */}
        <section className="border-y border-gray-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">How it's helpful</div>
                <h2 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[34px]">
                  Eliminating the communication gap between colleges and recruiters.
                </h2>
                <p className="mt-5 max-w-[560px] text-[15.5px] leading-7 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                  Colleges struggle to reach the right recruiters. Recruiters struggle to find verified talent. Intern X closes that loop — giving students AI-driven insights to get hired faster while ensuring every profile is 100% verified.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> 100% verified profiles
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                    <Sparkles className="h-4 w-4 text-indigo-500" /> AI-driven insights
                  </div>
                </div>
              </div>

              {/* Beautiful placeholder image block */}
              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent blur-[30px] dark:from-indigo-500/20 dark:via-violet-500/10" />
                <div className="relative overflow-hidden rounded-2xl bg-white p-[1px] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="relative overflow-hidden rounded-[15px] bg-slate-100 dark:bg-slate-900">
                    {/* Image placeholder — sleek, not illustration */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                      {/* Subtle grid */}
                      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                      {/* Glow */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[50px] dark:bg-indigo-500/20" />

                      <div className="relative grid h-full place-items-center p-8">
                        <div className="flex flex-col items-center">
                          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)] ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                            <Layers className="h-7 w-7" />
                          </span>
                          <div className="mt-5 text-center">
                            <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Unified Campus View</div>
                            <div className="mt-2 text-[14px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Students • Industry • Faculty</div>
                            <div className="mono mt-1 text-[12px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">One place, zero data crossover</div>
                          </div>

                          <div className="mt-6 grid grid-cols-3 gap-2">
                            {[
                              { k: 'Verified', v: '100%' },
                              { k: 'ATS', v: 'AI' },
                              { k: 'Match', v: 'Instant' },
                            ].map((s) => (
                              <div key={s.k} className="rounded-xl bg-white px-3 py-2 text-center ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-slate-700">
                                <div className="mono text-[10px] uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">{s.k}</div>
                                <div className="mt-0.5 text-[13px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">{s.v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="mono flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live verified feed
                      </div>
                      <div className="mono text-[11px] text-slate-400 dark:text-slate-500">intern-x • SIH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Breakdown — 3 column grid */}
        <section id="portals" className="bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-[720px] text-center">
              <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Feature Breakdown</div>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[36px]">Built for every stakeholder.</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* For Students */}
              <div className="group relative rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-7 ring-1 ring-gray-200 transition group-hover:ring-gray-300 dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                    <GraduationCap className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">For Students</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">AI ATS Scanner, Skill Polishing, and precise Skill Gap identification.</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['ATS Scanner', 'Skill Polishing', 'Skill Gap'].map((t) => (
                      <span key={t} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* For Industry */}
              <div className="group relative rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-7 ring-1 ring-gray-200 transition group-hover:ring-gray-300 dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <Building className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">For Industry</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">Access to 100% system-verified CVs. No fake credentials.</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['100% Verified', 'No Fake CVs', 'Instant Matches'].map((t) => (
                      <span key={t} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* For Faculties */}
              <div className="group relative rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-7 ring-1 ring-gray-200 transition group-hover:ring-gray-300 dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <BookOpen className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">For Faculties</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">R&D opportunities and data-driven course planning based on student cohort gaps.</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['R&D Board', 'Cohort Analytics', 'Course Planning'].map((t) => (
                      <span key={t} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-gray-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
            <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-[1px] dark:bg-white">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[60px] dark:from-indigo-500/10" />
              <div className="relative overflow-hidden rounded-[27px] bg-slate-900 px-8 py-14 dark:bg-slate-950 sm:px-12 sm:py-16">
                <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/5 blur-[40px]" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[50px]" />

                <div className="relative mx-auto max-w-[720px] text-center">
                  <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="mono text-[11px] font-medium tracking-[0.04em] text-white/70">READY TO START</span>
                  </div>
                  <h2 className="mt-6 text-[32px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[44px]">Ready to bridge the gap?</h2>
                  <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-6 tracking-[-0.01em] text-white/60">Join Intern X — the unified place for internships, skill polishing, and faculty R&D.</p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/login?role=student" className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-[14px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-white transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto">
                      Create an Account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/contact" className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-white/10 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white ring-1 ring-white/15 transition hover:bg-white/15 active:scale-[0.98] sm:w-auto">
                      Contact
                    </Link>
                  </div>

                  <div className="mono mt-6 text-[11px] tracking-[0.02em] text-white/40">Built for Smart India Hackathon • 100% verified profiles</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                <span className="text-[10px] font-bold tracking-[-0.02em]">IX</span>
              </span>
              <div>
                <div className="text-[13px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Intern X</div>
                <div className="mono text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500">Built for Smart India Hackathon</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/contact" className="text-[13px] font-medium tracking-[-0.01em] text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Contact
              </Link>
              <span className="h-3 w-px bg-gray-200 dark:bg-slate-800" />
              <span className="mono text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} Intern X</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
