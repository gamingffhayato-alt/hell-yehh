import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import RoleSelect from './RoleSelect'
import { GradCapIcon } from './Icons'

/**
 * /details — onboarding page for brand-new users after first sign-up.
 * Only reachable while authenticated with an incomplete profile.
 * Saving upserts the profiles row (role is required) and releases the
 * user to /dashboard.
 */
export default function DetailsPage() {
  const { session, setProfile, setStatus } = useAuth()
  const navigate = useNavigate()
  const user = session?.user

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '')
  const [role, setRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!role || saving || !user) return
    setSaving(true)
    setError('')

    const record = {
      id: user.id,
      email: user.email,
      full_name: fullName.trim() || null,
      role,
    }

    const { error } = await supabase.from('profiles').upsert([record])
    setSaving(false)

    if (error) {
      console.error('Saving profile failed:', error.message)
      setError(`Couldn't save your details: ${error.message}`)
      return
    }

    // Update the auth context → ProtectedRoute now lets /dashboard render.
    setProfile(record)
    setStatus('ready')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-white px-4 py-10">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <GradCapIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">EduBridge</span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8">
          {/* Header */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Step 1 of 1 · Profile details
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              Complete your setup
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Tell us a little about yourself so we can tailor your dashboard.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Full name (pre-filled from Google when available) */}
            <div>
              <label htmlFor="full-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="e.g. Ananya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Role selector (required) */}
            <RoleSelect value={role} onChange={setRole} />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={!role || saving}
              className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save & continue'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Signed in as {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
