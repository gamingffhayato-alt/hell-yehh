import {
  ArrowRightIcon,
  BanknotesIcon,
  BookIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartBarIcon,
  ChatIcon,
  ClockIcon,
  CodeIcon,
  GradCapIcon,
  MapPinIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  PencilIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  XIcon,
} from '../Icons'

/** Shared styling for un-built destinations: visibly disabled, dims on hover. */
const SOON_CLASS = 'cursor-not-allowed opacity-75 hover:opacity-50'

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-base leading-relaxed text-gray-600">{sub}</p>}
    </div>
  )
}

/* ------------------------------ Categories ------------------------------ */

const CATEGORIES = [
  { label: 'Engineering & Tech', count: '3,214 openings', Icon: CodeIcon, tile: 'bg-indigo-50 text-indigo-600' },
  { label: 'Design', count: '842 openings', Icon: PaintBrushIcon, tile: 'bg-rose-50 text-rose-600' },
  { label: 'Data & Analytics', count: '1,127 openings', Icon: ChartBarIcon, tile: 'bg-emerald-50 text-emerald-600' },
  { label: 'Marketing', count: '936 openings', Icon: MegaphoneIcon, tile: 'bg-amber-50 text-amber-600' },
  { label: 'Finance', count: '512 openings', Icon: BanknotesIcon, tile: 'bg-sky-50 text-sky-600' },
  { label: 'People & HR', count: '384 openings', Icon: UsersIcon, tile: 'bg-violet-50 text-violet-600' },
  { label: 'Content & Media', count: '457 openings', Icon: PencilIcon, tile: 'bg-fuchsia-50 text-fuchsia-600' },
  { label: 'Customer Support', count: '268 openings', Icon: ChatIcon, tile: 'bg-teal-50 text-teal-600' },
]

export function Categories({ onComingSoon }) {
  return (
    <section id="categories" className="scroll-mt-20 border-t border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Explore"
            title="Browse by category"
            sub="From first internships to full-time roles — pick a lane and dive in."
          />
          {/* Full catalog page isn't built yet → graceful toast instead of a dead page */}
          <button
            onClick={onComingSoon}
            className={`group flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition ${SOON_CLASS}`}
          >
            View all categories
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ label, count, Icon, tile }) => (
            <a
              key={label}
              href="#jobs"
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tile}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900">{label}</span>
                <span className="block text-xs text-gray-500">{count}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Featured jobs ----------------------------- */

const JOBS = [
  {
    initials: 'Te', tile: 'bg-indigo-600', title: 'Frontend Web Developer (React)',
    company: 'TechCorp', location: 'Remote', type: 'Full-time', pay: '₹8–12', period: ' LPA',
    tags: ['React', 'Tailwind', 'Vite'], hot: true, applied: '1,240', posted: '2h ago',
  },
  {
    initials: 'De', tile: 'bg-gray-900', title: 'AI/ML Researcher Intern',
    company: 'DeepMind', location: 'Remote', type: 'Internship', pay: '₹40K', period: '/month',
    tags: ['Python', 'PyTorch', 'LLMs'], hot: true, applied: '2,318', posted: '4h ago',
  },
  {
    initials: 'Ra', tile: 'bg-blue-600', title: 'Backend Developer Intern',
    company: 'Razorpay', location: 'Bengaluru · Hybrid', type: 'Internship', pay: '₹35K', period: '/month',
    tags: ['Node.js', 'PostgreSQL'], hot: false, applied: '864', posted: '6h ago',
  },
  {
    initials: 'Cr', tile: 'bg-rose-500', title: 'Product Design Intern',
    company: 'CRED', location: 'Bengaluru · Hybrid', type: 'Internship', pay: '₹30K', period: '/month',
    tags: ['Figma', 'UI/UX'], hot: true, applied: '1,975', posted: '8h ago',
  },
  {
    initials: 'Sw', tile: 'bg-orange-500', title: 'Data Analyst Intern',
    company: 'Swiggy', location: 'Gurgaon', type: 'Internship', pay: '₹25K', period: '/month',
    tags: ['SQL', 'Python'], hot: false, applied: '1,120', posted: '1d ago',
  },
  {
    initials: 'Me', tile: 'bg-fuchsia-600', title: 'Flutter Developer',
    company: 'Meesho', location: 'Remote', type: 'Full-time', pay: '₹10–15', period: ' LPA',
    tags: ['Dart', 'Firebase'], hot: true, applied: '742', posted: '1d ago',
  },
  {
    initials: 'Ze', tile: 'bg-sky-500', title: 'Growth Marketing Associate',
    company: 'Zerodha', location: 'Mumbai', type: 'Full-time', pay: '₹6–9', period: ' LPA',
    tags: ['SEO', 'Content'], hot: false, applied: '655', posted: '2d ago',
  },
  {
    initials: 'Fr', tile: 'bg-emerald-600', title: 'Cloud & DevOps Intern',
    company: 'Freshworks', location: 'Chennai', type: 'Internship', pay: '₹22K', period: '/month',
    tags: ['AWS', 'Docker'], hot: false, applied: '489', posted: '2d ago',
  },
  {
    initials: 'Pa', tile: 'bg-cyan-600', title: 'Junior Product Analyst',
    company: 'Paytm', location: 'Noida', type: 'Full-time', pay: '₹7–10', period: ' LPA',
    tags: ['SQL', 'A/B Testing'], hot: false, applied: '583', posted: '3d ago',
  },
  {
    initials: 'Zo', tile: 'bg-red-500', title: 'Content Writing Intern',
    company: 'Zomato', location: 'Remote', type: 'Internship', pay: '₹15K', period: '/month',
    tags: ['Copywriting', 'SEO'], hot: true, applied: '1,036', posted: '3d ago',
  },
]

