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
 * Optimized AuthProvider — fixes login lag & tab-switch reset
 *
 * Performance fixes:
 * - Single source of truth with refs to avoid stale closures & extra re-renders
 * - hasLoadedOnceRef ensures FullScreenLoader ONLY on very first mount
 * - TOKEN_REFRESHED / USER_UPDATED from tab focus are handled silently (no loading, no navigation)
 * - All navigate calls use { replace: true } to avoid history buildup & freeze
 * - Profile query only on INITIAL_SESSION and SIGNED_IN, not on focus events
 * - State batching: setSession + setProfile + setStatus in same tick where possible
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  const sessionRef = useRef(null)
  const statusRef = useRef('loading')
  const hasLoadedOnceRef = useRef(false)

  // Keep refs in sync without triggering re-renders
  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Stable navigation helper with replace:true to prevent history bloat (fixes lag)
  const navigateReplace = useCallback(
    (to, opts = {}) => {
      navigate(to, { replace: true, ...opts })
    },
    [navigate]
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Use queueMicrotask-like setTimeout 0 to avoid Supabase deadlock, but keep it minimal
      setTimeout(async () => {
        const previousSession = sessionRef.current
        const previousStatus = statusRef.current

        // Batch session update immediately — snappy UI, no waiting for profile query
        setSession(nextSession ?? null)
        sessionRef.current = nextSession ?? null

        if (!nextSession?.user) {
          // Signed out — single batched update
          setProfile(null)
          setStatus('signedOut')
          statusRef.current = 'signedOut'
          hasLoadedOnceRef.current = true
          return
        }

        const isInitialLoad = !hasLoadedOnceRef.current
        const wasSignedOut = previousStatus === 'signedOut' || !previousSession
        const shouldShowLoader = isInitialLoad || wasSignedOut || previousStatus === 'loading'

        // Only show loader on first mount or fresh sign-in — prevents "Preparing your setup..." on tab switch
        if (shouldShowLoader) {
          setStatus('loading')
          statusRef.current = 'loading'
        }

        // Silent handling for focus events — prevents unmounting forms and OTP loss
        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') {
          return
        }

        // Profile resolution — only on real auth events, not focus
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

        // Batch profile + status together for fewer re-renders
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

        // INITIAL_SESSION
        const nextStatus = complete ? 'ready' : 'needsOnboarding'
        setStatus(nextStatus)
        statusRef.current = nextStatus
        hasLoadedOnceRef.current = true
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [navigateReplace])

  return (
    <AuthContext.Provider value={{ session, profile, status, setProfile, setStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
