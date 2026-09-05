import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function FullScreenLoader({ label }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

/** A profile counts as "account exists + onboarding done" only when it has a role. */
const isProfileComplete = (profile) => Boolean(profile?.role)

/**
 * Central auth state machine.
 *
 * status:
 *   'loading'         – checking session / profiles table
 *   'signedOut'       – no session
 *   'needsOnboarding' – signed in, but no completed profile (must see /details)
 *   'ready'           – signed in + completed profile (allowed in app)
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Deferred: DB calls inside the listener can re-enter supabase-js's auth lock.
      setTimeout(async () => {
        setSession(nextSession ?? null)

        /* ------------------------------ Signed out ------------------------------ */
        if (!nextSession?.user) {
          setProfile(null)
          setStatus('signedOut')
          return
        }

        /* Token refreshes / user updates: refresh the session object only —
           never re-run routing so the user isn't yanked mid-session. */
        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') return

        /* ---------------------------- Signed in ------------------------------ */
        setStatus('loading')
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', nextSession.user.id)
          .maybeSingle()

        if (error) console.error('profiles query failed:', error.message)

        const complete = isProfileComplete(prof)
        setProfile(prof)

        if (event === 'SIGNED_IN') {
          /* A fresh sign-in (e.g. Google OAuth bounce). Enforce Login vs
             Sign-Up intent, which was stashed before leaving for Google. */
          const intent = sessionStorage.getItem('auth_intent')
          sessionStorage.removeItem('auth_intent')

          if (intent === 'login' && !complete) {
            // Brand-new user tried to LOG IN → block and force sign-out so they
            // can never slip through as an unregistered logged-in user.
            // (Profiles-table check is used rather than user.created_at, which
            // is unreliable — a new user could also legitimately re-login soon.)
            await supabase.auth.signOut()
            setProfile(null)
            setStatus('signedOut')
            navigate('/login', {
              replace: true,
              state: {
                error:
                  'Please sign up first — no EduBridge account exists for this Google user.',
              },
            })
            return
          }

          if (complete) {
            // Returning user → straight to the dashboard.
            setStatus('ready')
            navigate('/dashboard', { replace: true })
          } else {
            // First-time sign-up → finish onboarding on /details.
            setStatus('needsOnboarding')
            navigate('/details', { replace: true })
          }
          return
        }

        // INITIAL_SESSION (page refresh with stored session) → reflect only.
        setStatus(complete ? 'ready' : 'needsOnboarding')
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <AuthContext.Provider value={{ session, profile, status, setProfile, setStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
