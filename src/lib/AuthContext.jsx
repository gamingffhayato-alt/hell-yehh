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

/**
 * FIXED: Profile completion check must be strict
 * Returns false if role is null, undefined, or empty string
 * This guarantees status becomes 'needsOnboarding' and routes to /details
 */
const isProfileComplete = (profile) => {
  const role = profile?.role
  if (role === null || role === undefined) return false
  if (typeof role === 'string' && role.trim() === '') return false
  return Boolean(role)
}

export const homeForRole = (role) => {
  if (role === 'industry') return '/industry-dashboard'
  if (role === 'academician') return '/academic-dashboard'
  return '/dashboard'
}

/**
 * AuthProvider — fixed default role bug
 *
 * Root cause: When user signed up via email/password, context immediately upserted
 * profile with role: md.role || 'student'. Since routing considers profile complete
 * if role exists, app instantly routed to /dashboard and skipped /details wizard.
 *
 * Fix:
 * - Change role assignment to default to null instead of 'student'
 * - isProfileComplete strictly false for null/undefined/''
 * - Status becomes 'needsOnboarding' → routes to /details
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

  const completeUserProfile = useCallback(
    async (newProfileData = null) => {
      if (newProfileData) {
        setProfile(newProfileData)
      }
      setStatus('ready')
      statusRef.current = 'ready'
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
          // FIXED: Default role to null instead of 'student' to prevent premature completion
          // Previously: role: md.role || 'student' → instantly considered complete → skipped /details
          // Now: role: md.role || null → isProfileComplete() returns false → needsOnboarding → /details
          const record = {
            id: nextSession.user.id,
            email: nextSession.user.email,
            full_name: md.full_name || null,
            role: md.role || null,
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

        // INITIAL_SESSION — now correctly evaluates to needsOnboarding when role is null
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
