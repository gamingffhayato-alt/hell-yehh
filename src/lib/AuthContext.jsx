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

/** Role-aware home route — each built portal gets its own dashboard. */
export const homeForRole = (role) => {
  if (role === 'industry') return '/industry-dashboard'
  if (role === 'academician') return '/academic-dashboard'
  return '/dashboard'
}

/**
 * Central auth state machine.
 *
 * status:
 *   'loading'         – checking session / profiles table
 *   'signedOut'       – no session
 *   'needsOnboarding' – signed in, but no completed profile (must see /details)
 *   'ready'           – signed in + completed profile (allowed in app)
 *
 * PERSISTENCE: status starts as 'loading' on every mount. The provider only
 * renders decisions AFTER supabase (persistSession) replays the stored
 * session and fires INITIAL_SESSION/SIGNED_IN — so protected routes never
 * flash-redirect to /login on a refresh while the stored session exists.
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

        /* ---------------------------- Signed in ------------------------------- */
        setStatus('loading')

        let resolvedProfile = null
        try {
          const { data: prof, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', nextSession.user.id)
            .maybeSingle()
          if (error) console.error('profiles query failed:', error.message)
          resolvedProfile = prof
        } catch (e) {
          // Network hiccup on refresh → never leave the app stuck on "loading".
          console.error('profiles query crashed:', e)
          setStatus('signedOut')
          return
        }

        /* Email sign-up users carry their registration details in auth
           metadata (source: 'email_signup'). If the profiles row doesn't exist
           yet (e.g. first login after email confirmation — inserts are blocked
           pre-session by RLS), materialize it here as soon as a session exists. */
        const md = nextSession.user.user_metadata || {}
        if (!resolvedProfile && md?.source === 'email_signup') {
          const record = {
            id: nextSession.user.id,
            email: nextSession.user.email,
            full_name: md.full_name || null,
            // Role chosen on step 1 of the sign-up wizard ('student' |
            // 'industry'); older accounts without it fall back to student.
            role: md.role || 'student',
            marketing_source: md.marketing_source || null,
            // Student academic details (null for industry partners)
            class_year: md.class_year || null,
            course: md.course || null,
            stream: md.stream || null,
            institution: md.institution || null,
            // Industry partner details (null for students)
            company_name: md.company_name || null,
            job_title: md.job_title || null,
          }
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert([record])
          if (upsertError) {
            console.error('profile creation from signup metadata failed:', upsertError.message)
          } else {
            resolvedProfile = record
          }
        }

        const complete = isProfileComplete(resolvedProfile)
        setProfile(resolvedProfile)

        if (event === 'SIGNED_IN') {
          /* A fresh sign-in. Enforce Login vs Sign-Up intent (Google flow stashes
             it in sessionStorage before the OAuth redirect). */
          const intent = sessionStorage.getItem('auth_intent')
          sessionStorage.removeItem('auth_intent')

          if (intent === 'login' && !complete) {
            // Brand-new user tried to LOG IN → block and force sign-out so they
            // can never slip through as an unregistered logged-in user.
            await supabase.auth.signOut()
            setProfile(null)
            setStatus('signedOut')
            navigate('/login', {
              replace: true,
              state: {
                error:
                  'Please sign up first — no Intern X account exists for this Google user.',
              },
            })
            return
          }

          if (complete) {
            setStatus('ready')
            // Dynamic redirect by role — applies both to a just-created
            // account and to every returning login: industry partners →
            // /industry-dashboard, students (and everyone else) → /dashboard.
            navigate(homeForRole(resolvedProfile?.role), { replace: true })
          } else {
            // First-time sign-up (Google) → finish onboarding on /details.
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
