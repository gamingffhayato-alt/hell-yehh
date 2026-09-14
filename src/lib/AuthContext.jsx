import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function FullScreenLoader({ label }) {
  return (
    <div className="grid min-h-screen place-items-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
        <p className="mono text-[13px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

const isProfileComplete = (profile) => Boolean(profile?.role)

export const homeForRole = (role) => {
  if (role === 'industry') return '/industry-dashboard'
  if (role === 'academician') return '/academic-dashboard'
  return '/dashboard'
}

/**
 * Central auth state machine — FIXED for focus/tab-switch unmount bug
 *
 * Previous bug: onAuthStateChange fired on window focus (SIGNED_IN / TOKEN_REFRESHED / USER_UPDATED)
 * and set status='loading', which made OnboardingRoute/ProtectedRoute show "Preparing your setup..."
 * and unmount the form, losing OTP state.
 *
 * Fix:
 * - Track hasLoadedOnceRef — FullScreenLoader ONLY on very first mount
 * - Track sessionRef/statusRef to avoid setting loading=true on subsequent events if already loaded
 * - Only set loading=true when status is 'loading' (initial) or session was null
 * - For TOKEN_REFRESHED / USER_UPDATED / SIGNED_IN after initial load, update session silently without triggering loader
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  // Refs to access latest values inside the async callback without stale closure
  const sessionRef = useRef(null)
  const statusRef = useRef('loading')
  const hasLoadedOnceRef = useRef(false)

  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setTimeout(async () => {
        const previousSession = sessionRef.current
        const previousStatus = statusRef.current

        setSession(nextSession ?? null)
        sessionRef.current = nextSession ?? null

        if (!nextSession?.user) {
          setProfile(null)
          setStatus('signedOut')
          statusRef.current = 'signedOut'
          hasLoadedOnceRef.current = true
          return
        }

        // FIX: Don't trigger loading spinner on focus events if already loaded
        // Only set loading=true on very first mount (INITIAL_SESSION) or when we were signed out
        const isInitialLoad = !hasLoadedOnceRef.current
        const wasSignedOut = previousStatus === 'signedOut' || !previousSession

        // For subsequent events like TOKEN_REFRESHED, USER_UPDATED, or SIGNED_IN from focus,
        // if we already have a session and have loaded once, DON'T set loading=true
        const shouldShowLoader = isInitialLoad || wasSignedOut || previousStatus === 'loading'

        if (shouldShowLoader) {
          setStatus('loading')
          statusRef.current = 'loading'
        }
        // If not shouldShowLoader, we keep current status (ready/needsOnboarding) to avoid unmounting form

        // Only handle profile resolution for INITIAL_SESSION and SIGNED_IN
        // For TOKEN_REFRESHED / USER_UPDATED, we already updated session above and can return early
        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') {
          // Silent session refresh — don't touch profile or status, don't navigate
          // This prevents "Preparing your setup..." on tab switch
          return
        }

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
          console.error('profiles query crashed:', e)
          if (shouldShowLoader) {
            setStatus('signedOut')
            statusRef.current = 'signedOut'
          }
          hasLoadedOnceRef.current = true
          return
        }

        const md = nextSession.user.user_metadata || {}
        if (!resolvedProfile && md?.source === 'email_signup') {
          const record = {
            id: nextSession.user.id,
            email: nextSession.user.email,
            full_name: md.full_name || null,
            role: md.role || 'student',
            marketing_source: md.marketing_source || null,
            class_year: md.class_year || null,
            course: md.course || null,
            stream: md.stream || null,
            institution: md.institution || null,
            company_name: md.company_name || null,
            job_title: md.job_title || null,
          }
          const { error: upsertError } = await supabase.from('profiles').upsert([record])
          if (upsertError) {
            console.error('profile creation from signup metadata failed:', upsertError.message)
          } else {
            resolvedProfile = record
          }
        }

        if (!resolvedProfile && event === 'SIGNED_IN') {
          const oauthRole = sessionStorage.getItem('oauth_role')
          if (sessionStorage.getItem('auth_intent') !== 'login' && ['student', 'industry', 'academician'].includes(oauthRole)) {
            const record = {
              id: nextSession.user.id,
              email: nextSession.user.email,
              full_name: md.full_name ?? md.name ?? null,
              role: oauthRole,
            }
            const { error: upsertError } = await supabase.from('profiles').upsert([record])
            if (upsertError) {
              console.error('OAuth role profile creation failed:', upsertError.message)
            } else {
              resolvedProfile = record
            }
          }
        }
        sessionStorage.removeItem('oauth_role')

        const complete = isProfileComplete(resolvedProfile)
        setProfile(resolvedProfile)

        if (event === 'SIGNED_IN') {
          const intent = sessionStorage.getItem('auth_intent')
          sessionStorage.removeItem('auth_intent')

          if (intent === 'login' && !complete) {
            await supabase.auth.signOut()
            setProfile(null)
            setStatus('signedOut')
            statusRef.current = 'signedOut'
            hasLoadedOnceRef.current = true
            navigate('/login', {
              replace: true,
              state: { error: 'Please sign up first — no Intern X account exists for this Google user.' },
            })
            return
          }

          if (complete) {
            setStatus('ready')
            statusRef.current = 'ready'
            hasLoadedOnceRef.current = true
            // Only navigate if this was a fresh sign-in (was signed out), not a focus event
            if (wasSignedOut || isInitialLoad) {
              navigate(homeForRole(resolvedProfile?.role), { replace: true })
            }
          } else {
            setStatus('needsOnboarding')
            statusRef.current = 'needsOnboarding'
            hasLoadedOnceRef.current = true
            if (wasSignedOut || isInitialLoad) {
              navigate('/details', { replace: true })
            }
          }
          return
        }

        // INITIAL_SESSION
        const nextStatus = complete ? 'ready' : 'needsOnboarding'
        setStatus(nextStatus)
        statusRef.current = nextStatus
        hasLoadedOnceRef.current = true
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
