import { useState } from 'react'
import { supabase } from '../lib/supabase'
import GoogleButton from './GoogleButton'
import PasswordInput from './PasswordInput'
import RoleSelect from './RoleSelect'
import {
  MailIcon,
  GradCapIcon,
  SparklesIcon,
  UsersIcon,
  ShieldIcon,
} from './Icons'

/* ---------------------------------- Shared ---------------------------------- */

function EmailField({ value, onChange, autoComplete = 'email' }) {
  return (
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
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        or continue with email
      </span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  )
}

/* --------------------------------- Login view -------------------------------- */

function LoginForm({ onGoogle }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Email/password login is still a UI demo — Google OAuth is the live path.
    console.log('Login submitted:', { email, password, remember })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <GoogleButton onClick={onGoogle} />
      <Divider />

      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        labelAction={
          <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        }
      />

      <label className="flex items-center gap-2.5 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
        Remember me for 30 days
      </label>

      <SubmitButton>Log in</SubmitButton>
    </form>
  )
}

/* -------------------------------- Sign-up view ------------------------------- */

function SignupForm({ onGoogle }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Email/password sign-up is still a UI demo — Google OAuth is the live path.
    console.log('Sign-up submitted:', { email, password, role })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <GoogleButton onClick={onGoogle} />
      <Divider />

      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />

      <PasswordInput
        id="new-password"
        name="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (min. 8 characters)"
        autoComplete="new-password"
      />

      {/* User Role: Student / Industry / Academician / Institution */}
      <RoleSelect value={role} onChange={setRole} />

      <SubmitButton>Create account</SubmitButton>

      <p className="text-center text-xs leading-relaxed text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}

/* ------------------------------- Brand side panel ---------------------------- */

function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex">
      {/* Decorative dotted pattern + glows */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
          <GradCapIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">EduBridge</span>
      </div>

      {/* Pitch */}
      <div className="relative max-w-md">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Where students, educators and industry connect.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-indigo-100/90">
          One account for learning, mentoring, hiring and collaboration across
          campuses and companies.
        </p>

        <ul className="mt-10 space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200" />
            <span>Role-based experience for Students, Industry, Academicians and Institutions</span>
          </li>
          <li className="flex items-start gap-3">
            <UsersIcon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200" />
            <span>Build a network that spans academia and industry</span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200" />
            <span>Secure by default — your data stays yours</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between text-xs text-indigo-200/80">
        <span>© 2026 EduBridge. All rights reserved.</span>
        <span className="flex gap-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </aside>
  )
}

/* ----------------------------------- Page ----------------------------------- */

export default function AuthPage({ initialView = 'login' }) {
  const [view, setView] = useState(initialView) // 'login' | 'signup'
  const isLogin = view === 'login'

  /** Live Google OAuth via Supabase. */
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) console.error('Google sign-in error:', error.message)
  }

  return (
    <div className="grid min-h-screen bg-gray-50 lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        {/* Soft background glows (decor only) */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Compact brand header — visible on mobile/tablet only */}
          <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900">EduBridge</span>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8">
            {/* Login / Sign-Up switch */}
            <div
              className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-medium"
              role="tablist"
              aria-label="Choose login or sign up"
            >
              {[
                { id: 'login', label: 'Log in' },
                { id: 'signup', label: 'Sign up' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={view === tab.id}
                  onClick={() => setView(tab.id)}
                  className={`h-9 rounded-lg transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                    view === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-6 mt-7 text-center sm:text-left">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                {isLogin
                  ? 'Sign in to continue to EduBridge.'
                  : 'Pick your role and get started in seconds.'}
              </p>
            </div>

            {/* Form (re-keyed so it animates on view switch) */}
            <div key={view} className="animate-fade-up">
              {isLogin
                ? <LoginForm onGoogle={handleGoogleLogin} />
                : <SignupForm onGoogle={handleGoogleLogin} />}
            </div>
          </div>

          {/* Switch link under the card */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                New to EduBridge?{' '}
                <button
                  onClick={() => setView('signup')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
