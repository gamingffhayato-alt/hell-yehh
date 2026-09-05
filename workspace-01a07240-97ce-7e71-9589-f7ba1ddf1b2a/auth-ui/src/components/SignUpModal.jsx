import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PasswordInput from './PasswordInput'
import { CheckIcon, GradCapIcon, XIcon } from './Icons'

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

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

/**
 * Full registration modal (Supabase signUp).
 * Academic details travel in signup metadata; AuthContext writes them into
 * the profiles table as soon as a session exists (covers email-confirmation
 * flows where no session exists at signup time).
 */
export default function SignUpModal({ onClose }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [classYear, setClassYear] = useState('')
  const [course, setCourse] = useState('')
  const [stream, setStream] = useState('')
  const [institution, setInstitution] = useState('Quantum University') // default suggestion

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)

  // Lock page scroll + close on Escape while the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          source: 'email_signup', // marker AuthContext uses to build the profile
          full_name: fullName.trim(),
          class_year: classYear,
          course: course.trim(),
          stream: stream.trim(),
          institution: institution.trim(),
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(
        /already registered|already been registered/i.test(error.message)
          ? 'This email is already registered — try logging in instead.'
          : error.message,
      )
      return
    }

    if (data?.session) {
      // Email confirmation OFF → signed in immediately. AuthContext creates
      // the profile from metadata and routes to /profile.
      onClose()
      return
    }

    // Email confirmation ON → ask the user to verify, then log in.
    setConfirmSent(true)
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Create an account">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel: full-screen sheet on mobile, centered card on desktop */}
      <div className="relative mx-auto w-full sm:my-10 sm:max-w-2xl sm:px-4">
        <div className="animate-fade-up min-h-screen bg-white p-6 shadow-2xl sm:min-h-0 sm:rounded-3xl sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
                <GradCapIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  Create your account
                </h2>
                <p className="text-sm text-gray-500">
                  Free for candidates — takes under a minute.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {confirmSent ? (
            /* ------------------------- Email confirmation ------------------------- */
            <div className="py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">Check your inbox</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                We&apos;ve sent a confirmation link to{' '}
                <span className="font-semibold text-gray-800">{email}</span>. Verify your
                email, then come back and log in — your profile will be set up
                automatically.
              </p>
              <button
                onClick={onClose}
                className="mt-6 h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Back to log in
              </button>
            </div>
          ) : (
            /* ------------------------------ Form ------------------------------ */
            <form onSubmit={handleSignUp} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <input
                    id="su-name"
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                {/* Class / Year */}
                <div>
                  <Label htmlFor="su-class">Class / Year</Label>
                  <select
                    id="su-class"
                    required
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    className={`${inputClass} ${classYear ? '' : 'text-gray-400'}`}
                  >
                    <option value="" disabled>
                      Select your year
                    </option>
                    {CLASS_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <Label htmlFor="su-email">Email address</Label>
                  <input
                    id="su-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <PasswordInput
                    id="su-password"
                    name="su-password"
                    placeholder="Create a password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {/* Course */}
                <div>
                  <Label htmlFor="su-course">Course</Label>
                  <input
                    id="su-course"
                    list="course-options"
                    required
                    placeholder="e.g. B.Tech"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="course-options">
                    {COURSES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                {/* Stream */}
                <div>
                  <Label htmlFor="su-stream">Stream</Label>
                  <input
                    id="su-stream"
                    list="stream-options"
                    required
                    placeholder="e.g. Computer Science and Engineering"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="stream-options">
                    {STREAMS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                {/* Institution (default suggestion: Quantum University) */}
                <div className="sm:col-span-2">
                  <Label htmlFor="su-institution">Institution</Label>
                  <input
                    id="su-institution"
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Quantum University is set as the suggested default — change it if you
                    study elsewhere.
                  </p>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? 'Creating your account…' : 'Create account'}
              </button>

              <p className="text-center text-xs leading-relaxed text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms</a>{' '}
                and{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
