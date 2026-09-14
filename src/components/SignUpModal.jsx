import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PasswordInput from './PasswordInput'
import GoogleButton from './GoogleButton'
import Divider from './Divider'
import { XIcon, CheckIcon, GradCapIcon } from './Icons'

const inputClass =
  'block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-gray-200 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:ring-slate-800 dark:focus:border-white dark:focus:ring-white/20'

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
      {children}
    </label>
  )
}

/**
 * Refactored SignUpModal — Step 1: Credentials Only
 * - Google button
 * - Divider
 * - Email + Password
 * - Create Account
 * After success, user is routed to /details (via AuthContext needsOnboarding)
 * Google OAuth sets signup intent and forces onboarding.
 */
export default function SignUpModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)

  // Lock scroll + Escape
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleGoogleSignUp = async () => {
    // Critical: Google sign-ups MUST go to DetailsPage to complete profile
    sessionStorage.setItem('auth_intent', 'signup')
    sessionStorage.removeItem('oauth_role')
    onClose()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) console.error('Google sign-up error:', error.message)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!email.trim() || password.length < 8) {
      setError('Please enter a valid email and a password with at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          source: 'email_signup',
          // No role yet — will be collected in DetailsPage, so profile stays incomplete and forces /details
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
      // Immediate sign-in (email confirmation OFF) — AuthContext will see incomplete profile and route to /details
      onClose()
      return
    }

    // Email confirmation ON
    setConfirmSent(true)
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Create an account">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        .mono { font-family: "Geist Mono", ui-monospace, monospace; }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70" onClick={onClose} />

      {/* Panel */}
      <div className="relative mx-auto flex min-h-screen w-full items-center justify-center p-4 sm:my-10 sm:min-h-0 sm:max-w-[440px] sm:p-0">
        <div className="relative w-full overflow-hidden rounded-[24px] bg-white p-[1px] shadow-2xl ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent dark:from-indigo-500/15" />
          <div className="relative rounded-[23px] bg-white p-7 dark:bg-slate-900 sm:p-8">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[50px] dark:bg-indigo-500/15" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                  <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
                </span>
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">Create your account</h2>
                  <p className="mt-0.5 text-[12.5px] leading-4 tracking-[-0.01em] text-slate-500 dark:text-slate-400">Free for candidates — takes under a minute.</p>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {confirmSent ? (
              <div className="relative py-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Check your inbox</h3>
                <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
                  We’ve sent a confirmation link to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>. Verify your email, then log in — you’ll be taken to complete your profile.
                </p>
                <button onClick={onClose} className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-6 text-[13px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100">
                  Back to log in
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="relative mt-7 space-y-5">
                <GoogleButton onClick={handleGoogleSignUp} />
                <Divider>or continue with email</Divider>

                <div>
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

                <PasswordInput
                  id="su-password"
                  name="su-password"
                  label="Password"
                  placeholder="Create a password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />

                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 tracking-[-0.01em] text-red-700 ring-1 ring-red-200 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[13.5px] font-semibold tracking-[-0.01em] text-white shadow-sm ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
                >
                  {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />}
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>

                <p className="text-center text-[11px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">
                  By creating an account, you agree to our <span className="font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-300">Terms</span> and{' '}
                  <span className="font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-300">Privacy Policy</span>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
