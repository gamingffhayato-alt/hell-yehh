import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

function ArrowRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M10 4l6 6-6 6" />
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
      <path d="M22 5c-2.5-1.5-5.5-1.5-8 0v14c2.5-1.5-5.5-1.5-8 0V5Z" />
    </svg>
  )
}
function Sparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3Z" />
      <path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
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
function ImageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
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
            <Link to="/" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Home
            </Link>
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
        {/* Header / Intro — Clean, centered, no flowchart */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
          <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -top-20 -right-32 h-[480px] w-[480px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />

          <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pt-28">
            <div className="mx-auto max-w-[760px] text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="mono text-[11px] font-medium tracking-[0.04em] text-slate-600 dark:text-slate-300">WHY INTERN X</span>
              </div>

              <h1 className="mt-6 text-[34px] font-[800] leading-[0.95] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[48px] lg:text-[56px]">
                What is Intern X?
              </h1>

              <p className="mx-auto mt-6 max-w-[640px] text-[17px] font-medium leading-7 tracking-[-0.01em] text-slate-900 dark:text-white sm:text-[18px] sm:leading-8">
                Intern X brings 3 portals in one unified place: Internships, Skill Polishing, and Faculty R&D.
              </p>

              <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 tracking-[-0.01em] text-slate-600 dark:text-slate-300 sm:text-[16px]">
                Students stay updated to currently trending industry skills through continuous assessment and targeted learning paths.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['Internships', 'Skill Polishing', 'Faculty R&D', '100% Verified Profiles'].map((t) => (
                  <span key={t} className="mono inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                    <span className="h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it's helpful + Placeholder Image Block */}
        <section className="border-y border-gray-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-[1120px] grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">How it's helpful</div>
                <h2 className="mt-3 text-[26px] font-bold leading-[1.15] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[32px]">
                  Eliminating the communication gap between colleges and recruiters.
                </h2>
                <p className="mt-5 max-w-[560px] text-[15.5px] leading-7 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                  We give students AI-driven insights to polish their skills and get hired faster, while ensuring every profile recruiters see is 100% verified.
                </p>

                <div className="mt-8 grid gap-3">
                  {[
                    { title: 'For students', desc: 'Continuous assessment that maps you to trending roles.' },
                    { title: 'For recruiters', desc: 'No noise — only verified, ranked candidates.' },
                    { title: 'For faculty', desc: 'Real cohort data to shape relevant curriculum.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="text-[13px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white">{item.title}</div>
                        <div className="mt-0.5 text-[12.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beautiful placeholder image block — ready for image drop */}
              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent blur-[30px] dark:from-indigo-500/20 dark:via-violet-500/10" />
                <div className="relative overflow-hidden rounded-2xl bg-white p-[1px] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="relative overflow-hidden rounded-[15px] bg-slate-50 dark:bg-slate-900">
                    <div className="relative aspect-[16/11] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[50px] dark:bg-indigo-500/20" />

                      <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700">
                          <ImageIcon className="h-6 w-6" />
                        </span>
                        <div className="mt-5">
                          <div className="text-[13px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Placeholder — drop campus visual here</div>
                          <div className="mono mt-1 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">rounded-2xl bg-slate-50 dark:bg-slate-900 • subtle glow • ready for image</div>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <span className="mono rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">16:11 • Premium</span>
                          <span className="mono rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">No illustration</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="mono flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Verified ecosystem
                      </div>
                      <div className="mono text-[11px] text-slate-400 dark:text-slate-500">Intern X • SIH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Breakdown — Rich 3-column Grid */}
        <section className="bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-[720px] text-center">
              <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Feature Breakdown</div>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[36px]">Built for every stakeholder.</h2>
              <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">One platform, three powerful outcomes — students grow, recruiters hire, faculty lead.</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* For Students */}
              <div className="group relative rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-7 ring-1 ring-gray-200 transition group-hover:ring-gray-300 dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                    <GraduationCap className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">For Students</h3>
                  <p className="mt-3 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-slate-900 dark:text-white">AI ATS Scanner, Skill Polishing, and precise Skill Gap identification.</p>
                  <p className="mt-3 text-[13px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">Build a digital CV that evolves. Get instant AI feedback on your resume, discover exactly which trending skills you’re missing, and follow a clear polishing path to close the gap before you apply.</p>

                  <div className="mt-6 space-y-2">
                    {[
                      'ATS Scanner — instant, actionable resume feedback',
                      'Skill Polishing — guided paths for trending roles',
                      'Skill Gap — precise, role-specific missing skills',
                    ].map((t) => (
                      <div key={t} className="flex gap-2 text-[12.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['Digital CV', 'ATS', 'Tracker'].map((tag) => (
                      <span key={tag} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{tag}</span>
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
                  <p className="mt-3 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-slate-900 dark:text-white">Access to 100% system-verified CVs. No fake credentials, just instant, accurate matches.</p>
                  <p className="mt-3 text-[13px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">Post roles once and get instant ATS-ranked candidate matches. Every profile is verified by the institution, so you hire with confidence and cut screening time dramatically.</p>

                  <div className="mt-6 space-y-2">
                    {[
                      '100% system-verified — no fake credentials',
                      'Instant, accurate matches — ranked by fit',
                      'Direct feed — track applicants in one place',
                    ].map((t) => (
                      <div key={t} className="flex gap-2 text-[12.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['Verified CVs', 'ATS Rank', 'Feed'].map((tag) => (
                      <span key={tag} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{tag}</span>
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
                  <p className="mt-3 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-slate-900 dark:text-white">Exclusive R&D opportunities and data-driven course planning based on real student cohort gaps.</p>
                  <p className="mt-3 text-[13px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">Monitor cohort analytics, identify skill gaps across batches, and publish R&D consultancy. Use real placement data to plan courses that actually match industry demand.</p>

                  <div className="mt-6 space-y-2">
                    {[
                      'Cohort analytics — see where batches stand',
                      'R&D opportunities — publish and collaborate',
                      'Course planning — driven by real gaps',
                    ].map((t) => (
                      <div key={t} className="flex gap-2 text-[12.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {['R&D', 'Analytics', 'Course Plan'].map((tag) => (
                      <span key={tag} className="mono rounded-full bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA — Must route to /signup */}
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
                  <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-6 tracking-[-0.01em] text-white/60">Join Intern X — the unified place for internships, skill polishing, and faculty R&D. Built on 100% verified profiles.</p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/signup" className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-[14px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-white transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto">
                      Create an Account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/contact" className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-white/10 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white ring-1 ring-white/15 transition hover:bg-white/15 active:scale-[0.98] sm:w-auto">
                      Contact
                    </Link>
                  </div>

                  <div className="mono mt-6 flex items-center justify-center gap-2 text-[11px] tracking-[0.02em] text-white/40">
                    <Sparkles className="h-3 w-3" /> Built for Smart India Hackathon • 100% verified profiles
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
