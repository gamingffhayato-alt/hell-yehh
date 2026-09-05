import { Link } from 'react-router-dom'
import { ArrowRightIcon, GradCapIcon } from '../Icons'

/** Shared styling for un-built destinations: visibly disabled, dims on hover. */
const SOON_CLASS = 'cursor-not-allowed opacity-75 hover:opacity-50'

/* ------------------------------ CTA banner ------------------------------ */

export function CtaBanner({ onRegister, onComingSoon }) {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-6 py-14 text-center sm:px-12 sm:py-16">
        {/* Decorative dots + glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to bridge what&rsquo;s next?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-indigo-100">
            Create a free account and get matched with internships, fresher jobs
            and courses in under five minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onRegister}
              className="flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 active:scale-[0.98]"
            >
              Create free account
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            {/* Concierge/demo flow isn't built yet → graceful coming-soon toast */}
            <button
              onClick={onComingSoon}
              className={`flex h-12 items-center rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10 ${SOON_CLASS}`}
            >
              Talk to our team
            </button>
          </div>
          <p className="mt-5 text-xs text-indigo-200">
            Free for candidates, always. No card required.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Footer -------------------------------- */

/**
 * Every footer link does something real:
 *   { href: '#jobs' }          → smooth-scrolls to a live section
 *   { to: '/signup?role=…' }   → routes into the sign-up wizard (role pre-selected)
 *   {}                         → page not built yet → coming-soon toast
 */
const FOOTER_COLS = [
  {
    heading: 'Candidates',
    links: [
      { label: 'Browse jobs', href: '#jobs' },
      { label: 'Internships', href: '#jobs' },
      { label: 'Courses' },
      { label: 'Skill tests' },
    ],
  },
  {
    heading: 'Employers',
    links: [
      { label: 'Post a job', to: '/signup?role=industry' },
      { label: 'Campus hiring' },
      { label: 'Pricing' },
      { label: 'Success stories', href: '#stories' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us' },
      { label: 'Careers' },
      { label: 'Blog' },
      { label: 'Contact' },
    ],
  },
]

function FooterLink({ link, onComingSoon }) {
  if (link.href) {
    return (
      <a href={link.href} className="text-sm transition hover:text-white">
        {link.label}
      </a>
    )
  }
  if (link.to) {
    return (
      <Link to={link.to} className="text-sm transition hover:text-white">
        {link.label}
      </Link>
    )
  }
  return (
    <button onClick={onComingSoon} className={`text-sm transition ${SOON_CLASS}`}>
      {link.label}
    </button>
  )
}

export function SiteFooter({ onComingSoon }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand — click returns to the top of the page */}
          <div>
            <button onClick={scrollTop} className="flex items-center gap-2.5" aria-label="Back to top">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
                <GradCapIcon className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">Intern X</span>
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              The bridge between campuses and careers — jobs, internships and
              learning, all in one place.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} onComingSoon={onComingSoon} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© 2026 Intern X. Crafted with care in India.</p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <button key={label} onClick={onComingSoon} className={`transition ${SOON_CLASS}`}>
                {label}
              </button>
            ))}
            {/* Discreet back door to the admin area (separate from user auth) */}
            <Link
              to="/admin-login"
              className="text-gray-600 opacity-50 transition hover:text-white hover:opacity-100"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
