import { Link } from 'react-router-dom'
import { useAuth, homeForRole } from '../../lib/AuthContext'

/* Icons — Lucide / Heroicons style, inline SVG */
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
  const { session, profile } = useAuth()
  const isLoggedIn = !!session
  const dashboardPath = homeForRole(profile?.role)

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900">
              <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Intern X</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#portals" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900">
              Portals
            </a>
            <Link to="/contact" className="text-[13.5px] font-medium tracking-[-0.01em] text-slate-500 transition hover:text-slate-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                to={dashboardPath}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98]"
              >
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98]"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          {/* Soft, localized glows */}
          <div className="pointer-events-none absolute -top-28 left-1/2 h-[680px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px]" />
          <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -top-24 -right-32 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[80px]" />
          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pt-36">
            <div className="mx-auto max-w-[820px] text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="mono text-[11px] font-medium tracking-[0.04em] text-slate-600">UNIFIED PLACEMENT PORTAL</span>
              </div>

              <h1 className="mt-8 text-[36px] font-[800] leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-[54px] lg:text-[62px]">
                Intern X: The Unified Campus Placement Portal.
              </h1>

              <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 tracking-[-0.01em] text-slate-600 sm:text-[18px] sm:leading-8">
                Bridging the gap between academia and industry with AI-powered resume screening and zero-compromise data security.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {isLoggedIn ? (
                  <Link
                    to={dashboardPath}
                    className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-900 transition hover:bg-black hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] active:scale-[0.98] sm:w-auto"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-900 transition hover:bg-black hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] active:scale-[0.98] sm:w-auto"
                  >
                    Log In / Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <a
                  href="#portals"
                  className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-white px-7 text-[14px] font-semibold tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] sm:w-auto"
                >
                  View portals
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Portals Section — Clean 4-Card Bento Grid */}
        <section id="portals" className="scroll-mt-[64px] border-t border-gray-100 bg-slate-50/70">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-[640px] text-center sm:text-left">
              <div className="mono text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-left">Portals</div>
              <h2 className="mt-3 text-center text-[28px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-left sm:text-[34px]">One platform, four dedicated workspaces.</h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Student Card */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900">
                    <GraduationCap className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Student</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600">Build a digital CV, get AI-assessed, and track applications.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500">• Digital CV • ATS • Tracker</p>
                  <div className="mt-auto pt-6">
                    <Link
                      to="/login?role=student"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 text-[13px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98]"
                    >
                      Log In as Student
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Industry Partner Card */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200">
                    <Building className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Industry Partner</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600">Post roles and get instant ATS-ranked candidate matches.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500">• Job Creator • ATS Rank • Feed</p>
                  <div className="mt-auto pt-6">
                    <Link
                      to="/login?role=industry"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98]"
                    >
                      Log In as Industry
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Academician Card */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200">
                    <BookOpen className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Academician</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600">Monitor cohort analytics, skill gaps, and R&amp;D consultancy.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500">• Analytics • Skill Gap • Consultancy</p>
                  <div className="mt-auto pt-6">
                    <Link
                      to="/login?role=academician"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98]"
                    >
                      Log In as Academician
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin Card */}
              <div className="group relative flex flex-col rounded-2xl bg-white p-[1px] transition duration-200 hover:-translate-y-[2px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-white p-6 ring-1 ring-gray-200 transition group-hover:ring-gray-300 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-900 ring-1 ring-gray-200">
                    <ShieldCheck className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Admin</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-slate-600">Verify institutional documents and manage platform access.</p>
                  <p className="mono mt-4 text-[11px] tracking-[-0.01em] text-slate-500">• Verification • Access Control • Inbox</p>
                  <div className="mt-auto pt-6">
                    <Link
                      to="/admin-login"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold tracking-[-0.01em] text-slate-900 ring-1 ring-gray-200 transition hover:bg-slate-50 hover:ring-gray-300 active:scale-[0.98]"
                    >
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
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-slate-900 text-white ring-1 ring-slate-900">
                <span className="text-[10px] font-bold tracking-[-0.02em]">IX</span>
              </span>
              <div>
                <div className="text-[13px] font-semibold tracking-[-0.02em]">Intern X</div>
                <div className="mono text-[11px] tracking-[0.02em] text-slate-400">Built for Smart India Hackathon</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/contact" className="text-[13px] font-medium tracking-[-0.01em] text-slate-600 transition hover:text-slate-900">
                Contact
              </Link>
              <span className="h-3 w-px bg-gray-200" />
              <span className="mono text-[11px] tracking-[0.02em] text-slate-400">© {new Date().getFullYear()} Intern X</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
