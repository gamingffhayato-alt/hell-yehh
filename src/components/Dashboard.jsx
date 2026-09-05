import { supabase } from '../lib/supabase'
import {
  BellIcon,
  BookIcon,
  BriefcaseIcon,
  ChartBarIcon,
  GradCapIcon,
  SparklesIcon,
} from './Icons'

const ROLE_META = {
  student: { label: 'Student', chip: 'bg-indigo-50 text-indigo-700' },
  industry: { label: 'Industry', chip: 'bg-amber-50 text-amber-700' },
  academician: { label: 'Academician', chip: 'bg-emerald-50 text-emerald-700' },
  institution: { label: 'Institution', chip: 'bg-sky-50 text-sky-700' },
}

const CARDS = [
  {
    Icon: BriefcaseIcon,
    tile: 'bg-indigo-50 text-indigo-600',
    title: 'Recommended for you',
    text: 'Jobs and internships matched to your skills will appear here.',
  },
  {
    Icon: ChartBarIcon,
    tile: 'bg-emerald-50 text-emerald-600',
    title: 'Application tracker',
    text: 'Every application, interview and offer — tracked in one timeline.',
  },
  {
    Icon: BookIcon,
    tile: 'bg-violet-50 text-violet-600',
    title: 'Your courses',
    text: 'Upskill with curated courses picked for your role.',
  },
]

/** Simple post-login home. Real content plugs in here later. */
export default function Dashboard({ user, role }) {
  const meta = ROLE_META[role] ?? { label: role, chip: 'bg-gray-100 text-gray-700' }
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = (name[0] || 'U').toUpperCase()

  const signOut = () => supabase.auth.signOut()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">EduBridge</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-9 w-9 rounded-full ring-2 ring-white" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {initial}
              </span>
            )}
            <button
              onClick={signOut}
              className="h-9 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Welcome banner */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-10">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="relative">
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur`}>
              <SparklesIcon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {name} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
              Your profile is set up. Matched opportunities land here as they go
              live — you&apos;re signed in as {user?.email}.
            </p>
          </div>
        </div>

        {/* Placeholder content cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CARDS.map(({ Icon, tile, title, text }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${tile}`}>
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-sm font-semibold text-gray-900">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{text}</p>
              <p className="mt-4 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
