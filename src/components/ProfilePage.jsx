import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import {
  BookIcon,
  BuildingIcon,
  GradCapIcon,
  MailIcon,
  SparklesIcon,
  UsersIcon,
} from './Icons'

const CLASS_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const COURSES = ['B.Tech', 'BCA', 'BBA', 'B.Sc', 'M.Tech', 'MCA', 'MBA', 'M.Sc']
const STREAMS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Data Science',
  'Artificial Intelligence & ML',
]

const inputClass =
  'block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

const ROLE_LABEL = {
  student: 'Student',
  industry: 'Industry',
  academician: 'Academician',
  institution: 'Institution',
}

function DetailCard({ Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value || 'Not set'}</p>
    </div>
  )
}

/** /profile — view + edit the logged-in user's profile (protected route). */
export default function ProfilePage() {
  const { session, profile, setProfile } = useAuth()
  const user = session?.user

  const [data, setData] = useState(profile ?? null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Edit-form state (initialized from the fetched record)
  const [form, setForm] = useState({ full_name: '', class_year: '', course: '', stream: '', institution: '' })

  // Always re-fetch fresh data from the profiles table on mount
  useEffect(() => {
    if (!user?.id) return
    let alive = true
    ;(async () => {
      const { data: row, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (!alive) return
      if (error) console.error('profile fetch failed:', error.message)
      if (row) {
        setData(row)
        setProfile(row)
        setForm({
          full_name: row.full_name ?? '',
          class_year: row.class_year ?? '',
          course: row.course ?? '',
          stream: row.stream ?? '',
          institution: row.institution ?? '',
        })
      }
      setLoading(false)
    })()
    return () => { alive = false }
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')

    const updates = {
      full_name: form.full_name.trim() || null,
      class_year: form.class_year || null,
      course: form.course.trim() || null,
      stream: form.stream.trim() || null,
      institution: form.institution.trim() || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    setSaving(false)

    if (error) {
      console.error('profile update failed:', error.message)
      setError(`Couldn't save changes: ${error.message}`)
      return
    }

    const next = { ...data, ...updates }
    setData(next)
    setProfile(next)
    setEditing(false)
  }

  const name =
    data?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'there'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = (name[0] || 'U').toUpperCase()
  const memberSince = data?.created_at
    ? new Date(data.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Intern X</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="h-9 rounded-full px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="h-9 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {loading ? (
          /* Loading skeleton */
          <div className="animate-pulse space-y-6">
            <div className="h-40 rounded-3xl bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-gray-200" />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* ------------------------------ Hero card ------------------------------ */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="h-16 w-16 rounded-2xl ring-2 ring-white/30" />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-2xl font-extrabold backdrop-blur">
                      {initial}
                    </span>
                  )}
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-indigo-100">
                      <MailIcon className="h-4 w-4" />
                      {user?.email}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                      <SparklesIcon className="h-3.5 w-3.5" />
                      {ROLE_LABEL[data?.role] ?? data?.role ?? 'Member'}
                    </span>
                  </div>
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50 active:scale-[0.98]"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* --------------------------- View / Edit --------------------------- */}
            {editing ? (
              <form onSubmit={handleSave} className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Edit profile</h2>
                  <span className="text-xs text-gray-400">Changes save to your Intern X profile</span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <input
                      id="pf-name"
                      className={inputClass}
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pf-class" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Class / Year
                    </label>
                    <select
                      id="pf-class"
                      className={inputClass}
                      value={form.class_year}
                      onChange={(e) => setForm({ ...form, class_year: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select your year</option>
                      {CLASS_YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pf-course" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <input
                      id="pf-course"
                      list="pf-course-options"
                      className={inputClass}
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                      placeholder="e.g. B.Tech"
                      required
                    />
                    <datalist id="pf-course-options">
                      {COURSES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label htmlFor="pf-stream" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Stream
                    </label>
                    <input
                      id="pf-stream"
                      list="pf-stream-options"
                      className={inputClass}
                      value={form.stream}
                      onChange={(e) => setForm({ ...form, stream: e.target.value })}
                      placeholder="e.g. Computer Science and Engineering"
                      required
                    />
                    <datalist id="pf-stream-options">
                      {STREAMS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="pf-institution" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Institution
                    </label>
                    <input
                      id="pf-institution"
                      className={inputClass}
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                      placeholder="e.g. Quantum University"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {saving && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setError('') }}
                    className="h-11 rounded-xl border border-gray-300 px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Detail cards */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailCard Icon={BuildingIcon} label="Institution" value={data?.institution} />
                  <DetailCard Icon={BookIcon} label="Course" value={data?.course} />
                  <DetailCard Icon={GradCapIcon} label="Stream" value={data?.stream} />
                  <DetailCard Icon={UsersIcon} label="Class / Year" value={data?.class_year} />
                </div>

                <p className="mt-6 text-xs text-gray-400">
                  {memberSince && <>Member since {memberSince} · </>}
                  Signed in as {user?.email}
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
