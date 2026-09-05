import { Link } from 'react-router-dom'
import { ArrowRightIcon, GradCapIcon } from '../Icons'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function WelcomeHero({ name }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
      {/* Decorative dots + glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Identity */}
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur">
            {(name[0] || 'S').toUpperCase()}
          </span>
          <div>
            <p className="text-sm text-indigo-100">{greeting()},</p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{name} 👋</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {['1st Year', 'B.Tech', 'Computer Science and Engineering', 'Quantum University'].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Profile strength */}
        <div className="w-full max-w-xs rounded-2xl bg-white/10 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Profile strength</span>
            <span className="font-extrabold">65%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[65%] rounded-full bg-sun transition-all duration-500" />
          </div>
          <p className="mt-2 text-xs text-indigo-100">
            Add 2 more skills and one more project to reach All-Star.
          </p>
          <Link
            to="/profile"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            <GradCapIcon className="h-4 w-4" />
            Complete your profile
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
