import {
  BellIcon,
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
} from '../Icons'

const COMPANIES = [
  'Zomato', 'Swiggy', 'Razorpay', 'Zerodha', 'CRED',
  'Freshworks', 'Meesho', 'Flipkart', 'Paytm', 'Ola',
]

const STATS = [
  { value: '10K+', label: 'Fresh openings daily' },
  { value: '52K+', label: 'Active candidates' },
  { value: '2,400+', label: 'Hiring partners' },
  { value: '92%', label: 'Hear back within 7 days' },
]

const POPULAR = ['React', 'UI/UX Design', 'Data Science', 'Marketing']

/* Yellow marker underline for the headline keyword */
function Squiggle() {
  return (
    <svg
      className="absolute -bottom-1.5 left-0 h-2.5 w-full"
      viewBox="0 0 320 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M3 9C60 3.5 120 3 165 5.5 215 8.3 270 8 317 4.5"
        stroke="#FFC53D"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AvatarStack() {
  const people = [
    { initials: 'AS', bg: 'bg-rose-400' },
    { initials: 'RK', bg: 'bg-amber-400' },
    { initials: 'PM', bg: 'bg-emerald-400' },
    { initials: 'SJ', bg: 'bg-sky-400' },
    { initials: 'KT', bg: 'bg-violet-400' },
  ]
  return (
    <div className="flex -space-x-2">
      {people.map((p) => (
        <span
          key={p.initials}
          className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${p.bg}`}
        >
          {p.initials}
        </span>
      ))}
    </div>
  )
}

/** Decorative composition of floating, CSS-built "live" job cards. */
function JobStackVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md pb-8 lg:max-w-none">
      {/* Soft glows behind */}
      <div className="absolute -right-6 -top-8 h-44 w-44 rounded-full bg-sun/40 blur-3xl" />
      <div className="absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-indigo-200/70 blur-3xl" />

      {/* Ghost card behind */}
      <div className="absolute inset-x-8 top-5 h-full rotate-6 rounded-2xl border border-indigo-100 bg-indigo-50/60" />

      {/* Main job card */}
      <div className="relative -rotate-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-indigo-100">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-extrabold text-white">
            Cs
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">Product Design Intern</p>
            <p className="truncate text-xs text-gray-500">Craftly Studio · Remote</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {['Internship', '₹28K/month', 'Figma'].map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="w-40">
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
              <span>Skill match</span>
              <span className="font-bold text-emerald-600">96%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[96%] rounded-full bg-emerald-500" />
            </div>
          </div>
          <button className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700">
            Apply now
          </button>
        </div>
      </div>

      {/* Second card, tucked under */}
      <div className="relative ml-6 mt-4 hidden rotate-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg shadow-indigo-100/60 sm:block">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-xs font-extrabold text-white">
            Ap
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">Frontend Developer</p>
            <p className="truncate text-xs text-gray-500">AstroPay · Bengaluru · ₹10–14 LPA</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
            New
          </span>
        </div>
      </div>

      {/* Floating: match badge */}
      <div className="absolute -right-2 -top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:-right-4">
        <CheckIcon className="h-3.5 w-3.5" />
        96% skill match
      </div>

      {/* Floating: notification pill */}
      <div className="absolute -bottom-3 -left-2 flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 shadow-xl ring-1 ring-gray-100 sm:-left-6">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-amber-600">
          <BellIcon className="h-4 w-4" />
        </span>
        <span className="text-xs font-medium text-gray-700">
          12 new internships near you
        </span>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Faint dot texture on the top half */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(79,70,229,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:gap-10 lg:pb-24 lg:pt-20">
        {/* ------------------------------ Copy ------------------------------ */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
            <SparklesIcon className="h-3.5 w-3.5" />
            2,400 internship drives opened this week
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem]">
            Find the{' '}
            <span className="relative whitespace-nowrap">
              opportunity
              <Squiggle />
            </span>{' '}
            that finds you back.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
            Intern X brings jobs, internships and courses for students and
            freshers into one place — matched to your skills, not spammed to
            your inbox.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-indigo-100/60 sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Role, skill or company"
                className="w-full bg-transparent py-3 pl-10 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="hidden h-6 w-px bg-gray-200 sm:block" />
            <div className="relative sm:w-36">
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Location"
                className="w-full bg-transparent py-3 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            Popular:
            {POPULAR.map((term) => (
              <button
                key={term}
                className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                {term}
              </button>
            ))}
          </p>

          {/* Social proof */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AvatarStack />
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-amber-400" />
                ))}
                <span className="ml-1 text-sm font-bold text-gray-900">4.8</span>
              </div>
              <p className="text-xs text-gray-500">from 52,000+ candidates</p>
            </div>
          </div>
        </div>

        {/* ---------------------------- Visual ----------------------------- */}
        <JobStackVisual />
      </div>

      {/* ------------------------- Company marquee ------------------------- */}
      <div className="border-y border-gray-100 bg-white py-5">
        <div className="group relative overflow-hidden">
          <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-14 pr-14" aria-hidden={half === 1}>
                {COMPANIES.map((company) => (
                  <span
                    key={company}
                    className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-gray-500"
                  >
                    {company}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* ------------------------------ Stats ------------------------------ */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-y-10 py-12 sm:grid-cols-4 lg:py-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
