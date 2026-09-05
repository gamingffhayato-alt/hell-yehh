import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Hero from './Hero'
import Toast from './Toast'
import {
  Categories,
  FeaturedJobs,
  HowItWorks,
  RoleBento,
  Testimonials,
} from './Sections'
import { CtaBanner, SiteFooter } from './Footer'

/** Exact copy requested for portals that aren't built yet. */
const COMING_SOON_PORTAL =
  'This portal is currently under construction for the hackathon. Coming soon!'
const COMING_SOON_PAGE =
  'This page is currently under construction for the hackathon. Coming soon!'

export default function LandingPage() {
  const navigate = useNavigate()

  /* ----------------------------- Auth routing -----------------------------
     "Log in" → plain login card; every "Get started / Create free account"
     CTA deep-links to /login and auto-opens the multi-step sign-up wizard. */
  const goLogin = useCallback(() => navigate('/login'), [navigate])
  const goSignup = useCallback(
    () => navigate('/login', { state: { openSignup: true } }),
    [navigate],
  )

  /* ------------------------- Coming-soon toast --------------------------- */
  const [toast, setToast] = useState(null) // { id, message } | null
  const notify = useCallback((message) => setToast({ id: Date.now(), message }), [])
  const portalSoon = useCallback(() => notify(COMING_SOON_PORTAL), [notify])
  const pageSoon = useCallback(() => notify(COMING_SOON_PAGE), [notify])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(t)
  }, [toast])

  /* ------------------- Hero search → Featured jobs filter ---------------- */
  const [search, setSearch] = useState({ q: '', location: '' })
  const handleSearch = useCallback((next) => {
    setSearch({ q: (next.q ?? '').trim(), location: (next.location ?? '').trim() })
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  const clearSearch = useCallback(() => setSearch({ q: '', location: '' }), [])

  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar onLogin={goLogin} onRegister={goSignup} />
      <main>
        <Hero onGetStarted={goSignup} onSearch={handleSearch} />
        <Categories onComingSoon={pageSoon} />
        <FeaturedJobs
          search={search}
          onClearSearch={clearSearch}
          onRegister={goSignup}
          onComingSoon={pageSoon}
        />
        <HowItWorks />
        <RoleBento onRegister={goSignup} onComingSoon={portalSoon} />
        <Testimonials />
        <CtaBanner onRegister={goSignup} onComingSoon={portalSoon} />
      </main>
      <SiteFooter onRegister={goSignup} onComingSoon={pageSoon} />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
