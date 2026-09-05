import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import LandingPage from './components/landing/LandingPage'
import AuthPage from './components/AuthPage'
import CompleteSetup from './components/CompleteSetup'
import Dashboard from './components/Dashboard'

function FullScreenLoader({ label }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home') // 'home' | 'auth'
  const [authView, setAuthView] = useState('login') // 'login' | 'signup'

  const [initialized, setInitialized] = useState(false)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileStatus, setProfileStatus] = useState('idle') // 'idle' | 'checking' | 'needsRole' | 'ready'

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialized(true)
      setSession(session ?? null)

      if (session?.user) {
        // Signed in → check the profiles table for a role.
        setProfileStatus('checking')
        // Deferred: avoids re-entering supabase-js's auth lock inside the callback.
        setTimeout(async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle()

          if (error) console.error('profiles query failed:', error.message)

          setProfile(data ?? null)
          setProfileStatus(data?.role ? 'ready' : 'needsRole') // null/missing role → Complete Setup
        }, 0)
      } else {
        // Signed out → back to the landing page.
        setProfile(null)
        setProfileStatus('idle')
        setScreen('home')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /* ---------------------------- Auth-gated renders --------------------------- */
  if (!initialized) return <FullScreenLoader label="Loading…" />

  if (session && profileStatus === 'checking')
    return <FullScreenLoader label="Checking your profile…" />

  if (session && profileStatus === 'needsRole')
    return (
      <CompleteSetup
        user={session.user}
        onDone={(role) => {
          setProfile({ role })
          setProfileStatus('ready')
        }}
      />
    )

  if (session && profileStatus === 'ready')
    return <Dashboard user={session.user} role={profile?.role} />

  /* ------------------------------ Public pages ------------------------------ */
  const openAuth = (view) => {
    setAuthView(view)
    setScreen('auth')
    window.scrollTo(0, 0)
  }

  if (screen === 'auth') {
    return (
      <>
        <button
          onClick={() => setScreen('home')}
          className="fixed left-4 top-4 z-50 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 backdrop-blur transition hover:bg-white"
        >
          ← Back to home
        </button>
        <AuthPage key={authView} initialView={authView} />
      </>
    )
  }

  return (
    <LandingPage
      onLogin={() => openAuth('login')}
      onRegister={() => openAuth('signup')}
    />
  )
}
