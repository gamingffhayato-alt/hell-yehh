import {
  ArrowRightIcon,
  BanknotesIcon,
  BookIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartBarIcon,
  ClockIcon,
  CodeIcon,
  GradCapIcon,
  MapPinIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from '../Icons'

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
  { label: 'Engineering & Tech', count: '3,240 openings', Icon: CodeIcon, tile: 'bg-indigo-50 text-indigo-600' },
  { label: 'Design', count: '860 openings', Icon: PaintBrushIcon, tile: 'bg-rose-50 text-rose-600' },
  { label: 'Data & Analytics', count: '1,120 openings', Icon: ChartBarIcon, tile: 'bg-emerald-50 text-emerald-600' },
  { label: 'Marketing', count: '940 openings', Icon: MegaphoneIcon, tile: 'bg-amber-50 text-amber-600' },
  { label: 'Finance', count: '510 openings', Icon: BanknotesIcon, tile: 'bg-sky-50 text-sky-600' },
  { label: 'People & HR', count: '380 openings', Icon: UsersIcon, tile: 'bg-violet-50 text-violet-600' },
]

export function Categories() {
  return (
    <section id="categories" className="scroll-mt-20 border-t border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Explore"
            title="Browse by category"
            sub="From first internships to full-time roles — pick a lane and dive in."
          />
          <a href="#" className="group flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
            View all categories
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ label, count, Icon, tile }) => (
            <a
              key={label}
              href="#"
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
    initials: 'Cr', tile: 'bg-rose-500', title: 'Product Design Intern', company: 'CRED',
    location: 'Bengaluru · Hybrid', type: 'Internship', pay: '₹30K', period: '/month',
    tags: ['Figma', 'UI/UX'], hot: true,
  },
  {
    initials: 'Ra', tile: 'bg-indigo-500', title: 'Frontend Developer', company: 'Razorpay',
    location: 'Remote', type: 'Full-time', pay: '₹9–14', period: ' LPA',
    tags: ['React', 'TypeScript'], hot: false,
  },
  {
    initials: 'Sw', tile: 'bg-orange-500', title: 'Data Analyst Intern', company: 'Swiggy',
    location: 'Gurgaon', type: 'Internship', pay: '₹25K', period: '/month',
    tags: ['SQL', 'Python'], hot: true,
  },
  {
    initials: 'Ze', tile: 'bg-sky-500', title: 'Growth Marketing Associate', company: 'Zerodha',
    location: 'Mumbai', type: 'Full-time', pay: '₹6–9', period: ' LPA',
    tags: ['SEO', 'Content'], hot: false,
  },
]

export function FeaturedJobs() {
  return (
    <section id="jobs" className="scroll-mt-20 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Fresh today"
            title="Featured openings"
            sub="Hand-picked roles hiring right now — refreshed every morning."
          />
          <a href="#" className="group flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
            View all 10,000+ jobs
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-10 grid gap-4">
          {JOBS.map((job) => (
            <article
              key={job.title}
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
                  <button className="rounded-full border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white">
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
                <button className="ml-auto rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white sm:hidden">
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
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
    cta: 'Join as a student',
  },
  {
    Icon: BriefcaseIcon, tint: 'bg-amber-50', tile: 'bg-amber-500',
    title: 'Industry', text: 'Post openings, run campus drives and hire pre-screened fresh talent faster.',
    cta: 'Hire fresh talent',
  },
  {
    Icon: BookIcon, tint: 'bg-emerald-50', tile: 'bg-emerald-500',
    title: 'Academicians', text: 'Mentor candidates, publish courses and shape industry-ready curricula.',
    cta: 'Start mentoring',
  },
  {
    Icon: BuildingIcon, tint: 'bg-sky-50', tile: 'bg-sky-500',
    title: 'Institutions', text: 'Run placement season from one dashboard with live hiring analytics.',
    cta: 'Partner with us',
  },
]

export function RoleBento() {
  return (
    <section id="why" className="scroll-mt-20 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Intern X"
          title="Built for every side of campus"
          sub="One platform where the whole ecosystem — classrooms and boardrooms alike — finally meets."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map(({ Icon, tint, tile, title, text, cta }) => (
            <div key={title} className={`group flex flex-col rounded-2xl ${tint} p-6 transition duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100`}>
              <span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${tile}`}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">{text}</p>
              <a href="#" className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                {cta}
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
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
    quote: 'We closed six campus hires in a single placement season. The institution dashboard saved our cell weeks of coordination.',
    name: 'Prof. R. Menon', role: 'Placement cell · Manipal University', initials: 'RM', tile: 'bg-indigo-400',
  },
]

export function Testimonials() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
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
