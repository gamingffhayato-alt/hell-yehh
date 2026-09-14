import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
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
 * Optimized AuthProvider — fixes login lag, tab-switch reset, and onboarding redirect loop
 *
 * - hasLoadedOnceRef ensures FullScreenLoader ONLY on first mount
 * - TOKEN_REFRESHED / USER_UPDATED handled silently (no loading, no nav)
 * - navigateReplace uses { replace: true } to avoid history bloat
 * - completeUserProfile() syncs global state BEFORE navigate, so ProtectedRoute doesn't bounce back
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  const sessionRef = useRef(null)
  const statusRef = useRef('loading')
  const hasLoadedOnceRef = useRef(false)

  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(() => {
    statusRef.current = status
  }, [status])

  const navigateReplace = useCallback(
    (to, opts = {}) => {
      navigate(to, { replace: true, ...opts })
    },
    [navigate]
  )

  // Critical fix for onboarding redirect loop: mark profile as complete in global context FIRST
  // Dashboard is protected and checks profileCompleted / status === 'ready' — must update before navigate
  const completeUserProfile = useCallback(
    async (newProfileData = null) => {
      // If caller passes full profile, use it; otherwise keep existing and just mark ready
      if (newProfileData) {
        setProfile(newProfileData)
        sessionRef.current = sessionRef.current // keep session
      }
      setStatus('ready')
      statusRef.current = 'ready'
      // Small tick to let React batch update before navigation
      await new Promise((r) => setTimeout(r, 0))
    },
    []
  )

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

        const isInitialLoad = !hasLoadedOnceRef.current
        const wasSignedOut = previousStatus === 'signedOut' || !previousSession
        const shouldShowLoader = isInitialLoad || wasSignedOut || previousStatus === 'loading'

        if (shouldShowLoader) {
          setStatus('loading')
          statusRef.current = 'loading'
        }

        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') {
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
          }
          const { error: upsertError } = await supabase.from('profiles').upsert([record])
          if (!upsertError) resolvedProfile = record
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
            if (!upsertError) resolvedProfile = record
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
            navigateReplace('/login', {
              state: { error: 'Please sign up first — no Intern X account exists for this Google user.' },
            })
            return
          }

          if (complete) {
            setStatus('ready')
            statusRef.current = 'ready'
            hasLoadedOnceRef.current = true
            if (wasSignedOut || isInitialLoad) {
              navigateReplace(homeForRole(resolvedProfile?.role))
            }
          } else {
            setStatus('needsOnboarding')
            statusRef.current = 'needsOnboarding'
            hasLoadedOnceRef.current = true
            if (wasSignedOut || isInitialLoad) {
              navigateReplace('/details')
            }
          }
          return
        }

        const nextStatus = complete ? 'ready' : 'needsOnboarding'
        setStatus(nextStatus)
        statusRef.current = nextStatus
        hasLoadedOnceRef.current = true
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [navigateReplace])

  return (
    <AuthContext.Provider value={{ session, profile, status, setProfile, setStatus, completeUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
