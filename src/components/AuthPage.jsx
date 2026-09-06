import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PasswordInput from './PasswordInput'
import SignUpModal from './SignUpModal'
import GoogleButton from './GoogleButton'
import Divider from './Divider'
import { GradCapIcon, MailIcon } from './Icons'

/**
 * /login — minimalist login card: Email + Password + Log In only.
 * "Create an Account" opens the full registration modal (SignUpModal).
 */
export default function AuthPage() {
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Error passed back from guards (e.g. "Please sign up first"), and
  // optional auto-open of the sign-up modal (from the landing CTAs).
  const routeError = location.state?.error
  const [signupOpen, setSignupOpen] = useState(Boolean(location.state?.openSignup))

  /** Google OAuth from the LOGIN card — records a 'login' intent so a
      brand-new Google user gets the "Please sign up first" guard. Lands on
      /dashboard; AuthContext does the actual routing (or bounces new users
      back here with the guard banner). */
  const handleGoogleLogin = async () => {
    sessionStorage.setItem('auth_intent', 'login')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) console.error('Google sign-in error:', error.message)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setError(
        error.message?.toLowerCase().includes('invalid login credentials')
          ? 'Incorrect email or password. New here? Create an account from the link below.'
          : error.message,
      )
      return
    }
    // Success → AuthContext's onAuthStateChange routes to /dashboard.
  }

  const shownError = error || routeError

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-white px-4 py-10 dark:from-[#101a30] dark:via-[#0a1120] dark:to-[#070d1a]">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-40 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 backdrop-blur transition hover:bg-white"
      >
        ← Back to home
      </Link>

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <GradCapIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">Intern X</span>
        </div>

        {/* Login card — Email + Password + Log In only */}
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-gray-500">Log in to your Intern X account.</p>

          {shownError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
              <p>{shownError}</p>
            </div>
          )}

          <div className="mt-6">
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
          <Divider>or continue with email</Divider>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </div>

        {/* Create account → opens the registration modal */}
        <p className="mt-6 text-center text-sm text-gray-500">
          New to Intern X?{' '}
          <button
            onClick={() => setSignupOpen(true)}
            className="font-semibold text-indigo-600 transition hover:text-indigo-500 hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>

      {signupOpen && <SignUpModal onClose={() => setSignupOpen(false)} />}
    </div>
  )
}