/** Newest 8 render by default; a hero search filters across all 10. */
const DEFAULT_VISIBLE = 8

function matches(job, q) {
  const haystack = [job.title, job.company, job.location, job.type, ...job.tags]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function FeaturedJobs({ search, onClearSearch, onRegister, onComingSoon }) {
  const q = search.q.trim().toLowerCase()
  const loc = search.location.trim().toLowerCase()
  const active = Boolean(q || loc)

  const results = active
    ? JOBS.filter((job) => (!q || matches(job, q)) && (!loc || job.location.toLowerCase().includes(loc)))
    : JOBS.slice(0, DEFAULT_VISIBLE)

  return (
    <section id="jobs" className="scroll-mt-20 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Fresh today"
            title="Featured openings"
            sub="Hand-picked roles hiring right now — refreshed every morning."
          />
          {/* The full jobs catalog page isn't built yet → toast, not a dead page */}
          <button
            onClick={onComingSoon}
            className={`group flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition ${SOON_CLASS}`}
          >
            View all 10,000+ jobs
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Live search result summary (populated from the hero search bar) */}
        {active && (
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 ring-1 ring-indigo-100">
            <SearchIcon className="h-4 w-4 shrink-0" />
            <span>
              <span className="font-bold">{results.length}</span>{' '}
              {results.length === 1 ? 'opening' : 'openings'} found
              {q && <> for <span className="font-semibold">“{search.q.trim()}”</span></>}
              {loc && <> in <span className="font-semibold">“{search.location.trim()}”</span></>}
            </span>
            <button
              onClick={onClearSearch}
              className="ml-auto flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600"
            >
              <XIcon className="h-3 w-3" />
              Clear search
            </button>
          </div>
        )}

        {results.length === 0 ? (
          /* Empty state — never a dead end */
          <div className="mt-10 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-gray-800">
              No openings match that search yet
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try “React”, “Remote” or “Design” — new roles land every morning.
            </p>
            <button
              onClick={onClearSearch}
              className="mt-5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              Show featured openings
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4">
            {results.map((job) => (
              <article
                key={`${job.company}-${job.title}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-150 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${job.tile}`}>
                    {job.initials}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-gray-900 transition group-hover:text-indigo-600">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-600">{job.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-3.5 w-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" /> {job.type}
                      </span>
                    </p>
                  </div>

                  <div className="hidden flex-col items-end gap-2 sm:flex">
                    <p className="text-base font-bold text-gray-900">
                      {job.pay}
                      <span className="text-xs font-medium text-gray-500">{job.period}</span>
                    </p>
                    <button
                      onClick={onRegister}
                      className="rounded-full border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {job.hot && (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Actively hiring
                    </span>
                  )}
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px] text-gray-400">
                    {job.applied} applied · posted {job.posted}
                  </span>
                  <button
                    onClick={onRegister}
                    className="ml-auto rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white sm:hidden"
                  >
                    Apply
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ----------------------------- How it works ------------------------------ */

const STEPS = [
  {
    n: '01', Icon: UsersIcon, title: 'Build your profile',
    text: 'Add your skills, projects and coursework once. Your Intern X profile doubles as a living résumé.',
  },
  {
    n: '02', Icon: SparklesIcon, title: 'Get matched, not lost',
    text: 'Our matcher pairs you with roles where your skills actually fit — with a match score on every card.',
  },
  {
    n: '03', Icon: BriefcaseIcon, title: 'Interview & get hired',
    text: 'Track every application in one place, chat with recruiters and accept offers without the chaos.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to your next role"
          sub="No 40-tab job hunts. No ghost listings. Just a straight line from profile to offer."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ n, Icon, title, text }) => (
            <div key={n} className="relative rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-lg hover:shadow-indigo-100">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="select-none text-4xl font-black text-gray-100">{n}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------- Bento: four communities ----------------------- */

const ROLES = [
  {
    Icon: GradCapIcon, tint: 'bg-indigo-50', tile: 'bg-indigo-600',
    title: 'Students', text: 'Internships, fresher jobs and courses matched to your coursework and skills.',
    cta: 'Join as a student', soon: false,
  },
  {
    Icon: BriefcaseIcon, tint: 'bg-amber-50', tile: 'bg-amber-500',
    title: 'Industry', text: 'Post openings, run campus drives and hire pre-screened fresh talent faster.',
    cta: 'Hire fresh talent', soon: false,
  },
  {
    Icon: BookIcon, tint: 'bg-emerald-50', tile: 'bg-emerald-500',
    title: 'Academicians', text: 'Mentor candidates, publish courses and shape industry-ready curricula.',
    cta: 'Start mentoring', soon: true,
  },
  {
    Icon: BuildingIcon, tint: 'bg-sky-50', tile: 'bg-sky-500',
    title: 'Institutions', text: 'Run placement season from one dashboard with live hiring analytics.',
    cta: 'Partner with us', soon: true,
  },
]

export function RoleBento({ onRegister, onComingSoon }) {
  return (
    <section id="why" className="scroll-mt-20 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Intern X"
          title="Built for every side of campus"
          sub="One platform where the whole ecosystem — classrooms and boardrooms alike — finally meets."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map(({ Icon, tint, tile, title, text, cta, soon }) => (
            <div key={title} className={`group flex flex-col rounded-2xl ${tint} p-6 transition duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100`}>
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${tile}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {soon && (
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 ring-1 ring-gray-200">
                    Soon
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">{text}</p>

              {soon ? (
                /* Academician & Institution portals aren't built yet —
                   degrade gracefully: disabled look + coming-soon toast. */
                <button
                  onClick={onComingSoon}
                  className={`mt-4 flex items-center gap-1.5 self-start text-sm font-semibold text-indigo-600 transition ${SOON_CLASS}`}
                >
                  {cta}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={onRegister}
                  className="mt-4 flex items-center gap-1.5 self-start text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  {cta}
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Testimonials ----------------------------- */

const QUOTES = [
  {
    quote: 'I applied to 12 internships through Intern X and got 4 interview calls in my first week. The skill-match score was scary accurate.',
    name: 'Ananya Sharma', role: 'Design student · NIFT Delhi', initials: 'AS', tile: 'bg-rose-400',
  },
  {
    quote: 'We closed six campus hires in a single placement season. The ATS-ranked shortlists saved our team weeks of screening.',
    name: 'Rohan Mehta', role: 'Talent Lead · TechCorp', initials: 'RM', tile: 'bg-indigo-400',
  },
]

export function Testimonials() {
  return (
    <section id="stories" className="scroll-mt-20 border-t border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Loved on both sides" title="Don't take our word for it" />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {QUOTES.map((q) => (
            <figure key={q.name} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-gray-700">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white ${q.tile}`}>
                  {q.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{q.name}</span>
                  <span className="block text-xs text-gray-500">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
