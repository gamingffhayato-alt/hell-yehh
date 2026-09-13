import { Link } from 'react-router-dom'

/* ——— Icon set — Lucide/Heroicons style, inline SVG, no external deps ——— */
function ArrowRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  )
}
function GraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3L2 8.5 12 14l10-5.5L12 3Z" />
      <path d="M6 10.5v3.5c0 .9 1.8 2.5 6 2.5s6-1.6 6-2.5v-3.5" />
      <path d="M22 8.5v5" />
    </svg>
  )
}
function Building(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01M12 9h.01M12 12h.01M12 15h.01M12 18h.01M15 9h.01M15 12h.01M15 15h.01M15 18h.01" />
    </svg>
  )
}
function BookOpen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 5c2.5-1.5 5.5-1.5 8 0v14c-2.5-1.5-5.5-1.5-8 0V5Z" />
      <path d="M22 5c-2.5-1.5-5.5-1.5-8 0v14c2.5-1.5 5.5-1.5 8 0V5Z" />
    </svg>
  )
}
function ShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
function Scan(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 3H4a1 1 0 00-1 1v3" />
      <path d="M17 3h3a1 1 0 011 1v3" />
      <path d="M7 21H4a1 1 0 01-1-1v-3" />
      <path d="M17 21h3a1 1 0 001-1v-3" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M8 12h8" />
    </svg>
  )
}
function Lock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M7 10V7a5 5 0 0110 0v3" />
    </svg>
  )
}
function Server(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M6 7h.01M6 17h.01" />
    </svg>
  )
}
function Check(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10l3.5 3.5L16 5.5" />
    </svg>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        * { font-family: "Inter", "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-zinc-900 text-white ring-1 ring-zinc-900">
              <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Intern X</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#portals" className="text-[13.5px] font-medium tracking-[-0.01em] text-zinc-500 transition hover:text-zinc-900">
              Portals
            </a>
            <a href="#technology" className="text-[13.5px] font-medium tracking-[-0.01em] text-zinc-500 transition hover:text-zinc-900">
              Technology
            </a>
            <Link to="/contact" className="text-[13.5px] font-medium tracking-[-0.01em] text-zinc-500 transition hover:text-zinc-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-white ring-1 ring-zinc-900 transition hover:bg-black active:scale-[0.98]"
            >
              Log In / Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-zinc-100 bg-white">
          {/* Localized glows - Vercel/Stripe style */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-200/40 via-indigo-100/30 to-transparent blur-[80px]" />
          <div className="pointer-events-none absolute -top-24 -left-40 h-[520px] w-[520px] rounded-full bg-indigo-200/40 blur-[90px]" />
          <div className="pointer-events-none absolute -top-20 -right-40 h-[520px] w-[520px] rounded-full bg-violet-200/30 blur-[90px]" />

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-20 sm:pb-24 sm:pt-28 lg:pt-32">
            <div className="mx-auto max-w-[840px] text-center">
              {/* Eyebrow pill */}
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="mono text-[11px] font-medium tracking-[0.04em] text-zinc-600">SUPABASE • GROQ • VERCEL</span>
              </div>

              <h1 className="mt-8 text-[36px] font-[800] leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-[54px] lg:text-[64px]">
                Intern X: The Unified Campus Placement Portal.
              </h1>

              <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 tracking-[-0.01em] text-zinc-600 sm:text-[18px] sm:leading-8">
                Bridging the gap between academia and industry with AI-powered resume screening and zero-compromise data security.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-zinc-900 transition hover:bg-black hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] active:scale-[0.98] sm:w-auto"
                >
                  Log In / Sign Up
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#portals"
                  className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-white px-7 text-[14px] font-semibold tracking-[-0.01em] text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98] sm:w-auto"
                >
                  View portals
                </a>
              </div>

              {/* Minimal browser mock - institutional, not illustration */}
              <div className="relative mx-auto mt-16 max-w-[920px] sm:mt-20">
                <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_20px_60px_-16px_rgba(0,0,0,0.12)] ring-1 ring-zinc-200">
                  {/* Window chrome */}
                  <div className="flex h-10 items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-zinc-200" />
                      <span className="h-3 w-3 rounded-full bg-zinc-200" />
                      <span className="h-3 w-3 rounded-full bg-zinc-200" />
                    </div>
                    <div className="mono hidden items-center gap-2 text-[11px] text-zinc-400 sm:flex">
                      <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-zinc-200">intern-x.vercel.app/dashboard</span>
                    </div>
                    <div className="h-3 w-12" />
                  </div>

                  {/* Content - realistic pipeline */}
                  <div className="grid gap-0 sm:grid-cols-[280px_1fr]">
                    <div className="border-b border-zinc-100 bg-zinc-50/50 p-4 sm:border-b-0 sm:border-r">
                      <div className="mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">Pipeline</div>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: 'Resume.pdf parsed', status: 'done' },
                          { label: 'Skills extracted', status: 'done' },
                          { label: 'Groq ATS evaluation', status: 'active' },
                          { label: 'Rank & match', status: 'idle' },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-2.5">
                            <span
                              className={`grid h-5 w-5 place-items-center rounded-full ring-1 ${
                                s.status === 'done'
                                  ? 'bg-emerald-500 text-white ring-emerald-500'
                                  : s.status === 'active'
                                  ? 'bg-zinc-900 text-white ring-zinc-900'
                                  : 'bg-white text-zinc-300 ring-zinc-200'
                              }`}
                            >
                              {s.status === 'done' ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                            </span>
                            <span className={`text-[13px] ${s.status === 'idle' ? 'text-zinc-400' : 'font-medium tracking-[-0.01em] text-zinc-700'}`}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="mono rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-medium tracking-[0.04em] text-white">ATS SCORE</span>
                            <span className="mono text-[11px] text-zinc-500">pdfjs-dist • local extraction</span>
                          </div>
                          <div className="mt-3 flex items-baseline gap-3">
                            <span className="text-[32px] font-bold tracking-[-0.03em]">92</span>
                            <span className="text-[13px] font-medium text-zinc-500">/ 100 match for Backend Intern</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-[-0.01em] text-emerald-700 ring-1 ring-emerald-200">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Groq API • 1.2s
                        </span>
                      </div>
                      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                        <div className="h-full w-[92%] rounded-full bg-zinc-900" />
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {[
                          { k: 'Skills', v: 'Node.js, PostgreSQL, React' },
                          { k: 'RBAC', v: 'Student → Recruiter isolated' },
                          { k: 'Infra', v: 'Vercel Serverless Edge' },
                        ].map((i) => (
                          <div key={i.k} className="rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                            <div className="mono text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">{i.k}</div>
                            <div className="mt-1 text-[12px] font-medium leading-snug tracking-[-0.01em] text-zinc-700">{i.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow behind mock */}
                <div className="pointer-events-none absolute -inset-x-10 -bottom-10 -z-10 h-40 bg-gradient-to-t from-indigo-100/60 to-transparent blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* PORTALS */}
        <section id="portals" className="scroll-mt-16 bg-[#fcfcfc] sm:bg-zinc-50/70">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-[560px]">
                <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Platform Architecture</div>
                <h2 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">Four portals. Zero data crossover.</h2>
                <p className="mt-3 text-[14.5px] leading-6 tracking-[-0.01em] text-zinc-600">
                  Each role gets a dedicated workspace with strict isolation. No student data leaks to recruiters without permission.
                </p>
              </div>
              <div className="mono hidden text-[11px] leading-5 text-zinc-400 sm:block">
                RBAC • RLS • Supabase Auth<br />/login?role=student | industry | academician
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Student */}
              <div className="group relative flex flex-col rounded-[20px] bg-white p-[1px]">
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-zinc-200 to-zinc-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[19px] bg-white p-6 ring-1 ring-zinc-200 transition group-hover:ring-zinc-300">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-white ring-1 ring-zinc-900">
                      <GraduationCap className="h-[18px] w-[18px]" />
                    </span>
                    <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-500 ring-1 ring-zinc-200">/dashboard</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Student</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-zinc-600">Build a digital CV, get AI-assessed, and track applications.</p>
                  <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-zinc-900">
                    <span className="h-1 w-1 rounded-full bg-zinc-900" /> Digital CV • ATS • Tracker
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div className="group relative flex flex-col rounded-[20px] bg-white p-[1px]">
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-zinc-200 to-zinc-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[19px] bg-white p-6 ring-1 ring-zinc-200 transition group-hover:ring-zinc-300">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-zinc-900 ring-1 ring-zinc-200">
                      <Building className="h-[18px] w-[18px]" />
                    </span>
                    <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-500 ring-1 ring-zinc-200">/industry-dashboard</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Industry Partner</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-zinc-600">Post roles and get instant ATS-ranked candidate matches.</p>
                  <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-zinc-900">
                    <span className="h-1 w-1 rounded-full bg-zinc-900" /> Job Creator • ATS Rank • Feed
                  </div>
                </div>
              </div>

              {/* Academician */}
              <div className="group relative flex flex-col rounded-[20px] bg-white p-[1px]">
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-zinc-200 to-zinc-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[19px] bg-white p-6 ring-1 ring-zinc-200 transition group-hover:ring-zinc-300">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-zinc-900 ring-1 ring-zinc-200">
                      <BookOpen className="h-[18px] w-[18px]" />
                    </span>
                    <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-500 ring-1 ring-zinc-200">/academic-dashboard</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Academician</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-zinc-600">Monitor cohort analytics, skill gaps, and R&amp;D consultancy.</p>
                  <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-zinc-900">
                    <span className="h-1 w-1 rounded-full bg-zinc-900" /> Analytics • Skill Gap • Consultancy
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="group relative flex flex-col rounded-[20px] bg-white p-[1px]">
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-zinc-200 to-zinc-100 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[19px] bg-white p-6 ring-1 ring-zinc-200 transition group-hover:ring-zinc-300">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-zinc-900 ring-1 ring-zinc-200">
                      <ShieldCheck className="h-[18px] w-[18px]" />
                    </span>
                    <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-500 ring-1 ring-zinc-200">/admin-dashboard</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">Admin</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] tracking-[-0.01em] text-zinc-600">Verify institutional documents and manage platform access.</p>
                  <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-medium tracking-[-0.01em] text-zinc-900">
                    <span className="h-1 w-1 rounded-full bg-zinc-900" /> Verification • Access Control
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY - BENTO GRID */}
        <section id="technology" className="scroll-mt-16 border-t border-zinc-100 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
            <div className="max-w-[640px]">
              <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Core Technology</div>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">The infrastructure placement actually needs.</h2>
            </div>

            <div className="mt-10 grid grid-cols-12 gap-4">
              {/* BENTO 1 - AI ATS Scanner - Large */}
              <div className="group relative col-span-12 overflow-hidden rounded-[24px] bg-white p-[1px] lg:col-span-8">
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-100" />
                <div className="relative h-full overflow-hidden rounded-[23px] bg-white ring-1 ring-zinc-200">
                  {/* localized glow */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-200/40 blur-[60px]" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-[360px] w-[360px] rounded-full bg-violet-200/30 blur-[60px]" />

                  <div className="relative grid h-full gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="p-7 sm:p-8">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white ring-1 ring-zinc-900">
                          <Scan className="h-4 w-4" />
                        </span>
                        <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-600 ring-1 ring-zinc-200">GROQ API • PDFJS-DIST</span>
                      </div>
                      <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.02em]">AI ATS Scanner</h3>
                      <p className="mt-3 text-[14px] leading-6 tracking-[-0.01em] text-zinc-600">
                        Powered by Groq API. Extracts PDF text locally and evaluates skills against target roles, saving recruiters 80% in screening time.
                      </p>

                      <div className="mt-6 space-y-2.5">
                        {[
                          'Client-side PDF parsing, no server upload',
                          'Role-specific skill extraction',
                          'Instant ranked matches for recruiters',
                        ].map((t) => (
                          <div key={t} className="flex items-start gap-2 text-[13px] leading-5 tracking-[-0.01em] text-zinc-600">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual */}
                    <div className="relative border-t border-zinc-100 bg-zinc-50/70 p-4 sm:p-5 lg:border-l lg:border-t-0">
                      <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.08em] text-zinc-400">
                        <span>Live extraction</span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> 1.2s
                        </span>
                      </div>
                      <div className="space-y-3 rounded-[14px] bg-white p-4 ring-1 ring-zinc-200">
                        <div className="flex items-center justify-between">
                          <span className="mono text-[11px] font-medium text-zinc-500">Resume.pdf</span>
                          <span className="mono rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white">LOCAL</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full rounded-full bg-zinc-100">
                            <div className="h-2 w-[88%] rounded-full bg-zinc-900" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {['React', 'Node.js', 'PostgreSQL'].map((s) => (
                              <span key={s} className="mono rounded-full bg-zinc-50 px-2 py-1 text-center text-[10px] font-medium tracking-[-0.01em] text-zinc-700 ring-1 ring-zinc-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                          <span className="text-[12px] font-medium tracking-[-0.01em] text-zinc-700">Match score</span>
                          <span className="text-[13px] font-bold tracking-[-0.02em]">92/100</span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-[12px] bg-zinc-900 px-3 py-2.5">
                        <div className="mono text-[10px] text-zinc-400">$ groq ats-analyze --role backend</div>
                        <div className="mono mt-1 text-[11px] text-zinc-200">✓ 80% screening time saved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO 2 - Security */}
              <div className="group relative col-span-12 overflow-hidden rounded-[24px] bg-white p-[1px] lg:col-span-4">
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-100" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[23px] bg-white ring-1 ring-zinc-200">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full bg-zinc-200/50 blur-[50px]" />

                  <div className="relative p-7 sm:p-8">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-900 ring-1 ring-zinc-200">
                      <Lock className="h-4 w-4" />
                    </span>
                    <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.02em]">Enterprise-Grade Security</h3>
                    <p className="mt-3 text-[13.5px] leading-6 tracking-[-0.01em] text-zinc-600">
                      Built on Supabase PostgreSQL. Strict Role-Based Access Control (RBAC) and Row Level Security (RLS) ensure absolute data privacy between students and recruiters.
                    </p>

                    <div className="mt-6 rounded-[14px] bg-zinc-50 p-3 ring-1 ring-zinc-200">
                      <div className="mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">Access model</div>
                      <div className="mt-3 space-y-2">
                        {[
                          { role: 'student', can: 'own profile + applications' },
                          { role: 'industry', can: 'own jobs + matched CVs' },
                          { role: 'admin', can: 'verification only' },
                        ].map((r) => (
                          <div key={r.role} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 ring-1 ring-zinc-100">
                            <span className="mono text-[11px] font-medium tracking-[0.02em] text-zinc-700">{r.role}</span>
                            <span className="text-[11px] tracking-[-0.01em] text-zinc-500">{r.can}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {['Supabase PostgreSQL', 'RBAC', 'RLS', 'Row Level Security'].map((t) => (
                        <span key={t} className="mono rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-[-0.01em] text-zinc-600 ring-1 ring-zinc-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO 3 - Zero-Downtime */}
              <div className="group relative col-span-12 overflow-hidden rounded-[24px] bg-white p-[1px]">
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-100" />
                <div className="relative overflow-hidden rounded-[23px] bg-white ring-1 ring-zinc-200">
                  <div className="pointer-events-none absolute -right-20 top-0 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-[70px]" />
                  <div className="pointer-events-none absolute -left-20 -bottom-20 h-[400px] w-[400px] rounded-full bg-violet-100/40 blur-[70px]" />

                  <div className="relative grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="p-7 sm:p-8 lg:p-9">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-900 ring-1 ring-zinc-200">
                          <Server className="h-4 w-4" />
                        </span>
                        <span className="mono rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-zinc-600 ring-1 ring-zinc-200">VERCEL SERVERLESS • EDGE</span>
                      </div>
                      <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.02em]">Zero-Downtime Architecture</h3>
                      <p className="mt-3 max-w-[560px] text-[14px] leading-6 tracking-[-0.01em] text-zinc-600">
                        Deployed on Vercel Serverless. Scalable infrastructure designed to handle massive traffic spikes during peak campus placement drives.
                      </p>

                      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                          { k: 'API', v: '/api/ats-analyze, /api/chat', d: 'Serverless functions' },
                          { k: 'Frontend', v: 'Vite + React', d: 'Edge cached' },
                          { k: 'Scale', v: 'Auto-scaling', d: 'Peak placement ready' },
                        ].map((b) => (
                          <div key={b.k} className="rounded-[14px] bg-zinc-50 p-4 ring-1 ring-zinc-100">
                            <div className="mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">{b.k}</div>
                            <div className="mt-2 text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">{b.v}</div>
                            <div className="mt-1 text-[12px] leading-4 tracking-[-0.01em] text-zinc-500">{b.d}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative border-t border-zinc-100 bg-zinc-50/70 p-4 sm:p-5 lg:border-l lg:border-t-0">
                      <div className="mono mb-3 text-[10px] uppercase tracking-[0.08em] text-zinc-400">Deployment</div>
                      <div className="rounded-[14px] bg-zinc-900 p-4 ring-1 ring-zinc-800">
                        <div className="space-y-2.5 font-mono text-[11px] leading-5">
                          <div className="flex gap-2">
                            <span className="text-zinc-500">$</span>
                            <span className="text-zinc-200">vercel --prod</span>
                          </div>
                          <div className="text-zinc-400">✓ Build completed in 24s</div>
                          <div className="text-zinc-400">✓ Functions deployed: api/ats-analyze, api/chat</div>
                          <div className="flex items-center gap-2 text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ready • intern-x.vercel.app
                          </div>
                          <div className="mt-3 h-px bg-zinc-800" />
                          <div className="flex justify-between text-[10px] text-zinc-500">
                            <span>Traffic spike</span>
                            <span className="text-zinc-300">Auto-scaled • 0 downtime</span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full w-[78%] rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className="mono rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-[-0.01em] text-zinc-600 ring-1 ring-zinc-200">vercel.json</span>
                        <span className="mono rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-[-0.01em] text-zinc-600 ring-1 ring-zinc-200">Serverless</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - Minimalist */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[360px]">
              <Link to="/" className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-zinc-900 text-white ring-1 ring-zinc-900">
                  <span className="text-[10px] font-bold tracking-[-0.02em]">IX</span>
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.02em]">Intern X</span>
              </Link>
              <p className="mt-3 text-[13px] leading-5 tracking-[-0.01em] text-zinc-500">
                The Unified Campus Placement Portal. Bridging academia and industry with AI-powered screening and zero-compromise security.
              </p>
              <div className="mt-4 mono text-[11px] tracking-[0.02em] text-zinc-400">Built for Smart India Hackathon</div>
            </div>

            <div className="flex gap-10 sm:gap-16">
              <div>
                <div className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">Platform</div>
                <div className="mt-3 space-y-2">
                  <a href="#portals" className="block text-[13px] tracking-[-0.01em] text-zinc-600 transition hover:text-zinc-900">
                    Portals
                  </a>
                  <a href="#technology" className="block text-[13px] tracking-[-0.01em] text-zinc-600 transition hover:text-zinc-900">
                    Technology
                  </a>
                  <Link to="/login" className="block text-[13px] tracking-[-0.01em] text-zinc-600 transition hover:text-zinc-900">
                    Log In / Sign Up
                  </Link>
                </div>
              </div>
              <div>
                <div className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">Support</div>
                <div className="mt-3 space-y-2">
                  <Link to="/contact" className="block text-[13px] tracking-[-0.01em] text-zinc-600 transition hover:text-zinc-900">
                    Support / Contact
                  </Link>
                  <Link to="/contact" className="block text-[13px] tracking-[-0.01em] text-zinc-600 transition hover:text-zinc-900">
                    Help Center
                  </Link>
                  <div className="mono pt-1 text-[11px] text-zinc-400">supabase • groq • vercel</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center">
            <div className="mono text-[11px] tracking-[0.02em] text-zinc-400">© {new Date().getFullYear()} Intern X. Campus placement infrastructure.</div>
            <div className="mono flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              <span>Enterprise-Grade Security • RBAC • RLS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
