import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PasswordInput from './PasswordInput'
import SignUpModal from './SignUpModal'
import GoogleButton from './GoogleButton'
import Divider from './Divider'

function ArrowLeft(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10 16L4 10l6-6M4 10h12" />
    </svg>
  )
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const routeError = location.state?.error
  const [signupOpen, setSignupOpen] = useState(Boolean(location.state?.openSignup))

  const handleGoogleLogin = useCallback(async () => {
    sessionStorage.setItem('auth_intent', 'login')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) console.error('Google sign-in error:', error.message)
  }, [])

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault()
      if (loading) return
      setError('')
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setLoading(false)
        setError(
          error.message?.toLowerCase().includes('invalid login credentials')
            ? 'Incorrect email or password. New here? Create an account from the link below.'
            : error.message
        )
        return
      }

      // Performance fix: immediate redirect with replace:true — no history buildup, snappy UX
      // AuthContext will still resolve profile and role-based redirect, but user sees instant feedback
      navigate('/dashboard', { replace: true })
      // Keep loading true until AuthContext takes over to avoid flicker
    },
    [email, password, loading, navigate]
  )

  const shownError = error || routeError

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10 text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Localized glows — premium Vercel/Linear vibe */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-slate-700 shadow-sm ring-1 ring-gray-200 backdrop-blur transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="relative w-full max-w-[400px]">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
              <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Intern X</span>
          </Link>
          <div className="mono mt-3 text-[11px] tracking-[0.04em] text-slate-400 dark:text-slate-500">UNIFIED PLACEMENT PORTAL</div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-1.5 text-[13.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">Log in to your Intern X account.</p>

          {shownError && (
            <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 tracking-[-0.01em] text-red-700 ring-1 ring-red-200 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
              <p>{shownError}</p>
            </div>
          )}

          <div className="mt-6">
            <GoogleButton onClick={handleGoogleLogin} />
          </div>

          <Divider>or continue with email</Divider>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-gray-200 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:ring-slate-800 dark:focus:border-white dark:focus:ring-white/20"
              />
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
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[13.5px] font-semibold tracking-[-0.01em] text-white shadow-sm ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />}
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13.5px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">
          New to Intern X?{' '}
          <button onClick={() => setSignupOpen(true)} className="font-semibold tracking-[-0.01em] text-slate-900 underline-offset-4 transition hover:underline dark:text-white">
            Create an Account
          </button>
        </p>

        <p className="mono mt-4 text-center text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500">Built for Smart India Hackathon • 100% verified</p>
      </div>

      {signupOpen && <SignUpModal onClose={() => setSignupOpen(false)} />}
    </div>
  )
}
