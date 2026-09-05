import { useState } from 'react'
import { supabase } from '../lib/supabase'
import RoleSelect from './RoleSelect'
import { GradCapIcon } from './Icons'

/**
 * Shown to authenticated users whose `profiles` row has no role yet
 * (e.g. Google OAuth users who skipped the sign-up form's role selector).
 * Navigation is paused here until a role is saved.
 */
export default function CompleteSetup({ user, onDone }) {
  const [role, setRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!role || saving) return
    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('profiles')
      .upsert([{ id: user.id, email: user.email, role }])

    setSaving(false)

    if (error) {
      console.error('Saving role failed:', error.message)
      setError(`Couldn't save your role: ${error.message}`)
      return
    }
    onDone(role) // release the user to the dashboard
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
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Complete your setup
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              One last step — tell us how you&apos;ll use EduBridge so we can
              tailor your dashboard.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <RoleSelect value={role} onChange={setRole} />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-600">
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
