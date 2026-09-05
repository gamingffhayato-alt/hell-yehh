import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, ShieldIcon, XIcon } from '../Icons'

/** Session flag for the demo admin area — deliberately NOT Supabase auth. */
export const ADMIN_FLAG = 'ix_admin'

/**
 * /admin-login — a standalone, low-friction back door for hackathon demos.
 * Completely separate from the Supabase flow: hardcoded check only.
 *
 *   username: johny
 *   password: saksham@27
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Already inside the admin session → skip the form.
  if (sessionStorage.getItem(ADMIN_FLAG) === 'granted') {
    return <Navigate to="/admin-dashboard" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'johny' && password === 'saksham@27') {
      sessionStorage.setItem(ADMIN_FLAG, 'granted')
      navigate('/admin-dashboard', { replace: true })
      return
    }
    setError('Credentials invalid')
  }

  const inputClass =
    'block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-rose-500/60 focus:outline-none focus:ring-2 focus:ring-rose-500/25'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Subtle blueprint grid + rose glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-40 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 hover:text-white"
      >
        ← Back to site
      </Link>

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl bg-slate-900/80 p-7 shadow-2xl ring-1 ring-white/10 backdrop-blur sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/50">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Intern X <span className="text-rose-400">Admin</span>
              </h1>
              <p className="text-xs text-slate-400">
                Restricted access · authorized personnel only
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300"
            >
              <XIcon className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-user" className="mb-1.5 block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="admin-user"
                type="text"
                required
                autoComplete="off"
                placeholder="Admin username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 transition hover:text-slate-300"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-rose-600 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-500 active:scale-[0.99]"
            >
              Enter control portal
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
            This area is outside the standard sign-in system and is monitored.
            Failed attempts are logged for audit.
          </p>
        </div>
      </div>
    </div>
  )
}
