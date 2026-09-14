import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

/* Icons — Lucide style, inline SVG, no external deps */
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
      <path d="M22 5c-2.5-1.5-5.5-1.5-8 0v14c2.5-1.5 5.5-1.5 8 0V5Z" />
    </svg>
  )
}
function ShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3 7 5.5v5c0 3.5 2.2 6.8 5 8.5 2.8-1.7 5-5 5-8.5v-5L12 3Z" />
      <path d="M9 12 11 14l3-4" />
    </svg>
  )
}

export default function LandingPage() {
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

      {/* Navigation Bar */}
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
            <Link to="/why-intern-x" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Why Intern X
            </Link>
            <Link to="/contact" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
              >
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="pointer-events-none absolute -top-28 left-1/2 h-[680px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
          <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -top-24 -right-32 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.022] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pt-36">
            <div className="mx-auto max-w-[820px] text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="mono text-[11px] font-medium tracking-[0.04em] text-slate-600 dark:text-slate-300">UNIFIED PLACEMENT PORTAL</span>
              </div>

              <h1 className="mt-8 text-[36px] font-[800] leading-[0.95] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[54px] lg:text-[62px]">
                Intern X: The Unified Campus Placement Portal.
              </h1>

              <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 tracking-[-0.01em] text-slate-600 dark:text-slate-300 sm:text-[18px] sm:leading-8">
                Bridging the gap between academia and industry with AI-powered resume screening and zero-compromise data security.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100 sm:w-auto"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100 sm:w-auto"
                  >
                    Log In / Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <a
                  href="#portals"
                  className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-white px-7 text-[14px] font-semibold tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white sm:w-auto"
                >
                  View portals
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* NEW Brief Why Intern X Section */}
        <section className="relative border-y border-gray-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 to-transparent dark:from-slate-950/20" />
          <div className="relative mx-auto max-w-[1200px] px-6 py-10 sm:py-14">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white p-6 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:p-7">
              <div className="flex max-w-[720px] items-start gap-4">
                <span className="mt-0.5 hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white sm:grid">
                  <span className="text-[11px] font-bold">IX</span>
                </span>
                <div>
                  <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Why Intern X</div>
                  <p className="mt-2 text-[15px] font-medium leading-6 tracking-[-0.01em] text-slate-900 dark:text-white sm:text-[16px]">
                    A seamless 3-way connection between Students, Industry, and Faculty built on 100% verified profiles.
                  </p>
                </div>
              </div>
              <Link
                to="/why-intern-x"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 active:scale-[0.98] dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700 sm:ml-6"
              >
                View details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="scroll-mt-[64px] border-b border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-[640px] text-center sm:text-left">
              <div className="mono text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 sm:text-left">Portals</div>
              <h2 className="mt-3 text-center text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-left sm:text-[34px]">One platform, four dedicated workspaces.</h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Student */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700 dark:group-hover:shadow-none">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                    <GraduationCap className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Student</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">Build a digital CV, get AI-assessed, and track applications.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">• Digital CV • ATS • Tracker</p>
                  <div className="mt-auto pt-6">
                    <Link to="/login?role=student" className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 text-[13px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100">
                      Log In as Student
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Industry Partner */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <Building className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Industry Partner</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">Post roles and get instant ATS-ranked candidate matches.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">• Job Creator • ATS Rank • Feed</p>
                  <div className="mt-auto pt-6">
                    <Link to="/login?role=industry" className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98] dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700">
                      Log In as Industry
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Academician */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <BookOpen className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Academician</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">Monitor cohort analytics, skill gaps, and R&amp;D consultancy.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">• Analytics • Skill Gap • Consultancy</p>
                  <div className="mt-auto pt-6">
                    <Link to="/login?role=academician" className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98] dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700">
                      Log In as Academician
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px] dark:bg-slate-900">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100 dark:from-slate-800 dark:to-slate-800" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:bg-slate-900 dark:ring-slate-800 dark:group-hover:ring-slate-700">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <ShieldCheck className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Admin</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600 dark:text-slate-300">Verify institutional documents and manage platform access.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">• Verification • Access Control • Inbox</p>
                  <div className="mt-auto pt-6">
                    <Link to="/admin-login" className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98] dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700">
                      Admin Login
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
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
